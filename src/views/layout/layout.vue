<template>
  <div :class='collapse?"index-layout index-collapse":"index-layout"'>
    <div class="layout-sidebar">
      <div class="sider-logo" @click='logoIndex' v-show='!collapse'>
        {{userInfo.name || 'Blog'}}
      </div>
      <div class="sider-menu">
        <el-scrollbar style='height: calc(100% - 64px)' class='wrap-scroll'>
          <el-menu
          ref='menu'
          :default-active="defaultActive"
            class="el-menu-vertical-demo"
            router
            :collapse="collapse"
            @select='menuRefresh'>
            <menu-item :totalRoutes='totalRoutes'></menu-item>
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
    <div class="layout-container">
      <div class="container-header fixed-header">
        <div class="info-header">
          <div class="header-left">
            <div class="left-collapse" @click='collapseChange'>
              <i :class='collapse?"el-icon-s-unfold collapse-color":"el-icon-s-fold collapse-color"'></i>
            </div>
            <el-breadcrumb class="header-breadcrumb" separator="/">
              <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item,index) in bredlList" :key="item.path">
                  <span v-if="index==bredlList.length-1" class="no-redirect">{{ item.meta.title }}</span>
                  <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
                </el-breadcrumb-item>
              </transition-group>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <div class="right-notice" @click='drawerOpen'>
              <el-badge :value="badgeNum" :hidden='badgeNum === 0?true:false'>
                <i class="el-icon-bell"></i>
              </el-badge>
            </div>
            <el-dropdown @command="handleCommand" placement='bottom'>
              <div class="el-dropdown-link">
                <el-image v-if='userInfo.avatarId' :src='baseURL+"/file/down?downId="+userInfo.avatarId' class='image-circle'>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-user-solid"></i>
                  </div>
                </el-image>
                <div v-else class="image-slot">
                  <i class="el-icon-user-solid"></i>
                </div>
                <span class='link-name'>{{userInfo.name || '--'}}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="personal" icon="el-icon-user">个人资料</el-dropdown-item>
                <el-dropdown-item command="modifyPwd" icon="el-icon-edit">修改密码</el-dropdown-item>
                <el-dropdown-item command="statement" v-if="authList.includes('5ea6fa245fb5d2567c6cad54')" icon="el-icon-position">励志语句</el-dropdown-item>
                <el-dropdown-item command="blog" divided icon="el-icon-cloudy">博客展示</el-dropdown-item>
                <el-dropdown-item command="github" icon="el-icon-link">Github</el-dropdown-item>
                <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <tags-view v-show='tagShow' />
      </div>
      <el-scrollbar style='height: 100vh' class='wrap-scroll'>
        <div :class="!tagShow?'container-show tag-show':'container-show'">
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </el-scrollbar>
    </div>
    <!-- <div class="right-panel" @click='drawerSetting = true'>
      <i class="el-icon-setting" />
    </div> -->
    <el-drawer
      title="配置中心"
      size='260px'
      :visible.sync="drawerSetting">
      <div class="box-drawer">
        <!-- <div class="drawer-item">
          <span>主题切换</span>
          <el-switch v-model="theme" @change='colorChange' />
        </div> -->
        <div class="drawer-item">
          <span>开启Tags-View</span>
          <el-switch v-model="tagShow" @change='tagChange' />
        </div>
      </div>
    </el-drawer>
    <el-drawer
      title="消息中心"
      :visible.sync="drawer">
      <div class="notice-clear">
        <div class="clear-all" @click='readAll'>全部已读</div>
        <div class="clear-all" @click='clearAll'>清空消息</div>
      </div>
      <div :class="item.isRead?'notice-list notice-read':'notice-list'" v-for='(item,index) in noticeLists' :key='index' @click='readChange(index)'>
        <p>{{item.createTime}}</p>
        <div class="box-info">
          <span>执行操作：</span>
          <span class='info-operate'>{{item.title}}</span>
        </div>
        <div class="clear-single el-icon-error" @click.stop='clearSingle(item,index)'></div>
      </div>
      <empty-show :hide='noticeLists.length === 0' showTxt='暂无消息'></empty-show>
    </el-drawer>
    <el-dialog title="修改密码" :visible.sync="pwdModel" width='640px' @keyup.enter.native="modifyPwd">
      <my-form
        :ref='pwdForm.ref'
        :formConfig="pwdForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pwdModel = false">取 消</el-button>
        <el-button type="primary" @click="modifyPwd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="励志语句" :visible.sync="statementModel" width='640px' @keyup.enter.native="modifyStatement">
      <my-form
        :ref='statementForm.ref'
        :formConfig="statementForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statementModel = false">取 消</el-button>
        <el-button type="primary" @click="modifyStatement">编 辑</el-button>
      </div>
    </el-dialog>
    <el-dialog title="个人资料" :visible.sync="infoModel" width='640px'>
      <div class="person-info">
        <div class="info-avatar">
          <el-image v-if='infoForm.formModel.avatarId' :src='baseURL+"/file/down?downId="+infoForm.formModel.avatarId' class='image-avatar'>
            <div slot="error" class="icon-avatar">
              <i class="el-icon-user-solid"></i>
            </div>
          </el-image>
          <div v-else class="icon-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <upload-file type='avatar' avatarSlot='avatarSlot' :progress='progressObj' @uploadEvent='beforeUpload'>
            <div calss='upload-avatar' slot='avatarSlot'>
              <el-button size="small">{{infoForm.formModel.avatarId?'更换头像':'上传头像'}}</el-button>
            </div>
          </upload-file>
        </div>
        <my-form
          :ref='infoForm.ref'
          :formConfig="infoForm"
        >
        <span slot='role'>{{userInfo.roleId?userInfo.roleId.name:'--'}}</span>
        </my-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoModel = false">取 消</el-button>
        <el-button type="primary" @click.native="updateInfo">更新信息</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TagsView from '@/components/TagsView';
