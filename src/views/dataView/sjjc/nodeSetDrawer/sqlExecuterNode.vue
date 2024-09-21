<template>
  <!--  执行SQL脚本-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="SQL语句" />
        <el-step title="过滤条件" />
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">指定任何有意义且能描述本节点的说明</div>
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">节点id不能重复</div>
          </el-form-item>
          <el-form-item label="数据源">
            <el-tree-select
              v-model="state.nodeData.dbConnId"
              :data="state.dataFromList"
              :render-after-expand="false"
              @change="changedbConnId"
            />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">请指定要执行SQL的数据源</div>
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
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">请选择一个或多个表用于生成SQL语句</div>
          </el-form-item>
          <el-form-item label="SQL来源" style="margin-bottom: 33px">
            <el-radio-group v-model="state.nodeData.sqlSource">
              <el-radio value="1" size="large">自定义SQL</el-radio>
              <!--              <el-radio value="2" size="large">从SQL库中选择</el-radio>-->
            </el-radio-group>
            <div style="position: absolute; bottom: -30px; font-size: 14px; color: #888">指定SQL的来源</div>
          </el-form-item>
          <el-form-item label="运行方式" style="margin-bottom: 33px">
            <el-radio-group v-model="state.nodeData.executerType">
              <el-radio value="1" size="large">仅执行一次</el-radio>
              <el-radio value="2" size="large">对数据记录逐行执行SQL</el-radio>
            </el-radio-group>
            <div style="position: absolute; bottom: -30px; font-size: 14px; color: #888">
              仅执行一次表示把节点变量传入SQL中执行一次，逐行执行表示把数据流中的记录逐行作为变量传入sql中并执行一次
            </div>
          </el-form-item>
          <el-form-item label="SQL执行选项" style="margin-bottom: 33px">
            <el-select v-model="state.nodeData.methodType" placeholder="请选择SQL执行选项">
              <el-option
                v-for="item in state.operationLIst"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div style="position: absolute; bottom: -30px; font-size: 14px; color: #888">
              请根据SQL中的insert,update,select选择相应的执行方法
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <div class="sql-set-box">
          <div class="left-list">
            <el-tree
              style="max-width: 300px"
              :data="state.tableColumns"
              :props="state.defaultProps"
              node-key="key"
              @node-click="changeCheckValue"
            />
            <!--            @node-click="handleNodeClick"-->
          </div>
          <div class="right-sql">
            <div class="ace-button-box">
              <div class="ace-button-item">
                <div class="ace-button-title">生成SQL</div>
                <div class="hover-create-box">
                  <div class="create-sql-item" @click="createSQL('select')">SELECT</div>
                  <div class="create-sql-item" @click="createSQL('update')">UPDATE</div>
                  <div class="create-sql-item" @click="createSQL('insert')">INSERT</div>
                  <div class="create-sql-item" @click="createSQL('delete')">DELETE</div>
                </div>
              </div>
              <div class="ace-button-item">
                <div class="ace-button-title" @click="optimizationSQL">格式化SQL</div>
              </div>
            </div>
            <div id="editor" ref="aceDom" />
          </div>
        </div>
      </div>
      <div v-show="state.activeStep === 2">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="addFields">新增字段</div>
            <div class="button-item" @click="deleteFields">删除字段</div>
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
              <el-table-column property="symbol" label="运算符">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ getSymbolLabel(row.symbol) }}</div>
                  <el-select v-show="row.isEdit" v-model="row.symbol" @change="changeTableData">
                    <el-option
                      v-for="item in state.symbolLIst"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="colValue" label="比较值">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colValue }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colValue" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="colParams" label="备注">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colParams }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colParams" @change="changeTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-radio-group v-model="state.nodeData.andFlag">
            <el-radio value="and" size="large">AND</el-radio>
            <el-radio value="or" size="large">OR</el-radio>
          </el-radio-group>
          <div style="font-size: 14px; color: #999">只有符合条件的记录会执行SQL</div>
        </div>
      </div>
      <div class="button-box">
        <el-button v-if="state.activeStep > 0" type="primary" @click="beforeStep">上一步</el-button>
        <el-button v-if="state.activeStep < 2" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="state.activeStep === 2 || state.nodeData.isExist === 'yes'" type="primary" @click="saveFun"
          >保存
        </el-button>
        <el-button @click="closeDrawer">关闭</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import {
  dataFrom,
  listAllTables,
  nodeDetail,
  getSelectSql,
  writeInSave,
  sqlSelect,
  listTableColumns,
  formatSql,
  sqladd
} from "@/api/dataView/lcsj.js"
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
    // pageSize: 20000
  },
  checkValue: "",
  parentNodeData: {},
  showDrawer: false,
  showCopyDia: false,
  activeStep: 0,
  dataFromList: [],
  dataTableList: [],
  tableColumns: [],
  editor: null,
  pageSize: 10,
  page: 1,
  total: 0,
  tableData: [],
  selectionList: [],
  tempTableColumns: "",
  defaultProps: {
    children: "children",
    label: "label"
  },
  operationLIst: [
    {
      value: "select_replace",
      label: "select(Select的结果集作为Data数据流流入后续节点)"
    },
    {
      value: "select_append",
      label: "select(逐行执行SQL并把返回的字段值赋值给每一行数据字段中,运行方式必须选择逐行执行)"
    },
    {
      value: "select_variant",
      label: "select(返回的数据结果作为变量及全局变量输入后继节点,只能返回一行数据,运行方式必须选择仅执行一次)"
    },
    {
      value: "insert",
      label: "insert(执行插入数据的SQL语句)"
    },
    {
      value: "insert_batch",
      label: "insert(使用批量执行SQL模式插入所有数据)"
    },
    {
      value: "update",
      label: "update(执行更新数据的SQL语句)"
    },
    {
      value: "update_batch",
      label: "update(使用批量执行SQL模式更新所有数据)"
    },
    {
      value: "delete",
      label: "delete(执行删除数据的SQL语句)"
    },
    {
      value: "batchsql",
      label: "批量执行多条SQL语句(多条不同的SQL语句用分号分隔)"
    },
    {
      value: "eachsql",
      label: "逐条执行多条SQL语句(多条不同的SQL语句用分号分隔)"
    }
  ],
  sqlList: [],
  symbolLIst: [
    {
      value: "=",
      label: "等于"
    },
    {
      value: "!=",
      label: "不等于"
    },
    {
      value: ">",
      label: "（数字）大于"
    },
    {
      value: "<",
      label: "（数字）小于"
    },
    {
      value: ">=",
      label: "（数字）大于等于"
    },
    {
      value: "<=",
      label: "（数字）小于等于"
    },
    {
      value: "str >",
      label: "（字符串）大于"
    },
    {
      value: "str <",
      label: "（字符串）小于"
    },
    {
      value: "str >=",
      label: "（字符串）大于等于"
    },
    {
      value: "str <=",
      label: "（字符串）小于等于"
    },
    {
      value: "date gt",
      label: "（日期时间）大于"
    },
    {
      value: "date lt",
      label: "（日期时间）小于"
    },
    {
      value: "date eq",
      label: "（日期时间）等于"
    },
    {
      value: "is null",
      label: "is null"
    },
    {
      value: "not is null",
      label: "not is null"
    },
    {
      value: "startsWith",
      label: "开始字符"
    },
    {
      value: "endWith",
      label: "结束字符"
    },
    {
      value: "contains",
      label: "包含字符"
    },
    {
      value: "not contains",
      label: "不包含字符"
    }
  ]
})

