<template>
  <div class='wrapper'>
    <h2 class='content-title'>菜单列表</h2>
    <div class="box-table">
      <div class="list-filter">
        <el-input
          placeholder="输入关键字进行过滤"
          clearable
          class="filter-text"
          v-model="filterText">
        </el-input>
        <el-button type="primary" v-if='authList.includes("5e99c25ad1ba729a78b016bc")' @click.native="dataAdd('menu')">新增菜单</el-button>
      </div>
      <div class="list-header">
        <div class="header-title">名称</div>
        <div class="header-title">类别</div>
        <div class="header-title">操作</div>
      </div>
      <div class="list-tree">
        <el-tree ref="tree" :default-expanded-keys='defaultKey' highlight-current	 node-key="_id" :data="treeData" :filter-node-method="filterNode">
          <div class="tree-node" slot-scope="{ node, data }">
            <div class="node-title">
              <i :class='data.menuId?"el-icon-setting":"mio-icon-icon_caidan iconfont"'></i>
              <span>{{data.title}}</span>
            </div>
            <div class="node-box">
              {{data.menuId?"功能":"菜单"}}
            </div>
            <div class="node-box">
              <div class="box-btn" v-if='authList.includes("5e99c280d1ba729a78b016bd") && data.parentId != "0"' @click.stop='editData(data)'>编辑</div>
              <div class="box-btn btn-del" v-if='authList.includes("5e99c287d1ba729a78b016be") && data.parentId != "0"' @click.stop='dataDel(data)'>删除</div>
              <div class="box-btn btn-add" @click.stop='dataAdd(data)'  v-if='((!data.children && !data.menuId) || (data.functionList && data.functionList.length) > 0) && authList.includes("5e99c25ad1ba729a78b016bc")'>新增功能</div>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
    <el-dialog :title="dialogBox.boxTitle" :visible.sync="dialogBox.boxShow" width='550px' @keyup.enter.native="confirSubmit">
      <my-form
        :ref='menuForm.ref'
        :formConfig="menuForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.box-table{
  .list-filter{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .filter-text{
      width: 320px;
      margin-right: 40px;
    }
  }
  .list-header{
    width: 100%;
    height: 40px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #C0C4CC;
    .header-title{
      font-size: 16px;
      width: 260px;
      &:first-child{
        flex: 1;
      }
    }
  }
  /deep/ .list-tree{
    max-height: 550px;
    height: 550px;
    padding: 24px 0 0 20px;
    overflow-y: auto;
    .el-tree-node__content{
      height: 35px;
      line-height: 35px;
    }
    .el-tree--highlight-current{
      .el-tree-node.is-current{
        &>.el-tree-node__content{
          background-color: #c2ddf2;
        }
      }
    }
    .tree-node{
      width: 100%;
      display: flex;
      align-items: center;
      .node-title{
        flex: 1;
        span{
          font-size: 16px;
        }
      }
      .node-box{
        font-size: 16px;
        width: 260px;
        display: flex;
        align-items: center;
        .box-btn{
          color: #409EFF;
          cursor: pointer;
        }
        .btn-del{
          color: #F56C6C;
          margin: 0 40px;
        }
        .btn-add{
          color: #e6a23c;
        }
      }
    }
  }
}
</style>

