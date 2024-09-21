<template>
  <!--  Excel读取-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="标题列配置" />
        <el-step title="字段配置" />
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
          </el-form-item>
          <el-form-item label="读取模式">
            <el-select v-model="state.nodeData.readType" placeholder="请选择">
              <el-option v-for="item in state.readTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="文件目录" v-if="state.nodeData.readType !== '4' && state.nodeData.readType !== '5'">
            <div class="form-display-style">
              <el-autocomplete
                v-model="state.nodeData.filePath"
                :fetch-suggestions="querySearch"
                value-key="filePath"
                clearable
                class="inline-input w-50"
                placeholder="请输入或选择文件目录"
              />
              <el-button type="primary" style="margin-left: 10px" @click="manageDirectory()">文件及目录管理</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="state.nodeData.readType === '1'" label="文件名">
            <div class="form-display-style">
              <el-autocomplete
                v-model="state.nodeData.fileName"
                :fetch-suggestions="filequerySearch"
                value-key="fileName"
                clearable
                class="inline-input w-50"
                placeholder="请输入或选择文件"
              />
              <el-button style="margin-left: 10px" @click="getfilesList">载入文件名</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="state.nodeData.readType === '2' || state.nodeData.readType === '3'" label="文件后缀">
            <el-input v-model="state.nodeData.fileExtension" />
          </el-form-item>
          <el-form-item v-if="state.nodeData.readType === '2'" label="往前偏移时间(秒)">
            <el-input-number v-model="state.nodeData.forwardSecond" :min="0" />
          </el-form-item>
          <el-form-item v-if="state.nodeData.readType === '1'" label="文件名包含时间">
            <el-input v-model="state.nodeData.dateTimeFormat" />
          </el-form-item>
          <el-form-item v-if="state.nodeData.readType === '5'" label="文件列表所在字段ID">
            <el-input v-model="state.nodeData.prevNodeReadFileId" />
          </el-form-item>
          <el-form-item label="工作表序号">
            <el-input v-model="state.nodeData.sheetNo" />
          </el-form-item>
          <el-form-item
            v-if="state.nodeData.readType === '2' || state.nodeData.readType === '3' || state.nodeData.readType === '5'"
            label="最大读取文件数"
          >
            <el-input-number v-model="state.nodeData.maxReadFileCount" :min="0" />
          </el-form-item>
          <el-form-item label="读取后操作">
            <el-radio-group v-model="state.nodeData.readAfterAction">
              <el-radio value="0" size="large">保留</el-radio>
              <el-radio value="1" size="large">删除文件</el-radio>
              <el-radio value="2" size="large">移动文件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="state.nodeData.readAfterAction === '2'" label="目标文件目录">
            <el-input v-model="state.nodeData.targetFolder" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <el-form :model="state.nodeData" label-width="120px" style="padding: 15px 30px 0 30px">
          <el-form-item label="标题">
            <el-radio-group v-model="state.nodeData.headerFromType">
              <el-radio value="2" size="large">自定义字段（--对应Excel中的列）</el-radio>
              <el-radio value="1" size="large">Excel的第N行作为字段名</el-radio>
              <el-radio value="3" size="large">使用Excel的行列标识作为字段名（适用于复杂Excel文件）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="state.nodeData.headerFromType === '1'" label="标题所在行数">
            <el-input-number v-model="state.nodeData.headRow" :min="0" />
          </el-form-item>
          <el-form-item v-if="state.nodeData.headerFromType !== '3'" label="数据开始行数">
            <el-input-number v-model="state.nodeData.dataStartRow" :min="0" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 2">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="writeFromTable">从Excel中分析字段</div>
            <div class="button-item" @click="deleteFields">删除字段</div>
            <div class="button-item" @click="addFields">新增字段</div>
            <div class="button-item" @click="copyFromOthers">从其他节点导入</div>
            <div class="button-item" @click="copyFields">导入或拷贝字段配置</div>
          </div>
          <div class="table-box">
            <el-table
              :data="state.tableData"
              ref="tableRef"
              style="width: 100%; height: 100%"
              row-key="id"
              @row-click="rowClick"
              @selection-change="changeSelection"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column property="colId" label="字段id" width="240" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colId }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colId" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="colName" label="中文说明" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colName }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colName" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="colType" label="数据类型">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ `${row.colType}(${row.colLength})` }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colType" @change="changeTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="button-box">
        <el-button v-if="state.activeStep > 0" type="primary" @click="beforeStep">上一步</el-button>
        <el-button v-if="state.activeStep < 2" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="state.activeStep === 2 || state.nodeData.isExist === 'yes'" type="primary" @click="saveFun"
          >保存</el-button
        >
        <el-button @click="closeDrawer">关闭</el-button>
      </div>
    </div>
    <!--    从其他节点导入-->
    <el-dialog
      v-model="state.showCopyFromDia"
      title="从节点获取字段"
      width="600px"
      align-center
      :close-on-click-modal="false"
    >
      <div style="padding: 10px">
        <el-select v-model="state.otherNode" placeholder="请选择">
          <el-option v-for="item in state.nodeList" :key="item.nodeId" :label="item.nodeName" :value="item.nodeId" />
        </el-select>
        <div style="font-size: 14px; color: #888; margin-top: 10px">指定字段所在节点</div>
      </div>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="setOthersForTable">设置到当前字段中</el-button>
          <el-button @click="closeCopyOthersDia">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    导入或者拷贝字段弹窗-->
    <el-dialog
      v-model="state.showCopyDia"
      title="导入或拷贝字段"
      width="650px"
      align-center
      :close-on-click-modal="false"
    >
      <el-input type="textarea" v-model="state.tempTableColumns" input-style="height: 450px" />
      <div style="font-size: 14px; color: #888">支持直接使用逗号分隔或者是换行符分隔设置为字段ID</div>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="setForTable">设置到当前字段中</el-button>
          <el-button @click="closeCopyDia">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    文件及目录管理弹窗-->
    <el-dialog
      v-model="state.showDirectoryDia"
      title="文件及目录管理"
      width="1000px"
      align-center
      :close-on-click-modal="false"
      class="directory-dia"
    >
      <div class="button-box">
        <el-button type="primary" @click="showDirectoryEditDia(false)">创建文件夹</el-button>
        <el-button @click="getdeleteDirectSx()" :disabled="state.selectionDirectList.length < 1">删除</el-button>
      </div>
      <div class="table-box" v-loading="state.isDataFileListLoading">
        <el-table
          :data="state.fileTableData"
          ref="fileTableRef"
          style="width: 100%; height: 100%"
          @selection-change="changeDirectSelection"
        >
          <el-table-column type="expand">
            <template #default="props">
              <directoryDia :tableRow="props.row" />
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column property="filePath" label="存储路径" width="160" :show-overflow-tooltip="true" />
          <el-table-column property="editorName" label="创建者" />
          <el-table-column property="createTime" label="创建时间" width="160" :show-overflow-tooltip="true" />
          <el-table-column property="monitorFlag" label="监听">
            <template #default="{ row }">
              <el-tag :type="row.monitorFlag === 0 ? 'info' : 'primary'">{{
                row.monitorFlag === 0 ? "否" : "是"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === '0' ? 'info' : 'danger'">{{
                row.status === "0" ? "未启动" : "监听中"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="remark" label="备注" :show-overflow-tooltip="true" />
          <el-table-column property="colType" label="操作" width="150">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="showDirectoryEditDia(row)">修改</el-link>
              <el-link
                v-if="row.monitorFlag === 1"
                type="primary"
                :underline="false"
                @click="getstartJt(row)"
                style="margin: 0 10px"
                >启动</el-link
              >
              <el-link v-if="row.monitorFlag === 1" type="primary" :underline="false" @click="getstopJt(row)"
                >停止</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!--    文件及目录管理弹窗 - 修改-->
    <el-dialog
      v-model="state.directoryEditDia"
      title="文件夹属性"
      width="700px"
      align-center
      :close-on-click-modal="false"
    >
      <el-form
        :model="state.directoryDataForm"
        label-width="auto"
        style="padding: 15px 30px 0 30px"
        v-loading="state.editDiaLoading"
      >
        <el-form-item label="基础路径">
          <span>{{ state.jcfilePath }}</span>
        </el-form-item>
        <el-form-item label="文件夹路径">
          <el-input v-model="state.directoryDataForm.filePath" />
        </el-form-item>
        <el-form-item label="选项">
          <el-radio-group v-model="state.directoryDataForm.folderType">
            <el-radio :value="0">私有文件夹</el-radio>
            <el-radio :value="1">公共文件夹</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="监听文件夹">
          <el-radio-group v-model="state.directoryDataForm.monitorFlag">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="state.directoryDataForm.monitorFlag === 1" label="监听流程">
          <el-tree-select
            v-model="state.directoryDataForm.processId"
            :data="state.jtlcList"
            :render-after-expand="false"
          />
          <!--          @change="changedbConnId"-->
        </el-form-item>
        <el-form-item v-show="state.directoryDataForm.monitorFlag === 1" label="监听间隔">
          <el-input-number v-model="state.directoryDataForm.interval" :min="0" />
        </el-form-item>
        <el-form-item label="同步启动">
          <el-radio-group v-model="state.directoryDataForm.syncFlag">
            <el-radio :value="true">同步</el-radio>
            <el-radio :value="false">异步</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.directoryDataForm.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="editDirectory">提交</el-button>
          <el-button @click="closeDirectoryDia">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    从Excel中分析字段-->
    <el-dialog
      v-model="state.showWriteFromTableDia"
      title="上传Excel文件"
      width="600px"
      align-center
      :close-on-click-modal="false"
    >
      <div class="upload-excel-box" v-loading="state.isWriteFromTableDiaLoading">
        <el-upload
          v-model:file-list="state.fileList"
          class="upload-demo"
          :action="state.uploadUrl"
          :headers="state.headers"
          :auto-upload="true"
          :limit="1"
          :show-file-list="true"
          :data="state.uploadData"
          :on-success="handleUploadSuccess"
        >
          <!--        :on-error="handleUploadError"-->
          <el-button type="primary">点击上传Excel文件</el-button>
        </el-upload>
        <el-button style="margin: 30px 0" @click="startGetFields()">开始获取字段</el-button>
        <div>上传一个Excel文件并从中分析head获取读取字段</div>
      </div>
    </el-dialog>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import {
  datafileList,
  deleteDirectSx,
  ExcelHead,
  filesList,
  filesRoad,
  jtprocessList,
  nodeDetail,
  nodeSelectList,
  saveDirectSx,
  sjById,
  startJt,
  stopJt,
  writeInSave
} from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import directoryDia from "./directoryDia.vue"
import { getToken } from "@/utils/cache/cookies"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const fileTableRef = ref()
const tableRef = ref()

const state = reactive({
  nodeData: {
    pageSize: 20000,
    sqlPageFlag: "0"
  },
  otherNode: "",
  nodeList: [],
  parentNodeData: {},
  uploadExcelRes: {},
  showWriteFromTableDia: false,
  showCopyFromDia: false,
  isWriteFromTableDiaLoading: false,
  showDrawer: false,
  showCopyDia: false,
  directoryEditDia: false,
  isJtEdit: false,
  showDirectoryDia: false,
  editDiaLoading: false,
  isDataFileListLoading: true,
  activeStep: 0,
  fileTableData: [],
  readTypeList: [
    {
      value: "1",
      label: "制定具体的Excel文件"
    },
    // {
    //   value: "2",
    //   label: "在指定目录中获取文件修改时间大于流程最后一次运行时间的文件"
    // },
    {
      value: "3",
      label: "指定目录中的所有文件"
    }
    // {
    //   value: "4",
    //   label: "文件监听器中监听到的文件"
    // },
    // {
    //   value: "5",
    //   label: "上一环节中读取或API上传的文件列表"
    // }
  ],
  pageSize: 10,
  page: 1,
  total: 0,
  tableData: [],
  selectionList: [],
  selectionDirectList: [],
  tempTableColumns: "",
  // filecatalog: [], // 文件目录list
  directoryDataForm: {},
  jtlcList: [
    {
      id: "0",
      label: "流程1",
      value: "0"
    }
  ],
  jcfilePath: "", // 基础路径
  uploadData: {
    // appId: "etl"
  },
  uploadUrl: import.meta.env.VITE_BASE_API + "/rest/base/files/resource/upload?appId=etl",
  headers: {
    Identitytoken: getToken()
  },
  fileList: []
})

const restaurants = ref([])
const filerestaurants = ref([])

const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const filequerySearch = (queryString, cb) => {
  const results = queryString ? filerestaurants.value.filter(createFileNameFilter(queryString)) : filerestaurants.value
  // call callback function to return suggestions
  cb(results)
}

const createFileNameFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.fileName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.filePath.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    // state.nodeData.isExist = state.parentNodeData.isExist
    if (state.nodeData.pNodeName) {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.nodeData.tableColumns !== "" ? (state.tableData = JSON.parse(state.nodeData.tableColumns)) : ""
      }
    } else {
      state.nodeData.tableColumns = ""
      // state.nodeData.sqlPageFlag = "0"
      // state.nodeData.pageSize = 20000
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
      // state.nodeData.readType = "1"
      // state.nodeData.sheetNo = "1"
      // state.nodeData.readAfterAction = "0"
      state.nodeData.fileExtension = "xlsx,xls,csv"
      // state.nodeData.forwardSecond = 0
      // state.nodeData.maxReadFileCount = 0
      // state.nodeData.headerFromType = "2"
      // state.nodeData.headRow = 1
      // state.nodeData.dataStartRow = 1
    }
    !state.nodeData.readType ? (state.nodeData.readType = "1") : ""
    !state.nodeData.sheetNo ? (state.nodeData.sheetNo = "1") : ""
    !state.nodeData.readAfterAction ? (state.nodeData.readAfterAction = "0") : ""
    !state.nodeData.forwardSecond ? (state.nodeData.forwardSecond = 0) : ""
    !state.nodeData.maxReadFileCount ? (state.nodeData.maxReadFileCount = 0) : ""
    !state.nodeData.headerFromType ? (state.nodeData.headerFromType = "2") : ""
    !state.nodeData.headRow ? (state.nodeData.headRow = 1) : ""
    !state.nodeData.dataStartRow ? (state.nodeData.dataStartRow = 1) : ""
  })
}

