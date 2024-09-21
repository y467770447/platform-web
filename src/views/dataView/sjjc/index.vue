<template>
  <div class="data-view-page">
    <div class="public-search-box">
      <div class="btn-box">
        <el-button type="primary" @click="createFun(ruleFormRef)">创建新应用</el-button>
        <el-button @click="flcontrol">分类管理</el-button>
        <el-button @click="refreshTable">刷新</el-button>
      </div>
      <div class="search-box">
        <el-select v-model="state.searchForm.categoryId" placeholder="请选择" @change="changeFunc" style="width: 200px">
          <el-option v-for="item in state.funcList" :key="item.nodeId" :label="item.nodeText" :value="item.nodeId" />
        </el-select>
      </div>
    </div>
    <div class="content-box">
      <div class="table-box">
        <el-table v-loading="state.loading" :data="state.functionList" style="width: 100%; height: 100%" row-key="id">
          <el-table-column type="selection" width="55" />
          <el-table-column property="applicationName" label="应用名称" width="240" show-overflow-tooltip>
            <template #default="{ row }">
              <el-link type="primary" @click="toPath(row)" :underline="false">{{ row.applicationName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column property="applicationId" label="应用id" width="240" />
          <el-table-column property="creator" label="开放权限" />
          <el-table-column property="creatorName" label="创建者" />
          <el-table-column property="createTime" label="创建时间" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="editFun(row)">修改</el-link>
              <el-link type="danger" :underline="false" @click="getyyfldelete(row)" style="margin-left: 10px"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      v-model="state.showEditDia"
      :title="state.isEdit ? '修改应用' : '创建应用'"
      width="500px"
      align-center
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormRef"
        :rules="state.rules"
        :model="state.editFields"
        label-width="auto"
        style="padding: 15px 30px 0 30px"
      >
        <el-form-item label="所属分类">
          <el-select v-model="state.editFields.categoryId" placeholder="请选择所属分类">
            <el-option v-for="item in state.yyssList" :key="item.id" :label="item.nodeText" :value="item.nodeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="应用名称" prop="applicationName">
          <el-input v-model="state.editFields.applicationName" />
        </el-form-item>
        <el-form-item label="应用id" prop="applicationId">
          <el-input v-model="state.editFields.applicationId" :disabled="state.isEdit" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="state.editFields.version" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="state.editFields.sort" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.editFields.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmEdit(ruleFormRef)">提 交</el-button>
          <el-button @click="closeEditDia">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <flControll ref="flControllRef" />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"
import { categorys, listAllNodes, listapps, yyfldelete, yyflSave } from "@/api/dataView/index.js"
import { ElMessage, ElMessageBox } from "element-plus"
import { getUserInfo } from "@/utils/cache/cookies"
import flControll from "@/views/dataView/sjjc/addFlControll.vue"
import { useRouter } from "vue-router"

const router = useRouter()

const flControllRef = ref()
const ruleFormRef = ref()

const state = reactive({
  functionList: [],
  funcList: [],
  searchForm: {
    categoryId: "*",
    configName: ""
  },
  showEditDia: false,
  showflcontrolDia: false,
  editFields: {
    categoryId: "缺省分类",
    applicationName: "",
    applicationId: "",
    version: "",
    sort: "",
    remark: "",
    creator: "admin",
    designer: "admin"
  },
  isEdit: false,
  loading: false,
  yyssList: [],
  rules: {
    applicationName: [
      {
        required: true,
        message: "请输入应用名称",
        trigger: "blur"
      }
    ],
    applicationId: [
      {
        required: true,
        message: "请输入应用id",
        trigger: "blur"
      }
    ]
  }
})

// 分类管理弹窗
const flcontrol = () => {
  flControllRef.value.openFlControll()
}

// 获取应用列表
const getlistapps = () => {
  state.loading = true
  listapps({
    categoryId: state.searchForm.categoryId
  })
    .then((res) => {
      state.functionList = res
    })
    .finally(() => {
      state.loading = false
    })
}

// 根据应用类别查询应用
const changeFunc = () => {
  getlistapps()
}

// 获取应用列表
const getcategorys = () => {
  categorys().then((res) => {
    // state.funcList = res
    const tempFun = [
      {
        nodeId: "*",
        nodeText: "所有应用"
      },
      {
        nodeId: "myapps",
        nodeText: "我的应用"
      }
    ]
    state.funcList = tempFun.concat(res)
  })
}

// 获取应用所属分类
const getlistAllNodes = () => {
  listAllNodes({
    categoryId: "ETLAppCategory",
    creatorOnly: "1"
  }).then((res) => {
    state.yyssList = res
  })
}

// 刷新
const refreshTable = () => {
  getlistapps()
}

// 新建应用
const createFun = (formEl) => {
  state.editFields = {
    categoryId: "缺省分类",
    applicationName: "",
    applicationId: "",
    version: "",
    sort: "",
    remark: "",
    creator: JSON.parse(getUserInfo()).userId,
    designer: JSON.parse(getUserInfo()).userId
  }
  state.showEditDia = true
  // formEl.resetFields()
  nextTick(() => {
    formEl.resetFields()
  })
  state.isEdit = false
  getlistAllNodes()
}

// 删除应用
const getyyfldelete = (row) => {
  ElMessageBox.confirm("确认删除?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      yyfldelete({
        ids: row.id
      }).then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        })
        getlistapps()
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
}

// 修改
const editFun = (row) => {
  state.editFields = JSON.parse(JSON.stringify(row))
  state.editFields.designer = JSON.stringify(row.designer)
  state.editFields.editor = JSON.parse(getUserInfo()).userId
  state.isEdit = true
  state.showEditDia = true
  getlistAllNodes()
}

// 确认修改
const confirmEdit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      yyflSave(state.editFields).then(() => {
        state.showEditDia = false
        ElMessage({
          type: "success",
          message: "操作成功"
        })
        closeEditDia()
        getlistapps()
      })
    } else {
      console.log("error submit!", fields)
    }
  })
}

// 取消修改
const closeEditDia = () => {
  state.showEditDia = false
  state.editFields = {
    categoryId: "缺省分类",
    applicationName: "",
    applicationId: "",
    version: "",
    sort: "",
    remark: "",
    creator: "",
    designer: ""
  }
}

const toPath = (row) => {
  router.push({ name: "dataView-list", query: row })
}

// 页面加载时调用
getcategorys()
getlistapps()
</script>

<style scoped lang="scss">
.data-view-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  @include flex-column-start;
  overflow: hidden;
  .content-box {
    flex: 1;
    @include flex-column-start;
    margin-top: 20px;
    overflow: hidden;
    .table-box {
      flex: 1;
      overflow: hidden;
    }
  }
  .public-search-box {
    width: 100%;
    .search-box {
      @include flex-right-center;
    }
  }
}
</style>
