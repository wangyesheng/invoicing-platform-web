<template>
  <div class="content-wrap">
    <!-- <CRUD
      :query-config="{
        fields: {
          part: { control: 'input', label: '医疗器械编号', value: '' },
          com: { control: 'input', label: '公司', value: '' }
        },
        hideEffect: true
      }"
      :table-config="{
        columnAttrs: { align: 'center' },
        effect: {
          put: false,
          delete: false
        }
      }"
      :urls="{
        view: '/api/discovery/view/stock/main',
        get: '/api/eims/v1/stock'
      }"
    /> -->
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="编号">
          <el-input
            v-model="queryForm.part"
            placeholder="请输入编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="厂家">
          <el-input
            v-model="queryForm.com"
            placeholder="请输入厂家名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryStocks">
            查询
          </el-button>
        </el-form-item>
        <el-form-item> </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <el-table border :data="stookTable.data">
        <el-table-column
          v-for="col in stookTable.columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
        />
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <download-excel
              :data="[row]"
              :fields="stookTable.excelFields"
              type="xls"
              :name="`库存明细_${row.batch}`"
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
import dayjs from "dayjs";

export default {
  name: "Stock",

  data() {
    return {
      queryForm: {
        part: "",
        com: ""
      },
      stookTable: {
        data: [],
        columns: [],
        excelFields: {}
      }
    };
  },

  mounted() {
    this.queryStocks();
    this.queryMainView();
  },

  methods: {
    renderExcel(scope) {
      const fields = {
        入库单号: "nbr",
        医疗器械名称: "_name",
        入库时间: "_time",
        规格: "um",
        厂家: "com",
        包装: "package",
        批号: "batch",
        生产日期: "pdate",
        有效期: "deadline",
        数量: "num",
        单位: "unit"
      };
      const data = scope.receipt_det.map(x => ({
        nbr: scope.nbr,
        _name: scope._name,
        _time: scope._time,
        ...x
      }));
      return {
        fields,
        data
      };
    },
    async queryStocks() {
      const data = await this.$get("/api/eims/v1/stock", this.queryForm);
      this.stookTable.data = (data || []).map(x => ({
        ...x,
        pdate: dayjs(x.pdate).format("YYYY-MM-DD HH:mm:ss"),
        deadline: dayjs(x.deadline).format("YYYY-MM-DD HH:mm:ss")
      }));
    },
    async queryMainView() {
      const {
        table: { columns }
      } = await this.$get("/api/discovery/view/stock/main");
      this.stookTable.columns = columns
        .filter(x => x.isShow !== false)
        .map(x => {
          this.stookTable.excelFields[x.label] = x.prop;
          return x;
        });
    }
  }
};
</script>
