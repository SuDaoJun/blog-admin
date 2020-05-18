import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login'] // 没有重定向白名单


router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  if (sessionStorage.getItem('token')) {
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页,添加query解决在/刷新到login时重回主页
      next({ path: '/' ,query: {
        t: +new Date()
      }})
      NProgress.done()
    } else {
      // 确定用户是否获取了用户权限信息
      const hasAuths = store.getters.getAuthList && store.getters.getAuthList.length > 0;
      if (hasAuths) {
        next()
      } else {
        try {
          // 获得用户信息
          let auths = await store.dispatch('actAuthList')
          // 生成可访问的路由表
          let accessRoutes = await store.dispatch('generateRoutes', auths)
          if(accessRoutes.length > 0){
            let pathTo = accessRoutes[0].path
            // // 动态添加可访问路由表
            router.addRoutes(accessRoutes)
            // // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            let routeList = []
            accessRoutes.forEach((item)=>{
              if(item.children){
                for(let i = 0; i < item.children.length; i++){
                  routeList.push(item.children[i].path)
                }
              }
            })
            if(routeList.includes(to.path)){
              next({ ...to, replace: true })
            }else{
              next({path: pathTo, replace: true })
            }    
          }else{
            // 删除token，进入登录页面重新登录
            sessionStorage.removeItem('token')
            Message.error('暂无权限查看')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        } catch (error) {
          // 删除token，进入登录页面重新登录
          sessionStorage.removeItem('token')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 不存在token */
    if (whiteList.indexOf(to.path) !== -1) {
     // 在免费登录白名单，直接去
      next()
    } else {
      // 没有访问权限的其他页面被重定向到登录页面
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  NProgress.done();
  window.scrollTo(0, 0);
})
