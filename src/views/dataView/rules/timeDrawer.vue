<template>
  <el-drawer v-model="state.showDrawer" title="修改规则" size="55%">
    <div class="drawer-box-style">
      <el-form :model="state.editForm" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="策略唯一id">
          <el-input v-model="state.editForm.ruleId" />
          <span style="font-size: 14px; color: #888">指定一个唯一Id,如果id已被引用修改id会引起错误</span>
        </el-form-item>
        <el-form-item label="策略名称">
          <el-input v-model="state.editForm.ruleName" />
          <span style="font-size: 14px; color: #888"> 指定任何有意义且能描述本策略的说明 </span>
        </el-form-item>
        <el-form-item label="定时表达式">
          <el-autocomplete
            v-model="state.editForm.expression"
            :fetch-suggestions="querySearch"
            value-key="value"
            clearable
            class="inline-input w-50"
            placeholder="请输入或选定时表达式"
          >
            <template #default="{ item }">
              {{ item.label }}
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="state.editForm.state">
            <el-radio value="1" size="large">启用</el-radio>
            <el-radio value="0" size="large">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.editForm.remark" />
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
import { ElMessage } from "element-plus"
import { saveTimeRule, timeRuleDetail, timeRuleId } from "@/api/dataView/rules.js"

const emit = defineEmits(["refreshTable"])

const state = reactive({
  showDrawer: false,
  isEdit: false,
  editForm: {},
  timeSelectList: [
    {
      label: "每2秒 执行任务",
      value: "0/2 * * * * ?"
    },
    {
      label: "每2分钟 执行任务",
      value: "0 0/2 * * * ?"
    },
    {
      label: "每月的1日的凌晨2点 执行任务",
      value: "0 0 2 1 * ?"
    },
    {
      label: "周一到周五每天上午10:15 执行任务",
      value: "0 15 10 ? * MON-FRI"
    },
    {
      label: "2024-2025年的每个月的最后一个星期五上午10:15 执行任务",
      value: "0 15 10 ? 6L 2024-2025"
    },
    {
      label: "每天上午10点，下午2点，4点 执行任务",
      value: "0 0 10,14,16 * * ?"
    },
    {
      label: "朝九晚五工作时间内每半小时 执行任务",
      value: "0 0/30 9-17 * * ?"
    },
    {
      label: "每天中午12点 执行任务",
      value: "0 0 12 * * ?"
    },
    {
      label: "周一至周五的上午10:15 执行任务",
      value: "0 15 10 ? * MON-FRI"
    },
    {
      label: "每月15日上午10:15 执行任务",
      value: "0 15 10 15 * ?"
    }
  ]
})

const closeDrawer = () => {
  state.showDrawer = false
}

const openDrawer = (row) => {
  if (row) {
    state.isEdit = true
    state.editForm = JSON.parse(JSON.stringify(row))
    timeRuleDetail(state.editForm.id).then((res) => {
      state.editForm = res
    })
  } else {
    state.isEdit = false
    state.editForm = {}
    state.editForm.state = "1"
    timeRuleId({
      appId: "core",
      type: "TIME"
    }).then((res) => {
      state.editForm.ruleId = res.serialNumber
    })
  }
  state.showDrawer = true
}

const saveFun = () => {
  if (!state.editForm.ruleId) {
    ElMessage({
      type: "warning",
      message: "请输入策略唯一id"
    })
    return false
  }
  if (!state.editForm.ruleName) {
    ElMessage({
      type: "warning",
      message: "请输入策略名称"
    })
    return false
  }
  if (!state.editForm.expression) {
    ElMessage({
      type: "warning",
      message: "请选择或输入定时表达式"
    })
    return false
  }
  const formData = new FormData()
  for (const key in state.editForm) {
    formData.append(key, state.editForm[key])
  }
  saveTimeRule(formData).then((res) => {
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

const querySearch = (queryString, cb) => {
  const results = queryString ? state.timeSelectList.filter(createFilter(queryString)) : state.timeSelectList
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
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
