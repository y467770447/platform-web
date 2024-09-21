<template>
  <div class="api-add-page">
    <div class="form-box">
      <div class="title-box-style">
        <div class="title-bg" />
        <div class="title-name">基本设置</div>
      </div>
      <el-form :model="state.dataForm" class="demo-form-inline" style="max-width: 70%; margin-left: 20px">
        <el-form-item label="API名称">
          <el-input v-model="state.dataForm.apiname" placeholder="请输入系统" clearable />
        </el-form-item>
        <el-form-item label="URL地址">
          <el-input v-model="state.dataForm.urladdress" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="state.dataForm.method" placeholder="请选择">
            <el-option label="post" value="0" />
            <el-option label="get" value="1" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"

const state = reactive({
  dataForm: {
    apiname: "",
    urladdress: "",
    method: ""
  }
})
</script>

<style scoped lang="scss">
.api-add-page {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 20px 30px !important;
  .form-box {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 20px;
    .title-box-style {
      width: 100%;
      margin-bottom: 20px;
      height: 38px;
      @include flex-left-center;
      .title-bg {
        width: 3px;
        height: 20px;
        background-color: deepskyblue;
      }
      .title-name {
        font-size: 18px;
        margin-left: 8px;
      }
    }
  }
}
</style>
