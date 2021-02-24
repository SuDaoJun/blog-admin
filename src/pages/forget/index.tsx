import React, { useState } from "react";
import { Form, Input, Image, Button, message} from 'antd';
import {ArrowRightOutlined} from '@ant-design/icons';
import ReactParticles from '@/components/ReactParticles';
import { FormValidate, emailReg } from '@/utils/format';
import { constantData } from '@/utils/utils';
import { baseURL } from '@/api/axios';
import api from '@/api/index';
import "@/pages/login/index.scss";


const Forget = (props: any) => {
  const history = props.history;
  const [forgetLoading, setForgetLoading] = useState(false);
  const [emailObj, setEmailObj] = useState({
    txt: '获取验证码',
    disabled: false,
    time: 60,
  });
  const [codeImg, setCodeImg] = useState(`${baseURL}/user/getCode?t=${new Date().getTime()}`);
  const [forgetForm] = Form.useForm();
  const codeChange = ()=>{
    setCodeImg(`${baseURL}/user/getCode?t=${new Date().getTime()}`);
    forgetForm.setFieldsValue({ code: '' })
  }
  const emailChange = ()=>{
    let formObj = forgetForm.getFieldsValue();
    let emailCode = {...emailObj}
    if (emailReg.test(formObj.email)) {
      if(!emailCode.disabled){
        let interval = setInterval(() => {
          emailCode.time--;
          emailCode.txt = `重新获取${emailCode.time}s`;
          emailCode.disabled = true;
          if (emailCode.time <= 0) {
            clearInterval(interval);
            emailCode.time = 60;
            emailCode.txt = "获取验证码";
            emailCode.disabled = false;
          }
          setEmailObj({...emailCode})
        }, 1000);
        emailCode.disabled = true;
        api.user.sendEmail({
            email: formObj.email,
            type: "update"
          })
          .then(res => {
            let code = res.data.code;
            if (code === constantData.reqSuccess) {
              message.success("邮件发送成功");
            } else if (code === constantData.dataAlready) {
              message.warning("该邮箱账号已存在，请直接登录");
              forgetForm.setFieldsValue({ email: '' })
              clearInterval(interval);
              emailCode.time = 60;
              emailCode.txt = "获取验证码";
              emailCode.disabled = false;
              setEmailObj(emailCode)
            } else if (code === constantData.dataNot) {
              message.warning("该邮箱账号不存在");
              forgetForm.setFieldsValue({ email: '' })
              clearInterval(interval);
              emailCode.time = 60;
              emailCode.txt = "获取验证码";
              emailCode.disabled = false;
              setEmailObj(emailCode)
            } else {
              message.warning("邮件发送失败");
            }
          })
      }else{
        message.warning(`请${emailCode.time}s后再获取验证码`);
      }
    }else{
      message.warning('请输入正确的邮箱账号')
    }
  }
  const forgetSubmit = ()=>{
    forgetForm.validateFields().then((values)=>{
      setForgetLoading(true);
      api.user.resetPwd({
        email: values.email,
        emailCode: values.emailCode,
        password: values.password,
        randomCode: values.code
      }).then((res)=>{
        setForgetLoading(false);
        let code = res.data.code;
        if (code === constantData.reqSuccess) {
          message.success("密码重置成功，请登录");
          setTimeout(()=>{
            backLogin();
          },1000)
        } else if (code === constantData.randomFail) {
          message.warning("随机验证码错误或超过有效期10分钟");
          codeChange();
        } else if (code === constantData.dataFail) {
          message.warning("邮箱不存在");
          forgetForm.setFieldsValue({ email: '' })
        } else if (code === constantData.codeFail) {
          message.warning("邮箱验证码错误");
          forgetForm.setFieldsValue({ emailCode: '' })
        } else if (code === constantData.timeOver) {
          message.warning("邮箱验证码有效时间为10分钟");
          forgetForm.setFieldsValue({ emailCode: '' })
        } else {
          message.warning("密码重置失败");
        }
      }).catch(()=>{
        codeChange();
        setForgetLoading(false);
      })
    }).catch(()=>{});
  }
  const backLogin = ()=>{
    history.replace('/login')
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
          form={forgetForm}
          validateTrigger='onBlur'
          scrollToFirstError
        >
          <Form.Item
            name="email"
            rules={FormValidate({type: 'email', name: '邮箱'})}
          >
            <Input 
              prefix={<span className="mio-icon-tubiao209 iconfont custom-icon" />} 
              maxLength={40} 
              bordered={false}
              allowClear={true} 
              placeholder="邮箱" 
            />
          </Form.Item>
          <Form.Item>
            <div className="flex-code">
              <Form.Item
                  name="emailCode"
                  rules={FormValidate({type:'code', name: '邮箱验证码'})}
                >
                <Input 
                  prefix={<ArrowRightOutlined className="custom-icon" />}
                  style={{ width: '280px' }} 
                  maxLength={4} 
                  bordered={false}
                  allowClear={true} 
                  placeholder="邮箱验证码" 
                />
              </Form.Item>  
              <div className="code-show" onClick={emailChange}>
                <Button type="primary" shape="round" disabled={emailObj.disabled} size = 'large'>{emailObj.txt}</Button>
              </div>
            </div>
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
          <Form.Item
            name="confirPwd"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请输入确认密码',
              },
              {
                min: 6, max: 16, message: `字符长度为6-16个字符`
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value || value.length < 6) {
                    return Promise.resolve();
                  }
                  return Promise.reject('确认密码和密码不一致');
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<span className="mio-icon-mima iconfont custom-icon" />}
              type="password"
              maxLength={16}
              allowClear={true}
              bordered={false}
              placeholder="确认密码"
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
          <Button className="login-btn" htmlType="submit" loading={forgetLoading} onClick={forgetSubmit}>提交</Button>
          <Button className="register-btn" onClick={backLogin}>返回登录</Button>
        </Form>
      </div>
    </div>
  </div>;
};

export default Forget;
