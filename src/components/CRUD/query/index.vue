<script>
export default {
  props: {
    config: {
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
    for (let key in this.config.fields) {
      this.formItems.push({ key, ...this.config.fields[key] });
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
              // timerange 特殊处理
              if (current.key == "timerange") {
                memo[current.mapFields[0]] = current.value
                  ? current.value[0]
                  : "";
                memo[current.mapFields[1]] = current.value
                  ? current.value[1]
                  : "";
              } else {
                memo[current.key] = current.value;
              }
              return memo;
            }, {})
          );
          break;
        case "effect":
          this.$parent.onEffect("post", null);
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
          {this.config.hideEffect ? null : (
            <el-form-item>
              {this.$slots.queryAction ? (
                this.$slots.queryAction
              ) : (
                <el-button
                  type="primary"
                  onClick={() => this.onClick("effect")}
                >
                  新增
                </el-button>
              )}
            </el-form-item>
          )}
        </el-form>
      </div>
    );
  },
};
</script>
