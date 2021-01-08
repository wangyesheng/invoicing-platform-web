<template>
  <div class="app-content">
    <div class="eos-operation-wrap">
      <el-form inline :model="queryCondition">
        <el-form-item label="编号">
          <!-- <el-input
            clearable
            v-model="queryCondition.nbr"
            placeholder="请输入编号"
          /> -->

          <eos-combo-grid :config="comboConfig" @select="handleSelect" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker clearable type="date" placeholder="请选择开始日期" v-model="queryCondition.effDate"
            style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker clearable type="date" placeholder="请选择结束日期" v-model="queryCondition.dueDate"
            style="width: 100%;" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select clearable placeholder="请选择状态" v-model="queryCondition.state">
            <el-option v-for="item in biddingFlags" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
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
        <el-table-column prop="nbr" label="编号" width="180">
        </el-table-column>
        <el-table-column prop="effDate" label="开始日期">
        </el-table-column>
        <el-table-column prop="dueDate" label="结束日期">
        </el-table-column>
        <el-table-column prop="state" label="状态">
          <template slot-scope="scope">
            <eos-tag :type="scope.row._stateTag">{{scope.row._stateLabel}}</eos-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleShowLineDialog(scope.row.nbr)">明细</el-button>
            <el-button type="text" @click="$router.push(`/bidding/operation?nbr=${scope.row.nbr}`)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row.nbr)">删除</el-button>
            <el-button type="text" @click="handleAction1(scope.row.nbr)">发标</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="标书信息" width="60%" :visible.sync="lineDialog.visible">
      <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
       <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="编号">
            <el-input v-model="mstrData.nbr" style="width: 60%" disabled=1></el-input>
          </el-form-item>
          <el-form-item label="开始日期" prop="effDate">
            <el-input v-model="mstrData.effDate" style="width: 60%" disabled=1></el-input>

          </el-form-item>
          <el-form-item label="截止日期" prop="dueDate">
            <el-input v-model="mstrData.dueDate" style="width: 60%" disabled=1></el-input>

          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="mstrData.remark" style="width: 60%" disabled=1></el-input>

          </el-form-item>
        </el-form>
        <el-table style="width: 100%" :data="lines">
          <el-table-column v-for="item in schema.lines" :key="item.line" :prop="item.field" :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import biddingMixin from '@/mixins/biddingMixin';
  import {
    BIDDING_STATES
  } from '@/constant';

  export default {
    mixins: [biddingMixin],
    data() {
      return {
        comboConfig: {
          url: '/api/plat/v2/bid/det',
          params: {
            nbr: 'BI2101030001',
          },
          tableColumns: [{
              field: 'line',
              label: '行号',
            },
            {
              field: 'part',
              label: '部件号',
            },
            {
              field: 'price',
              label: '底价',
            },
            {
              field: 'qty',
              label: '数量',
            },
            {
              field: 'um',
              label: '单位',
            },
          ],
        },
        rows: [],
        queryCondition: {
          nbr: '',
          effDate: '',
          dueDate: '',
          state: '',
        },
        lineDialog: {
          visible: false,
        },
        biddingFlags: BIDDING_STATES,
        mstrData: {
          nbr: '',
          effDate: '',
          dueDate: '',
          remark: '',
        },
        loading: true
      };
    },
    mounted() {
      this.queryAsync();
    },
    methods: {
      handleSelect(value) {
        console.log('data from child', value);
      },
      async queryAsync() {
        const result = await this.$get(
          '/api/plat/v2/bid/query',
          this.queryCondition
        );
        this.rows = (result || []).map((x) => {
          const scope = BIDDING_STATES.find((flag) => flag.value == x.state);
          return {
            ...x,
            _stateTag: scope.tag,
            _stateLabel: scope.label,
          };
        });
      },
      handleShowLineDialog(nbr) {
        this.lineDialog.visible = true;
        Promise.all(this.getMainBiddingsByNbr(nbr), this.getLinesByNbr(nbr));
        this.loading = false;
      },
      handleEdit() {},
      handleDelete() {},
      handleAction1(nbr) {
        // 如果给`Action1`命名具体了，就和业务关联了，这个是要尽量避免的

        this.$confirm('你确定要执行此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$post('/api/plat/v2/bid/fab', {
            nbr: nbr
          }).then((res) => {
            console.log(res);
          });
        });
      },
      handleSearch() {
        this.queryAsync();
      },
      handleReset() {},
      async getMainBiddingsByNbr(nbr) {
        const data = await this.$get('/api/plat/v2/bid', {
          nbr: nbr
        });
        for (let key in data) {
          this.mstrData[key] = data[key];
        }
      }
    },

  };
</script>

<style lang="scss" scoped>
</style>