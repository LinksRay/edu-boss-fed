<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix">
        <el-form
          ref="form"
          :model="form"
          :inline="true"
        >
          <el-form-item
            label="资源名称"
            prop="name"
          >
            <el-input
              placeholder="资源名称"
              v-model="form.name"
              clearable></el-input>
          </el-form-item>
          <el-form-item
            label="资源路径"
            prop="url"
          >
            <el-input
              placeholder="资源路径"
              v-model="form.url"
              clearable></el-input>
          </el-form-item>
          <el-form-item
            label="资源分类"
            prop="categoryId"
          >
            <el-select
              v-model="form.categoryId"
              placeholder="全部"
              clearable
            >
              <!-- 请求接口进行下拉菜单项设置 -->
              <el-option
                v-for="item in resourceCategories"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="onReset"
            >重置</el-button>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="resources"
        stripe
        style="width: 100%"
        v-loading="isLoading">
        <el-table-column
          type="index"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="资源名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="资源路径">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          label="添加时间">
          <!-- 设置过滤器需要使用作用域插槽获取数据 -->
          <template slot-scope="scope">
            <span>{{ scope.row.createdTime | dataFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="handleDelete(scope.row)"
              type="danger"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories } from '@/services/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        // 当前页数
        current: 1,
        // 每页显示条数
        size: 10,
        name: '',
        url: '',
        categoryId: ''
      },
      // 用于存储资源列表数据
      resources: [],
      // 数据总条数
      totalCount: 0,
      // 存储资源分类列表
      resourceCategories: [],
      // 控制加载状态
      isLoading: false
    }
  },
  created () {
    // 加载资源数据
    this.loadResources()
    // 加载资源列表
    this.loadResourceCategories()
  },
  methods: {
    async loadResources () {
      // 开始加载数据
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 请求成功后取消加载
        this.isLoading = false
      }
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 提交筛选功能
    onSubmit () {
      // 确保查询后是第一页并且数据显示正常
      this.form.current = 1
      this.loadResources()
    },
    onReset () {
      this.$refs.form.resetFields()
    },
    handleEdit () {},
    handleDelete () {},
    // 每页显示条数变化时触发
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示的条数，应当将页数初始
      this.form.current = 1
      this.loadResources()
    },
    // 页号改变触发
    handleCurrentChange (val) {
      this.form.current = val
      this.loadResources()
    }
  },
  filters: {
    // 日期过滤器
    dataFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
