<template>
  <div class="lcsj-page" v-loading="state.isLoading">
    <div class="left-components-box">
      <el-input v-model="state.filterText" style="width: 240px" placeholder="搜索组件" />
      <div class="selected-tree-box">
        <el-tree
          ref="treeRef"
          :data="state.lcsjList"
          node-key="key"
          :props="state.defaultProps"
          :default-expand-all="false"
          highlight-current
          :expand-on-click-node="true"
          :render-content="renderContent"
          :default-expanded-keys="['1']"
          @filter-node-method="filterNode"
          @node-drag-start="dragStart"
          draggable
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
        />
      </div>
    </div>
    <div class="content-box">
      <div class="tool-btn-box">
        <div class="tool-btn-item" @click="saveGraph">保存</div>
        <div class="tool-btn-item" @click="runProcess">运行</div>
      </div>
      <div id="graph-box" @dragover.prevent @drop="dragDropGraph($event)" />
      <!--右键菜单-->
      <div id="contextMenu">
        <div id="contextMenu_item" @click="openNodeDeawer">
          <img src="@/assets/dataView/node_detail.png" alt="" />
          节点属性
        </div>
        <div id="contextMenu_item" @click="copyNode">
          <img src="@/assets/dataView/copy.png" alt="" />
          复制
        </div>
        <div id="contextMenu_item" @click="deleteNode">
          <img src="@/assets/dataView/delete.png" alt="" />
          删除
        </div>
      </div>
      <!--右键菜单-->
      <div id="contextMenu_edge">
        <div id="contextMenu_edge_item" @click="deleteEdge">
          <img src="@/assets/dataView/delete.png" alt="" />
          删除
        </div>
      </div>
    </div>
    <!--    开始-->
    <startCom ref="startComRef" @saveNodeDetail="saveGraph" />
    <!--    结束-->
    <endCom ref="endComRef" @saveNodeDetail="saveGraph" />
    <!--    表输入-->
    <sqlReadNodeCom ref="sqlReadNodeRef" @saveNodeDetail="saveGraph" />
    <!--    表输出-->
    <jdbcWriteNode ref="jdbcWriteNodeRef" @saveNodeDetail="saveGraph" />
    <!--    excel输入-->
    <excelReader ref="excelReaderRef" @saveNodeDetail="saveGraph" />
    <!--    excel输出-->
    <excelWrite ref="excelWriteRef" @saveNodeDetail="saveGraph" />
    <!--    创建数据库表-->
    <createTableNode ref="createTableNodeRef" @saveNodeDetail="saveGraph" />
    <!--    字段名修改-->
    <fieldMappingNode ref="fieldMappingNodeRef" @saveNodeDetail="saveGraph" />
    <!--    数据清洗转换-->
    <dataTransformNode ref="dataTransformNodeRef" @saveNodeDetail="saveGraph" />
    <!--    字段值修改-->
    <valueMappingNode ref="valueMappingNodeRef" @saveNodeDetail="saveGraph" />
    <!--    数据质量过滤-->
    <dataFilterNode ref="dataFilterNodeRef" @saveNodeDetail="saveGraph" />
    <!--    执行SQL脚本-->
    <sqlExecuterNode ref="sqlExecuterNodeRef" @saveNodeDetail="saveGraph" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import TreeRender from "./lcsjTreeRender.vue"
import { Graph, Shape } from "@antv/x6"
import { ports } from "./registerGraph.js"
import { lcsjMenu, canvasDetail, canvasSave } from "@/api/dataView/lcsj.js"
import { useRoute } from "vue-router"
import startCom from "./nodeSetDrawer/startCom.vue"
import endCom from "./nodeSetDrawer/endCom.vue"
import sqlReadNodeCom from "./nodeSetDrawer/sqlReadNode.vue"
import jdbcWriteNode from "./nodeSetDrawer/jdbcWriteNodeRef.vue"
import excelReader from "./nodeSetDrawer/excelReader.vue"
import excelWrite from "./nodeSetDrawer/excelWriteNode.vue"
import createTableNode from "./nodeSetDrawer/createTableNode.vue"
import fieldMappingNode from "./nodeSetDrawer/fieldMappingNode.vue"
import dataTransformNode from "./nodeSetDrawer/dataTransformNode.vue"
import valueMappingNode from "./nodeSetDrawer/valueMappingNode.vue"
import dataFilterNode from "./nodeSetDrawer/dataFilterNode.vue"
import sqlExecuterNode from "./nodeSetDrawer/sqlExecuterNode.vue"
import { ElMessage } from "element-plus"
import { runstrategy } from "@/api/dataView"

