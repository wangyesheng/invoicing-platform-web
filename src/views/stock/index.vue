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
        <el-form-item label="名称">
          <el-input
            v-model="queryForm.com"
            placeholder="请输入名称"
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
        columns: []
      }
    };
  },

  mounted() {
    this.queryStocks();
    this.queryMainView();
  },

  methods: {
    async queryStocks() {
      const data = await this.$get("/api/eims/v1/stock", this.queryForm);
      this.stookTable.data = data.map(x => ({
        ...x,
        pdate: dayjs(x.pdate).format("YYYY-MM-DD HH:mm:ss"),
        deadline: dayjs(x.deadline).format("YYYY-MM-DD HH:mm:ss")
      }));
    },
    async queryMainView() {
      const {
        table: { columns }
      } = await this.$get("/api/discovery/view/stock/main");
      // this.stookTable.columns = columns;
      this.stookTable.columns = columns.filter(x => x.isShow !== false);
    }
  }
};
</script>
