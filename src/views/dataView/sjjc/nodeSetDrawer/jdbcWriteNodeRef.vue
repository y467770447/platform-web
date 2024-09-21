<template>
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style jdbcWrite-drawer-box">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="输出字段" />
        <el-step title="输出选项" />
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
          </el-form-item>
          <el-form-item label="数据源">
            <el-tree-select
              v-model="state.nodeData.dbConnId"
              :data="state.dataFromList"
              :render-after-expand="false"
              @change="changedbConnId"
            />
          </el-form-item>
          <el-form-item label="数据库表">
            <el-select v-model="state.nodeData.tableName" multiple placeholder="请选择" @change="changeTableName">
              <el-option
                v-for="item in state.dataTableList"
                :key="item.tableName"
                :label="item.tableName + '（' + item.tableType + '）'"
                :value="item.tableName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="转义符号">
            <el-input v-model="state.nodeData.symbol" />
          </el-form-item>
          <el-form-item label="清空数据流">
            <el-radio-group v-model="state.nodeData.clearDataFlag">
              <el-radio value="0" size="large">否</el-radio>
              <el-radio value="1" size="large">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日志策略">
            <el-radio-group v-model="state.nodeData.LogStrategy">
              <el-radio value="1" size="large">仅记录传输出错的记录</el-radio>
              <el-radio value="2" size="large">记录所有传输数据</el-radio>
              <el-radio value="0" size="large">不记录</el-radio>
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
            <div class="button-item" @click="writeFromTable">从表中读入</div>
            <!--            <div class="button-item" @click="writeFromSql">从SQL中分析</div>-->
            <div class="button-item" @click="deleteFields">删除列</div>
            <div class="button-item" @click="addFields">新增列</div>
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
              <el-table-column property="primaryKey" label="关键字段">
                <template #default="{ row }">
                  <el-checkbox v-model="row.primaryKey" label="" size="large" @change="changeTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-show="state.activeStep === 2">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="清空表数据">
            <el-radio-group v-model="state.nodeData.targetDeleteAll">
              <el-radio value="0" size="large">否</el-radio>
              <el-radio value="1" size="large">第一次执时</el-radio>
              <el-radio value="2" size="large">每次执行时</el-radio>
              <!--              <el-radio value="3" size="large">使用SQL删除</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据更新方式">
            <el-select v-model="state.nodeData.writeType" placeholder="请选择" @change="changeWriteType">
              <el-option label="逐条（更新、插入、删除）操作" value="1" />
              <!--              <el-option label="合并后批量（更新、插入、删除）操作" value="3" />-->
              <el-option label="批量插入（性能最快）" value="2" />
              <el-option label="仅更新及插入（不支持删除，性能快，仅部分数据库支持此模式）" value="4" />
              <el-option label="仅执行更新（不插入或删除，不检测时全部更新）" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="冲突处理" v-if="state.nodeData.writeType === '1'">
            <el-select v-model="state.nodeData.conflictFlag" placeholder="请选择">
              <el-option label="记录已存在时更新（不存在时插入）" value="1" />
              <el-option label="记录已存在时更新（不存在时跳过）" value="2" />
              <el-option label="记录已存在时跳过（不存在时插入）" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="检查选项" v-if="state.nodeData.writeType === '3' || state.nodeData.writeType === '5'">
            <el-radio-group v-model="state.nodeData.skipExistsCheck">
              <el-radio value="2" size="large">更新前批量检测记录是否存在</el-radio>
              <el-radio value="0" size="large">更新前逐条检测记录是否存在</el-radio>
              <el-radio value="1" size="large">不检测</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="批大小"
            v-if="state.nodeData.writeType === '3' && state.nodeData.skipExistsCheck === '2'"
          >
            <el-input-number v-model="state.nodeData.batchCheckSize" :min="0" />
          </el-form-item>
          <el-form-item label="忽略错误">
            <el-radio-group v-model="state.nodeData.ignoreError">
              <el-radio value="1" size="large">是</el-radio>
              <el-radio value="0" size="large">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最大写入">
            <el-input-number v-model="state.nodeData.maxWriteNum" :min="0" />
          </el-form-item>
        </el-form>
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
import { dataFrom, listAllTables, nodeDetail, nodeSelectList, writeFields, writeInSave } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
// import beautify from "js-beautify"

// ace主题包
// import "ace-builds/src-min-noconflict/theme-kuroir"
// import "ace-builds/src-min-noconflict/theme-one_dark"
// import "ace-builds/src-min-noconflict/theme-github"
// import "ace-builds/src-min-noconflict/theme-chrome"
// // ace 检索框
// import "ace-builds/src-min-noconflict/ext-searchbox"
// // ace语言包
// import "ace-builds/src-min-noconflict/mode-sql"
// import "ace-builds/src-min-noconflict/mode-javascript"
// import "ace-builds/src-min-noconflict/mode-xml"
// import "ace-builds/src-min-noconflict/mode-json5"
// //代码完成
// import "ace-builds/src-min-noconflict/ext-language_tools"
//
// //自动提示规则
// import "ace-builds/src-noconflict/snippets/javascript"
// import "ace-builds/src-noconflict/snippets/sql"
// import "ace-builds/src-noconflict/snippets/json"
// import "ace-builds/src-noconflict/snippets/java"
// import "ace-builds/src-noconflict/snippets/text"
import { ElMessage, ElMessageBox } from "element-plus"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const tableRef = ref()

