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
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from "vuex";

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

  computed: {
    ...mapGetters(["userinfo"]),
  },

  methods: {
    setVisible(httpMethod, url, scope) {
      this.$nextTick(() => {
        this.httpMethod = httpMethod;
        this.requestUrl = url;
        if (this.$parent.needOperator) {
          this.formData = {
            _operator: this.userinfo.userId,
            operator: this.userinfo.userName,
          };
        } else {
          this.formData = {};
        }
        if (scope) {
          this.title = "编辑";
          this.formData = {
            ...this.formData,
            ...scope,
          };
        } else {
          this.title = "新增";
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
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const [url, key] = this.requestUrl.split(":");

          let reqData = {
              ...this.formData,
            },
            params;

          if (key) {
            params = this.formData[key];
            delete reqData[key];
          }

          if (this.$parent.needOperator) {
            reqData.operator = reqData._operator;
          }

          Object.keys(reqData).forEach((key) => {
            key.startsWith("_") && delete reqData[key];
          });

          const data = await (this.httpMethod == "post"
            ? this.$post(url, reqData)
            : this.$put(`${url}${params}`, reqData));

          if (data) {
            this.$message.success("操作成功！");
            this.visible = false;
            this.$parent.query();
          }
        }
      });
    },
    resetFields() {
      this.$refs.formRef && this.$refs.formRef.resetFields();
    },
  },
};
</script>
