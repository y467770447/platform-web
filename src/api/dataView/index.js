import { request } from "@/utils/service"

export function listapps(data) {
  return request({
    url: "/rest/etl/apps/listapps",
    method: "get",
    params: data
  })
}

// 应用所属分类
export function listAllNodes(data) {
  return request({
    url: "/rest/core/category/node/listAllNodes",
    method: "get",
    params: data
  })
}

// 保存应用
export function yyflSave(data) {
  return request({
    url: "/rest/etl/apps/save",
    method: "post",
    data
  })
}

// 删除应用
export function yyfldelete(data) {
  return request({
    url: "/rest/etl/apps/delete",
    method: "post",
    data
  })
}

// 分类列表
export function syncListAllNodeTreeJson(data) {
  return request({
    url: "/rest/core/category/node/syncListAllNodeTreeJson",
    method: "get",
    params: data
  })
}

// 应用分类所属类别
export function categorys(data) {
  return request({
    url: "/rest/etl/apps/list/categorys",
    method: "get",
    params: data
  })
}

// 新增-编辑分类
export function saveFl(data) {
  return request({
    url: "/rest/core/category/node/save",
    method: "post",
    data
  })
}

// 删除分类
export function deleteFl(data) {
  return request({
    url: "/rest/core/category/node/delete",
    method: "post",
    data
  })
}

// 获取分类唯一id
export function FlwyId() {
  return request({
    url: "/rest/core/serialnumber/new?appId=ETL&type=CATEGORY",
    method: "get"
  })
}

// 流程列表
export function lclblist(data) {
  return request({
    url: "/rest/etl/process/list",
    method: "get",
    params: data
  })
}

// 根据流程ID获取流程详情
export function processId(id) {
  return request({
    url: "/rest/etl/process/" + id,
    method: "get"
  })
}

// 流程新增--流程编号
export function serialnumber() {
  return request({
    url: "/rest/core/serialnumber/new?appId=etl&type=FLOW",
    method: "get"
  })
}

// 流程新增--所属应用
export function ssyyselect() {
  return request({
    url: "/rest/etl/apps/select",
    method: "get"
  })
}

// 定时自动调度--调度时间
export function strategy() {
  return request({
    url: "/rest/core/scheduler/strategy/select",
    method: "get"
  })
}

// 保存流程
export function savestrategy(data) {
  return request({
    url: "/rest/etl/process/save",
    method: "post",
    data
  })
}

// 启动调度
export function startstrategy(data) {
  return request({
    url: "/rest/etl/process/start",
    method: "post",
    data
  })
}

// 停止调度
export function stopstrategy(data) {
  return request({
    url: "/rest/etl/process/stop",
    method: "post",
    data
  })
}

// 运行流程
export function runstrategy(data) {
  return request({
    url: "/rest/etl/process/run",
    method: "post",
    data
  })
}

// 删除流程
export function deletestrategy(data) {
  return request({
    url: "/rest/etl/process/delete",
    method: "post",
    data
  })
}

// 复制流程
export function copystrategy(data) {
  return request({
    url: "/rest/etl/process/copy",
    method: "post",
    data
  })
}

// 任务运行记录
export function processRecord(data) {
  return request({
    url: "/rest/etl/process/monitor/list/page",
    method: "get",
    params: data
  })
}

// 任务执行步骤
export function processBz(data) {
  return request({
    url: "/rest/etl/process/monitor/node/instance/list",
    method: "get",
    params: data
  })
}

// 日志
export function logShow(data) {
  return request({
    url: "/rest/etl/debuglog/transactionlog/show",
    method: "post",
    data
  })
}

// 清除日志
export function logClear(data) {
  return request({
    url: "/rest/etl/debuglog/transactionlog/clear",
    method: "post",
    data
  })
}
