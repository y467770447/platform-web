<template>
  <el-drawer v-model="state.showDrawer" title="新建数据源" :with-header="true" size="70%">
    <div class="sjylb-create-box">
      <el-tabs v-model="state.actTab" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="链接属性配置" name="0">
          <el-form :model="state.ljsxpz" label-width="135px" style="max-width: 600px">
            <el-form-item label="所属分类">
              <el-tree-select
                v-model="state.ljsxpz.categoryId"
                :data="state.ssflSelectList"
                :render-after-expand="false"
                check-strictly
                style="width: 240px"
              />
              <div class="form-sm-style" style="margin-left: 20px">指定本数据源所厂的分类</div>
            </el-form-item>
            <el-form-item label="配置说明">
              <el-input v-model="state.ljsxpz.configName" />
              <span class="form-sm-style">指定任何有意义且能描述本数据源的说明</span>
            </el-form-item>
            <el-form-item label="数据源唯一id">
              <el-input disabled v-model="state.ljsxpz.configId" />
              <span class="form-sm-style">注意:必须指定一个唯一ld获取数据库链接时通过本Id来链接数据源</span>
            </el-form-item>
            <el-form-item label="用户Id">
              <el-input v-model="state.ljsxpz.userId" />
              <span class="form-sm-style">注意:指定链接数据源的用户lId，没有可以为空值</span>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="state.ljsxpz.password" />
              <span class="form-sm-style">指定链接数据源的密码,没有可以为空值</span>
            </el-form-item>
            <el-form-item label="加密字段">
              <el-radio-group v-model="state.ljsxpz.changePassword">
                <el-radio :value="true">是</el-radio>
                <el-radio :value="false">否</el-radio>
              </el-radio-group>
              <div class="form-sm-style" style="height: 32px; line-height: 32px; margin-left: 40px">
                选择是表示保存时对密码进行一次加密
              </div>
            </el-form-item>
            <el-form-item label="数据库驱动Class">
              <el-autocomplete
                v-model="state.ljsxpz.driverClass"
                :fetch-suggestions="querySearch"
                value-key="value"
                clearable
                class="inline-input w-50"
                placeholder="请输入或选择Class"
              />
              <span class="form-sm-style">指定数据源所需要的驱动类JDBC或者ODBC驱动Class</span>
            </el-form-item>
            <el-form-item label="链接数据源URL">
              <el-autocomplete
                v-model="state.ljsxpz.jdbcUrl"
                :fetch-suggestions="jdbcUrlquerySearch"
                value-key="value"
                clearable
                class="inline-input w-50"
                placeholder="请输入或选择URL"
              />
              <span class="form-sm-style">指定链接数据源的jdbc Url配置</span>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="state.ljsxpz.state">
                <el-radio value="1">启用</el-radio>
                <el-radio value="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="版本号">
              <el-input v-model="state.ljsxpz.dbVersion" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="state.ljsxpz.remark" />
              <span class="form-sm-style">
                注意:当类型为数据库链接池时一旦数据库链池链接上后，再修改属性必须重启服务才能生效
              </span>
            </el-form-item>
            <el-form-item>
              <el-button @click="toBefore()">取消</el-button>
              <el-button @click="saveAndConnect">保存并测试链接</el-button>
              <el-button type="primary" @click="getsaveSjy">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script setup>
import { reactive, ref } from "vue"
import { byComponentId, saveSjy, sjyEditDetail, sjywyId, ssflList, testconnect } from "@/api/sjy/index.js"
import { getUserInfo } from "@/utils/cache/cookies"
import { ElMessage } from "element-plus"

const emit = defineEmits(["getsjyflList"])

const restaurants = ref([])
const jdbcUrlrestaurants = ref([])

const state = reactive({
  showDrawer: false,
  actTab: "0",
  ssflSelectList: [],
  ljsxpz: {
    sjylx: "0",
    componentId: "",
    configName: "",
    configId: "",
    userId: "",
    password: "",
    changePassword: "0",
    driverClass: "",
    jdbcUrl: "",
    state: "",
    dbVersion: "",
    remark: ""
  }
})

