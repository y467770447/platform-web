<template>
  <!--字段名修改-->
  <el-drawer v-model="state.showDrawer" title="节点属性" :with-header="false" size="55%">
    <div class="drawer-box-style">
      <el-steps style="max-width: 1000px; margin-bottom: 10px" :active="state.activeStep" align-center>
        <el-step title="基本属性" />
        <el-step title="输出字段" />
        <!--        <el-step title="输出选项" />-->
      </el-steps>
      <div v-show="state.activeStep === 0">
        <el-form :model="state.nodeData" label-width="auto" style="padding: 15px 30px 0 30px">
          <el-form-item label="节点名称">
            <el-input v-model="state.nodeData.pNodeName" />
          </el-form-item>
          <el-form-item label="节点id">
            <el-input v-model="state.nodeData.pNodeId" disabled />
          </el-form-item>
          <el-form-item label="源节点">
            <el-select v-model="state.nodeData.sourceNodeIds" filterable placeholder="请选择" @change="changeNode()">
              <el-option
                v-for="item in state.nodeList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="目标节点">
            <el-select v-model="state.nodeData.targetNodeIds" filterable placeholder="请选择" @change="changeNode()">
              <el-option
                v-for="item in state.nodeList"
                :key="item.nodeId"
                :label="item.nodeName"
                :value="item.nodeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="源字段匹配模式">
            <el-radio-group v-model="state.nodeData.patternFlag">
              <el-radio value="0" size="large">原字段Id精确匹配</el-radio>
              <el-radio value="1" size="large">正则表达式匹配(如:A(.*)表示以A开头)</el-radio>
              <el-radio value="2" size="large">条件匹配</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="state.nodeData.remark" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="state.activeStep === 1">
        <div class="write-in-box">
          <div class="top-button-box">
            <div class="button-item" @click="refreshFields">刷新导入字段</div>
            <!--            <div class="button-item" @click="writeFromSql">从SQL中分析</div>-->
            <div class="button-item" @click="deleteFields">删除列</div>
            <div class="button-item" @click="addFields">新增列</div>
            <div class="button-item" @click="copyFields">导入或拷贝字段配置</div>
          </div>
          <div class="table-box">
            <el-table
              :data="state.tableData"
              ref="tableRef"
              style="width: 100%; height: 100%"
              row-key="id"
              @row-click="rowClick"
              @selection-change="changeSelection"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column type="index" label="序号" width="55" />
              <el-table-column property="sourceColId" label="源字段id" width="240" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.sourceColId }}</div>
                  <el-input v-show="row.isEdit" v-model="row.sourceColId" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="transfer" label="删除源字段">
                <template #default="{ row }">
                  <el-switch v-model="row.transfer" />
                </template>
              </el-table-column>
              <el-table-column property="colId" label="目标字段id" show-overflow-tooltip>
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.colId }}</div>
                  <el-input v-show="row.isEdit" v-model="row.colId" @change="changeTableData" />
                </template>
              </el-table-column>
              <el-table-column property="remark" label="备注">
                <template #default="{ row }">
                  <div v-show="!row.isEdit">{{ row.remark }}</div>
                  <el-input v-show="row.isEdit" v-model="row.remark" @change="changeTableData" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--      <div v-show="state.activeStep === 2">-->
      <!--        <div class="relation-button-box">-->
      <!--          <el-button type="primary">刷新关系</el-button>-->
      <!--        </div>-->
      <!--        <div id="container" style="display: flex; justify-content: space-between; position: relative">-->
      <!--          <el-table-->
      <!--            ref="leftTable"-->
      <!--            :data="leftTreeData"-->
      <!--            :row-class-name="({ row }) => `leftRow Id-${row.id}`"-->
      <!--            style="width: 40%; margin-bottom: 20px; display: inline-block"-->
      <!--            row-key="id"-->
      <!--            border-->
      <!--            default-expand-all-->
      <!--          >-->
      <!--            <el-table-column prop="name" label="姓名" />-->
      <!--            <el-table-column prop="gender" label="性别" />-->
      <!--            <el-table-column prop="age" label="年龄" />-->
      <!--          </el-table>-->
      <!--          <el-table-->
      <!--            ref="rightTable"-->
      <!--            :data="rightTreeData"-->
      <!--            :row-class-name="({ row }) => `rightRow Id-${row.id}`"-->
      <!--            style="width: 40%; margin-bottom: 20px; display: inline-block"-->
      <!--            row-key="id"-->
      <!--            border-->
      <!--            default-expand-all-->
      <!--          >-->
      <!--            <el-table-column prop="name" label="姓名" />-->
      <!--            <el-table-column prop="gender" label="性别" />-->
      <!--            <el-table-column prop="age" label="年龄" />-->
      <!--          </el-table>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="button-box">
        <el-button v-if="state.activeStep > 0" type="primary" @click="beforeStep">上一步</el-button>
        <el-button v-if="state.activeStep < 1" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="state.activeStep === 1 || state.nodeData.isExist === 'yes'" type="primary" @click="saveFun"
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
  </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import { fieldmaps, nodeDetail, nodeSelectList, writeInSave } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
