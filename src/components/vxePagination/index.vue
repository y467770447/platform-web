<template>
  <vxe-pager
      background
      v-model:current-page="props.pageNum"
      v-model:page-size="props.pageSize"
      :total="props.total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
      @page-change="pageChanges"
      class="pagination-style"
  >
  </vxe-pager>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'

const emit = defineEmits(['pageChange'])
const props = defineProps(['pageNum', 'pageSize', 'total'])

const pageChanges = (val) => {
  emit('pageChange', val)
}

</script>

<style lang="scss">
.pagination-style {
  background-color: transparent;
  .vxe-pager--wrapper {
    //.vxe-pager--jump-prev, .vxe-pager--prev-btn, .vxe-pager--next-btn, .vxe-pager--jump-next {
    //  background-color: transparent !important;
    //}
    button {
      background-color: transparent !important;
      //color: #eeeeee;
    }
    //.is--disabled {
    //  color: #bfbfbf;
    //}
    .vxe-pager--btn-wrapper {
      .vxe-pager--num-btn:focus {
        box-shadow: none !important;
        border: none;
      }
      .is--active {
        color: rgba(70, 212, 255, 0.89) !important;
      }
    }
    .vxe-input--inner {
      background-color: transparent !important;
      border: 1px solid rgba(70, 154, 255, 0.89) !important;
      //color: #eeeeee !important;
    }
    .vxe-pager--goto {
      background-color: transparent !important;
      border: 1px solid rgba(70, 154, 255, 0.89) !important;
      //color: #eeeeee !important;
      margin: 0 5px;
    }
    .vxe-pager--jump {
      .vxe-pager--goto-text {
        color: #333 !important;
      }
      .vxe-pager--classifier-text {
        color: #333 !important;
      }
    }
    .vxe-pager--total {
      color: #333 !important;
    }
  }
}
</style>