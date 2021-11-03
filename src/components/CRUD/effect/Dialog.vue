<template>
  <el-dialog
    width="30%"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
  >
    <dynamic-form
      ref="formRef"
      v-model="formData"
      :descriptors="config.formDescriptors"
    />
    <span slot="footer">
      <template v-if="$slots.effectAction">
        <slot name="effectAction" />
      </template>
      <template v-else>
        <el-button @click="onReset">重 置</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </template>
    </span>
  </el-dialog>
</template>

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
      visible: false,
      title: "",
      formData: {},
    };
  },

  methods: {
    setVisible(httpMethod, url, scope) {
      this.$nextTick(() => {
        this.httpMethod = httpMethod;
        this.requestUrl = url;
        if (scope) {
          this.title = "编辑";
          this.formData = scope;
        } else {
          this.title = "新增";
          this.formData = {};
        }
        this.visible = !this.visible;
        this.resetFields();
      });
    },
    onReset() {
      this.formData = {};
      this.resetFields();
    },
    async onSubmit() {
      // this.$refs.formRef.validate(async valid => {
      //   if (valid) {

      //   }
      // });
      const reqData = {
        ...this.formData,
        // operator: "1ED16CA0-50EB-4453-AC77-65140FED5460",
      };
      Object.keys(reqData).forEach((key) => {
        if (key.startsWith("_")) delete reqData[key];
      });
      const data = await (this.httpMethod == "post"
        ? this.$post(this.requestUrl, reqData)
        : this.$put(this.requestUrl, reqData));
      if (data) {
        this.$message.success("操作成功！");
        this.visible = false;
        await this.$parent.query();
      }
    },
    resetFields() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
  },
};
</script>
