<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        :data="menus"
        :props="defaultProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedKeys"
      ></el-tree>
      <div style="margin: 20px;">
        <el-button @click="onReset">清空</el-button>
        <el-button
          type="primary"
          @click="onSave"
        >保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenu, getRoleMenus } from '@/services/menu'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      // 默认勾选项
      checkedKeys: []
    }
  },
  created () {
    // 加载所有的菜单信息
    this.loadMenus()
    // 加载当前拥有的菜单信息
    this.loadRoleMenus()
  },
  methods: {
    // 自己封装用于数据筛选的方法(筛选出被选中的项)
    getCheckedKeys (menus) {
      // 遍历数据，所有存在子节点的节点排除，对它们的子节点进行筛选
      menus.forEach(menu => {
        // 未选中，结束
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 如果不是叶子节点，就递归进入数组
          return this.getCheckedKeys(menu.subMenuList)
        }
        // this.checkedKeys.push(menu.id)
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      if (data.code === '000000') {
        this.getCheckedKeys(data.data)
      }
    },
    async loadMenus () {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onSave () {
      // 发送请求，传递 角色ID 和选中的菜单项 ID
      const { data } = await allocateRoleMenu({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      if (data.code === '000000') {
        this.$message.success('分配菜单成功！')
        this.$router.push({
          name: 'role'
        })
      }
    },
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
