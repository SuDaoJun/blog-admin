<template>
  <div class='wrapper'>
    <h2 class='content-title'>角色列表</h2>
    <div class="box-table">
      <my-form
        :ref='searchForm.ref'
        :formConfig="searchForm"
      ></my-form>
      <my-table 
        :tableData="tableData" 
        :pageObj='pageObj'
        @sortChange='sortChange'
        @pageChange='pageChange'
      ></my-table>
    </div>
    <el-dialog :title="dialogBox.isEdit?'编辑角色':'新增角色'" :visible.sync="dialogBox.boxShow" width='640px' @keyup.enter.native="confirSubmit">
      <my-form
        :ref='roleForm.ref'
        :formConfig="roleForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click.native="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="权限配置" :visible.sync="authBox.boxShow" width='640px' custom-class='tree-dialog'>
      <el-tree
        ref='tree'
        :data="treeData"
        node-key="_id"
        :props="treeProps"
        default-expand-all
        show-checkbox
        >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="authBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click.native="setAuth">配 置</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="userBox.type === '1'?'移除用户':'导入用户'" :visible.sync="userBox.boxShow" width='840px'>
      <div class="table-header">
        <el-input clearable placeholder="输入用户名搜索" v-model="userBox.selectName" style='width: 280px'>
          <el-button @click.native='getUser' slot="append" type="info" icon="el-icon-search"></el-button>
        </el-input>
        <el-button :type="userBox.selectData.length === 0?'info':'primary'" @click.native="userOperate">{{userBox.type === '1'?'移除用户':'导入用户'}}</el-button>
      </div>
      <el-alert
        v-show='userBox.selectData.length > 0'
        type="warning"
         close-text="清除所选"
         @close="clearAlert">
        <div slot='title' class='alert-list'>
          <el-tag
            v-for="tag in userBox.selectData"
            :key="tag._id"
            size='small'
            style='margin-right: 20px;'
            closable
            @close='selectRemove(tag)'
            type="success">
            {{tag.name}}
          </el-tag>
        </div>
      </el-alert>
      <my-table
        :ref='userTable.ref'
        :tableData="userTable" 
        :pageObj='tablePage'
        class='user-table'
        @pageChange='tablePageChange'
        @selectChange='selectChange'
      >
      </my-table>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
