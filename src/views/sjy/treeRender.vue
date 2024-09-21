<template>
  <span class="tree-expand">
    <div class="tree-title-box">
      <img
        v-show="NODE.level < 2 && props.TabNow !== DATA.id"
        class="file-img"
        src="@/assets/sjylb/sjy_item_bg.png"
        alt=""
      />
      <img
        v-show="NODE.level < 2 && props.TabNow === DATA.id"
        class="file-img"
        src="@/assets/sjylb/sjy_item_bg_act.png"
        alt=""
      />
      <img
        v-show="NODE.level >= 2 && props.TabNow !== DATA.id"
        class="file-img"
        src="@/assets/sjylb/sjy_item_zl.png"
        alt=""
      />
      <img
        v-show="NODE.level >= 2 && props.TabNow === DATA.id"
        class="file-img"
        src="@/assets/sjylb/sjy_item_zl_act.png"
        alt=""
      />
      <span class="tree-label">
        <span class="new-des-font-important tree-name" :title="DATA.nodeText">{{ DATA.nodeText }}</span>
      </span>
    </div>
  </span>
</template>

<script setup>
import { onMounted } from "vue"

const props = defineProps(["NODE", "DATA", "TabNow"])

onMounted(() => {})
</script>
<style lang="scss" scoped>
.tree-expand {
  width: 100%;
  @include flex-between-center;
  font-size: 14px;

  .tree-title-box {
    @include flex-left-center;
  }

  .tree-btn {
    width: 100%;
    padding-right: 20px;
    font-size: 16px;
    color: #167cf3;
    @include flex-right-center;
    display: none;
  }
}

.file-img {
  width: 20px;
  height: 22px;
  margin-right: 8px;
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
</style>

<style lang="scss">
.sjylb-page-style {
  .el-tree-node__content {
    height: 38px;
  }
}
</style>
