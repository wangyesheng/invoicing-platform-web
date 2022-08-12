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

    .is_over {
      .el-input__inner {
        border: 1px solid #ff0000;
      }
    }
  }
}
</style>

<template>
  <div class="content-wrap">
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="退库单号">
          <el-input
            v-model="queryForm.nbr"
            placeholder="请输入退库单号"
            clearable
          />
        </el-form-item>
        <el-form-item label="医疗器械编号">
          <el-input
            v-model="queryForm.part"
            placeholder="请输入医疗器械编号"
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
            新增退库单
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <el-table border :data="orderTable.data">
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <div class="expand-wrap">
              <el-tag type="danger">退库明细</el-tag>
              <el-table border :data="row.returnStock_det">
                <el-table-column prop="part" label="医疗器械编号" />
                <el-table-column prop="batch" label="批号" />
                <el-table-column prop="desc" label="耗材名称" />
                <el-table-column prop="com" label="厂家" />
                <el-table-column prop="um" label="规格" />
                <el-table-column prop="package" label="包装" />
                <!-- <el-table-column prop="pdate" label="生产日期" />
                <el-table-column prop="deadline" label="有效期" /> -->
                <el-table-column prop="qty" label="退库数量" />
                <el-table-column prop="unit" label="单位" />
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nbr" label="退库单号" />
        <el-table-column prop="_name" label="医疗器械" />
        <el-table-column prop="userName" label="退库人" />
        <el-table-column prop="orgName" label="部门" />
        <el-table-column prop="_time" label="退库时间" />
        <el-table-column label="审核状态">
          <template slot-scope="{ row }">
            <el-tag :type="row._tag.type">{{ row._tag.label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="onShowOrderDialog(row)"
              v-if="row.status != 1"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="onShowAuditDialog(row)"
              v-if="canAudit"
            >
              审核
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      width="80%"
      :visible.sync="orderDialog.visible"
      :title="orderDialog.isEdit ? '编辑' : '新增'"
      :close-on-click-modal="false"
    >
      <el-form inline>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="退库单号">
              <el-input
                v-model="orderDialog.formData.nbr"
                placeholder="请输入退库单号"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医疗器械">
              <el-select
                filterable
                multiple
                collapse-tags
                placeholder="医疗器械"
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
              <!-- <el-select
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
              </el-select> -->
              <el-input disabled v-model="orderDialog.formData.orgName" />
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
        <!-- <el-table-column prop="num" label="可用数量"></el-table-column> -->
        <el-table-column label="退库数量">
          <template slot-scope="{ row }">
            <el-input
              :class="row.qty > row.num ? 'is_over' : ''"
              v-model="row.qty"
              placeholder="请输入数量"
            />
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

    <el-dialog
      width="30%"
      title="退库单审核"
      :visible.sync="auditDialog.visible"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item>
          <el-radio-group v-model="auditDialog.status" size="medium">
            <el-radio border label="1">通过</el-radio>
            <el-radio border label="-1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="auditDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveAudit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

function effectResult(flag, vm, dialogKey) {
  if (flag) {
    vm.$message.success("操作成功");
    dialogKey && (vm[dialogKey].visible = false);
    vm.getOrders();
  }
}

export default {
  name: "LYD",
  computed: {
    ...mapGetters(["userinfo"]),
    canAudit() {
      return (
        this.userinfo.roles &&
        this.userinfo.roles.some(x => x.roleName == "管理员")
      );
    }
  },
  data() {
    const user = this.$store.getters.userinfo;
    return {
      queryForm: {
        nbr: "",
        part: "",
        operator: user.userId
      },
      orderTable: {
        data: []
      },
      parts: [],
      orderDialog: {
        visible: false,
        isEdit: false,
        selectedParts: [],
        selectedPartIds: [],
        formData: { nbr: "", remark: "", orgId: "", orgName: "" }
      },
      auditDialog: {
        visible: false,
        current: null,
        status: "1"
      }
    };
  },
  async mounted() {
    this.getOrders();
    this.getParts();
  },
  methods: {
    async getOrders() {
      const data = await this.$get("/api/eims/v1/returnStock", this.queryForm);
      const statusToTag = status => {
        const tagMap = {};
        switch (status) {
          case "0":
            tagMap.type = "info";
            tagMap.label = "待审核";
            break;
          case "1":
            tagMap.type = "success";
            tagMap.label = "已通过";
            break;
          case "-1":
            tagMap.type = "danger";
            tagMap.label = "驳回";
            break;
        }
        return tagMap;
      };
      function renderReturnStockMap(returnStock_det) {
        let total = 0,
          returnStocks = [];

        for (let i = 0; i < returnStock_det.length; i++) {
          total += Number(returnStock_det[i].qty);
          returnStocks.push({
            ...returnStock_det[i],
            deadline: dayjs(returnStock_det[i].deadline).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          });
        }
        return {
          total,
          returnStocks
        };
      }
      this.orderTable.data = (data || []).map(x => {
        const { total, returnStocks } = renderReturnStockMap(x.returnStock_det);
        return {
          ...x,
          _time: dayjs(x.date).format("YYYY-MM-DD HH:mm:ss"),
          _name: x.returnStock_det.map(x => x.desc).join("、"),
          _tag: statusToTag(x.status),
          _total: total,
          returnStock_det: returnStocks
        };
      });
    },
    async getParts() {
      const data = await this.$get("/api/eims/v1/stock?com=&part=");
      this.parts = data.map(x => ({
        ...x,
        deadline: dayjs(x.deadline).format("YYYY-MM-DD HH:mm:ss"),
        _key: `${x.com} / ${x.desc} / ${x.batch}`
      }));
    },
    async onShowOrderDialog(scope) {
      this.orderDialog.visible = true;
      if (scope) {
        this.orderDialog.formData = scope;
        this.orderDialog.selectedParts = scope.returnStock_det;
        this.orderDialog.selectedPartIds = scope.returnStock_det.map(
          x => `${x.com} / ${x.desc} / ${x.batch}`
        );
        this.orderDialog.isEdit = true;
      } else {
        const { nbr } = await this.$get("/api/eims/v1/returnStock/nbr");
        const org = this.userinfo.orgs[0];
        this.orderDialog.formData = {
          nbr,
          remark: "",
          orgId: org.orgId,
          orgName: org.orgName
        };
        this.orderDialog.selectedParts = [];
        this.orderDialog.selectedPartIds = [];
        this.orderDialog.isEdit = false;
      }
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
      const returnStock_det = [];
      for (let i = 0; i < this.orderDialog.selectedParts.length; i++) {
        const layer = this.orderDialog.selectedParts[i];
        if (!layer.qty) {
          this.$message.warning(`${layer.desc}退库数量不能为空，请检查！`);
          return;
        }

        returnStock_det.push({
          nbr,
          remark,
          part: layer.part,
          batch: layer.batch,
          com: layer.com,
          qty: layer.qty
        });
      }
      const data = this.orderDialog.isEdit
        ? await this.$put(`/api/eims/v1/requisition/line/${nbr}`, {
            nbr,
            remark,
            returnStock_det
          })
        : await this.$post("/api/eims/v1/returnStock", {
            nbr,
            remark,
            orgId,
            operator: this.userinfo.userId,
            returnStock_det
          });
      effectResult(data, this, "orderDialog");
    },
    onShowAuditDialog(scope) {
      this.auditDialog.current = scope;
      this.auditDialog.status = scope.status == 0 ? "1" : scope.status;
      this.auditDialog.visible = true;
    },
    async saveAudit() {
      const data = await this.$put(
        `/api/eims/v1/returnStock/${this.auditDialog.current.nbr}`,
        {
          status: this.auditDialog.status
        }
      );
      effectResult(data, this, "auditDialog");
    }
  }
};
</script>
