<script>
export default {
  props: {
    condition: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      formItems: []
    };
  },

  created() {
    for (let key in this.condition) {
      this.formItems.push({ key, ...this.condition[key] });
    }
  },

  methods: {
    onInput(key, value) {
      const scope = this.formItems.find(x => x.key == key);
      scope.value = value;
      console.log(this.formItems);
    },
    onChange(key, value) {
      const scope = this.formItems.find(x => x.key == key);
      scope.value = value;
      console.log(this.formItems);
    }
  },

  render(h) {
    return (
      <div class="action-wrap">
        <el-form inline>
          {this.formItems.map(item => {
            return (
              <el-form-item key={item.key} label={item.label}>
                {item.control == "input" ? (
                  <el-input
                    value={item.value}
                    placeholder="请输入编号"
                    clearable
                    onInput={val => this.onInput(item.key, val)}
                  />
                ) : (
                  <el-select
                    value={item.value}
                    placeholder="请选择状态"
                    clearable
                    onChange={val => this.onChange(item.key, val)}
                  >
                    <el-option label="区域一" value="shanghai" />
                    <el-option label="区域二" value="beijing" />
                  </el-select>
                )}
              </el-form-item>
            );
          })}
        </el-form>
      </div>
    );
  }
};
</script>
