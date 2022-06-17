<style lang="scss" scoped>
.content-wrap {
  ::v-deep {
    .el-table__expanded-cell {
      padding: 20px;
    }
    .expand-wrap {
      padding: 20px;
      border: 1px dashed #1890ff;
      position: relative;
      .el-tag {
        position: absolute;
        top: -15px;
        left: -15px;
      }
    }
  }
}
</style>

<template>
  <div class="content-wrap">
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="编号">
          <el-input
            v-model="queryForm.part"
            placeholder="请输入编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="queryForm.nbr"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrders">
            查询
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onShowOrderDialog">
            新增领用单
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <el-table border :data="orderTable.data">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <div class="expand-wrap">
              <el-tag type="danger">医疗器械目录明细</el-tag>
              <el-table border :data="row.receipt_det">
                <el-table-column prop="desc" label="耗材名称" />
                <el-table-column prop="um" label="规格" />
                <el-table-column prop="com" label="厂家" />
                <el-table-column prop="package" label="包装" />
                <el-table-column prop="batch" label="批号" />
                <el-table-column prop="pdate" label="生产日期" />
                <el-table-column prop="deadline" label="有效期" />
                <el-table-column prop="num" label="数量" />
                <el-table-column prop="unit" label="单位" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nbr" label="入库单号" />
        <el-table-column prop="_time" label="入库时间" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>

    <el-dialog
      width="80%"
      :visible.sync="orderDialog.visible"
      :title="orderDialog.title"
      :close-on-click-modal="false"
    >
      <el-form inline>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="入库单号">
              <el-input
                v-model="orderDialog.formData.nbr"
                placeholder="请输入入库单号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="耗材">
              <el-select
                filterable
                multiple
                collapse-tags
                placeholder="请选择耗材"
                v-model="orderDialog.selectedPartIds"
                @change="onPartSelected"
              >
                <el-option
                  v-for="item in parts"
                  :key="item.part"
                  :label="item.desc"
                  :value="item.part"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入备注信息"
                v-model="orderDialog.formData.remark"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table border :data="orderDialog.selectedParts">
        <el-table-column prop="desc" label="耗材名称"></el-table-column>
        <el-table-column prop="um" label="规格"></el-table-column>
        <el-table-column prop="package" label="包装"></el-table-column>
        <el-table-column prop="com" label="厂家"></el-table-column>
        <el-table-column label="批号">
          <template slot-scope="{ row }">
            <el-input v-model="row.batch" placeholder="请输入批号"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="生产日期">
          <template slot-scope="{ row }">
            <el-date-picker
              v-model="row.pdate"
              type="date"
              placeholder="请选择生产日期"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="{ row }">
            <el-date-picker
              v-model="row.deadline"
              type="date"
              placeholder="请选择有效期"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="数量">
          <template slot-scope="{ row }">
            <el-input v-model="row.num" placeholder="请输入数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="orderDialog.visible = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  name: "RKD",
  computed: {
    ...mapGetters(["userinfo"])
  },
  data() {
    return {
      queryForm: {
        nbr: "",
        part: ""
      },
      orderTable: {
        data: []
      },
      parts: [],
      orderDialog: {
        visible: false,
        title: "新增入库单",
        selectedParts: [],
        selectedPartIds: [],
        formData: { nbr: "", remark: "" }
      }
    };
  },
  async mounted() {
    this.getOrders();
    this.getParts();
  },
  methods: {
    query() {},
    async getOrders() {
      const data = await this.$get("/api/eims/v1/receipt", this.queryForm);
      this.orderTable.data = data.map(x => ({
        ...x,
        _time: dayjs(x.date).format("YYYY-MM-DD HH:mm:ss"),
        receipt_det: x.receipt_det.map(y => ({
          ...y,
          pdate: dayjs(y.pdate).format("YYYY-MM-DD HH:mm:ss"),
          deadline: dayjs(y.deadline).format("YYYY-MM-DD HH:mm:ss")
        }))
      }));
    },
    async getParts() {
      const data = await this.$get("/api/eims/v1/part/query?desc=&com=");
      this.parts = data;
    },
    async onShowOrderDialog() {
      const { nbr } = await this.$get("/api/eims/v1/receipt/nbr");
      this.orderDialog.formData.nbr = nbr;
      this.orderDialog.visible = true;
    },
    onPartSelected(ids) {
      this.orderDialog.selectedParts = this.parts
        .filter(x => ids.includes(x.part))
        .map(x => ({
          ...x,
          batch: "",
          num: "",
          deadline: "",
          pdate: ""
        }));
    },
    async onSubmit() {
      const {
        formData: { nbr, remark },
        selectedParts
      } = this.orderDialog;
      const reqData = {
        nbr,
        remark,
        operator: this.userinfo.userId,
        receipt_det: selectedParts.map(x => ({
          nbr,
          part: x.part,
          batch: x.batch,
          num: x.num,
          deadline: x.deadline,
          pdate: x.pdate,
          com: x.com
        }))
      };
      const data = await this.$post("/api/eims/v1/receipt", reqData);
    }
  }
};
</script>
