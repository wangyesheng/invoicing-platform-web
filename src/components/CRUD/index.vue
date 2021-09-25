<template>
  <div class="crud-wrap">
    <query :config="queryConfig" @on-search="$listeners['on-search']" />
    <container
      :columns="tableConfig.columns"
      :data="tableConfig.data"
      :columnAttrs="tableConfig.columnAttrs"
      v-bind="tableConfig.tableAttrs"
      v-on="$listeners"
    >
      <el-table-column slot="action" label="操作">
        <template slot-scope="{ row }">
          <slot name="extraAction" :row="row" />
          <el-button type="text" @click="onEffect('edit', row)">编辑</el-button>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="onEffect('remove', row)"
          >
            <el-button slot="reference" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </container>
    <effect ref="effectRef" :config="effectConfig"> </effect>
  </div>
</template>

<script>
import Container from "./container/Table";
import Effect from "./effect/Dialog";
import Query from "./Query";

export default {
  components: {
    Container,
    Effect,
    Query,
  },

  props: {
    queryConfig: {
      type: Object,
      default: () => {},
    },
    tableConfig: {
      type: Object,
      default: () => {},
    },
    effectConfig: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    onEffect(type, scope) {
      switch (type) {
        case "edit":
          this.beforeDoEffect(type, scope);
          break;
        case "remove":
          this.beforeDoEffect(type, scope);
          break;
      }
    },
    beforeDoEffect(type, scope) {
      const effectName = `on-${type}-effect`;
      if (this.$listeners[effectName]) {
        // 用户自己处理副作用
        this.$emit(effectName, scope);
      } else {
        // 采用内部默认的处理方式
        this.doEffect(type, scope);
      }
    },
    doEffect(type, scope) {
      switch (type) {
        case "edit":
          this.effectConfig.formData = { ...scope };
          this.$refs.effectRef.setVisible();
          break;
        case "remove":
          break;
      }
    },
  },
};
</script>