const state = reactive({
  nodeData: {
    // pageSize: 20000,
    // sqlPageFlag: "0"
  },
  parentNodeData: {},
  showDrawer: false,
  showCopyDia: false,
  activeStep: 0,
  dataFromList: [],
  dataTableList: [],
  pageSize: 10,
  page: 1,
  total: 0,
  tableData: [],
  selectionList: [],
  tempTableColumns: ""
})

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    // state.nodeData.isExist = state.parentNodeData.isExist
    if (!state.nodeData.pNodeName) {
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
      state.nodeData.tableColumns = ""
      // state.nodeData.sqlPageFlag = "0"
      // state.nodeData.pageSize = 20000
      // state.nodeData.maxWriteNum = 0
      // state.nodeData.batchCheckSize = 1000
      // state.nodeData.clearDataFlag = "1"
      // state.nodeData.LogStrategy = "1"
      // state.nodeData.targetDeleteAll = "0"
      // state.nodeData.writeType = "1"
      // state.nodeData.conflictFlag = "1"
      // state.nodeData.skipExistsCheck = "2"
      // state.nodeData.ignoreError = "1"
      // state.nodeData.batchCheckSize = "1000"
    }
    !state.nodeData.maxWriteNum ? (state.nodeData.maxWriteNum = 0) : ""
    !state.nodeData.batchCheckSize ? (state.nodeData.batchCheckSize = 1000) : ""
    !state.nodeData.clearDataFlag ? (state.nodeData.clearDataFlag = "1") : ""
    !state.nodeData.LogStrategy ? (state.nodeData.LogStrategy = "1") : ""
    !state.nodeData.targetDeleteAll ? (state.nodeData.targetDeleteAll = "0") : ""
    !state.nodeData.writeType ? (state.nodeData.writeType = "2") : ""
    !state.nodeData.conflictFlag ? (state.nodeData.conflictFlag = "1") : ""
    !state.nodeData.skipExistsCheck ? (state.nodeData.skipExistsCheck = "2") : ""
    !state.nodeData.ignoreError ? (state.nodeData.ignoreError = "1") : ""
    if (state.nodeData.tableName) {
      state.nodeData.tableName = state.nodeData.tableName.split(",")
    } else {
      state.nodeData.tableName = []
    }
    if (state.nodeData.dbConnId) {
      getlistAllTables()
    }
  })
}

// 保存
const saveFun = () => {
  state.nodeData.tableName = state.nodeData.tableName.join(",")
  state.nodeData.isExist = "yes"
  const formData = new FormData()
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

// 数据源
const getdataFrom = () => {
  dataFrom({
    applicationId: route.query.applicationId
  }).then((res) => {
    state.dataFromList = res
  })
}

// 变动数据源
const changedbConnId = () => {
  state.nodeData.tableName = []
  getlistAllTables()
}

const openDrawer = (nodeData) => {
  state.activeStep = 0
  state.showDrawer = true
  state.parentNodeData = JSON.parse(JSON.stringify(nodeData.attrs.nodeData))
  getnodeDetail()
  getdataFrom()
}

// 数据库表
const getlistAllTables = () => {
  const formData = new FormData()
  formData.append("dbName", "SYSDB")
  formData.append("dbType", "R")
  formData.append("dbConnId", state.nodeData.dbConnId)
  listAllTables(formData, state.nodeData.tableName.join(",") || "").then((res) => {
    state.dataTableList = res
  })
}

// 切换数据库表
const changeTableName = () => {
  const formData = new FormData()
  for (const key in state.nodeData) {
    formData.append(key, state.nodeData[key])
  }
  writeFields(formData).then((res) => {
    state.tableData = res
    state.nodeData.tableColumns = JSON.stringify(res)
  })
}

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  if (state.activeStep === 0) {
    if (!(state.nodeData.tableName.length > 0)) {
      ElMessage({
        message: "请先选择数据源和数据库表",
        type: "warning"
      })
      return false
    }
    if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
      state.tableData = JSON.parse(state.nodeData.tableColumns)
    }
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
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
  state.nodeData.tableColumns = JSON.stringify(
    state.tableData.filter((item) => {
      return item.colId
    })
  )
}

// 输入字段-从表中读入
const writeFromTable = () => {
  ElMessageBox.confirm("如果当前已经有字段配置数据,导入字段会丢失现有数据!", "导入表字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      const formData = new FormData()
      for (const key in state.nodeData) {
        formData.append(key, state.nodeData[key])
      }
      writeFields(formData).then((res) => {
        state.tableData = res
        // state.nodeData.tableColumns = JSON.stringify(res)
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
      // state.nodeData.tableColumns = JSON.stringify(state.tableData)
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

const changeWriteType = () => {
  if (state.nodeData.writeType === "1" || state.nodeData.writeType === "4" || state.nodeData.writeType === "5") {
    ElMessage({
      type: "warning",
      message: "当存在数据时，需在输出字段表格中选择关键字段"
    })
  }
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
<!--<style lang="scss">-->
<!--.jdbcWrite-drawer-box {-->
<!--  .el-input-number {-->
<!--    .el-input-number__increase {-->
<!--      right: 2px !important;-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</style>-->
