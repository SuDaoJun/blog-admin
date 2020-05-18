<template>
  <div class='wrapper'>
    <h2 class='content-title'>用户列表</h2>
    <div class="box-table">
      <my-form
        :ref='searchForm.ref'
        :formConfig="searchForm"
      >
      <div class="export-user" slot='exportUser' v-if='authList.includes("5e99c8a9d1ba729a78b016c1")'>
        <el-button type="primary" @click.native='allExport'>导出所有</el-button>
        <el-button style='margin-left: 40px;' :type="selectData.length === 0?'info':'primary'" @click='exportData'>导出数据</el-button>
      </div>
      </my-form>
      <el-alert
        v-show='selectData.length > 0'
        type="warning"
         close-text="清除所选"
         @close="clearAlert">
        <div slot='title' class='alert-title'>
          <i class='el-icon-info'></i>
          <span>已选择{{selectData.length}}项</span>
        </div>
      </el-alert>
      <my-table 
        :tableData="tableData"
        :ref='tableData.ref'
        :pageObj='pageObj'
        @sortChange='sortChange'
        @selectChange='selectChange'
        @pageChange='pageChange'
      ></my-table>
    </div>
    <el-dialog :title="dialogBox.isEdit?'编辑用户':'新增用户'" :visible.sync="dialogBox.boxShow" width='640px' @keyup.enter.native="confirSubmit">
      <my-form
        :ref='userForm.ref'
        :formConfig="userForm"
      ></my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.wrapper{
  /deep/ input:-webkit-autofill{
    -webkit-text-fill-color: #606266 !important;
    box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    color: "#606266" !important;
    transition: background-color 500000s ease-in-out 0s;
  }
  .alert-title{
    display: flex;
    align-items: center;
    span{
      margin-left: 10px;
    }
  }
}
</style>