// 点击左侧树修改选中值
const changeCheckValue = (node) => {
  state.checkValue = node.label.split("(")[0]
  state.editor.insert(state.checkValue)
}

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    if (state.nodeData.pNodeName) {
      if (state.nodeData.filtersTableColumns && Array.isArray(JSON.parse(state.nodeData.filtersTableColumns))) {
        state.tableData = JSON.parse(state.nodeData.filtersTableColumns)
      }
    } else {
      state.nodeData.filtersTableColumns = ""
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
    }
    !state.nodeData.sqlSource ? (state.nodeData.sqlSource = "1") : ""
    !state.nodeData.executerType ? (state.nodeData.executerType = "1") : ""
    !state.nodeData.andFlag ? (state.nodeData.andFlag = "and") : ""
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
  state.nodeData.isExist = "yes"
  if (state.editor && state.editor.getValue()) {
    const tempSql = state.editor.getValue()
    state.nodeData.sqlCode = tempSql
    state.nodeData.sql = tempSql
  }
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
  getsqlSelect()
  getdataFrom()
  getnodeDetail()
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
  if (state.nodeData.isExist) {
    return false
  }
  state.nodeData.tableName = state.nodeData.tableName.join(",")
  getSelectSql(state.nodeData).then((res) => {
    state.nodeData.sqlCode = res.code
    state.nodeData.tableName = state.nodeData.tableName.split(",")
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
    getlistTableColumns()
    initAce()
  }
  state.activeStep++
}

// 关闭drawer
const closeDrawer = () => {
  state.showDrawer = false
}

// 获取表字段信息
const getlistTableColumns = () => {
  listTableColumns({
    dbConnId: state.nodeData.dbConnId,
    tableName: state.nodeData.tableName.join(",") || ""
  }).then((res) => {
    state.tableColumns = res
  })
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
  state.nodeData.filtersTableColumns = JSON.stringify(state.tableData)
  state.nodeData.filtersTableColumns = JSON.stringify(
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
      state.nodeData.filtersTableColumns = JSON.stringify(state.tableData)
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
    symbol: "",
    colValue: "",
    colParams: "",
    id: new Date().getTime(),
    isEdit: true
  })
}

// sql选择List
const getsqlSelect = () => {
  sqlSelect().then((res) => {
    state.sqlList = res
  })
}

// 获取运算符中文
const getSymbolLabel = (symbol) => {
  let symbolLabel = ""
  state.symbolLIst.map((item) => {
    item.value === symbol ? (symbolLabel = item.label) : ""
  })
  return symbolLabel
}

// 格式化SQL
const optimizationSQL = () => {
  const tempSql = state.editor.getValue()
  formatSql({
    dbConnId: state.nodeData.dbConnId,
    sql: tempSql // state.nodeData.sqlCode
  }).then((res) => {
    state.editor.setValue(res.formatSql)
    state.nodeData.sqlCode = res.formatSql
  })
}

// 点击、hover生成SQL按钮
const createSQL = (type) => {
  sqladd({
    dbConnId: state.nodeData.dbConnId,
    tableName: state.nodeData.tableName.join(",") || "",
    codeType: type
  }).then((res) => {
    state.editor.setValue(res[type])
    state.nodeData.sqlCode = JSON.stringify(res[type])
    state.nodeData.sql = JSON.stringify(res[type])
  })
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
