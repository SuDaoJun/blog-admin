webpackJsonp([12],{olt1:function(t,e){},upCZ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("qGD+"),s=a("W2KW"),r=(a("4/BI"),{data:function(){var t=this;return{sortObj:{sortBy:null,sortOrders:null},pageObj:{pageSize:10,total:0,currentPage:1},searchForm:{labelWidth:"70px",ref:"searchRef",inline:!0,marginRight:"30px",formItemList:[{type:"date",dateType:"daterange",prop:"createTime",width:"300px",label:"留言时间",change:this.timeChange}],operate:[{name:"新增",hide:!1,handleClick:this.dataAdd}],formModel:{createTime:[]}},tableData:{ref:"table",dataList:[],columns:[{prop:"name",sortable:"custom",label:"留言用户",render:function(t,e){return t("div",e.row.createUser?e.row.createUser.name:"--")}},{prop:"content",label:"留言内容",showTooltip:!0},{prop:"createTime",sortable:!0,label:"留言时间"},{prop:"status",sortable:!0,label:"留言状态",render:function(t,e){var a=e.row.status;return t("span",{style:{color:"1"===a?"#02BB00":"#909399"}},"1"===a?"启用":"禁用")}},{prop:"operate",align:"center",hide:!0,label:"操作",render:function(e,a){var n="1"==a.row.status;return e("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"}},[e("el-button",{props:{type:n?"info":"success",size:"small"},style:{display:t.authList.includes("5e834fc4fb69305aa091e834")?"block":"none"},on:{click:function(){t.statusChange(a)}}},n?"禁用":"启用"),e("el-button",{props:{type:"primary",size:"small"},style:{display:t.authList.includes("5e834fc4fb69305aa091e834")?"block":"none"},on:{click:function(){t.editData(a)}}},"编辑"),e("el-button",{props:{type:"danger",size:"small"},style:{display:t.authList.includes("5e834fcbfb69305aa091e835")?"block":"none"},on:{click:function(){t.dataDel(a)}}},"删除")])}}]}}},created:function(){this.searchForm.operate[0].hide=!this.authList.includes("5e834fbdfb69305aa091e833"),this.tableData.columns[4].hide=!this.authList.includes("5e834fc4fb69305aa091e834")&&!this.authList.includes("5e834fcbfb69305aa091e835")},mounted:function(){this.getDataList()},methods:{getDataList:function(t){var e=this,a=this.pageObj;a.currentPage=!0===t?a.currentPage:1;var n=this.searchForm.formModel,s=this.sortObj,r=s.sortBy,i=s.sortOrders;this.$api.message.messageList({currentPage:a.currentPage,pageSize:a.pageSize,createTime:n.createTime?n.createTime.join(","):null,sortBy:r,sortOrders:i}).then(function(t){t.code===e.$constant.reqSuccess?(e.pageObj.total=t.data.count,e.tableData.dataList=t.data.data):e.$message.warning("获取项目列表失败")})},sortChange:function(t){t.order?this.sortObj={sortBy:t.prop,sortOrders:t.order}:this.sortObj={sortBy:null,sortOrders:null},this.getDataList()},timeChange:function(t){this.searchForm.formModel.startTime=t||null,this.getDataList()},dataAdd:function(){var t=this;this.$prompt("请输入留言内容","新增留言",{confirmButtonText:"确定",cancelButtonText:"取消",inputType:"textarea",inputPlaceholder:"留言内容",inputValidator:function(t){if(null===t||""===t)return!1},inputErrorMessage:"留言内容不为空"}).then(function(e){var a=e.value;t.$api.message.messageAdd({content:a,status:"1"}).then(function(e){e.code===t.$constant.reqSuccess?t.getDataList():t.$message.warning("新增留言失败")})}).catch(function(){})},editData:function(t){var e=this;this.$prompt("请编辑留言内容","编辑留言",{confirmButtonText:"确定",cancelButtonText:"取消",inputType:"textarea",inputPlaceholder:"留言内容",inputValue:t.row.content,inputValidator:function(t){if(null===t||""===t)return!1},inputErrorMessage:"留言内容不为空"}).then(function(a){var n=a.value;e.$api.message.messageUpdate({id:t.row._id,content:n}).then(function(t){t.code===e.$constant.reqSuccess?e.getDataList():e.$message.warning("编辑留言失败")})}).catch(function(){})},statusChange:function(t){var e=this,a=t.row.status,n="1"===a?"是否确定禁用该留言？":"是否确定启用该留言？";this.$confirm(n,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$api.message.messageUpdate({id:t.row._id,status:"1"===a?"0":"1"}).then(function(a){a.code===e.$constant.reqSuccess?t.row.status=a.data.status:e.$message.warning("留言状态修改失败")})}).catch(function(){})},dataDel:function(t){var e=this;this.$confirm("此操作将删除该留言, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$api.message.messageDel(t.row._id).then(function(t){t.code===e.$constant.reqSuccess?(e.getDataList(),e.$message.success("留言删除成功")):e.$message.warning("留言删除失败")})}).catch(function(){})},pageChange:function(t){this.pageObj.currentPage=t,this.getDataList(!0)}},components:{MyTable:n.a,MyForm:s.a},computed:{authList:function(){return this.$store.getters.getAuthList}}}),i={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrapper"},[a("h2",{staticClass:"content-title"},[t._v("留言列表")]),t._v(" "),a("div",{staticClass:"box-table"},[a("my-form",{ref:t.searchForm.ref,attrs:{formConfig:t.searchForm}}),t._v(" "),a("my-table",{attrs:{tableData:t.tableData,pageObj:t.pageObj},on:{sortChange:t.sortChange,pageChange:t.pageChange}})],1)])},staticRenderFns:[]};var o=a("VU/8")(r,i,!1,function(t){a("olt1")},"data-v-1a9e6171",null);e.default=o.exports}});