<template>
  <div class='wrapper'>
    <h2 class='content-title'>文章列表</h2>
    <div class="box-table">
      <my-form
        :ref='searchForm.ref'
        :formConfig="searchForm"
      ></my-form>
      <el-tabs v-model="articleStatus" @tab-click="getDataList">
        <el-tab-pane v-for='item in tabList' :key='item.value' :label="item.name" :name="item.value"></el-tab-pane>
      </el-tabs>
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
      articleStatus: '1',
      tabList: [
        {
          name: '已发布',
          value: '1'
        },
        {
          name: '草稿',
          value: '0'
        }
      ],
      sortObj: {
        sortBy: null,
        sortOrders: null
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
            prop: 'title',
            sortable: 'custom',
            width: 180,
            showTooltip: true,
            label: '文章标题'
          },
          {
            prop: 'imgId',
            label: '文章封面',
            render: (h, params)=>{
              return h('el-image',{
                props: {
                  src: params.row.imgId?`${this.$baseURL}/file/down?downId=${params.row.imgId}`:'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
                  'preview-src-list': [params.row.imgId?`${this.$baseURL}/file/down?downId=${params.row.imgId}`:'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png']
                },
                style:{
                  width: '60px',
                  height: 'auto',
                  verticalAlign: 'middle',
                  borderRadius: '4px'
                }
              })
            }
          },
          {
            prop: 'createUser',
            label: '文章作者',
            render: (h, params)=>{
              let userNmae = params.row.createUser?params.row.createUser.name:'--'
              return h('span', userNmae)
            }
          },
          {
            prop: 'meta.viewTotal',
            sortable: 'custom',
            label: '浏览量',
            render: (h, params)=>{
              let viewTotal = params.row.meta.viewTotal || 0
              return h('span', viewTotal)
            }
          },
          {
            prop: 'meta.likeTotal',
            sortable: 'custom',
            label: '点赞数',
            render: (h, params)=>{
              let likeTotal = params.row.meta.likeTotal || 0
              return h('span', likeTotal)
            }
          },
          {
            prop: 'meta.commentTotal',
            sortable: 'custom',
            label: '评论数',
            render: (h, params)=>{
              let commentTotal = params.row.meta.commentTotal || 0
              return h('span', commentTotal)
            }
          },
          {
            prop: 'tags',
            width: 200,
            label: '文章标签',
            render: (h, params)=>{
              let content = []
              let tags = params.row.tags
              if(tags.length > 0){
                for(let i = 0; i < tags.length; i++){
                  content.push(
                    h('div', {
                      style: {
                        margin: '3px 10px',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '3px 10px',
                        background: tags[i].bgColor
                      }
                    }, tags[i].name)
                  )
                }
              }
              return h('div', {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }
              },content.length === 0?'--':content)
            }
          },
          {
            prop: 'createTime',
            sortable: true,
            label: '创建时间',
            render: (h, params) => {
              let time = params.row.createTime?params.row.createTime.split(' ')[0]:'--'
              return h('div',time)
            }
          },
          {
            prop: 'operate',
            align: 'center',
            label: '操作',
            width: 300,
            render: (h, params) => {
              let articleStatus = this.articleStatus === '1'?true:false
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
                    type: articleStatus?'info':'success',
                    size: 'small'
                  },
                  style: {
                    display: this.authList.includes('5e834f2afb69305aa091e825')?'block':'none'
                  },
                  on: {
                    click: () => {
                      this.updateStatus(params)
                    }
                  }
                }, articleStatus?'转草稿':'发布'),
                h('el-button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    display: articleStatus && this.authList.includes('5e99c1ccd1ba729a78b016b8')?'block':'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/article/comment', query: {articleId: params.row._id, articleTitle: params.row.title}})
                    }
                  }
                }, '评论'),
                h('el-button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    display: this.authList.includes('5e834f2afb69305aa091e825')?'block':'none'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/article/edit', query: {articleId: params.row._id, articleTitle: params.row.title}})
                    }
                  }
                }, '编辑'),
                h('el-button', {
                  props: {
                    type: 'danger',
                    size: 'small'
                  },
                  style: {
                    display: this.authList.includes('5e834f31fb69305aa091e826')?'block':'none'
                  },
                  on: {
                    click: () => {
                      this.dataDel(params)
                    }
                  }
                }, '删除')
              ])
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
            prop: "title",
            width: '160px',
            label: "文章标题",
            placeholder: "文章标题"
          },
          {
            type: "select",
            prop: "tags",
            width: '160px',
            label: "文章标签",
            placeholder: "文章标签",
            arrList: []
          },
          {
            type: "date",
            dateType: 'daterange',
            prop: "createTime",
            width: '260px',
            label: "创建时间",
            change: this.timeChange
          }
        ],
        operate: [
          {
            name: '查询',
            handleClick: this.getDataList
          },
          {
            name: '新增',
            hide: false,
            handleClick: this.dataAdd
          },
          {
            name: '重置',
            type: "transparent",
            handleClick: this.resetForm
          }
        ],
        formModel: {
          title: '',
          tags: '',
          createTime: []
        }
      }
    }
  },
  created() {
    this.searchForm.operate[1].hide = !this.authList.includes('5e834f23fb69305aa091e824')
    this.getTagsList()
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
      this.$api.article.articleList({
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        title: formModel.title,
        tags: formModel.tags,
        status: this.articleStatus,
        createTime: formModel.createTime?formModel.createTime.join(','):null,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取文章列表失败');
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
          this.searchForm.formItemList[1].arrList = list
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
    },
    dataAdd(){
      this.$router.push({path: '/article/articleAdd'})
    },
    resetForm(){
      if(this.$refs['searchRef']){
        this.$refs['searchRef'].$refs['searchRef'].resetFields();
      }
      this.getDataList()
    },
    updateStatus(params){
      this.$confirm('此操作将修改文章状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.articleUpdate({
          id: params.row._id,
          status: this.articleStatus === '1'?'0':'1'
        }).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('文章修改状态成功');
          }else{
            this.$message.warning('文章修改状态失败');
          }
        })
      }).catch(() => {})
    },
    dataDel(params){
      this.$confirm('此操作将永久删除该文章及其评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.articleDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('文章删除成功');
          }else{
            this.$message.warning('文章删除失败');
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