<script>
import MyTable from '@/components/MyTable'
import MyForm from '@/components/MyForm'
import Format from "@/utils/format.js"
import exportExcel from '@/utils/excel'
export default {
  data() {
    const validatePwdChecks = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error('请输入确认密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('确认密码字符长度为6-16个字符'));
      } else if (value != this.userForm.formModel.password) {
        callback(new Error('确认密码和密码不一致'));
      } else {
        callback();
      }
    }
    return {
      selectData: [],
      sortObj: {
        sortBy: null,
        sortOrders: null
      },
      dialogBox: {
        boxShow: false,
        isEdit: false,
        detailItem: {}
      },
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
      },
      tableData: {
        ref: 'table',
        selection: true,
        reserveSelection: true,
        dataList: [],
        columns: [
          {
            prop: 'name',
            sortable: 'custom',
            label: '用户名'
          },
          {
            prop: 'email',
            label: '邮箱'
          },
          {
            prop: 'phone',
            label: '手机号码'
          },
          {
            prop: 'roleId',
            sortable: 'custom',
            label: '角色类型',
            render: (h, params)=>{
              let roleType = params.row.roleId?params.row.roleId.name:'--'
              return h('div',roleType)
            }
          },
          {
            prop: 'createTime',
            sortable: true,
            label: '创建时间',
            render: (h, params)=>{
              let time = params.row.createTime.split(' ')[0]
              return h('div',time)
            }
          },
          {
            prop: 'status',
            sortable: true,
            label: '状态',
            render: (h, params)=>{
              let status = params.row.status
              return h('span', {
                style: {
                  color: status === '1'?'#02BB00':'#F56C6C'
                }
              },status === '1'?'启用':'禁用')
            }
          },
          {
            prop: 'operate',
            align: 'center',
            width: 260,
            label: '操作',
            render: (h, params) => {
              let status = params.row.status == '1'?true:false
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
                      type: status?'info':'success',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e835039fb69305aa091e838')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.statusChange(params);
                      }
                    }
                  }, status?'禁用':'启用'),
                  h('el-button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e835039fb69305aa091e838')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.dialogBox.detailItem = params.row;
                        this.editData(params);
                      }
                    }
                  }, '编辑'),
                  h('el-button', {
                    props: {
                      type: 'danger',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e83503ffb69305aa091e839')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.dataDel(params)
                      }
                    }
                  }, '删除')
                ]);
            }
          }
        ]
      },
      searchForm: {
        labelWidth: '70px',
        ref: 'searchRef',
        inline: true,
        marginRight: '50px',
        slot: 'exportUser',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '180px',
            label: "用户名",
            placeholder: "请输入用户名"
          },
          {
            type: "text",
            prop: "phone",
            width: '180px',
            label: "手机号码",
            placeholder: "请输入手机号码"
          }
        ],
        operate: [
          {
            name: '查询',
            handleClick: this.getDataList
          },
          {
            name: '新增',
            marginLeft: '40px',
            hide: false,
            handleClick: this.dataAdd
          },
          {
            name: '重置',
            type: "transparent",
             marginLeft: '40px',
            handleClick: this.resetForm
          }
        ],
        formModel: {
          name: '',
          phone: ''
        }
      },
      userForm: {
        labelWidth: '80px',
        ref: 'userRef',
        labelPosition: 'right',
        marginRight: '10px',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '450px',
            label: "用户名",
            placeholder: "请输入用户名"
          },
          {
            type: "password",
            prop: "password",
            width: '450px',
            hide: false,
            label: "密码",
            placeholder: "请输入密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            width: '450px',
            hide: false,
            label: "确认密码",
            placeholder: "请确认密码"
          },
          {
            type: "text",
            prop: "email",
            width: '450px',
            label: "邮箱",
            placeholder: "请输入邮箱"
          },
          {
            type: "text",
            prop: "phone",
            width: '450px',
            label: "手机号码",
            placeholder: "请输入手机号码"
          }

        ],
        formModel: {
          name: '',
          password: '',
          confirPwd: '',
          email: '',
          phone: ''
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('用户名').NoEmpty, trigger: 'blur' }
          ],
          password: [
            { required: true, validator: Format.FormValidate.Form('密码').Password, trigger: 'blur' }
          ],
          confirPwd: [
            { required: true, validator: validatePwdChecks, trigger: 'blur' }
          ],
          email: [
            { required: true, validator: Format.FormValidate.Form('邮箱').Email, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: Format.FormValidate.Form('手机').Phone, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    this.searchForm.operate[1].hide = !this.authList.includes('5e7e06a80849b708d414da01')
    this.tableData.selection = this.authList.includes('5e99c8a9d1ba729a78b016c1')
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据列表查询
    getDataList(page){
      this.pageObj.currentPage = page === true?this.pageObj.currentPage:1;
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      this.$api.user.userList({
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        name: formModel.name,
        phone: formModel.phone,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取用户列表失败');
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
      if(this.$refs['userRef']){
        this.$refs['userRef'].$refs['userRef'].resetFields();
      }
      this.userForm.formItemList[1].hide = false
      this.userForm.formItemList[2].hide = false
      this.dialogBox.isEdit = false;
      this.dialogBox.boxShow = true; 
    },
    //编辑数据表单赋值
    editData(params){
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(() => {
        if(this.$refs['userRef']){
          this.$refs['userRef'].$refs['userRef'].resetFields();
        }
        this.userForm.formItemList[1].hide = true
        this.userForm.formItemList[2].hide = true
        this.userForm.formModel = {
          name: params.row.name,
          email: params.row.email,
          phone: params.row.phone
        }
      })
    },
    // 新增或编辑数据
    confirSubmit(){
      this.$refs['userRef'].$refs['userRef'].validate((valid) => {
        let dialogBox = this.dialogBox;
        let formModel = this.userForm.formModel;
        if (valid) {
          if(dialogBox.isEdit){
            this.$api.user.userUpdate({
              id: dialogBox.detailItem._id,
              name: formModel.name,
              phone: formModel.phone,
              email: formModel.email,
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('用户名已存在');
                formModel.name = ''
              }else if(code === this.$constant.statusFail){
                this.$message.warning('邮箱已存在');
                formModel.email = ''
              }else{
                this.$message.warning('用户信息更新失败');
              }
            })
          }else{
            this.$api.user.userAdd({
              name: formModel.name,
              password: formModel.password,
              phone: formModel.phone,
              email: formModel.email,
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('用户名已存在');
                formModel.name = ''
              }else if(code === this.$constant.statusFail){
                this.$message.warning('邮箱已存在');
                formModel.email = ''
              }else{
                this.$message.warning('用户信息添加失败');
              }
            })
          }
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    dataDel(params){
      this.$confirm('此操作将删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.userDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
          }else{
            this.$message.warning('用户删除失败');
          }
        })
      }).catch(() => {})
    },
    selectChange(data){
      this.selectData = data
    },
    allExport(){
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      if(this.pageObj.total > 0){
        this.$confirm(`是否确认操作所有数据，数据总共${this.pageObj.total}条`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.user.userList({
            currentPage: '1',
            pageSize: '999',
            name: formModel.name,
            phone: formModel.phone,
            sortBy,
            sortOrders
          }).then(res =>{
            let code = res.code
            if(code === this.$constant.reqSuccess){
              let dataArr = res.data.data
              this.exportArr(dataArr)
            }
          })
        }).catch(() => {})
      }else{
        this.$message.warning('导出用户数据为空')
      }
    },
    exportData(){
      if(this.selectData.length > 0){
        this.exportArr(this.selectData)
      }else{
        this.$message.warning('请先选择导出用户数据')
      }
    },
    exportArr(data){
      data.forEach(item=>{
        item.roleName = item.roleId?item.roleId.name:'--'
        item.userStatus = item.status==='1'?'启用':'禁用'
      })
      const params = {
        title: ['用户名','邮箱',"手机号", "角色类型", "创建时间", "用户状态"],
        key: ['name', 'email',"phone", "roleName", "createTime", "userStatus"],
        data,
        autoWidth: true,
        filename: 'userList'
      }  
      exportExcel.export_array_to_excel(params)
      this.clearAlert()
    },
    clearAlert(){
      this.selectData = []
      this.$refs['table'].$refs['table'].clearSelection()
    },
    // 状态
    statusChange(params){
      let status = params.row.status
      let title = status === '1'?'是否确定禁用该用户？':'是否确定启用该用户？'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.userUpdate({
          id: params.row._id,
          status: status === '1'?'0':'1'
        }).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            params.row.status = res.data.status
          }else{
            this.$message.warning('用户状态修改失败');
          }
        })
      }).catch(() => {})
    },
    resetForm(){
      if(this.$refs['searchRef']){
        this.$refs['searchRef'].$refs['searchRef'].resetFields();
      }
      this.getDataList()
    },
    // 分页页数改变
    pageChange(page){
      this.pageObj.currentPage = page;
      this.getDataList(true);
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