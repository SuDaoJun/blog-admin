import React, { useCallback, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { StoreState } from '@/store/types'
import { setUserInfo } from '@/store/actions'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import loadable from '@loadable/component'

const BasicLayout = loadable(() => import(/* webpackChunkName: "BasicLayout" */ '@/pages/layout/index'))
const Login = loadable(() => import(/* webpackChunkName: "login" */ '@/pages/login/index'))
const Register = loadable(() => import(/* webpackChunkName: "register" */ '@/pages/register/index'))
const Forget = loadable(() => import(/* webpackChunkName: "forget" */ '@/pages/forget/index'))

const Routers = (props: {
  setUserInfo: (userInfoObj:StoreState["userInfo"]) => void,
}) => {
  let { setUserInfo } = props;
  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    if(userInfo && typeof userInfo === 'string'){
      let userInfoObj = JSON.parse(userInfo)
      if(userInfoObj._id){
        setUserInfo(userInfoObj)
      }
    }
  }, []);

  /** 跳转到某个路由之前触发 **/
  const onEnter = useCallback((Component, props) => {
    /**
     *  有用户信息，说明已登录
     *  没有，则跳转至登录页
     * **/
    let pathname:string = props.location.pathname;
    let whiteList:string[] = ['/login', '/404', '/register', '/forget'];
    if(whiteList.indexOf(pathname) === -1){
      if(sessionStorage.getItem('token')){
        return <Component {...props} />;
      }else{
        return <Redirect to="/login" />;
      }
    }else{
      return <Component {...props} />;
    }
  }, []);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" render={(props) => onEnter(Login, props)} />
        <Route exact path="/register" render={(props) => onEnter(Register, props)} />
        <Route exact path="/forget" render={(props) => onEnter(Forget, props)} />
        <Route path="/" render={(props) => onEnter(BasicLayout, props)} />
      </Switch>
    </BrowserRouter>
  );
};


const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserInfo: (userInfoObj:StoreState["userInfo"]) => {
    dispatch(setUserInfo(userInfoObj))
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(Routers)