<script>
import MyTable from '@/components/MyTable'
import MyForm from '@/components/MyForm'
import Format from "@/utils/format.js"
export default {
  data() {
    return {
      filterText: '',
      treeData: [],
      treeMenu: [],
      defaultKey: [],
      dialogBox: {
        boxShow: false,
        boxTitle: '',
        operType: '',
        detailItem: {}
      },
      menuForm: {
        labelWidth: '80px',
        ref: 'menuRef',
        labelPosition: 'right',
        marginRight: '10px',
        formItemList: [
          {
            type: "text",
            prop: "title",
            width: '350px',
            label: "标题",
            placeholder: "请输入标题"
          },
          {
            type: "treeSelect",
            label: "上级菜单",
            props: {
              value:'_id',
              label: 'title',
              children: 'children'
            },
            value: '',
            disabled: false,
            treeData: [],
            getValue: this.getValue
          },
          {
            type: "text",
            prop: "description",
            width: '350px',
            label: "描述",
            placeholder: "请输入描述"
          }
        ],
        formModel: {
          title: '',
          description: ''
        },
        rules: {
          title: [
            { required: true, validator: Format.FormValidate.Form('菜单标题').NoEmpty, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {

  },
  mounted() {
    this.getTreeList()
  },
  methods: {
    getTreeList(){
      this.$api.menu.menuTree().then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let treeList = res.data
          this.treeMenu = JSON.parse(JSON.stringify(res.data))
          if(treeList.length > 0){
            this.functionChildList(treeList)
            this.defaultKey.push(treeList[0]._id)
          }
          this.treeData = treeList
          this.menuForm.formItemList[1].treeData = this.treeMenu
        }else{
          this.$message.warning('获取菜单列表失败');
        }
      })
    },
    functionChildList(treeList){
      treeList.forEach((item)=>{
        if(item.functionList && item.functionList.length > 0){
          item.children = item.functionList
        }else{
          if(item.children && item.children.length > 0){
            this.functionChildList(item.children)
          }
        }
      })
    },
    dataAdd(data){
      if(this.$refs['menuRef']){
        this.$refs['menuRef'].$refs['menuRef'].resetFields()
      }
      if(data === 'menu'){
        this.menuForm.formItemList[1].value = ''
        this.menuForm.formItemList[1].disabled = false
        this.dialogBox.operType = 'addMenu'
        this.dialogBox.boxTitle = '新增菜单'
      }else{
        this.menuForm.formItemList[1].value = data._id
        this.menuForm.formItemList[1].disabled = true
        this.dialogBox.operType = 'addFunction'
        this.dialogBox.boxTitle = '新增功能'
      }
      this.dialogBox.boxShow = true;
    },
    // 筛选树节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1;
    },
    //编辑数据表单赋值
    editData(data){
      if(data.menuId){
        this.dialogBox.boxShow = true;
        this.$nextTick(() => {
          if(this.$refs['menuRef']){
            this.$refs['menuRef'].$refs['menuRef'].resetFields()
          }
          this.menuForm.formItemList[1].value = data.menuId
          this.menuForm.formItemList[1].disabled = false
          this.dialogBox.detailItem = data
          this.dialogBox.operType = 'editFunction'
          this.dialogBox.boxTitle = '编辑功能'
          this.menuForm.formModel = {
            title: data.title,
            description: data.description
          }
        })
      }else{
        this.dialogBox.boxShow = true;
        this.$nextTick(() => {
          if(this.$refs['menuRef']){
            this.$refs['menuRef'].$refs['menuRef'].resetFields()
          }
          this.menuForm.formItemList[1].value = data.parentId
          this.menuForm.formItemList[1].disabled = false
          this.dialogBox.detailItem = data
          this.dialogBox.operType = 'editMenu'
          this.dialogBox.boxTitle = '编辑菜单'
          this.menuForm.formModel = {
            title: data.title,
            description: data.description
          }
        })
      }
    },
    // 新增或编辑数据
    confirSubmit(){
      this.$refs['menuRef'].$refs['menuRef'].validate((valid) => {
        let dialogBox = this.dialogBox;
        let formModel = this.menuForm.formModel;
        let treeValue = this.menuForm.formItemList[1].value
        if(!treeValue){
          return this.$message.warning('上级菜单不能为空')
        }
        if (valid) {
          this.defaultKey = []
          this.defaultKey.push(treeValue)
          if(dialogBox.operType === 'addMenu'){
            this.$api.menu.menuAdd({
              title: formModel.title,
              parentId: treeValue,
              description: formModel.description
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getTreeList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('菜单标题已存在');
                formModel.title = ''
              }else{
                this.$message.warning('菜单标题添加失败');
              }
            })
          }else if(dialogBox.operType === 'addFunction'){
            this.$api.menu.functionAdd({
              title: formModel.title,
              menuId: treeValue,
              description: formModel.description
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getTreeList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('功能标题已存在');
                formModel.title = ''
              }else{
                this.$message.warning('功能标题添加失败');
              }
            })
          }else if(dialogBox.operType === 'editMenu'){
            if(dialogBox.detailItem._id === treeValue){
              return this.$message.warning('上级菜单不可选本身');
            }
            this.$api.menu.menuUpdate({
              id: dialogBox.detailItem._id,
              title: formModel.title,
              parentId: treeValue,
              description: formModel.description
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getTreeList();
              }else if(code === this.$constant.statusFail){
                this.$message.warning('上级菜单不可选本身');
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('菜单标题已存在');
                formModel.title = ''
              }else{
                this.$message.warning('菜单标题更新失败');
              }
            })
          }else if(dialogBox.operType === 'editFunction'){
            this.$api.menu.functionUpdate({
              id: dialogBox.detailItem._id,
              title: formModel.title,
              menuId: treeValue,
              description: formModel.description
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getTreeList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('功能标题已存在');
                formModel.title = ''
              }else{
                this.$message.warning('功能标题更新失败');
              }
            })
          }
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    dataDel(data){
      if(data.function && data.function.length > 0){
        return this.$message.warning('该菜单存在功能列表，请先删除功能')
      }
      let typeName = data.menuId?'功能':'菜单'
      this.$confirm(`此操作将删除该${typeName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.defaultKey = []
        this.defaultKey.push(data._id)
        if(typeName === '菜单'){
          this.$api.menu.menuDel(data._id).then((res)=>{
            let code = res.code;
            if(code === this.$constant.reqSuccess){
              this.getTreeList();
            }else if(code === this.$constant.dataAlready){
              this.$message.warning('该菜单存在功能列表，请先删除功能')
            }else{
              this.$message.warning(`${typeName}删除失败`)
            }
          })
        }else{
          this.$api.menu.functionDel(data._id).then((res)=>{
            let code = res.code;
            if(code === this.$constant.reqSuccess){
              this.getTreeList();
            }else{
              this.$message.warning(`${typeName}删除失败`)
            }
          })
        }
      }).catch(() => {})
    },
    getValue(val){
      this.menuForm.formItemList[1].value = val
    }
  },
  components: {
    MyTable,
    MyForm
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    authList(){
      return this.$store.getters.getAuthList
    }
  }
}
</script>