/deep/ .tree-dialog{
  .el-tree{
    .el-tree-node {
      margin-top: 5px;
    }
    .el-tree-node__label{
      margin-left: 10px;
      font-size: 16px;
    }
  }
}
.table-header{
  margin-bottom: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-group{
  margin-left: 20px;
}
// .user-table{
//   /deep/ .el-table__header-wrapper{
//     .el-checkbox{
//       display: none;
//     }
//   }
// }
</style>

<script>
import MyTable from '@/components/MyTable'
import MyForm from '@/components/MyForm'
import Format from "@/utils/format.js"
export default {
  data() {
    return {
      treeData: [],
      treeProps: {
        value:'_id',
        label: 'title',
        children: 'children'
      },
      sortObj: {
        sortBy: null,
        sortOrders: null
      },
      dialogBox: {
        boxShow: false,
        isEdit: false,
        detailItem: {}
      },
      authBox: {
        boxShow: false,
        detailItem: {}
      },
      userBox: {
        boxShow: false,
        type: '1',
        selectName: '',
        detailItem: {},
        selectData: []
      },
      tablePage: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      userTable: {
        ref: 'userTable',
        slot: 'userOperate',
        selection: true,
        reserveSelection: true,
        dataList: [],
        columns: [
          {
            prop: 'name',
            label: '用户名'
          },
          {
            prop: 'email',
            label: '邮箱'
          },
          {
            prop: 'phone',
            label: '手机号码'
          }
        ]
      },
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
      },
      tableData: {
        ref: 'table',
        dataList: [],
        columns: [
          {
            prop: 'name',
            sortable: 'custom',
            label: '角色名称'
          },
          {
            prop: 'description',
            showTooltip: true,
            label: '角色描述'
          },
          {
            prop: 'operate',
            align: 'center',
            width: 600,
            hide: true,
            label: '操作',
            render: (h, params) => {
              return h('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }
                },
                [
                  h('el-button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e835067fb69305aa091e83b')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.dialogBox.detailItem = params.row
                        this.editData(params)
                      }
                    }
                  }, '编辑'),
                  h('el-button', {
                    props: {
                      type: 'danger',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e83506dfb69305aa091e83c')?'block':'none'
                    },
                    on: {
                      click: () => {
                        if(params.row.type === "4"){
                          this.dataDel(params)
                        }else{
                          this.$message.warning('该角色暂不支持删除')
                        }
                      }
                    }
                  }, '删除'),
                  h('el-button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e99cb85d1ba729a78b016c2')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.authBox.detailItem = params.row
                        this.authBox.boxShow = true
                        this.$nextTick(() => {
                          this.$refs.tree.setCheckedKeys(params.row.functionList)
                        })
                      }
                    }
                  }, '权限分配'),
                  h('el-button', {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e99cb85d1ba729a78b016c2')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.roleUser('0',params.row)
                      }
                    }
                  }, '导入用户'),
                  h('el-button', {
                    props: {
                      type: 'info',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e99cb85d1ba729a78b016c2')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.roleUser('1',params.row)
                      }
                    }
                  }, '移除用户')
                ])
            }
          }
        ]
      },
      searchForm: {
        labelWidth: '70px',
        ref: 'searchRef',
        inline: true,
        marginRight: '40px',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '260px',
            label: "角色名称",
            placeholder: "请输入角色名称",
            blur: this.getDataList
          }
        ],
        operate: [
          {
            name: '新增角色',
            hide: false,
            handleClick: this.dataAdd
          }
        ],
        formModel: {
          name: ''
        }
      },
      roleForm: {
        labelWidth: '80px',
        ref: 'roleRef',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '450px',
            label: "角色名称",
            placeholder: "请输入角色名称"
          },
          {
            type: "text",
            prop: "description",
            width: '450px',
            label: "角色描述",
            placeholder: "请输入角色描述"
          }
        ],
        formModel: {
          name: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('角色名称').NoEmpty, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e83505dfb69305aa091e83a')
    this.tableData.columns[2].hide = !this.authList.includes('5e835067fb69305aa091e83b') && !this.authList.includes('5e83506dfb69305aa091e83c') && !this.authList.includes('5e99cb85d1ba729a78b016c2')
  },
  mounted() {
    this.getDataList()
    this.getTreeList()
  },
  methods: {
    // 数据列表查询
    getDataList(page){
      this.pageObj.currentPage = page === true?this.pageObj.currentPage:1;
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      this.$api.role.roleList({
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        name: formModel.name,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取角色列表失败');
        }
      })
    },
    getTreeList(){
      this.$api.menu.menuTree().then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          let treeList = res.data
          if(treeList.length > 0){
            this.functionChildList(treeList)
          }
          this.treeData = treeList
        }else{
          this.$message.warning('获取权限列表失败');
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
    sortChange(data){
      if(data.order){
        this.sortObj = {
          sortBy: data.prop,
          sortOrders: data.order
        }
      }else{
        this.sortObj = {
          sortBy: null,
          sortOrders: null
        }
      }
      this.getDataList()
    },
    dataAdd(){
      if(this.$refs['roleRef']){
        this.$refs['roleRef'].$refs['roleRef'].resetFields();
      }
      this.dialogBox.isEdit = false;
      this.dialogBox.boxShow = true; 
    },
    //编辑数据表单赋值
    editData(params){
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(() => {
        if(this.$refs['roleRef']){
          this.$refs['roleRef'].$refs['roleRef'].resetFields();
        }
        this.roleForm.formModel = {
          name: params.row.name,
          description: params.row.description
        }
      })
    },
    // 新增或编辑数据
    confirSubmit(){
      this.$refs['roleRef'].$refs['roleRef'].validate((valid) => {
        let dialogBox = this.dialogBox;
        let formModel = this.roleForm.formModel;
        if (valid) {
          if(dialogBox.isEdit){
            this.$api.role.roleUpdate({
              id: dialogBox.detailItem._id,
              name: formModel.name,
              description: formModel.description
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('角色名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('角色信息更新失败');
              }
            })
          }else{
            this.$api.role.roleAdd({
              name: formModel.name,
              description: formModel.description
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('角色名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('角色信息添加失败');
              }
            })
          }
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    setAuth(){
      let authBox = this.authBox
      let checkArr = this.$refs.tree.getCheckedNodes()
      let halfArr = this.$refs.tree.getHalfCheckedNodes()
      let concatArr = [...checkArr, ...halfArr]
      let functionList = []
      let menuList = []
      if(concatArr.length > 0){
        concatArr.forEach(item=>{
          if(item.menuId){
            functionList.push(item._id)
          }else{
            menuList.push(item._id)
          }
        })
      }
      this.$api.role.setRoleAuth({
        id: authBox.detailItem._id,
        functionList: functionList.length > 0?functionList.join(','):'',
        menuList:menuList.length > 0?menuList.join(','):''
      }).then(res => {
        let code = res.code
        if(code === this.$constant.reqSuccess){
          authBox.boxShow = false
          this.getDataList()
          this.$message.success('角色权限配置成功')
        }else{
          this.$message.warning('角色权限配置失败')
        }
      })
    },
    roleUser(type, item){
      this.userBox.type = type
      this.userBox.detailItem = item
      this.userBox.selectName = ''
      this.userBox.selectData = []
      if(this.$refs['userTable']){
        this.$refs['userTable'].$refs['userTable'].clearSelection()
      }
      this.getUser()
    },
    getUser(page){
      let {tablePage,userBox} = this
      tablePage.currentPage = page === true?tablePage.currentPage:1
      this.$api.role.roleUserList({
        currentPage: tablePage.currentPage,
        pageSize: tablePage.pageSize,
        roleId: userBox.detailItem._id,
        type: userBox.type,
        name: userBox.selectName
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          tablePage.total = res.data.count;
          this.userTable.dataList = res.data.data;
          this.userBox.boxShow = true
        }else{
          this.$message.warning('获取用户列表失败')
        }
      })
    },
    selectChange(data){
      this.userBox.selectData = data
    },
    selectRemove(item){
      this.$nextTick(()=>{
        this.$refs['userTable'].$refs['userTable'].toggleRowSelection(item,false)
      })
    },
    // 导入用户或移除用户确认
    userOperate(){
      let {userBox} = this
      if(userBox.selectData.length > 0){
        let successTxt = '导入用户成功'
        let failTxt = '导入用户失败'
        if(userBox.type === '1'){
          successTxt = '移除用户成功'
          failTxt = '移除用户失败'
        }
        let ids = []
        userBox.selectData.forEach((item)=>{
          ids.push(item._id)
        })
        this.$api.role.updateMuchUser({
          roleId: userBox.detailItem._id,
          type: userBox.type,
          ids: ids.join(',')
        }).then(res => {
          let code = res.code
          if(code === this.$constant.reqSuccess){
            userBox.boxShow = false
            this.$message.success(successTxt)
          }else if(code === this.$constant.statusFail){
            this.$message.warning('选择用户不存在');
          }else{
            this.$message.warning(failTxt);
          }
        })
      }else{
        this.$message.warning('请至少选择一个用户')
      }
    },
    dataDel(params){
      this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.role.roleDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList()
          }else if(code === this.$constant.statusFail){
            this.$message.warning('该角色不支持删除');
          }else{
            this.$message.warning('角色删除失败');
          }
        })
      }).catch(() => {})
    },
    clearAlert(){
      this.userBox.selectData = []
      this.$refs['userTable'].$refs['userTable'].clearSelection()
    },
    // 分页页数改变
    pageChange(page){
      this.pageObj.currentPage = page
      this.getDataList(true)
    },
    tablePageChange(page){
      this.tablePage.currentPage = page
      this.getUser(true)
    }
  },
  components: {
    MyTable,
    MyForm
  },
  computed: {
    authList(){
      return this.$store.getters.getAuthList
    }
  }
}
</script>