const route = useRoute()

const treeRef = ref()
const sqlReadNodeRef = ref()
const jdbcWriteNodeRef = ref()
const startComRef = ref()
const endComRef = ref()
const excelReaderRef = ref()
const excelWriteRef = ref()
const createTableNodeRef = ref()
const fieldMappingNodeRef = ref()
const dataTransformNodeRef = ref()
const valueMappingNodeRef = ref()
const dataFilterNodeRef = ref()
const sqlExecuterNodeRef = ref()

const state = reactive({
  filterText: "",
  dragNode: {},
  lcsjList: [],
  defaultProps: {
    label: "nodeName",
    children: "children"
  },
  isLoading: false,
  addNodeFun: {} as any,
  addEdgeFun: {} as any,
  removerNodeFun: {} as any,
  removerEdgeFun: {} as any,
  getGraph: {} as any,
  applicationId: "" as any,
  getGraphDataFun: {} as any,
  sendData: {
    nodeDataArray: [],
    linkDataArray: []
  },
  tempRightClickData: {}, // 右键存储节点的数据
  tempRightClickEdgeData: {}, // 右键存储边的数据
  canvasDetail: {} as any,
  keyId: 1,
  sekeyId: 1,
  lineKeyId: 1
})

watch(
  () => state.filterText,
  (val) => {
    treeRef.value!.filter(val)
  }
)

const getlcsjMenu = () => {
  lcsjMenu({
    applicationId: state.applicationId
  }).then((res: any) => {
    state.lcsjList = res
  })
}

// 获取画布详情
const getcanvasDetail = () => {
  canvasDetail(route.query.processId).then(async (res: any) => {
    state.canvasDetail = JSON.parse(res.processModel)
    await initGraph()
    state.canvasDetail.nodeDataArray.map((item: any) => {
      Number(item.key.split("T")[1]) >= state.keyId ? (state.keyId = Number(item.key.split("T")[1]) + 1) : ""
      Number(item.key.split("E")[1]) >= state.sekeyId ? (state.sekeyId = Number(item.key.split("E")[1]) + 1) : ""
      state.dragNode = JSON.parse(JSON.stringify(item))
      state.dragNode.isExist = true
      state.addNodeFun(false, item)
    })
    state.canvasDetail.linkDataArray.map((edgeItem: any) => {
      Number(edgeItem.key.split("R")[1]) > state.lineKeyId
        ? (state.lineKeyId = Number(edgeItem.key.split("R")[1]) + 1)
        : ""
      state.addEdgeFun(edgeItem)
    })
  })
}

// 保存画布
const saveGraph = () => {
  state.getGraphDataFun()
}

// 运行
const runProcess = () => {
  state.getGraphDataFun(true)
}

// 删除节点
const deleteNode = () => {
  state.removerNodeFun(state.tempRightClickData)
}

// 删除边
const deleteEdge = () => {
  state.removerEdgeFun(state.tempRightClickEdgeData)
}

