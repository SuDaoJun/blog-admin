<template>
  <div class="project-index">
    <h2 class="content-title">数据统计</h2>
    <el-row :gutter="48">
      <el-col :lg="6" v-for="(item, index) in analysisList" :key="item.description">
        <div :class="activeIndex === index? 'analysis-box analysis-active': 'analysis-box'"
          @click="activeChange(index)">
          <div class="box-icon" :style="{backgroundColor:activeIndex === index ? item.color : 'transparent'}">
            <i :class="item.icon" :style="{ color: activeIndex === index ? '#fff' : item.color }"></i>
          </div>
          <div class="box-data">
            <p class="data-description">
              {{ item.description }}
            </p>
            <div class="data-total" :style="{ color: item.color }">
              <countTo :startVal="0" :endVal="item.numTotal" :duration="3000"></countTo>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="content-line">
      <div class="line-header">
        <div class="header-show">
          <p>当前日期选择：</p>
          <p>
            {{dateArr[0] === dateArr[1]? dateArr[0]: `${dateArr[0]}至${dateArr[1]}`}}
          </p>
        </div>
        <div class="header-time">
          <el-radio-group v-model="timeActive" size="medium" style="margin-right: 40px;" @change="radioChange"
            v-show="dateArr[0] === dateArr[1]">
            <el-radio-button :label="item.value" v-for="item in timeArr" :key="item.value">{{ item.name }}
            </el-radio-button>
          </el-radio-group>
          <el-date-picker v-model="dateArr" type="daterange" unlink-panels range-separator="至" :clearable="false"
            value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
            @change='timeChange'>
          </el-date-picker>
        </div>
      </div>
      <div class="line-content">
        <el-row>
          <el-col :lg="18">
            <div class="content-charts">
              <h4>{{ analysisList[activeIndex].description }}</h4>
              <MyEcharts :style="{ width: '100%', height: '400px' }" :option="lineAnalysisOption">
              </MyEcharts>
              <empty-show iconLeft="35%"
                :hide="lineAnalysisOption.xAxis &&lineAnalysisOption.xAxis.data.length > 0? false: true" />
            </div>
          </el-col>
          <el-col :lg="6">
            <div class="content-list">
              <div class="rank-header">
                <h4>{{rankObj.title}}</h4>
              </div>
              <div class="list-rank">
                <p></p>
                <p>{{rankObj.info}}</p>
                <p>数量</p>
              </div>
              <div class="list-data">
                <el-scrollbar style="height:100%">
                  <ul>
                    <li :key="item._id" v-for="(item, index) in rankList">
                      <div :class="index < 3 ? 'rank-active rank-index' : 'rank-index'">{{ index + 1 }}</div>
                      <span>{{ item._id }}</span>
                      <span>{{ item.count | NumFormat}}</span>
                    </li>
                  </ul>
                </el-scrollbar>
              </div>
              <empty-show iconLeft='85%' :hide='rankList.length != 0?false:true' />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content-bar">
      <h3>文章标签</h3>
      <MyEcharts :style="{width: '100%', height: '400px'}" :option="barTabOption">
      </MyEcharts>
      <empty-show iconLeft="50%" :hide="barTabOption.series && barTabOption.series[0].data.length > 0? false: true" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-index {
  padding-bottom: 24px;
  & > h3 {
    margin-bottom: 20px;
    font-size: 20px;
  }
  .analysis-box {
    padding: 16px 24px;
    @include bg-color($color-W100, $color-C70);
    margin-bottom: 24px;
    border-radius: 4px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
    }
    .box-icon {
      padding: 10px;
      border-radius: 5px;
      i {
        font-size: 50px;
      }
    }
    .box-data {
      display: flex;
      align-items: center;
      flex-direction: column;
      .data-description {
        font-size: 18px;
        letter-spacing: 1px;
        color: $color-G90;
        margin-bottom: 10px;
      }
      .data-total {
        font-size: 30px;
      }
    }
  }
  .analysis-active {
    transform: translateY(-6px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  }
  .content-line {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    .line-header {
      padding: 20px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header-show {
        color: #606266;
        display: flex;
        align-items: flex-end;
        p {
          font-size: 16px;
        }
      }
      .header-time {
        display: flex;
        align-items: center;
      }
    }
    .line-content {
      padding: 20px 20px 40px;
      h4 {
        font-size: 18px;
        color: #303133;
      }
      .content-list {
        .rank-header {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .list-rank {
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          p:first-child {
            width: 40px;
            height: 20px;
          }
        }
        .list-data {
          height: 350px;
          /deep/ .el-scrollbar__wrap {
            overflow-x: hidden;
          }
          li {
            margin-top: 30px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .rank-index {
              width: 20px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              border-radius: 50%;
              @include bg-color($color-G30, $color-W10);
            }
            .rank-active {
              color: $color-W100;
              @include bg-color(#409eff, $color-B50);
            }
          }
        }
      }
    }
  }
  .content-bar {
    margin-top: 24px;
    padding: 30px 20px 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    position: relative;
    h3 {
      font-size: 18px;
      margin-left: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>

<script>
import MyEcharts from "@/components/MyEcharts";
import EmptyShow from "@/components/EmptyShow";
import { currentDay, timeDataArr } from "@/utils/utils";
import countTo from "vue-count-to";
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      timeSelect: false,
      timeActive: "day",
      timeArr: [
        {
          name: "天",
          value: "day"
        },
        {
          name: "周",
          value: "week"
        },
        {
          name: "月",
          value: "month"
        },
        {
          name: "年",
          value: "year"
        }
      ],
      dateArr: [],
      activeIndex: 0,
      analysisList: [
        {
          numTotal: 0,
          icon: "el-icon-s-custom",
          color: "#40C9C6",
          description: "访客数量"
        },
        {
          numTotal: 0,
          icon: "el-icon-user-solid",
          color: "#FFAA5C",
          description: "用户数量"
        },
        {
          numTotal: 0,
          icon: "el-icon-document",
          color: "#38A2F7",
          description: "文章总数"
        },
        {
          numTotal: 0,
          icon: "el-icon-s-comment",
          color: "#8543E0",
          description: "留言总数"
        }
      ],
      lineAnalysisOption: {},
      rankList: [],
      rankObj: {
        title: "访客访问量排名",
        type: "day",
        info: "小时"
      },
      barTabOption: {}
    };
  },
  created() {},
  mounted() {
    this.dateArr = [currentDay("day"), currentDay("day")];
    this.getTotalNum();
    this.initChart();
  },
  methods: {
    getTotalNum() {
      // 初始化数量
      this.$api.statistics.countTotal().then(res => {
        let code = res.code;
        if (code === this.$constant.reqSuccess) {
          let data = res.data;
          this.analysisList[0].numTotal = data.accessUserTotal;
          this.analysisList[1].numTotal = data.userTotal;
          this.analysisList[2].numTotal = data.articleTotal;
          this.analysisList[3].numTotal = data.messageTotal;
        }
      });
    },
    // 初始化图表
    initChart() {
      let { analysisList, activeIndex } = this;
      this.lineAnalysisOption = {
        grid: {
          left: "2%",
          top: "10%",
          bottom: "3%",
          right: "5%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          padding: [10, 20, 10, 15],
          axisPointer: {
            lineStyle: {
              color: analysisList[activeIndex].color,
              width: 2
            }
          },
          formatter: "小时：{b} </br>{a0}：{c0} 人"
        },
        xAxis: {
          show: true,
          type: "category",
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#C0C4CC"
            }
          },
          axisLabel: {
            color: "#707378"
          },
          data: []
        },
        yAxis: {
          show: true,
          axisTick: {
            show: false
          },
          minInterval: 1,
          max: function(value) {
            return value.max * 2;
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#C0C4CC"
            }
          },
          axisLabel: {
            color: "#707378"
          },
          splitLine: {
            lineStyle: {
              type: "dotted",
              color: "rgba(150,150,150,.2)"
            }
          }
        },
        series: [
          {
            name: "访客人数",
            type: "line",
            symbol: "circle",
            symbolSize: 5,
            markPoint: {
              data: [{ type: "max", name: "最大值" }]
            },
            lineStyle: {
              normal: {
                width: 3
              }
            },
            itemStyle: {
              normal: {
                color: analysisList[activeIndex].color
              },
              emphasis: {
                borderColor: "#fff",
                borderWidth: 2
              }
            },
            data: []
          }
        ]
      };
      this.barTabOption = {
        grid: {
          top: "2%",
          left: "1%",
          right: "8%",
          bottom: "0",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          padding: [10, 20, 10, 15],
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(150,150,150,.2)"
            }
          },
          formatter: "{a0} </br>标签：{b} </br>数量：{c0} 篇"
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: "category",
          inverse: true, //是否是反向坐标轴
          axisLine: {
            show: false //隐藏坐标轴轴线
          },
          axisTick: {
            show: false //隐藏坐标轴刻度
          },
          data: []
        },
        dataZoom: [
          {
            type: "inside",
            id: "insideY",
            yAxisIndex: 0,
            start: 0,
            end: 100
          }
        ],
        series: [
          {
            data: [],
            name: "文章标签",
            type: "bar",
            barWidth: 20,
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                barBorderRadius: 30,
                color: "#00C7A9"
              }
            },
            zlevel: 11,
            label: {
              normal: {
                show: true,
                position: "right",
                color: "#00C7A9",
                fontSize: 12
              }
            }
          }
        ]
      };
      this.$nextTick(() => {
        this.accessLineChart();
        this.accessRankList();
        this.tagArticleInit();
      });
    },
    // 文章标签初始化
    tagArticleInit() {
      this.$api.statistics.tagList().then(res => {
        let code = res.code;
        if (code === this.$constant.reqSuccess) {
          console.log(res);
          let data = res.data;
          let yAxisArr = [];
          let seriesData = [];
          if (data.length > 0) {
            data.forEach(item => {
              yAxisArr.push(item._id ? item._id.name : "未知");
              seriesData.push(item.count);
            });
          }
          this.barTabOption.yAxis.data = yAxisArr;
          this.barTabOption.series[0].data = seriesData;
        } else {
          this.$message.warning("获取文章标签统计失败");
        }
      });
    },
    // 排名展示
    accessRankList() {
      let type = this.rankObj.type;
      this.$api.statistics
        .accessUserList({
          type
        })
        .then(res => {
          let rankList = res.data;
          if (rankList.length > 0 && type === "week") {
            rankList.forEach(item => {
              item._id = this.$constant.weekArr[parseInt(item._id)];
            });
          }
          this.rankList = rankList;
        });
    },
    userRankList() {
      let type = this.rankObj.type;
      this.$api.statistics
        .userList({
          type
        })
        .then(res => {
          let rankList = res.data;
          if (rankList.length > 0 && type === "week") {
            rankList.forEach(item => {
              item._id = this.$constant.weekArr[parseInt(item._id)];
            });
          }
          this.rankList = rankList;
        });
    },
    articleRankList() {
      let type = this.rankObj.type;
      this.$api.statistics
        .articleList({
          type
        })
        .then(res => {
          let rankList = res.data;
          if (rankList.length > 0 && type === "week") {
            rankList.forEach(item => {
              item._id = this.$constant.weekArr[parseInt(item._id)];
            });
          }
          this.rankList = rankList;
        });
    },
    messageRankList() {
      let type = this.rankObj.type;
      this.$api.statistics
        .messageList({
          type
        })
        .then(res => {
          let rankList = res.data;
          if (rankList.length > 0 && type === "week") {
            rankList.forEach(item => {
              item._id = this.$constant.weekArr[parseInt(item._id)];
            });
          }
          this.rankList = rankList;
        });
    },
    // 图表数据接口请求
    accessLineChart() {
      let { timeActive, dateArr, timeSelect } = this;
      this.$api.statistics
        .accessUserStatistics({
          type: timeSelect ? "timeSelect" : timeActive,
          startTime: dateArr[0],
          endTime: dateArr[1]
        })
        .then(res => {
          this.chartShow(res);
        });
    },
    userLineChart() {
      let { timeActive, dateArr, timeSelect } = this;
      this.$api.statistics
        .userStatistics({
          type: timeSelect ? "timeSelect" : timeActive,
          startTime: dateArr[0],
          endTime: dateArr[1]
        })
        .then(res => {
          this.chartShow(res);
        });
    },
    articleLineChart() {
      let { timeActive, dateArr, timeSelect } = this;
      this.$api.statistics
        .articleStatistics({
          type: timeSelect ? "timeSelect" : timeActive,
          startTime: dateArr[0],
          endTime: dateArr[1]
        })
        .then(res => {
          this.chartShow(res);
        });
    },
    messageLineChart() {
      let { timeActive, dateArr, timeSelect } = this;
      this.$api.statistics
        .messageStatistics({
          type: timeSelect ? "timeSelect" : timeActive,
          startTime: dateArr[0],
          endTime: dateArr[1]
        })
        .then(res => {
          this.chartShow(res);
        });
    },
    // 图标渲染
    chartShow(res) {
      let { timeActive, dateArr, analysisList, activeIndex, timeSelect } = this;
      let code = res.code;
      if (code === this.$constant.reqSuccess) {
        let type = timeSelect ? "timeSelect" : timeActive;
        let timeObj = timeDataArr(type, dateArr[0], dateArr[1]);
        let seriesData = timeObj.baseArr;
        if (res.data.length > 0) {
          let dataArr = res.data;
          seriesData.forEach(item => {
            for (let i = 0; i < dataArr.length; i++) {
              if (dataArr[i]._id === item.name) {
                item.value = dataArr[i].count;
                break;
              }
            }
          });
        }
        if (seriesData.length > 0) {
          let seriesName = "访客人数";
          let formatter = "";
          let unitName = "";
          if (activeIndex === 0) {
            seriesName = "访客人数";
            unitName = "人";
          } else if (activeIndex === 1) {
            seriesName = "用户人数";
            unitName = "人";
          } else if (activeIndex === 2) {
            seriesName = "文章数量";
            unitName = "篇";
          } else if (activeIndex === 3) {
            seriesName = "留言数量";
            unitName = "条";
          }
          if (!timeSelect) {
            if (timeActive === "day") {
              formatter =
                `时间：${dateArr[0]} </br>` +
                "小时：{b} </br>{a0}：{c0} " +
                unitName;
            } else if (timeActive === "week") {
              formatter = "时间：{b} </br>{a0}：{c0} " + unitName;
            } else if (timeActive === "month") {
              formatter = "时间：{b} </br>{a0}：{c0} " + unitName;
            } else if (timeActive === "year") {
              formatter =
                `年份：${dateArr[0].split("-")[0]} </br>` +
                "月份：{b} </br>{a0}：{c0} " +
                unitName;
            }
          } else {
            formatter = "时间：{b} </br>{a0}：{c0} " + unitName;
          }
          this.lineAnalysisOption.tooltip.formatter = formatter;
          this.lineAnalysisOption.series[0].name = seriesName;
        }
        this.lineAnalysisOption.xAxis.axisLine.show = true;
        this.lineAnalysisOption.xAxis.data = timeObj.xArr;
        this.lineAnalysisOption.tooltip.axisPointer.lineStyle.color =
          analysisList[activeIndex].color;
        this.lineAnalysisOption.series[0].itemStyle.normal.color =
          analysisList[activeIndex].color;
        this.lineAnalysisOption.series[0].data = seriesData;
      } else {
        this.$message.warning("获取数据失败");
      }
    },
    // 时间范围切换
    timeChange(val) {
      let { timeActive, rankObj } = this;
      if (val.length > 0) {
        if (val[0] === val[1]) {
          this.timeSelect = false;
          if (timeActive === "day") {
            rankObj.type = "day";
            rankObj.info = "小时";
          } else if (timeActive === "week") {
            rankObj.type = "week";
            rankObj.info = "星期";
          } else if (timeActive === "month") {
            rankObj.type = "week";
            rankObj.info = "星期";
          } else if (timeActive === "year") {
            rankObj.type = "month";
            rankObj.info = "月份";
          }
        } else {
          this.timeSelect = true;
          rankObj.type = "week";
          rankObj.info = "星期";
        }
        this.radioChange();
      }
    },
    // 天周月年时间类型切换
    radioChange(value) {
      let { rankObj, activeIndex } = this;
      if (value) {
        if (value === "day") {
          rankObj.type = "day";
          rankObj.info = "小时";
        } else if (value === "week") {
          rankObj.type = "week";
          rankObj.info = "星期";
        } else if (value === "month") {
          rankObj.type = "week";
          rankObj.info = "星期";
        } else if (value === "year") {
          rankObj.type = "month";
          rankObj.info = "月份";
        }
      }
      if (activeIndex === 0) {
        rankObj.title = "访客访问量排名";
        this.accessLineChart();
        this.accessRankList();
      } else if (activeIndex === 1) {
        rankObj.title = "用户创建排名";
        this.userLineChart();
        this.userRankList();
      } else if (activeIndex === 2) {
        rankObj.title = "文章创建排名";
        this.articleLineChart();
        this.articleRankList();
      } else if (activeIndex === 3) {
        rankObj.title = "留言创建排名";
        this.messageLineChart();
        this.messageRankList();
      }
    },
    // 用户、文章和留言box切换
    activeChange(index) {
      if (this.activeIndex !== index) {
        this.activeIndex = index;
        this.radioChange();
      }
    }
  },
  components: {
    MyEcharts,
    EmptyShow,
    countTo
  },
  computed: {}
};
</script>
