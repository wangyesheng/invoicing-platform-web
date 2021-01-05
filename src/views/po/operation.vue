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
            <eos-combo-grid
              :config="comboSuppConfig"
              @select="handleComboSelectSupp"
              v-model="formMstr.data.supp"
            />
            {{ !combSuppResult ? "" : combSuppResult.userName }}
          </el-form-item>
          <el-form-item label="送货地址" prop="addr">
            <el-input
              v-model="formMstr.data.addr"
              placeholder="请输入送货地址"
            />
          </el-form-item>
          <el-form-item label="开始日期" prop="effDate">
            <el-date-picker
              type="date"
              placeholder="请选择开始日期"
              v-model="formMstr.data.effDate"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="截止日期" prop="dueDate">
            <el-date-picker
              type="date"
              placeholder="请选择截止日期"
              v-model="formMstr.data.dueDate"
              style="width: 100%"
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
              >新建行信息</el-button
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
            <el-form-item label="行号" prop="line">
              <el-input
                v-model="lineDialog.formData.line"
                placeholder="请输入行号"
              />
            </el-form-item>
            <el-form-item label="部件号" prop="part">
              <!-- <el-input
                v-model="lineDialog.formData.part"
                placeholder="请输入部件号"
              /> -->
              <eos-combo-grid
                :config="comboPartConfig"
                @select="handleComboSelectPart"
                v-model="lineDialog.formData.part"
              />
              {{ !combPartResult ? "" : combPartResult.desc }}
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input
                v-model="lineDialog.formData.price"
                placeholder="请输入底价"
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
import poMixin from "@/mixins/poMixin";
import { parseTime } from "@/utils";

export default {
  mixins: [poMixin],
  data() {
    return {
      pageTitle: "",
      formMstr: {
        data: {
          nbr: "",
          supp: "",
          addr: "",
          effDate: "",
          dueDate: "",
          remark: "",
        },
        rules: {
          nbr: [{ required: true, message: "请输入标书编号", trigger: "blur" }],
          supp: [{ required: true, message: "请输入供应商", trigger: "blur" }],
          addr: [
            { required: true, message: "请输入送货地址", trigger: "blur" },
          ],
          effDate: [
            { required: true, message: "请选择开始日期", trigger: "blur" },
          ],
          dueDate: [
            { required: true, message: "请选择截止日期", trigger: "blur" },
          ],
        },
      },
      lineDialog: {
        title: "",
        visible: false,
        formData: {
          line: 0,
          part: "",
          price: 0,
          qty: "",
          um: "ea",
        },
        formRules: {
          part: [{ required: true, message: "请输入部件号", trigger: "blur" }],
          price: [
            { required: true, message: "请输入采购价格", trigger: "blur" },
          ],
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
      combSuppResult: {}, // 供应商返回对象
      comboPartConfig: {
        url: "/api/plat/v2/part/combo",
        params: {
          domain: "wx",
        },
        tableColumns: [
          {
            field: "part",
            label: "部件号",
          },
          {
            field: "desc",
            label: "部件名称",
          },
          {
            field: "um",
            label: "单位",
          },
        ],
      },
      combPartResult: {}, // 供应商返回对象
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
      const data = await this.$get("/api/plat/v2/po", { nbr: this.nbr });
      for (let key in data) {
        this.formMstr.data[key] = data[key];
      }
    },
    async handleShowLineDialog(scope) {
      // 验证
      if (
        !this.formMstr.data.nbr ||
        !this.formMstr.data.effDate ||
        !this.formMstr.data.dueDate
      ) {
        alert("请先填写采购合同编码");
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

        this.formMstr.data.dueDate = parseTime(
          this.formMstr.data.dueDate,
          "{y}-{m}-{d}"
        );
        this.formMstr.data.effDate = parseTime(
          this.formMstr.data.effDate,
          "{y}-{m}-{d}"
        );
        const data = await this.$post(
          "/api/plat/v2/po",
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
          this.$post("/api/plat/v2/po", this.formMstr.data).then((res) => {
            this.$message({
              message: "采购合同已经创建成功",
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
            "/api/plat/v2/po/line",
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
    handleComboSelectSupp(value) {
      if (value && value.length) {
        this.$set(this.formMstr.data, "supp", value[0].account);
        this.$set(this.combSuppResult, "userName", value[0].userName);
      }
    },
    handleComboSelectPart(value) {
      if (value && value.length) {
        this.$set(this.lineDialog.formData, "part", value[0].part);
        this.$set(this.lineDialog.formData, "um", value[0].um);
        this.$set(this.combPartResult, "desc", value[0].desc);
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