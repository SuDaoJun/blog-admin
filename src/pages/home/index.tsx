import React, { useState, useEffect } from "react";
import { Row, Col, Radio, DatePicker, message, Empty, Statistic} from 'antd';
import CountTo from 'react-count-to';
import { constantData, currentDay, currentSelectTime, timeDataArr } from '@/utils/utils';
import moment from 'moment';
import MyEcharts from '@/components/MyEcharts';
import api from '@/api/index';
import "./index.scss";

const Home = (props: any) => {
  const barTabOptionData = {
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
  const { RangePicker } = DatePicker;
  let [activeIndex, setActiveIndex] = useState(0);
  let [timeSelect, setTimeSelect] = useState(false);
  let [analysisList, setAnalysisList] = useState<any[]>([
    {
      numTotal: 0,
      icon: "iconfont mio-icon-yonghu",
      color: "#40C9C6",
      description: "访客数量"
    },
    {
      numTotal: 0,
      icon: "iconfont mio-icon-yonghu",
      color: "#FFAA5C",
      description: "用户数量"
    },
    {
      numTotal: 0,
      icon: "iconfont mio-icon-24",
      color: "#38A2F7",
      description: "文章总数"
    },
    {
      numTotal: 0,
      icon: "iconfont mio-icon-liuyan",
      color: "#8543E0",
      description: "留言总数"
    }
  ]);
  let [dateArr, setDateArr] = useState<string[]>([currentDay('day'), currentDay('day')])
  let [timeActive, setTimeActive] = useState('day')
  let [rankList, setRankList] = useState<any[]>([])
  let [lineAnalysisOption, setLineAnalysisOption] = useState<any>({})
  let [barTabOption, setBarTabOption] = useState<any>(barTabOptionData)
  let [rankObj, setRankObj] = useState({
    title: "访客访问量排名",
    type: "day",
    info: "小时"
  })

  const timeArr = [
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
  ]

  // 初始化获取总数
  const getTotalNum = () => {
    api.statistics.countTotal({}).then(res => {
      let code = res.data.code;
      if (code === constantData.reqSuccess) {
        let data = res.data.data;
        let arr = analysisList;
        arr[0].numTotal = data.accessUserTotal;
        arr[1].numTotal = data.userTotal;
        arr[2].numTotal = data.articleTotal;
        arr[3].numTotal = data.messageTotal;
        setAnalysisList([...arr])
      }
    });
  }
  // 初始化图表
  const initChart = ()=>{
    let dataOption = {
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
        max: function(value:any) {
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
            data: [{ type: "max", name: "最大值" }],
            label: {
              normal: {
                color: '#fff'
              }
            },
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
    }
    lineAnalysisOption = dataOption;   //useState设置对象无效
    setLineAnalysisOption({...dataOption})
    accessLineChart()
    accessRankList()
    tagArticleInit()
  }
  // 文章标签初始化
  const tagArticleInit = ()=>{
    api.statistics.tagList({}).then(res => {
      let code = res.data.code;
      if (code === constantData.reqSuccess) {
        let data = res.data.data;
        let yAxisArr:string[] = [];
        let seriesData:any[] = [];
        if (data.length > 0) {
          data.forEach((item:any) => {
            yAxisArr.push(item._id ? item._id.name : "未知");
            seriesData.push(item.count);
          });
        }
        barTabOption.yAxis.data = yAxisArr;
        barTabOption.series[0].data = seriesData;
        setBarTabOption({...barTabOption})
      } else {
        message.warning("获取文章标签统计失败");
      }
    });
  }
  // 排名展示
  const accessRankList = ()=>{
    let type = rankObj.type;
    api.statistics
      .accessUserList({
        type
      })
      .then(res => {
        rankListHandle(res)
      });
  }
  const userRankList = ()=>{
    let type = rankObj.type
    api.statistics
      .userList({
        type
      })
      .then(res => {
        rankListHandle(res)
      });
  }
  const articleRankList = ()=>{
    let type = rankObj.type
    api.statistics
      .articleList({
        type
      })
      .then(res => {
        rankListHandle(res)
      });
  }
  const messageRankList = ()=>{
    let type = rankObj.type
    api.statistics
      .messageList({
        type
      })
      .then(res => {
        rankListHandle(res)
      });
  }
  const rankListHandle = (res:any)=>{
    let type = rankObj.type
    let dataArr = res.data.data;
    if (dataArr.length > 0 && type === "week") {
      dataArr.forEach((item:any) => {
        item._id = constantData.weekArr[parseInt(item._id)];
      });
    }
    setRankList([...dataArr])
  }
  // 图表数据接口请求
  const accessLineChart = ()=>{
    api.statistics
      .accessUserStatistics({
        type: timeSelect ? "timeSelect" : timeActive,
        startTime: dateArr[0],
        endTime: dateArr[1]
      })
      .then(res => {
        chartShow(res);
      });
  }
  const userLineChart = ()=>{
    api.statistics
    .userStatistics({
      type: timeSelect ? "timeSelect" : timeActive,
      startTime: dateArr[0],
      endTime: dateArr[1]
    })
    .then(res => {
      chartShow(res);
    });
  }
  const articleLineChart = ()=>{
    api.statistics
    .articleStatistics({
      type: timeSelect ? "timeSelect" : timeActive,
      startTime: dateArr[0],
      endTime: dateArr[1]
    })
    .then(res => {
      chartShow(res);
    });
  }
  const messageLineChart = ()=>{
    api.statistics
    .messageStatistics({
      type: timeSelect ? "timeSelect" : timeActive,
      startTime: dateArr[0],
      endTime: dateArr[1]
    })
    .then(res => {
      chartShow(res);
    });
  }
  // 图表渲染
  const chartShow = (res:any)=> {
    let code = res.data.code;
    if (code === constantData.reqSuccess) {
      let type = timeSelect ? "timeSelect" : timeActive;
      let timeObj = timeDataArr(type, dateArr[0], dateArr[1]);
      let seriesData = timeObj.baseArr;
      if (res.data.data.length > 0) {
        let dataArr = res.data.data;
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
        lineAnalysisOption.tooltip.formatter = formatter;
        lineAnalysisOption.series[0].name = seriesName;
      }
      lineAnalysisOption.xAxis.axisLine.show = true;
      lineAnalysisOption.xAxis.data = timeObj.xArr;
      lineAnalysisOption.tooltip.axisPointer.lineStyle.color = analysisList[activeIndex].color;
      lineAnalysisOption.series[0].itemStyle.normal.color = analysisList[activeIndex].color;
      lineAnalysisOption.series[0].data = seriesData;
      setLineAnalysisOption({...lineAnalysisOption})
    } else {
      message.warning("获取数据失败");
    }
  }
  // 天周月年时间类型切换
  const radioChange = (e?: any) => {
    if(e){
      let value = e.target.value;
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
      setTimeActive(value)
    }
    if (activeIndex === 0) {
      rankObj.title = "访客访问量排名";
      setRankObj({...rankObj})
      accessLineChart();
      accessRankList();
    } else if (activeIndex === 1) {
      rankObj.title = "用户创建排名";
      setRankObj({...rankObj})
      userLineChart();
      userRankList();
    } else if (activeIndex === 2) {
      rankObj.title = "文章创建排名";
      setRankObj({...rankObj})
      articleLineChart();
      articleRankList();
    } else if (activeIndex === 3) {
      rankObj.title = "留言创建排名";
      setRankObj({...rankObj})
      messageLineChart();
      messageRankList();
    }
  }
  // 时间范围切换
  const timeChange = (date: any) => {
    dateArr = [currentSelectTime(date[0]), currentSelectTime(date[1])]
    setDateArr(dateArr)
    if (currentSelectTime(date[0]) === currentSelectTime(date[1])) {
      timeSelect = false;
      setTimeSelect(timeSelect)
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
      timeSelect = true;
      setTimeSelect(timeSelect)
      rankObj.type = "week";
      rankObj.info = "星期";
    }
    setRankObj({...rankObj})
    radioChange();
  }
  // 用户、文章和留言box切换
  const activeChange = (index: number) => {
    if (activeIndex !== index) {
      setActiveIndex(index) 
    }
  }

  useEffect(() => {
    getTotalNum()
    initChart()
  }, []);

  // 处理异步问题
  useEffect(() => {
    radioChange()
  }, [activeIndex]);
  
  return <div className='project-home'>
    <h2 className="content-title">数据统计</h2>
    <Row gutter={48}>
      {
        analysisList.map((item, index) => {
          return <Col span={6} key={item.description}>
            <div className={activeIndex === index ? 'analysis-box analysis-active' : 'analysis-box'} onClick={() => activeChange(index)}>
              <div className="box-icon" style={{ backgroundColor: activeIndex === index ? item.color : 'transparent' }}>
                <i className={item.icon} style={{ color: activeIndex === index ? '#fff' : item.color }}></i>
              </div>
              <div className="box-data">
                <p className="data-description">
                  {item.description}
                </p>
                <div className="data-total" style={{ color: item.color }}>
                  <CountTo to={item.numTotal} speed={2000} />
                </div>
              </div>
            </div>
          </Col>
        })
      }
    </Row>
    <div className="content-line">
      <div className="line-header">
        <div className="header-show">
          <p>当前日期选择：</p>
          <p>
            {dateArr[0] === dateArr[1] ? dateArr[0] : `${dateArr[0]}至${dateArr[1]}`}
          </p>
        </div>
        <div className="header-time">
          {
            dateArr[0] === dateArr[1] ? <Radio.Group value={timeActive} size='middle' style={{ marginRight: '40px' }} buttonStyle="solid" onChange={radioChange}>
              {timeArr.map(item => {
                return <Radio.Button key={item.value} value={item.value}>{item.name}</Radio.Button>
              })}
            </Radio.Group> : ''
          }
          <RangePicker allowClear={false} defaultValue={[moment(), moment()]} onChange={timeChange} />
        </div>
      </div>
      <div className="line-content">
        <Row>
          <Col span={18}>
            <div className="content-charts">
              <h4>{ analysisList[activeIndex].description }</h4>
              <MyEcharts option={lineAnalysisOption} />
              {
                lineAnalysisOption.xAxis &&lineAnalysisOption.xAxis.data.length > 0?'':<div className="empty-show">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              }
            </div>
          </Col>
          <Col span={6}>
          <div className="content-list">
              <div className="rank-header">
                <h4>{rankObj.title}</h4>
              </div>
              <div className="list-rank">
                <p></p>
                <p>{rankObj.info}</p>
                <p>数量</p>
              </div>
              <div className="list-data">
                <ul>
                  {
                    rankList.map((item,index)=>{
                      return <li key={item._id}>
                        <div className={index < 3 ? 'rank-active rank-index' : 'rank-index'}>{ index + 1 }</div>
                        <span>{ item._id }</span>
                        <Statistic value={item.count} valueStyle={{fontSize: '14px',color: 'rgba(0, 0, 0, 0.85)'}} />
                      </li>
                    })
                  }
                </ul>
              </div>
              {
                rankList.length !== 0?'':<div className="empty-show">
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
              }
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="content-bar">
      <h3>文章标签</h3>
      <MyEcharts option={barTabOption} />
      {
        barTabOption.series && barTabOption.series[0].data.length > 0?'':<div className="empty-show">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      }
    </div>
  </div>
};

export default Home;

