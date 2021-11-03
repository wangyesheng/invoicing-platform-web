<template>
  <el-card shadow="never">
    <eos-dynamic-table
      :columns="columns"
      :data="data"
      :columnAttrs="columnAttrs"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template slot="containerAction">
        <slot name="containerAction" />
      </template>
    </eos-dynamic-table>
  </el-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    columnAttrs: {
      type: Object,
      default: () => {}
    }
  },
};
</script>
