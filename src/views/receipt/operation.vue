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
          <el-form-item label="编号" prop="nbr">
            <el-input v-model="formMstr.data.nbr" placeholder="请输入编号" />
          </el-form-item>
          <el-form-item label="供应商" prop="supp">
            <!-- <el-input v-model="formMstr.data.supp" placeholder="请输入供应商" /> -->
            <eos-combo-grid
              placeholder="请输入供应商"
              :config="comboSuppConfig"
              v-model="formMstr.data._supp"
              @select="handleComboSelectSupp"
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
              >新建收货行</el-button
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
            <el-form-item label="发货单" prop="shipNbr">
              <eos-combo-grid
                :config="comboShipConfig"
                @select="handleComboSelectShip"
                v-model="lineDialog.formData.shipNbr"
                placeholder="请输入采购单"
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
              {{ lineDialog.formData._desc }}
            </el-form-item>
            <el-form-item label="单位" prop="um">
              <el-input
                v-model="lineDialog.formData.um"
                placeholder="请输入单位"
              />
            </el-form-item>
            <el-form-item label="发货数量" prop="_shipQty">
              <el-input
                v-model="lineDialog.formData._shipQty"
                placeholder="请输入数量"
              />
            </el-form-item>
            <el-form-item label="收货数量" prop="qty">
              <el-input
                v-model="lineDialog.formData.qty"
                placeholder="请输入收货数量"
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
import receiptMixin from "@/mixins/receiptMixin";
import { parseTime, clone } from "@/utils";

export default {
  mixins: [receiptMixin],
  data() {
    return {
      pageTitle: "",
      formMstr: {
        data: {
          nbr: "",
          supp: "",
          _supp: "",
          remark: "",
          state: 0,
        },
        rules: {
          nbr: [{ required: true, message: "请输入标书编号", trigger: "blur" }],
          supp: [{ required: true, message: "请输入供应商", trigger: "blur" }],
        },
      },
      lineDialog: {
        title: "",
        visible: false,
        formData: {
          nbr: "",
          shipNbr: "",
          poNbr: "",
          line: 0,
          part: "",
          qty: "",
          um: "ea",
          remark: "",
          _desc: "",
          _shipQty: 0, // 发货数量
        },
        formRules: {
          part: [{ required: true, message: "请输入部件号", trigger: "blur" }],
          qty: [{ required: true, message: "请输入数量", trigger: "blur" }],
          um: [{ required: true, message: "请输入单位", trigger: "blur" }],
        },
      },
      comboSuppConfig: {
        url: "/api/plat/v2/user/combo",
        params: {
          domain: "wx",
        },
        tableColumns: [
          {
            field: "account",
            label: "账号",
          },
          {
            field: "userName",
            label: "名称",
          },
        ],
      },
      comboShipConfig: {
        url: "/api/plat/v2/ship/combo",
        params: {
          domain: "wx",
        },
        tableColumns: [
          {
            field: "nbr",
            label: "收货单",
          },
          {
            field: "line",
            label: "行号",
          },
          {
            field: "part",
            label: "部件号",
          },
          {
            field: "desc",
            label: "部件名称",
          },
          {
            field: "qty",
            label: "收货数量",
          },
          {
            field: "um",
            label: "单位",
          },
          {
            field: "rcptQty",
            label: "收货数量",
          },
        ],
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
      const data = await this.$get("/api/plat/v2/receipt", { nbr: this.nbr });
      for (let key in data) {
        this.formMstr.data[key] = data[key];
      }
    },
    async handleShowLineDialog(scope) {
      // 验证
      if (!this.formMstr.data.nbr || !this.formMstr.data.supp) {
        alert("请先填写收货编码");
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
          "/api/plat/v2/receipt",
          clone(this.formMstr.data)
        );
      }
      this.lineDialog.visible = true;
    },
    handleMstrSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post(
            "/api/plat/v2/receipt",
            clone(this.formMstr.data, ["state", 1])
          ).then((res) => {
            this.$message({
              message: "收货单已经创建成功",
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
            "/api/plat/v2/receipt/line",
            clone(this.lineDialog.formData, ["nbr", this.formMstr.data.nbr])
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
    handleComboSelectSupp(value) {
      if (value && value.length) {
        this.formMstr.data._supp = value[0].account + " - " + value[0].userName;
        this.formMstr.data.supp = value[0].account;
      }
    },
    handleComboSelectShip(value) {
      if (value && value.length) {
        this.lineDialog.formData.shipNbr = value[0].nbr;
        this.lineDialog.formData.poNbr = value[0].poNbr;
        this.lineDialog.formData.line = value[0].line;
        this.lineDialog.formData.part = value[0].part;
        this.lineDialog.formData._desc = value[0].desc;
        this.lineDialog.formData.um = value[0].um;
        this.lineDialog.formData._shipQty = value[0].qty;
      }
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