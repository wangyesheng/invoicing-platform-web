<template>
  <div class="content-wrap">
    <div class="header">
      <div class="inner">
        <img
          class="avatar"
          :src="require('../../assets/user/avatar.png')"
          alt=""
        />
        <div class="con">
          <span class="great">
            {{ userinfo.userName }} ，祝你开心每一天！
          </span>
          <span class="extends"
            >角色：{{ userinfo.roles && userinfo.roles[0].roleName }}</span
          >
        </div>
      </div>
    </div>
    <div class="chart-wrap">
      <el-row :gutter="20">
        <div id="receiptRateWrap" />
        <!-- <el-col :span="12">
          <div id="receiptRateWrap" />
        </el-col> -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as echarts from "echarts";
export default {
  computed: {
    ...mapGetters(["userinfo"])
  },
  data() {
    return {};
  },
  mounted() {
    this.getReceiptRate();
  },
  methods: {
    async getReceiptRate() {
      const data = await this.$get("/api/eims/v1/chart/requisition");
      const ops = data.reduce(
        (memo, current) => {
          memo.xAxisData.push(current.name);
          memo.seriesData.push(current.num);
          return memo;
        },
        {
          xAxisData: [],
          seriesData: []
        }
      );
      this.renderChart(ops);
    },
    renderChart(ops) {
      const options = {
        title: {
          text: "近一月耗材领用数前五名",
          x: "center",
          textStyle: {
            fontSize: 18,
            color: "#666"
          }
        },
        grid: {
          show: true,
          top: 100
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        xAxis: {
          name: "耗材名称",
          type: "category",
          data: ops.xAxisData
        },
        // 图例
        legend: {
          data: ["领用数"],
          top: 40
        },
        yAxis: {
          name: "领用数（个）"
        },
        series: [
          {
            type: "bar",
            data: ops.seriesData,
            name: "领用数",
            color: ["#409EFF"]
          }
        ]
      };
      this.$nextTick(() => {
        const receiptRateWrap = echarts.init(
          document.getElementById("receiptRateWrap")
        );
        receiptRateWrap.setOption(options);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  height: 100px;
  padding: 20px;
  line-height: 30px;
  .inner {
    display: flex;
    align-items: center;
    img.avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .con {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .great {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
      }
      .extends {
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
      }
    }
  }
}

.chart-wrap {
  background: #fff;
  margin-top: 20px;
  padding: 20px;
  #receiptRateWrap {
    width: 100%;
    height: calc(100vh - 280px);
  }
}
</style>
