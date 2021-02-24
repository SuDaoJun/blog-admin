import loadable from '@loadable/component'
import { Route, Redirect} from 'react-router-dom'

const Home = loadable(() => import(/* webpackChunkName: "home" */ '@/pages/home/index'))
const ArticleList = loadable(() => import(/* webpackChunkName: "articleList" */ '@/pages/articleList/index'))
const ArticleOperate = loadable(() => import(/* webpackChunkName: "articleOperate" */ '@/pages/articleOperate/index'))
const ArticleComment = loadable(() => import(/* webpackChunkName: "articleComment" */ '@/pages/articleComment/index'))
const ArticleTag = loadable(() => import(/* webpackChunkName: "articleTag" */ '@/pages/articleTag/index'))
const Project = loadable(() => import(/* webpackChunkName: "project" */ '@/pages/project/index'))
const Link = loadable(() => import(/* webpackChunkName: "link" */ '@/pages/link/index'))
const Message = loadable(() => import(/* webpackChunkName: "message" */ '@/pages/message/index'))
const MenuList = loadable(() => import(/* webpackChunkName: "menu" */ '@/pages/menu/index'))
const User = loadable(() => import(/* webpackChunkName: "user" */ '@/pages/user/index'))
const Role = loadable(() => import(/* webpackChunkName: "role" */ '@/pages/role/index'))
const Error404 = loadable(() => import(/* webpackChunkName: "error404" */ '@/pages/error/index'))

export const RoutersArr = [
  {
    path: '/index',
    component: Home,
    meta: {
      title: '首页',
      icon: 'mio-icon-ziyuan iconfont ant-menu-item-icon',
      authId: '1'
    }
  },
  {
    path: '/article/articleList',
    component: ArticleList,
    supTitle: '文章管理',
    meta: {
      title: '文章列表',
      icon: 'mio-icon-24 iconfont ant-menu-item-icon',
      authId: '5e7a0c129653e66ae88e33ad'
    }
  },
  {
    path: '/article/articleAdd',
    component: ArticleOperate,
    supTitle: '文章管理',
    meta: {
      title: '创建文章',
      icon: 'mio-icon-24 iconfont ant-menu-item-icon',
      authId: '5e834f23fb69305aa091e824'
    }
  },
  {
    path: '/article/edit',
    component: ArticleOperate,
    hidden: true,
    meta: {
      title: '编辑文章',
      authId: '5e7a0c129653e66ae88e33ad'
    }
  },
  {
    path: '/article/articleTag',
    component: ArticleTag,
    supTitle: '文章管理',
    meta: {
      title: '文章标签',
      icon: 'mio-icon-24 iconfont ant-menu-item-icon',
      authId: '5e7a0c6c9653e66ae88e33ae'
    }
  },
  {
    path: '/article/comment',
    component: ArticleComment,
    hidden: true,
    meta: {
      title: '文章评论',
      authId: '5e7a0c849653e66ae88e33af'
    }
  },
  {
    path: '/project',
    component: Project,
    meta: {
      title: '项目管理',
      icon: 'mio-icon-xiangmu iconfont ant-menu-item-icon',
      authId: '5e7a11f09653e66ae88e33b0'
    }
  },
  {
    path: '/link',
    component: Link,
    meta: {
      title: '友情链接',
      icon: 'mio-icon-lianjie iconfont ant-menu-item-icon',
      authId: '5e7a120a9653e66ae88e33b1'
    }
  },
  {
    path: '/message',
    component: Message,
    meta: {
      title: '留言管理',
      icon: 'mio-icon-liuyan iconfont ant-menu-item-icon',
      authId: '5e7a12149653e66ae88e33b2'
    }
  },
  {
    path: '/menu',
    component: MenuList,
    meta: {
      title: '菜单管理',
      icon: 'mio-icon-icon_caidan iconfont ant-menu-item-icon',
      authId: '5e7a12249653e66ae88e33b3'
    }
  },
  {
    path: '/user/userList',
    component: User,
    supTitle: '用户管理',
    meta: {
      title: '用户列表',
      icon: 'mio-icon-yonghu1 iconfont ant-menu-item-icon',
      authId: '5e7a12939653e66ae88e33b6'
    }
  },
  {
    path: '/user/roleList',
    component: Role,
    supTitle: '用户管理',
    meta: {
      title: '角色管理',
      icon: 'mio-icon-yonghu1 iconfont ant-menu-item-icon',
      authId: '5e7a12a69653e66ae88e33b7'
    }
  },
  {
    path: '*',
    component: Error404,
    hidden: true,
    meta: {
      title: '错误页面',
      authId: '1'
    }
  },
]

export function getRouteArr(){
  let arr:any[] = [];
  let userInfo:any;
  let infoStr = sessionStorage.getItem('userInfo');
  if(infoStr){
    userInfo = JSON.parse(infoStr);
  }
  RoutersArr.forEach(item=>{
    if(userInfo.roleId){
      let functionList = userInfo.roleId.functionList;
      let menuList = userInfo.roleId.menuList;
      let authId = item.meta.authId;
      if(functionList.includes(authId) || menuList.includes(authId) || authId === '1'){
        arr.push(item)
      }
    }
  })
  return arr
}

function routeDataHandle(route:any):string{
  document.title = route.meta?route.meta.title:'后台管理';
  let token = sessionStorage.getItem('token');
  if(token){
    if(route.location.pathname === '/'){
      return 'index'
    }else{
      return 'route'
    }
  }else{
    return 'login'
  }
}

export function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      render={(props) => {
        let routePath = routeDataHandle(route);
        if(routePath === 'route'){
          return <route.component {...props } {...route} />
        }else if(routePath === 'index'){
          return <Redirect to={{
            pathname: "/index"
          }} />
        }else{
          return <Redirect to={{
            pathname: "/login",
            state: { from: props.location }
          }} />
        }
      }}
    />
  )
}