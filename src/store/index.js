
import Vue from 'vue';
import Vuex from 'vuex';
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
Vue.use(Vuex);

const state = {//要设置的全局访问的state对象
   // 用户拥有权限列表
   auths: [],
   //权限列表对应的路由列表
   totalRoutes: [],
   // 打开的标签页
   visitedViews: [],
   //  侧边栏是否折叠
   collapse: '0'
};
const getters = {   //实时监听state值的变化(最新状态)
   getAuthList(state) {
      return state.auths
   },
   getTotalRoutes(state) {
      return state.totalRoutes
   },
   getVisitedViews(state) {
      return state.visitedViews
   },
   getCollapse(state) {
      return state.collapse
   }
};
const mutations = {
  changeCollapse(state,bool) {
     state.collapse = bool
  },
   changeAuthList(state,arrList) {  //改变state初始值的方法
      state.auths = arrList;
   },
   changeRouteList(state,routeList) {
      state.totalRoutes = constantRoutes.concat(routeList);
   },
   clearRouteList(state){
      state.totalRoutes = [];
      state.auths = [];
   },

   addVisitedView: (state, view) => {
     if (state.visitedViews.some(v => v.path === view.path || v.name === view.name)) return
     state.visitedViews.push(
       Object.assign({}, view, {
         title: view.meta.title || 'no-name'
       })
     )
   },
   delVisitedView: (state, view) => {
     for (const [i, v] of state.visitedViews.entries()) {
       if (v.path === view.path) {
         state.visitedViews.splice(i, 1)
         break
       }
     }
   },
   delOthesVisitedView: (state, view) => {
     state.visitedViews = state.visitedViews.filter(v => {
       return v.meta.affix || v.path === view.path
     })
   },
   delAllVisitedView: state => {
     // keep affix tags
     const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
     state.visitedViews = affixTags
   },
   updateVisitedView: (state, view) => {
     for (let v of state.visitedViews) {
       if (v.path === view.path) {
         v = Object.assign(v, view)
         break
       }
     }
   }
};
function getAuthArr(){
  let newTree = ['1'];
  let userInfo = sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):'';
  if(userInfo && userInfo.roleId){
    let roleId = userInfo.roleId
    newTree =  [...newTree,...roleId.menuList,...roleId.functionList]
  }
  return newTree
}
const actions = {
  // 侧边折叠
  operateCollapse(context,bool){
    context.commit('changeCollapse',bool)
  },
   // 用户的权限数组信息
   actAuthList(context,arrList) {
      return new Promise((resolve,reject) => {
        let list = getAuthArr();
        context.commit('changeAuthList',list)
        resolve(list)
      })
   },
   // 生成可访问的路由列表
   generateRoutes(context, auths) {
     return new Promise(resolve => {
       //直接传asyncRoutes会改变路由数据导致需要刷新才能更新到原有数组
      //  let asyncRoutesData = JSON.parse(JSON.stringify(asyncRoutes)) //深拷贝component会丢失无效
       let asyncRoutesData = deepCopy(asyncRoutes)
       let routerList = filterAsyncRoutes(asyncRoutesData, auths)
       let accessedRoutes = []
       for(let i = 0; i < routerList.length; i++){
         if(routerList[i].path !== '*'){
           if(routerList[i].children.length > 0){
            accessedRoutes.push(routerList[i])
           }
         }else{
          accessedRoutes.push(routerList[i])
         }
       }
       if(accessedRoutes.length === 1 && accessedRoutes[0].path === '*'){
        accessedRoutes = []
       }
       context.commit('changeRouteList', accessedRoutes)
       resolve(accessedRoutes)
     })
   },
   //退出登录
   logout(context) {
     return new Promise((resolve, reject) => {
      context.commit('clearRouteList')
      sessionStorage.removeItem('token')
      resetRouter()
      resolve()
     })
   },

   addTags({ commit }, view) {
     commit('addVisitedView', view)
   },

   delTags({ commit, state }, view) {
     return new Promise(resolve => {
       commit('delVisitedView', view)
       resolve([...state.visitedViews])
     })
   },
   delOthersTags({ commit, state }, view) {
     return new Promise(resolve => {
       commit('delOthesVisitedView', view)
       resolve([...state.visitedViews])
     })
   },
   delAllTags({ commit, state }) {
     return new Promise(resolve => {
       commit('delAllVisitedView')
       resolve([...state.visitedViews])
     })
   },
   updateTags({ commit }, view) {
     commit('updateVisitedView', view)
   }   
};

// 数组对象递归深拷贝
function deepCopy(arr) {
  let copyArr = (arr.constructor === Array) ? [] : {} // 判断是数组还是对象
  for(let i in arr) {
      if(typeof arr[i] === 'object') {   // 判断是值类型还是引用类型
          copyArr[i] = deepCopy(arr[i])  // 引用类型的话进行递归操作
      } else {
          copyArr[i] = arr[i]  // 值类型直接赋值
      }
  }
  return copyArr
}


export function filterAsyncRoutes(asyncRoutesData, auths) {
  const res = []
  asyncRoutesData.forEach(item => {
   if(auths.includes(item.meta.authId)){
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, auths)
      }
      res.push(item)
   }
  })
  return res
}

const store = new Vuex.Store({
   state,
   getters,
   mutations,
   actions
});

export default store;

