<template>
  <el-dialog
    width="30%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="config.title"
  >
    <dynamic-form
      v-model="config.formData"
      ref="formRef"
      :descriptors="config.formDescriptors"
    />
    <template slot="footer">
      <slot name="footer"></slot>
    </template>
    <!-- <span slot="footer">
      <el-button @click="storageDialog.visible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span> -->
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
    };
  },

  methods: {
    setVisible() {
      console.log(this.$refs.formRef);
      this.$refs.formRef && this.$refs.formRef.resetFields();
      this.visible = !this.visible;
    },
  },
};
</script>