<template>
  <div class="wrapper">
    <h2 class='content-title'>{{type === 'add'?"创建文章":(articleTitle?'编辑文章——'+articleTitle:'编辑文章')}}</h2>
    <div class="box-table">
      <my-form
        :ref='articleForm.ref'
        :formConfig="articleForm"
      >
        <div slot='upload' class='upload-box'>
          <upload-file listType='picture-card' :fileList='fileList' @uploadEvent='beforeUpload' @removeEvent='beforeRemove'></upload-file>
          <div class="select-img" v-show='imgList.length > 0'>
            <el-image
            v-if='confirSourceId'
            style="width: 148px; height: 148px;border-radius: 4px;"
            :src='baseURL+"/file/down?downId="+confirSourceId'
            :lazy='true'
            fit="fill"></el-image>
            <div class="select-txt" @click="dialogVisible = true">封面选择(封面上传优先)</div>
          </div>
        </div>
      </my-form>
      <div class="box-content">
        <span class='content-info'>文章内容</span>
        <WangEnduit v-model="content" v-highlight v-show='articleForm.formModel.contentType == "0"'></WangEnduit>
        <mavon-editor 
            v-model="markContent" 
            v-highlight
            @change="handleMarkdownChange"
            v-show='articleForm.formModel.contentType == "1"'
            style="min-height: 500px;width: 100%;height:500px"
        />
      </div>
      <div class="box-btn">
        <el-button class="btn-click btn-margin" :loading='loadObj.draftLoad' @click.native = 'articleAdd("0")'>存草稿</el-button>
        <el-button class="btn-click btn-submit" :loading='loadObj.releaseLoad' type="primary" @click.native = 'articleAdd("1")'>发布</el-button>
      </div>
    </div>
    <el-dialog
      title="封面选择"
      :visible.sync="dialogVisible"
      @open='dialogOpen'
      width="40%">
      <div class="dialog-list">
        <div :class="selectSourceId == item.imgId?'list-item item-active':'list-item'" v-for='(item,index) in imgList' :key='item._id' @click='selectSourceId = item.imgId'>
          <el-image
          style="width: 100px; height: 100px"
          :src='baseURL+"/file/down?downId="+item.imgId'
          :lazy='true'
          fit="fill"></el-image>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WangEnduit from "@/components/WangEnduit";
