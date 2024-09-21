<template>
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
        <el-form-item label="节点名称">
          <el-input v-model="state.nodeData.pNodeName" />
          <!--            <el-input v-model="state.nodeData.nodeName" />-->
        </el-form-item>
        <el-form-item label="节点id">
          <el-input v-model="state.nodeData.pNodeId" disabled />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="state.nodeData.remark" />
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
import { nodeDetail, writeInSave } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const state = reactive({
  showDrawer: false,
  parentNodeData: {},
  nodeData: {}
})

const openDrawer = (nodeData) => {
  state.showDrawer = true
  state.parentNodeData = JSON.parse(JSON.stringify(nodeData.attrs.nodeData))
  getnodeDetail()
}

// 获取节点信息
const getnodeDetail = () => {
  nodeDetail({
    processId: route.query.processId, // 测试"66bc45bbd7696e09fff62a83"，正式用route.query.id
    nodeId: state.parentNodeData.key // 测试"T00001"，正式用state.parentNodeData.key
  }).then((res) => {
    state.nodeData = res
    if (!state.nodeData.pNodeName) {
      state.nodeData.pNodeName = state.parentNodeData.nodeName
      state.nodeData.pNodeId = state.parentNodeData.key
      state.nodeData.pNodeType = state.parentNodeData.nodeType
    }
    // state.nodeData.pNodeName = state.nodeData.pNodeName ? state.nodeData.pNodeName : state.parentNodeData.nodeName
  })
}

const closeDrawer = () => {
  state.showDrawer = false
}
const saveFun = () => {
  const formData = new FormData()
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

defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">
.button-box {
  width: 100%;
  @include flex-center-center;
  margin-top: 30px;
}
</style>
