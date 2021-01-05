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
          <el-form-item label="发货单号" prop="nbr">
            <el-input v-model="formMstr.data.nbr" placeholder="请输入发货单号" />
          </el-form-item>
          <el-form-item label="物流公司" prop="thirdcomp">
            <el-input v-model="formMstr.data.thirdcomp" placeholder="请输入物流公司" />
          </el-form-item>
            <el-form-item label="物流编号" prop="thirdnbr">
            <el-input v-model="formMstr.data.thirdnbr" placeholder="请输入物流编号" />
          </el-form-item>
          <el-form-item label="送货地址" prop="addr">
            <el-input
              v-model="formMstr.data.addr"
              placeholder="请输入送货地址"
            />
          </el-form-item>
          <el-form-item label="运输公司" prop="thirdComp">
            <el-input
              v-model="formMstr.data.thirdComp"
              placeholder="请输入运输公司"
            />
          </el-form-item>
          <el-form-item label="运输单号" prop="thirdNbr">
            <el-input
              v-model="formMstr.data.thirdNbr"
              placeholder="请输入运输单号"
            />
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
              >新建发货行</el-button
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
           <el-form-item label="采购单" prop="poNbr">
              <el-input
                v-model="lineDialog.formData.poNbr"
                placeholder="请输入行号"
              />
            </el-form-item>
            <el-form-item label="行号" prop="line">
              <el-input
                v-model="lineDialog.formData.line"
                placeholder="请输入行号"
              />
            </el-form-item>
            <el-form-item label="采购单号" prop="ponbr">
              <el-input
                v-model="lineDialog.formData.ponbr"
                placeholder="请输入采购单号"
              />
            </el-form-item>









            <el-form-item label="数量" prop="qty">
              <el-input
                v-model="lineDialog.formData.qty"
                placeholder="请输入数量"
              />
            </el-form-item>
            <el-form-item label="单位" prop="um">
              <el-input
                v-model="lineDialog.formData.um"
                placeholder="请输入单位"
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
import shipMixin from "@/mixins/shipMixin";
import { parseTime } from "@/utils";

export default {
  mixins: [shipMixin],
  data() {
    return {
      pageTitle: "",
      formMstr: {
        data: {
          nbr: "",
          thirdnbr: "",
          thirdcomp: "",
          addr: "",
          thirdComp: "",
          thirdNbr: "",
          remark: "",
          domain: "wx"
        },
        rules: {
          nbr: [{ required: true, message: "请输入发货编号", trigger: "blur" }],
          thirdnbr: [{ required: true, message: "请输入物流公司", trigger: "blur" }],
          thirdcomp: [{ required: true, message: "请输入物流编号", trigger: "blur" }],
          addr: [{ required: true, message: "请输入送货地址", trigger: "blur" }]



        },
      },
      lineDialog: {
        title: "",
        visible: false,
        formData: {
          poNbr: '',
          line: 0,
          part: "",
          qty: "",
          um: "ea",
          remark: ''

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
    this.pageTitle = this.nbr ? "编辑发货单" : "新增发货单";
  },
  methods: {
    async getMstrByNbr() {
      const data = await this.$get("/api/plat/v2/ship", { nbr: this.nbr });
      for (let key in data) {
        this.formMstr.data[key] = data[key];
      }
    },
    async handleShowLineDialog(scope) {
      // 验证
      if (
        !this.formMstr.data.nbr ||
        !this.formMstr.data.supp ||
        !this.formMstr.data.addr
      ) {
        alert("请先填写发货单信息");
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
          "/api/plat/v2/ship",
          Object.assign({ saving: true }, this.formMstr.data) // saving表示临时存储数据的，不涉及状态的确认
        );
        // console.log(data);
      }
      this.lineDialog.visible = true;
    },
    handleMstrSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log(this.lineDialog.formData);
          this.$post("/api/plat/v2/ship", this.formMstr.data).then((res) => {
            this.$message({
              message: "发货单已经创建成功",
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
            "/api/plat/v2/ship/line",
            Object.assign(
              { nbr: this.formMstr.data.nbr },
              this.lineDialog.formData
            )
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