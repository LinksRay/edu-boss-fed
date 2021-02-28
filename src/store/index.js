import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用于登录成功后保存用户信息（初始值尝试读取本地存储）
    user: JSON.parse(window.localStorage.getItem('user') || null)
  },
  mutations: {
    // 存储用户数据
    setUser (state, payload) {
      // 将 payload 转换成对象存储
      state.user = JSON.parse(payload)
      // 将 payload 数据存储到本地存储中
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
