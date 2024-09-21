<template>
  <!--  数据清洗转换-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="清洗规则" />
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
          <el-form-item label="数据所在节点">
            <el-select v-model="state.nodeData.sourceNodeIds" placeholder="请选择" @change="changeSourceNodeIds">
              <el-option
                v-for="item in state.dataFromList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
            <div style="font-size: 14px; color: #999; margin-bottom: -10px">选择数据所在节点方便读取字段配置值</div>
          </el-form-item>
          <el-form-item label="最大转换记录数" style="margin-bottom: 33px">
            <el-input-number v-model="state.nodeData.maxCount" :min="0" />
            <div style="position: absolute; bottom: -30px; font-size: 14px; color: #888">
              只对符合条件的top n条记录进行转换,0表示不限定
            </div>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <div class="top-button-box">
          <div class="button-item" @click="addFields">新增规则</div>
          <div class="button-item" @click="copyFields">导入或拷贝字段配置</div>
          <div class="button-item" @click="deleteFields">删除字段</div>
        </div>
        <div class="table-box">
          <el-table
            :data="state.tableData"
            ref="tableRef"
            style="width: 100%; height: 550px"
            row-key="id"
            @row-click="rowClick"
            @selection-change="changeSelection"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column property="colId" label="字段id" show-overflow-tooltip>
              <!--              <template #default="{ row }">-->
              <!--                <div v-show="!row.isEdit">{{ row.colId }}</div>-->
              <!--                <el-input v-show="row.isEdit" v-model="row.colId" @change="changeTableData" />-->
              <!--              </template>-->
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
            <el-table-column property="ruleId" label="绑定清洗转换补全规则" show-overflow-tooltip>
              <template #default="{ row }">
                <el-link type="primary" @click="changeRules(row)">{{ row.ruleName }}</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="font-size: 14px; color: #888">说明:仅支持绑定(数据清洗转换规则、数据脱敏规则、数据补全规则)</div>
      </div>
      <div v-show="state.activeStep === 2">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="addfiltersFields">新增字段</div>
            <div class="button-item" @click="deletefiltersFields">删除字段</div>
          </div>
          <div class="table-box">
            <el-table
              :data="state.filtersTableColumns"
              ref="filtersTableColumnsRef"
              style="width: 100%; height: 100%"
              row-key="id"
              @row-click="filtersTablerowClick"
              @selection-change="changefiltersTableSelection"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column property="colId" label="字段id" width="240" show-overflow-tooltip>
                <!--                <template #default="{ row }">-->
                <!--                  <div v-show="!row.isEdit">{{ row.colId }}</div>-->
                <!--                  <el-input v-show="row.isEdit" v-model="row.colId" @change="changeFiltersTableData" />-->
                <!--                </template>-->
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
                    @change="changeFiltersTableData"
                    @select="changeFiltersTableData"
                  />
                </template>
              </el-table-column>
              <el-table-column property="symbol" label="运算符" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ getSymbolLabel(row.symbol) }}</div>
                  <!--                  <el-input v-show="row.isEdit" v-model="row.symbol" @change="changeFiltersTableData" />-->
                  <el-select v-show="row.isEdit" v-model="row.symbol" @change="changeFiltersTableData">
                    <el-option
                      v-for="item in state.symbolLIst"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column property="colValue" label="比较值" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colValue }}</div>
                  <el-input
                    v-show="row.isEdit"
                    v-model="row.colValue"
                    placeholder="不填表示空字符串，支持变量${变量}"
                    @change="changeFiltersTableData"
                  />
                </template>
              </el-table-column>
              <el-table-column property="colParams" label="备注" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colParams }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colParams" @change="changeFiltersTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-radio-group v-model="state.nodeData.andFlag">
            <el-radio value="and" size="large">AND</el-radio>
            <el-radio value="or" size="large">OR</el-radio>
          </el-radio-group>
          <div style="font-size: 14px; color: #999">
            只有符合条件的记录才会进行清洗则则的运算(排除不需要运算的数据可以加快清洗规则的执行速度)不配置过滤条件则会对所有数据行执行清洗运算
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
    <el-dialog v-model="state.showRuleDia" title="绑定规则" width="1080px" align-center :close-on-click-modal="false">
      <div class="rule-dia-box">
        <div class="rule-tree-box">
          <el-tree
            style="width: 200px"
            :data="state.rulesList"
            node-key="nodeId"
            :default-expanded-keys="['999']"
            :props="state.defaultProps"
            @node-click="changeTreeCheckValue"
          />
        </div>
        <div class="rule-content-box">
          <div class="rule-table-box">
            <el-table
              ref="ruleTable"
              :data="state.ruleTableData"
              :header-cell-style="{ background: '#F8F8F9' }"
              style="width: 100%; height: 100%"
            >
              <el-table-column label="" align="center" width="65">
                <template #default="scope">
                  <el-radio
                    :label="scope.row.id"
                    v-model="state.ruleRadio"
                    @change="getCurrentRow(scope.row)"
                    :key="scope.row.id"
                    >&nbsp;</el-radio
                  >
                </template>
              </el-table-column>
              <el-table-column prop="ruleName" label="规则名称" />
              <el-table-column prop="creatorName" label="创建者" />
            </el-table>
          </div>
          <vxePagination
            :page-size="state.rulePageSize"
            :page-num="state.rulePageNo"
            :total="state.total"
            @pageChange="pageChange"
          />
        </div>
      </div>
      <template #footer>
        <div class="dialog-btn">
          <el-button @click="closeRuleDia">取 消</el-button>
          <el-button type="primary" @click="confirmRule">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { dataIdSelect, nodeDetail, ruleList, ruleListpage, sjszjdList, writeInSave } from "@/api/dataView/lcsj.js"
