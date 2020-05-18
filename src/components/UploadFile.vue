<template>
  <div class='slot-upload'>
    <div class="upload-square" v-if='type === "square"'>
      <el-upload class='upload-file' enctype='multipart/form-data' :accept="accept" :limit='limit' :multiple="multiple"
        :list-type="listType" :file-list="fileList" :before-upload='beforeUpload' :before-remove='beforeRemove'
        :on-exceed='handleExceed' action="">
        <i class="el-icon-plus avatar-uploader-icon" :style='{width: boxSize,height:boxSize,lineHeight:boxSize}'></i>
      </el-upload>
      <div class="file-progress" v-if='progressObj.show'>
        <el-progress :percentage="progressObj.percentage" :status="progressObj.percentage == 100?'success':'exception'">
        </el-progress>
      </div>
    </div>
    <div class="upload-avatar" v-else-if='type === "avatar"'>
      <el-upload class='avatar-slot'  enctype='multipart/form-data' :accept="accept" :limit='limit' :multiple="multiple"
        :list-type="listType" :file-list="fileList" :before-upload='beforeUpload' :before-remove='beforeRemove'
        :on-exceed='handleExceed' action="">
        <slot :name="avatarSlot" v-if='avatarSlot' />
      </el-upload>
      <div class="file-progress" v-if='progressObj.show' :style='{width: progress.width,margin: progress.margin}'>
        <el-progress :percentage="progressObj.percentage" :status="progressObj.percentage == 100?'success':'exception'">
        </el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    type: {
      type: String,
      default: "square"
    },
    accept: {
      type: String,
      default: "image/*"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: "text"
    },
    boxSize: {
      type: String,
      default: "128px"
    },
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    fileSize: {
      type: Number,
      default: 1048576
    },
    progress: {
      type: Object,
      default() {
        return {};
      }
    },
    avatarSlot: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      progressObj: {
        show: false,
        percentage: 0
      }
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeUpload(file){
      if(file.size >  this.fileSize){
        let sizeLimit = this.fileSize/1024/1024
          this.$Message.warning(`大小限制在${sizeLimit}Mb以内`)
          return
      }
      this.progressObj.percentage = 0;
      this.progressObj.show = true;
      let fd = new FormData()
      fd.append('file', file)
      this.$api.upload.uploadFile(fd,(upload)=>{
        let complete = (upload.loaded / upload.total * 100 | 0)
        this.progressObj.percentage = complete;
        if(this.progressObj.percentage == 100){
          setTimeout(()=>{
            this.progressObj = {
              show: false,
              percentage: 0
            }
          },1000)
        }
      }).then((res) => {
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let fileData = res.data
          this.$emit('uploadEvent',fileData)
        }else{
          this.progressObj = {
            show: false,
            percentage: 0
          }
          this.$message.warning('文件上传失败');
        }
      })
      return false
    },
    beforeRemove(file, fileList){
      if(file.status === 'ready'){
        return true
      }else{
        this.$api.upload.fileDel(file.sourceId).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.$emit('removeEvent',file)
          }else{
            this.$message.warning('文件删除失败');
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .slot-upload {
    width: 100%;
    .upload-file {
      .el-upload {
        border: 1px dashed $color-G70;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
      }
      .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 128px;
        height: 128px;
        line-height: 128px;
        text-align: center;
      }
    }
    .upload-avatar{
      .avatar-slot{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .file-progress {
      width: 400px;
      margin-top: 10px;
    }
  }
</style>
