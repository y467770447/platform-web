<template>
  <!--  数据流程-->
  <div class="data-view-page">
    <div class="public-search-box">
      <el-form :inline="true" :model="state.searchForm" class="demo-form-inline">
        <el-form-item label="流程名称">
          <el-input v-model="state.searchForm.configName" placeholder="请输入流程名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" @click="createData('0')">新建</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="table-box">
        <el-table :data="state.tableData" style="width: 100%; height: 100%">
          <el-table-column type="expand">
            <template #default="props">
              <div class="table-content-box">
                <processTableContent ref="processTableContentRef" :dataForm="props" @openLodDia="openLodDia" />
              </div>
            </template>
          </el-table-column>
          <el-table-column property="configName" label="流程名称" width="250" />
          <el-table-column label="流程设计" width="150">
            <template #default="{ row }">
              <el-link type="primary" @click="toPath(row)" :underline="false">流程设计</el-link>
            </template>
          </el-table-column>
          <el-table-column property="creatorName" label="管理员" width="150" />
          <el-table-column property="editTime" label="最后修改" width="250" />
          <el-table-column property="state" label="运行方式">
            <template #default="{ row }">
              <el-tag v-if="row.state === '0'" type="danger">禁用</el-tag>
              <el-tag v-else-if="row.state === '1'" type="success">{{ row.expression }}</el-tag>
              <el-tag v-else-if="row.state === '2'" type="primary">手动</el-tag>
              <div v-else type="success">{{ row.state }}</div>
            </template>
          </el-table-column>
          <el-table-column property="state" label="状态">
            <template #default="{ row }">
              <el-tag v-if="row.state === '0'" type="danger">手动触发</el-tag>
              <el-tag v-else-if="row.state === '1'" type="success">{{ row.nextRunTime }}</el-tag>
              <el-tag v-else-if="row.state === '2'" type="primary">手动触发</el-tag>
              <div v-else type="success">{{ row.state }}</div>
            </template>
          </el-table-column>
          <el-table-column property="remark" label="备注" width="250" />
          <el-table-column property="ts" label="调试" width="200" />
          <el-table-column label="操作" fixed="right" width="335">
            <template #default="{ row }">
              <el-link type="primary" @click="createData('1', row)" :underline="false">修改</el-link>
              <el-link type="primary" :underline="false" style="margin-left: 10px" @click="setProcess(row)">
                调度
              </el-link>
              <el-link type="primary" :underline="false" style="margin-left: 10px" @click="stopProcess(row)">
                停止调度
              </el-link>
              <el-link type="primary" :underline="false" style="margin-left: 10px" @click="copyProcess(row)">
                复制流程
              </el-link>
              <el-link type="success" :underline="false" style="margin-left: 10px" @click="runProcess(row)">
                手动运行
              </el-link>
              <el-link type="danger" :underline="false" style="margin-left: 10px" @click="deleteProcess(row)">
                删除
              </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <vxePagination :page-size="state.pageSize" :page-num="state.page" :total="state.total" @pageChange="pageChange" />
    </div>
    <el-dialog
      v-model="state.showLogDia"
      title="日志"
      width="1200px"
      align-center
      :close-on-click-modal="false"
      :modal="false"
    >
      <div class="log-dia-box">
        <div class="button-box">
          <el-button @click="clearLog">清空日志</el-button>
          <el-button type="primary" @click="downloadTxt">下载</el-button>
        </div>
        <div class="log-content" v-html="state.logDetail" />
      </div>
    </el-dialog>
    <editSjlc ref="editSjlcRef" @updateTable="updateTable" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import vxePagination from "@/components/vxePagination/index.vue"
import { useRoute, useRouter } from "vue-router"
import processTableContent from "./processTableContent.vue"
import {
  copystrategy,
  deletestrategy,
  lclblist,
  logClear,
  logShow,
  runstrategy,
  startstrategy,
  stopstrategy
} from "@/api/dataView/index.js"
import editSjlc from "./editSjlc.vue"
import { ElMessage, ElMessageBox } from "element-plus"

const editSjlcRef = ref(null)
const processTableContentRef = ref(null)

const router = useRouter()
const route = useRoute()

const state = reactive({
  searchForm: {
    configName: ""
  },
  applicationId: "",
  page: 1,
  pageSize: 20,
  total: 0,
  tableData: [],
  showLogDia: false,
  logDetail: "",
  logRowData: {}
})

