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
        <el-table-column prop="nbr" label="编号" width="180"> </el-table-column>
        <el-table-column prop="effDate" label="开始日期"> </el-table-column>
        <el-table-column prop="dueDate" label="结束日期"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <eos-tag :type="scope.row._stateTag">{{
              scope.row._stateLabel
            }}</eos-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bivDate" label="竞标日期"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShowLineDialog(scope.row)"
              >进入大厅</el-button
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="lineDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="lineDialog.visible = false"
          >保存</el-button
        >
        <el-button type="primary" @click="lineDialog.visible = false"
          >确定竞标</el-button
        >
      </span>
    </el-dialog>
    <el-drawer
      :title="'当前标号: ' + (!selectdRow ? '' : selectdRow.nbr)"
      :visible.sync="showDrawer"
      direction="rtl"
      size="50%"
    >
      <el-card v-for="item in lines" :key="item.line" class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>L{{item.line}}&nbsp;{{item.part}}&nbsp;{{item.desc}}</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >选为中标</el-button
          >
        </div>
        <el-table
          :show-header="false"
          ref="multipleTable"
          :data="bivDets"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="supp" label="编号" width="120">
          </el-table-column>
          <el-table-column prop="price" label="报价" width="120">
          </el-table-column>
          <el-table-column prop="diffPrice" label="差价" width="120">
          </el-table-column>
          <el-table-column prop="suppName" label="名称"> </el-table-column>
        </el-table>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import bivvingMixin from "@/mixins/bivvingMixin";
import { BIDDING_STATES } from "@/constant";

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
      },
      biddingFlags: BIDDING_STATES,
      tableData: [
        {
          supp: "S0511001",
          name: "上海陆家浜管理公司",
          price: 1.2,
          diffPrice: "+0.1",
        },
        {
          supp: "S0511002",
          name: "无锡国家软件园集团",
          price: 1.09,
          diffPrice: "-0.01",
        },
        {
          supp: "S0511003",
          name: "常州游乐建设集团",
          price: 1.23,
          diffPrice: "+0.12",
        },
      ],
      showDrawer: false,
      selectdRow: null, // 点击`进入大厅`的行对象
      bivDets: [] //  竞标情况
    };
  },
  mounted() {
    this.queryAsync();
  },
  methods: {
    async queryAsync() {
      const data = await this.$get(
        "/api/plat/v2/biv/hall",
        this.queryCondition
      );
      this.rows = (data || []).map((x) => {
        const scope = BIDDING_STATES.find((flag) => flag.value == x.state);
        return {
          ...x,
          _stateTag: scope.tag,
          _stateLabel: scope.label,
        };
      });
    },
    handleShowLineDialog(entity) {
      this.selectdRow = entity;
      // 获取行
      this.getLinesByNbr(entity.nbr);
      // 获取竞标信息，包含供应商、报价和差价等
      this.$get(
        "/api/plat/v2/bid/bivinfo", { "nbr": entity.nbr }
      ).then(res => this.bivDets = res);
      this.showDrawer = true; 
    },
    handleEdit() {},
    handleDelete() {},
    handleSearch() {
      this.queryAsync();
    },
    handleReset() {},
  },
};
</script>

<style lang="scss" scoped>
</style>