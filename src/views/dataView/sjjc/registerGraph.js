// import { Graph } from "@antv/x6"

// #region 初始化图形
const ports = {
  groups: {
    top: {
      position: "top",
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden"
          }
        }
      }
    },
    right: {
      position: "right",
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden"
          }
        }
      }
    },
    bottom: {
      position: "bottom",
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden"
          }
        }
      }
    },
    left: {
      position: "left",
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: "#fff",
          style: {
            visibility: "hidden"
          }
        }
      }
    }
  },
  items: [
    {
      group: "top"
    },
    {
      group: "right"
    },
    {
      group: "bottom"
    },
    {
      group: "left"
    }
  ]
}

// Graph.registerNode(
//   "custom-node",
//   {
//     width: 200,
//     height: 60,
//     ports: { ...ports },
//     attrs: {
//       body: {
//         stroke: "#5F95FF",
//         strokeWidth: 1,
//         fill: "rgba(95,149,255,0.2)",
//         refWidth: 1,
//         refHeight: 1
//       },
//       image: {
//         "xlink:href": "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
//         width: 16,
//         height: 16,
//         x: 12,
//         y: 12
//       },
//       title: {
//         text: "Node",
//         refX: 40,
//         refY: 14,
//         fill: "rgba(0,0,0,0.85)",
//         fontSize: 12,
//         "text-anchor": "start"
//       },
//       text: {
//         text: "this is content text",
//         refX: 40,
//         refY: 38,
//         fontSize: 12,
//         fill: "rgba(0,0,0,0.6)",
//         "text-anchor": "start"
//       }
//     },
//     markup: [
//       {
//         tagName: "rect",
//         selector: "body"
//       },
//       {
//         tagName: "image",
//         selector: "image"
//       },
//       {
//         tagName: "text",
//         selector: "title"
//       },
//       {
//         tagName: "text",
//         selector: "text"
//       }
//     ]
//   },
//   false
// )

export { ports }
