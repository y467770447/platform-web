<template>
  <div class="sjyflgl-page">
    <div class="public-search-box">
      <div class="btn-box">
        <el-button type="primary" @click="openFlDia">新増分类</el-button>
        <!--        <el-button type="danger" @click="createFl">删除</el-button>-->
        <!--        <el-button @click="createFl">导出</el-button>-->
        <el-button @click="refreshTable">刷新</el-button>
      </div>
    </div>
    <div class="content-box">
      <div class="table-box">
        <el-table v-loading="state.loading" :data="state.tableData" style="width: 100%; height: 100%" row-key="id">
          <el-table-column type="selection" width="55" />
          <el-table-column property="nodeText" label="分类名称" width="240" show-overflow-tooltip />
          <el-table-column property="editorName" label="类型" />
          <el-table-column property="nodeId" label="唯一id" width="240" show-overflow-tooltip />
          <el-table-column property="sort" label="排序" />
          <el-table-column property="creator" label="创建者" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="text" @click="editFl(row)">编辑</el-button>
              <el-button type="text" @click="addSonType(row)">新增子类</el-button>
              <el-link type="danger" :underline="false" @click="deleteFl(row)" style="margin-left: 10px">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="state.showXzzlDia" title="分类属性" width="500px" align-center :close-on-click-modal="false">
      <el-form :model="state.xzzlFields" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="分类名称">
          <el-input v-model="state.xzzlFields.nodeText" />
        </el-form-item>
        <el-form-item label="分类唯一id">
          <el-input v-model="state.xzzlFields.nodeId" disabled />
        </el-form-item>
        <el-form-item label="统计排序">
          <el-input v-model="state.xzzlFields.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmAddZl">提 交</el-button>
          <el-button @click="closeXzflDia">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    新增父类-->
    <el-dialog v-model="state.showXzflDia" title="分类属性" width="500px" align-center :close-on-click-modal="false">
      <el-form :model="state.xzflFields" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="分类名称">
          <el-input v-model="state.xzflFields.nodeText" />
        </el-form-item>
        <el-form-item label="分类唯一id">
          <el-input v-model="state.xzflFields.nodeId" disabled />
        </el-form-item>
        <el-form-item label="统计排序">
          <el-input v-model="state.xzflFields.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmAddFl">提 交</el-button>
          <el-button @click="closeXzFlDia">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!--    编辑-->
    <el-dialog v-model="state.showEditDia" title="分类属性" width="500px" align-center :close-on-click-modal="false">
      <el-form :model="state.editFields" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="上级分类">
          <el-tree-select
            v-model="state.editFields.parentNodeId"
            :data="state.sjflLists"
            :render-after-expand="false"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="state.editFields.nodeText" />
        </el-form-item>
        <el-form-item label="分类唯一id">
          <el-input v-model="state.editFields.nodeId" disabled />
        </el-form-item>
        <el-form-item label="统计排序">
          <el-input v-model="state.editFields.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmEditFl">提 交</el-button>
          <el-button @click="closeEditlDia">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { deleteappservicecategory, flwyId, sjflList, sjyflList, sjyflSave } from "@/api/sjy/index.js"
// import vxePagination from "@/components/vxePagination/index.vue"
import { ElMessage, ElMessageBox } from "element-plus"

const state = reactive({
  tableData: [],
  // pageSize: 20,
  // pageNo: 1,
  // total: 0,
  loading: false,
  showXzzlDia: false,
  showXzflDia: false,
  showEditDia: false,
  // serialNumber: "",
  xzzlFields: {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "",
    appId: "core",
    categoryId: "core.dataSourceCategory"
  },
  xzflFields: {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "root",
    appId: "core",
    categoryId: "core.dataSourceCategory"
  },
  editFields: {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "root",
    appId: "core",
    categoryId: "core.dataSourceCategory"
  },
  sjflLists: [],
  tempParentNode: {} // 父级节点
})

// const createFl = () => {
//   console.log("导出")
// }

// 刷新
const refreshTable = () => {
  // state.pageNo = 1
  getList()
}

const getList = () => {
  state.loading = true
  sjyflList({
    // pageSize: state.pageSize,
    // pageNo: state.pageNo,
    appId: "core",
    categoryId: "core.dataSourceCategory"
  })
    .then((res) => {
      state.tableData = res.rows
      state.total = res.totalRecords
    })
    .finally(() => {
      state.loading = false
    })
}