import MyForm from '@/components/MyForm'
import UploadFile from '@/components/UploadFile'
import Format from "@/utils/format.js"
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  data() {
    return {
      imgList: [],
      selectSourceId: '',
      confirSourceId: '',
      dialogVisible: false,
      baseURL: this.$baseURL,
      id: '',
      articleTitle: '',
      type: 'add',
      fileList: [],
      content: '',
      htmlContent: '',
      markContent: '',
      loadObj: {
        draftLoad: false,
        releaseLoad: false
      },
      articleForm: {
        ref: 'articleRef',
        labelWidth: '80px',
        marginBottom: '30px',
        requiredAsterisk: true,
        formItemList: [
          {
            type: "text",
            prop: "title",
            width: '400px',
            label: '文章标题',
            placeholder: "请输入文章标题"
          },
          {
            type: "text",
            prop: "description",
            width: '400px',
            label: '文章描述',
            placeholder: "请输入文章描述"
          },
          {
            type: "select",
            prop: "tags",
            multiple: true,
            width: '400px',
            label: '文章标签',
            placeholder: "请选择文章标签",
            arrList: []
          },
          {
            label: "文章封面",
            slot: 'upload'
          },
          {
            type: "radio",
            prop: "contentType",
            label: '文章类型',
            arrList: [
              {
                label: '富文本编辑',
                value: '0'
              },
              {
                label: 'markdown编辑',
                value: '1'
              }
            ]
          }
        ],
        formModel: {
          title: '',
          description: '',
          tags: [],
          contentType: '0'
        },
        rules: {
          title: [
            { required: true, validator: Format.FormValidate.Form('文章标题').NoEmpty, trigger: 'blur' }
          ],
          description: [
            { required: true, validator: Format.FormValidate.Form('文章描述').NoEmpty, trigger: 'blur' }
          ],
          tags: [
            { required: true, validator: Format.FormValidate.Form('文章标签').TypeSelect, trigger: 'change' }
          ]
        }
      }
    };
  },
  created() {},
  mounted() {
    this.getTagsList()
    this.getImgList()
    if(this.$route.query.articleId){
      this.type = 'edit'
      this.id = this.$route.query.articleId
      this.articleTitle = this.$route.query.articleTitle
      this.getDataDetail()
    }
  },
  methods: {
    getDataDetail(){
      this.$api.article.articleDetail({
        id: this.id
      }).then(res=>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let data = res.data
          if(data.imgId){
            this.fileList = [
              {
                name: '',
                url: `${this.$baseURL}/file/down?downId=${data.imgId}`,
                sourceId: data.imgId
              }
            ]
          }
          let tags = []
          data.tags.forEach(item=>{
            tags.push(item._id)
          })
          this.articleForm.formModel = {
            title: data.title,
            contentType: data.contentType || '0',
            description: data.description,
            tags
          }
          data.contentType == '1'?this.markContent = data.markContent:this.content = data.content
        }else{
          this.$message.warning('获取文章详情失败');
        }
      })
    },
    getTagsList(){
      this.$api.article.tagList({
        currentPage: '1',
        pageSize: '99'
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let list = res.data.data
          if(list.length > 0){
            list.forEach(item=>{
              item.label = item.name
              item.value = item._id
            })
          }
          this.articleForm.formItemList[2].arrList = list
        }else{
          this.$message.warning('获取标签列表失败');
        }
      })
    },
    dialogOpen(){
      this.selectSourceId = this.confirSourceId?this.confirSourceId:'';
    },
    confirSelect(){
      if(this.selectSourceId){
        this.confirSourceId = this.selectSourceId;
        this.dialogVisible = false;
      }
    },
    getImgList(){
      this.$api.article.articleImgStatistics({
        num: 12
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let list = res.data
          if(list.length > 0){
            list = list.filter((item)=>{
              return item.imgId
            })
          }
          this.imgList = list;
        }else{
          this.$message.warning('获取图片列表失败');
        }
      })
    },
    beforeUpload(fileData){
      this.fileList = [fileData]
    },
    beforeRemove(file){
      this.fileList = []
    },
    handleMarkdownChange(markdown, html){
      this.htmlContent = html
    },
    articleAdd(status){
      this.$refs["articleRef"].$refs["articleRef"].validate((valid) => {
        if (valid) {
          let {fileList, loadObj, markContent, htmlContent, content, confirSourceId} = this
          let formModel = this.articleForm.formModel
          let contentData = formModel.contentType == '1'?htmlContent:content
          let imgId = null;
          if(fileList.length > 0){
            imgId = fileList[0].sourceId;
          }else{
            if(confirSourceId){
              imgId = confirSourceId;
            }
          }
          if(contentData){
            status == '0'?loadObj.draftLoad = true:loadObj.releaseLoad = true
            if(this.type === 'add'){
              this.$api.article.articleAdd({
                title: formModel.title,
                description: formModel.description,
                content: contentData,
                markContent: formModel.contentType == '1'?markContent:'',
                contentType: formModel.contentType,
                imgId: fileList.length > 0?fileList[0].sourceId:null,
                status,
                tags: formModel.tags.join(',')
              }).then((res)=>{
                let code = res.code
                status == '0'?loadObj.draftLoad = false:loadObj.releaseLoad = false
                if(code === this.$constant.reqSuccess){
                  this.$message.success('文章新增成功')
                  this.$router.push({path: '/article/articleList'})
                }else if(code === this.$constant.dataAlready){
                  formModel.title = ''
                  this.$message.warning('文章标题已存在')
                }else{
                  this.$message.warning('文章新增失败')
                }
              })
            }else{
              this.$api.article.articleUpdate({
                id: this.id,
                title: formModel.title,
                description: formModel.description,
                contentType: formModel.contentType,
                content: contentData,
                markContent: formModel.contentType == '1'?markContent:'',
                imgId: fileList.length > 0?fileList[0].sourceId:null,
                status,
                tags: formModel.tags.join(',')
              }).then((res)=>{
                let code = res.code
                status == '0'?loadObj.draftLoad = false:loadObj.releaseLoad = false
                if(code === this.$constant.reqSuccess){
                  this.$message.success('文章编辑成功')
                  this.$router.push({path: '/article/articleList'})
                }else if(code === this.$constant.dataAlready){
                  formModel.title = ''
                  this.$message.warning('文章标题已存在')
                }else{
                  this.$message.warning('文章编辑失败')
                }
              })
            }
          }else{
            this.$message.warning("文章内容不为空")
          }
        } else {
          this.$message.warning("信息校验失败")
        }
      })
    }
  },
  watch: {},
  components: {
    WangEnduit,
    MyForm,
    UploadFile,
    mavonEditor
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.box-table{
  padding: 30px 60px 40px;
}
.box-content{
  width: 100%;
  display: flex;
  .content-info{
    width: 80px;
    flex-shrink: 0;
  }
}
.box-btn{
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn-click{
    border: 1px solid $color-G40;
    padding: 8px 15px;
    border-radius: 4px;
    letter-spacing: 1px;
    cursor: pointer;
  }
  .btn-margin{
    margin: 0 25px;
    padding: 8px 20px;
  }
  .btn-submit{
    background-color: $color-B70;
    padding: 8px 20px;
    border: none;
    color: $color-W100;
  }
}
.upload-box{
  display: flex;
  align-items: flex-start;
  /deep/ .slot-upload{
    width: auto;
    max-width: 340px;
  }
  .select-img{
    margin-left: 30px;
    display: flex;
    .select-txt{
      padding: 5px;
      line-height: 1.5;
      margin-left: 8px;
      color: #409EFF;
      cursor: pointer;
    }
  }
}
.dialog-list{
  padding-left: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .list-item{
    margin-right: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    &.item-active::after{
      content: "\e720";
      font-family: element-icons !important;
      position: absolute;
      right: -12px;
      top: -12px;
      font-size: 28px;
      font-weight: bold;
      color: #409EFF;
    }
  }
}
</style>
