<style lang="scss" scoped></style>
<template>
  <div class="content-wrap">
    <div class="action-wrap">
      <el-form inline>
        <el-form-item label="编号">
          <el-input
            v-model="queryCondition.nbr"
            placeholder="请输入编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input
            v-model="queryCondition.part"
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"> 查询 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card shadow="never">
      <eos-dynamic-table
        :columns="stockTable.columns"
        :data="stockTable.data"
      >
      </eos-dynamic-table>
    </el-card>
  </div>
</template>

<script>
import formDescriptorsMixin from "@/mixins/formDescriptorsMixin";

export default {
  mixins: [formDescriptorsMixin],

  data() {
    return {
      queryCondition: {
        nbr: "",
        part: ""
      },
      stockTable: {
        columns: [],
        data: [],
        total: 0
      }
    };
  },

  mounted() {
    Promise.all([this.getMianView(), this.getStorages()]);
  },

  methods: {
    async getMianView() {
      const {
        form: { descriptors },
        table: { columns }
      } = await this.$get("/api/discovery/view/stock/main");
      this.stockTable.columns = columns;
    },
    async getStorages() {
      const data = await this.$get(
        "/api/eims/v1/stock/query",
        this.queryCondition
      );
      this.stockTable.data = data;
    },
  }
};
</script>