// 保存
const saveFun = () => {
  const formData = new FormData()
  state.nodeData.isExist = "yes"
  for (const key in state.nodeData) {
    formData.append(key, state.nodeData[key])
  }
  if (!state.nodeData.processId) {
    formData.append("processId", route.query.processId)
    formData.append("appId", "etl")
  }
  writeInSave(formData).then(() => {
    emit("saveNodeDetail")
    closeDrawer()
  })
}

const openDrawer = (nodeData) => {
  state.activeStep = 0
  state.showDrawer = true
  state.parentNodeData = JSON.parse(JSON.stringify(nodeData.attrs.nodeData))
  getnodeDetail()
  restaurants.value = state.fileTableData
  // state.fileTableData = state.filecatalog
}

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  state.activeStep++
}

// 关闭drawer
const closeDrawer = () => {
  state.showDrawer = false
}

// 文件目录列表
const getdatafileList = () => {
  state.isDataFileListLoading = true
  datafileList({
    applicationId: route.query.applicationId,
    pageSize: 99
  })
    .then((res) => {
      state.fileTableData = res.rows
    })
    .finally(() => {
      state.isDataFileListLoading = false
    })
}

// 打开文件及目录管理弹窗
const manageDirectory = () => {
  getdatafileList()
  state.showDirectoryDia = true
}

