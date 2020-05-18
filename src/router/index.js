import Vue from 'vue'
import Router from 'vue-router'

const redirect = resolve => require(['@/views/redirect/redirect.vue'], resolve);
const login = resolve => require(['@/views/login/login.vue'], resolve);
const layout = resolve => require(['@/views/layout/layout.vue'], resolve);
const error = resolve => require(['@/views/errorPage/404.vue'], resolve);
const index = resolve => require(['@/views/home/index.vue'], resolve);

const articleList = resolve => require(['@/views/article/articleList.vue'], resolve);
const articleAdd = resolve => require(['@/views/article/articleAdd.vue'], resolve);
const articleTag = resolve => require(['@/views/article/articleTag.vue'], resolve);
const articleComment = resolve => require(['@/views/article/articleComment.vue'], resolve);
const projectList = resolve => require(['@/views/project/projectList.vue'], resolve);
const link = resolve => require(['@/views/link/link.vue'], resolve);
const messageList = resolve => require(['@/views/message/messageList.vue'], resolve);
const menuManag = resolve => require(['@/views/menu/menuManag.vue'], resolve);
const userList = resolve => require(['@/views/user/userList.vue'], resolve);
const roleList = resolve => require(['@/views/user/roleList.vue'], resolve);

Vue.use(Router)
// hidden是否显示在侧边栏
// affix是否固定在标签栏
// child是否显示子菜单

export const constantRoutes = [
  {
    path: '/redirect',
    name: 'redirect',
    component: layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: redirect
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    hidden: true,
    meta: {
      title: '后台管理'
    }
  },
  {
    path: '/404',
    name: 'Page404',
    component: error,
    hidden: true,
    meta: {
      title: '404'
    }
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: layout,
    redirect: '/index',
    meta: { 
      title: '首页',
      authId: '1',
      icon: 'mio-icon-ziyuan iconfont',
      affix: true
    },
    children: [
      {
        path: '/index',
        component: index,
        name: 'index',
        meta: { 
          title: '首页',
          authId: '1',
          affix: true
        }
      }
    ]
  },
  {
    path: '/article',
    component: layout,
    redirect: '/article/articleList',
    meta: { 
      title: '文章管理',
      authId: '1',
      icon: 'el-icon-document'
    },
    child: true,
    children: [
      {
        path: '/article/articleList',
        component: articleList,
        name: 'ruleList',
        meta: { 
          title: '文章列表',
          authId: '5e7a0c129653e66ae88e33ad'
        }
      },
      {
        path: '/article/articleAdd',
        component: articleAdd,
        name: 'articleAdd',
        meta: { 
          title: '创建文章',
          authId: '5e834f23fb69305aa091e824'
        }
      },
      {
        path: '/article/edit',
        component: articleAdd,
        name: 'articleEdit',
        hidden: true,
        meta: { 
          title: '编辑文章',
          authId: '5e7a0c129653e66ae88e33ad'
        }
      },
      {
        path: '/article/articleTag',
        component: articleTag,
        name: 'articleTag',
        meta: { 
          title: '文章标签',
          authId: '5e7a0c6c9653e66ae88e33ae'
        }
      },
      {
        path: '/article/comment',
        component: articleComment,
        hidden: true,
        name: 'articleComment',
        meta: { 
          title: '文章评论',
          authId: '5e7a0c849653e66ae88e33af'
        }
      }
    ]
  },
  {
    path: '/project',
    component: layout,
    redirect: '/project',
    meta: { 
      title: '项目管理',
      authId: '1',
      icon: 'el-icon-tickets'
    },
    children: [
      {
        path: '/project',
        component: projectList,
        name: 'projectList',
        meta: { 
          title: '项目列表',
          authId: '5e7a11f09653e66ae88e33b0'
        }
      }
    ]
  },
  {
    path: '/link',
    component: layout,
    redirect: '/link',
    meta: { 
      title: '友情链接',
      authId: '1',
      icon: 'el-icon-link'
    },
    children: [
      {
        path: '/link',
        component: link,
        name: 'link',
        meta: { 
          title: '友情链接',
          authId: '5e7a120a9653e66ae88e33b1'
        }
      }
    ]
  },
  {
    path: '/message',
    component: layout,
    redirect: '/message',
    meta: { 
      title: '留言管理',
      authId: '1',
      icon: 'el-icon-edit-outline'
    },
    children: [
      {
        path: '/message',
        component: messageList,
        name: 'messageList',
        meta: { 
          title: '留言列表',
          authId: '5e7a12149653e66ae88e33b2'
        }
      }
    ]
  },
  {
    path: '/menu',
    component: layout,
    redirect: '/menu',
    meta: { 
      title: '菜单管理',
      authId: '1',
      icon: 'mio-icon-icon_caidan iconfont'
    },
    children: [
      {
        path: '/menu',
        component: menuManag,
        name: 'menuManag',
        meta: { 
          title: '菜单管理',
          authId: '5e7a12249653e66ae88e33b3'
        }
      }
    ]
  },
  {
    path: '/user',
    component: layout,
    redirect: '/user/userList',
    meta: { 
      title: '用户管理',
      authId: '1',
      icon: 'el-icon-user'
    },
    child: true,
    children: [
      {
        path: '/user/userList',
        component: userList,
        name: 'userList',
        meta: { 
          title: '用户列表',
          authId: '5e7a12939653e66ae88e33b6'
        }
      },
      {
        path: '/user/roleList',
        component: roleList,
        name: 'roleList',
        meta: { 
          title: '角色管理',
          authId: '5e7a12a69653e66ae88e33b7'
        }
      }
    ]
  },
  {
    path: '*', 
    redirect: '/404',
    hidden: true,
    meta: {
      title: '404',
      authId: '1'
    }
  }
]

const createRouter = () => new Router({
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
