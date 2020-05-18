<template>
  <div class="wrapper">
    <vue-particles color="#fff" :particleOpacity="0.5" :particlesNumber="30" class="index-particles">
    </vue-particles>
    <div class="index-box">
      <div class="box-login animated  fadeInUp" v-show='showBox === "login"' @keyup.enter='handleLogin'>
        <my-form :ref='loginForm.ref' :formConfig="loginForm">
          <div slot='randomCode' class='code-show'>
            <el-image :src="codeImg" alt='验证码' @click.native='codeChange'>
            </el-image>
          </div>
        </my-form>
        <div class="login-operate">
          <div class="operate-remeber">
            <el-checkbox v-model="rememberBool">记住我</el-checkbox>
          </div>
          <div class="operate-forget" @click='goForget'>
            忘记密码？
          </div>
        </div>
        <div class="login-btn" @click='handleLogin'>登录</div>
        <div class="register-btn" @click='goRegister'>注册</div>
      </div>
      <div class="box-login animated  fadeInUp" v-show='showBox === "register"' @keyup.enter='handleRegister'>
        <my-form :ref='registerForm.ref' :formConfig="registerForm">
          <div slot='emailCode' :class="emailCode.emailStatus?'email-code':'email-code email-ban'"
            @click='getEmailCode'>
            {{emailCode.emailTxt}}
          </div>
          <div slot='randomCodes' class='code-show'>
            <el-image :src="codeImg" alt='验证码' @click.native='codeChange'>
            </el-image>
          </div>
        </my-form>
        <div class="login-btn" @click='handleRegister'>注册</div>
        <div class="register-btn" @click='backLogin'>返回</div>
      </div>
      <div class="box-login animated  fadeInUp" v-show='showBox === "forget"' @keyup.enter='handleForget'>
        <my-form :ref='forgetForm.ref' :formConfig="forgetForm">
          <div slot='emailCode' :class="emailCode.emailStatus?'email-code':'email-code email-ban'"
            @click='getEmailCode'>
            {{emailCode.emailTxt}}
          </div>
          <div slot='randomCodes' class='code-show'>
            <el-image :src="codeImg" alt='验证码' @click.native='codeChange'>
            </el-image>
          </div>
        </my-form>
        <div class="login-btn" @click='handleForget'>提交</div>
        <div class="register-btn" @click='backLogin'>返回</div>
      </div>
    </div>
  </div>
</template>

