<template>
  <div class="wrapper">
    <h2 class="content-title">友情链接列表</h2>
    <div class="box-table">
      <my-form :ref="searchForm.ref" :formConfig="searchForm"></my-form>
      <my-table
        :tableData="tableData"
        :pageObj="pageObj"
        @sortChange="sortChange"
        @pageChange="pageChange"
      ></my-table>
    </div>
    <el-dialog
      :title="dialogBox.isEdit ? '编辑友情链接' : '新增友情链接'"
      :visible.sync="dialogBox.boxShow"
      width="640px"
    >
      <my-form :ref="linkForm.ref" :formConfig="linkForm">
        <el-color-picker slot='color' v-model="linkForm.formModel.color"></el-color-picker>
      </my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

<script>
import MyTable from "@/components/MyTable";
import MyForm from "@/components/MyForm";
import Format from "@/utils/format.js";
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
      searchForm: {
        labelWidth: "70px",
        ref: "searchRef",
        inline: true,
        marginRight: "30px",
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: "180px",
            label: "链接名称",
            placeholder: "链接名称",
            blur: this.getDataList
          }
        ],
        operate: [
          {
            name: "新增",
            hide: false,
            handleClick: this.dataAdd
          }
        ],
        formModel: {
          name: ""
        }
      },
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      tableData: {
        ref: "table",
        dataList: [],
        columns: [
          {
            prop: "name",
            sortable: "custom",
            label: "链接名称"
          },
          {
            prop: "linkAddress",
            label: "链接地址",
            showTooltip: true
          },
          {
            prop: 'color',
            label: '链接颜色',
            render: (h, params)=>{
              return h('div',{
                style: {
                  width: '120px',
                  height: '20px',
                  margin: '0 auto',
                  background: params.row.color
                }
              })
            }
          },
          {
            prop: "createTime",
            sortable: "custom",
            label: "创建时间",
            render: (h, params) => {
              let time = params.row.createTime?params.row.createTime.split(' ')[0]:'--'
              return h('div', time)
            }
          },
          {
            prop: "operate",
            align: "center",
            label: "操作",
            render: (h, params) => {
              return h(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                },
                [
                  h(
                    "el-button",
                    {
                      props: {
                        type: "primary",
                        size: "small"
                      },
                      style: {
                        display: this.authList.includes('5e834faffb69305aa091e831')?'block':'none'
                      },
                      on: {
                        click: () => {
                          this.dialogBox.detailItem = params.row;
                          this.editData(params);
                        }
                      }
                    },
                    "编辑"
                  ),
                  h(
                    "el-button",
                    {
                      props: {
                        type: "danger",
                        size: "small"
                      },
                      style: {
                        display: this.authList.includes('5e834fb5fb69305aa091e832')?'block':'none'
                      },
                      on: {
                        click: () => {
                          this.dataDel(params);
                        }
                      }
                    },
                    "删除"
                  )
                ]
              );
            }
          }
        ]
      },
      linkForm: {
        labelWidth: "80px",
        ref: "linkRef",
        labelPosition: "right",
        marginRight: "10px",
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: "450px",
            label: "链接名称",
            placeholder: "请输入链接名称"
          },
          {
            type: "text",
            prop: "linkAddress",
            width: '450px',
            label: "链接地址",
            placeholder: "请输入链接地址"
          },
          {
            slot: "color",
            prop: "color",
            width: '450px',
            label: "链接颜色"
          }
        ],
        formModel: {
          name: '',
          linkAddress: '',
          color: '#409EFF'
        },
        rules: {
          name: [
            {
              required: true,
              validator: Format.FormValidate.Form("链接名称").NoEmpty,
              trigger: "blur"
            },
          ],
          linkAddress: [
            {
              required: true,
              validator: Format.FormValidate.Form("链接地址").NoEmpty,
              trigger: "blur"
            },
          ],
          color: [
            { required: true, validator: Format.FormValidate.Form('链接颜色').TypeSelect, trigger: 'change' }
          ]
        }
      }
    };
  },
  created() {
    this.searchForm.operate[0].hide = !this.authList.includes('5e834f9efb69305aa091e830')
    this.tableData.columns[4].hide = !this.authList.includes('5e834faffb69305aa091e831') && !this.authList.includes('5e834fb5fb69305aa091e832')
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 数据列表查询
    getDataList(page) {
      let pageObj = this.pageObj;
      pageObj.currentPage = page === true ? pageObj.currentPage : 1;
      let formModel = this.searchForm.formModel;
      let { sortBy, sortOrders } = this.sortObj;
      this.$api.link
        .linkList({
          currentPage: pageObj.currentPage,
          pageSize: pageObj.pageSize,
          name: formModel.name,
          sortBy,
          sortOrders
        })
        .then(res => {
          let code = res.code;
          if (code === this.$constant.reqSuccess) {
            this.pageObj.total = res.data.count;
            this.tableData.dataList = res.data.data;
          } else {
            this.$message.warning("获取友情链接列表失败");
          }
        });
    },
    sortChange(data) {
      if (data.order) {
        this.sortObj = {
          sortBy: data.prop,
          sortOrders: data.order
        };
      } else {
        this.sortObj = {
          sortBy: null,
          sortOrders: null
        };
      }
      this.getDataList();
    },
    dataAdd() {
      if (this.$refs["linkRef"]) {
        this.$refs["linkRef"].$refs["linkRef"].resetFields();
      }
      this.dialogBox.isEdit = false;
      this.dialogBox.boxShow = true;
    },
    //编辑数据表单赋值
    editData(params) {
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(() => {
        if (this.$refs["linkRef"]) {
          this.$refs["linkRef"].$refs["linkRef"].resetFields();
        }
        this.linkForm.formModel = {
          name: params.row.name,
          linkAddress: params.row.linkAddress,
          color: params.row.color
        };
      })
    },
    // 新增或编辑数据
    confirSubmit() {
      this.$refs["linkRef"].$refs["linkRef"].validate(valid => {
        let dialogBox = this.dialogBox;
        let formModel = this.linkForm.formModel;
        if (valid) {
          if (dialogBox.isEdit) {
            this.$api.link
              .linkUpdate({
                id: dialogBox.detailItem._id,
                name: formModel.name,
                linkAddress: formModel.linkAddress,
                color: formModel.color
              })
              .then(res => {
                let code = res.code;
                if (code === this.$constant.reqSuccess) {
                  this.dialogBox.boxShow = false;
                  this.getDataList();
                  this.$message.success("友情链接信息更新成功");
                } else if (code === this.$constant.dataAlready) {
                  this.$message.warning("链接名称已存在");
                  formModel.name = "";
                } else {
                  this.$message.warning("友情链接更新失败");
                }
              });
          } else {
            this.$api.link
              .linkAdd({
                name: formModel.name,
                linkAddress: formModel.linkAddress,
                color: formModel.color
              })
              .then(res => {
                let code = res.code;
                if (code === this.$constant.reqSuccess) {
                  this.dialogBox.boxShow = false;
                  this.getDataList();
                  this.$message.success("友情链接信息添加成功");
                } else if (code === this.$constant.dataAlready) {
                  this.$message.warning("链接名称已存在");
                  formModel.name = "";
                } else {
                  this.$message.warning("友情链接信息添加失败");
                }
              });
          }
        } else {
          this.$message.warning("信息校验失败");
        }
      });
    },
    dataDel(params) {
      this.$confirm("此操作将删除该友情链接, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api.link.linkDel(params.row._id).then(res => {
            let code = res.code;
            if (code === this.$constant.reqSuccess) {
              this.getDataList();
              this.$message.success("友情链接删除成功");
            } else {
              this.$message.warning("友情链接删除失败");
            }
          });
        })
        .catch(() => {});
    },
    // 分页页数改变
    pageChange(page) {
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
};
</script>
