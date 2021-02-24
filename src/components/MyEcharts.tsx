import React, { useCallback, useEffect, useRef } from "react";
import * as echarts from 'echarts'

const MyEcharts = ({
  option = {}, // 配置对象
  wrapStyle = { width: '100%', height: '400px', background: '#fff' }, // 样式
}) => {

  const ref = useRef<HTMLDivElement|any>(null)
  let instance: echarts.ECharts
  // getInstance 创建或获取实例
   const getInstance = async () => {
     instance = await echarts.getInstanceByDom(ref.current) || await echarts.init(ref.current)
     instance.clear() // 清除实例
   }

   // setOption 设置配置项
   const setOption = async () => {
     await new Promise<void>(resolve => {
       setTimeout(() => {
         instance && instance.setOption(option) // 模拟异步
         resolve()
       }, 1000)
     })
   }


   const init = async () => {
     await getInstance() // 生成或者获取echart实例
     await setOption() // 设置echarts配置项
   }

   /* eslint-disable */
   const resizeEcharts = useCallback(() => {
     instance && instance.resize()
   }, [])
   /* eslint-disable */

   /* eslint-disable */
   useEffect(() => {
     init()
   }, [option])
  /* eslint-disable */

   useEffect(() => { // 监听窗口变化，echarts自适应
    window.addEventListener('resize', resizeEcharts)
     return () => window.removeEventListener('resize', resizeEcharts) // 移除监听
   }, [resizeEcharts])
  return (
    <div ref={ref} style={wrapStyle} />
  )
}

export default MyEcharts