<template>
  <div class="gxx-page">
    <div class="public-search-box">
      <el-form :inline="true" :model="state.searchForm" class="demo-form-inline">
        <el-form-item label="对接系统">
          <el-input v-model="state.searchForm.system" placeholder="请输入系统" clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="state.searchForm.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary" @click="createData">新建</el-button>
      </div>
    </div>
    <div class="content-box">
      <el-row :gutter="20">
        <el-col v-for="item in state.dataList" :key="item.id">
          <div class="card-box-style">
            <el-card shadow="hover">
              <div class="card-item-style">
                <div class="message-box">
                  表名称：<el-link type="primary">{{ item.name }}</el-link>
                </div>
                <div class="message-box">关联系统：{{ item.system }}</div>
                <div class="message-box">数据总量：{{ item.num }}</div>
                <div class="message-box">创建时间：{{ item.createTime }}</div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const state = reactive({
  searchForm: {
    userName: "",
    system: ""
  },
  dataList: [
    {
      id: "0",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "1",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "2",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "3",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "4",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "5",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "6",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    },
    {
      id: "7",
      name: "企业数据表",
      system: "第三方实验室",
      num: 255,
      createTime: "2024-06-26"
    }
  ]
})

const onSubmit = () => {
  console.log("submit!")
}

const createData = () => {
  router.push("/sjck/wdxAdd")
}
</script>

<style lang="scss" scoped>
.gxx-page {
  width: 100%;
  height: 100%;
  //background-color: skyblue;
  @include flex-column-start;
  .content-box {
    flex: 1;
    .card-box-style {
      margin-bottom: 20px;
      .card-item-style {
        //height: 180px;
        padding: 10px;
        .message-box {
          color: #333;
          //line-height: 32px;
          margin-bottom: 15px;
        }
      }
    }
  }
}

@media screen and (min-width: 1600px) {
  .el-col {
    max-width: 20%;
    width: 20%;
    flex: 0 0 20%;
  }
}
@media screen and (min-width: 1200px) and (max-width: 1600px) {
  .el-col {
    max-width: 25%;
    width: 25%;
    flex: 0 0 50%;
  }
}
@media screen and (min-width: 768px) and (max-width: 1200px) {
  .el-col {
    max-width: 33.33%;
    width: 33.33%;
    flex: 0 0 50%;
  }
}
@media only screen and (max-width: 768px) {
  .el-col {
    max-width: 50%;
    width: 50%;
    flex: 0 0 100%;
  }
}
</style>