import vxePagination from "@/components/vxePagination/index.vue"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const restaurants = ref([])

const tableRef = ref()

const state = reactive({
  nodeData: {
    // pageSize: 20000,
    // sqlPageFlag: "0"
  },
  parentNodeData: {},
  tableFromIdList: [],
  showDrawer: false,
  showCopyDia: false,
  showRuleDia: false,
  chooseRule: "",
  itemRule: {},
  activeStep: 0,
  rulesList: [
    {
      id: "999",
      nodeId: "999",
      children: [],
      label: "平台内置规则"
    }
  ],
  dataFromList: [],
  tableColumns: [],
  defaultProps: {
    children: "children",
    label: "label"
  },
  tableData: [],
  filtersTableColumns: [],
  selectionList: [],
  filtersTableselectionList: [],
  tempTableColumns: "",
  ruleTableData: [],
  ruleRadio: "",
  rulePageSize: 10,
  rulePageNo: 1,
  tempRuleRow: {},
  categoryId: "",
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
    // state.nodeData.isExist = state.parentNodeData.isExist
    if (state.nodeData.pNodeName) {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.tableData = JSON.parse(state.nodeData.tableColumns)
      }
      if (state.nodeData.filtersTableColumns && Array.isArray(JSON.parse(state.nodeData.filtersTableColumns))) {
        state.filtersTableColumns = JSON.parse(state.nodeData.filtersTableColumns)
      }
    } else {
      state.nodeData.tableColumns = ""
      state.nodeData.filtersTableColumns = ""
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
    }
    !state.nodeData.andFlag ? (state.nodeData.andFlag = "and") : ""
    !state.nodeData.maxCount ? (state.nodeData.maxCount = 0) : ""
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

// 获取数据所在节点
const getdataFrom = () => {
  sjszjdList({
    processId: route.query.processId,
    nodeType: "*"
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
  }
  state.activeStep++
}

// 切换数据所在节点
const changeSourceNodeIds = () => {
  dataIdSelect({
    processId: route.query.processId,
    nodeId: state.nodeData.sourceNodeIds
  }).then((res) => {
    state.tableFromIdList = res
    restaurants.value = res
    state.tableData = []
    state.tableFromIdList.map((item) => {
      state.tableData.push({
        colId: item.value,
        ruleId: "",
        ruleName: "绑定规则",
        isEdit: false,
        id: new Date().getTime()
      })
    })
    state.filtersTableColumns = []
    state.nodeData.tableColumns = JSON.stringify(state.tableData)
    state.nodeData.filtersTableColumns = JSON.stringify(state.filtersTableColumns)
  })
}

const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
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

// 过滤字段-点击表格行
const filtersTablerowClick = (row) => {
  state.filtersTableColumns.map((item) => {
    item.isEdit = false
  })
  row.isEdit = true
}

// 输入字段-选择行
const changefiltersTableSelection = (selection) => {
  state.filtersTableselectionList = selection
}

// 过滤字段table-选择行
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

// 过滤字段-修改表格
const changeFiltersTableData = () => {
  state.nodeData.filtersTableColumns = JSON.stringify(
    state.filtersTableColumns.filter((item) => {
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

// 过滤字段-删除字段
const deletefiltersFields = () => {
  ElMessageBox.confirm("确定要删除选中的字段吗!", "删除字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      state.filtersTableColumns = state.filtersTableColumns.filter((v) =>
        state.filtersTableselectionList.every((val) => val.id !== v.id)
      )
      state.nodeData.filtersTableColumns = JSON.stringify(state.filtersTableColumns)
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
    ruleId: "",
    ruleName: "绑定规则",
    isEdit: true,
    id: new Date().getTime()
  })
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
}

// 过滤字段-新增字段
const addfiltersFields = () => {
  state.filtersTableColumns.map((item) => {
    item.isEdit ? (item.isEdit = false) : ""
  })
  state.filtersTableColumns.push({
    colId: "",
    symbol: "",
    colValue: "",
    colParams: "",
    isEdit: true,
    id: new Date().getTime()
  })
}

const changeRules = (row) => {
  state.itemRule = row
  getruleList()
}

const getruleList = () => {
  ruleList({
    applicationId: route.query.applicationId,
    appId: "etl",
    system: "1"
  }).then((res) => {
    state.rulesList[0].children = res.ruleMenus
    getruleListpage(state.rulesList[0].children[0].nodeId)
    state.showRuleDia = true
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

// 设置到当前字段中
const setForTable = () => {
  state.tableData = JSON.parse(state.tempTableColumns)
  state.nodeData.tableColumns = state.tempTableColumns
  closeCopyDia()
}

// 确认绑定rule
const confirmRule = () => {
  state.itemRule.ruleId = state.tempRuleRow.ruleId
  state.itemRule.ruleName = state.tempRuleRow.ruleName
  state.itemRule.queryRuleDataId = state.tempRuleRow.id
  state.itemRule.categoryKey = state.categoryId
  state.itemRule.openKeys = ["system"]
  state.nodeData.tableColumns = JSON.stringify(state.tableData)
  closeRuleDia()
}

// 关闭rule弹窗
const closeRuleDia = () => {
  state.showRuleDia = false
}

// 切换rule
const getCurrentRow = (row) => {
  state.tempRuleRow = row
}

// 获取rule-table
const getruleListpage = (categoryId) => {
  state.categoryId = categoryId
  ruleListpage({
    applicationId: route.query.applicationId,
    appId: "etl",
    categoryId: categoryId.split("#")[1],
    pageSize: state.rulePageSize,
    pageNo: state.rulePageNo,
    system: "1"
  }).then((res) => {
    state.ruleTableData = res.rows
  })
}

const pageChange = ({ currentPage, pageSize }) => {
  state.rulePageNo = currentPage
  state.rulePageSize = pageSize
  getruleListpage(state.categoryId)
}

const changeTreeCheckValue = (item) => {
  state.rulePageNo = 1
  getruleListpage(item.nodeId)
}

// 获取运算符中文
const getSymbolLabel = (symbol) => {
  let symbolLabel = ""
  state.symbolLIst.map((item) => {
    item.value === symbol ? (symbolLabel = item.label) : ""
  })
  return symbolLabel
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
    .table-box {
      height: 600px;
      margin-top: 20px;
    }
  }
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
}
.rule-dia-box {
  height: 550px;
  width: 100%;
  @include flex-left;
  .rule-tree-box {
    height: 100%;
    overflow-y: auto;
  }
  .rule-content-box {
    flex: 1;
    @include flex-column-start;
    .rule-table-box {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
