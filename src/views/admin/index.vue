<template>
  <div class="index">
    <div class="index_data">
      <el-card class="box-card">
        <div class>
          <div class="flex space-between">
            <span>用户量</span>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div class style="font-size:30px;margin-top:1rem;">1000</div>
          <div class="flex space-between border_bottom" style="margin-top:1rem;padding-bottom:2rem;">
            <span>
              周同比 12%
              <span class="el-icon-upload2" style="color:red;"></span>
            </span>
            <span>
              日同比 3%
              <span class="el-icon-download" style="color:blue;"></span>
            </span>
          </div>
          <div style="margin-top:1rem;">日均16</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class>
          <div class="flex space-between">
            <span>访问量</span>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div class style="font-size:30px;margin-top:1rem;">80000</div>
          <div class="flex space-between border_bottom" style="margin-top:1rem;padding-bottom:2rem;">
            <span>
              周同比 10%
              <span class="el-icon-upload2" style="color:red;"></span>
            </span>
            <span>
              日同比 2%
              <span class="el-icon-download" style="color:blue;"></span>
            </span>
          </div>
          <div style="margin-top:1rem;">日均访问量 235</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class>
          <div class="flex space-between">
            <span>月销售额</span>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div class style="font-size:30px;margin-top:1rem;">￥ 120000</div>
          <div class="flex space-between border_bottom" style="margin-top:1rem;padding-bottom:2rem;">
            <span>
              月同比 14%
              <span class="el-icon-upload2" style="color:red;"></span>
            </span>
            <span>
              日同比5%
              <span class="el-icon-download" style="color:blue;"></span>
            </span>
          </div>
          <div style="margin-top:1rem;">日均销售额￥4000</div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class>
          <div class="flex space-between">
            <span>总销售额</span>
            <span class="el-icon-warning-outline"></span>
          </div>
          <div class style="font-size:30px;margin-top:1rem;">￥ 13545655</div>
          <div class="flex space-between border_bottom" style="margin-top:1rem;padding-bottom:2rem;">
            <span>
              周同比 13%
              <span class="el-icon-upload2" style="color:red;"></span>
            </span>
            <span>
              日同比 5%
              <span class="el-icon-download" style="color:blue;"></span>
            </span>
          </div>
          <div style="margin-top:1rem;">日均销售额￥ 4212</div>
        </div>
      </el-card>
    </div>
    <div class="sales">
      <el-card class="box-card">
        <el-tabs type="border-card">
          <el-tab-pane class="flex" label="用户数据" style="height:100%;width:100%;">
            <v-chart :options="option_two" />
            <v-chart :options="option" />

          </el-tab-pane>
          <el-tab-pane label="销量数据">
            <el-progress type="circle" :percentage="60"></el-progress>
            <el-progress style="margin-left:2rem;" type="circle" :percentage="25"></el-progress>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
  // import "echarts/lib/component/legend";
  import ECharts from 'vue-echarts';
  import 'echarts/lib/chart/line';
  import 'echarts/lib/component/polar';
  import "echarts/lib/chart/pie";
  import 'echarts/lib/component/tooltip';
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/markLine";
  import "echarts/lib/component/graphic";
  export default {
    name: "Index",
    components: {
      'v-chart': ECharts
    },
    data() {
      let data = [];
      for (let i = 0; i <= 360; i++) {
        let t = i / 180 * Math.PI
        let r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
      };
      return {
        option: {},
        nodeEnv: process.env.NODE_ENV,
        option_two: {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }]
        },
      };
    },
    created() {
      this.getData();
    },
    mounted() {
      // this.getData();
    },
    methods: {
      getData(count = 10) {
        var nameList = [
          '赵', '钱', '孙', '李', '周'
        ];
        var legendData = [];
        var selected = {};
        var seriesData = [];
        for (var i = 0; i < count; i++) {
          name = Math.random() > 0.65 ?
            makeWord(4, 1) + '·' + makeWord(3, 0) :
            makeWord(2, 1);
          legendData.push(name);
          seriesData.push({
            name: name,
            value: Math.round(Math.random() * 100000)
          });
          selected[name] = i < 6;
        };

        function makeWord(max, min) {
          var nameLen = Math.ceil(Math.random() * max + min);
          var name = [];
          for (var i = 0; i < nameLen; i++) {
            name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
          }
          return name.join('');
        };
        console.log(legendData)
        this.option = {
          title: {
            text: '同名数量统计',
            subtext: '纯属虚构',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: legendData,
            selected: selected
          },
          series: [{
            name: '姓名',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        }
      },

    },
  };
</script>

<style lang="scss" scoped>
  .index {
    padding: 10px;

    .index_data {
      display: flex;
      justify-content: space-between;

      &>.el-card {
        width: 24%;
        height: 15rem !important;
      }
    }

    .sales {
      width: 100%;
      display: flex;
      justify-content: space-around;

      &>.el-card {
        width: 100%;

        // height: 20rem;
        .el-card__body {
          height: 100% !important;
        }
      }
    }
  }

  .flex {
    display: flex;
  }

  .space-between {
    justify-content: space-between;
  }

  .border_bottom {
    border-bottom: 1px solid #ddd;
  }
</style>
