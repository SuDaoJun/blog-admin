<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text" v-highlight>
    </div>
  </div>
</template>

<script>
import Wangeditor from "wangeditor";
export default {
  name: "editoritem",
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      isChange:false,
    };
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    isClear: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // isClear(val) {
    //   // 触发清除文本域内容
    //   if (val) {
    //     this.editor.txt.clear();
    //     this.info_ = null;
    //   }
    // },
    value: function(value) {
      //鼠标光标会乱跳
      // if (value !== this.editor.txt.html()) {
      //   this.editor.txt.html(this.value);
      // }

      if(!this.isChange){
        this.editor.txt.html(this.value)
      }
      this.isChange= false
    }
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  mounted() {
    this.seteditor();
    this.addTitle()
    this.editor.txt.html(this.value);
  },
  methods: {
    addTitle(){
      const titleConfig = {
        'w-e-icon-bold':'粗体',
        'w-e-icon-italic':'斜体',
        'w-e-icon-underline':'下划线',
        'w-e-icon-strikethrough':'删除线',
        'w-e-icon-link':'插入链接',
        'w-e-icon-quotes-left':'引用',
        'w-e-icon-happy':'表情',
        'w-e-icon-image':'插入图片',
        'w-e-icon-table2':'表格',
        'w-e-icon-play':'插入视频',
        'w-e-icon-terminal':'插入代码',
        'w-e-icon-undo':'撤销',
        'w-e-icon-redo':'重复'
      };
      const oToolBar = document.querySelector('.toolbar')
      const aSelect = oToolBar.querySelectorAll('i')
      aSelect.forEach((item)=>{
        if(titleConfig[item.classList[0]]){
          item.title = titleConfig[item.classList[0]];
        }
      });
    },
    seteditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new Wangeditor(this.$refs.toolbar, this.$refs.editor);
      // this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
      this.editor.customConfig.uploadImgShowBase64 = true; // 启用base 64 存储图片，本地上传默认是关闭的。分为Base64与上传至服务器
      // this.editor.customConfig.uploadImgServer = 'http://localhost:3000/upload_images'// 配置服务器端图片地址
      this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
      this.editor.customConfig.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 6 张图片
      this.editor.customConfig.uploadImgTimeout = 60 * 60 * 1000; // 设置超时时间
      this.editor.customConfig.zIndex = 2; // 编辑区域和菜单的z-index
      // this.editor.customConfig.colors = [
      //   "#000000",
      //   "#e60000",
      //   "#ff9900",
      //   "#ffff00",
      //   "#008a00",
      //   "#0066cc",
      //   "#9933ff",
      //   "#ffffff",
      //   "#facccc",
      //   "#ffebcc",
      //   "#ffffcc",
      //   "#cce8cc",
      //   "#cce0f5",
      //   "#ebd6ff",
      //   "#bbbbbb",
      //   "#f06666",
      //   "#ffc266",
      //   "#ffff66",
      //   "#66b966",
      //   "#66a3e0",
      //   "#c285ff",
      //   "#888888",
      //   "#a10000",
      //   "#b26b00",
      //   "#b2b200",
      //   "#006100",
      //   "#0047b2",
      //   "#6b24b2",
      //   "#444444",
      //   "#5c0000",
      //   "#663d00",
      //   "#666600",
      //   "#003700",
      //   "#002966",
      //   "#3d1466"
      // ];

      // 配置菜单
      this.editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        "video", // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];

      this.editor.customConfig.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
          //result为上传图片成功的时候返回的数据，这里我打印了一下发现后台返回的是data：[{url:"路径的形式"},...]
          // console.log(result.data[0].url)
          //insertImg()为插入图片的函数
          //循环插入图片
          // for (let i = 0; i < 1; i++) {
          // console.log(result)
          let url = "http://otp.cdinfotech.top" + result.url;
          insertImg(url);
          // }
        }
      };
      this.editor.customConfig.onchange = html => {
        this.isChange = true;
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    }
  }
};
</script>

<style lang="scss">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  margin-top: -1px;
  height: 500px;
  min-height: 500px;
}
</style>