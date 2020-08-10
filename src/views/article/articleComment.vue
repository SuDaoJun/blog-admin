<template>
  <div class='wrapper'>
    <h2 class='content-title'>文章评论{{articleTitle?'——'+articleTitle:''}}</h2>
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
    <el-dialog title="评论回复" :visible.sync="dialogBox.boxShow" width='720px' :lock-scroll="true">
      <div class="comment-box">
        <empty-show :hide='dialogBox.detailItem.replyCommentList && dialogBox.detailItem.replyCommentList.length === 0' showTxt='暂无评论' imgWidth='100px' imgHeight='90px'></empty-show>
        <div class="box-list">
            <div class="list-item" v-for='(item,index) in dialogBox.detailItem.replyCommentList' :key='item._id'>
                <el-image :src='baseURL+"/file/down?downId="+item.replyUser.avatarId' class='image-circle'>
                  <div slot="error" class="image-slot">
                    <i class="el-icon-user-solid"></i>
                  </div>
                </el-image>
                <div class="item-content">
                  <div class="content-operate">
                    <div class="operate-user">
                      <span class='user-name'>{{item.replyUser.name}}</span>
                      <span class='comment-time'><i class='el-icon-time'></i>{{item.createTime}}</span>
                    </div>
                    <div class="operate-data">
                      <el-button v-if='authList.includes("5e834f77fb69305aa091e82b")' :type="item.status === '1'?'info':'success'" size="mini" :icon="item.status === '1'?'el-icon-circle-close':'el-icon-circle-check'" @click='replyCommentStatus(item)'>{{item.status === '1'?'禁用':'启用'}}</el-button>
                      <el-button v-if='authList.includes("5e834f77fb69305aa091e82b")' type="primary" size="mini" icon="el-icon-edit" @click='replyCommentEdit(item)'>编辑</el-button>
                      <el-button v-if='authList.includes("5e834f77fb69305aa091e82b")' type="warning" size="mini" icon="el-icon-edit-outline" @click='replyComment(item)'>回复</el-button>
                      <el-button v-if='authList.includes("5e834f7efb69305aa091e82c")' type="danger" size="mini" icon="el-icon-delete" @click='replyCommentDel(item._id)'>删除</el-button>
                    </div>
                  </div>
                  <div class="content-replay">
                    <span class='replay-user' v-show='item.toUser && item.replyUser && item.toUser._id !==  item.replyUser._id' >
                      回复 <i>{{item.toUser?item.toUser.name:'--'}}</i> 的评论：
                    </span>
                    <span>
                      {{item.content}}
                    </span>
                  </div>
                </div>
            </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取消</el-button>
        <el-button type="primary" @click="replyCommentAdd" v-if='authList.includes("5e834f6ffb69305aa091e82a")'>新增</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.comment-box{
  .list-item{
    margin-bottom: 40px;
    display: flex;
    .item-content{
      flex: 1;
      .content-operate{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .operate-user{
          .user-name{
            color: $color-G100;
            font-size: 16px;
            font-weight: 500;
            margin: 0 10px 0;
          }
          .comment-time{
            i{
              margin-right: 3px;
              font-size: 16px;
            }
          }
        }
      }
      .content-replay{
        margin: 5px 0 0 10px;
        .replay-user{
          i{
            color: $color-B60;
          }
        }
      }
    }
  }
}
</style>

