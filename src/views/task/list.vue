<template>
  <div class="gxx-page">
    <div class="button-tab-box">
      <div
        v-for="item in state.buttonList"
        :key="item.value"
        class="tab-item"
        :class="{ 'tab-item-active': state.actButton === item.value }"
        @click="changeButton(item)"
      >
        {{ item.label }}
      </div>
    </div>
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
  actButton: "2",
  buttonList: [
    {
      value: "2",
      label: "全部"
    },
    {
      value: "1",
      label: "运行中"
    },
    {
      value: "0",
      label: "已结束的"
    },
    {
      value: "3",
      label: "成功运行的记录"
    },
    {
      value: "4",
      label: "错误的记录"
    }
  ],
  tableData: [],
  total: 0,
  page: 1,
  pageSize: 20
})

const gettaskList = () => {
  state.isLoading = true
  taskList({
    runType: state.actButton,
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

// const deleteRow = (row) => {
//   ElMessageBox.confirm("确认删除?", "提示", {
//     confirmButtonText: "确认",
//     cancelButtonText: "取消",
//     type: "warning"
//   })
//     .then(() => {
//       deletetask({ ids: row.id }).then(() => {
//         gettaskList()
//       })
//     })
//     .catch(() => {
//       ElMessage({
//         type: "info",
//         message: "已取消"
//       })
//     })
// }

const changeButton = (item) => {
  state.actButton = item.value
  state.page = 1
  gettaskList()
}

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

  .button-tab-box {
    width: 100%;
    @include flex-left-center;
    .tab-item {
      padding: 0 18px;
      border: 1px solid #ddd;
      margin-right: 5px;
      border-radius: 4px;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      color: #333;
      cursor: pointer;
    }
    .tab-item-active {
      background-color: #409eff;
      color: #fff;
      border: none;
    }
  }

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
