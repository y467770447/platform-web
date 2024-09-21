<template>
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="表字段配置" />
        <el-step title="建表SQL" />
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">指定任何有意义且能描述本节点的说明</div>
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
            <span style="font-size: 14px; color: #999; margin-bottom: -10px">节点id不能重复</span>
          </el-form-item>
          <el-form-item label="数据源">
            <el-tree-select v-model="state.nodeData.dbConnId" :data="state.dataFromList" :render-after-expand="false" />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">
              请选择一个数据源(只支持关系数据库创建表)
            </div>
          </el-form-item>
          <el-form-item label="表名">
            <el-input v-model="state.nodeData.tableName" />
            <span style="font-size: 14px; color: #999; margin-bottom: -10px">指定要创建的数据库表名</span>
          </el-form-item>
          <el-form-item label="字段来源">
            <el-select v-model="state.nodeData.dataNodeId" filterable placeholder="请选择" @change="changeNodeTable">
              <el-option
                v-for="item in state.nodeList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">
              选择字段所在节点后可自动读取数据字段配置
            </div>
          </el-form-item>
          <el-form-item label="删除表" style="margin-bottom: 33px">
            <el-radio-group v-model="state.nodeData.deleteTable">
              <el-radio value="1" size="large">不删除(跳过本节点)</el-radio>
              <el-radio value="2" size="large">删除后再创建</el-radio>
            </el-radio-group>
            <div style="position: absolute; bottom: -30px; font-size: 14px; color: #888">
              如果表已经存在时是否删除已有表
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="changeNodeTable(state.nodeData.dataNodeId)">导入字段</div>
            <div class="button-item" @click="deleteFields">删除字段</div>
            <div class="button-item" @click="addFields">新增字段</div>
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
                  <div v-show="!row.isEdit">{{ row.colType }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colType" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="colLength" label="长度">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colLength }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colLength" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="primaryKey" label="主键">
                <template #default="{ row }">
                  <el-checkbox v-model="row.primaryKey" label="" size="large" @change="changeTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-show="state.activeStep === 2">
        <div class="sql-set-box">
          <div class="right-sql">
            <div class="ace-button-box">
              <div class="ace-button-item">
                <div class="ace-button-title" @click="createJbSQL">生成建表SQL语句</div>
              </div>
            </div>
            <div id="editor" ref="aceDom" />
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
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { dataFrom, nodeDetail, writeInSave, nodeSelectList, configTable, createSql } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
// import beautify from "js-beautify"

import aceC from "ace-builds"
// ace主题包
import "ace-builds/src-min-noconflict/theme-kuroir"
import "ace-builds/src-min-noconflict/theme-one_dark"
import "ace-builds/src-min-noconflict/theme-github"
import "ace-builds/src-min-noconflict/theme-chrome"
// ace 检索框
import "ace-builds/src-min-noconflict/ext-searchbox"
// ace语言包
import "ace-builds/src-min-noconflict/mode-sql"
import "ace-builds/src-min-noconflict/mode-javascript"
import "ace-builds/src-min-noconflict/mode-xml"
import "ace-builds/src-min-noconflict/mode-json5"
//代码完成
import "ace-builds/src-min-noconflict/ext-language_tools"

//自动提示规则
import "ace-builds/src-noconflict/snippets/javascript"
import "ace-builds/src-noconflict/snippets/sql"
import "ace-builds/src-noconflict/snippets/json"
import "ace-builds/src-noconflict/snippets/java"
import "ace-builds/src-noconflict/snippets/text"
import { ElMessage, ElMessageBox } from "element-plus"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const aceDom = ref()
const tableRef = ref()

const state = reactive({
  nodeData: {
    pageSize: 20000,
    sqlPageFlag: "0"
  },
  parentNodeData: {},
  showDrawer: false,
  showCopyDia: false,
  activeStep: 0,
  dataFromList: [],
  tableColumns: [],
  modelValue: "",
  checkValue: "",
  tableData: [],
  selectionList: [],
  tempTableColumns: "",
  nodeList: [],
  editor: null
})

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    getnodeSelectList()
    if (state.nodeData.pNodeName) {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.tableData = JSON.parse(state.nodeData.tableColumns)
      }
    } else {
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.applicationId = route.query.applicationId
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
      state.nodeData.tableColumns = ""
    }
    !state.nodeData.deleteTable ? (state.nodeData.deleteTable = "1") : ""
  })
}

// 保存
const saveFun = () => {
  let tempType = ""
  state.dataFromList.map((item) => {
    item.children.map((ite) => {
      ite.value === state.nodeData.dbConnId ? (tempType = item.label) : ""
    })
  })
  state.nodeData.dbConnIdParentFlag = tempType
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

const openDrawer = (nodeData) => {
  state.activeStep = 0
  state.showDrawer = true
  state.parentNodeData = JSON.parse(JSON.stringify(nodeData.attrs.nodeData))
  getnodeDetail()
  getdataFrom()
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

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  if (state.activeStep === 0) {
    if (!state.nodeData.dbConnId) {
      ElMessage({
        type: "warning",
        message: "请选择数据源"
      })
      return false
    }
    if (!state.nodeData.tableName) {
      ElMessage({
        type: "warning",
        message: "请输入表名"
      })
      return false
    }
  } else if (state.activeStep === 1) {
    initAce()
  }
  state.activeStep++
}

// 关闭drawer
const closeDrawer = () => {
  state.showDrawer = false
}

// 代码编辑器
const initAce = () => {
  aceC.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/")
  //快速开始-demo
  state.editor = aceC.edit(aceDom.value, {
    // maxLines: 24, // 最大行数，超过会自动出现滚动条
    minLines: 12, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
    fontSize: 14, // 编辑器内字体大小
    theme: "ace/theme/chrome", // 默认设置的主题
    mode: "ace/mode/sql", // 默认设置的语言模式
    // mode: "ace/mode/javascript", // 默认设置的语言模式
    tabSize: 2, // 制表符设置为 4 个空格大小
    readOnly: false //只读
  })
  state.editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  })
  state.editor.setHighlightActiveLine(false)
  // 自动换行
  state.editor.getSession().setUseWrapMode(true)
  // 设置默认值
  state.editor.setValue(state.nodeData.sqlCode)
}

// 生成建表SQL语句
const createJbSQL = () => {
  createSql({
    tableColumns: state.nodeData.tableColumns,
    pNodeName: state.nodeData.pNodeName,
    pNodeId: state.nodeData.pNodeId,
    appId: "etl",
    pNodeType: state.parentNodeData.nodeType,
    processId: route.query.processId,
    pNodeRole: state.parentNodeData.pNodeRole,
    applicationId: route.query.applicationId,
    id: state.nodeData.id,
    tableName: state.nodeData.tableName,
    dbConnId: state.nodeData.dbConnId
  }).then((res) => {
    state.editor.setValue(res.sql)
    state.nodeData.sqlCode = res.sql
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

// 输入字段-新增字段
const addFields = () => {
  state.tableData.map((item) => {
    item.isEdit ? (item.isEdit = false) : ""
  })
  state.tableData.push({
    colId: "",
    colName: "",
    colLength: 50,
    primaryKey: false,
    colType: "varchar",
    id: new Date().getTime(),
    isEdit: true
  })
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
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
    .right-sql {
      flex: 1;
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