// 获取文件列表
const getfilesList = () => {
  filesList({
    id: state.nodeData.filePath
  }).then((res) => {
    filerestaurants.value = res.rows
  })
}

// 文件及目录管理弹窗-修改弹窗
const showDirectoryEditDia = (row) => {
  state.directoryDataForm = {}
  getfilesRoad()
  getjtprocessList()
  if (row) {
    state.isJtEdit = true
    getsjById(row)
  } else {
    state.isJtEdit = false
    state.directoryDataForm.filePath = "/"
    state.directoryDataForm.folderType = 0
    state.directoryDataForm.monitorFlag = 0
    state.directoryDataForm.interval = 1000
    state.directoryDataForm.syncFlag = false
    state.directoryDataForm.appId = "etl"
    state.directoryDataForm.applicationId = route.query.applicationId
    state.directoryDataForm.processId = ""
  }
  state.directoryEditDia = true
}

// 文件及目录管理弹窗-修改弹窗-提交
const editDirectory = () => {
  state.editDiaLoading = true
  saveDirectSx(state.directoryDataForm)
    .then((res) => {
      if (res.msg === "ok") {
        ElMessage({
          type: "success",
          message: state.isJtEdit ? "修改成功" : "保存成功"
        })
        getdatafileList()
      } else {
        ElMessage({
          type: "warning",
          message: res.msg
        })
      }
      closeDirectoryDia()
    })
    .finally(() => {
      state.editDiaLoading = false
    })
}

