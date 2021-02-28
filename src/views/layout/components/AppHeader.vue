<template>
  <div class="app-header">
    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 右侧用户信息展示 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- 用户头像，使用了 Avatar 组件 -->
        <el-avatar
          :size="30"
          :src="userInfo.portrait || 'https://s3.ax1x.com/2021/02/22/yHIwa6.png'"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName || '未登录' }}</el-dropdown-item>
        <el-dropdown-item
          divided
          @click.native="handleLogout"
        >退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/services/user'
export default {
  name: 'AppHeader',
  data () {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  created () {
    // 生命钩子中不建议直接书写逻辑代码
    // 尽量使用封装好的功能
    // 加载用户信息
    this.loadUserInfo()
    // 下面进行功能测试的演示
    this.loadUserInfo()
  },
  methods: {
    // 加载用户信息功能
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1. 清除 store 用户信息
        this.$store.commit('setUser', null)
        // 2. 跳转到登录页
        this.$router.push({ name: 'login' })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退出'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
</style>
