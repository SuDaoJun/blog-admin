<template>
  <div class='wrapper'>
    <h2 class='content-title'>留言列表</h2>
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
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
      },
      searchForm: {
        labelWidth: '70px',
        ref: 'searchRef',
        inline: true,
        marginRight: '30px',
        formItemList: [
          {
            type: "date",
            dateType: 'daterange',
            prop: "createTime",
            width: '300px',
            label: "留言时间",
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
          createTime: []
        }
      },
      tableData: {
        ref: 'table',
        dataList: [],
        columns: [
          {
            prop: 'name',
            sortable: 'custom',
            label: '留言用户',
            render: (h,params)=>{
              let userName = params.row.createUser?params.row.createUser.name:'--'
              return h('div',userName)
            }
          },
          {
            prop: 'content',
            label: '留言内容',
            showTooltip: true
          },
          {
            prop: 'createTime',
            sortable: true,
            label: '留言时间'
          },
          {
            prop: 'status',
            sortable: true,
            label: '留言状态',
            render: (h,params)=>{
              let status = params.row.status
              return h('span', {
                style: {
                  color: status === '1'?'#02BB00':'#909399'
                }
              },status === '1'?'启用':'禁用')
            }
          },
          {
            prop: 'operate',
            align: 'center',
            hide: true,
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
                      display: this.authList.includes('5e834fc4fb69305aa091e834')?'block':'none'
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
                      display: this.authList.includes('5e834fc4fb69305aa091e834')?'block':'none'
                    },
                    on: {
                      click: () => {
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
                      display: this.authList.includes('5e834fcbfb69305aa091e835')?'block':'none'
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
      }
    }
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e834fbdfb69305aa091e833')
    this.tableData.columns[4].hide = !this.authList.includes('5e834fc4fb69305aa091e834') && !this.authList.includes('5e834fcbfb69305aa091e835')
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据列表查询
    getDataList(page){
      let pageObj = this.pageObj
      pageObj.currentPage = page === true?pageObj.currentPage:1;
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      this.$api.message.messageList({
        currentPage: pageObj.currentPage,
        pageSize: pageObj.pageSize,
        createTime: formModel.createTime?formModel.createTime.join(','):null,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取项目列表失败');
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
        this.searchForm.formModel.startTime = time
      }else{
        this.searchForm.formModel.startTime = null
      }
      this.getDataList()
    },
    dataAdd(){
      this.$prompt('请输入留言内容', '新增留言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '留言内容',
        inputValidator: (val)=>{
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '留言内容不为空'
      }).then(({ value }) => {
        this.$api.message.messageAdd({
          content: value,
          status: '1'
        }).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.getDataList()
          }else{
            this.$message.warning('新增留言失败');
          }
        })
      }).catch(() => {      
      })
    },
    editData(params){
      this.$prompt('请编辑留言内容', '编辑留言', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '留言内容',
        inputValue: params.row.content,
        inputValidator: (val)=>{
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '留言内容不为空'
      }).then(({ value }) => {
        this.$api.message.messageUpdate({
          id: params.row._id,
          content: value
        }).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.getDataList()
          }else{
            this.$message.warning('编辑留言失败');
          }
        })
      }).catch(() => {      
      })
    },
    statusChange(params){
      let status = params.row.status
      let title = status === '1'?'是否确定禁用该留言？':'是否确定启用该留言？'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.message.messageUpdate({
          id: params.row._id,
          status: status === '1'?'0':'1'
        }).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            params.row.status = res.data.status
          }else{
            this.$message.warning('留言状态修改失败');
          }
        })
      }).catch(() => {})
    },
    dataDel(params){
      this.$confirm('此操作将删除该留言, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.message.messageDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('留言删除成功');
          }else{
            this.$message.warning('留言删除失败');
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