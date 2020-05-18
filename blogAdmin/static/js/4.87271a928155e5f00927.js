webpackJsonp([4],{KR8f:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a={props:{width:{type:String,default:"100%"},height:{type:String},option:{type:Object}},data:function(){return{id:"",MyEcharts:""}},computed:{style:function(){return{height:this.height,width:this.width}}},watch:{option:{handler:function(t,i){this.MyEcharts?t?this.MyEcharts.setOption(t,!0):this.MyEcharts.setOption(i,!0):this.InitCharts()},deep:!0}},created:function(){this.id=this.uuid()},mounted:function(){this.InitCharts()},methods:{uuid:function(){return"xxxxxx4xxxyxxxxxx".replace(/[xy]/g,function(t){var i=16*Math.random()|0;return("x"==t?i:3&i|8).toString(16)})},InitCharts:function(){var t=this;this.MyEcharts=this.$echarts.init(document.getElementById(this.id)),this.MyEcharts.clear(),this.MyEcharts.setOption(this.option,!0),window.addEventListener("resize",function(){t.MyEcharts.resize()})}}},n={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"echarts",style:this.style,attrs:{id:this.id}})},staticRenderFns:[]};var s=e("VU/8")(a,n,!1,function(t){e("NneH")},"data-v-5ac97350",null).exports,r=e("YlU0"),o=e("oAV5"),l=e("WBHA"),c=e.n(l),h={data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},timeSelect:!1,timeActive:"day",timeArr:[{name:"天",value:"day"},{name:"周",value:"week"},{name:"月",value:"month"},{name:"年",value:"year"}],dateArr:[],activeIndex:0,analysisList:[{numTotal:0,icon:"el-icon-s-custom",color:"#40C9C6",description:"访客数量"},{numTotal:0,icon:"el-icon-user-solid",color:"#FFAA5C",description:"用户数量"},{numTotal:0,icon:"el-icon-document",color:"#38A2F7",description:"文章总数"},{numTotal:0,icon:"el-icon-s-comment",color:"#8543E0",description:"留言总数"}],lineAnalysisOption:{},rankList:[],rankObj:{title:"访客访问量排名",type:"day",info:"小时"},barTabOption:{}}},created:function(){},mounted:function(){this.dateArr=[Object(o.b)("day"),Object(o.b)("day")],this.getTotalNum(),this.initChart()},methods:{getTotalNum:function(){var t=this;this.$api.statistics.countTotal().then(function(i){if(i.code===t.$constant.reqSuccess){var e=i.data;t.analysisList[0].numTotal=e.accessUserTotal,t.analysisList[1].numTotal=e.userTotal,t.analysisList[2].numTotal=e.articleTotal,t.analysisList[3].numTotal=e.messageTotal}})},initChart:function(){var t=this,i=this.analysisList,e=this.activeIndex;this.lineAnalysisOption={grid:{left:"2%",top:"10%",bottom:"3%",right:"5%",containLabel:!0},tooltip:{trigger:"axis",padding:[10,20,10,15],axisPointer:{lineStyle:{color:i[e].color,width:2}},formatter:"小时：{b} </br>{a0}：{c0} 人"},xAxis:{show:!0,type:"category",boundaryGap:!1,axisTick:{show:!1},axisLine:{show:!1,lineStyle:{color:"#C0C4CC"}},axisLabel:{color:"#707378"},data:[]},yAxis:{show:!0,axisTick:{show:!1},minInterval:1,max:function(t){return 2*t.max},axisLine:{show:!0,lineStyle:{color:"#C0C4CC"}},axisLabel:{color:"#707378"},splitLine:{lineStyle:{type:"dotted",color:"rgba(150,150,150,.2)"}}},series:[{name:"访客人数",type:"line",symbol:"circle",symbolSize:5,markPoint:{data:[{type:"max",name:"最大值"}]},lineStyle:{normal:{width:3}},itemStyle:{normal:{color:i[e].color},emphasis:{borderColor:"#fff",borderWidth:2}},data:[]}]},this.barTabOption={grid:{top:"2%",left:"1%",right:"8%",bottom:"0",containLabel:!0},tooltip:{trigger:"axis",padding:[10,20,10,15],axisPointer:{type:"shadow",shadowStyle:{color:"rgba(150,150,150,.2)"}},formatter:"{a0} </br>标签：{b} </br>数量：{c0} 篇"},xAxis:{show:!1},yAxis:{type:"category",inverse:!0,axisLine:{show:!1},axisTick:{show:!1},data:[]},dataZoom:[{type:"inside",id:"insideY",yAxisIndex:0,start:0,end:100}],series:[{data:[],name:"文章标签",type:"bar",barWidth:20,xAxisIndex:0,yAxisIndex:0,itemStyle:{normal:{barBorderRadius:30,color:"#00C7A9"}},zlevel:11,label:{normal:{show:!0,position:"right",color:"#00C7A9",fontSize:12}}}]},this.$nextTick(function(){t.accessLineChart(),t.accessRankList(),t.tagArticleInit()})},tagArticleInit:function(){var t=this;this.$api.statistics.tagList().then(function(i){if(i.code===t.$constant.reqSuccess){var e=i.data,a=[],n=[];e.length>0&&e.forEach(function(t){a.push(t._id?t._id.name:"未知"),n.push(t.count)}),t.barTabOption.yAxis.data=a,t.barTabOption.series[0].data=n}else t.$message.warning("获取文章标签统计失败")})},accessRankList:function(){var t=this,i=this.rankObj.type;this.$api.statistics.accessUserList({type:i}).then(function(e){var a=e.data;a.length>0&&"week"===i&&a.forEach(function(i){i._id=t.$constant.weekArr[parseInt(i._id)]}),t.rankList=a})},userRankList:function(){var t=this,i=this.rankObj.type;this.$api.statistics.userList({type:i}).then(function(e){var a=e.data;a.length>0&&"week"===i&&a.forEach(function(i){i._id=t.$constant.weekArr[parseInt(i._id)]}),t.rankList=a})},articleRankList:function(){var t=this,i=this.rankObj.type;this.$api.statistics.articleList({type:i}).then(function(e){var a=e.data;a.length>0&&"week"===i&&a.forEach(function(i){i._id=t.$constant.weekArr[parseInt(i._id)]}),t.rankList=a})},messageRankList:function(){var t=this,i=this.rankObj.type;this.$api.statistics.messageList({type:i}).then(function(e){var a=e.data;a.length>0&&"week"===i&&a.forEach(function(i){i._id=t.$constant.weekArr[parseInt(i._id)]}),t.rankList=a})},accessLineChart:function(){var t=this,i=this.timeActive,e=this.dateArr,a=this.timeSelect;this.$api.statistics.accessUserStatistics({type:a?"timeSelect":i,startTime:e[0],endTime:e[1]}).then(function(i){t.chartShow(i)})},userLineChart:function(){var t=this,i=this.timeActive,e=this.dateArr,a=this.timeSelect;this.$api.statistics.userStatistics({type:a?"timeSelect":i,startTime:e[0],endTime:e[1]}).then(function(i){t.chartShow(i)})},articleLineChart:function(){var t=this,i=this.timeActive,e=this.dateArr,a=this.timeSelect;this.$api.statistics.articleStatistics({type:a?"timeSelect":i,startTime:e[0],endTime:e[1]}).then(function(i){t.chartShow(i)})},messageLineChart:function(){var t=this,i=this.timeActive,e=this.dateArr,a=this.timeSelect;this.$api.statistics.messageStatistics({type:a?"timeSelect":i,startTime:e[0],endTime:e[1]}).then(function(i){t.chartShow(i)})},chartShow:function(t){var i=this.timeActive,e=this.dateArr,a=this.analysisList,n=this.activeIndex,s=this.timeSelect;if(t.code===this.$constant.reqSuccess){var r=s?"timeSelect":i,l=Object(o.e)(r,e[0],e[1]),c=l.baseArr;if(t.data.length>0){var h=t.data;c.forEach(function(t){for(var i=0;i<h.length;i++)if(h[i]._id===t.name){t.value=h[i].count;break}})}if(c.length>0){var u="访客人数",d="",p="";0===n?(u="访客人数",p="人"):1===n?(u="用户人数",p="人"):2===n?(u="文章数量",p="篇"):3===n&&(u="留言数量",p="条"),s?d="时间：{b} </br>{a0}：{c0} "+p:"day"===i?d="时间："+e[0]+" </br>小时：{b} </br>{a0}：{c0} "+p:"week"===i?d="时间：{b} </br>{a0}：{c0} "+p:"month"===i?d="时间：{b} </br>{a0}：{c0} "+p:"year"===i&&(d="年份："+e[0].split("-")[0]+" </br>月份：{b} </br>{a0}：{c0} "+p),this.lineAnalysisOption.tooltip.formatter=d,this.lineAnalysisOption.series[0].name=u}this.lineAnalysisOption.xAxis.axisLine.show=!0,this.lineAnalysisOption.xAxis.data=l.xArr,this.lineAnalysisOption.tooltip.axisPointer.lineStyle.color=a[n].color,this.lineAnalysisOption.series[0].itemStyle.normal.color=a[n].color,this.lineAnalysisOption.series[0].data=c}else this.$message.warning("获取数据失败")},timeChange:function(t){var i=this.timeActive,e=this.rankObj;t.length>0&&(t[0]===t[1]?(this.timeSelect=!1,"day"===i?(e.type="day",e.info="小时"):"week"===i?(e.type="week",e.info="星期"):"month"===i?(e.type="week",e.info="星期"):"year"===i&&(e.type="month",e.info="月份")):(this.timeSelect=!0,e.type="week",e.info="星期"),this.radioChange())},radioChange:function(t){var i=this.rankObj,e=this.activeIndex;t&&("day"===t?(i.type="day",i.info="小时"):"week"===t?(i.type="week",i.info="星期"):"month"===t?(i.type="week",i.info="星期"):"year"===t&&(i.type="month",i.info="月份")),0===e?(i.title="访客访问量排名",this.accessLineChart(),this.accessRankList()):1===e?(i.title="用户创建排名",this.userLineChart(),this.userRankList()):2===e?(i.title="文章创建排名",this.articleLineChart(),this.articleRankList()):3===e&&(i.title="留言创建排名",this.messageLineChart(),this.messageRankList())},activeChange:function(t){this.activeIndex!==t&&(this.activeIndex=t,this.radioChange())}},components:{MyEcharts:s,EmptyShow:r.a,countTo:c.a},computed:{}},u={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"project-index"},[e("h2",{staticClass:"content-title"},[t._v("数据统计")]),t._v(" "),e("el-row",{attrs:{gutter:48}},t._l(t.analysisList,function(i,a){return e("el-col",{key:i.description,attrs:{lg:6}},[e("div",{class:t.activeIndex===a?"analysis-box analysis-active":"analysis-box",on:{click:function(i){return t.activeChange(a)}}},[e("div",{staticClass:"box-icon",style:{backgroundColor:t.activeIndex===a?i.color:"transparent"}},[e("i",{class:i.icon,style:{color:t.activeIndex===a?"#fff":i.color}})]),t._v(" "),e("div",{staticClass:"box-data"},[e("p",{staticClass:"data-description"},[t._v("\n            "+t._s(i.description)+"\n          ")]),t._v(" "),e("div",{staticClass:"data-total",style:{color:i.color}},[e("countTo",{attrs:{startVal:0,endVal:i.numTotal,duration:3e3}})],1)])])])}),1),t._v(" "),e("div",{staticClass:"content-line"},[e("div",{staticClass:"line-header"},[e("div",{staticClass:"header-show"},[e("p",[t._v("当前日期选择：")]),t._v(" "),e("p",[t._v("\n          "+t._s(t.dateArr[0]===t.dateArr[1]?t.dateArr[0]:t.dateArr[0]+"至"+t.dateArr[1])+"\n        ")])]),t._v(" "),e("div",{staticClass:"header-time"},[e("el-radio-group",{directives:[{name:"show",rawName:"v-show",value:t.dateArr[0]===t.dateArr[1],expression:"dateArr[0] === dateArr[1]"}],staticStyle:{"margin-right":"40px"},attrs:{size:"medium"},on:{change:t.radioChange},model:{value:t.timeActive,callback:function(i){t.timeActive=i},expression:"timeActive"}},t._l(t.timeArr,function(i){return e("el-radio-button",{key:i.value,attrs:{label:i.value}},[t._v(t._s(i.name)+"\n          ")])}),1),t._v(" "),e("el-date-picker",{attrs:{type:"daterange","unlink-panels":"","range-separator":"至",clearable:!1,"value-format":"yyyy-MM-dd","start-placeholder":"开始日期","end-placeholder":"结束日期","picker-options":t.pickerOptions},on:{change:t.timeChange},model:{value:t.dateArr,callback:function(i){t.dateArr=i},expression:"dateArr"}})],1)]),t._v(" "),e("div",{staticClass:"line-content"},[e("el-row",[e("el-col",{attrs:{lg:18}},[e("div",{staticClass:"content-charts"},[e("h4",[t._v(t._s(t.analysisList[t.activeIndex].description))]),t._v(" "),e("MyEcharts",{style:{width:"100%",height:"400px"},attrs:{option:t.lineAnalysisOption}}),t._v(" "),e("empty-show",{attrs:{iconLeft:"35%",hide:!(t.lineAnalysisOption.xAxis&&t.lineAnalysisOption.xAxis.data.length>0)}})],1)]),t._v(" "),e("el-col",{attrs:{lg:6}},[e("div",{staticClass:"content-list"},[e("div",{staticClass:"rank-header"},[e("h4",[t._v(t._s(t.rankObj.title))])]),t._v(" "),e("div",{staticClass:"list-rank"},[e("p"),t._v(" "),e("p",[t._v(t._s(t.rankObj.info))]),t._v(" "),e("p",[t._v("数量")])]),t._v(" "),e("div",{staticClass:"list-data"},[e("el-scrollbar",{staticStyle:{height:"100%"}},[e("ul",t._l(t.rankList,function(i,a){return e("li",{key:i._id},[e("div",{class:a<3?"rank-active rank-index":"rank-index"},[t._v(t._s(a+1))]),t._v(" "),e("span",[t._v(t._s(i._id))]),t._v(" "),e("span",[t._v(t._s(t._f("NumFormat")(i.count)))])])}),0)])],1),t._v(" "),e("empty-show",{attrs:{iconLeft:"85%",hide:0==t.rankList.length}})],1)])],1)],1)]),t._v(" "),e("div",{staticClass:"content-bar"},[e("h3",[t._v("文章标签")]),t._v(" "),e("MyEcharts",{style:{width:"100%",height:"400px"},attrs:{option:t.barTabOption}}),t._v(" "),e("empty-show",{attrs:{iconLeft:"50%",hide:!(t.barTabOption.series&&t.barTabOption.series[0].data.length>0)}})],1)],1)},staticRenderFns:[]};var d=e("VU/8")(h,u,!1,function(t){e("ay6Y")},"data-v-40ec4492",null);i.default=d.exports},NneH:function(t,i){},WBHA:function(t,i,e){var a;a=function(){return function(t){function i(a){if(e[a])return e[a].exports;var n=e[a]={i:a,l:!1,exports:{}};return t[a].call(n.exports,n,n.exports,i),n.l=!0,n.exports}var e={};return i.m=t,i.c=e,i.i=function(t){return t},i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:a})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.p="/dist/",i(i.s=2)}([function(t,i,e){var a=e(4)(e(1),e(5),null,null);t.exports=a.exports},function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a=e(3);i.default={props:{startVal:{type:Number,required:!1,default:0},endVal:{type:Number,required:!1,default:2017},duration:{type:Number,required:!1,default:3e3},autoplay:{type:Boolean,required:!1,default:!0},decimals:{type:Number,required:!1,default:0,validator:function(t){return t>=0}},decimal:{type:String,required:!1,default:"."},separator:{type:String,required:!1,default:","},prefix:{type:String,required:!1,default:""},suffix:{type:String,required:!1,default:""},useEasing:{type:Boolean,required:!1,default:!0},easingFn:{type:Function,default:function(t,i,e,a){return e*(1-Math.pow(2,-10*t/a))*1024/1023+i}}},data:function(){return{localStartVal:this.startVal,displayValue:this.formatNumber(this.startVal),printVal:null,paused:!1,localDuration:this.duration,startTime:null,timestamp:null,remaining:null,rAF:null}},computed:{countDown:function(){return this.startVal>this.endVal}},watch:{startVal:function(){this.autoplay&&this.start()},endVal:function(){this.autoplay&&this.start()}},mounted:function(){this.autoplay&&this.start(),this.$emit("mountedCallback")},methods:{start:function(){this.localStartVal=this.startVal,this.startTime=null,this.localDuration=this.duration,this.paused=!1,this.rAF=(0,a.requestAnimationFrame)(this.count)},pauseResume:function(){this.paused?(this.resume(),this.paused=!1):(this.pause(),this.paused=!0)},pause:function(){(0,a.cancelAnimationFrame)(this.rAF)},resume:function(){this.startTime=null,this.localDuration=+this.remaining,this.localStartVal=+this.printVal,(0,a.requestAnimationFrame)(this.count)},reset:function(){this.startTime=null,(0,a.cancelAnimationFrame)(this.rAF),this.displayValue=this.formatNumber(this.startVal)},count:function(t){this.startTime||(this.startTime=t),this.timestamp=t;var i=t-this.startTime;this.remaining=this.localDuration-i,this.useEasing?this.countDown?this.printVal=this.localStartVal-this.easingFn(i,0,this.localStartVal-this.endVal,this.localDuration):this.printVal=this.easingFn(i,this.localStartVal,this.endVal-this.localStartVal,this.localDuration):this.countDown?this.printVal=this.localStartVal-(this.localStartVal-this.endVal)*(i/this.localDuration):this.printVal=this.localStartVal+(this.localStartVal-this.startVal)*(i/this.localDuration),this.countDown?this.printVal=this.printVal<this.endVal?this.endVal:this.printVal:this.printVal=this.printVal>this.endVal?this.endVal:this.printVal,this.displayValue=this.formatNumber(this.printVal),i<this.localDuration?this.rAF=(0,a.requestAnimationFrame)(this.count):this.$emit("callback")},isNumber:function(t){return!isNaN(parseFloat(t))},formatNumber:function(t){t=t.toFixed(this.decimals);var i=(t+="").split("."),e=i[0],a=i.length>1?this.decimal+i[1]:"",n=/(\d+)(\d{3})/;if(this.separator&&!this.isNumber(this.separator))for(;n.test(e);)e=e.replace(n,"$1"+this.separator+"$2");return this.prefix+e+a+this.suffix}},destroyed:function(){(0,a.cancelAnimationFrame)(this.rAF)}}},function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a=function(t){return t&&t.__esModule?t:{default:t}}(e(0));i.default=a.default,"undefined"!=typeof window&&window.Vue&&window.Vue.component("count-to",a.default)},function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var a=0,n="webkit moz ms o".split(" "),s=void 0,r=void 0;if("undefined"==typeof window)i.requestAnimationFrame=s=function(){},i.cancelAnimationFrame=r=function(){};else{i.requestAnimationFrame=s=window.requestAnimationFrame,i.cancelAnimationFrame=r=window.cancelAnimationFrame;for(var o=void 0,l=0;l<n.length&&(!s||!r);l++)o=n[l],i.requestAnimationFrame=s=s||window[o+"RequestAnimationFrame"],i.cancelAnimationFrame=r=r||window[o+"CancelAnimationFrame"]||window[o+"CancelRequestAnimationFrame"];s&&r||(i.requestAnimationFrame=s=function(t){var i=(new Date).getTime(),e=Math.max(0,16-(i-a)),n=window.setTimeout(function(){t(i+e)},e);return a=i+e,n},i.cancelAnimationFrame=r=function(t){window.clearTimeout(t)})}i.requestAnimationFrame=s,i.cancelAnimationFrame=r},function(t,i){t.exports=function(t,i,e,a){var n,s=t=t||{},r=typeof t.default;"object"!==r&&"function"!==r||(n=t,s=t.default);var o="function"==typeof s?s.options:s;if(i&&(o.render=i.render,o.staticRenderFns=i.staticRenderFns),e&&(o._scopeId=e),a){var l=Object.create(o.computed||null);Object.keys(a).forEach(function(t){var i=a[t];l[t]=function(){return i}}),o.computed=l}return{esModule:n,exports:s,options:o}}},function(t,i){t.exports={render:function(){var t=this,i=t.$createElement;return(t._self._c||i)("span",[t._v("\n  "+t._s(t.displayValue)+"\n")])},staticRenderFns:[]}}])},t.exports=a()},ay6Y:function(t,i){}});