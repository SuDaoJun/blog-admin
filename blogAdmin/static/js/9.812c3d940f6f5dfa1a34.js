webpackJsonp([9],{QKUZ:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=a("qGD+"),r=a("W2KW"),i=a("4/BI"),n={data:function(){var e=this;return{sortObj:{sortBy:null,sortOrders:null},dialogBox:{boxShow:!1,isEdit:!1,detailItem:{}},searchForm:{labelWidth:"70px",ref:"searchRef",inline:!0,marginRight:"30px",formItemList:[{type:"text",prop:"name",width:"180px",label:"链接名称",placeholder:"链接名称",blur:this.getDataList}],operate:[{name:"新增",hide:!1,handleClick:this.dataAdd}],formModel:{name:""}},pageObj:{pageSize:10,total:0,currentPage:1},tableData:{ref:"table",dataList:[],columns:[{prop:"name",sortable:"custom",label:"链接名称"},{prop:"linkAddress",label:"链接地址",showTooltip:!0},{prop:"color",label:"链接颜色",render:function(e,t){return e("div",{style:{width:"120px",height:"20px",margin:"0 auto",background:t.row.color}})}},{prop:"createTime",sortable:"custom",label:"创建时间",render:function(e,t){return e("div",t.row.createTime?t.row.createTime.split(" ")[0]:"--")}},{prop:"operate",align:"center",label:"操作",render:function(t,a){return t("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},[t("el-button",{props:{type:"primary",size:"small"},style:{display:e.authList.includes("5e834faffb69305aa091e831")?"block":"none"},on:{click:function(){e.dialogBox.detailItem=a.row,e.editData(a)}}},"编辑"),t("el-button",{props:{type:"danger",size:"small"},style:{display:e.authList.includes("5e834fb5fb69305aa091e832")?"block":"none"},on:{click:function(){e.dataDel(a)}}},"删除")])}}]},linkForm:{labelWidth:"80px",ref:"linkRef",labelPosition:"right",marginRight:"10px",formItemList:[{type:"text",prop:"name",width:"450px",label:"链接名称",placeholder:"请输入链接名称"},{type:"text",prop:"linkAddress",width:"450px",label:"链接地址",placeholder:"请输入链接地址"},{slot:"color",prop:"color",width:"450px",label:"链接颜色"}],formModel:{name:"",linkAddress:"",color:"#409EFF"},rules:{name:[{required:!0,validator:i.a.FormValidate.Form("链接名称").NoEmpty,trigger:"blur"}],linkAddress:[{required:!0,validator:i.a.FormValidate.Form("链接地址").NoEmpty,trigger:"blur"}],color:[{required:!0,validator:i.a.FormValidate.Form("链接颜色").TypeSelect,trigger:"change"}]}}}},created:function(){this.searchForm.operate[0].hide=!this.authList.includes("5e834f9efb69305aa091e830"),this.tableData.columns[4].hide=!this.authList.includes("5e834faffb69305aa091e831")&&!this.authList.includes("5e834fb5fb69305aa091e832")},mounted:function(){this.getDataList()},methods:{getDataList:function(e){var t=this,a=this.pageObj;a.currentPage=!0===e?a.currentPage:1;var o=this.searchForm.formModel,r=this.sortObj,i=r.sortBy,n=r.sortOrders;this.$api.link.linkList({currentPage:a.currentPage,pageSize:a.pageSize,name:o.name,sortBy:i,sortOrders:n}).then(function(e){e.code===t.$constant.reqSuccess?(t.pageObj.total=e.data.count,t.tableData.dataList=e.data.data):t.$message.warning("获取友情链接列表失败")})},sortChange:function(e){e.order?this.sortObj={sortBy:e.prop,sortOrders:e.order}:this.sortObj={sortBy:null,sortOrders:null},this.getDataList()},dataAdd:function(){this.$refs.linkRef&&this.$refs.linkRef.$refs.linkRef.resetFields(),this.dialogBox.isEdit=!1,this.dialogBox.boxShow=!0},editData:function(e){var t=this;this.dialogBox.isEdit=!0,this.dialogBox.boxShow=!0,this.$nextTick(function(){t.$refs.linkRef&&t.$refs.linkRef.$refs.linkRef.resetFields(),t.linkForm.formModel={name:e.row.name,linkAddress:e.row.linkAddress,color:e.row.color}})},confirSubmit:function(){var e=this;this.$refs.linkRef.$refs.linkRef.validate(function(t){var a=e.dialogBox,o=e.linkForm.formModel;t?a.isEdit?e.$api.link.linkUpdate({id:a.detailItem._id,name:o.name,linkAddress:o.linkAddress,color:o.color}).then(function(t){var a=t.code;a===e.$constant.reqSuccess?(e.dialogBox.boxShow=!1,e.getDataList(),e.$message.success("友情链接信息更新成功")):a===e.$constant.dataAlready?(e.$message.warning("链接名称已存在"),o.name=""):e.$message.warning("友情链接更新失败")}):e.$api.link.linkAdd({name:o.name,linkAddress:o.linkAddress,color:o.color}).then(function(t){var a=t.code;a===e.$constant.reqSuccess?(e.dialogBox.boxShow=!1,e.getDataList(),e.$message.success("友情链接信息添加成功")):a===e.$constant.dataAlready?(e.$message.warning("链接名称已存在"),o.name=""):e.$message.warning("友情链接信息添加失败")}):e.$message.warning("信息校验失败")})},dataDel:function(e){var t=this;this.$confirm("此操作将删除该友情链接, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.$api.link.linkDel(e.row._id).then(function(e){e.code===t.$constant.reqSuccess?(t.getDataList(),t.$message.success("友情链接删除成功")):t.$message.warning("友情链接删除失败")})}).catch(function(){})},pageChange:function(e){this.pageObj.currentPage=e,this.getDataList(!0)}},components:{MyTable:o.a,MyForm:r.a},computed:{authList:function(){return this.$store.getters.getAuthList}}},s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"wrapper"},[a("h2",{staticClass:"content-title"},[e._v("友情链接列表")]),e._v(" "),a("div",{staticClass:"box-table"},[a("my-form",{ref:e.searchForm.ref,attrs:{formConfig:e.searchForm}}),e._v(" "),a("my-table",{attrs:{tableData:e.tableData,pageObj:e.pageObj},on:{sortChange:e.sortChange,pageChange:e.pageChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.dialogBox.isEdit?"编辑友情链接":"新增友情链接",visible:e.dialogBox.boxShow,width:"640px"},on:{"update:visible":function(t){return e.$set(e.dialogBox,"boxShow",t)}}},[a("my-form",{ref:e.linkForm.ref,attrs:{formConfig:e.linkForm}},[a("el-color-picker",{attrs:{slot:"color"},slot:"color",model:{value:e.linkForm.formModel.color,callback:function(t){e.$set(e.linkForm.formModel,"color",t)},expression:"linkForm.formModel.color"}})],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogBox.boxShow=!1}}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.confirSubmit}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var l=a("VU/8")(n,s,!1,function(e){a("wcsa")},"data-v-654664e9",null);t.default=l.exports},wcsa:function(e,t){}});