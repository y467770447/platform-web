<template>
  <el-drawer v-model="state.showDrawer" title="规则代码" size="55%">
    <div class="drawer-box-style">
      <div class="right-sql">
        <!--        <div class="ace-button-box">-->
        <!--          <el-button type="primary" @click="saveFun">编译并保存</el-button>-->
        <!--          <el-button>历史版本</el-button>-->
        <!--        </div>-->
        <div id="editor" ref="aceDom" />
      </div>
      <!--      <div class="button-box">-->
      <!--        <el-button @click="closeDrawer">关闭</el-button>-->
      <!--        <el-button type="primary" @click="saveFun">保存</el-button>-->
      <!--      </div>-->
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue"

import aceC from "ace-builds"
// ace主题包
import "ace-builds/src-min-noconflict/theme-kuroir"
import "ace-builds/src-min-noconflict/theme-one_dark"
import "ace-builds/src-min-noconflict/theme-github"
import "ace-builds/src-min-noconflict/theme-chrome"
// ace 检索框
import "ace-builds/src-min-noconflict/ext-searchbox"
// ace语言包
import "ace-builds/src-min-noconflict/mode-sql"
import "ace-builds/src-min-noconflict/mode-javascript"
import "ace-builds/src-min-noconflict/mode-xml"
import "ace-builds/src-min-noconflict/mode-json5"
import "ace-builds/src-min-noconflict/mode-java"
//代码完成
import "ace-builds/src-min-noconflict/ext-language_tools"

//自动提示规则
import "ace-builds/src-noconflict/snippets/javascript"
import "ace-builds/src-noconflict/snippets/sql"
import "ace-builds/src-noconflict/snippets/json"
import "ace-builds/src-noconflict/snippets/java"
import "ace-builds/src-noconflict/snippets/text"

const aceDom = ref()

const state = reactive({
  showDrawer: false,
  codeData: ""
})

const openDrawer = (row) => {
  state.showDrawer = true
  state.rowData = JSON.parse(JSON.stringify(row))
  state.codeData = state.rowData.ruleCode
  nextTick(() => {
    initAce()
  })
}

// 代码编辑器
const initAce = () => {
  aceC.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.14/")
  //快速开始-demo
  state.editor = aceC.edit(aceDom.value, {
    // maxLines: 24, // 最大行数，超过会自动出现滚动条
    minLines: 12, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
    fontSize: 14, // 编辑器内字体大小
    theme: "ace/theme/chrome", // 默认设置的主题
    mode: "ace/mode/java", // 默认设置的语言模式
    tabSize: 2, // 制表符设置为 4 个空格大小
    readOnly: false //只读
  })
  state.editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  })
  state.editor.setHighlightActiveLine(false)
  // 自动换行
  state.editor.getSession().setUseWrapMode(true)
  // 设置默认值
  state.editor.setValue(state.codeData)
}

defineExpose({
  openDrawer
})
</script>

<style scoped lang="scss">
.drawer-box-style {
  width: 100%;
  height: 100%;
  @include flex-column-start;
  .right-sql {
    flex: 1;
    height: 0;
    overflow: hidden;
    @include flex-column-start;
    .ace-button-box {
      width: 100%;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 5px;
    }
    #editor {
      flex: 1;
      height: 0;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      //height: 500px;
    }
  }
}
</style>
