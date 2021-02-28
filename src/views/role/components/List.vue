<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          :model="form"
          class="demo-form-inline"
          ref="form"
        >
          <el-form-item label="角色名称">
            <el-input v-model="form.name" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onReset">重置</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 显示对话框 -->
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table
        :data="roles"
        stripe
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          prop="id"
          label="编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="150px">
          <template slot-scope="scope">
            <div>
              <el-button type="text">分配菜单</el-button>
              <el-button type="text">分配资源</el-button>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框结构 -->
      <el-dialog
        :title="isEdit ? '编辑角色' : '添加角色'"
        :visible.sync="dialogVisible"
        width="400px"
        @before-close="handleClose"
      >
        <!-- 将添加与编辑的功能封装到组件中 -->
        <create-or-edit
          @success="handleSuccess"
          @cancel="handleCancel"
          :isEdit="isEdit"
          :role-id="roleId"
          v-if="dialogVisible"
        ></create-or-edit>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getRoles, deleteRole } from '@/services/role'
import CreateOrEdit from './CreateOrEdit'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: ''
      },
      // 控制加载状态
      isLoading: false,
      // 表格数据
      roles: [],
      // 控制对话框显示
      dialogVisible: false,
      // 控制新增或编辑
      isEdit: false,
      // 存储正在编辑的角色ID
      roleId: '',
      // 当前编辑的角色，会传递给子组件
      role: {
        name: '',
        id: '',
        description: ''
      }
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.isLoading = false
    },
    onSubmit () {
      console.log('submit!')
    },
    onReset () {
      console.log('reset!')
    },
    // 添加角色功能
    handleAdd () {
      this.dialogVisible = true
      this.isEdit = false
    },
    handleClose () {
      this.role = {}
    },
    async handleEdit (role) {
      this.dialogVisible = true
      this.isEdit = true
      this.roleId = role.id
    },
    handleDelete (role) {
      this.$confirm(`确认删除角色：${role.name}?`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        })
        .catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试！')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    // 监听子组件状态
    // 成功时触发
    handleSuccess () {
      this.dialogVisible = false
      this.loadRoles()
    },
    // 取消时触发
    handleCancel () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
