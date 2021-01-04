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
          <el-form-item label="发票号" prop="nbr">
            <el-input v-model="formMstr.data.nbr" placeholder="请输入发票号" />
          </el-form-item>
          <el-form-item label="供应商" prop="supp">
            <el-input v-model="formMstr.data.supp" placeholder="请输入供应商" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="formMstr.data.remark"
              placeholder="请输入备注"
              type="textarea"
              autosize
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleShowLineDialog(null)"
              >新建发票行</el-button
            >
          </el-form-item>
          <el-form-item label="">
            <el-table style="width: 100%" :data="lines">
              <el-table-column
                v-for="item in schema.lines"
                :key="item.line"
                :prop="item.field"
                :label="item.label"
              >
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleShowLineDialog(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    @click="handleDeleteLine(scope.row.line)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleMstrSumbit('formMstr')"
              >确定提交</el-button
            >
            <el-button @click="handleReset('formMstr')">重置</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          width="36%"
          :title="lineDialog.title"
          :visible.sync="lineDialog.visible"
        >
          <el-form
            ref="lineForm"
            label-width="100px"
            :model="lineDialog.formData"
            :rules="lineDialog.formRules"
          >
          <el-form-item label="收货单" prop="rcptNbr">
              <el-input
                v-model="lineDialog.formData.rcptNbr"
                placeholder="请输入收货单号"
              />
            </el-form-item>
            <el-form-item label="行号" prop="line">
              <el-input
                v-model="lineDialog.formData.line"
                placeholder="请输入行号"
              />
            </el-form-item>
            <el-form-item label="部件号" prop="part">
              <el-input
                v-model="lineDialog.formData.part"
                placeholder="请输入部件号"
              />
            </el-form-item>
            <el-form-item label="单位" prop="um">
              <el-input
                v-model="lineDialog.formData.um"
                placeholder="请输入单位"
              />
            </el-form-item>
            <el-form-item label="数量" prop="qty">
              <el-input
                v-model="lineDialog.formData.qty"
                placeholder="请输入开票数量"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="lineDialog.formData.remark"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="handleReset('lineForm')">重置</el-button>
            <el-button type="primary" @click="handleLineSumbit('lineForm')"
              >确定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import invoiceMixin from "@/mixins/invoiceMixin";
import { parseTime } from "@/utils";

export default {
  mixins: [invoiceMixin],
  data() {
    return {
      pageTitle: "",
      formMstr: {
        data: {
          nbr: "",
          supp: "",
          remark: "",
        },
        rules: {
          nbr: [{ required: true, message: "请输入标书编号", trigger: "blur" }],
          supp: [{ required: true, message: "请输入供应商", trigger: "blur" }]
        },
      },
      lineDialog: {
        title: "",
        visible: false,
        formData: {
          poNbr: '',
          shipNbr: '',
          rcptNbr: '',
          line: 0,
          part: "",
          price: 0,
          qty: "",
          um: "ea",
        },
        formRules: {
          part: [{ required: true, message: "请输入部件号", trigger: "blur" }],
          qty: [{ required: true, message: "请输入数量", trigger: "blur" }],
          um: [{ required: true, message: "请输入单位", trigger: "blur" }],
        },
      },
    };
  },
  mounted() {
    this.nbr = this.$route.query.nbr;
    this.nbr &&
      Promise.all([this.getMstrByNbr(), this.getLinesByNbr(this.nbr)]);
    this.pageTitle = this.nbr ? "编辑合同" : "新增合同";
  },
  methods: {
    async getMstrByNbr() {
      const data = await this.$get("/api/plat/v2/invoice", { nbr: this.nbr });
      for (let key in data) {
        this.formMstr.data[key] = data[key];
      }
    },
    async handleShowLineDialog(scope) {
      // 验证
      if (
        !this.formMstr.data.nbr ||
        !this.formMstr.data.supp
      ) {
        alert("请先填写发票号");
        return;
      }

      if (scope) {
        // edit
        this.lineDialog.title = "编辑";
        for (let key in scope) {
          this.lineDialog.formData[key] = scope[key];
        }
      } else {
        // add
        this.lineDialog.title = "新增";
        for (let key in this.lineDialog.formData) {
          this.lineDialog.formData[key] = "";
        }

        const data = await this.$post(
          "/api/plat/v2/invoice",
          Object.assign({ saving: true }, this.formMstr.data) // saving表示临时存储数据的，不涉及状态的确认
        );
        // console.log(data);
      }
      this.lineDialog.visible = true;
    },
    handleMstrSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.lineDialog.formData);
          this.$post("/api/plat/v2/invoice", this.formMstr.data).then((res) => {
            this.$message({
              message: "发票已经创建成功",
              type: "success",
            });
            this.lineDialog.visible = false;
            this.getLinesByNbr(this.formMstr.data.nbr);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleLineSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.lineDialog.formData);
          this.$post(
            "/api/plat/v2/invoice/line",
            { 
              nbr: this.formMstr.data.nbr,
              rcptNbr: this.lineDialog.formData.rcptNbr,
              shipNbr: this.lineDialog.formData.shipNbr,
              poNbr: this.lineDialog.formData.poNbr,
              line: this.lineDialog.formData.line,
              part: this.lineDialog.formData.part,
              um: this.lineDialog.formData.um,
              qty: this.lineDialog.formData.qty,
              remark: this.lineDialog.formData.remark
            }
          ).then((res) => {
            this.$message({
              message: "行已保存，可继续创建新行",
              type: "success",
            });
            this.lineDialog.visible = false;
            this.getLinesByNbr(this.formMstr.data.nbr);
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