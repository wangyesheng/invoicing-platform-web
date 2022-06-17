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
          <el-button type="primary" @click="onShowOrderDialog(null)">
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
              <el-tag type="danger">领用明细</el-tag>
              <el-table border :data="row.requisition_det">
                <el-table-column prop="batch" label="批号" />
                <el-table-column prop="desc" label="耗材名称" />
                <el-table-column prop="com" label="厂家" />
                <el-table-column prop="um" label="规格" />
                <el-table-column prop="package" label="包装" />
                <el-table-column prop="pdate" label="生产日期" />
                <el-table-column prop="deadline" label="有效期" />
                <el-table-column prop="qty" label="领用数量" />
                <el-table-column prop="unit" label="单位" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nbr" label="领用单号" />
        <el-table-column prop="_time" label="领用时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="审核状态">
          <template slot-scope="{ row }">
            <el-tag :type="row._tag.type">{{ row._tag.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onShowOrderDialog(row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
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
          <el-col :span="6">
            <el-form-item label="领用单号">
              <el-input
                v-model="orderDialog.formData.nbr"
                placeholder="请输入领用单号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医疗器械目录">
              <el-select
                filterable
                multiple
                collapse-tags
                placeholder="医疗器械目录"
                v-model="orderDialog.selectedPartIds"
                @change="onPartSelected"
              >
                <el-option
                  v-for="(item, index) in parts"
                  :key="index"
                  :label="item._key"
                  :value="item._key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-select
                filterable
                style="width:100%"
                placeholder="请选择部门"
                v-model="orderDialog.formData.orgId"
              >
                <el-option
                  v-for="item in userinfo.orgs"
                  :key="item.orgId"
                  :label="item.orgName"
                  :value="item.orgId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
        <el-table-column prop="batch" label="批号"></el-table-column>
        <el-table-column prop="deadline" label="有效期"></el-table-column>
        <el-table-column prop="num" label="可用数量"></el-table-column>
        <el-table-column label="领用数量">
          <template slot-scope="{ row }">
            <el-input v-model="row.qty" placeholder="请输入数量"></el-input>
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
  name: "LYD",
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
        title: "新增领用单",
        selectedParts: [],
        selectedPartIds: [],
        formData: { nbr: "", remark: "", orgId: "" }
      }
    };
  },
  async mounted() {
    this.getOrders();
    this.getParts();
  },
  methods: {
    async getOrders() {
      const data = await this.$get("/api/eims/v1/requisition", this.queryForm);
      const statusToTag = status => {
        const tagMap = {};
        switch (status) {
          case "0":
            tagMap.type = "info";
            tagMap.label = "待审核";
            break;
          case "1":
            tagMap.type = "success";
            tagMap.label = "已领用";
            break;
          case "-1":
            tagMap.type = "danger";
            tagMap.label = "驳回";
            break;
        }
        return tagMap;
      };
      this.orderTable.data = (data || []).map(x => ({
        ...x,
        _time: dayjs(x.date).format("YYYY-MM-DD HH:mm:ss"),
        _tag: statusToTag(x.status),
        requisition_det: x.requisition_det.map(y => ({
          ...y,
          pdate: dayjs(y.pdate).format("YYYY-MM-DD HH:mm:ss"),
          deadline: dayjs(y.deadline).format("YYYY-MM-DD HH:mm:ss")
        }))
      }));
    },
    async getParts() {
      const data = await this.$get("/api/eims/v1/stock?com=&part=");
      this.parts = data.map(x => ({
        ...x,
        deadline: dayjs(x.deadline).format("YYYY-MM-DD HH:mm:ss"),
        _key: `${x.com} - ${x.desc} - ${x.batch}`
      }));
    },
    async onShowOrderDialog(scope) {
      if (scope) {
        this.orderDialog.formData = scope;
        this.orderDialog.selectedParts = scope.requisition_det;
        this.orderDialog.selectedPartIds = scope.requisition_det.map(
          x => x.part
        );
      } else {
        const { nbr } = await this.$get("/api/eims/v1/requisition/nbr");
        this.orderDialog.formData.nbr = nbr;
      }
      this.orderDialog.visible = true;
    },
    onPartSelected(keys) {
      this.orderDialog.selectedParts = this.parts
        .filter(x => keys.includes(x._key))
        .map(x => ({
          ...x,
          qty: ""
        }));
    },
    async onSubmit() {
      const { nbr, remark, orgId } = this.orderDialog.formData;
      const reqData = {
        nbr,
        remark,
        orgId,
        operator: this.userinfo.userId,
        requisition_det: this.orderDialog.selectedParts.map(x => ({
          nbr,
          remark,
          part: x.part,
          batch: x.batch,
          qty: x.qty
        }))
      };
      const data = await this.$post("/api/eims/v1/requisition", reqData);
    }
  }
};
</script>
