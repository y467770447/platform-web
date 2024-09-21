<template>
  <div class="rules-page">
    <div class="left-tree">
      <el-tree
        ref="ruleTree"
        style="width: 100%"
        :data="state.ruleList"
        node-key="nodeId"
        @node-click="changeTreeCheckValue"
      />
    </div>
    <div class="content-box">
      <div class="public-search-box">
        <div class="top-button-box">
          <div v-if="state.treeNode.nodeId === 'time'" class="button-item" @click="addRuleFun">新增定时策略</div>
          <div v-if="state.treeNode.nodeId === 'time'" class="button-item" @click="deleteRuleFun">删除</div>
        </div>
        <div class="search-box">
          <el-select
            v-if="!state.isTimeRule"
            v-model="state.applicationId"
            placeholder="请选择所属应用"
            style="width: 200px"
            @change="changeAppRules"
          >
            <el-option
              v-for="item in state.appList"
              :key="item.applicationId"
              :label="item.applicationName"
              :value="item.applicationId"
            />
          </el-select>
          <el-input v-model="state.ruleName" placeholder="规则名称" style="width: 200px" @change="refreshTable()" />
        </div>
      </div>
      <div class="table-box">
        <el-table :data="state.ruleTableList" style="width: 100%; height: 100%" @selection-change="changeSelection">
          <el-table-column v-if="state.treeNode.nodeId === 'time'" type="selection" width="55" />
          <el-table-column property="ruleName" label="规则名称" :show-overflow-tooltip="true" />
          <el-table-column property="remark" label="说明" :show-overflow-tooltip="true" />
          <el-table-column property="example" label="示例" :show-overflow-tooltip="true" />
          <el-table-column property="editTime" label="更新时间" width="250" />
          <el-table-column v-if="state.treeNode.nodeId !== 'time'" property="publicType" label="公开" width="150">
            <template #default="{ row }">
              <el-tag :type="row.publicType === 1 ? 'success' : 'info'">{{
                row.publicType === 1 ? "公开" : "非公开"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="state.treeNode.nodeId === 'time'" property="state" label="状态" width="150">
            <template #default="{ row }">
              <el-tag :type="row.state === '1' ? 'success' : 'info'">{{ row.state === "1" ? "启用" : "停用" }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="state.treeNode.nodeId !== 'time'" property="ruleCode" label="代码" width="150">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="openCodeDia(row)">代码</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="openEditDrawer(row)">修改</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <vxePagination
        :page-size="state.pageSize"
        :page-num="state.pageNo"
        :total="state.total"
        @pageChange="pageChange"
      />
    </div>
    <editDrawer ref="editDrawerRef" @refreshTable="refreshTable" />
    <timeDrawer ref="timeDrawerRef" @refreshTable="refreshTable" />
    <codeDrawer ref="codeDrawerRef" />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
import vxePagination from "@/components/vxePagination/index.vue"
import { deleteTimeRule, rulesCatelog, timeRuleList } from "@/api/dataView/rules.js"
import { listapps } from "@/api/dataView/index.js"
import { ruleListpage } from "@/api/dataView/lcsj.js"
import editDrawer from "./editDrawer.vue"
import codeDrawer from "./codeDrawer.vue"
import timeDrawer from "./timeDrawer.vue"
import { ElMessage, ElMessageBox } from "element-plus"

const ruleTree = ref()
const editDrawerRef = ref()
const codeDrawerRef = ref()
const timeDrawerRef = ref()

const state = reactive({
  // checkNow: "",
  isTimeRule: false,
  ruleList: [
    {
      id: "0",
      nodeId: "0",
      label: "平台内置规则",
      children: []
    },
    {
      id: "1",
      nodeId: "1",
      label: "自定义规则",
      children: [
        {
          id: "1-1",
          nodeId: "#allPublic#",
          label: "公开规则"
        },
        {
          id: "1-1",
          nodeId: "#all#",
          label: "我的规则"
        }
      ]
    },
    {
      id: "2",
      nodeId: "time",
      label: "定时策略",
      children: []
    }
  ],
  searchForm: {},
  applicationId: "",
  appList: [],
  pageSize: 20,
  pageNo: 1,
  total: 0,
  ruleName: "",
  treeNode: ""
})

// 获取所有应用
const getlistapps = () => {
  listapps({
    categoryId: "*"
  }).then((res) => {
    state.appList = res
    state.applicationId = res[0].applicationId
    getrulesCatelog()
  })
}

// 平台内置规则list
const getrulesCatelog = () => {
  rulesCatelog({
    applicationId: state.applicationId,
    appId: "etl"
  }).then((res) => {
    state.ruleList[0].children = res.ruleMenus
    state.treeNode = res.ruleMenus[0]
    // state.checkNow = res.ruleMenus[0]
    nextTick(() => {
      ruleTree.value.setCurrentNode(res.ruleMenus[0], true)
    })
    getruleListpage(res.ruleMenus[0])
  })
}

// 获取内置规则的详细规则list
const getruleListpage = (item) => {
  ruleListpage({
    applicationId: state.applicationId,
    appId: "etl",
    categoryId: item.nodeId.split("#")[1],
    pageSize: state.pageSize,
    pageNo: state.pageNo,
    system: "1",
    searchFilters: JSON.stringify({
      ruleId: state.ruleName,
      ruleName: state.ruleName
    })
  }).then((res) => {
    state.ruleTableList = res.rows
    state.total = res.total
  })
}

// 点击左侧树
const changeTreeCheckValue = (item) => {
  state.pageNo = 1
  state.treeNode = item
  state.isTimeRule = item.nodeId === "time"
  getTableData()
}

const getTableData = () => {
  if (state.treeNode.nodeId.split("#")[1]) {
    getruleListpage(state.treeNode)
  } else if (state.treeNode.nodeId === "time") {
    timeRuleList({
      pageSize: state.pageSize,
      pageNo: state.pageNo,
      searchFilters: JSON.stringify({
        ruleId: state.ruleName,
        ruleName: state.ruleName
      })
    }).then((res) => {
      state.ruleTableList = res.rows
      state.total = res.total
    })
  }
}

// 更改所属应用
const changeAppRules = () => {
  getrulesCatelog()
}

// 打开修改规则弹窗
const openEditDrawer = (row) => {
  if (state.treeNode.nodeId === "time") {
    timeDrawerRef.value.openDrawer(row)
  } else {
    editDrawerRef.value.openDrawer(row)
  }
}

// 新增定时策略
const addRuleFun = () => {
  timeDrawerRef.value.openDrawer()
}

// 打开代码弹窗
const openCodeDia = (row) => {
  codeDrawerRef.value.openDrawer(row)
}

const pageChange = ({ currentPage, pageSize }) => {
  state.pageNo = currentPage
  state.pageSize = pageSize
  getTableData()
}

// 刷新table
const refreshTable = () => {
  getTableData()
}

// 定时策略-选中行
const changeSelection = (selection) => {
  state.selectionList = selection
}

// 删除定时策略
const deleteRuleFun = () => {
  const tempList = []
  state.selectionList.map((item) => {
    tempList.push(item.id)
  })
  ElMessageBox.confirm("确定要删除选中的定时策略吗!", "删除定时策略?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteTimeRule({
        ids: tempList.join(",")
      }).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        refreshTable()
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
getlistapps()
</script>

<style scoped lang="scss">
.rules-page {
  width: 100%;
  height: 100%;
  @include flex-left;
  background-color: #fff;
  overflow: hidden;
  .left-tree {
    width: 250px;
    height: 100%;
    border-right: 1px solid #eee;
  }
  .content-box {
    width: 0;
    flex: 1;
    padding: 0 20px;
    @include flex-column-start;
    .search-box {
      margin-bottom: 10px;
      @include flex-right-center;
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
    .table-box {
      flex: 1;
      height: 0;
    }
  }
}
</style>
