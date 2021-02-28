<template>
  <div class="create-or-edit">
    <el-form label-width="80px" v-model="role">
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrEditRole, getRole } from '@/services/role'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    // 获取角色
    async loadRole () {
      const { data } = await getRole(this.roleId)
      if (data.code === '000000') {
        this.role = data.data
      }
    },
    async onSubmit () {
      const { data } = await createOrEditRole(this.role)
      if (data.code === '000000') {
        // 关闭提示框，子组件向父组件传值
        this.$emit('success')
        // 设置成功提示
        this.$message.success('添加成功')
        // 清除表单内容
        this.role = {}
      }
    },
    handleCancel () {
      this.$emit('cancel')
      this.role = {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
