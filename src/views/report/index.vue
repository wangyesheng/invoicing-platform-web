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
        <el-form-item label="医疗器械">
          <el-select
            filterable
            placeholder="请选择医疗器械"
            v-model="queryForm.part"
          >
            <el-option
              v-for="(item, index) in parts"
              :key="index"
              :label="item.desc"
              :value="item.part"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科室">
          <el-select
            filterable
            placeholder="请选择科室"
            v-model="queryForm.part"
          >
            <el-option
              v-for="(item, index) in orgs"
              :key="index"
              :label="item.desc"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="零售价状态">
          <el-select
            clearable
            placeholder="请选择零售价状态"
            v-model="queryForm.no_price"
          >
            <el-option label="有" value="0" />
            <el-option label="无" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间区间">
          <el-date-picker
            v-model="queryForm.time"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getOrders">
            查询
          </el-button>
        </el-form-item>

        <el-form-item>
          <download-excel
            v-if="orderTable.data.length > 0"
            style="display: inline-block"
            type="xls"
            :data="orderTable.data"
            :fields="orderTable.excelFields"
            :name="`耗材报表`"
          >
            <el-button type="success">导出全部</el-button>
          </download-excel>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <el-table :data="orderTable.data">
        <el-table-column prop="batch" label="批号" />
        <el-table-column prop="desc" label="耗材名称" />
        <el-table-column prop="com" label="厂家" />
        <el-table-column prop="um" label="规格" />
        <el-table-column prop="package" label="包装" />
        <el-table-column prop="inprice" label="进价" />
        <el-table-column prop="price" label="零售价" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="nbr" label="领用单号" />
        <el-table-column prop="qty" label="领用数量" />
        <!-- <el-table-column prop="remark" label="备注" /> -->
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <download-excel
              style="display: inline-block"
              type="xls"
              :data="[row]"
              :fields="orderTable.excelFields"
              :name="`耗材报表_${row.nbr}`"
            >
              <el-button type="text">导出</el-button>
            </download-excel>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  name: "HCBB",
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
    const beforeOneMonth = dayjs().subtract(1, "month");
    return {
      queryForm: {
        org_id: "",
        part: "",
        no_price: "",
        time: [beforeOneMonth, new Date()]
      },
      orderTable: {
        data: [],
        excelFields: {
          批号: "batch",
          耗材名称: "desc",
          规格: "um",
          厂家: "com",
          包装: "package",
          批号: "batch",
          单位: "unit",
          进价: "inprice",
          零售价: "price",
          领用单号: "nbr",
          领用数量: "qty"
        }
      },
      parts: [],
      orgs: []
    };
  },
  async mounted() {
    this.getOrders();
    this.getOrgs();
    this.getParts();
  },
  methods: {
    async getParts() {
      const data = await this.$get("api/eims/v1/part/query?desc=&com=");
      this.parts = data;
    },
    async getOrgs() {
      const data = await this.$get("api/core/v1/org/query");
      this.orgs = data;
    },
    async getOrders() {
      const { org_id, part, no_price, time } = this.queryForm;
      let startTime = "",
        endTime = "";
      if (time) {
        const [s, e] = time;
        startTime = dayjs(s).format("YYYY-MM-DD HH:mm:ss");
        endTime = dayjs(e).format("YYYY-MM-DD HH:mm:ss");
      }
      const data = await this.$get("/api/eims/v1/chart/requisition_report", {
        org_id,
        part,
        no_price,
        startTime,
        endTime
      });
      this.orderTable.data = data || [];
    }
  }
};
</script>
