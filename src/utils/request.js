import axios from 'axios'
import store from '@/store'
// 通过局部引入方式 引入 Element 的 Message 组件功能
import { Message } from 'element-ui'
// 引入 router
import router from '@/router'
// 引入 qs 进行参数处理
import qs from 'qs'
// 创建 axios 实例
const request = axios.create({
  timeout: 2000
})

// 请求拦截器，对接口地址进行判断
request.interceptors.request.use(function (config) {
  // 判断 config.url 的前缀，来进行 baseURL 的设置
  config.baseURL = getBaseURL(config.url)

  // 统一设置 token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 存储是否正在更新 Token 的状态
let isRefreshing = false
// 存储因为等待 Token 刷新而挂起的请求
let requests = []

// 响应拦截器，对响应的状态进行判断
request.interceptors.response.use(function (response) {
  // 状态码 2xx 会执行这里
  return response
}, function (error) {
  if (error.response) {
    // 请求成功，但响应接收失败，但状态码为失败的情况
    // 1. 判断失败的状态码情况（主要处理401）
    const { status } = error.response
    let errorMsg = ''
    if (status === 400) {
      errorMsg = '请求参数错误'
    } else if (status === 401) {
      // 错误1：无 Token
      if (!store.state.user) {
        // 跳转登陆页
        redirectLogin()
        return Promise.reject(error)
      }
      // 错误2：Token 无效、过期
      // 发送请求获取新 Token

      // 检测是否存在已经正在刷新的 Token
      if (isRefreshing) {
        // 将当前失败的请求，存储到请求列表中
        return requests.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
      }
      isRefreshing = true
      //   发送请求，获取新的 access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 如果刷新 token 失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新成功
        // 存储新 token
        store.commit('setUser', res.data.content)
        // 重新发送失败的请求（根据requests中的内容）
        // error.config 是本次失败请求的配置对象
        requests.forEach((callback) => {
          return callback()
        })
        // 发送完毕清除requests
        requests = []
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为 false
        isRefreshing = false
      })
    } else if (status === 403) {
      errorMsg = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMsg = '请求资源不存在'
    } else if (status >= 500) {
      errorMsg = '服务端错误，请联系管理员'
    }
    Message.error(errorMsg)
  } else if (error.request) {
    // 请求发送，但无响应
    Message.error('请求超时！请重试！')
  } else {
    // 意料外的错误
    Message.error(error.message)
  }
  // 将本次请求的错误对象继续向后抛出，让接收响应的处理函数进行操作
  return Promise.reject(error)
})

function getBaseURL (url) {
  if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  } else {
    return 'http://edufront.lagou.com'
  }
}

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      // currentRoute 相当于 存储路由信息对象 $route
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
