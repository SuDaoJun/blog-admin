import React, { useState, useEffect } from "react";
import { Form, Input, Checkbox, Image, Button, message} from 'antd';
import { StoreState } from '@/store/types'
import { setUserInfo } from '@/store/actions'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import ReactParticles from '@/components/ReactParticles';
import { FormValidate } from '@/utils/format';
import { timeLocalStorage, constantData, parseQuery} from '@/utils/utils';
import { baseURL } from '@/api/axios';
import api from '@/api/index';
import "./index.scss";

const Login = (props: any) => {
  const history = props.history;
  const [rememberBool, setRememberBool] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [codeImg, setCodeImg] = useState(`${baseURL}/user/getCode?t=${new Date().getTime()}`);
  const [loginForm] = Form.useForm();
  useEffect(() => {
    if(sessionStorage.getItem('token')){
      sessionStorage.removeItem('token')
    }
    if (timeLocalStorage.getItem("remember")) {
      loginForm.setFieldsValue({ name: timeLocalStorage.getItem("name")})
      setRememberBool(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const codeChange = ()=>{
    setCodeImg(`${baseURL}/user/getCode?t=${new Date().getTime()}`);
    loginForm.setFieldsValue({ code: '' })
  }
  const loginSubmit = ()=>{
    loginForm.validateFields().then((values)=>{
      setLoginLoading(true);
      api.user.login({
        name: values.name,
        password: values.password,
        randomCode: values.code
      }).then((res)=>{
        setLoginLoading(false);
        let code = res.data.code;
        let data = res.data.data;
        if (code === constantData.reqSuccess) {
          if (rememberBool) {
            timeLocalStorage.setItem("remember", "remember", 15);
            timeLocalStorage.setItem("name", values.name, 15);
          } else {
            if (timeLocalStorage.getItem("remember")) {
              localStorage.removeItem("remember");
              localStorage.removeItem("name");
            }
          }
          sessionStorage.setItem("token", "Bearer " + data.token);
          sessionStorage.setItem(
            "userInfo",
            JSON.stringify(data.user)
          )
          props.setUserInfo(data.user)
          let redirect = parseQuery(history.location.search);
          let redirectData:string|null =  redirect.get('redirect');
          if(redirectData){
            history.push(redirectData)
          }else{
            history.push('/index')
          }
        } else if (code === constantData.randomFail) {
          message.warning("随机验证码错误或超过有效期10分钟");
          codeChange();
        } else if (code === constantData.dataFail) {
          message.warning("邮箱或用户名不存在");
          loginForm.setFieldsValue({ name: '' })
        } else if (code === constantData.statusFail) {
          message.warning("该用户处于禁用状态，请联系管理员启用该账号");
          codeChange();
        } else if (code === constantData.pwdFail) {
          message.warning("密码错误");
          loginForm.setFieldsValue({ password: '' })
        } else {
          message.warning("登录失败");
        }
      }).catch(()=>{
        codeChange();
        setLoginLoading(false);
      })
    }).catch(()=>{});
  }
  const registerTo = ()=>{
    history.replace('/register')
  }
  const forgetTo = ()=>{
    history.replace('/forget')
  }
  return <div className='login-wrapper'>
    <div className="index-particles">
      <ReactParticles />
    </div>
    <div className="index-box">
      <div className="box-login">
        <Form
          name="normal_login"
          className="login-form"
          form={loginForm}
          validateTrigger='onBlur'
          scrollToFirstError
        >
          <Form.Item
            name="name"
            rules={FormValidate({name: '用户名或邮箱'})}
          >
            <Input 
              prefix={<span className="mio-icon-yonghu iconfont custom-icon" />} 
              maxLength={40} 
              bordered={false}
              allowClear={true} 
              placeholder="用户名或邮箱" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={FormValidate({type:'password',name: '密码'})}
          >
            <Input.Password 
              prefix={<span className="mio-icon-mima iconfont custom-icon" />}
              type="password"
              maxLength={16}
              allowClear={true}
              bordered={false}
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <div className="flex-code">
              <Form.Item
                  name="code"
                  rules={FormValidate({type:'code', name: '验证码'})}
                >
                <Input 
                  prefix={<span className="mio-icon-yanzhengma iconfont custom-icon" />}
                  style={{ width: '280px' }} 
                  maxLength={4} 
                  bordered={false}
                  allowClear={true} 
                  placeholder="验证码" 
                />
              </Form.Item>  
              <div className="code-show" onClick={codeChange}>
                <Image
                  width={150}
                  height={40}
                  preview={false}
                  src={codeImg}
                />
              </div>
            </div>
          </Form.Item>
          <div className="login-operate">
            <div className="operate-remeber">
              <Checkbox checked = {rememberBool} onChange={e=>setRememberBool(e.target.checked)}>记住账号</Checkbox>
            </div>
            <div className="operate-forget" onClick={forgetTo}>
              忘记密码？
            </div>
          </div>
          <Button className="login-btn" htmlType="submit" loading={loginLoading} onClick={loginSubmit}>登录</Button>
          <Button className="register-btn" onClick={registerTo}>注册</Button>
        </Form>
        
      </div>
    </div>
  </div>;
};

const mapStateToProps = (state: StoreState) => ({
  stateData: state
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserInfo: (userInfoObj:StoreState["userInfo"]) => {
    dispatch(setUserInfo(userInfoObj))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