const openDrawer = (ite, type) => {
  state.ljsxpz.userId = JSON.parse(getUserInfo()).userId
  getssflList()
  if (type === "edit") {
    state.isEdit = true
    sjyEditDetail(ite.id).then((res) => {
      state.ljsxpz = res
    })
  } else {
    state.isEdit = false
    getbyComponentId(ite)
  }
  state.showDrawer = true
}

const toBefore = () => {
  state.showDrawer = false
}

const handleClick = () => {}

// 获取数据源组件信息
const getbyComponentId = (ite) => {
  byComponentId({
    componentId: ite.componentId
  }).then((res) => {
    state.ljsxpz = res
    JSON.parse(res.formContent).map((ite) => {
      if (ite.key === "default") {
        ite.content.map((item) => {
          if (item.fieldId === "driverClass") {
            if (state.isEdit === false) {
              state.ljsxpz.driverClass = item.initialValue
            }
            restaurants.value = item.dataOpt
            // state.driverClassList = item.dataOpt
          }
          if (item.fieldId === "jdbcUrl") {
            if (state.isEdit === false) {
              state.ljsxpz.jdbcUrl = item.initialValue
            }
            jdbcUrlrestaurants.value = item.dataOpt
            // state.jdbcUrlList = item.dataOpt
          }
        })
      }
    })
    state.ljsxpz.sjylx = "0"
    state.ljsxpz.changePassword = false
    state.ljsxpz.state = "1"
    state.ljsxpz.id = undefined
    getsjywyId()
  })
}

// 所属分类
const getssflList = () => {
  ssflList({
    categoryId: "core.dataSourceCategory",
    rootName: "root"
  }).then((res) => {
    state.ssflSelectList = res
  })
}

// 获取唯一Id
const getsjywyId = () => {
  sjywyId({
    appId: state.ljsxpz.appId,
    type: state.ljsxpz.componentId
  }).then((res) => {
    state.ljsxpz.configId = res.serialNumber
  })
}

// 保存数据源
const getsaveSjy = () => {
  saveSjy(
    Object.assign(state.ljsxpz, {
      configType: "Driver"
    })
  ).then(() => {
    ElMessage({
      message: "保存成功",
      type: "success"
    })
    emit("getsjyflList")
    state.showDrawer = false
  })
}

// 保存数据源
const saveAndConnect = () => {
  saveSjy(state.ljsxpz).then((res) => {
    if (res.errcode != 0) {
      ElMessage({
        type: "error",
        message: res.msg
      })
      return false
    }
    testconnect({
      id: res.dataSource.id
    })
      .then((res) => {
        state.loading = false
        if (res.msg === "链接成功") {
          ElMessage({ message: res.msg, type: "success" })
          emit("getsjyflList")
          state.showDrawer = false
          return false
        } else if (res.msg === "链接失败") {
          ElMessage({ message: res.msg, type: "error" })
          return false
        }
      })
      .catch(() => {
        state.loading = false
        ElMessage({ message: "链接失败", type: "error" })
      })
  })
}

const querySearch = (queryString, cb) => {
  const results = queryString ? restaurants.value.filter(createFilter(queryString)) : restaurants.value
  // call callback function to return suggestions
  cb(results)
}

const jdbcUrlquerySearch = (queryString, cb) => {
  const results = queryString
    ? jdbcUrlrestaurants.value.filter(createjdbcUrlFilter(queryString))
    : jdbcUrlrestaurants.value
  // call callback function to return suggestions
  cb(results)
}

const createFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

const createjdbcUrlFilter = (queryString) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

// 初始化加载
defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">
.sjylb-create-box {
  width: 100%;
  height: 100%;
  //background-color: skyblue;
  .form-sm-style {
    color: #888;
  }
}
</style>
