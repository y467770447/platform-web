<template>
  <div>
    <el-dialog
      v-model="state.showEditDia"
      :title="state.isEdit ? '修改流程' : '创建流程'"
      width="850px"
      align-center
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormRef"
        :model="state.editFields"
        label-width="auto"
        style="padding: 15px 30px 0 30px"
        :rules="state.rules"
      >
        <el-form-item label="所属应用" prop="applicationId">
          <el-select v-model="state.editFields.applicationId" placeholder="请选择所属应用">
            <el-option
              v-for="item in state.yyssList"
              :key="item.id"
              :label="item.applicationName"
              :value="item.applicationId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流程名称" prop="configName">
          <el-input v-model="state.editFields.configName" />
        </el-form-item>
        <el-form-item label="流程编号" prop="configId">
          <el-input v-model="state.editFields.configId" :disabled="state.isEdit" />
        </el-form-item>
        <el-form-item label="流程管理员">
          <el-input v-model="state.editFields.processOwners" :disabled="true" />
        </el-form-item>
        <el-form-item label="运行方式">
          <el-radio-group v-model="state.editFields.state" @change="changeRunType">
            <el-radio value="2">手动触发</el-radio>
            <el-radio value="1">定时自动调度</el-radio>
            <!--            <el-radio value="3">依赖上级流程</el-radio>-->
            <el-radio value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="state.editFields.state === '1'" label="调度策略">
          <el-select v-model="state.editFields.expression" placeholder="请选择调度策略">
            <el-option v-for="item in state.expressionList" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务重要性">
          <el-input type="number" max="10" v-model="state.editFields.taskLevel" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.editFields.remark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-btn">
          <el-button type="primary" @click="confirmEdit(ruleFormRef)">提 交</el-button>
          <el-button @click="closeEditDia(ruleFormRef)">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue"
import { processId, savestrategy, serialnumber, ssyyselect, strategy } from "@/api/dataView/index.js"
import { getUserInfo } from "@/utils/cache/cookies"
import { ElMessage } from "element-plus"

const emit = defineEmits(["updateTable"])

const ruleFormRef = ref()

const state = reactive({
  showEditDia: false,
  isEdit: false,
  editFields: {
    applicationId: "",
    categoryId: "all",
    configName: "",
    configId: "",
    processOwners: "",
    state: "2",
    expression: "",
    taskLevel: "",
    remark: ""
  },
  yyssList: [],
  categoryList: [],
  executeServer: [],
  expressionList: [],
  rules: {
    applicationId: [
      {
        required: true,
        message: "请选择所属应用",
        trigger: "change"
      }
    ],
    configName: [
      {
        required: true,
        message: "请输入流程名称",
        trigger: "blur"
      }
    ],
    configId: [
      {
        required: true,
        message: "请输入流程编号",
        trigger: "blur"
      }
    ]
  }
})

const openEditDia = (type, row) => {
  getssyyselect()
  getstrategy()
  if (type === "0") {
    state.editFields = {
      applicationId: "",
      categoryId: "all",
      configName: "",
      configId: "",
      processOwners: "",
      state: "2",
      expression: "",
      taskLevel: "",
      remark: ""
    }
    state.isEdit = false
    state.editFields.processOwners = JSON.parse(getUserInfo()).userId
    getserialnumber()
  } else if (type === "1") {
    getprocessId(row.id)
    state.isEdit = true
  }
  state.showEditDia = true
}

// 运行方式改变
const changeRunType = () => {
  // if (state.editFields.runType === '0') {}
}

// 修改时获取流程信息
const getprocessId = (id) => {
  processId(id).then((res) => {
    state.editFields = res
  })
}

// 新增时获取流程编号
const getserialnumber = () => {
  serialnumber().then((res) => {
    state.editFields.configId = res.serialNumber
  })
}

// 获取流程所属应用list
const getssyyselect = () => {
  ssyyselect().then((res) => {
    state.yyssList = res
  })
}

// 获取调度策略
const getstrategy = () => {
  strategy().then((res) => {
    state.expressionList = res
  })
}

// 确认保存
const confirmEdit = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      savestrategy(state.editFields)
        .then((res) => {
          ElMessage({
            message: res.msg,
            type: "success"
          })
          emit("updateTable")
          closeEditDia(ruleFormRef.value)
        })
        .catch((err) => {
          ElMessage({
            message: err.msg,
            type: "error"
          })
        })
    } else {
      console.log("error submit!", fields)
    }
  })
}

const closeEditDia = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  state.showEditDia = false
}

defineExpose({
  openEditDia
})
</script>

<style scoped lang="scss"></style>
