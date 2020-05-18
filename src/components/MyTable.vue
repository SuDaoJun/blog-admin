<template>
  <div class="table-show">
    <el-table 
    :ref='tableData.ref'
    :data="tableData.dataList" 
    :height="tableData.height" 
    :row-key="tableData.rowKey || '_id'" 
    :stripe="tableData.stripe || false" 
    :border="tableData.border || false"
    :header-cell-style="{background: tableData.headerBg,color:tableData.headerColor}"
    :highlight-current-row="tableData.highlightRow || false"
    @selection-change='selectChange'
    @select-all='selectAll'
    @sort-change='sortChange'
    @current-change='currentChange'
    >
      <el-table-column
        v-if='tableData.selection || false'
        type="selection"
        :selectable='tableData.selectable'
        :reserve-selection="tableData.reserveSelection || false"
        width="55">
      </el-table-column>
      <el-table-column v-if='!col.hide'  v-for="(col, index) in tableData.columns" :key="index" :type="col.type" :show-overflow-tooltip='col.showTooltip' :sortable="col.sortable" :prop="col.prop" :fixed="col.fixed"  :label="col.label" :align="col.align || 'center'" :width="col.width">
        <template slot-scope="scope">
            <ex-slot v-if="col.render" :render="col.render"  :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
            <slot v-else-if='col.slot' :name="col.slot" :scope='scope' />
            <span v-else>
                {{scope.row[col.prop] || '--'}}
            </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-list" :style='{"justifyContent":pageObj.justifyContent?pageObj.justifyContent:"center"}' v-if='pageShow'>
      <div v-if='tableData.slot'>
        <slot :name="tableData.slot" />
      </div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page.sync  = 'pageObj.currentPage'
        :page-size = 'pageObj.pageSize'
        :total = "pageObj.total"
        @current-change="pageChange"
        >
      </el-pagination>
    </div>
  </div>
</template>
<script>
// 自定义内容的组件
let exSlot = {
functional: true,
props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
        type: Object,
        default: null
    }
},

render: (h, data) => {
    const params = {
        row: data.props.row,
        index: data.props.index
    }

    if (data.props.column) params.column = data.props.column
      return data.props.render(h, params)
  }
}
export default {
  components: {
      'ex-slot': exSlot
  },
  props: {
    tableData: {
      type: Object,
      default() {
        return {
          dataList: []
        }
      }
    },
    pageShow: {
      type: Boolean,
      default: true
    },
    pageObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
   pageChange(page){
     this.$emit('pageChange',page)
   },
   selectChange(selection){
     this.$emit('selectChange',selection)
   },
   currentChange(currentRow, oldCurrentRow){
     let data = {
       currentRow,
       oldCurrentRow
     }
     this.$emit('currentChange',data)
   },
   selectAll(selection){
     this.$emit('selectAll',selection)
   },
   sortChange(column){
     this.$emit('sortChange',column)
   },
  }
};
</script>