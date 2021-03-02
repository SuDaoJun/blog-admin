## 前言

此 blog-admin 后台管理项目是基于 vue 全家桶 + Element UI 开发

## 效果图

![首页亮](https://s3.ax1x.com/2021/02/25/yviqrF.png)
![首页暗](https://s3.ax1x.com/2021/02/25/yviLb4.png)


完整效果请看：[http://sdjBlog.cn:8080/](http://sdjBlog.cn:8080/)

## 功能描述

### 已经实现功能

- [x] 登录注册
- [x] 个人资料
- [x] 主题切换
- [x] 数据统计
- [x] 文章列表
- [x] 评论列表
- [x] 标签列表
- [x] 项目列表
- [x] 友情链接
- [x] 留言列表
- [x] 菜单功能
- [x] 用户角色

## 前端技术

- vue
- vuex
- vue-route
- axios
- scss
- element-ui
- moment
- highlight.js
- echarts
- wangeditor
- mavon-editor
- xlsx

## 主要项目结构

```
- api axios封装以及api接口
- assets 图片和css字体资源
- components 组件封装
  - TagsView 路由标签导航
  - ChartCard 卡片
  - EmptyShow 数据为空提示
  - MyEcharts echarts图表封装
  - MyForm 表单封装
  - MyTable 表格封装
  - TreeSelect 下拉树型结构
  - UploadFile 文件上传
  - WangEnduit WangEnduit 富文本编辑器
- router 路由封装
- store vuex 的状态管理
- utils 封装的常用的方法，如表单验证，excel导出
- views
  - article 文章列表、文章评论以及文章标签
  - errorPage 错误页面，如404
  - home 数据统计（访客、用户、文章和留言统计）
  - layout 头部导航以及侧边导航
  - link 友情链接列表
  - login 登录注册
  - menu 菜单功能
  - message 留言列表
  - project 项目列表
  - user 用户角色（角色包括导入权限以及批量导入导出用户）
  - redirect 路由重定向
- app.vue 根组件
- main.js 入口文件，实例化Vue、插件初始化
- permission.js 路由权限拦截，通过后台返回权限加载对应路由

```

## 说明

- 登录是通过用户名或邮箱加密码登录，测试账号：用户名：test  密码：123456
- 从后台注册页面注册用户为博主管理员，可以发布自己文章和添加普通用户等权限
- 该系统实现了菜单功能权限以及数据权限，根据用户角色拥有的权限加载菜单路由以及按钮操作，后台通过用户角色和权限进行api请求拦截以及请求数据获取该用户下的数据列表


## Build Setup ( 建立安装 )

```
# install dependencies
npm install

# serve with hot reload at localhost: 8090
npm run dev

# build for production with minification
npm run build
```

如果要看完整的效果，是要和后台项目  **[blog-node](https://gitee.com/sdj_work/blog-node)** 一起运行才行的，不然接口请求会失败。

**项目地址：**

> [前台展示: https://gitee.com/sdj_work/blog-page](https://gitee.com/sdj_work/blog-page)

> [管理后台：https://gitee.com/sdj_work/blog-admin](https://gitee.com/sdj_work/blog-admin)

> [后端Node：https://gitee.com/sdj_work/blog-node](https://gitee.com/sdj_work/blog-node)

> [博客地址：https://sdjBlog.cn/](https://sdjBlog.cn/)