// import { jsPlumb } from "jsplumb"

const emit = defineEmits(["saveNodeDetail"])

const route = useRoute()

const tableRef = ref(null)
// const leftTable = ref(null)
// const rightTable = ref(null)

const state = reactive({
  nodeData: {},
  instance: null,
  parentNodeData: {},
  showDrawer: false,
  showCopyDia: false,
  activeStep: 0,
  tableData: [],
  sourceTable: [],
  targetTable: [],
  selectionList: [],
  tempTableColumns: ""
})

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
      state.nodeData.tableColumns = ""
      // state.nodeData.patternFlag = "0"
    } else {
      if (state.nodeData.tableColumns && Array.isArray(JSON.parse(state.nodeData.tableColumns))) {
        state.tableData = JSON.parse(state.nodeData.tableColumns)
      }
    }
    !state.nodeData.patternFlag ? (state.nodeData.patternFlag = "0") : ""
    // if (state.nodeData.dbConnId) {
    //   getlistAllTables()
    // }
    // state.nodeData.isExist = state.parentNodeData.isExist
  })
}

// 获取节点List
const getnodeSelectList = () => {
  nodeSelectList({
    processId: route.query.processId,
    nodeType: "*"
  }).then((res) => {
    state.nodeList = res
  })
}

// 更改源节点或者目标节点
const changeNode = () => {
  if (state.nodeData.sourceNodeIds && state.nodeData.targetNodeIds) {
    getfieldmaps()
  }
}

// 导入table
const getfieldmaps = () => {
  fieldmaps({
    processId: route.query.processId,
    nodeId: state.nodeData.pNodeId,
    sourceNodeIds: state.nodeData.sourceNodeIds,
    targetNodeIds: state.nodeData.targetNodeIds
  }).then((res) => {
    state.tableData = res.fieldMapConfigs
    state.nodeData.tableColumns = JSON.stringify(res.fieldMapConfigs)
    // state.nodeData.sourceColIds = res.sourceColIds
    // state.nodeData.targetColIds = res.targetColIds
    // for (const key in res.sourceColIds) {
    //   state.sourceTable.push({
    //     field: key,
    //     type: res.sourceColIds[key]
    //   })
    // }
    // for (const key in res.targetColIds) {
    //   state.targetTable.push({
    //     field: key,
    //     type: res.targetColIds[key]
    //   })
    // }
    ElMessage({
      message: "导入成功",
      type: "success"
    })
  })
}

