let countNum = /^\d+$|^\d+[.]?\d+$/;
let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i;
let phoneReg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
let alphabetReg = /^[A-Za-z]+$/;

let FormValidate = (function () {
  function FormValidate() {}
  // From表单验证规则  可用于公用的校验部分
  FormValidate.Form =  function(arg,arg2){
    return {
      // 数字验证
      Count: (rule, value, callback) => {
        if (value === '' || value === undefined || value === null) {
          callback(new Error('请输入' + (arg || '数据')))
        }else if(!countNum.test(value)) {
          callback(new Error('请输入数字'))
        }else {
          callback()
        }
      },
      //不为空
      NoEmpty: (rule, value, callback) => {
        if (value === '' || value === undefined  || value === null) {
          callback(new Error('请输入' + (arg || '数据')))
        }else{
          callback()
        }
      },
      // 确定4个数验证码
      FourCode: (rule, value, callback) => {
        if (value === "" || value === undefined  || value === null) {
          callback(new Error("请输入" + (arg || '验证码')));
        } else if (value.length !== 4) {
          callback(new Error((arg || '验证码')+"长度为4个字符"));
        }else {
          callback();
        }
      },
      // 确定6个数验证码
      SixCode: (rule, value, callback) => {
        if (value === "" || value === undefined  || value === null) {
          callback(new Error("请输入" + (arg || '验证码')));
        } else if (value.length !== 6) {
          callback(new Error((arg || '验证码')+"长度为6个字符"));
        }else {
          callback();
        }
      },
      // 密码验证
      Password: (rule, value, callback) => {
        if (value === "" || value === undefined  || value === null) {
          callback(new Error("请输入" + (arg || '密码')));
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error((arg || '密码')+"字符长度为6-16个字符"));
        }else {
          callback();
        }
      },
      // 邮箱验证
      Email: (rule, value, callback) => {
        if (value === '' || value === undefined  || value === null) {
          callback(new Error('请输入邮箱'))
        }else if(!emailReg.test(value)) {
          callback(new Error('邮箱格式不正确'))
        }else {
          callback()
        }
      },
      // 首字母英文
      Letter: (rule, value, callback) => {
        if (value === '' || value === undefined  || value === null) {
          callback(new Error('请输入' + (arg || '数据')))
        }else if(!alphabetReg.test(value)) {
          callback(new Error('请输入英文'))
        } else {
          callback()
        }
      },
      // 手机验证
      Phone: (rule, value, callback) => {
        if (value === '' || value === undefined  || value === null) {
          callback();
        } else if (value.length !== 11) {
          callback(new Error('请输入11位数字号码'));
        } else if (!phoneReg.test(value)) {
          callback(new Error('手机号码格式不正确'));
        } else {
          callback();
        }
      },
      //不为空，用于选择器和数组
      TypeSelect: (rule, value, callback) => {
        let arr = value instanceof Array;
        if(arr){
          if (value.length === 0) { 
            callback(new Error('请至少选择一个' + (arg || '数据')))
          }else{
            callback()
          }
        }else{
          if (value === '' || value === undefined  || value === null) {
            callback(new Error('请选择' + (arg || '数据')))
          }else{
            callback()
          }
        }
      }
    }
  }
  return FormValidate
}())
export default {
  FormValidate,
  emailReg,
  phoneReg
}