<script>
import MyTable from '@/components/MyTable'
import MyForm from '@/components/MyForm'
import EmptyShow from '@/components/EmptyShow'
import Format from "@/utils/format.js"
export default {
  data() {
    return {
      baseURL: this.$baseURL,
      articleId: '',
      articleTitle: '',
      sortObj: {
        sortBy: null,
        sortOrders: null
      },
      dialogBox: {
        boxShow: false,
        index: 0,
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
            prop: 'createUser',
            label: '评论用户',
            render: (h, params)=>{
              return h('span',params.row.createUser?params.row.createUser.name : '--')
            }
          },
          {
            prop: 'content',
            showTooltip: true,
            label: '评论内容'
          },
          {
            prop: 'replyCommentList',
            label: '评论回复',
            render: (h, params)=>{
              let numTotal = params.row.replyCommentList.length
              return h('div', {
                style: {
                  color: '#409EFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.dialogBox.index = params.index;
                    this.dialogBox.detailItem = params.row;
                    this.dialogBox.boxShow = true;
                  }
                }
              },[
                h('i', {
                  class: 'el-icon-chat-dot-round',
                  style: {
                    fontSize: '16px',
                    marginRight: '8px',

                  },
                }, ''),
                h('span', numTotal),
              ])
            }
          },
          {
            prop: 'createTime',
            sortable: true,
            label: '创建时间',
          },
          {
            prop: 'status',
            label: '评论状态',
            render: (h, params)=>{
              let status = params.row.status
              return h(
                "el-switch",
                {
                  props: {
                    value: status == "1",
                    activeColor: '#13ce66',
                    activeText: status == "1" ? "启用" : "禁用"
                  },
                  on: {
                    change: () => {
                      let info = status == "1" ? "禁用" : "启用"
                      if(this.authList.includes('5e834f77fb69305aa091e82b')){
                        this.$confirm(
                          `此操作将${info}评论, 是否继续?`,
                          "提示",
                          {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                          }
                        )
                          .then(() => {
                            this.$api.article.commentUpdate({
                              commentId: params.row._id,
                              status: status == '1'?'0':'1'
                            }).then((res)=>{
                              let code = res.code;
                              if(code === this.$constant.reqSuccess){
                                params.row.status = res.data.status
                              }else{
                                this.$message.warning('评论状态修改失败');
                              }
                            })
                          })
                          .catch(() => {});
                      }else{
                        this.$message.warning('暂无权限修改状态')
                      }
                    }
                  }
                },
                ""
              )
            }
          },
          {
            prop: 'operate',
            align: 'center',
            width: 220,
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
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e834f77fb69305aa091e82b')?'block':'none'
                    },
                    on: {
                      click: () => {
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
                  }, '删除'),
                  h('el-button', {
                    props: {
                      type: params.row.isTop?'warning':'info',
                      size: 'small'
                    },
                    style: {
                      display: this.authList.includes('5e834f77fb69305aa091e82b')?'block':'none'
                    },
                    on: {
                      click: () => {
                        this.commentTop(params);
                      }
                    }
                  }, '置顶')
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
            type: "select",
            prop: "status",
            width: '180px',
            label: '评论状态',
            arrList: [
              {
                label: '待审核',
                value: '0'
              },
              {
                label: '正常',
                value: '1'
              }
            ],
            change: this.getDataList
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
          status: '',
          createTime: []
        }
      }
    }
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e834f6ffb69305aa091e82a')
  },
  mounted() {
    if(this.$route.query.articleId){
      this.articleId = this.$route.query.articleId
      this.articleTitle = this.$route.query.articleTitle
      this.getDataList()
    }
  },
  methods: {
    // 数据列表查询
    getDataList(page){
      this.pageObj.currentPage = page === true?this.pageObj.currentPage:1;
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      this.$api.article.commentList({
        currentPage: this.pageObj.currentPage,
        pageSize: this.pageObj.pageSize,
        articleId: this.articleId,
        status: formModel.status,
        createTime: formModel.createTime?formModel.createTime.join(','):null,
        sortBy,
        sortOrders
      }).then(res =>{
        let code = res.code
        if(code === this.$constant.reqSuccess){
          this.pageObj.total = res.data.count;
          this.tableData.dataList = res.data.data;
        }else{
          this.$message.warning('获取评论列表失败');
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
      this.$prompt('请输入评论内容', '新增评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '评论内容',
        inputValidator: (val)=>{
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '评论内容不为空'
      }).then(({ value }) => {
        this.$api.article.commentAdd({
          articleId: this.articleId,
          content: value,
          status: '1'
        }).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.getDataList()
          }else{
            this.$message.warning('新增评论失败');
          }
        })
      }).catch(() => {      
      })
    },
    replyCommentAdd(){
      let {detailItem, index} = this.dialogBox
      let articleId = this.articleId
      this.$prompt(`回复 @${detailItem.createUser.name}：`, '新增回复评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '回复评论',
        inputValidator: (val)=>{ 
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '评论内容不为空'
      }).then(({ value }) => {
        let toUser = detailItem.createUser._id
        this.$api.article.replyCommentAdd({
          articleId,
          commentId: detailItem._id,
          toUser,
          content: value
        }).then((res)=>{
          console.log(res)
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.dialogBox.detailItem = res.data
            this.tableData.dataList[index] = res.data
            this.$set(this.tableData.dataList, index, this.tableData.dataList[index])
          }else{
            this.$message.warning('新增评论失败')
          }
        })
      }).catch(() => {      
      })
    },
    replyComment(item){
      let index = this.dialogBox.index
      let articleId = this.articleId
      this.$prompt(`回复 @${item.replyUser.name}：`, '新增回复评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '回复评论',
        inputValidator: (val)=>{ 
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '评论内容不为空'
      }).then(({ value }) => {
        this.$api.article.replyCommentAdd({
          articleId,
          commentId: item.commentId,
          toUser: item.replyUser._id,
          content: value
        }).then((res)=>{
          console.log(res)
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.dialogBox.detailItem = res.data
            this.tableData.dataList[index] = res.data
            this.$set(this.tableData.dataList, index, this.tableData.dataList[index])
          }else{
            this.$message.warning('新增评论失败')
          }
        })
      }).catch(() => {      
      })
    },
    //编辑
    editData(params){
      this.$prompt('请输入评论内容', '编辑评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '评论内容',
        inputValue: params.row.content,
        inputValidator: (val)=>{
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '评论内容不为空'
      }).then(({ value }) => {
        this.$api.article.commentUpdate({
          commentId: params.row._id,
          content: value
        }).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            this.getDataList()
          }else{
            this.$message.warning('编辑评论失败');
          }
        })
      }).catch(() => {      
      })
    },
    replyCommentEdit(item){
      this.$prompt('请输入评论内容', '编辑回复评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '评论内容',
        inputValue: item.content,
        inputValidator: (val)=>{
          if (val === null || val === '') {
            return false
          }
        },
        inputErrorMessage: '评论内容不为空'
      }).then(({ value }) => {
        this.$api.article.replyCommentUpdate({
          replayId: item._id,
          content: value
        }).then((res)=>{
          let code = res.code
          if(code === this.$constant.reqSuccess){
            item.content = value
          }else{
            this.$message.warning('编辑回复评论失败');
          }
        })
      }).catch(() => {      
      })
    },
    // 置顶
    commentTop(params){
      let isTop = params.row.isTop
      let title = isTop?'是否确定取消该评论置顶？':'是否确定置顶该评论？'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.commentTop({
          commentId: params.row._id,
          isTop: !isTop
        }).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('评论置顶状态修改成功');
          }else{
            this.$message.warning('评论置顶状态修改失败');
          }
        })
      }).catch(() => {})
    },
    replyCommentStatus(item){
      let status = item.status
      let title =status?'是否确定禁用该回复评论？':'是否确定启用该回复评论？'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.replyCommentUpdate({
          replayId: item._id,
          status: status === '1'?'0':'1'
        }).then((res)=>{
          console.log(res)
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            item.status = res.data.status
          }else{
            this.$message.warning('评论状态修改失败');
          }
        })
      }).catch(() => {})
    },
    // 删除
    dataDel(params){
      this.$confirm('此操作将永久删除该评论以及其回复评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.commentDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('评论删除成功');
          }else if(code === this.$constant.dataAlready){
            this.$message.warning('请先删除已启用的回复评论')
          }else{
            this.$message.warning('评论删除失败');
          }
        })
      }).catch(() => {})
    },
    replyCommentDel(id){
      let index = this.dialogBox.index
      this.$confirm('此操作将删除其回复评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.article.replyCommentDel(id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.dialogBox.detailItem = res.data
            this.tableData.dataList[index] = res.data
            this.$set(this.tableData.dataList, index, this.tableData.dataList[index])
            this.$message.success('回复评论删除成功');
          }else{
            this.$message.warning('回复评论删除失败');
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
    MyForm,
    EmptyShow
  },
  computed: {
    authList(){
      return this.$store.getters.getAuthList
    }
  }
}
</script>