<template>
  <div class="process-table-content">
    <el-tabs v-model="state.activeName" class="demo-tabs">
      <el-tab-pane label="任务运行记录" name="0">
        <div class="process-table-box">
          <el-table :data="state.tableData" style="width: 100%" max-height="550px" border>
            <el-table-column type="expand">
              <template #default="props">
                <div class="table-content-box">
                  <zxbzTabeleContent :dataForm="props" />
                </div>
              </template>
            </el-table-column>
            <!--          <el-table-column type="selection" width="55" />-->
            <el-table-column property="resultCode" label="流程状态" width="150">
              <template #default="{ row }">
                <div>
                  <el-tag v-if="row.resultCode === 1" type="success">成功</el-tag>
                  <el-tag v-else-if="row.resultCode === 0" type="danger">失败</el-tag>
                  <el-tag v-else-if="row.resultCode === 2" type="warning">运行中</el-tag>
                  <el-tag v-else>{{ row.resultCode }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column property="processName" label="流程名称" width="250" :show-overflow-tooltip="true" />
            <el-table-column property="processId" label="任务ID" :show-overflow-tooltip="true" />
            <el-table-column label="日志">
              <template #default="{ row }">
                <el-link type="primary" :underline="false" @click="openLodDia(row)">查看日志</el-link>
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
          </el-table>
        </div>
        <vxePagination
          :page-size="state.pageSize"
          :page-num="state.page"
          :total="state.total"
          @pageChange="pageChange"
        />
      </el-tab-pane>
    </el-tabs>
    <!--    <el-dialog-->
    <!--      v-model="state.showLogDia"-->
    <!--      title="日志"-->
    <!--      width="500px"-->
    <!--      align-center-->
    <!--      :close-on-click-modal="false"-->
    <!--      :modal="false"-->
    <!--    >-->
    <!--      <div class="log-dia-box">-->
    <!--        <div class="button-box">-->
    <!--          <el-button>清空日志</el-button>-->
    <!--          <el-button type="primary">下载</el-button>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </el-dialog>-->
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { processRecord } from "@/api/dataView/index.js"
import vxePagination from "@/components/vxePagination/index.vue"
import zxbzTabeleContent from "./zxbzTableContent.vue"

const props = defineProps(["dataForm"])

const emit = defineEmits(["openLodDia"])

const state = reactive({
  activeName: "0",
  isLoading: false,
  tableData: [],
  total: 0,
  startTime: "",
  endTime: "",
  pageSize: 10,
  page: 1
  // showLogDia: false,
  // logDetail: ""
})

const getprocessRecord = () => {
  state.isLoading = true
  processRecord({
    applicationId: "all",
    processId: state.parentRow.processId,
    runType: "2",
    startTime: state.startTime,
    endTime: state.startTime,
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

const openLodDia = (row) => {
  emit("openLodDia", row)
}

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
  getprocessRecord()
}

// 初始化加载
state.parentRow = props.dataForm.row
getprocessRecord()

defineExpose({
  openLodDia
})
</script>

<style scoped lang="scss">
.process-table-content {
  width: 100%;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #eee;
  padding: 10px;
  .process-table-box {
    margin: 10px 15px;
  }
}
</style>
