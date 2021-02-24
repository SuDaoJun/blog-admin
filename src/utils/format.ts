// let countNum = /^\d+$|^\d+[.]?\d+$/;
export let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
let phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
// let alphabetReg = /^[A-Za-z]+$/;

interface dataProps {
  type?: string,
  name?: string,
  emptyBool?: Boolean,  //是否选填，如果为true则选填，可空
  require?: Boolean,  //是否需要校验，动态控制校验
}

export let FormValidate = (data:dataProps):any[]=>{
  let arr:any[];
  let { type, name, emptyBool, require} = data;
  if(type === 'password'){
    if(require){
      arr = [
        { required: true, type: 'string', message: `请输入${name}` },
        { min: 6, max: 16, message: `字符长度为6-16个字符` }
      ]
    }else{
      arr = []
    }
  }else if(type === 'email'){
    arr = [
      { required: true, type: 'string', message: `请输入${name}` },
      { pattern: emailReg, message: `邮箱格式不正确` }
    ]
  }else if(type === 'phone'){
    if(emptyBool){
      arr = [
        { pattern: phoneReg, message: `手机号码格式不正确` },
      ]
    }else{
      arr = []
    }
  }else if(type === 'code'){
    arr = [
      { required: true, type: 'string', message: `请输入${name}` },
      { min: 4, max: 4, message: `验证码长度为4个字符` }
    ]
  }else if(type === 'array'){
    arr = [
      { required: true,  message: `请选择${name}` },
    ]
  }else{
    arr = [{ required: true, type: 'string', message: `请输入${name}` }]
  }
  return arr;
}