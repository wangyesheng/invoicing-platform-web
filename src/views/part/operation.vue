<template>
  <div class="app-content">
    <el-card shadow="never">
      <div class="operation-wrap">
        <!-- <h3>{{pageTitle}}</h3> -->
        <el-divider />
        <el-form
          ref="formMstr"
          label-width="100px"
          :model="formMstr.data"
          :rules="formMstr.rules"
        >
          <el-form-item label="编号" prop="part">
            <el-input v-model="formMstr.data.part" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="域" prop="domain">
            <el-input
              v-model="formMstr.data.domain"
              placeholder="请输入域"
            />
          </el-form-item>
            <el-form-item label="单位" prop="um">
            <el-input
              v-model="formMstr.data.um"
              placeholder="请输入单位"
            />
          </el-form-item>
          <el-form-item label="名称" prop="desc">
            <el-input
              v-model="formMstr.data.desc"
              placeholder="请输入名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleMstrSumbit('formMstr')"
              >确定提交</el-button
            >
            <el-button @click="handleReset('formMstr')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import shipMixin from "@/mixins/shipMixin";
import { parseTime } from "@/utils";

export default {
  mixins: [shipMixin],
  data() {
    return {
      pageTitle: "",
      formMstr: {
        data: {
          part: "",
          domain: "",
          desc: "",
          um: ""
        },
        rules: {
          part: [{ required: true, message: "请输入部件号", trigger: "blur" }],
          domain: [{ required: true, message: "请输入域", trigger: "blur" }],
          desc: [{ required: true, message: "请输入部件名称", trigger: "blur" }],
          um: [{ required: true, message: "请输入部件单位", trigger: "blur" }]
        },
      }
    };
  },
  mounted() {
    this.part = this.$route.query.part;
    this.part &&
      Promise.all([this.getMstrByNbr()]);
    this.pageTitle = this.nbr ? "编辑部件" : "新增部件";
  },
  methods: {
      async getMstrByNbr() {
      const data = await this.$get("/api/plat/v2/part", { part: this.part });
      for (let key in data) {
        this.formMstr.data[key] = data[key];
      }
    },
    handleMstrSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post("/api/plat/v2/part", this.formMstr.data).then((res) => {
            this.$message({
              message: "部件已经创建成功",
              type: "success",
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleReset(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.operation-wrap {
  width: 80%;
  margin: 0 auto;
}
</style>