// import { ElDropdown, ElButton } from "element-plus"
// import { ToolsView } from "@antv/x6"
// import { createApp } from "vue"
//
// // ContextMenu挂载的Vue实例
// let app = null
// let timer = null // timer
//
// class ContextMenuTool extends ToolsView.ToolItem {
//   toggleContextMenu(visible, pos) {
//     if (app) {
//       // 清空上次内容
//       app.unmount()
//       document.getElementById("graph-dropdown").innerHTML = ""
//       app = null
//     }
//     document.removeEventListener("mousedown", this.onMouseDown)
//
//     if (visible && pos) {
//       app = createApp(
//         <ElDropdown trigger={["contextmenu"]}>
//           {{
//             default: () => {
//               // menu是在createEdge传入的args
//               if (Array.isArray(this.options.menu)) {
//                 return (
//                   `<div style="padding: 10px;">
//                     {this.options.menu.map((item) => {
//                       return (
//                         <div
//                           style="margin-left: 0;display:block;border: 0;"
//                           icon={item.icon}
//                           onClick={item.onClick}
//                         >
//                           {item.label}
//                         </div>
//                       )
//                     })}
//                   </div>`
//                 )
//               }
//             }
//           }}
//         </ElDropdown>
//       )
//       // 减去本身元素的宽高
//       document.getElementById("graph-dropdown").style = `left: ${pos.x - 40}px;top: ${pos.y - 40}px;`
//       app.mount("#graph-dropdown")
//       document.addEventListener("mousedown", this.onMouseDown)
//     }
//   }
//
//   onMouseDown = () => {
//     timer = window.setTimeout(() => {
//       this.toggleContextMenu(false)
//     }, 200)
//   }
//
//   onContextMenu({ e }) {
//     debugger
//     if (timer) {
//       clearTimeout(timer)
//       timer = 0
//     }
//     this.toggleContextMenu(true, { x: e.pageX, y: e.pageY })
//   }
//
//   delegateEvents() {
//     this.cellView.on("cell:contextmenu", this.onContextMenu, this)
//     return super.delegateEvents()
//   }
//
//   onRemove() {
//     this.cellView.off("cell:contextmenu", this.onContextMenu, this)
//   }
// }
//
// ContextMenuTool.config({
//   tagName: "div",
//   isSVGElement: false
// })
//
// export { ContextMenuTool }
