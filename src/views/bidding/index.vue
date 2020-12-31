<template>
  <div class="app-content">
    <el-table :data="biddingInfos">
      <el-table-column
        prop="bid_nbr"
        label="编号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="bid_domain"
        label="地址"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="bid_eff_date"
        label="招标开始日期"
      >
      </el-table-column>
      <el-table-column
        prop="bid_due_date"
        label="招标结束日期"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleShowLineDialog(scope.row.bid_nbr)"
          >查询招标行</el-button>
          <el-button
            type="text"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="handleDelete(scope.row.bid_nbr)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="招标行信息"
      width="60%"
      :visible.sync="lineDialog.visible"
    >
      <el-table :data="biddingInfos">
        <el-table-column
          prop="bid_nbr"
          label="编号"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="bid_domain"
          label="地址"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="bid_eff_date"
          label="招标开始日期"
        >
        </el-table-column>
        <el-table-column
          prop="bid_due_date"
          label="招标结束日期"
        >
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    const biddingInfos = Array(20).fill({
      bid_nbr: 'AAA',
      bid_domain: '江苏南通',
      bid_eff_date: '2021-01-01',
      bid_due_date: '2021-01-10',
    });
    const biddingLineInfos = Array(20).fill({
      bidd_line: '1',
      bidd_part: '江苏南通',
      bid_eff_date: '2021-01-01',
      bid_due_date: '2021-01-10',
    });
    return {
      biddingInfos,
      lineDialog: {
        visible: false,
      },
      biddingLineInfos
    };
  },
  methods: {
    handleShowLineDialog() {
      this.lineDialog.visible = true;
    },
    handleEdit() {},
    handleDelete() {},
  },
};
</script>

<style lang="scss" scoped>
</style>