// 复制节点
const copyNode = () => {
  const menu: any = document.getElementById("contextMenu")
  menu.style.left = "-3000px"
  menu.style.top = "0px"
  state.dragNode = JSON.parse(JSON.stringify(state.tempRightClickData.attrs.nodeData))
  if (state.dragNode.nodeType !== "start" && state.dragNode.nodeType !== "end") {
    state.dragNode.key = "T" + String(state.keyId).padStart("5", "0")
    state.dragNode.nodeConfigId = state.dragNode.id
    state.keyId++
  } else {
    state.dragNode.key = "E" + String(state.sekeyId).padStart("5", "0")
    state.dragNode.nodeConfigId = state.dragNode.id
    state.sekeyId++
  }
  state.dragNode.x = state.dragNode.x + 60
  state.dragNode.y = state.dragNode.y + 30
  state.dragNode.id = new Date().getTime()
  state.addNodeFun(false, state.dragNode)
}

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const initGraph = () => {
  const graph = new Graph({
    container: document.getElementById("graph-box")!,
    panning: true,
    grid: true,

    connecting: {
      router: "manhattan",
      connector: {
        name: "rounded",
        args: {
          radius: 8
        }
      },
      anchor: "center",
      connectionPoint: "anchor",
      allowBlank: false,
      snap: {
        radius: 20
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2,
              targetMarker: {
                name: "block",
                width: 12,
                height: 8
              }
            },
            key: "R" + String(state.lineKeyId++).padStart("5", "0")
          },
          zIndex: 0
        })
      },
      validateConnection({ targetMagnet }) {
        return !!targetMagnet
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#5F95FF",
            stroke: "#5F95FF"
          }
        }
      }
    }
  })
  const menu: any = document.getElementById("contextMenu")
  const menuEdge: any = document.getElementById("contextMenu_edge")

  state.addNodeFun = (node: any, item: any) => {
    let nodeX = 0
    let nodeY = 0
    const tempId = node ? new Date().getTime() : item.id
    const tempPorts = node ? ports : item.ports
    if (node && node.layerX) {
      nodeX = node.layerX - graph.mousewheel.options.x - 30
      nodeY = node.layerY - graph.mousewheel.options.y - 30
    } else {
      nodeX = state.dragNode.x
      nodeY = state.dragNode.y
    }
    if (state.dragNode.nodeType === "start" || state.dragNode.nodeType === "end") {
      graph.addNode({
        x: nodeX,
        y: nodeY,
        shape: "circle",
        width: 60,
        height: 60,
        id: tempId,
        ports: { ...tempPorts },
        attrs: {
          body: {
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "rgba(95,149,255,0.2)",
            refWidth: 1,
            refHeight: 1
          },
          title: {
            text: state.dragNode.nodeName,
            fill: "rgba(0,0,0,0.85)",
            fontSize: 12,
            "text-anchor": "middle"
          },
          nodeData: Object.assign(state.dragNode, {
            x: nodeX,
            y: nodeY,
            id: tempId,
            text: state.dragNode.nodeName
          })
        },
        markup: [
          {
            tagName: "circle",
            selector: "body"
          },
          {
            tagName: "text",
            selector: "title"
          }
        ]
      })
    } else {
      graph.addNode({
        x: nodeX - 70,
        y: nodeY,
        // shape: "custom-node",
        width: 220,
        height: 60,
        id: tempId,
        ports: { ...tempPorts },
        attrs: {
          body: {
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "rgba(255, 255, 255, 0.5)",
            refWidth: 1,
            refHeight: 1
          },
          image: {
            "xlink:href": new URL(`../../../assets/dataView/nodeIcon/${state.dragNode.nodeType}.png`, import.meta.url)
              .href,
            width: 16,
            height: 16,
            x: 10,
            y: 10
          },
          title: {
            text: state.dragNode.nodeName,
            refX: 37,
            refY: 12,
            fill: "rgba(0,0,0,0.85)",
            fontSize: 14,
            "text-anchor": "start"
          },
          key: {
            text: state.dragNode.key,
            refX: 162,
            refY: 12,
            fill: "rgb(0,115,255)",
            fontSize: 14,
            "text-anchor": "start"
          },
          text: {
            text: state.dragNode.tip,
            refX: 37,
            refY: 42,
            fontSize: 12,
            fill: "rgba(0,0,0,0.6)",
            "text-anchor": "start"
          },
          nodeData: Object.assign(state.dragNode, {
            x: nodeX,
            y: nodeY,
            id: tempId,
            text: state.dragNode.nodeName
          })
        },
        markup: [
          {
            tagName: "rect",
            selector: "body"
          },
          {
            tagName: "image",
            selector: "image"
          },
          {
            tagName: "text",
            selector: "title"
          },
          {
            tagName: "text",
            selector: "key"
          },
          {
            tagName: "text",
            selector: "text"
          }
        ]
      })
    }
  }

  state.getGraph = () => {
    return graph
  }

  state.addEdgeFun = (item) => {
    graph.addEdge({
      id: item.id,
      lineType: item.lineType,
      routerId: item.routerId,
      source: item.source,
      target: item.target,
      from: item.from,
      to: item.to,
      attrs: {
        line: {
          stroke: "#A2B1C3",
          strokeWidth: 2,
          targetMarker: {
            name: "block",
            width: 12,
            height: 8
          }
        },
        key: item.key
      },
      zIndex: 0
    })
  }

  state.getGraphDataFun = (isRun) => {
    state.isLoading = true
    const tempNodes = graph.getNodes()
    const tempEdges = graph.getEdges()
    state.sendData.nodeDataArray = []
    state.sendData.linkDataArray = []
    let tempPorts = {} as any
    tempNodes.map((item) => {
      if (item.attrs) {
        tempPorts = item.attrs.nodeData
        tempPorts.ports = item.ports
        state.sendData.nodeDataArray.push(tempPorts)
      }
    })
    tempEdges.map((item) => {
      let tempFrom = ""
      let tempTo = ""
      tempNodes.map((ite) => {
        if (item.source.cell === ite.id) {
          tempFrom = ite.attrs.nodeData.key
        }
        if (item.target.cell === ite.id) {
          tempTo = ite.attrs.nodeData.key
        }
      })
      state.sendData.linkDataArray.push({
        routerId: item.attrs.key,
        from: tempFrom,
        to: tempTo,
        key: item.attrs.key,
        label: item.label,
        lineType: "Curved",
        id: item.id,
        source: item.source,
        target: item.target,
        attrs: {
          line: {
            stroke: "#A2B1C3",
            strokeWidth: 2,
            targetMarker: {
              name: "block",
              width: 12,
              height: 8
            }
          },
          key: item.key
        }
      })
    })
    // 测试数据清空
    // state.sendData.nodeDataArray = []
    // state.sendData.linkDataArray = []
    const formData = new FormData()
    formData.append("appId", "etl")
    formData.append("processId", route.query.processId)
    formData.append("processModel", JSON.stringify(state.sendData))
    canvasSave(formData)
      .then(() => {
        if (isRun) {
          runstrategy({
            processId: route.query.processId
          }).then((res) => {
            ElMessage({
              type: res.resultCode == "0" ? "error" : "success",
              message: res.msg,
              plain: true
            })
          })
        } else {
          ElMessage({
            type: "success",
            message: "保存成功"
          })
        }
      })
      .finally(() => {
        state.isLoading = false
      })
  }

  state.removerNodeFun = (node) => {
    graph.removeNode(node)
    menu.style.left = "-3000px"
    menu.style.top = "0px"
  }

  state.removerEdgeFun = (edge) => {
    graph.removeEdge(edge)
    menuEdge.style.left = "-3000px"
    menuEdge.style.top = "0px"
  }

  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i += 1) {
      ports[i].style.visibility = show ? "visible" : "hidden"
    }
  }
  graph.on("node:mouseenter", () => {
    const container = document.getElementById("graph-box")!
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  graph.on("node:mouseleave", () => {
    const container = document.getElementById("graph-box")!
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
  graph.on("blank:click", () => {
    menu.style.left = -3000 + "px"
    menu.style.top = 0 + "px"
    menuEdge.style.left = -3000 + "px"
    menuEdge.style.top = 0 + "px"
  })
  graph.on("cell:click", () => {
    menu.style.left = "-3000px"
    menu.style.top = "0px"
    menuEdge.style.left = "-3000px"
    menuEdge.style.top = "0px"
  })

  graph.on("node:contextmenu", function (evt) {
    menu.style.left = evt.x + graph.mousewheel.options.x + "px"
    menu.style.top = evt.y + graph.mousewheel.options.y + 60 + "px"
    state.tempRightClickData = evt.node
    menuEdge.style.left = "-3000px"
    menuEdge.style.top = "0px"
  })

  graph.on("edge:contextmenu", function (evt) {
    menuEdge.style.left = evt.x + graph.mousewheel.options.x + "px"
    menuEdge.style.top = evt.y + graph.mousewheel.options.y + 60 + "px"
    state.tempRightClickEdgeData = evt.edge
    menu.style.left = "-3000px"
    menu.style.top = "0px"
  })

  graph.on("translate", () => {
    menu.style.left = "-3000px"
    menu.style.top = "0px"
    menuEdge.style.left = "-3000px"
    menuEdge.style.top = "0px"
  })

  graph.on("node:moving", () => {
    menu.style.left = "-3000px"
    menu.style.top = "0px"
    menuEdge.style.left = "-3000px"
    menuEdge.style.top = "0px"
  })

  graph.on("node:dblclick", (evt) => {
    state.tempRightClickData = evt.node
    openNodeDeawer()
  })

  graph.on("node:mouseup", (e) => {
    if (e && e.node && e.node.attrs.nodeData.nodeType !== "start" && e.node.attrs.nodeData.nodeType !== "end") {
      e.node.attrs.nodeData.x = e.node.getBBox().x + 70
      e.node.attrs.nodeData.y = e.node.getBBox().y
    } else if (
      e &&
      e.node &&
      (e.node.attrs.nodeData.nodeType === "start" || e.node.attrs.nodeData.nodeType === "end")
    ) {
      e.node.attrs.nodeData.x = e.node.getBBox().x
      e.node.attrs.nodeData.y = e.node.getBBox().y
    }
  })
}

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const renderContent = (
  h,
  {
    node,
    data,
    store
  }: {
    node: Node
    data: Tree
    store: Node["store"]
  }
) => {
  return h(TreeRender, {
    DATA: data,
    NODE: node,
    STORE: store
  })
}

const dragDropGraph = (node: any) => {
  if (state.dragNode.nodeType !== "start" && state.dragNode.nodeType !== "end") {
    state.dragNode.key = "T" + String(state.keyId).padStart("5", "0")
    state.dragNode.nodeConfigId = state.dragNode.id
    state.keyId++
  } else {
    state.dragNode.key = "E" + String(state.sekeyId).padStart("5", "0")
    state.dragNode.nodeConfigId = state.dragNode.id
    state.sekeyId++
  }
  state.dragNode.name = state.dragNode.key
  state.addNodeFun(node)
}

const dragStart = (node: any) => {
  state.dragNode = JSON.parse(JSON.stringify(node.data))
}

const allowDrag = (draggingNode: Node) => {
  return draggingNode.level >= 2
}

const allowDrop = () => {
  return false
}

const openNodeDeawer = () => {
  const menu: any = document.getElementById("contextMenu")
  menu.style.left = "-3000px"
  menu.style.top = "0px"
  state.tempRightClickData.attrs.nodeData.nodeType === "sqlReadNode"
    ? sqlReadNodeRef.value.openDrawer(state.tempRightClickData)
    : state.tempRightClickData.attrs.nodeData.nodeType === "start"
      ? startComRef.value.openDrawer(state.tempRightClickData)
      : state.tempRightClickData.attrs.nodeData.nodeType === "end"
        ? endComRef.value.openDrawer(state.tempRightClickData)
        : state.tempRightClickData.attrs.nodeData.nodeType === "jdbcWriteNode"
          ? jdbcWriteNodeRef.value.openDrawer(state.tempRightClickData)
          : state.tempRightClickData.attrs.nodeData.nodeType === "excelReadNode"
            ? excelReaderRef.value.openDrawer(state.tempRightClickData)
            : state.tempRightClickData.attrs.nodeData.nodeType === "excelWriteNode"
              ? excelWriteRef.value.openDrawer(state.tempRightClickData)
              : state.tempRightClickData.attrs.nodeData.nodeType === "createTableNode"
                ? createTableNodeRef.value.openDrawer(state.tempRightClickData)
                : state.tempRightClickData.attrs.nodeData.nodeType === "fieldMappingNode"
                  ? fieldMappingNodeRef.value.openDrawer(state.tempRightClickData)
                  : state.tempRightClickData.attrs.nodeData.nodeType === "dataTransformNode"
                    ? dataTransformNodeRef.value.openDrawer(state.tempRightClickData)
                    : state.tempRightClickData.attrs.nodeData.nodeType === "valueMappingNode"
                      ? valueMappingNodeRef.value.openDrawer(state.tempRightClickData)
                      : state.tempRightClickData.attrs.nodeData.nodeType === "dataFilterNode"
                        ? dataFilterNodeRef.value.openDrawer(state.tempRightClickData)
                        : state.tempRightClickData.attrs.nodeData.nodeType === "sqlExecuterNode"
                          ? sqlExecuterNodeRef.value.openDrawer(state.tempRightClickData)
                          : ""
}
// 初始化加载
state.applicationId = route.query.applicationId
getlcsjMenu()
getcanvasDetail()
// nextTick(() => {
//   initGraph()
// })
</script>

<style scoped lang="scss">
.lcsj-page {
  width: 100% !important;
  height: 100%;
  background-color: #fff;
  padding: 0 !important;
  margin: 0 !important;
  @include flex-left;
  overflow: hidden;

  .left-components-box {
    width: 260px;
    height: 100%;
    border-right: 1px solid #ebeef5;
    box-shadow: 5px 0 10px -5px #dcdfe6;
    padding: 10px;
    border-right: 1px solid #ddd;
    @include flex-column-start;

    .selected-tree-box {
      flex: 1;
      height: 0;
      overflow-y: auto;
      margin-top: 10px;
    }
  }

  .content-box {
    flex: 1;
    width: 0;
    position: relative;
    @include flex-column-start;

    .tool-btn-box {
      width: 100%;
      height: 60px;
      background-color: #ffffff;
      @include flex-left-center;
      border-bottom: 1px solid #ebeef5;
      box-shadow: 0 5px 10px -5px #dcdfe6;

      .tool-btn-item {
        width: 70px;
        height: 35px;
        cursor: pointer;
        background-color: #fff;
        border: 1px solid #eee;
        margin-left: 10px;
        border-radius: 3px;
        @include flex-center-center;
      }

      .tool-btn-item:hover {
        background-color: #f8fbff;
        border: 1px solid #4f8fff;
        color: #4f8fff;
      }
    }

    #graph-box {
      flex: 1;
      height: 0;
      //background-color: rgba(238, 238, 238, 0.2);
      background-color: #f9fbff;
    }
  }
}

#contextMenu {
  position: absolute;
  padding: 8px;
  left: -3000px;
  //left: 0x;
  top: 0;
  background: #fff;
  width: 180px;
  border-radius: 6px;
  box-shadow: 0 0 6px #dcdfe6;
}

#contextMenu_item {
  cursor: pointer;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #333;
  padding-left: 5px;
  @include flex-left-center;

  img {
    width: 20px;
    height: 20px;
    margin-right: 7px;
  }
}

#contextMenu_edge {
  position: absolute;
  padding: 8px;
  left: -3000px;
  //left: 0x;
  top: 0;
  background: #fff;
  width: 180px;
  border-radius: 6px;
  box-shadow: 0 0 6px #dcdfe6;
}

#contextMenu_edge_item {
  cursor: pointer;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #333;
  padding-left: 5px;
  @include flex-left-center;

  img {
    width: 20px;
    height: 20px;
    margin-right: 7px;
  }
}

#contextMenu_item:hover {
  background-color: rgba(238, 238, 238, 0.5);
  color: rgba(70, 154, 255, 1);
}

#contextMenu_edge_item:hover {
  background-color: rgba(238, 238, 238, 0.5);
  color: rgba(70, 154, 255, 1);
}
</style>

<style lang="scss">
.lcsj-page {
  .el-tree-node__content {
    height: 33px !important;
  }
}
</style>