<script>
import MyForm from "@/components/MyForm";
import Format from "@/utils/format.js";
import { timeLocalStorage } from "@/utils/utils.js";
export default {
  data() {
    const validatePwdCheck = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入确认密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("确认密码字符长度为6-16个字符"));
      } else if (value != this.registerForm.formModel.password) {
        callback(new Error("确认密码和密码不一致"));
      } else {
        callback();
      }
    };
    const validatePwdChecks = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error("请输入确认密码"));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error("确认密码字符长度为6-16个字符"));
      } else if (value != this.forgetForm.formModel.password) {
        callback(new Error("确认密码和密码不一致"));
      } else {
        callback();
      }
    };
    return {
      showBox: "login",
      rememberBool: false,
      emailCode: {
        emailTxt: "获取验证码",
        emailTime: 60,
        emailStatus: true
      },
      codeImg: `${this.$baseURL}/user/getCode?t=${new Date().getTime()}`,
      loginForm: {
        ref: "loginRef",
        marginBottom: "25px",
        formItemList: [
          {
            type: "text",
            prop: "name",
            prefix: "mio-icon-yonghu",
            placeholder: "用户名或邮箱"
          },
          {
            type: "password",
            prop: "password",
            prefix: "mio-icon-mima",
            placeholder: "密码"
          },
          {
            type: "code",
            prop: "code",
            width: "280px",
            prefix: "mio-icon-yanzhengma",
            placeholder: "验证码",
            codeSlot: "randomCode"
          }
        ],
        formModel: {
          name: "",
          password: "",
          code: ""
        },
        rules: {
          name: [
            {
              required: true,
              validator: Format.FormValidate.Form("用户名或邮箱").NoEmpty,
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              validator: Format.FormValidate.Form("密码").Password,
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              validator: Format.FormValidate.Form("验证码").FourCode,
              trigger: "blur"
            }
          ]
        }
      },
      registerForm: {
        ref: "registerRef",
        marginBottom: "25px",
        formItemList: [
          {
            type: "text",
            prop: "email",
            prefix: "mio-icon-tubiao209",
            placeholder: "邮箱"
          },
          {
            type: "code",
            prop: "emailCode",
            width: "280px",
            prefix: "el-icon-right",
            placeholder: "邮箱验证码",
            codeSlot: "emailCode"
          },
          {
            type: "text",
            prop: "name",
            prefix: "mio-icon-yonghu",
            placeholder: "用户名"
          },
          {
            type: "text",
            prop: "phone",
            prefix: "el-icon-mobile-phone",
            placeholder: "手机号码（选填）"
          },
          {
            type: "password",
            prop: "password",
            prefix: "mio-icon-mima",
            placeholder: "密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            prefix: "mio-icon-mima",
            placeholder: "确认密码"
          },
          {
            type: "code",
            prop: "code",
            width: "280px",
            prefix: "mio-icon-yanzhengma",
            placeholder: "验证码",
            codeSlot: "randomCodes"
          }
        ],
        formModel: {
          name: "",
          email: "",
          emailCode: "",
          phone: "",
          password: "",
          confirPwd: "",
          code: ""
        },
        rules: {
          name: [
            {
              required: true,
              validator: Format.FormValidate.Form("用户名").NoEmpty,
              trigger: "blur"
            }
          ],
          email: [
            {
              required: true,
              validator: Format.FormValidate.Form("邮箱").Email,
              trigger: "blur"
            }
          ],
          emailCode: [
            {
              required: true,
              validator: Format.FormValidate.Form("邮箱验证码").FourCode,
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              validator: Format.FormValidate.Form("密码").Password,
              trigger: "blur"
            }
          ],
          confirPwd: [
            { required: true, validator: validatePwdCheck, trigger: "blur" }
          ],
          code: [
            {
              required: true,
              validator: Format.FormValidate.Form("验证码").FourCode,
              trigger: "blur"
            }
          ]
        }
      },
      forgetForm: {
        ref: "forgetRef",
        marginBottom: "25px",
        formItemList: [
          {
            type: "text",
            prop: "email",
            prefix: "mio-icon-tubiao209",
            placeholder: "邮箱"
          },
          {
            type: "code",
            prop: "emailCode",
            width: "280px",
            prefix: "el-icon-right",
            placeholder: "邮箱验证码",
            codeSlot: "emailCode"
          },
          {
            type: "password",
            prop: "password",
            prefix: "mio-icon-mima",
            placeholder: "密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            prefix: "mio-icon-mima",
            placeholder: "确认密码"
          },
          {
            type: "code",
            prop: "code",
            width: "280px",
            prefix: "mio-icon-yanzhengma",
            placeholder: "验证码",
            codeSlot: "randomCodes"
          }
        ],
        formModel: {
          email: "",
          emailCode: "",
          password: "",
          confirPwd: "",
          code: ""
        },
        rules: {
          email: [
            {
              required: true,
              validator: Format.FormValidate.Form("邮箱").Email,
              trigger: "blur"
            }
          ],
          emailCode: [
            {
              required: true,
              validator: Format.FormValidate.Form("邮箱验证码").FourCode,
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              validator: Format.FormValidate.Form("密码").Password,
              trigger: "blur"
            }
          ],
          confirPwd: [
            { required: true, validator: validatePwdChecks, trigger: "blur" }
          ],
          code: [
            {
              required: true,
              validator: Format.FormValidate.Form("验证码").FourCode,
              trigger: "blur"
            }
          ]
        }
      }
    };
  },
  created() {},
  mounted() {
    this.storgeInit();
  },
  methods: {
    storgeInit() {
      sessionStorage.getItem("token")
        ? sessionStorage.removeItem("token")
        : null;
      if (timeLocalStorage.getItem("remember")) {
        this.loginForm.formModel.name = timeLocalStorage.getItem("name")
          ? timeLocalStorage.getItem("name")
          : "";
        let pwd = timeLocalStorage.getItem("pwd");
        let password = "";
        if (pwd) {
          let str =
            pwd.slice(1, 4) + pwd.slice(5, 7) + pwd.slice(8, pwd.length - 1);
          password = this.$Base64.decode(str);
        }
        this.loginForm.formModel.password = password;
        this.rememberBool = true;
      }
    },
    codeChange() {
      this.codeImg = `${this.$baseURL}/user/getCode?t=${new Date().getTime()}`;
      this.loginForm.formModel.code = "";
      this.registerForm.formModel.code = "";
      this.forgetForm.formModel.code = "";
    },
    goRegister() {
      if (this.$refs["registerRef"]) {
        this.$refs["registerRef"].$refs["registerRef"].resetFields();
      }
      this.codeChange();
      this.showBox = "register";
    },
    goForget() {
      if (this.$refs["forgetRef"]) {
        this.$refs["forgetRef"].$refs["forgetRef"].resetFields();
      }
      this.codeChange();
      this.showBox = "forget";
    },
    backLogin() {
      if (this.$refs["loginRef"]) {
        this.$refs["loginRef"].$refs["loginRef"].resetFields();
      }
      this.storgeInit();
      this.codeChange();
      this.showBox = "login";
    },
    getEmailCode() {
      let emailCode = this.emailCode;
      let email =
        this.showBox === "register"
          ? this.registerForm.formModel.email
          : this.forgetForm.formModel.email;
      if (Format.emailReg.test(email)) {
        if (emailCode.emailStatus) {
          let interval = setInterval(() => {
            emailCode.emailTime--;
            emailCode.emailTxt = `重新获取${emailCode.emailTime}s`;
            emailCode.emailStatus = false;
            if (emailCode.emailTime <= 0) {
              clearInterval(interval);
              emailCode.emailTime = 60;
              emailCode.emailTxt = "获取验证码";
              emailCode.emailStatus = true;
            }
          }, 1000);
          this.$api.user
            .sendEmail({
              email: email,
              type: this.showBox === "register" ? "add" : "update"
            })
            .then(res => {
              let code = res.code;
              if (code === this.$constant.reqSuccess) {
                this.$message.success("邮件发送成功");
              } else if (code === this.$constant.dataAlready) {
                this.$message.warning("该邮箱账号已存在，请直接登录");
                clearInterval(interval);
                emailCode.emailTime = 60;
                emailCode.emailTxt = "获取验证码";
                emailCode.emailStatus = true;
              } else if (code === this.$constant.dataNot) {
                this.$message.warning("该邮箱账号不存在");
                clearInterval(interval);
                emailCode.emailTime = 60;
                emailCode.emailTxt = "获取验证码";
                emailCode.emailStatus = true;
              } else {
                this.$message.warning("邮件发送失败");
              }
            });
        } else {
          this.$message.warning(`请${emailCode.emailTime}s后再获取验证码`);
        }
      } else {
        this.$message.warning("请输入正确的邮箱账号");
      }
    },
    handleLogin() {
      let formModel = this.loginForm.formModel;
      this.$refs["loginRef"].$refs["loginRef"].validate(valid => {
        if (valid) {
          this.$api.user
            .login({
              name: formModel.name,
              password: formModel.password,
              randomCode: formModel.code
            })
            .then(res => {
              let code = res.code;
              if (code === this.$constant.reqSuccess) {
                if (this.rememberBool === true) {
                  let str = this.$Base64.encode(formModel.password);
                  let pwd =
                    "S" +
                    str.slice(0, 3) +
                    "0" +
                    str.slice(3, 5) +
                    "7" +
                    str.slice(5) +
                    "j";
                  timeLocalStorage.setItem("remember", "remember", 15);
                  timeLocalStorage.setItem("name", formModel.name, 15);
                  timeLocalStorage.setItem("pwd", pwd, 15);
                } else {
                  if (timeLocalStorage.getItem("remember")) {
                    localStorage.removeItem("remember");
                    localStorage.removeItem("name");
                    localStorage.removeItem("pwd");
                  }
                }
                sessionStorage.setItem("token", "Bearer " + res.data.token);
                sessionStorage.setItem(
                  "userInfo",
                  JSON.stringify(res.data.user)
                )
                let redirect = this.$route.query.redirect
                  ? this.$route.query.redirect
                  : "";
                this.$router.push({ path: redirect || "/" });
              } else if (code === this.$constant.randomFail) {
                this.$message.warning("随机验证码错误或超过有效期10分钟");
                this.codeChange();
              } else if (code === this.$constant.dataFail) {
                this.$message.warning("邮箱或用户名不存在");
                this.loginForm.formModel.name = "";
              } else if (code === this.$constant.statusFail) {
                this.$message.warning(
                  "该用户处于禁用状态，请联系管理员启用该账号"
                );
                this.codeChange();
              } else if (code === this.$constant.pwdFail) {
                this.$message.warning("密码错误");
                this.loginForm.formModel.password = "";
              } else {
                this.$message.warning("登录失败");
              }
            });
        } else {
          this.$message.warning("信息校验失败");
        }
      });
    },
    handleRegister() {
      let formModel = this.registerForm.formModel;
      this.$refs["registerRef"].$refs["registerRef"].validate(valid => {
        if (valid) {
          this.$api.user
            .register({
              email: formModel.email,
              emailCode: formModel.emailCode,
              name: formModel.name,
              phone: formModel.phone,
              password: formModel.password,
              randomCode: formModel.code
            })
            .then(res => {
              let code = res.code;
              if (code === this.$constant.reqSuccess) {
                this.$message.success("账号注册成功，请登录");
                this.backLogin();
              } else if (code === this.$constant.randomFail) {
                this.$message.warning("随机验证码错误或超过有效期10分钟");
                this.codeChange();
              } else if (code === this.$constant.dataAlready) {
                this.$message.warning("该用户名已存在");
                formModel.name = "";
              } else if (code === this.$constant.codeFail) {
                this.$message.warning("邮箱验证码错误");
                formModel.emailCode = "";
              } else if (code === this.$constant.timeOver) {
                this.$message.warning("邮箱验证码有效时间为10分钟");
                formModel.emailCode = "";
              } else {
                this.$message.warning("账号注册失败");
              }
            });
        } else {
          this.$message.warning("信息校验失败");
        }
      });
    },
    handleForget() {
      let formModel = this.forgetForm.formModel;
      this.$refs["forgetRef"].$refs["forgetRef"].validate(valid => {
        if (valid) {
          this.$api.user
            .resetPwd({
              email: formModel.email,
              emailCode: formModel.emailCode,
              password: formModel.password,
              randomCode: formModel.code
            })
            .then(res => {
              let code = res.code;
              if (code === this.$constant.reqSuccess) {
                this.$message.success("密码重置成功，请登录");
                this.backLogin();
              } else if (code === this.$constant.randomFail) {
                this.$message.warning("随机验证码错误或超过有效期10分钟");
                this.codeChange();
              } else if (code === this.$constant.dataFail) {
                this.$message.warning("邮箱不存在");
                formModel.email = "";
              } else if (code === this.$constant.codeFail) {
                this.$message.warning("邮箱验证码错误");
                formModel.emailCode = "";
              } else if (code === this.$constant.timeOver) {
                this.$message.warning("邮箱验证码有效时间为10分钟");
                formModel.emailCode = "";
              } else {
                this.$message.warning("密码重置失败");
              }
            });
        } else {
          this.$message.warning("信息校验失败");
        }
      });
    }
  },
  watch: {},
  components: {
    MyForm
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../../assets/img/loginBg.jpg) no-repeat;
  background-color: $color-C33;
  background-size: cover;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: $color-C33;
    opacity: 0.5;
  }
  .index-particles {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .index-box {
    position: relative;
    z-index: 3;
    .box-login {
      width: 560px;
      background-color: $color-D20;
      padding: 40px 50px;
      .code-show {
        height: 60px;
        cursor: pointer;
      }
      .email-code {
        padding: 3px 15px;
        background-color: $color-B70;
        letter-spacing: 1px;
        color: $color-W70;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
      }
      .email-ban {
        background-color: $color-G70;
        cursor: not-allowed;
      }
      .login-operate {
        color: $color-W70;
        margin-bottom: 30px;
        letter-spacing: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        /deep/ .operate-remeber {
          .el-checkbox__inner {
            background-color: transparent;
          }
          .is-focus {
            .el-checkbox__inner {
              border-color: $color-C60;
            }
          }
          .is-checked {
            .el-checkbox__inner {
              background-color: $color-B90;
              border-color: $color-B90;
            }
          }
          .el-checkbox__label {
            color: $color-W70;
            &:hover {
              color: $color-B90;
            }
          }
        }
        .operate-forget {
          cursor: pointer;
        }
      }
      .login-btn,
      .register-btn {
        width: 100%;
        font-size: 16px;
        padding: 10px 0;
        border-radius: 8px;
        text-align: center;
        color: $color-W90;
        letter-spacing: 2px;
        cursor: pointer;
      }
      .login-btn {
        background-color: $color-GN50;
        margin-bottom: 30px;
        &:hover {
          background-color: $color-GN30;
        }
      }
      .register-btn {
        background-color: $color-B70;
        &:hover {
          background-color: $color-B90;
        }
      }
    }
  }
  /deep/ .el-form-item {
    .el-input__inner {
      background-color: $transparent;
      color: $color-W70;
      border: none;
      border-radius: 0;
      padding-left: 40px;
      border-bottom: 1px solid $color-W70;
    }
    &.is-error {
      .el-input__inner {
        border-color: $color-R40;
      }
    }
    .custom-icon {
      font-size: 20px;
    }
  }
}
</style>