// 文件及目录管理弹窗-修改弹窗-关闭
const closeDirectoryDia = () => {
  state.directoryEditDia = false
}

// 基础路径
const getfilesRoad = () => {
  filesRoad({
    configId: "etl.file.basepath"
  }).then((res) => {
    state.jcfilePath = res.configValue
  })
}

// 监听流程list
const getjtprocessList = () => {
  jtprocessList({
    applicationId: route.query.applicationId
  }).then((res) => {
    const tempRes = res
    tempRes.map((item) => {
      item.children.map((ite) => {
        ite.label = ite.configName
      })
    })
    state.jtlcList = tempRes
  })
}

// 获取文件夹属性
const getsjById = (row) => {
  sjById({
    id: row.id
  }).then((res) => {
    state.directoryDataForm = res
  })
}

// 点击文件夹表格
const changeDirectSelection = (selection) => {
  state.selectionDirectList = selection
}

// 删除文件夹
const getdeleteDirectSx = () => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteDirectSx({
        ids: state.selectionDirectList
          .map((item) => {
            return item.id
          })
          .join(",")
      }).then(() => {
        getdatafileList()
        ElMessage({
          type: "success",
          message: "删除成功"
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

// 启动监听
const getstartJt = (row) => {
  ElMessageBox.confirm("确认启动?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      startJt({
        id: row.id
      }).then(() => {
        getdatafileList()
        ElMessage({
          type: "success",
          message: "启动成功"
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

// 停止监听
const getstopJt = (row) => {
  ElMessageBox.confirm("确认停止监听?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      stopJt({
        id: row.id
      }).then(() => {
        getdatafileList()
        ElMessage({
          type: "success",
          message: "已停止监听"
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

// 输入字段-点击表格行
const rowClick = (row) => {
  state.tableData.map((item) => {
    item.isEdit = false
  })
  row.isEdit = true
}

// 输入字段-选择行
const changeSelection = (selection) => {
  state.selectionList = selection
}

// 输入字段-修改表格
const changeTableData = () => {
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
  state.nodeData.tableColumns = JSON.stringify(
    state.tableData.filter((item) => {
      return item.colId
    })
  )
}

// 输入字段-从表中读入
const writeFromTable = () => {
  state.showWriteFromTableDia = true
}

// 输入字段-删除字段
const deleteFields = () => {
  ElMessageBox.confirm("确定要删除选中的字段吗!", "删除字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      state.tableData = state.tableData.filter((v) => state.selectionList.every((val) => val !== v))
      state.nodeData.tableColumns = JSON.stringify(state.tableData)
      ElMessage({
        message: "删除成功",
        type: "success"
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 输入字段-新增字段
const addFields = () => {
  state.tableData.map((item) => {
    item.isEdit ? (item.isEdit = false) : ""
  })
  state.tableData.push({
    colId: "",
    colName: "",
    colLength: 50,
    dataType: 12,
    noNull: true,
    primaryKey: false,
    digits: 0,
    colType: "varchar",
    autoIncrement: "NO",
    id: new Date().getTime(),
    isEdit: true
  })
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
}

// 获取其他节点
const getnodeSelectList = () => {
  nodeSelectList({
    processId: route.query.processId,
    nodeType: "*"
  }).then((res) => {
    state.nodeList = res
  })
}

// 从其他节点导入弹窗
const copyFromOthers = () => {
  getnodeSelectList()
  state.otherNode = ""
  state.showCopyFromDia = true
}

// 从其他节点导入弹窗-确定
const setOthersForTable = () => {
  nodeDetail({
    processId: route.query.processId,
    nodeId: state.otherNode
  })
    .then((res) => {
      state.tableData = JSON.parse(res.tableColumns)
      state.nodeData.tableColumns = res.tableColumns
    })
    .finally(() => {
      state.showCopyFromDia = false
    })
}

// 从其他节点导入弹窗-关闭
const closeCopyOthersDia = () => {
  state.showCopyFromDia = false
}

const copyFields = () => {
  state.tempTableColumns = state.nodeData.tableColumns
  state.showCopyDia = true
}

const closeCopyDia = () => {
  state.showCopyDia = false
  state.tempTableColumns = ""
}

const setForTable = () => {
  state.tableData = JSON.parse(state.tempTableColumns)
  state.nodeData.tableColumns = state.tempTableColumns
  closeCopyDia()
}

// 上传excel文件成功
const handleUploadSuccess = (res) => {
  state.uploadExcelRes = res
}

// 开始获取字段
const startGetFields = () => {
  state.isWriteFromTableDiaLoading = true
  ExcelHead({
    fileList: state.uploadExcelRes[0].id,
    sheetName: ""
  })
    .then((res) => {
      state.tableData = res
      state.nodeData.tableColumns = JSON.stringify(state.tableData)
      ElMessage({
        type: "success",
        message: "导入成功"
      })
      state.showWriteFromTableDia = false
    })
    .finally(() => {
      state.isWriteFromTableDiaLoading = false
    })
}

// 初始化加载
getdatafileList()

defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">
.drawer-box-style {
  width: 100%;
  padding-top: 20px;
  .button-box {
    width: 100%;
    @include flex-center-center;
    margin-top: 30px;
  }
  .form-display-style {
    width: 100%;
    @include flex-left-center;
  }
  .write-in-box {
    width: 100%;
    height: 100%;
    .top-button-box {
      width: 100%;
      height: 36px;
      @include flex-left-center;
      line-height: normal;
      .button-item {
        padding: 0 24px;
        height: 100%;
        line-height: 36px;
        border: 1px solid #ccc;
        cursor: pointer;
        font-size: 14px;
      }
      .button-item:not(:first-child) {
        margin-left: -1px;
      }
      .button-item:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: #4f8fff;
        color: #fff;
        border: #4f8fff;
        z-index: 2;
      }
      .button-item:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
      }
      .button-item:not(:first-child):hover {
        border: 1px solid #4f8fff;
        color: #4f8fff;
        z-index: 9;
      }
      .button-item:first-child:hover {
        background-color: rgba(79, 143, 255, 0.8);
        z-index: 9;
      }
    }
    .table-box {
      height: 600px;
      margin-top: 20px;
    }
  }
}
.directory-dia {
  .table-box {
    height: 500px;
  }
}
.upload-excel-box {
  width: 100%;
  padding: 10px 30px 30px 30px;
}
</style>
