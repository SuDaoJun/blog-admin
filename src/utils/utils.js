import moment from 'moment'
import { Message } from "element-ui";

// 常量数据
export let constant = {
	reqSuccess: '10000',
	dataAlready: '10001',
	dataFail: '10002',
	pwdFail: '10003',
	codeFail: '10004',
	timeOver: '10005',
	randomFail: '10006',
  dataNot: '10007',
  statusFail: '10008',
  weekArr: [
    "无",
    "周一",
    "周二",
    "周三",
    "周四",
    "周五",
    "周六",
    "周日"
  ]
}
export let noticeList = [
  {
    title:'修改密码',
    url: '/user/modifyPwd',
  },
  {
    title:'新增子账户',
    url: '/user/add',
  },
  {
    title:'更新用户信息',
    url: '/user/update',
  },
  {
    title:'删除用户',
    url: '/user/del',
  },
  {
    title:'新增文章',
    url: '/article/add',
  },
  {
    title:'编辑文章',
    url: '/article/update',
  },
  {
    title:'删除文章',
    url: '/article/del',
  },
  {
    title:'新增文章标签',
    url: '/tag/add',
  },
  {
    title:'编辑文章标签',
    url: '/tag/update',
  },
  {
    title:'删除文章标签',
    url: '/tag/del',
  },
  {
    title:'新增文章评论',
    url: '/comment/add',
  },
  {
    title:'编辑文章评论',
    url: '/comment/update',
  },
  {
    title:'删除文章评论',
    url: '/comment/del',
  },
  {
    title:'文章评论置顶',
    url: '/comment/sticky',
  },
  {
    title:'新增评论回复',
    url: '/replyComment/add',
  },
  {
    title:'编辑评论回复',
    url: '/replyComment/update',
  },
  {
    title:'删除评论回复',
    url: '/replyComment/del',
  },
  {
    title:'新增项目',
    url: '/project/add',
  },
  {
    title:'编辑项目',
    url: '/project/update',
  },
  {
    title:'删除项目',
    url: '/project/del',
  },
  {
    title:'新增历程',
    url: '/course/add',
  },
  {
    title:'编辑历程',
    url: '/course/update',
  },
  {
    title:'删除历程',
    url: '/course/del',
  },
  {
    title:'新增留言',
    url: '/message/add',
  },
  {
    title:'编辑留言',
    url: '/message/update',
  },
  {
    title:'删除留言',
    url: '/message/del',
  },
  {
    title:'新增菜单',
    url: '/menu/add',
  },
  {
    title:'编辑菜单',
    url: '/menu/update',
  },
  {
    title:'删除菜单',
    url: '/menu/del',
  },
  {
    title:'新增功能',
    url: '/functionOper/add',
  },
  {
    title:'编辑功能',
    url: '/functionOper/update',
  },
  {
    title:'删除功能',
    url: '/functionOper/del',
  },
  {
    title:'新增角色',
    url: '/role/add',
  },
  {
    title:'编辑角色',
    url: '/role/update',
  },
  {
    title:'删除角色',
    url: '/role/del',
  },
  {
    title:'角色设置权限',
    url: '/role/setAuth',
  },
  {
    title:'编辑用户角色',
    url: '/role/updateMuchUser',
  },
  {
    title:'上传图片',
    url: '/file/upload',
  },
  {
    title:'移除图片',
    url: '/file/del/',
  }
]
// 与当前时间相差天数
export function diffDay(time) {
  let currentTime = moment();
  let endTime = moment(time);
  let day = endTime.diff(currentTime, 'day')
  return day
}
// 当前时间格式化
export function currentDay(type = 'time') {
  if(type === 'day'){ 
    return moment().format('YYYY-MM-DD')
  }else{
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }
}
// 判断深层次对象属性是否存在
export let objProp = (data, path) => {
  if (!data || !path) {
    return null
  }
  let tempArr = path.split('.');
  for (let i = 0; i < tempArr.length; i++) {
    let key = tempArr[i]
    if (data[key]) {
      data = data[key]
    } else {
      return null
    }
  }
  return data
}
// 根据type获取不同的基本数据
export function timeDataArr(type = 'day', startTime, endTime) {
  let dataObj = {
    xArr: [],
    baseArr: []
  }
  if(type === 'day'){
    for(let i = 0; i < 24; i++){
      let num = zeroHandle(i)
      let obj = {
        name: num,
        value: 0
      }
      dataObj.xArr.push(num)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'week'){
    let week = moment(startTime).format('E')
    let weekArr = ['周一','周二','周三','周四','周五','周六','周日']
    for(let i = 1; i < 8; i++){
      let data = moment(startTime).subtract(week-i, 'days').format('YYYY-MM-DD')
      let obj = {
        name: data,
        value: 0
      }
      // dataObj.xArr.push(data)
      dataObj.xArr.push(weekArr[Number(moment(data).format('E'))-1])
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'month'){
    let monthLen = moment(startTime, "YYYY-MM").daysInMonth()
    let timeArr = startTime.split('-')
    for(let i = 1; i < monthLen + 1; i++){
      let num = zeroHandle(i)
      let time =  `${timeArr[0]}-${timeArr[1]}-${num}`
      let obj = {
        name: time,
        value: 0
      }
      dataObj.xArr.push(time)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'year'){
    for(let i = 1; i < 13; i++){
      let num = zeroHandle(i)
      let obj = {
        name: num,
        value: 0
      }
      dataObj.xArr.push(num)
      dataObj.baseArr.push(obj)
    }
  }else if(type === 'timeSelect'){
    let currentDate  = moment(startTime).valueOf()
    let stopDate   = moment(endTime).valueOf()
    while(currentDate <= stopDate){
      let data = moment(currentDate).format('YYYY-MM-DD')
      let obj = {
        name: data,
        value: 0
      }
      dataObj.xArr.push(data)
      dataObj.baseArr.push(obj)
      currentDate = moment(currentDate).add(1, 'days')
    }
  }
  return dataObj
}
function zeroHandle(num){
  if(num < 10){
    return '0' + num
  }else{
    return num.toString()
  }
}
// 缓存设置有效期
export const timeLocalStorage = {
  setItem: function (key, value, dayNum) {
    let data = { value: value, expirse: new Date().getTime() + dayNum * 1000 * 60 * 60 * 24 };
    localStorage.setItem(key, JSON.stringify(data));
  },
  getItem: function (key) {
    if (localStorage.getItem(key)) {
      let data = JSON.parse(localStorage.getItem(key));
      if (data !== null) {
        if (data.expirse != null && data.expirse < new Date().getTime()) {
          localStorage.removeItem(key);
        } else {
          return data.value;
        }
      }
    }
    return null;
  }
}

// message弹窗只显示一个
let messageInstance = null;
export function mainMessage(options) {
  //如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
}
let arr = ['success', 'warning', 'info', 'error'];
arr.forEach(function (type) {
  mainMessage[type] = function (options) {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    options.duration = type === 'success'?1500:3000;
    return mainMessage(options);
  };
});