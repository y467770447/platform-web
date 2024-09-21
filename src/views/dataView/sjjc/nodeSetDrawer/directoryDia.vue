<template>
  <div style="padding: 10px 30px" class="file-table-box">
    <div class="button-box">
      <el-upload
        v-model:file-list="state.fileList"
        class="upload-demo"
        :action="state.uploadUrl"
        :auto-upload="true"
        :show-file-list="false"
        :data="state.uploadData"
        :on-success="handleUploadSuccess"
        :headers="state.headers"
      >
        <!--        :on-error="handleUploadError"-->
        <el-button size="small">上传文件</el-button>
      </el-upload>
      <el-button
        size="small"
        style="margin-left: 5px"
        @click="getdeleteFileSx"
        :disabled="state.selectionFileList.length < 1"
        >删除</el-button
      >
    </div>
    <el-table
      :data="state.filesListData"
      v-loading="state.filesListloading"
      @selection-change="changeFileSelection"
      border
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index" width="55" />
      <el-table-column label="文件名" prop="fileName">
        <template #default="{ row }">
          <el-link type="primary" @click="downloadFile(row)">{{ row.fileName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="editTime" />
      <el-table-column label="大小" prop="fileSize" />
    </el-table>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { deleteFileSx, downloadFiles, filesList } from "@/api/dataView/lcsj.js"
import { getToken } from "@/utils/cache/cookies"
import { ElMessage, ElMessageBox } from "element-plus"

const props = defineProps(["tableRow"])

const state = reactive({
  filesListData: [],
  filesListLoading: false,
  uploadUrl: import.meta.env.VITE_BASE_API + "/rest/etl/datafile/upload",
  headers: {
    Identitytoken: getToken()
  },
  uploadData: {
    id: "",
    appId: ""
  },
  selectionFileList: []
})

// 获取目录列表
const getFilesList = () => {
  state.filesListloading = true
  filesList({
    id: props.tableRow.id,
    pageSize: 999,
    pageNo: 1
  })
    .then((res) => {
      state.filesListData = res.rows
      state.uploadData.id = props.tableRow.id
      state.uploadData.appId = props.tableRow.appId
    })
    .finally(() => {
      state.filesListloading = false
    })
}

const handleUploadSuccess = () => {
  ElMessage({
    type: "success",
    message: "上传成功"
  })
  getFilesList()
}

// 下载文件
const downloadFile = (row) => {
  downloadFiles({
    id: props.tableRow.id,
    fileName: row.fileName
  }).then((res) => {
    const content = res
    const blob = new Blob([content])
    const elink = document.createElement("a")
    elink.download = row.fileName
    elink.style.display = "none"
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  })
}

// 选择文件
const changeFileSelection = (selection) => {
  state.selectionFileList = selection
}

// 删除文件夹
const getdeleteFileSx = () => {
  ElMessageBox.confirm("确认删除?", "注意，删除后不可恢复!", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteFileSx({
        filePath: state.selectionFileList
          .map((item) => {
            return item.filePath
          })
          .join(",")
      })
        .then(() => {
          getFilesList()
          ElMessage({
            type: "success",
            message: "删除成功"
          })
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

// 初始化加载
getFilesList()
</script>

<style scoped lang="scss">
.file-table-box {
  max-height: 300px;
}
.button-box {
  @include flex-left-center;
  margin-bottom: 10px;
}
</style>
