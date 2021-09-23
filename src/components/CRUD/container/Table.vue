<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    columnAttrs: {
      type: Object,
      default: () => {},
    },
  },

  render(h) {
    return (
      <el-card shadow="never">
        <eos-dynamic-table
          columns={this.columns}
          data={this.data}
          columnAttrs={this.columnAttrs}
          {...{
            attrs: this.$attrs,
            on: this.$listeners,
          }}
        >
          {this.$slots.action}
        </eos-dynamic-table>
      </el-card>
    );
  },
};
</script>
