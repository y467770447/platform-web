<template>
  <div class="sjylb-page-style">
    <div class="sjylb-list-box">
      <el-tree
        ref="tree"
        :data="state.sjyList"
        node-key="id"
        :props="state.defaultProps"
        :default-expand-all="false"
        highlight-current
        :expand-on-click-node="false"
        :render-content="renderContent"
        :default-expanded-keys="['0']"
        @node-click="changeSjyAct"
      />
    </div>
    <div class="sjylb-detail-box">
      <div class="detail-top-box">
        <div class="button-box">
          <el-button type="primary" @click="openDrawer">新建数据源</el-button>
          <el-button @click="refreshTable">刷新</el-button>
        </div>
        <el-input
          v-model="state.sjySearch"
          placeholder="配置id | 说明"
          clearable
          style="width: 300px"
          @change="getsjyxxTableList()"
        />
      </div>
      <div class="detail-content-box">
        <el-table
          :data="state.tableData"
          v-loading="state.loading"
          style="width: 100%; height: 100%"
          size="large"
          @expand-change="expandTable"
        >
          <el-table-column type="expand">
            <template #default="{ row }">
              <div style="padding: 10px 30px">
                <el-table :data="state.detailTableData[row.id]" v-loading="state.detailloading" border>
                  <el-table-column label="流程名称" prop="processName">
                    <template #default="{ row }">
                      <el-link type="primary">{{ row.processName }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="所属应用" prop="applicationName" />
                  <el-table-column label="节点名称" prop="pNodeName" />
                  <el-table-column label="节点id" prop="pNodeId" />
                  <el-table-column label="创建者" prop="creatorName" />
                  <el-table-column label="最后更新" prop="editTime" />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in state.columnList"
            :key="index"
            :label="item.label"
            :prop="item.field"
            min-width="100px"
          />
          <el-table-column label="链接类型" prop="linkType" width="120" />
          <el-table-column label="操作" width="270px" fixed="right">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="gettestConent(row)">测试链接</el-link>
              <el-link type="primary" :underline="false" style="margin-left: 10px" @click="getcopySjy(row)"
                >复制</el-link
              >
              <el-link type="primary" :underline="false" style="margin-left: 10px" @click="editSjy(row)">修改</el-link>
              <el-link type="danger" :underline="false" style="margin-left: 10px" @click="getdeleteSjy(row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <vxePagination :page-size="state.pageSize" :page-num="state.page" :total="state.total" @pageChange="pageChange" />
    </div>
    <el-drawer v-model="state.showDrawer" title="选择数据源组件" :with-header="true" size="70%">
      <div class="sjk-box">
        <div v-for="item in state.sjkList" :key="item.groupId" class="sjk-type">
          <div class="sjk-type-name">{{ item.groupName }}</div>
          <el-row :gutter="15">
            <el-col v-for="ite in item.components" :key="ite.componentId">
              <div class="card-box-style" @click="createSjy(ite)">
                <el-card shadow="hover">
                  <div class="sjk-type-item">
                    <img style="width: 60px" :src="getAssetsFile(ite.componentName)" alt="" />
                    <div class="sjk-type-item-content">
                      <div class="ite-name">{{ ite.componentName }}</div>
                      <div class="ite-detail">{{ ite.remark }}</div>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-drawer>
    <sjylbCreate ref="sjylbCreateRef" @getsjyflList="getsjyxxTableList" />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue"
import sjylbCreate from "./sjylbCreate.vue"
import TreeRender from "./treeRender.vue"
import {
  copySjy,
  deleteSjy,
  listGroupComponent,
  processList,
  sjyflList,
  sjyxxTableList,
  testconnect
} from "@/api/sjy/index.js"
import vxePagination from "@/components/vxePagination/index.vue"
import { ElMessage, ElMessageBox } from "element-plus"

const sjylbCreateRef = ref()

const state = reactive({
  sjyList: [],
  loading: false,
  detailloading: false,
  cateId: "",
  sjyAct: "0",
  pageSize: 20,
  page: 1,
  total: 0,
  sjySearch: "",
  columnList: [
    {
      field: "configName",
      label: "数据源名称"
    },
    {
      field: "categoryId",
      label: "数据源ID"
    },
    {
      field: "editorName",
      label: "修改者"
    },
    {
      field: "editTime",
      label: "修改时间"
    }
  ],
  tableData: [],
  detailTableData: {},
  showDrawer: false,
  sjkList: [],
  defaultProps: {
    label: "nodeText",
    children: "children"
  }
})

const renderContent = (h, { node, data, store }) => {
  return h(TreeRender, {
    DATA: data,
    NODE: node,
    STORE: store,
    TabNow: state.sjyAct
  })
}

// 切换数据源
const changeSjyAct = (row) => {
  state.sjyAct = row.id
  state.cateId = row.nodeId
  getsjyxxTableList()
}

const openDrawer = () => {
  state.showDrawer = true
}

const getAssetsFile = (name) => {
  return new URL(`../../assets/sjylb/${name}.png`, import.meta.url).href
}

// 创建数据源
const createSjy = (ite) => {
  sjylbCreateRef.value.openDrawer(ite)
}

// 修改数据源
const editSjy = (ite) => {
  sjylbCreateRef.value.openDrawer(ite, "edit")
}

const getsjyflList = () => {
  state.showDrawer = false
  sjyflList({
    appId: "core",
    categoryId: "core.dataSourceCategory"
  }).then((res) => {
    state.sjyList = res.rows
    state.sjyList.unshift({
      appId: "core",
      categoryId: "core.dataSourceCategory",
      nodeText: "全部",
      id: new Date().getTime()
    })
    state.sjyAct = res.rows[0].id
    state.cateId = res.rows[0].nodeId
    getsjyxxTableList()
  })
}

const getsjyxxTableList = () => {
  state.loading = true
  sjyxxTableList({
    pageSize: state.pageSize,
    page: state.page,
    filters: JSON.stringify({ categoryId: state.cateId }),
    searchFilters: JSON.stringify({ configName: state.sjySearch, configId: state.sjySearch })
  })
    .then((res) => {
      state.tableData = res.rows
      state.total = res.total
      state.showDrawer = false
    })
    .finally(() => {
      state.loading = false
    })
}

const expandTable = (row, expand) => {
  let isExpand = false
  expand.map((item) => {
    isExpand = row.configId === item.configId
  })
  if (isExpand) {
    getsjyDetail(row)
  }
}

const getsjyDetail = (row) => {
  state.detailloading = true
  processList({
    configId: row.configId,
    pageSize: 99,
    pageNo: 1
  })
    .then((res) => {
      state.detailTableData[row.id] = res.rows
    })
    .finally(() => {
      state.detailloading = false
    })
}

// 获取数据源组件列表
const getlistGroupComponent = () => {
  listGroupComponent().then((res) => {
    state.sjkList = res
  })
}

const pageChange = ({ currentPage, pageSize }) => {
  state.page = currentPage
  state.pageSize = pageSize
  getsjyxxTableList()
}

// 测试连结
const gettestConent = (row) => {
  ElMessageBox.confirm("确认测试链接?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      state.loading = true
      testconnect({
        id: row.id
      })
        .then((res) => {
          state.loading = false
          if (res.msg === "链接成功") {
            ElMessage({ message: res.msg, type: "success" })
            return false
          } else if (res.msg === "链接失败") {
            ElMessage({ message: res.msg, type: "error" })
            return false
          }
          ElMessage({ message: res.msg })
        })
        .catch(() => {
          state.loading = false
          ElMessage({ message: "链接失败", type: "error" })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 复制链接
const getcopySjy = (row) => {
  ElMessageBox.confirm("确认复制数据源?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      copySjy({
        ids: row.id
      })
        .then(() => {
          getsjyxxTableList()
          ElMessage({ message: "复制成功", type: "success" })
        })
        .catch(() => {
          ElMessage({ message: "复制失败", type: "error" })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 删除链接
const getdeleteSjy = (row) => {
  ElMessageBox.confirm("确认删除数据源?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteSjy({
        ids: row.id
      })
        .then(() => {
          getsjyxxTableList()
          ElMessage({ message: "删除成功", type: "success" })
        })
        .catch(() => {
          ElMessage({ message: "删除失败", type: "error" })
        })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 刷新
const refreshTable = () => {
  state.page = 1
  getsjyxxTableList()
}

// 初始化加载
getlistGroupComponent()
getsjyflList()
</script>

<style lang="scss" scoped>
.sjylb-page-style {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 !important;
  @include flex-left;

  .sjylb-list-box {
    width: 250px;
    height: 100%;
    background-color: #fff;
    overflow-y: auto;
    //padding: 20px;
    padding: 10px 0;
    border-radius: 5px;

    .list-item-box {
      width: 100%;
      height: 45px;
      @include flex-left-center;
      cursor: pointer;
      position: relative;

      img {
        height: 20px;
        margin: 0 20px;
      }

      .item-title {
        color: #444;
      }

      .right-bg {
        position: absolute;
        right: 0;
        width: 2px;
        height: 100%;
        background-color: #0073ff;
      }
    }

    .list-item-box:hover {
      .item-title {
        color: #1890ff;
      }
    }

    //.list-item-box-active {
    //  background-color: #e6f7ff !important;
    //
    //  .item-title {
    //    color: #1890ff !important;
    //  }
    //}
  }

  .sjylb-detail-box {
    flex: 1;
    width: 0;
    height: 100%;
    background-color: #fff;
    margin-left: 10px;
    border-radius: 5px;
    padding: 20px;
    @include flex-column-start;

    .detail-top-box {
      width: 100%;
      @include flex-between-center;

      .button-box {
        @include flex-left-center;
      }
    }

    .detail-content-box {
      flex: 1;
      height: 0;
      margin-top: 10px;
      //overflow: hidden;
    }
  }

  .sjk-box {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    @include flex-column-start;

    .sjk-type {
      width: 100%;

      .sjk-type-name {
        width: 100%;
        height: 38px;
        color: #333;
        font-size: 16px;
        font-weight: 600;
        line-height: 38px;
      }

      .card-box-style {
        width: 100%;
        margin-bottom: 15px;
      }

      .sjk-type-item {
        width: 100%;
        height: 100px;
        padding: 0 10px;

        cursor: pointer;
        @include flex-left-center;

        img {
          margin: 0 10px 0 5px;
        }

        .sjk-type-item-content {
          .ite-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .ite-detail {
            color: #555;
          }
        }
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .el-col {
    max-width: 33%;
    width: 33%;
    flex: 0 0 33%;
  }
}

@media screen and (min-width: 800px) and (max-width: 1600px) {
  .el-col {
    max-width: 50%;
    width: 50%;
    flex: 0 0 50%;
  }
}

@media only screen and (max-width: 800px) {
  .el-col {
    max-width: 100%;
    width: 100%;
    flex: 0 0 100%;
  }
}

.sjy-table-state {
  display: inline-block;
  padding: 0 8px;
  border-radius: 3px;
  height: 25px;
  line-height: 25px;
  font-size: 13px;
}
</style>