// 流程列表
const getLcList = () => {
  lclblist({
    page: state.page,
    pageSize: state.pageSize,
    searchFilters: JSON.stringify(state.searchForm),
    applicationId: state.applicationId
  }).then((res) => {
    state.tableData = res.rows
    state.total = res.total
  })
}

const createData = (type, row) => {
  editSjlcRef.value.openEditDia(type, row)
}

const toPath = (row) => {
  router.push({ name: "dataView-lcsj", query: row })
}

const onSubmit = () => {
  state.page = 1
  getLcList()
}

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
  getLcList()
}

// 更新列表
const updateTable = () => {
  getLcList()
}

// 调度
const setProcess = (row) => {
  ElMessageBox.confirm("确认调度?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      startstrategy({ processId: row.processId })
        .then((res) => {
          ElMessage({
            type: res.errcode == "200" ? "error" : "success",
            message: res.msg
          })
          getLcList()
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.msg
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 停止调度
const stopProcess = (row) => {
  ElMessageBox.confirm("确认停止调度?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      stopstrategy({ processId: row.processId })
        .then((res) => {
          ElMessage({
            type: res.errcode == "200" ? "error" : "success",
            message: res.msg
          })
          getLcList()
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.msg
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 复制流程
const copyProcess = (row) => {
  ElMessageBox.confirm("确认复制流程?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      copystrategy({ processId: row.processId })
        .then((res) => {
          ElMessage({
            type: res.errcode == "200" ? "error" : "success",
            message: res.msg
          })
          getLcList()
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.msg
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 运行流程
const runProcess = (row) => {
  ElMessageBox.confirm("确认运行流程?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      runstrategy({ processId: row.processId })
        .then((res) => {
          ElMessage({
            type: res.resultCode == "0" ? "error" : "success",
            message: res.msg,
            plain: true
          })
          getLcList()
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.msg
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 删除流程
const deleteProcess = (row) => {
  ElMessageBox.confirm("确认删除流程?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deletestrategy({ ids: row.id })
        .then((res) => {
          ElMessage({
            type: res.errcode == "200" ? "error" : "success",
            message: "删除成功"
          })
          getLcList()
        })
        .catch((err) => {
          ElMessage({
            type: "error",
            message: err.msg
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 日志
const openLodDia = (row) => {
  state.showLogDia = true
  state.logRowData = JSON.parse(JSON.stringify(row))
  const formData = new FormData()
  formData.append("transactionId", row.transactionId)
  formData.append("serverId", row.runServerId)
  formData.append("createTime", row.createTaskTime)
  formData.append("applicationId", "*")
  formData.append("max", 3000)
  formData.append("filterContent", "")
  logShow(formData).then((res) => {
    state.logDetail = res.LogStr.replace(new RegExp("\\n", "gm"), "<br/>")
  })
}

// 下载日志
const downloadTxt = () => {
  const name = state.logRowData.transactionId
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(state.logDetail))
  element.setAttribute("download", name)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// 清除日志
const clearLog = () => {
  const formData = new FormData()
  formData.append("transactionId", state.logRowData.transactionId)
  formData.append("serverId", state.logRowData.runServerId)
  formData.append("createTime", state.logRowData.createTaskTime)
  formData.append("applicationId", "*")
  logClear(formData).then((res) => {
    state.logDetail = "The contents have been cleared"
    ElMessage({
      type: res.errcode == 0 ? "success" : "error",
      message: res.msg
    })
  })
}

// 初始化加载
state.applicationId = route.query.applicationId
getLcList()
</script>

<style lang="scss" scoped>
.data-view-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  @include flex-column-start;
  overflow: hidden;

  .content-box {
    flex: 1;
    height: 0;
    @include flex-column-start;
    overflow: hidden;

    .table-box {
      flex: 1;
      overflow: hidden;

      .table-content-box {
        padding: 20px 30px;
        background-color: #fbfbfb;
      }
    }
  }
}
.log-dia-box {
  width: 100%;
  .button-box {
    width: 100%;
    @include flex-left-center;
  }
  .log-content {
    width: 100%;
    padding: 10px 20px;
    color: #666;
    line-height: 28px;
    height: 550px;
    overflow-y: auto;
    margin: 10px 0;
    border: 1px solid #eee;
  }
}
</style>