// 测试
// const leftData = ref([
//   { id: 1, name: "张三", gender: "男", age: 23, parentId: null, hasChild: true },
//   { id: 2, name: "李四", gender: "男", age: 22, parentId: null, hasChild: false },
//   { id: 3, name: "坤坤", gender: "女", age: 24, parentId: 1, hasChild: true },
//   { id: 4, name: "小黑子", gender: "男", age: 25, parentId: 3, hasChild: false }
// ])
// const leftTreeData = ref([
//   {
//     id: 1,
//     name: "张三",
//     gender: "男",
//     age: 23,
//     parentId: null,
//     children: [
//       {
//         id: 3,
//         name: "坤坤",
//         gender: "女",
//         age: 24,
//         parentId: 1,
//         children: [{ id: 4, name: "小黑子", gender: "男", age: 25, parentId: 3 }]
//       }
//     ]
//   },
//   { id: 2, name: "李四", gender: "男", age: 22, parentId: null }
// ])
//
// // 右侧静态数据
// const rightData = ref([
//   { id: 5, name: "柯洁", gender: "男", age: 23, parentId: null, hasChild: true },
//   { id: 6, name: "战鹰", gender: "女", age: 30, parentId: 5, hasChild: false },
//   { id: 7, name: "唱跳", gender: "男", age: 24, parentId: null, hasChild: false },
//   { id: 8, name: "rap", gender: "男", age: 25, parentId: null, hasChild: false }
// ])
// const rightTreeData = ref([
//   {
//     id: 5,
//     name: "柯洁",
//     gender: "男",
//     age: 23,
//     parentId: null,
//     children: [{ id: 6, name: "战鹰", gender: "女", age: 30, parentId: 6 }]
//   },
//   { id: 7, name: "唱跳", gender: "男", age: 24, parentId: null },
//   { id: 8, name: "rap", gender: "男", age: 25, parentId: null }
// ])
//
// // 初始化jsplumb
// const init = () => {
//   state.instance = jsPlumb.getInstance({
//     Connector: "Straight", //连接线形状 Bezier: 贝塞尔曲线 Flowchart: 具有90度转折点的流程线 StateMachine: 状态机 Straight: 直线
//     PaintStyle: { strokeWidth: 3, stroke: "#dfbee7" }, //连接线样式
//     Endpoint: ["Blank", { radius: 1 }], //端点
//     anchor: "Right",
//     // 绘制箭头
//     Overlays: [["Arrow", { width: 12, length: 12, location: 1 }]],
//     EndpointStyle: { fill: "#000000" }, //端点样式
//     Container: "container", //目标容器id
//     ListStyle: {
//       endpoint: ["Rectangle", { width: 30, height: 30 }]
//     }
//   })
// }
//
// // 截取元素类名中的id
// const interceptId = (className) => {
//   return className.slice(className.indexOf("-") + 1)
// }
//
// const setContainer = () => {
//   const leftElList = document.querySelectorAll(".leftRow") // 左侧行元素集合
//   const rightElList = document.querySelectorAll(".rightRow") // 右侧行元素集合
//   // 将dom元素设置为连线的起点或者终点 设置了起点的元素才能开始连线 设置为终点的元素才能为连线终点
//   state.instance.batch(function () {
//     ;[leftElList, rightElList].forEach((trList, index) => {
//       trList.forEach((tr) => {
//         const id = interceptId(tr.classList[2])
//         if (index === 0) {
//           // const item = leftData.value.find((i) => i.id == id)
//           // 判断是否有子项,若没有则设置为起点
//           // !item?.hasChild &&
//           state.instance.makeSource(tr, {
//             allowLoopback: false,
//             anchor: ["Right"], // 设置端点位置
//             maxConnections: 1
//           })
//         } else {
//           // const item = rightData.value.find((i) => i.id == id)
//           // 判断是否有子项,若没有则设置为终点
//           // !item?.hasChild &&
//           state.instance.makeTarget(tr, {
//             anchor: ["Left"],
//             maxConnections: 1
//           })
//         }
//       })
//     })
//   })
// }
//
// const initJsPlumb = () => {
//   jsPlumb.ready(function () {
//     // 初始化jsPlumb 创建jsPlumb实例
//     init()
//     // 设置可以为连线起点和连线终点的元素
//     setContainer()
//   })
// }
//
// onMounted(() => {
//   nextTick(() => {
//     initJsPlumb()
//   })
// })

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

const openDrawer = (nodeData) => {
  state.activeStep = 0
  state.showDrawer = true
  state.parentNodeData = JSON.parse(JSON.stringify(nodeData.attrs.nodeData))
  getnodeSelectList()
  getnodeDetail()
}

// 上一步
const beforeStep = () => {
  state.activeStep--
}

// 下一步
const nextStep = () => {
  state.activeStep++
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

// 输入字段-选择行
const changeSelection = (selection) => {
  state.selectionList = selection
}

// 输入字段-修改表格
const changeTableData = () => {
  // state.nodeData.tableColumns = JSON.stringify(state.tableData)
  state.nodeData.tableColumns = JSON.stringify(
    state.tableData.filter((item) => {
      return item.sourceColId
    })
  )
}

// 导入字段
const refreshFields = () => {
  ElMessageBox.confirm("如果当前重新导入字段，将会取消当前未保存的编辑!", "重新导入字段?", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      getfieldmaps()
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消"
      })
    })
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
      // state.nodeData.tableColumns = JSON.stringify(state.tableData)
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
    sourceColId: "",
    transfer: false,
    colId: "",
    remark: "",
    isEdit: true,
    id: new Date().getTime()
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

const setForTable = () => {
  state.tableData = JSON.parse(state.tempTableColumns)
  state.nodeData.tableColumns = state.tempTableColumns
  closeCopyDia()
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
      height: 600px;
      margin-top: 20px;
    }
  }
  .relation-table-box {
    width: 100%;
    height: 500px;
    @include flex-between-center;
  }
}
</style>
