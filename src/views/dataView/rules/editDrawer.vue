<template>
  <el-drawer v-model="state.showDrawer" title="修改规则" size="55%">
    <div class="drawer-box-style">
      <el-form :model="state.editForm" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="所属分类">
          <el-select v-model="state.editForm.categoryId" placeholder="请选择" :disabled="state.isEdit">
            <el-option v-for="item in state.categoryIdList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="font-size: 14px; color: #888">指定本规则所属的分类</span>
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input v-model="state.editForm.ruleName" />
          <span style="font-size: 14px; color: #888">指定任何有意义且能描述本规则的说明</span>
        </el-form-item>
        <el-form-item label="Class Path">
          <el-input v-model="state.editForm.classPath" />
          <span style="font-size: 14px; color: #888">
            空表示由系统自动生成,也可直接指定一个继承了IETLBaseEvent接口的Class类
          </span>
        </el-form-item>
        <el-form-item label="规则说明">
          <el-input v-model="state.editForm.remark" />
        </el-form-item>
        <el-form-item label="响应示例">
          <el-input v-model="state.editForm.example" />
        </el-form-item>
        <el-form-item label="输入参数">
          <el-radio-group v-model="state.editForm.inputParam">
            <el-radio value="1" size="large">有</el-radio>
            <el-radio value="0" size="large">无</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="state.editForm.inputParam == '1'" class="have-param-box">
          <div class="top-button-box">
            <el-button type="primary" size="small" @click="addFields">新增参数</el-button>
            <el-button size="small" @click="deleteFields">删除字段</el-button>
          </div>
          <el-table
            :data="state.tableData"
            ref="tableRef"
            style="width: 100%; height: 300px"
            row-key="id"
            @row-click="rowClick"
            @selection-change="changeSelection"
          >
            <el-table-column type="selection" width="55" />
            <!--            <el-table-column type="index" label="序号" width="55" />-->
            <el-table-column property="fieldId" label="输入参数id" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-show="!row.isEdit">{{ row.fieldId }}</div>
                <el-input size="small" v-show="row.isEdit" v-model="row.fieldId" @change="changeTableData" />
              </template>
            </el-table-column>
            <el-table-column property="fieldName" label="参数中文说明" show-overflow-tooltip>
              <template #default="{ row }">
                <div v-show="!row.isEdit">{{ row.fieldName }}</div>
                <el-input size="small" v-show="row.isEdit" v-model="row.fieldName" @change="changeTableData" />
              </template>
            </el-table-column>
            <el-table-column property="fieldType" label="类型">
              <template #default="{ row }">
                <div v-show="!row.isEdit">{{ row.fieldType }}</div>
                <el-input size="small" v-show="row.isEdit" v-model="row.fieldType" @change="changeTableData" />
              </template>
            </el-table-column>
            <el-table-column property="required" label="必填">
              <template #default="{ row }">
                <el-checkbox v-model="row.required" label="" size="small" @change="changeTableData" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item label="公开示例">
          <el-radio-group v-model="state.editForm.publicType">
            <el-radio :value="0" size="large">仅自己可见</el-radio>
            <el-radio :value="1" size="large">公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="button-box">
        <el-button @click="closeDrawer">关闭</el-button>
        <el-button type="primary" @click="saveFun">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { reactive } from "vue"
import { ssflList } from "@/api/sjy/index.js"
import { ElMessage, ElMessageBox } from "element-plus"
import { saveRule } from "@/api/dataView/rules.js"

const emit = defineEmits(["refreshTable"])

const state = reactive({
  showDrawer: false,
  isEdit: false,
  editForm: {},
  categoryIdList: [],
  selectionList: [],
  tableData: []
})

const closeDrawer = () => {
  state.showDrawer = false
}

const openDrawer = (row) => {
  if (row) {
    state.isEdit = true
    state.editForm = JSON.parse(JSON.stringify(row))
    if (state.editForm.paramDes && JSON.parse(state.editForm.paramDes)) {
      state.tableData = JSON.parse(state.editForm.paramDes)
    }
    getssflList()
  } else {
    state.isEdit = false
    state.editForm.inputParam = "0"
    state.editForm.publicType = 1
  }
  state.showDrawer = true
}

const saveFun = () => {
  // state.showDrawer = true
  const formData = new FormData()
  for (const key in state.editForm) {
    formData.append(key, state.editForm[key])
  }
  saveRule(formData).then((res) => {
    if (res.errcode != "0") {
      ElMessage({
        type: "error",
        message: res.msg
      })
      return false
    } else {
      ElMessage({
        type: "success",
        message: "保存成功"
      })
      closeDrawer()
      emit("refreshTable")
    }
  })
}

// 所属分类
const getssflList = () => {
  ssflList({
    categoryId: "*",
    rootName: "规则分类"
  }).then((res) => {
    state.categoryIdList = res
  })
}

// 修改参数表格
const changeTableData = () => {
  state.editForm.paramDes = JSON.stringify(state.tableData)
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
      state.editForm.paramDes = JSON.stringify(state.tableData)
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

// 输入字段-选择行
const changeSelection = (selection) => {
  state.selectionList = selection
}

// 输入字段-点击表格行
const rowClick = (row) => {
  state.tableData.map((item) => {
    item.isEdit = false
  })
  row.isEdit = true
}

// 输入字段-新增字段
const addFields = () => {
  state.tableData.map((item) => {
    item.isEdit ? (item.isEdit = false) : ""
  })
  state.tableData.push({
    fieldId: "",
    fieldName: "",
    fieldType: "string",
    required: false,
    id: new Date().getTime(),
    isEdit: true
  })
  // state.editForm.paramDes = JSON.stringify(state.tableData)
}

defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">
.have-param-box {
  width: 100%;
  padding: 0 80px;
  margin-bottom: 10px;
}
.button-box {
  width: 100%;
  @include flex-center-center;
}
.top-button-box {
  width: 100%;
  @include flex-left-center;
}
</style>
