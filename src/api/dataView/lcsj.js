import { request } from "@/utils/service"

export function lcsjMenu(data) {
  return request({
    url: "/rest/etl/process/module/menu/select",
    method: "get",
    params: data
  })
}

// 画布详情
export function canvasDetail(id) {
  return request({
    url: "/rest/etl/process/" + id,
    method: "get"
  })
}

// 保存画布
export function canvasSave(data) {
  return request({
    url: "/rest/etl/process/model/save",
    method: "post",
    data
  })
}

// 获取数据源
export function dataFrom(data) {
  return request({
    url: "/rest/core/datasource/selectTree?configType=RDB,Driver",
    method: "get",
    params: data
  })
}

// 获取表字段信息
export function listTableColumns(data) {
  return request({
    url: "/rest/etl/sql/listTableColumns",
    method: "get",
    params: data
  })
}

// 输入组件--获取数据库表
export function listAllTables(data, filters) {
  return request({
    url: "/rest/core/modelconfigs/listAllTables?filters=" + filters,
    method: "post",
    data
  })
}

// 获取节点详情
export function nodeDetail(data) {
  return request({
    url: "/rest/etl/process/node/props",
    method: "get",
    params: data
  })
}

// 生成sql
export function sqladd(data) {
  return request({
    url: "/rest/etl/sql/generate/sql",
    method: "get",
    params: data
  })
}

// 格式化SQL
export function formatSql(data) {
  return request({
    url: "/rest/etl/process/formatSql",
    method: "post",
    data
  })
}

// 从表中读入表字段
export function writeFields(data) {
  return request({
    url: "/rest/etl/process/sqlreadnode/table/fields",
    method: "post",
    data
  })
}

// 从sql读入表字段
export function writeBySqlFields(data) {
  return request({
    url: "/rest/etl/process/sqlreadnode/parsesql/columns",
    method: "post",
    data
  })
}

// 选择数据库表时获取sql
export function getSelectSql(data) {
  return request({
    url: "/rest/etl/process/sqlreadnode/getSelectSql",
    method: "post",
    data
  })
}

// drawer-save
export function writeInSave(data) {
  return request({
    url: "/rest/etl/process/node/save",
    method: "post",
    data
  })
}

// 文件目录
export function datafileList(data) {
  return request({
    url: "/rest/etl/datafile/list",
    method: "get",
    params: data
  })
}

// 文件
export function filesList(data) {
  return request({
    url: "/rest/etl/datafile/list/files",
    method: "get",
    params: data
  })
}

// 文件及目录管理-基础路径
export function filesRoad(data) {
  return request({
    url: "/rest/core/appProperties/value",
    method: "get",
    params: data
  })
}

// 文件及目录管理-基础路径
export function jtprocessList(data) {
  return request({
    url: "/rest/etl/process/select",
    method: "get",
    params: data
  })
}

// 文件及目录管理-获取文件夹属性
export function sjById(data) {
  return request({
    url: "/rest/etl/datafile/getById",
    method: "get",
    params: data
  })
}

// 文件及目录管理-保存文件夹属性
export function saveDirectSx(data) {
  return request({
    url: "/rest/etl/datafile/save",
    method: "post",
    data
  })
}

// 文件及目录管理-删除文件夹
export function deleteDirectSx(data) {
  return request({
    url: "/rest/etl/datafile/delete",
    method: "post",
    data
  })
}

// 文件及目录管理-启动监听
export function startJt(data) {
  return request({
    url: "/rest/etl/datafile/monitor/start",
    method: "post",
    data
  })
}

// 文件及目录管理-停止监听
export function stopJt(data) {
  return request({
    url: "/rest/etl/datafile/monitor/stop",
    method: "post",
    data
  })
}

// 文件及目录管理-下载文件
export function downloadFiles(data) {
  return request({
    url: "/rest/etl/datafile/download",
    method: "get",
    params: data,
    responseType: "blob"
  })
}

// 文件及目录管理-删除文件
export function deleteFileSx(data) {
  return request({
    url: "/rest/etl/datafile/delete/file",
    method: "post",
    data
  })
}

// excel输出-获取table
export function configTable(data) {
  return request({
    url: "/rest/etl/process/node/columns/config",
    method: "get",
    params: data
  })
}

// excel输出-节点List
export function nodeSelectList(data) {
  return request({
    url: "/rest/etl/process/node/select",
    method: "get",
    params: data
  })
}

// excel输出-重新导入字段
export function resetTable(data) {
  return request({
    url: "/rest/etl/process/node/columns/config",
    method: "get",
    params: data
  })
}

// excel读取-分析字段
export function ExcelHead(data) {
  return request({
    url: "/rest/etl/process/excelreadnode/head",
    method: "post",
    data
  })
}

// 创建sql
export function createSql(data) {
  return request({
    url: "/rest/etl/process/createtable/sql",
    method: "post",
    data
  })
}

// 字段名修改-导入字段
export function fieldmaps(data) {
  return request({
    url: "/rest/etl/process/fieldmappingnode/fieldmaps",
    method: "get",
    params: data
  })
}

// 数据清洗转换-数据所在节点
export function sjszjdList(data) {
  return request({
    url: "/rest/etl/process/node/select",
    method: "get",
    params: data
  })
}

// 数据清洗转换-规则列表
export function ruleList(data) {
  return request({
    url: "/rest/etl/apps/menu/categorys",
    method: "get",
    params: data
  })
}

// 数据清洗转换-规则列表-具体规则
export function ruleListpage(data) {
  return request({
    url: "/rest/etl/rules/list/page",
    method: "get",
    params: data
  })
}

// 字段值修改-输入字段id-list
export function columnList(data) {
  return request({
    url: "/rest/etl/process/node/columns/select",
    method: "get",
    params: data
  })
}

// 数据质量过滤-数据流向
export function routerSelect(data) {
  return request({
    url: "/rest/etl/process/router/select",
    method: "get",
    params: data
  })
}

// 执行sql脚本-sql选择
export function sqlSelect(data) {
  return request({
    url: "/rest/etl/sql/select",
    method: "get",
    params: data
  })
}

// 数据清洗转换-数据所在节点字段id
export function dataIdSelect(data) {
  return request({
    url: "/rest/etl/process/node/columns/select",
    method: "get",
    params: data
  })
}
