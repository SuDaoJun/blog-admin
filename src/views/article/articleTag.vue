<template>
  <div class='wrapper'>
    <h2 class='content-title'>文章标签</h2>
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
    <el-dialog :title="dialogBox.isEdit?'编辑标签':'新增标签'" :visible.sync="dialogBox.boxShow" width='640px' @keyup.enter.native="confirSubmit">
      <my-form
        :ref='tagForm.ref'
        :formConfig="tagForm"
      >
      <el-color-picker slot='color' v-model="tagForm.formModel.bgColor"></el-color-picker>
      </my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
import MyTable from '@/components/MyTable'
import MyForm from '@/components/MyForm'
import Format from "@/utils/format.js"
export default {
  data() {
    return {
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
        dataList: [],
        columns: [
          {
            prop: 'name',
            sortable: 'custom',
            label: '标签名称'
          },
          {
            prop: 'description',
            label: '标签描述',
            showTooltip: true
          },
          {
            prop: 'bgColor',
            label: '标签背景色',
            render: (h, params)=>{
              return h('div',{
                style: {
                  width: '120px',
                  height: '20px',
                  margin: '0 auto',
                  background: params.row.bgColor
                }
              })
            }
          },
          {
            prop: 'createUser',
            sortable: true,
            label: '创建用户',
            render: (h,params)=>{
              let userName = params.row.createUser?params.row.createUser.name:'--'
              return h('div',userName)
            }
          },
          {
            prop: 'createTime',
            sortable: true,
            label: '创建时间',
          },
          {
            prop: 'operate',
            align: 'center',
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
                      display: this.authList.includes('5e834f5afb69305aa091e828')?'block':'none'
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
                      display: this.authList.includes('5e834f61fb69305aa091e829')?'block':'none'
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
        marginRight: '30px',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '180px',
            label: "标签名称",
            placeholder: "请输入标签名称",
            blur: this.getDataList
          },
          {
            type: "date",
            dateType: 'daterange',
            prop: "createTime",
            width: '300px',
            label: "创建时间",
            change: this.timeChange
          }
        ],
        operate: [
          {
            name: '新增',
            hide: false,
            handleClick: this.dataAdd
          }
        ],
        formModel: {
          name: '',
          createTime: []
        }
      },
      tagForm: {
        labelWidth: '100px',
        ref: 'tagRef',
        labelPosition: 'right',
        marginRight: '10px',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '450px',
            label: "标签名称",
            placeholder: "请输入标签名称"
          },
          {
            type: "text",
            prop: "description",
            width: '450px',
            label: "标签描述",
            placeholder: "请输入标签描述"
          },
          {
            slot: "color",
            prop: "bgColor",
            width: '450px',
            label: "标签背景色"
          }
        ],
        formModel: {
          name: '',
          description: '',
          bgColor: '#409EFF'
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('标签名称').NoEmpty, trigger: 'blur' }
          ],
          bgColor: [
            { required: true, validator: Format.FormValidate.Form('标签背景色').TypeSelect, trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e834f51fb69305aa091e827')
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
      this.$api.article.tagList({
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        name: formModel.name,
        createTime: formModel.createTime?formModel.createTime.join(','):null,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取标签列表失败');
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
    timeChange(time){
      if(time){
        this.searchForm.formModel.createTime = time
      }else{
        this.searchForm.formModel.createTime = null
      }
      this.getDataList()
    },
    dataAdd(){
      if(this.$refs['tagRef']){
        this.$refs['tagRef'].$refs['tagRef'].resetFields();
      }
      this.dialogBox.isEdit = false;
      this.dialogBox.boxShow = true; 
    },
    //编辑数据表单赋值
    editData(params){
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(() => {
        if(this.$refs['tagRef']){
          this.$refs['tagRef'].$refs['tagRef'].resetFields();
        }
        this.tagForm.formModel = {
          name: params.row.name,
          description: params.row.description,
          bgColor: params.row.bgColor
        }
      })
    },
    // 新增或编辑数据
    confirSubmit(){
      this.$refs['tagRef'].$refs['tagRef'].validate((valid) => {
        let dialogBox = this.dialogBox;
        let formModel = this.tagForm.formModel;
        if (valid) {
          if(dialogBox.isEdit){
            this.$api.article.tagUpdate({
              id: dialogBox.detailItem._id,
              name: formModel.name,
              description: formModel.description,
              bgColor: formModel.bgColor
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
                this.$message.success('标签信息更新成功');
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('标签名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('标签信息更新失败');
              }
            })
          }else{
            this.$api.article.tagAdd({
              name: formModel.name,
              description: formModel.description,
              bgColor: formModel.bgColor
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
                this.$message.success('标签信息添加成功');
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('标签名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('标签信息添加失败');
              }
            })
          }
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    dataDel(params){
      this.$confirm('此操作将删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.tagDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('标签删除成功');
          }else{
            this.$message.warning('标签删除失败');
          }
        })
      }).catch(() => {})
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