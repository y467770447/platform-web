<template>
  <div class="gxx-add-page">
    <div class="form-item">
      <div class="form-item-title">表定义</div>
      <el-form :model="state.tableform" label-width="auto" style="padding: 15px 30px; max-width: 70%">
        <el-form-item label="数据表名称">
          <el-input v-model="state.tableform.name" />
        </el-form-item>
        <el-form-item label="数据表说明">
          <el-input v-model="state.tableform.sm" />
        </el-form-item>
        <el-form-item label="表说明文件">
          <el-upload
            v-model:file-list="state.fileList"
            class="upload-demo"
            :action="state.bsmwjUrl"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-button type="primary" size="small">上传文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新控制">
          <el-select v-model="state.tableform.region" placeholder="请选择更新方式">
            <el-option label="仅新增" value="0" />
            <el-option label="仅修改" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新频率">
          <div class="display-style-box">
            <div>每</div>
            <el-input v-model="state.tableform.gxcontent" style="margin: 0 10px" />
            <el-select v-model="state.tableform.gxpl" placeholder="请选择">
              <el-option label="日" value="0" />
              <el-option label="月" value="1" />
              <el-option label="年" value="2" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="参与者">
          <el-select v-model="state.tableform.delivery" placeholder="请选择">
            <el-option label="小救星" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="form-item">
      <div class="form-item-title">字段定义</div>
      <el-form
        v-for="(item, index) in state.fieldList"
        :key="index"
        :model="item"
        label-width="auto"
        style="padding: 15px 30px; max-width: 70%"
      >
        <el-form-item label="字段显示名称">
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item label="提示文本">
          <el-input v-model="item.tooltip" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-select v-model="item.region" placeholder="请选择">
            <el-option label="字符串" value="0" />
            <el-option label="数字" value="1" />
          </el-select>
        </el-form-item>
        <div class="display-style-box">
          <el-form-item label="数据长度">
            <el-input v-model="item.sjcd" />
          </el-form-item>
          <el-form-item label="数据长度">
            <el-input v-model="item.default" />
          </el-form-item>
        </div>
        <el-form-item label="脏数据处理方式">
          <el-input v-model="item.type" />
        </el-form-item>
      </el-form>
    </div>
    <div class="form-item">
      <div class="form-item-title">备注</div>
      <el-form :model="state.bz" label-width="auto" style="padding: 15px 30px; max-width: 70%">
        <el-form-item>
          <el-input v-model="state.bz.delivery" type="textarea" placeholder="备注说明" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"

const state = reactive({
  tableform: {
    name: "",
    sm: "",
    fileList: "",
    region: "",
    gxcontent: "",
    gxpl: "",
    delivery: ""
  },
  fieldList: [
    {
      name: "name",
      tooltip: "",
      region: "",
      type: "",
      sjcd: "",
      default: ""
    }
  ],
  bz: {
    delivery: ""
  },
  bsmwjUrl: "",
  fileList: []
})

const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}

const beforeRemove = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
    () => true,
    () => false
  )
}
</script>

<style scoped lang="scss">
.gxx-add-page {
  width: 100%;
  height: 100%;
  padding: 20px !important;
  overflow-y: auto;

  .form-item {
    width: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px #d9d9d9;
    border-radius: 5px;
    margin-bottom: 20px;
    .form-item-title {
      font-size: 16px;
      //font-weight: 600;
      height: 35px;
      line-height: 35px;
      border-bottom: 1px solid #ddd;
      padding-left: 20px;
      //padding: 10px 20px;
    }
  }

  .display-style-box {
    @include flex-left-center;
    width: 100%;
  }
}
</style>