import MenuItem from '@/views/layout/MenuItem';
import EmptyShow from "@/components/EmptyShow";
import MyForm from '@/components/MyForm'
import UploadFile from '@/components/UploadFile'
import Format from "@/utils/format.js"
export default {
  data() {
    const validatePwdCheck = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error('请输入确认密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('确认密码字符长度为6-16个字符'));
      } else if (value != this.pwdForm.formModel.newPwd) {
        callback(new Error('确认密码和新密码不一致'));
      } else {
        callback();
      }
    }
    return {
      baseURL: this.$baseURL,
      drawer: false,
      drawerSetting: false,
      pwdModel: false,
      statementModel: false,
      infoModel: false,
      tagShow: true,
      theme: true,
      badgeNum: 0,
      defaultActive: '',
      bredlList: [],
      noticeLists: [],
      statementList: [],
      progressObj: {
        width: '180px'
      },
      userInfo: {},
      infoForm: {
        ref: 'userRef',
        labelWidth: '90px',
        labelPosition: 'right',
        requiredAsterisk: true,
        formItemList: [
          {
            label: "角色：",
            slot: "role"
          },
          {
            type: "text",
            prop: "name",
            width: '320px',
            label: "用户名：",
            placeholder: "请输入用户名"
          },
          {
            type: "text",
            prop: "email",
            width: '320px',
            label: "邮箱：",
            placeholder: "请输入邮箱"
          },
          {
            type: "text",
            prop: "phone",
            width: '320px',
            label: "手机号码：",
            maxlength: '11',
            inputType: 'phone',
            placeholder: "请输入手机号码"
          },
          {
            type: "textarea",
            prop: "info",
            width: '320px',
            label: "个人介绍：",
            placeholder: "请输入个人介绍"
          }
        ],
        formModel: {
          avatarId: '',
          name: '',
          email: '',
          phone: '',
          info: ''
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('用户名').NoEmpty, trigger: 'blur' }
          ],
          email: [
            { required: true, validator: Format.FormValidate.Form('邮箱').Email, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: Format.FormValidate.Form('手机号码').Phone, trigger: 'blur' }
          ],
          info: [
            { required: true, validator: Format.FormValidate.Form('个人介绍').NoEmpty, trigger: 'blur' }
          ]
        }
      },
      statementForm: {
        ref: 'statementRef',
        labelWidth: '70px',
        requiredAsterisk: true,
        formItemList: [
          {
            type: "text",
            prop: "monday",
            width: '460px',
            label: "星期一",
            placeholder: "星期一励志语句"
          },
          {
            type: "text",
            prop: "tuesday",
            label: "星期二",
            placeholder: "星期二励志语句"
          },
          {
            type: "text",
            prop: "wednesday",
            label: "星期三",
            placeholder: "星期三励志语句"
          },
          {
            type: "text",
            prop: "thursday",
            label: "星期四",
            placeholder: "星期四励志语句"
          },
          {
            type: "text",
            prop: "friday",
            label: "星期五",
            placeholder: "星期五励志语句"
          },
          {
            type: "text",
            prop: "saturday",
            label: "星期六",
            placeholder: "星期六励志语句"
          },
          {
            type: "text",
            prop: "sunday",
            label: "星期日",
            placeholder: "星期日励志语句"
          }
        ],
        formModel: {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: ''
        },
        rules: {
          monday: [
            { required: true, validator: Format.FormValidate.Form('星期一励志语').NoEmpty, trigger: 'blur' }
          ],
          tuesday: [
            { required: true, validator: Format.FormValidate.Form('星期二励志语').NoEmpty, trigger: 'blur' }
          ],
          wednesday: [
            { required: true, validator: Format.FormValidate.Form('星期三励志语').NoEmpty, trigger: 'blur' }
          ],
          thursday: [
            { required: true, validator: Format.FormValidate.Form('星期四励志语').NoEmpty, trigger: 'blur' }
          ],
          friday: [
            { required: true, validator: Format.FormValidate.Form('星期五励志语').NoEmpty, trigger: 'blur' }
          ],
          saturday: [
            { required: true, validator: Format.FormValidate.Form('星期六励志语').NoEmpty, trigger: 'blur' }
          ],
          sunday: [
            { required: true, validator: Format.FormValidate.Form('星期日励志语').NoEmpty, trigger: 'blur' }
          ]
        }
      },
      pwdForm: {
        ref: 'pwdRef',
        labelWidth: '80px',
        labelPosition: 'right',
        requiredAsterisk: true,
        marginRight: '10px',
        formItemList: [
          {
            type: "password",
            prop: "oldPwd",
            width: '450px',
            label: "原密码",
            placeholder: "请输入原密码"
          },
          {
            type: "password",
            prop: "newPwd",
            width: '450px',
            label: "新密码",
            placeholder: "请输入新密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            width: '450px',
            label: "确认密码",
            placeholder: "请输入确认密码"
          }
        ],
        formModel: {
          oldPwd: '',
          newPwd: '',
          confirPwd: ''
        },
        rules: {
          oldPwd: [
            { required: true, validator: Format.FormValidate.Form('原密码').Password, trigger: 'blur' }
          ],
          newPwd: [
            { required: true, validator: Format.FormValidate.Form('新密码').Password, trigger: 'blur' }
          ],
          confirPwd: [
            { required: true, validator: validatePwdCheck, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    
  },
  mounted() {
    let collapse = sessionStorage.getItem('collapse')?sessionStorage.getItem('collapse'):'0'
    this.$store.dispatch('operateCollapse', collapse)
    this.theme = localStorage.getItem('propTheme')?(localStorage.getItem('propTheme') == 'custom-light'?true:false):true;
    this.tagShow = localStorage.getItem('tagShow')?(localStorage.getItem('tagShow') == 'false'?false:true):true;
    this.userInfo = sessionStorage.getItem('userInfo')?JSON.parse(sessionStorage.getItem('userInfo')):{}
    this.infoForm.formModel.avatarId = this.userInfo.avatarId
    let noticeLists = localStorage.getItem('noticeLists')?JSON.parse(localStorage.getItem('noticeLists')):[]
    if(noticeLists.length > 0){
      let badgeNum = 0
      noticeLists.forEach(item=>{
        if(item.isRead === false){
          badgeNum++
        }
      })
      this.badgeNum = badgeNum
    }
    this.noticeLists = noticeLists
    this.getBreadCrumb()
    this.getDefaultActive()
    if(this.authList.includes('5ea6fa245fb5d2567c6cad54')){
      this.getStatementList()
    }
  },
  methods: {
    // 励志语句列表
    getStatementList(){
      this.$api.user.statementList().then(res=>{
        console.log(res)
        this.statementList = res.data
      })
    },
    getBreadCrumb(){
      let matched = this.$route.matched;
      if(matched[0].path === matched[1].path){
        matched = this.$route.matched[0]
      }
      if(this.$route.name === 'index'){
        matched = [{ path: '/', meta: { title: '首页' }}]
      }else{
        matched = [{ path: '/', meta: { title: '首页' }}].concat(matched)
      }
       this.bredlList = matched;
    },
    handleLink(item) {
      let { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(path)
    },
    menuRefresh(index,indexPath){
      if(index === this.$route.fullPath){
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + index
          })
        })
      }
    },
    drawerOpen(){
      this.drawer = true;
    },
    logoIndex(){
      this.$router.push({ path: '/'})
    },
    colorChange(value){
      this.theme = value;
      if(value){
        document.body.setAttribute('data-theme','custom-light');
        localStorage.setItem('propTheme','custom-light');
        this.$router.replace({
          path: '/redirect' + this.$route.fullPath
        })
      }else{
        document.body.setAttribute('data-theme','custom-dark');
        localStorage.setItem('propTheme','custom-dark');
        this.$router.replace({
          path: '/redirect' + this.$route.fullPath
        })
      }
    },
    tagChange(value){
      this.tagShow = value;
      localStorage.setItem('tagShow',this.tagShow);
    },
    getDefaultActive(){
      if(this.$route.name === 'articleEdit' || this.$route.name === 'articleComment'){
        this.defaultActive = '/article/articleList'
      }else{
        this.defaultActive = this.$route.path
      }
    },
    modifyPwd(){
      this.$refs['pwdRef'].$refs['pwdRef'].validate((valid) => {
        if (valid) {
          let formModel = this.pwdForm.formModel;
          let userInfo = this.userInfo;
          this.$api.user.modifyPwd({
            userId: userInfo._id,
            password: formModel.oldPwd,
            newPassword: formModel.newPwd
          }).then((res)=>{
            let code = res.code;
            if(code === this.$constant.reqSuccess){
              this.pwdModel = false;
              this.logouts()
              this.$message.success('密码修改成功，请重新登录');
            }else if(code === this.$constant.dataFail){
              this.$message.error('用户不存在');
            }else if(code === this.$constant.pwdFail){
              this.$message.error('原密码错误');
            }else{
              this.$message.error('密码修改错误')
            }
          })
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    beforeUpload(fileData){
      this.infoForm.formModel.avatarId = fileData.sourceId
    },
    updateInfo(){
      this.$refs['userRef'].$refs['userRef'].validate((valid) => {
        if (valid) {
          let formModel = this.infoForm.formModel;
          let userInfo = this.userInfo;
          this.$api.user.userUpdate({
            id: userInfo._id,
            avatarId: formModel.avatarId,
            name: formModel.name,
            email: formModel.email,
            phone: formModel.phone,
            info: formModel.info
          }).then((res)=>{
            let code = res.code
            if(code === this.$constant.reqSuccess){
              this.userInfo = res.data
              sessionStorage.setItem('userInfo',JSON.stringify(res.data))
              this.infoModel = false;
              this.$message.success('更新信息成功')
            }else if(code === this.$constant.dataAlready){
              this.$message.error('用户名已存在')
              formModel.name = ''
            }else if(code === this.$constant.statusFail){
              this.$message.error('邮箱已存在')
              formModel.email = ''
            }else{
              this.$message.error('更新信息失败')
            }
          })
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    readChange(index){
      this.noticeLists[index].isRead = true
      this.badgeNum--
      localStorage.setItem('noticeLists',JSON.stringify(this.noticeLists))
    },
    clearSingle(item,index){
      if(!item.isRead){
        this.badgeNum--
      }
      this.noticeLists.splice(index,1)
      localStorage.setItem('noticeLists',JSON.stringify(this.noticeLists))
    },
    readAll(){
      if(this.noticeLists.length > 0){
        this.noticeLists.forEach(item=>{
          item.isRead = true
        })
        this.badgeNum = 0
        localStorage.setItem('noticeLists',JSON.stringify(this.noticeLists))
      }
    },
    clearAll(){
      if(this.noticeLists.length > 0){
        this.noticeLists = []
        this.badgeNum = 0
        localStorage.setItem('noticeLists','')
        this.$message.success('消息已清空')
      }
    },
    collapseChange(){
      if(!this.collapse){
        let totalRoutes = this.totalRoutes
        for(let i = 0; i < totalRoutes.length; i++){
          if(totalRoutes[i].child){
            this.$refs.menu.close(totalRoutes[i].path)
          }
        }
      }
      setTimeout(()=>{
        let collapse = this.collapse?'0':'1'
        sessionStorage.setItem('collapse',collapse)
        this.$store.dispatch('operateCollapse', collapse)
      },200)
    },
    modifyStatement(){
      this.$refs['statementRef'].$refs['statementRef'].validate((valid) => {
        if (valid) {
          let formModel = this.statementForm.formModel
          let statementList = this.statementList
          let idArr = []
          let dataList = []
          if(statementList.length > 0){
            statementList.forEach(item=>{
              idArr.push(item._id)
            })
          }
          dataList = [
            {
              title: formModel.monday,
              sortNum: 1
            },
            {
              title: formModel.tuesday,
              sortNum: 2
            },
            {
              title: formModel.wednesday,
              sortNum: 3
            },
            {
              title: formModel.thursday,
              sortNum: 4
            },
            {
              title: formModel.friday,
              sortNum: 5
            },
            {
              title: formModel.saturday,
              sortNum: 6
            },
            {
              title: formModel.sunday,
              sortNum: 7
            }
          ]
          this.$api.user.statementUpdate({
            idArr,
            dataList
          }).then((res)=>{
            let code = res.code;
            if(code === this.$constant.reqSuccess){
              this.statementModel = false
              this.getStatementList()
              this.$message.success('励志语句编辑成功');
            }else{
              this.$message.error('励志语句编辑失败')
            }
          })
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    // 下拉菜单选择
    handleCommand(command){
      if(command === 'personal'){
        if(this.$refs["userRef"]){
          this.$refs["userRef"].$refs["userRef"].resetFields();
        }
        let userInfo = this.userInfo
        this.infoForm.formModel = {
          avatarId: userInfo.avatarId,
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          info: userInfo.info
        }
        this.infoModel = true
      }else if(command === 'modifyPwd'){
        if(this.$refs["pwdRef"]){
          this.$refs["pwdRef"].$refs["pwdRef"].resetFields();
        }
        this.pwdModel = true
      }else if(command === 'statement'){
        if(this.$refs["statementRef"]){
          this.$refs["statementRef"].$refs["statementRef"].resetFields();
        }
        let statementList = this.statementList
        if(statementList.length > 0){
          this.statementForm.formModel = {
            monday: statementList[0].title,
            tuesday: statementList[1].title,
            wednesday: statementList[2].title,
            thursday: statementList[3].title,
            friday: statementList[4].title,
            saturday: statementList[5].title,
            sunday: statementList[6].title
          }
        }
        this.statementModel = true
      }else if(command === 'blog'){
        window.open("//sdjBlog.cn")
      }else if(command === 'github'){
        window.open("https://github.com/SuDaoJun")
      }else if(command === 'logout'){
        this.logouts()
      }
    },
    async logouts(){
      await this.$store.dispatch('logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  },
  watch: {
    $route(route) {
      this.getBreadCrumb()
      this.getDefaultActive()
    }
  },
  components: {
    TagsView,
    MenuItem,
    EmptyShow,
    UploadFile,
    MyForm
  },
  computed: {
    totalRoutes(){
      return this.$store.getters.getTotalRoutes
    },
    authList(){
      return this.$store.getters.getAuthList
    },
    collapse() {
      return this.$store.getters.getCollapse === '1'?true:false
    }
  }
}
</script>

<style scoped lang="scss">
  .index-layout{
    width: 100%;
    height: 100%;
    position: relative;
    .layout-sidebar{
      width: 240px;
      @include bg-color($color-B80,$color-C80);
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      overflow: hidden;
      transition: all 0.4s;
      .sider-logo{
        width: 100%;
        padding: 0 20px;
        height: 64px;
        font-size: 24px;
        font-weight: 600;
        color: $color-W100;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 1px;
        cursor: pointer;
        @include overRow;
      }
      .sider-menu{
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }
    .layout-container{
      min-height: 100%;
      transition: all .28s;
      margin-left: 240px;
      position: relative;
      .container-header{
        @include bg-color($color-W100,$color-C80);
        .info-header{
          height: 64px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid;
          @include bd-color(#E7E8EA,$color-W10);
          .header-left{
            display: flex;
            align-items: center;
            .left-collapse{
              cursor: pointer;
              margin-right: 30px;
              .collapse-color{
                font-size: 22px;
                @include font-color($color-C40,$color-W90);
              }
            }
            .header-breadcrumb{
              .no-redirect{
                @include font-color($color-G70,$color-W40);
                cursor: text;
              }
            }
          }
          .header-right{
            display: flex;
            align-items: center;
            .right-notice{
              height: 100%;
              padding-right: 15px;
              margin-right: 25px;
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-icon-bell{
                font-size: 18px;
                @include font-color($color-C40,$color-W80);
              }
            }
            .el-dropdown-link{
              @include font-color($color-C40,$color-W80);
              display: flex;
              align-items: center;
              cursor: pointer;
              .el-avatar {
                margin-right: 10px;
              }
              .link-name{
                font-size: 20px;
                margin-left: 10px;
              }
            }
          }
        }
      }
      .container-show{
        width: 100%;
        min-height: 100vh;
        padding: 120px 24px 0;
        @include bg-color($color-G20,$color-G100);
        position: relative;
        overflow: hidden;
      }
      .tag-show{
        padding-top: 90px;
      }
      .fixed-header{
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1600;
        width: calc(100% - 240px);
        transition: all 0.4s;
        .info-header{
          padding-right: 42px;
        }
        & + .container-show{
          height: 100vh;
          // overflow-y: hidden;
        }
      }
    }
  }
  .right-panel{
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    position: fixed;
    right: 0;
    top: 240px;
    font-size: 24px;
    background-color: rgb(24, 144, 255);
    color: #fff;
    cursor: pointer;
    border-radius: 6px 0 0 6px;
    z-index: 10;
  }
  .box-drawer{
    padding: 0 20px;
    .drawer-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      span{
        color: #72767b;
        font-size: 14px;
      }
    }
  }
  /deep/ .wrap-scroll{
    &>.el-scrollbar__wrap {
      overflow-x: hidden;
    }
    &>.is-horizontal{
      display: none;
    }
    &>.is-vertical {
      right: 0;
    }
  }
  .person-info{
    display: flex;
    .info-avatar{
      width: 120px;
      flex-shrink: 0;
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .image-avatar{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin-bottom: 20px;
      }
      .icon-avatar{
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-color: #c0c4cc;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-icon-user-solid{
          font-size: 40px;
          color: #fff;
        }
      }
    }
  }
  .index-collapse{
    .layout-container{
      margin-left: 65px;
      .fixed-header{
        width: calc(100% - 65px);
      }
    }
    /deep/ .el-menu{
      .el-submenu [class^=el-icon-], .el-menu-item [class^=el-icon-], .el-submenu [class^=mio-], .el-menu-item [class^=mio-]{
        margin-right: 22px;
      }
      .el-icon-arrow-right{
        display: none;
      }
    }
  }
  .notice-clear{
    padding: 0 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .clear-all{
      color: rgba(96,98,102,.5);
      cursor: pointer;
      &:hover{
        color: rgba(96,98,102,.9);
      }
    }
  }
  .notice-list{
    padding: 40px 20px;
    border-bottom: 1px solid #E4E7ED;
    cursor: pointer;
    position: relative;
    &>p{
      margin-bottom: 20px;
      font-size: 16px;
    }
    .box-info{
      span{
        font-size: 16px;
        color: rgba(96,98,102,.9);
      }
      .info-operate{
        color: #207DC2;
      }
    }
    .clear-single{
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 18px;
      color: rgba(96,98,102,.5);
      display: none;
    }
    &:hover{
      background-color: $color-D10;
    }
    &:hover .clear-single{
      display: block;
    }
  }
  .notice-read{
    &>p{
      color: rgba(96,98,102,.5);
    }
    .box-info{
      span{
        color: rgba(96,98,102,.5);
      }
      .info-operate{
        color: rgba(96,98,102,.5);
      }
    }
  }
</style>