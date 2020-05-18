<template>
<div class="menu-item">
  <div class="menu-wraper"  v-for="item in totalRoutes" :key="item.path" v-if='item.meta && item.meta.hide !== true'>
    <div v-if='!item.hidden'>
      <el-submenu v-if='item.children && item.child' :index="item.path" popper-append-to-body>
        <template slot="title">
          <i v-show='item.meta.icon' :class='item.meta.icon?item.meta.icon:"el-icon-setting"'></i>
          <span>{{item.meta.title}}</span>
        </template>
        <menu-item :totalRoutes='item.children'></menu-item>
      </el-submenu>
      <el-menu-item v-else :index="resolvePath(item.path)">
        <i v-show='item.meta.icon' :class='item.meta.icon?item.meta.icon:"el-icon-setting"'></i>
        <span slot="title">{{item.meta.title}}</span>
      </el-menu-item>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
  .iconfont{
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    display: inline-block;
    font-size: 18px;
  }
</style>

<script>
export default {
  name: 'MenuItem',
  props: {
    // route object
    totalRoutes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      iconHide: false
    }
  },
  created() {

  },
  mounted() {
    
  },
  methods: {
    resolvePath(path){
      if(path == '/'){
        return '/index'
      }else{
        return path
      }
    }
  },
  computed: {

  }
}
</script>
