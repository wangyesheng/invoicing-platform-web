<template>
  <div class="app-content">
    <div class="eos-operation-wrap">
      <el-form inline :model="queryCondition">
        <el-form-item label="编号">
          <el-input
            clearable
            v-model="queryCondition.part"
            placeholder="请输入编号"
          />
        </el-form-item>
       <el-form-item label="名称">
          <el-input
            clearable
            v-model="queryCondition.desc"
            placeholder="请输入名称"
          />
        </el-form-item>
         <el-form-item label="域">
          <el-input
            clearable
            v-model="queryCondition.domain"
            placeholder="请输入域"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button
            plain
            @click="handleReset"
          >重置</el-button> -->
        <!-- </el-form-item> -->
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table :data="rows">
        <el-table-column prop="part" label="编号" width="120"> </el-table-column>
        <el-table-column prop="desc" label="名称" width="150"> </el-table-column>
         <el-table-column prop="um" label="单位" width="120"> </el-table-column>
        <el-table-column prop="domain" label="域" width="150">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push(`/part/operation?part=${scope.row.part}`)"
              >编辑</el-button
            >
            <el-button type="text" @click="handleDelete(scope.row.part)"
              >删除</el-button
            >
            <el-button type="text" @click="handleAction1(scope.row.part)"
              >打印</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import shipMixin from "@/mixins/shipMixin";
import { PO_STATES } from "@/constant";

export default {
  mixins: [shipMixin],
  data() {
    return {
      rows: [],
      queryCondition: {
        part: "",
        domain: "",
         desc: ""
      },
    };
  },
  mounted() {
    this.queryAsync();
  },
  methods: {
    async queryAsync() {
      const result = await this.$get(
        "/api/plat/v2/part/query",
        this.queryCondition
      );
      this.rows = (result || []).map((x) => {
        return {
          ...x
        };
      });
    },
    handleEdit() {},
    handleDelete() {},
    handleAction1(nbr) {
      alert("打印");
    },
    handleSearch() {
      this.queryAsync();
    },
    handleReset() {},
  },
};
</script>

<style lang="scss" scoped>
</style>