// 打开新增子类弹窗
const addSonType = (row) => {
  state.xzzlFields = {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "",
    appId: "core",
    categoryId: "core.dataSourceCategory"
  }
  getzlwyId()
  state.tempParentNode = JSON.parse(JSON.stringify(row))
  getsjflList(row)
  state.showXzzlDia = true
}

// 获取子类分类唯一id
const getzlwyId = () => {
  flwyId({
    appId: "core",
    type: "CY"
  }).then((res) => {
    state.xzzlFields.nodeId = res.serialNumber
  })
}

// 确认新增子类
const confirmAddZl = () => {
  if (!state.xzzlFields.nodeText) {
    ElMessage({
      type: "error",
      message: "请输入分类名称"
    })
    return false
  }
  sjyflSave(
    Object.assign(state.xzzlFields, {
      parentNodeId: state.tempParentNode.nodeId
    })
  ).then((res) => {
    if (res.errcode !== 0) {
      ElMessage({
        type: "error",
        message: res.msg
      })
      return false
    }
    // state.pageNo = 1
    state.showXzzlDia = false
    ElMessage({
      message: "新增成功",
      type: "success"
    })
    getList()
  })
}

// 关闭新增子类
const closeXzflDia = () => {
  state.showXzzlDia = false
}

// 打开新增父类弹窗
const openFlDia = () => {
  state.xzflFields = {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "root",
    appId: "core",
    categoryId: "core.dataSourceCategory"
  }
  getflwyId()
  state.showXzflDia = true
}

// 确认新增父类
const confirmAddFl = () => {
  if (!state.xzflFields.nodeText) {
    ElMessage({
      type: "error",
      message: "请输入分类名称"
    })
    return false
  }
  sjyflSave(state.xzflFields).then((res) => {
    if (res.errcode !== 0) {
      ElMessage({
        type: "error",
        message: res.msg
      })
      return false
    }
    // state.pageNo = 1
    state.showXzzlDia = false
    ElMessage({
      message: "新增成功",
      type: "success"
    })
    getList()
    state.showXzflDia = false
  })
}

// 关闭新增父类
const closeXzFlDia = () => {
  state.showXzflDia = false
}

// 获取父类分类唯一id
const getflwyId = () => {
  flwyId({
    appId: "core",
    type: "CY"
  }).then((res) => {
    state.xzflFields.nodeId = res.serialNumber
  })
}

// 上级分类列表
const getsjflList = (row) => {
  sjflList({
    categoryId: "core.dataSourceCategory"
  }).then((res) => {
    state.sjflLists = res
    state.xzzlFields.parentNodeId = row.nodeId
    // state.showXzzlDia = true
  })
}

const deleteFl = (row) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteappservicecategory({
        ids: row.id
      }).then(() => {
        ElMessage({
          message: "删除成功",
          type: "success"
        })
        getList()
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 打开编辑弹窗
const editFl = (row) => {
  state.editFields = {
    nodeId: "",
    sort: "",
    nodeText: "",
    parentNodeId: "",
    appId: "",
    categoryId: "core.dataSourceCategory"
  }
  getsjflList(row)
  state.editFields = JSON.parse(JSON.stringify(row))
  state.showEditDia = true
}

// 确认编辑
const confirmEditFl = () => {
  if (!state.editFields.nodeText) {
    ElMessage({
      type: "error",
      message: "请输入分类名称"
    })
    return false
  }
  sjyflSave(state.editFields).then((res) => {
    if (res.errcode !== 0) {
      ElMessage({
        type: "error",
        message: res.msg
      })
      return false
    }
    state.showEditDia = false
    ElMessage({
      message: "编辑成功",
      type: "success"
    })
    getList()
  })
}

const closeEditlDia = () => {
  state.showEditDia = false
}

// const pageChange = ({ currentPage, pageSize }) => {
//   state.pageNo = currentPage
//   state.pageSize = pageSize
//   getList()
// }

// 初始化加载
getList()
</script>

<style lang="scss" scoped>
.sjyflgl-page {
  background-color: #fff;
  width: 100%;
  height: 100%;
  @include flex-column-start;
  overflow: hidden;
  .content-box {
    margin-top: 20px;
    flex: 1;
    height: 0;
    @include flex-column-start;
    .table-box {
      flex: 1;
      height: 0;
      overflow: hidden;
    }
  }
}
</style>
