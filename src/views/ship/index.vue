<template>
  <div class="app-content">
    <div class="eos-operation-wrap">
      <el-form inline :model="queryCondition">
        <el-form-item label="编号">
          <el-input
            clearable
            v-model="queryCondition.nbr"
            placeholder="请输入编号"
          />
        </el-form-item>
        <el-form-item label="发货日期">
          <el-date-picker
            clearable
            type="date"
            placeholder="请选择发货日期"
            v-model="queryCondition.date"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            clearable
            placeholder="请选择状态"
            v-model="queryCondition.state"
          >
            <el-option
              v-for="item in states"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
        <el-table-column prop="nbr" label="编号" width="120"> </el-table-column>
        <el-table-column prop="supp" label="供应商" width="150">
        </el-table-column>
        <el-table-column prop="suppName" label="供应商名称" width="150">
        </el-table-column>
        <el-table-column prop="addr" label="送货地址" width="200">
        </el-table-column>
        <el-table-column prop="date" label="发货日期" :formatter="dateFormatter"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <eos-tag :type="scope.row._stateTag">{{
              scope.row._stateLabel
            }}</eos-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShowLineDialog(scope.row.nbr)"
              >订单行</el-button
            >
            <el-button
              type="text"
              @click="$router.push(`/ship/operation?nbr=${scope.row.nbr}`)"
              >编辑</el-button
            >
            <el-button type="text" @click="handleDelete(scope.row.nbr)"
              >删除</el-button
            >
            <el-button type="text" @click="handleAction1(scope.row.nbr)"
              >打印</el-button
            >
             <el-button type="text" @click="handleExpress(scope.row.nbr)"
              >物流</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="行信息" width="60%" :visible.sync="lineDialog.visible">
      <el-table style="width: 100%" :data="lines">
        <el-table-column
          v-for="item in schema.lines"
          :key="item.line"
          :prop="item.field"
          :label="item.label"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
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
        nbr: "",
        date: "",
        state: "",
      },
      lineDialog: {
        visible: false,
      },
      states: PO_STATES,
    };
  },
  mounted() {
    this.queryAsync();
  },
  methods: {
    async queryAsync() {
      const result = await this.$get(
        "/api/plat/v2/ship/query",
        this.queryCondition
      );
      this.rows = (result || []).map((x) => {
        const scope = PO_STATES.find((flag) => flag.value == x.state);
        return {
          ...x,
          _stateTag: scope.tag,
          _stateLabel: scope.label,
        };
      });
    },
    dateFormatter(row, column) {
      return !row.date ? row.date : row.date.slice(0, 10);
    },
    handleShowLineDialog(nbr) {
      this.getLinesByNbr(nbr);
      this.lineDialog.visible = true;
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
    handleExpress(){}
  },
};
</script>

<style lang="scss" scoped>
</style>