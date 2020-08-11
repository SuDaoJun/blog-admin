<template>
  <div id="app" class='body-index'>
    <router-view/>
  </div>
</template>

<script>
import '@/assets/css/elTheme.scss';
import '@/assets/css/common.scss';
export default {
  name: 'App',
  created() {
    document.body.removeChild(document.getElementById('Loading'))
  },
  mounted(){
    this.getThemeColor();
  },
  methods: {
    getThemeColor(){
      // let classTheme = localStorage.getItem('classTheme');
      // if(classTheme){
      //   document.getElementsByTagName('html')[0].className = classTheme;
      // }else{
      //   document.getElementsByTagName('html')[0].className = 'custom-light';
      //   localStorage.setItem('classTheme','custom-light')
      // }
      let propTheme = localStorage.getItem('propTheme');
      if(propTheme){
        document.body.setAttribute('data-theme',propTheme);
      }else{
        document.body.setAttribute('data-theme','custom-light');
        localStorage.setItem('propTheme','custom-light')
      }
    }
  }
}
</script>

<style lang="scss">
.body-index {
  height: 100%;
  @include bg-color($color-W100,$color-G100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
