<template>
  <div class="gxx-page">
    <div class="public-search-box">
      <el-form :inline="true" :model="state.searchForm" class="demo-form-inline">
        <el-form-item label="对接系统">
          <el-input v-model="state.searchForm.system" placeholder="请输入系统" clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="state.searchForm.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" @click="createData">新建</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="table-box">
        <el-table :data="state.tableData" style="width: 100%; height: 100%">
          <el-table-column type="selection" width="55" />
          <el-table-column property="jkbh" label="接口编号" />
          <el-table-column property="ms" label="描述" />
          <el-table-column property="jkdycs" label="接口调用次数" />
          <el-table-column property="zt" label="状态" />
          <el-table-column property="updateTime" label="更新时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-link type="primary" :underline="true" @click="editKl(row)">编辑</el-link>
              <el-link type="primary" :underline="true">订阅警报</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <vxePagination :page-size="state.pageSize" :page-num="state.page" :total="state.total" @pageChange="pageChange" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"
import vxePagination from "@/components/vxePagination/index.vue"

const router = useRouter()

const state = reactive({
  searchForm: {
    userName: "",
    system: ""
  },
  tableData: [
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    },
    {
      jkbh: "TradeCode 01",
      ms: "这是一段描述，关于这个应用的描述文字内容",
      jkdycs: "357万",
      zt: "关闭",
      updateTime: "2017-10-31  23:12:00"
    }
  ],
  total: 0,
  page: 1,
  pageSize: 20
})

const createData = () => {
  router.push("/sjy/APIAdd")
}

const onSubmit = () => {
  console.log("submit!")
}

const editKl = (row) => {
  console.log(row)
}

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
}
</script>

<style lang="scss" scoped>
.gxx-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  @include flex-column-start;

  .content-box {
    flex: 1;
    height: 0;
    @include flex-column-start;

    .table-box {
      flex: 1;
    }
  }
}
</style>
