<template>
  <div class="process-table-content">
    <el-tabs v-model="state.activeName" class="demo-tabs">
      <el-tab-pane label="任务执行步骤" name="0">
        <div class="process-table-box">
          <el-table :data="state.tableData" style="width: 100%" max-height="300px" border>
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
            <el-table-column property="pNodeId" label="节点ID" />
            <el-table-column property="processName" label="节点名称" width="250" />
            <el-table-column property="totalReadCount" label="读取" />
            <el-table-column label="插入">
              <template #default="{ row }">
                <div>{{ row.insertSuccessCount + " / " + row.insertFailedCount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="更新">
              <template #default="{ row }">
                <div>{{ row.updateSuccessCount + " / " + row.updateFailedCount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="删除">
              <template #default="{ row }">
                <div>{{ row.deleteSuccessCount + " / " + row.deleteFailedCount }}</div>
              </template>
            </el-table-column>
            <el-table-column property="breakPointNum" label="断点位" />
            <el-table-column property="breakPointTableName" label="断点表" />
            <el-table-column property="endTime" label="结束时间" />
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
  </div>
</template>

<script setup>
import { reactive } from "vue"
import vxePagination from "@/components/vxePagination/index.vue"
import { processBz } from "@/api/dataView/index.js"

const props = defineProps(["dataForm"])

const state = reactive({
  activeName: "0",
  tableData: [],
  total: 0,
  pageSize: 10,
  page: 1,
  parentRow: {},
  isLoading: false,
  backTable: []
})

const getprocessBz = () => {
  state.isLoading = true
  processBz({
    processId: state.parentRow.processId,
    transactionId: state.parentRow.transactionId
  })
    .then((res) => {
      state.tableData = res.rows.slice(0, state.pageSize)
      state.backTableData = res.rows
      state.total = res.total
    })
    .finally(() => {
      state.isLoading = false
    })
}

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
  state.tableData = state.backTableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}

// 初始化加载
state.parentRow = props.dataForm.row
getprocessBz()
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
