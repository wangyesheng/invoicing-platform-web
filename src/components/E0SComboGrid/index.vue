<template>
  <div
    class="eos-combo-wrap"
    v-click-outside
  >
    <el-input type="text" />
    <div
      class="pannel-wrap"
      v-if="isVisible"
    >
      <el-table
        :data="dataSource"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          v-for="item in config.tableColumns"
          :key="item.line"
          :prop="item.field"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  directives: {
    clickOutside: {
      bind(el, bingings, vnode) {
        const handler = (e) => {
          if (el.contains(e.target)) {
            if (!vnode.context.isVisible) {
              vnode.context.focus();
            }
          } else {
            if (vnode.context.isVisible) {
              vnode.context.blur();
            }
          }
        };
        el.handler = handler;
        document.addEventListener('click', handler);
      },
      unbind(el) {
        document.removeEventListener('click', el.handler);
      },
    },
  },
  data() {
    return {
      isVisible: false,
      selectedValue: '',
      dataSource: [],
    };
  },
  methods: {
    focus() {
      this.isVisible = true;
      this.query();
    },
    blur() {
      this.isVisible = false;
    },
    handleSelectionChange(value) {
      this.$emit('select', value);
    },
    async query() {
      const data = await this.$get(this.config.url, this.config.params);
      this.dataSource = data;
    },
  },
};
</script>

<style lang="scss" scoped>
.eos-combo-wrap {
  position: relative;
  .pannel-wrap {
    position: absolute;
    top: 32px;
    left: 0;
    z-index: 10;
    min-width: 500px;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 4px;
    margin: 5px 0;
  }
}
</style>