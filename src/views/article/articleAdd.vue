<template>
  <div class="wrapper">
    <h2 class='content-title'>{{type === 'add'?"创建文章":(articleTitle?'编辑文章——'+articleTitle:'编辑文章')}}</h2>
    <div class="box-table">
      <my-form
        :ref='articleForm.ref'
        :formConfig="articleForm"
      >
        <div slot='upload'>
          <upload-file listType='picture-card' :fileList='fileList' @uploadEvent='beforeUpload' @removeEvent='beforeRemove'></upload-file>
        </div>
      </my-form>
      <div class="box-content">
        <span class='content-info'>文章内容</span>
        <WangEnduit v-model="htmlContent" v-highlight v-show='articleForm.formModel.contentType == "0"'></WangEnduit>
        <mavon-editor 
            v-model="markContent" 
            v-highlight
            v-show='articleForm.formModel.contentType == "1"'
            style="min-height: 500px;width: 100%;"
        />
      </div>
      <div class="box-btn">
        <el-button class="btn-click btn-margin" :loading='loadObj.draftLoad' @click.native = 'articleAdd("0")'>存草稿</el-button>
        <el-button class="btn-click btn-submit" :loading='loadObj.releaseLoad' type="primary" @click.native = 'articleAdd("1")'>发布</el-button>
      </div>
    </div>
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
      id: '',
      articleTitle: '',
      type: 'add',
      fileList: [],
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
          data.contentType == '1'?this.markContent = data.content:this.htmlContent = data.content
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
    beforeUpload(fileData){
      this.fileList = [fileData]
    },
    beforeRemove(file){
      this.fileList = []
    },
    articleAdd(status){
      this.$refs["articleRef"].$refs["articleRef"].validate((valid) => {
        if (valid) {
          let {fileList, loadObj, markContent, htmlContent} = this
          let formModel = this.articleForm.formModel
          let content = formModel.contentType == '1'?markContent:htmlContent
          if(content){
            status == '0'?loadObj.draftLoad = true:loadObj.releaseLoad = true
            if(this.type === 'add'){
              this.$api.article.articleAdd({
                title: formModel.title,
                description: formModel.description,
                content,
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
                content,
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
</style>
