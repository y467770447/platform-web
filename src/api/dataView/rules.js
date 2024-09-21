import { request } from "@/utils/service"

export function rulesCatelog(data) {
  return request({
    url: "/rest/etl/apps/menu/categorys",
    method: "get",
    params: data
  })
}

// 保存rule
export function saveRule(data) {
  return request({
    url: "/rest/etl/rules/save",
    method: "post",
    data
  })
}

// 定时策略list
export function timeRuleList(data) {
  return request({
    url: "/rest/core/scheduler/strategy/list/page",
    method: "get",
    params: data
  })
}

// 定时策略-详情
export function timeRuleDetail(id) {
  return request({
    url: "/rest/core/scheduler/strategy/detail/" + id,
    method: "get"
  })
}

// 定时策略-唯一id
export function timeRuleId(data) {
  return request({
    url: "/rest/core/serialnumber/new",
    method: "get",
    params: data
  })
}

// 保存定时策略
export function saveTimeRule(data) {
  return request({
    url: "/rest/core/scheduler/strategy/save",
    method: "post",
    data
  })
}

// 删除定时策略
export function deleteTimeRule(data) {
  return request({
    url: "/rest/core/scheduler/strategy/delete",
    method: "post",
    data
  })
}
