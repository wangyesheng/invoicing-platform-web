<script>
export default {
  props: {
    condition: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      formItems: [],
    };
  },

  created() {
    for (let key in this.condition) {
      this.formItems.push({ key, ...this.condition[key] });
    }
  },

  methods: {
    onChange(key, value) {
      const scope = this.formItems.find((x) => x.key == key);
      scope.value = value;
    },
    onClick(flag) {
      switch (flag) {
        case "query":
          this.$emit(
            "on-search",
            this.formItems.reduce((memo, current) => {
              memo[current.key] = current.value;
              return memo;
            }, {})
          );
          break;
      }
    },
  },

  render(h) {
    return (
      <div class="action-wrap">
        <el-form inline>
          {this.formItems.map((item) => {
            return (
              <el-form-item key={item.key} label={item.label}>
                {item.control == "input" ? (
                  <el-input
                    value={item.value}
                    placeholder={`请输入${item.label}`}
                    clearable
                    onInput={(val) => this.onChange(item.key, val)}
                  />
                ) : item.control == "date" ? (
                  <el-date-picker
                    value={item.value}
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    onInput={(val) => this.onChange(item.key, val)}
                  />
                ) : (
                  <el-select
                    value={item.value}
                    placeholder="请选择状态"
                    clearable
                    onChange={(val) => this.onChange(item.key, val)}
                  >
                    <el-option label="区域一" value="shanghai" />
                    <el-option label="区域二" value="beijing" />
                  </el-select>
                )}
              </el-form-item>
            );
          })}
          <el-form-item>
            <el-button type="primary" onClick={() => this.onClick("query")}>
              查询
            </el-button>
          </el-form-item>
          {this.$slots.effect}
        </el-form>
      </div>
    );
  },
};
</script>
