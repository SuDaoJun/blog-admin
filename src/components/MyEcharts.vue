<template>
  <div class="echarts"
    :id="id"
    :style="style">
  </div>
</template>
<script>
export default {
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String
    },
    option: {
      type: Object
    }
  },
  data() {
    return {
      id: '',
      MyEcharts: "" //echarts实例
    };
  },
  computed: {
    style() {
      return {
        height: this.height,
        width: this.width
      };
    }
  },
  watch: {
    //要监听的对象 option
    //由于echarts采用的数据驱动，所以需要监听数据的变化来重绘图表
    option: {
      handler(newVal, oldVal) {
        if (this.MyEcharts) {
          if (newVal) {
           this.MyEcharts.setOption(newVal, true);
          } else {
           this.MyEcharts.setOption(oldVal, true);
          }
        } else {
          this.InitCharts();
        }
      }, 
      deep: true //对象内部属性的监听，关键。
    }
  },
  created(){
    // this.id = Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
    this.id = this.uuid();
  },
  mounted() {
    this.InitCharts();
  },
  methods: {
    // 生成唯一标识
    uuid(){
      return 'xxxxxx4xxxyxxxxxx'.replace(/[xy]/g, function (c) {
          let r = Math.random() * 16 | 0,
              v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
      });
    },
    //所设计的图表公共组件，不论第一种方法还是第二种方法都按照官网的格式来写数据，这样方便维护
    InitCharts() {
      this.MyEcharts = this.$echarts.init(document.getElementById(this.id));
      /**
       * 此方法适用于所有项目的图表，但是每个配置都需要在父组件传进来，相当于每个图表的配置都需要写一遍，不是特别的省代码，主要是灵活度高
       * echarts的配置项，你可以直接在外边配置好，直接扔进来一个this.option
       */
       this.MyEcharts.clear(); //适用于大数据量的切换时图表绘制错误,先清空在重绘
      this.MyEcharts.setOption(this.option, true); //设置为true可以是图表切换数据时重新渲染

   //以下这种方法，当一个页面有多个图表时，会有一个bug那就是只有一个图表会随着窗口大小变化而变化。
      // window.onresize = () => {
      //   this.MyEcharts.resize();
      // };
   //以下为上边的bug的解决方案。以后用这种方案，放弃上一种。
      window.addEventListener("resize", ()=> {
        this.MyEcharts.resize();
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.echarts{
  @include bg-color($color-W100);
}
</style>