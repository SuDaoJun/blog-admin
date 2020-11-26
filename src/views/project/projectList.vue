<template>
  <div class='wrapper'>
    <h2 class='content-title'>项目列表</h2>
    <div class="box-table">
      <my-form
        :ref='searchForm.ref'
        :formConfig="searchForm"
      ></my-form>
      <el-tabs v-model="projectStatus" @tab-click="getDataList">
        <el-tab-pane v-for='item in statusArr' :key='item.value' :label="item.label" :name="item.value"></el-tab-pane>
      </el-tabs>
      <my-table 
      :tableData="tableData" 
      :pageObj='pageObj'
      @sortChange='sortChange'
      @pageChange='pageChange'
      ></my-table>
    </div>
    <el-dialog :title="dialogBox.isEdit?'编辑项目':'新增项目'" :visible.sync="dialogBox.boxShow" width='640px'>
      <my-form
        :ref='projectForm.ref'
        :formConfig="projectForm"
      >
        <div slot='upload'>
          <upload-file :fileList='fileList' listType='picture-card' @uploadEvent='beforeUpload' @removeEvent='beforeRemove'></upload-file>
        </div>
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
import UploadFile from '@/components/UploadFile'
import Format from "@/utils/format.js"
export default {
  data() {
    let statusArr = [
      {
        label: '进行中',
        value: '2'
      },
      {
        label: '已完成',
        value: '1'
      },
      {
        label: '已废弃',
        value: '3'
      }
    ]
    return {
      projectStatus: '2',
      statusArr,
      fileList: [],
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
            label: "项目名称",
            placeholder: "请输入项目名称",
            blur: this.getDataList
          },
          {
            type: "date",
            dateType: 'daterange',
            prop: "startTime",
            width: '300px',
            label: "开始时间",
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
          startTime: []
        }
      },
      tableData: {
        ref: 'table',
        dataList: [],
        columns: [
          {
            prop: 'name',
            sortable: 'custom',
            label: '项目名称'
          },
          {
            prop: 'imgId',
            label: '项目封面',
            render: (h, params)=>{
              return h('el-image',{
                props: {
                  src: params.row.imgId?`${this.$baseURL}/file/down?downId=${params.row.imgId}`:'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
                  'preview-src-list': [params.row.imgId?`${this.$baseURL}/file/down?downId=${params.row.imgId}`:'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png']
                },
                style:{
                  width: '60px',
                  height: '60px',
                  verticalAlign: 'middle',
                  borderRadius: '4px'
                }
              })
            }
          },
          {
            prop: 'description',
            label: '项目描述',
            showTooltip: true
          },
          {
            prop: 'startTime',
            sortable: true,
            label: '开始时间'
          },
          {
            prop: 'endTime',
            sortable: true,
            label: '结束时间'
          },
          {
            prop: 'operate',
            align: 'center',
            label: '操作',
            hide: true,
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
                      display: this.authList.includes('5e834f90fb69305aa091e82e')?'block':'none'
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
                      display: this.authList.includes('5e834f97fb69305aa091e82f')?'block':'none'
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
      projectForm: {
        labelWidth: '80px',
        ref: 'projectRef',
        labelPosition: 'right',
        marginRight: '10px',
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: '450px',
            label: "项目名称",
            placeholder: "请输入项目名称"
          },
          {
            type: "text",
            prop: "linkUrl",
            width: '450px',
            label: "项目地址",
            placeholder: "请输入项目地址"
          },
          {
            type: "date",
            prop: "startTime",
            width: '300px',
            label: "开始时间",
            placeholder: '选择日期',
            pickerOptions: {
              disabledDate: (time)=>{
                let endTime = this.projectForm.formModel.endTime
                if (endTime) {
                  return time.getTime() > new Date(endTime).getTime()
                }
              }
            }
          },
          {
            type: "date",
            prop: "endTime",
            width: '300px',
            label: "结束时间",
            placeholder: '选择日期',
            pickerOptions: {
              disabledDate:(time)=>{
                let startTime = this.projectForm.formModel.startTime
                if (startTime) {
                  return time.getTime() < new Date(startTime).getTime() - 86400000
                }
              }
            }
          },
          {
            type: "radio",
            prop: "status",
            label: "项目状态",
            arrList: statusArr
          },
          {
            label: "项目封面",
            slot: 'upload'
          },
          {
            type: "textarea",
            prop: "description",
            width: '450px',
            label: "项目描述",
            placeholder: "请输入项目描述"
          }
        ],
        formModel: {
          name: '',
          linkUrl: '',
          startTime: '',
          endTime: '',
          status: '2',
          description: ''
        },
        rules: {
          name: [
            { required: true, validator: Format.FormValidate.Form('项目名称').NoEmpty, trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, validator: Format.FormValidate.Form('项目地址').NoEmpty, trigger: 'blur' }
          ],
          startTime: [
            { required: true, validator: Format.FormValidate.Form('项目开始时间').NoEmpty, trigger: 'change' }
          ],
          status: [
            { required: true, validator: Format.FormValidate.Form('项目状态').NoEmpty, trigger: 'change' }
          ],
          description: [
            { required: true, validator: Format.FormValidate.Form('项目描述').NoEmpty, trigger: 'blur' }
          ],
        }
      }
    }
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e834f88fb69305aa091e82d')
    this.tableData.columns[5].hide = !this.authList.includes('5e834f90fb69305aa091e82e') && !this.authList.includes('5e834f97fb69305aa091e82f')
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据列表查询
    getDataList(page){
      let {pageObj, projectStatus} = this
      pageObj.currentPage = page === true?pageObj.currentPage:1;
      let formModel = this.searchForm.formModel;
      let {sortBy, sortOrders} = this.sortObj
      this.$api.project.projectList({
        currentPage: pageObj.currentPage,
        pageSize: pageObj.pageSize,
        name: formModel.name,
        status: projectStatus,
        startTime: formModel.startTime?formModel.startTime.join(','):null,
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
    beforeUpload(fileData){
      this.fileList = [fileData]
    },
    beforeRemove(file){
      this.fileList = []
    },
    dataAdd(){
      if(this.$refs['projectRef']){
        this.$refs['projectRef'].$refs['projectRef'].resetFields();
      }
      this.fileList = []
      this.dialogBox.isEdit = false;
      this.dialogBox.boxShow = true;
    },
    //编辑数据表单赋值
    editData(params){
      if(params.row.imgId){
        this.fileList = [
          {
            name: '',
            url: `${this.$baseURL}/file/down?downId=${params.row.imgId}`,
            sourceId: params.row.imgId
          }
        ]
      }
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(() => {
        if(this.$refs['projectRef']){
          this.$refs['projectRef'].$refs['projectRef'].resetFields();
        }
        this.projectForm.formModel = {
          name: params.row.name,
          linkUrl: params.row.linkUrl,
          startTime: params.row.startTime,
          endTime: params.row.endTime,
          status: params.row.status,
          description: params.row.description
        }
      })
    },
    // 新增或编辑数据
    confirSubmit(){
      this.$refs['projectRef'].$refs['projectRef'].validate((valid) => {
        let {dialogBox, fileList} = this;
        let formModel = this.projectForm.formModel;
        if (valid) {
          if(dialogBox.isEdit){
            this.$api.project.projectUpdate({
              id: dialogBox.detailItem._id,
              name: formModel.name,
              linkUrl: formModel.linkUrl,
              status: formModel.status,
              startTime: formModel.startTime,
              endTime: formModel.endTime,
              imgId: fileList.length > 0?fileList[0].sourceId:null,
              description: formModel.description
            }).then(res => {
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
                this.$message.success('项目信息更新成功');
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('项目名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('项目信息更新失败');
              }
            })
          }else{
            this.$api.project.projectAdd({
              name: formModel.name,
              linkUrl: formModel.linkUrl,
              status: formModel.status,
              startTime: formModel.startTime,
              endTime: formModel.endTime,
              imgId: fileList.length > 0?fileList[0].sourceId:null,
              description: formModel.description
            }).then((res)=>{
              let code = res.code
              if(code === this.$constant.reqSuccess){
                this.dialogBox.boxShow = false;
                this.getDataList();
                this.$message.success('项目信息添加成功');
              }else if(code === this.$constant.dataAlready){
                this.$message.warning('项目名称已存在');
                formModel.name = ''
              }else{
                this.$message.warning('项目信息添加失败');
              }
            })
          }
        } else {
          this.$message.warning('信息校验失败');
        }
      })
    },
    dataDel(params){
      this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.project.projectDel(params.row._id).then((res)=>{
          let code = res.code;
          if(code === this.$constant.reqSuccess){
            this.getDataList();
            this.$message.success('项目删除成功');
          }else{
            this.$message.warning('项目删除失败');
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
    UploadFile
  },
  computed: {
    authList(){
      return this.$store.getters.getAuthList
    }
  }
}
</script>