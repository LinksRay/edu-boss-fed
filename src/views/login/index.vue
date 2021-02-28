<template>
  <div class="login">
    {{ $store.state.count }}
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="top">
      <el-form-item
        label="手机号"
        prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password">
        <el-input
          type="password"
          v-model="form.password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading="loading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/services/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      // 存储表单数据的对象
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 用于设置表单校验规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trriger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trriger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 登录功能
    async onSubmit () {
      try {
        // 1. 设置校验
        await this.$refs.form.validate()
        // 2. 发送请求
        this.loading = true
        const { data } = await login(this.form)
        this.loading = false
        // 3. 响应处理
        if (data.state === 1) {
          // 将用户信息存储到 Vuex中
          this.$message.success('登录成功')
          this.$store.commit('setUser', data.content)
          // 根据可能存在的 redirect 数据进行跳转设置
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error('登录失败')
        }
      } catch (err) {
        console.log('没有通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;

    .el-form {
      width: 300px;
      padding: 20px;
      border-radius: 10px;
      background-color: #fff;

      .el-button {
        width: 100%;
      }
    }
  }
</style>
