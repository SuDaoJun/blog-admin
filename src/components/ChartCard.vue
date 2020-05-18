<template>
  <el-card :body-style="{ padding: '20px 24px 12px' }">
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">
          <slot name="title">
            {{ title }}
          </slot>
        </span>
        <span class="chart-card-action">
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total">
        <slot name="total">
          <span>{{ typeof total === 'function' && total() || total }}</span>
        </slot>
      </div>
    </div>
    <div class="chart-card-content">
      <div class="content-fix">
        <slot></slot>
      </div>
    </div>
    <div class="chart-card-footer">
      <div class="field">
        <slot name="footer"></slot>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    total: {
      type: [Function, Number, String],
      required: false,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .chart-card-header {
    position: relative;
    overflow: hidden;
    width: 100%;

    .meta {
      position: relative;
      overflow: hidden;
      width: 100%;
      color: $color-G70;
      font-size: 14px;
      line-height: 22px;
    }
  }

  .chart-card-action {
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .chart-card-footer {
    border-top: 1px solid;
    @include bd-color($color-C20,$color-W10);
    padding-top: 9px;
    margin-top: 8px;
    .field {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: $color-G80;
      margin: 0;
    }
  }

  .chart-card-content {
    position: relative;
    height: 55px;
    width: 100%;
    display: flex;
    align-items: center;
    .content-fix {
      // position: absolute;
      // left: 0;
      // bottom: 0;
      width: 100%;
    }
  }

  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    @include font-color($color-D100,$color-W70);
    margin-top: 4px;
    margin-bottom: 0;
    font-size: 30px;
    line-height: 38px;
    height: 38px;
  }
</style>
