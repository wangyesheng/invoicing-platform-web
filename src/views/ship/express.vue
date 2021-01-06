<template>
  <div class="app-content">
    <div class="eos-operation-wrap">
      <el-form inline :model="queryCondition">
        <el-form-item label="发货单号">
          <el-input
            clearable
            v-model="queryCondition.nbr"
            placeholder="发货单号"
          />
        </el-form-item>
       <el-form-item label="快递单号">
          <el-input
            clearable
            v-model="queryCondition.thirdNbr"
            placeholder="请输入快递单号"
          />
        </el-form-item>
       <el-form-item label="物流公司">
          <el-select
            clearable
            placeholder="请选择物流"
            v-model="queryCondition.thirdComp"
          >
            <el-option
              v-for="item in expresscoms"
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
    <div>
      <el-row>
        <el-col :lg="12" :xl="12">        
          <div style=" width: 100%;">
            <h3 style="text-align: center;">物流信息</h3>
            <div style="padding-top: 20px;"  v-for="item in Traces">
                <i><span style="color:red">时间：{{item.AcceptTime}}</span></i>
                <br/> 
                <i>{{item.AcceptStation}} </i>
            </div>
            <span style="color:red" v-if="play">无物流信息</span>
          </div>
        </el-col>
        <el-col :lg="12" :xl="12">
          <h3 style="text-align: center;">轨迹信息</h3>
          <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler"  style="padding-top: 20px;">
            <!--缩放-->
            <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
            <!--定位-->
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <!--点-->
            <bm-marker :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_DROP">
                <!--提示信息-->
                <bm-info-window :show="map.show">无轨迹信息~</bm-info-window>
            </bm-marker>
          </baidu-map> 
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { EXPRESSCOM } from '@/constant';

export default {
  data() {
    return {
      play:false,
      Traces: [],
      queryCondition: {
        thirdNbr: "",
        thirdComp: "",
        nbr: ""
      },
      map:{
          center: {lng: 121.4472540000, lat: 31.3236200000},
          zoom: 15,
          show: true,
          dragging: true
      },
      expresscoms: EXPRESSCOM,
    };
  },
  mounted() {
    this.handleReset();
  },
  methods: {
    async queryAsync() {
      const result = await this.$get(
        "/api/plat/v2/Logistics",
        this.queryCondition
      );
      if(result!=null&& result.Traces.length>0)
      {
           this.play=false;
      }else{
           this.play=true;
      }
      this.Traces = result.Traces;
    },
    handleSearch() {
      this.queryAsync();
    },
    handleReset() {},
       handler ({BMap, map}) {
                let me = this;
                console.log(BMap, map)
                // 鼠标缩放
                map.enableScrollWheelZoom(true);
                // 点击事件获取经纬度
                map.addEventListener('click', function (e) {
                    console.log(e.point.lng, e.point.lat)
                })
       }
  },
};
</script>

<style lang="scss" scoped>
    .map {
        width: 100%;
        height: 600px;
    }
</style>