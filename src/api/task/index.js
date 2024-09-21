import { request } from "@/utils/service"

// 任务列表
export function taskList(data) {
  return request({
    url: "/rest/etl/process/monitor/list/page",
    method: "get",
    params: data
  })
}

// 删除流程
// export function deletetask(data) {
//   return request({
//     url: "/rest/etl/process/delete",
//     method: "post",
//     data
//   })
// }

// 停止流程
export function stoptask(data) {
  return request({
    url: "/rest/etl/process/monitor/instance/stopthread",
    method: "post",
    data
  })
}
