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
        <el-form-item label="开始日期">
          <el-date-picker
            clearable
            type="date"
            placeholder="请选择开始日期"
            v-model="queryCondition.effDate"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            clearable
            type="date"
            placeholder="请选择结束日期"
            v-model="queryCondition.dueDate"
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
              v-for="item in biddingFlags"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <el-table :data="rows">
        <el-table-column prop="nbr" label="编号" width="180"> </el-table-column>
        <el-table-column
          prop="effDate"
          label="开始日期"
          :formatter="dateFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="dueDate"
          label="结束日期"
          :formatter="dateFormatter"
        >
        </el-table-column>
        <el-table-column prop="line" label="行号"> </el-table-column>
        <el-table-column prop="part" label="部件"> </el-table-column>
        <el-table-column prop="desc" label="部件名称"> </el-table-column>
        <el-table-column prop="price" label="报价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <eos-tag :type="scope.row._stateTag">{{
              scope.row._stateLabel
            }}</eos-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="bivDate"
          label="竞标日期"
          :formatter="dateFormatter"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSaveBaojia(scope.row)"
              v-if="scope.row.state < 2"
              >保存</el-button
            >
            <el-button
              type="text"
              @click="handleJingbiao(scope.row)"
              v-if="scope.row.state < 3"
              >{{ scope.row.state == 2 ? "取消" : "竞标" }}</el-button
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
        <el-table-column prop="price" label="报价">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" v-if="lineDialog.state < 2">
        <el-button @click="lineDialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleSaveDet(true)"
          v-if="lineDialog.state < 2"
          >保存</el-button
        >
        <el-button
          type="primary"
          @click="handleSaveDet(false)"
          v-if="lineDialog.state < 2"
          >确定竞标</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bivvingMixin from "@/mixins/bivvingMixin";
import { BIVVING_STATES } from "@/constant";

export default {
  mixins: [bivvingMixin],
  data() {
    return {
      rows: [],
      queryCondition: {
        nbr: "",
        effDate: "",
        dueDate: "",
        state: "",
      },
      lineDialog: {
        visible: false,
        nbr: "",
        state: -1,
      },
      biddingFlags: BIVVING_STATES,
    };
  },
  mounted() {
    this.queryAsync();
  },
  methods: {
    async queryAsync() {
      const data = await this.$get(
        "/api/plat/v2/biv/query",
        this.queryCondition
      );
      this.rows = (data || []).map((x) => {
        const scope = BIVVING_STATES.find((flag) => flag.value == x.state);
        return {
          ...x,
          _stateTag: scope.tag,
          _stateLabel: scope.label,
        };
      });
    },
    handleSaveBaojia(row) {
      this.$post("/api/plat/v2/biv/save", {
        nbr: row.nbr,
        line: row.line,
        price: row.price,
      }).then((res) => {
        if (res) {
          this.$message({
            message:
              "竞标信息已经保存! 确认无误后，可以点击`确定竞标`以提交竞标信息！",
            type: "success",
          });
          this.lineDialog.visible = false;
        } else {
        }
        this.queryAsync();
      });
    },
    handleEdit() {},
    handleDelete() {},
    handleSearch() {
      this.queryAsync();
    },
    dateFormatter(row, column) {
      return !row.date ? row.date : row.date.slice(0, 10);
    },
    handleReset() {},
    handleJingbiao(row) {
      this.$post("/api/plat/v2/biv/jingb", {
        nbr: row.nbr,
        line: row.line,
        price: row.price,
      }).then((res) => {
        if (res) {
          this.$message({
            message: "竞标成功! 请等待开标结果！",
            type: "success",
          });
        } else {
        }
        this.queryAsync();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>