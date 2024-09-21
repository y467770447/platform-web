import { request } from "@/utils/service"

// 数据源分类列表
export function sjyflList(data) {
  return request({
    url: "/rest/core/appservicecategory/treejson/grid",
    method: "get",
    params: data
  })
}

// 分类唯一id
export function flwyId(data) {
  return request({
    url: "/rest/core/serialnumber/new",
    method: "get",
    params: data
  })
}

// 上级分类
export function sjflList(data) {
  return request({
    url: "/rest/core/appservicecategory/treejson/select",
    method: "get",
    params: data
  })
}

// 数据源分类新增
export function sjyflSave(data) {
  return request({
    url: "/rest/core/appservicecategory/save",
    method: "post",
    data
  })
}

// 数据源分类删除
export function deleteappservicecategory(data) {
  return request({
    url: "/rest/core/appservicecategory/delete",
    method: "post",
    data
  })
}

// 数据源列表
export function sjyxxTableList(data) {
  return request({
    url: "/rest/core/datasource/list",
    method: "get",
    params: data
  })
}

// 数据源组件列表
export function listGroupComponent(data) {
  return request({
    url: "/rest/core/datasource/component/listGroupComponent",
    method: "get",
    params: data
  })
}

// 获取数据源详情-修改时
export function sjyDetail(id) {
  return request({
    url: "/rest/core/datasource/" + id,
    method: "get"
  })
}

// 获取数据源组件信息
export function byComponentId(data) {
  return request({
    url: "/rest/core/datasource/component/getByComponentId",
    method: "get",
    params: data
  })
}

// 所属分类
export function ssflList(data) {
  return request({
    url: "/rest/core/appservicecategory/treejson/select",
    method: "get",
    params: data
  })
}

// 获取数据源唯一ID
export function sjywyId(data) {
  return request({
    url: "/rest/core/serialnumber/new",
    method: "get",
    params: data
  })
}

// 保存数据源
export function saveSjy(data) {
  return request({
    url: "/rest/core/datasource/save",
    method: "post",
    data
  })
}

// 测试链接
export function testconnect(data) {
  return request({
    url: "/rest/core/datasource/test/connect",
    method: "get",
    params: data
  })
}

// 复制数据源
export function copySjy(data) {
  return request({
    url: "/rest/core/datasource/copy",
    method: "post",
    data
  })
}

// 删除数据源
export function deleteSjy(data) {
  return request({
    url: "/rest/core/datasource/delete",
    method: "post",
    data
  })
}

// 获取数据源详情
export function sjyEditDetail(id) {
  return request({
    url: "/rest/core/datasource/" + id,
    method: "get"
  })
}

// 数据源关联流程
export function processList(data) {
  return request({
    url: "/rest/core/datasource/process/list",
    method: "get",
    params: data
  })
}
