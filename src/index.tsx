import React from 'react';
import ReactDOM from 'react-dom';
import Route from "@/router";
import { ConfigProvider, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

import '@/assets/icons/iconfont.css'

import { Provider } from 'react-redux'
import store from '@/store/index'


message.config({
  duration: 2,
  maxCount: 1
});
ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <Route />
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
