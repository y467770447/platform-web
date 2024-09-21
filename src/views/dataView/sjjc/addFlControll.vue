<template>
  <div>
    <el-dialog
      v-model="state.showflcontrolDia"
      title="分类管理"
      width="950px"
      align-center
      :close-on-click-modal="false"
    >
      <div class="button-box">
        <el-button type="primary" @click="addFl">新增分类</el-button>
        <el-button @click="refreshTable">刷新</el-button>
      </div>
      <div class="table-box">
        <el-table v-loading="state.loading" :data="state.tableList" style="width: 100%; height: 100%" row-key="id">
          <el-table-column type="selection" width="55" />
          <el-table-column property="nodeText" label="分类名称" width="240" show-overflow-tooltip />
          <el-table-column property="nodeId" label="分类id" width="240" />
          <el-table-column property="sort" label="排序" />
          <el-table-column property="creatorName" label="创建者" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="editFl(row)">修改</el-link>
              <el-link type="danger" :underline="false" @click="getdeleteFl(row)" style="margin-left: 10px"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      v-model="state.showEditDia"
      :title="state.isEdit ? '编辑' : '新增'"
      width="550px"
      align-center
      :close-on-click-modal="false"
      v-loading="state.addLoading"
    >
      <el-form :model="state.editFields" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="分类名称">
          <el-input v-model="state.editFields.nodeText" />
        </el-form-item>
        <el-form-item label="分类id">
          <el-input v-model="state.editFields.nodeId" disabled />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="state.editFields.sort" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmEdit">提 交</el-button>
          <el-button @click="closeEditDia">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { saveFl, deleteFl, syncListAllNodeTreeJson, FlwyId } from "@/api/dataView/index.js"
import { ElMessage, ElMessageBox } from "element-plus"

const state = reactive({
  showflcontrolDia: false,
  showEditDia: false,
  loading: false,
  addLoading: false,
  tableList: [],
  editFields: {
    nodeText: "",
    nodeId: "",
    sort: "",
    parentNodeId: "root",
    creator: "",
    categoryId: "ETLAppCategory"
  },
  isEdit: false
})

const getsyncListAllNodeTreeJson = () => {
  state.loading = true
  syncListAllNodeTreeJson({
    categoryId: "ETLAppCategory",
    rootName: "应用分类管理",
    creatorOnly: "1",
    sort: "",
    order: "",
    filters: "",
    searchFilters: ""
  })
    .then((res) => {
      state.tableList = res.rows
    })
    .finally(() => {
      state.loading = false
    })
}

const openFlControll = () => {
  getsyncListAllNodeTreeJson()
  state.showflcontrolDia = true
}

// 编辑
const editFl = (row) => {
  state.editFields = JSON.parse(JSON.stringify(row))
  state.isEdit = true
  state.showEditDia = true
}

// 新增
const addFl = () => {
  state.isEdit = false
  state.addLoading = true
  state.showEditDia = true
  state.editFields = {
    nodeText: "",
    nodeId: "",
    sort: "",
    parentNodeId: "root",
    creator: "",
    categoryId: "ETLAppCategory"
  }
  FlwyId()
    .then((res) => {
      state.editFields.nodeId = res.serialNumber
      state.addLoading = false
    })
    .finally(() => {
      state.addLoading = false
    })
}

// 确认编辑
const confirmEdit = () => {
  saveFl(state.editFields).then(() => {
    getsyncListAllNodeTreeJson()
    ElMessage({
      message: state.isEdit ? "编辑成功" : "新增成功",
      type: "success"
    })
    closeEditDia()
  })
}

// 关闭编辑弹窗
const closeEditDia = () => {
  state.showEditDia = false
  state.editFields = {
    nodeText: "",
    nodeId: "",
    sort: "",
    parentNodeId: "root",
    creator: "",
    categoryId: "ETLAppCategory"
  }
}

// 删除
const getdeleteFl = (row) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteFl({
        ids: row.id
      }).then(() => {
        ElMessage({
          message: "删除成功",
          type: "success"
        })
        getsyncListAllNodeTreeJson()
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

const refreshTable = () => {
  getsyncListAllNodeTreeJson()
}

defineExpose({
  openFlControll
})
</script>

<style scoped lang="scss">
.button-box {
  @include flex-left-center;
}
.table-box {
  width: 100%;
  height: 500px;
  margin-top: 20px;
}
</style>
