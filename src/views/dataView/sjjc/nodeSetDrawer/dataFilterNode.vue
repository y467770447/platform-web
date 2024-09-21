<template>
  <!--  字段值修改-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="字段值映射配置" />
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
          <el-form-item label="数据所在节点">
            <el-select v-model="state.nodeData.sourceNodeIds" placeholder="请选择">
              <el-option
                v-for="item in state.dataFromList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">选择数据所在节点方便读取字段配置值</div>
          </el-form-item>
          <el-form-item label="最大过滤记录数">
            <el-input-number v-model="state.nodeData.maxFiltersCount" :min="0" />
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">只取符合条件的top n条记录,0表示不限定</div>
          </el-form-item>
          <el-form-item label="符合条件的数据流向">
            <el-select v-model="state.nodeData.qualifiedRouterId" placeholder="请选择">
              <el-option
                v-for="item in state.routeSelect"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">
              选择符合条件的数据流向路由，不选择表示由系统自动判断
            </div>
          </el-form-item>
          <el-form-item label="不符合条件的数据流向">
            <el-select v-model="state.nodeData.unqualifiedRouterId" placeholder="请选择">
              <el-option
                v-for="item in state.routeSelect"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">
              选择不符合条件的数据流向路由,不选择表示不需要流出
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
              <el-table-column property="colId" label="字段id">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colId }}</div>
                  <el-autocomplete
                    v-if="row.isEdit"
                    v-model="row.colId"
                    :fetch-suggestions="querySearch"
                    value-key="value"
                    clearable
                    class="inline-input w-50"
                    placeholder="请输入或选择字段id"
                    @change="changeTableData"
                    @select="changeTableData"
                  />
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
          <div style="font-size: 14px; color: #999">
            符合条件的记录将复制到后继节点中,不指定条件则表示全部满足,提示:P_TAG_IUD字段是增量标签值分别为(I,D,U),不符合过虑条件的记录将打标签P_FILTERSFLAG=1,注意字段Id区分大小写
          </div>
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
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { nodeDetail, writeInSave, sjszjdList, columnList, routerSelect } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"

import { ElMessage, ElMessageBox } from "element-plus"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const restaurants = ref([])

const tableRef = ref()

const state = reactive({
  nodeData: {
    pageSize: 20000,
    sqlPageFlag: "0"
  },
  parentNodeData: {},
  showDrawer: false,
  activeStep: 0,
  dataFromList: [],
  tableColumns: [],
  tableData: [],
  selectionList: [],
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

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    if (state.nodeData.pNodeName) {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.tableData = JSON.parse(state.nodeData.tableColumns)
      }
    } else {
      state.nodeData.tableColumns = ""
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
    }
    !state.nodeData.maxFiltersCount ? (state.nodeData.maxFiltersCount = 1) : ""
    !state.nodeData.andFlag ? (state.nodeData.andFlag = "and") : ""
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
  getdataFrom()
  getrouterSelect()
  getnodeDetail()
}

// 获取数据所在节点
const getdataFrom = () => {
  sjszjdList({
    processId: route.query.processId,
    nodeType: "*"
  }).then((res) => {
    state.dataFromList = res
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

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  if (state.activeStep === 0) {
    if (!state.nodeData.sourceNodeIds) {
      ElMessage({
        type: "warning",
        message: "请选择数据所在节点"
      })
      return false
    }
    getcolumnList()
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
    symbol: "",
    colValue: "",
    newColId: "",
    id: new Date().getTime(),
    isEdit: true
  })
}

// 输入字段list
const getcolumnList = () => {
  columnList({
    processId: route.query.processId,
    nodeId: state.nodeData.sourceNodeIds
  }).then((res) => {
    restaurants.value = res
  })
}

const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.text.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

// 数据流向
const getrouterSelect = () => {
  routerSelect({
    processId: route.query.processId
  }).then((res) => {
    state.routeSelect = res
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
