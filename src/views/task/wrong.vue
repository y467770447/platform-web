<template>
  <div class="gxx-page">
    <div class="content-box">
      <div class="table-box">
        <el-table :data="state.tableData" style="width: 100%; height: 100%">
          <el-table-column type="index" label="序号" width="70" />
          <el-table-column property="resultCode" label="流程状态" width="150">
            <template #default="{ row }">
              <div>
                <el-tag v-if="row.resultCode === 1" type="success">成功</el-tag>
                <el-tag v-else-if="row.resultCode === 0" type="danger">失败</el-tag>
                <el-tag v-else>{{ row.resultCode }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="processName" label="流程名称" />
          <el-table-column label="流程监控">
            <template #default>
              <el-link type="primary" :underline="false">流程监控</el-link>
            </template>
          </el-table-column>
          <el-table-column label="传输成功/失败">
            <template #default="{ row }">
              <div>{{ row.processTotalSuccessCount + " / " + row.processTotalFailedCount }}</div>
            </template>
          </el-table-column>
          <el-table-column property="createTaskServerId" label="服务器ID" />
          <el-table-column property="startTime" label="开始时间" />
          <el-table-column property="editTime" label="结束时间" />
          <el-table-column property="totalRunTime" label="总耗时（秒）">
            <template #default="{ row }">
              <div>{{ row.totalRunTime / 1000 }}</div>
            </template>
          </el-table-column>
          <el-table-column property="creatorName" label="创建人" />
        </el-table>
      </div>
      <vxePagination :page-size="state.pageSize" :page-num="state.page" :total="state.total" @pageChange="pageChange" />
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import vxePagination from "@/components/vxePagination/index.vue"
import { taskList } from "@/api/task/index.js"

const state = reactive({
  searchForm: {
    userName: "",
    system: ""
  },
  isLoading: false,
  tableData: [],
  total: 0,
  page: 1,
  pageSize: 20
})

const gettaskList = () => {
  state.isLoading = true
  taskList({
    runType: "4",
    applicationId: "*",
    pageSize: state.pageSize,
    pageNo: state.page
  })
    .then((res) => {
      state.tableData = res.rows
      state.total = res.total
    })
    .finally(() => {
      state.isLoading = false
    })
}

// const editKl = (row) => {
//   console.log(row)
// }

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
  gettaskList()
}

// 初始化加载
gettaskList()
</script>

<style lang="scss" scoped>
.gxx-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  @include flex-column-start;

  .content-box {
    flex: 1;
    height: 0;
    margin-top: 20px;
    @include flex-column-start;

    .table-box {
      flex: 1;
      height: 0;
    }
  }
}
</style>
