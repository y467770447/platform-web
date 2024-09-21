<template>
  <!--  Excel输出-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="输出字段" />
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
            <!--            <el-input v-model="state.nodeData.nodeName" />-->
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
          </el-form-item>
          <el-form-item label="数据所在节点">
            <el-select v-model="state.nodeData.dataNodeId" filterable placeholder="请选择" @change="changeNodeTable">
              <el-option
                v-for="item in state.nodeList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件路径">
            <el-autocomplete
              v-model="state.nodeData.filePath"
              :fetch-suggestions="querySearch"
              value-key="filePath"
              clearable
              class="inline-input w-50"
              placeholder="请输入或选择文件路径"
            />
          </el-form-item>
          <el-form-item label="文件名">
            <el-input v-model="state.nodeData.fileName" />
          </el-form-item>
          <el-form-item label="时间格式">
            <el-input v-model="state.nodeData.dateTimeFormat" />
          </el-form-item>
          <el-form-item label="最大输出记录">
            <el-input-number v-model="state.nodeData.maxWriteNum" :min="0" />
          </el-form-item>
          <el-form-item label="输出后文件存放变量Id">
            <el-input v-model="state.nodeData.fileVariableId" />
          </el-form-item>
          <el-form-item label="结束时清空数据流">
            <el-radio-group v-model="state.nodeData.clearDataFlag">
              <el-radio value="1" size="large">是</el-radio>
              <el-radio value="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="writeFromTable">重新导入字段</div>
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
          <el-radio-group v-model="state.nodeData.deleteNotConfigField">
            <el-radio :value="true" size="large">未配置字段不输出</el-radio>
            <el-radio :value="false" size="large">全部输出</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="button-box">
        <el-button v-if="state.activeStep > 0" type="primary" @click="beforeStep">上一步</el-button>
        <el-button v-if="state.activeStep < 1" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="state.activeStep === 1 || state.nodeData.isExist === 'yes'" type="primary" @click="saveFun"
          >保存</el-button
        >
        <el-button @click="closeDrawer">关闭</el-button>
      </div>
    </div>
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
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { nodeDetail, writeInSave, configTable, datafileList, nodeSelectList, resetTable } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const tableRef = ref()

const state = reactive({
  nodeData: {
    pageSize: 20000,
    sqlPageFlag: "0"
  },
  parentNodeData: {},
  showDrawer: false,
  showCopyDia: false,
  showCopyFromDia: false,
  activeStep: 0,
  nodeList: [],
  tableColumns: [],
  tableData: [],
  selectionList: [],
  tempTableColumns: "",
  roadList: []
})

const restaurants = ref([])

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    // state.nodeData.isExist = state.parentNodeData.isExist
    getnodeSelectList()
    if (state.nodeData.pNodeName) {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.tableData = JSON.parse(state.nodeData.tableColumns)
      }
    } else {
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
    }
    !state.nodeData.fileName ? (state.nodeData.fileName = "excel.xlsx") : ""
    !state.nodeData.dateTimeFormat ? (state.nodeData.dateTimeFormat = "yyyyMMddHHmmss") : ""
    !state.nodeData.maxWriteNum ? (state.nodeData.maxWriteNum = 0) : ""
    !state.nodeData.fileVariableId ? (state.nodeData.fileVariableId = "ReadFileList") : ""
    !state.nodeData.clearDataFlag ? (state.nodeData.clearDataFlag = "1") : ""
    !state.nodeData.deleteNotConfigField ? (state.nodeData.deleteNotConfigField = true) : ""
  })
}

// 获取输出字段的table
const changeNodeTable = (id) => {
  configTable({
    processId: route.query.processId,
    nodeId: id
  }).then((res) => {
    state.tableData = res
    state.nodeData.tableColumns = JSON.stringify(state.tableData)
  })
}

const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.filePath.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

// 文件目录列表
const getdatafileList = () => {
  datafileList({
    applicationId: route.query.applicationId,
    pageSize: 99
  }).then((res) => {
    state.roadList = res.rows
    restaurants.value = state.roadList
  })
}

// 获取节点List
const getnodeSelectList = () => {
  nodeSelectList({
    processId: route.query.processId,
    nodeType: "*"
  }).then((res) => {
    state.nodeList = res
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
  getdatafileList()
}

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  if (state.activeStep === 0 && !state.nodeData.filePath) {
    ElMessage({
      type: "warning",
      message: "请选择或输入文件路径"
    })
    return false
  }
  state.activeStep++
}

// 关闭drawer
const closeDrawer = () => {
  state.showDrawer = false
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
  state.nodeData.tableColumns = JSON.stringify(
    state.tableData.filter((item) => {
      return item.colId
    })
  )
}

// 输入字段-重新导入字段
const writeFromTable = () => {
  ElMessageBox.confirm("如果当前重新导入字段，将会取消当前未保存的编辑!", "重新导入字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      resetTable({
        processId: route.query.processId,
        nodeId: state.nodeData.dataNodeId
      }).then((res) => {
        state.tableData = res
        state.nodeData.tableColumns = JSON.stringify(res)
        ElMessage({
          message: "导入成功",
          type: "success"
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

// 输入字段-删除字段
const deleteFields = () => {
  ElMessageBox.confirm("确定要删除选中的字段吗!", "删除字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      state.tableData = state.tableData.filter((v) => state.selectionList.every((val) => val.id !== v.id))
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

// 初始化加载

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
  .sql-set-box {
    width: 100%;
    height: 600px;
    @include flex-left;
    .left-list {
      width: 250px;
      height: 100%;
      border: 1px solid #eee;
      overflow-y: auto;
    }
    .right-sql {
      flex: 1;
      //height: 0;
      //padding: 10px;
      border: 1px solid #eee;
      @include flex-column-start;
      #editor {
        flex: 1;
        height: 0;
      }
      .ace-button-box {
        width: 100%;
        height: 45px;
        @include flex-left-center;
        border: 1px solid #eee;
        .ace-button-item {
          position: relative;
          margin-left: 10px;
          .ace-button-title {
            line-height: normal;
            border-radius: 4px;
            cursor: pointer;
            padding: 7px 20px;
            border: 1px solid #eee;
            font-size: 14px;
          }
          .hover-create-box {
            width: 100px;
            background-color: #fff;
            border-radius: 5px;
            position: absolute;
            left: 0;
            top: 34px;
            display: none;
            box-shadow: 0 0 6px #dcdfe6;
            padding: 5px 0;
            z-index: 99;
            .create-sql-item {
              width: 100%;
              height: 30px;
              @include flex-center-center;
              cursor: pointer;
              font-size: 14px;
              color: #555;
            }
            .create-sql-item:hover {
              background-color: rgba(70, 154, 255, 0.15);
            }
          }
          .ace-button-title:hover {
            border: 1px solid #669eff;
            color: #669eff;
          }
        }
        .ace-button-item:hover {
          .hover-create-box {
            display: block;
          }
        }
      }
    }
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
</style>
