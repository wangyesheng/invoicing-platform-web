<template>
  <div class="app-content">
    <el-card shadow="never">
      <div class="bidding-operation-wrap">
        <!-- <h3>{{pageTitle}}</h3> -->
        <el-divider />
        <el-form
          ref="biddingForm"
          label-width="100px"
          :model="biddingForm.data"
          :rules="biddingForm.rules"
        >
          <el-form-item
            label="编号"
            prop="nbr"
          >
            <el-input
              v-model="biddingForm.data.nbr"
              placeholder="请输入编号"
            />
          </el-form-item>
          <el-form-item
            label="开始日期"
            prop="effDate"
          >
            <el-date-picker
              type="date"
              placeholder="请选择开始日期"
              v-model="biddingForm.data.effDate"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item
            label="截止日期"
            prop="dueDate"
          >
            <el-date-picker
              type="date"
              placeholder="请选择截止日期"
              v-model="biddingForm.data.dueDate"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="biddingForm.data.remark"
              placeholder="请输入备注"
              type="textarea"
              autosize
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleShowLineDialog(null)"
            >新建行信息</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-table
              style="width: 100%"
              :data="lines"
            >
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
            <el-button
              type="primary"
              @click="handleSumbit('biddingForm')"
            >确定提交</el-button>
            <el-button @click="handleReset('biddingForm')">重置</el-button>
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
            <el-form-item
              label="部件号"
              prop="part"
            >
              <el-input
                v-model="lineDialog.formData.part"
                placeholder="请输入部件号"
              />
            </el-form-item>
            <el-form-item
              label="底价"
              prop="price"
            >
              <el-input
                v-model="lineDialog.formData.price"
                placeholder="请输入底价"
              />
            </el-form-item>
            <el-form-item
              label="数量"
              prop="qty"
            >
              <el-input
                v-model="lineDialog.formData.qty"
                placeholder="请输入数量"
              />
            </el-form-item>
            <el-form-item
              label="单位"
              prop="um"
            >
              <el-input
                v-model="lineDialog.formData.um"
                placeholder="请输入单位"
              />
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="handleReset('lineForm')">重置</el-button>
            <el-button
              type="primary"
              @click="handleSumbit('lineForm')"
            >确定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getMainBiddingsByNbrRes } from '@/api/bidding';
import biddingMixin from '@/mixins/biddingMixin';

export default {
  mixins: [biddingMixin],
  data() {
    return {
      pageTitle: '',
      biddingForm: {
        data: {
          nbr: '',
          effDate: '',
          dueDate: '',
          remark: '',
        },
        rules: {
          nbr: [{ required: true, message: '请输入标书编号', trigger: 'blur' }],
          effDate: [
            { required: true, message: '请选择开始日期', trigger: 'blur' },
          ],
          dueDate: [
            { required: true, message: '请选择截止日期', trigger: 'blur' },
          ],
        },
      },
      lineDialog: {
        title: '',
        visible: false,
        formData: {
          part: '',
          price: '',
          qty: '',
          um: '',
        },
        formRules: {
          part: [{ required: true, message: '请输入部件号', trigger: 'blur' }],
          price: [
            { required: true, message: '请输入底价', trigger: 'blur' },
          ],
          qty: [{ required: true, message: '请输入数量', trigger: 'blur' }],
          um: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        },
      },
    };
  },
  mounted() {
    this.nbr = this.$route.query.nbr;
    this.nbr &&
      Promise.all([
        this.getMainBiddingsByNbr(),
        this.getlinesByNbr(this.nbr),
      ]);
    this.pageTitle = this.nbr ? '编辑标书' : '新增标书';
  },
  methods: {
    async getMainBiddingsByNbr() {
      const data = await getMainBiddingsByNbrRes(this.nbr);
      for (let key in data) {
        this.biddingForm.data[key] = data[key];
      }
    },
    handleShowLineDialog(scope) {
      if (scope) {
        // edit
        this.lineDialog.title = '编辑';
        for (let key in scope) {
          this.lineDialog.formData[key] = scope[key];
        }
      } else {
        // add
        this.lineDialog.title = '新增';
        for (let key in this.lineDialog.formData) {
          this.lineDialog.formData[key] = '';
        }
      }
      this.lineDialog.visible = true;
    },
    handleSumbit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
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
.bidding-operation-wrap {
  width: 80%;
  margin: 0 auto;
}
</style>