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
      <div class="chart-container" style="width: 400px; height: 300px;">
        <div id="chart" ref="chart" style="width: 100%; height: 100%;" />
      </div>
<!--       
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
            <el-button type="text" @click="handleShowLineDialog(scope.row.nbr)"
              >进入大厅</el-button
            >
          </template>
        </el-table-column>
      </el-table> -->
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
  </div>
</template>

<script>
import bivvingMixin from "@/mixins/bivvingMixin";
import { BIDDING_STATES } from "@/constant";

var echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/pictorialBar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

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
    };
  },
  mounted() {
    // this.queryAsync();
    this.initCharts();
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
    handleShowLineDialog(nbr) {
      this.getLinesByNbr(nbr);
      this.lineDialog.visible = true;
    },
    handleEdit() {},
    handleDelete() {},
    handleSearch() {
      this.queryAsync();
    },
    handleReset() {},
    initCharts() {
      var dom = document.getElementById("chart");
      console.log(dom.clientHeight);
      this.chart = echarts.init(dom,'light');
      this.setOptions();
    },
    setOptions() {
      this.chart.setOption({
    backgroundColor: "#38445E",
    grid: {
        left: '12%',
        top: '5%',
        bottom: '12%',
        right: '8%'
    },
    xAxis: {
        data: ['驯鹿', '火箭', '飞机', '高铁', '轮船', '汽车', '跑步', '步行', ],
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 129, 109, 0.1)',
                width: 1 //这里是为了突出显示加上的
            }
        },
        axisLabel: {
            textStyle: {
                color: '#999',
                fontSize: 12
            }
        }
    },
    yAxis: [{
        splitNumber: 2,
        axisTick: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: 'rgba(255, 129, 109, 0.1)',
                width: 1 //这里是为了突出显示加上的
            }
        },
        axisLabel: {
            textStyle: {
                color: '#999'
            }
        },
        splitArea: {
            areaStyle: {
                color: 'rgba(255,255,255,.5)'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: 'rgba(255, 129, 109, 0.1)',
                width: 0.5,
                type: 'dashed'
            }
        }
    }],
    series: [{
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '0%',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        label: {
            show: true,
            position: 'top',
            distance: 15,
            color: '#DB5E6A',
            fontWeight: 'bolder',
            fontSize: 20,
        },
        itemStyle: {
            normal: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                            offset: 0,
                            color: 'rgba(232, 94, 106, .8)' //  0%  处的颜色
                        },
                        {
                            offset: 1,
                            color: 'rgba(232, 94, 106, .1)' //  100%  处的颜色
                        }
                    ],
                    global: false //  缺省为  false
                }
            },
            emphasis: {
                opacity: 1
            }
        },
        data: [123, 60, 25, 18, 12, 9, 2, 1],
        z: 10
    }]
});
    },
  },
};
</script>

<style lang="scss" scoped>
</style>