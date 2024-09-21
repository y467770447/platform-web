<template>
  <span class="tree-expand">
    <span class="tree-title-box">
      <img v-show="NODE.level >= '2'" class="file-img" :src="getAssetsFile(props.DATA.nodeType)" alt="" />
      <div v-show="NODE.level == '1'" class="tree-header">
        <div class="tree-header-bg" />
      </div>
      <span class="tree-label" :title="props.DATA.nodeName">
        <span
          class="new-des-font-important"
          :class="[NODE.level === 1 ? 'tree-name' : 'second-tree-name']"
          :title="props.DATA.nodeName"
          >{{ props.DATA.nodeName }}</span
        >
      </span>
      <div v-show="NODE.level === 1" class="tree-nums">{{ props.NODE.childNodes.length }}</div>
    </span>
  </span>
</template>

<script setup>
import { onMounted } from "vue"

const props = defineProps(["NODE", "DATA"])

// const dragStart = (data) => {
//   console.log(data)
// }
const getAssetsFile = (name) => {
  return new URL(`../../../assets/dataView/nodeIcon/${name}.png`, import.meta.url).href
}

onMounted(() => {})
</script>
<style lang="scss" scoped>
.tree-expand {
  width: 100%;
  position: relative;

  .tree-title-box {
    width: 100%;
    @include flex-left-center;
  }
}

.file-img {
  width: 15px;
  height: 15px;
  margin-right: 8px;
  margin-left: -30px;
}

.tree-label {
  font-size: 15px;
  color: #444;
}

.tree-name {
  font-size: 15px;
  color: #333;
}

.second-tree-name {
  color: #666;
  font-size: 14px;
}

.tree-nums {
  position: absolute;
  right: 10px;
  font-size: 12px;
  color: #888;
  width: 20px;
  height: 20px;
  background-color: rgb(234, 234, 234);
  //@include flex-center-center;
  text-align: center;
  line-height: 20px;
  margin-left: 7px;
  border-radius: 3px;
}

.el-tree-node__content:hover {
  .tree-btn {
    display: inline-block;
  }
}

.mbgl .catalog-bottom .el-tree-node.is-current > .el-tree-node__content {
  .tree-btn {
    display: inline-block;
  }
}

.tree-header {
  width: 10px;
  height: 16px;
  background-color: #fff;
  margin-left: -20px;
  overflow: hidden;
  z-index: 99;
  display: inline-block;
  .tree-header-bg {
    width: 3px;
    height: 100%;
    background-color: rgba(70, 154, 255, 0.89);
  }
}
</style>
