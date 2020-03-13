/**
* @Author: 李晨光
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  忘记密码页
</comment>
<template>
  <div id="ForgotPwd">
    <a-skeleton :loading="loading">
      <div style="width: 100%;height: 100%;">
        <div class="m-b-20 flex align-center justify-between">
          <a-button @click="$router.back()" ghost> <a-icon type="left" />返回</a-button>
          <div class="flex align-center">
            <img style="width: 240px ;height: 30px;" src="../assets/image/logo.png" alt=""> <span
            class="m-l-20 m-r-20" style="font-size: 26px;color: #fff;">|</span> <span
            style="font-size: 20px;color: #fff;">忘记密码</span>
          </div>

        </div>
        <div style="width: 100%;background: #fff;height: 100%;padding: 8% 15%;min-width: 500px;">
          <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
          </a-steps>
          <div class="steps-content flex justify-center">
            <div class="form">
              <!--  <a-form
                  v-show="current == 0"
                  :form="accountForm"
                >
                  <a-row :gutter="20">
                    <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                      <a-form-item
                        label="账号"
                        :validate-status="formError(accountForm,'account') ? 'error' : ''"
                        :help="formError(accountForm,'account') || ''"
                      >
                        <a-input
                          size="large"
                          placeholder="请输入手机号/员工号"
                          v-decorator="[
                          'account',
                          {rules: [
                            { required: true, message: '请输入手机号/员工号！' },
                            { pattern: Util.tel,  message: '请输入正确的手机号/员工号!' }
                          ]
                        }
                      ]"/>
                      </a-form-item>
                      <a-form-item
                        label="验证码"
                        :validate-status="formError(accountForm,'imgCode') ? 'error' : ''"
                        :help="formError(accountForm,'imgCode') || ''"
                      >
                        <a-input
                          style="width: 194px;"
                          size="large"
                          placeholder="请输入图形验证码"
                          v-decorator="[
                          'imgCode',
                          {rules: [
                            { required: true, message: '请输入图形验证码！' },
                            { pattern: Util.tel,  message: '请输入正确的图形验证码!' }
                          ]
                        }]"/>
                        <img
                          style="width: 100px;height: 40px;display: inline-block;margin-left: 6px;margin-top:-6px;border: none;"
                          @click="refreshVerificationCode"/>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>-->
              <a-form
                v-show="current == 0"
                :form="valiForm"
              >
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <!--<a-form-item
                      label="手机号"
                    >
                      <div style="text-align: center;font-size: 25px;">{{ valiFormParams.phoneNumber | formateTel}}</div>
                    </a-form-item>-->
                    <a-form-item
                      label="手机号"
                      :validate-status="formError(valiForm,'phoneNumber') ? 'error' : ''"
                      :help="formError(valiForm,'phoneNumber') || ''"
                    >
                      <a-input
                        placeholder="请输入手机号"
                        v-decorator="[
                      'phoneNumber',
                      {rules: [
                        { required: true, message: '请输入手机号！' },
                        { pattern: Util.tel,  message: '请输入正确的手机号!' }
                      ]
                    }
                  ]"/>
                    </a-form-item>
                    <a-form-item
                      label="验证码"
                      :validate-status="formError(valiForm,'code') ? 'error' : ''"
                      :help="formError(valiForm,'code') || ''"
                    >
                      <div class="flex">
                        <a-input
                          placeholder="请输入手机验证码"
                          v-decorator="[
                          'code',
                          {rules: [
                            { required: true, message: '请输入手机验证码！' }
                          ]
                        }
                      ]"/>
                        <a-button type="link" @click="sendAuthCodeCountDown" :disabled="valiForm.getFieldError('phoneNumber') ? true : false">{{ sendBtn }}</a-button>

                      </div>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <a-form
                v-show="current == 1"
                :form="pwdForm"
              >
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <a-form-item
                      label="输入密码"
                      :validate-status="formError(pwdForm,'password') ? 'error' : ''"
                      :help="formError(pwdForm,'password') || ''"
                    >
                      <a-input
                        type="password"
                        placeholder="请输入密码"
                        v-decorator="[
                      'password',
                      {rules: [
                        { required: true, message: '请输入8-14位字符，包含数字、字母和符号组合！' },
                        { pattern: Util.password, message: '请输入8-14位字符，包含数字、字母和符号组合!' },
                        { validator: validateToNextPassword }
                      ]
                    }
                  ]"/>
                    </a-form-item>
                    <a-form-item
                      label="再次输入密码"
                      :validate-status="formError(pwdForm,'passportPwd') ? 'error' : ''"
                      :help="formError(pwdForm,'passportPwd') || ''"
                    >
                      <a-input
                        type="password"
                        @blur="handleConfirmBlur"
                        placeholder="请再次输入密码"
                        v-decorator="[
                      'passportPwd',
                      {rules: [
                        { required: true, message: '请输入8-16位字符，包含数字、字母和符号组合！' },
                        { pattern: Util.password, message: '请输入8-16位字符，包含数字、字母和符号组合!' },
                        { validator: compareToFirstPassword}
                      ]
                    }
                  ]"/>
                    </a-form-item>
                    <a-form-item
                      style="text-align: end"
                    >
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
              <a-form v-show="current == 2">
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <div class="flex align-center justify-center ">
                      <icon-font style="color:#72D59A;font-size: 40px" class="m-r-15"
                                 type="spm-icon-check-circle"></icon-font>
                      <span style="font-size:25px;line-height:36px">密码重置成功</span>
                    </div>
                    <div class="flex align-center justify-center m-t-15" style="margin-bottom: 44px">
                      <span style="font-size:14px;">{{ backCountDown }}s后返回登录页面</span>
                    </div>
                    <div class="flex align-center justify-center">
                      <a @click="$router.push('/login')">立即返回</a>
                    </div>
                  </a-col>
                </a-row>
              </a-form>
              <!-- <a-button
                 size="large"
                 :disabled="hasErrors(accountForm.getFieldsError())"
                 v-show="false"
                 type="primary" @click="next"
                 block
               >
                 下一步
               </a-button>-->
              <a-button
                class="m-t-20"
                :disabled="hasErrors(valiForm.getFieldsError())"
                v-show="current == 0"
                type="primary" @click="next"
                block
              >
                下一步
              </a-button>

              <a-button
                :disabled="hasErrors(pwdForm.getFieldsError())"
                v-show="current == steps.length - 2"
                type="primary" @click="next"
                block
              >
                确 认
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-skeleton>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'
  export default {
    name: 'ForgotPwd',
    components: {},
    props: {},
    data() {
      return {
        api: {
          getImgValidateCodeApi: '',// 获取图形验证码
          getTelValidateCodeApi: Util.passportServer + '/web/user/send-recover-password-code',// 获取手机短信验证码
          getUserMsgByAccountMsgApi: '', // 通过账号信息获取用户信息
          validateTelMsgApi: Util.passportServer + '/web/user/verify-recover-password-code', // 验证手机号
          resetPwdApi: Util.passportServer + '/web/user/update-pwd', // 重置密码
        },
        Util, // 公用方法
        loading: true,
        current: 0,
        steps: [
        //   {
        //   title: '验证账号',
        // },
          {
          title: '验证手机号',
        }, {
          title: '重置密码',
        }, {
          title: '完成',
        }],
        accountForm: this.$form.createForm(this), // 账号form
        valiForm: this.$form.createForm(this),// 验证手机号form
        pwdForm: this.$form.createForm(this),// 密码form
        accountFormParams: { // 账号参数
          account: '',
          imgCode: '',
        },
        accountRes: { // 手机号获取的账户信息
          passportId: ''
        },
        valiFormParams: { // 验证手机号参数
          phoneNumber: '',
          code: ''
        },
        pwdFormParams: { // 密码参数
          password: '',
          repeatePwd: ''
        },
        confirmDirty: false, // 二次密码确认
        countDown: 60, //计时器的初始值
        sendAuthCode: false,// 是否已发送过短信息
        sendBtn: "发送验证码至手机", // 发送短信息按钮
        verification_code: '../static/man_2.jpg',
        backCountDown: 3, //计时器的初始值
      }
    },
    computed: {},
    created() {
      Cookie.remove('sessions')
    },
    mounted() {
      this.$nextTick(() => {
        this.accountForm.validateFields();
        this.valiForm.validateFields();
        this.pwdForm.validateFields();
      })
      this.loading = false
    },
    watch: {},
    methods: {
      next() {
        switch (this.current) {
          /*case 0:
            this.getUserMsgByAccountMsg(() => {
              this.current++
            })
            break;
          case 1:
            this.validateTelMsg(() => {
              this.current++
            })
            break;
          case 2:
            this.resetPwd(() => {
              this.current++
              this.sendBackCountDown()
            })
            break*/
          case 0:
            this.validateTelMsg(() => {
              this.current++
            })
            break;
          case 1:
            this.resetPwd(() => {
              this.current++
              this.sendBackCountDown()
            })
            break;
        }
      },
      prev() { // 上一步
        this.current--
      },
      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        console.log(Object.keys(fieldsError).some(field => fieldsError[field]))
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      // 验证密码
      compareToFirstPassword(rule, value, callback) {
        const form = this.pwdForm;
        if (value && value.length >= 8 && value.length <= 16 && value !== form.getFieldValue('password')) {
          callback('您输入的两个密码不一致!');
        } else {
          callback();
        }
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.pwdForm;
        if (value && this.confirmDirty) {
          form.validateFields(['passportPwd'], {force: true});
        }
        callback();
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      /**
       *  通过账号获取用户信息
       */
      getUserMsgByAccountMsg(callback) {
        this.accountForm.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.accountFormParams, values)
            this.$get(this.api.getUserMsgByAccountMsgApi, this.accountFormParams)
              .then((response) => {
                this.loading = false
                Util.processRes(response, () => {

                  callback && callback()
                })
                Util.processError(this, response);
              })
              .catch((err) => {
                this.loading = false
              })
          }
        })

      },
      /**
       *  验证手机号码
       */
      validateTelMsg(callback) {
        this.valiForm.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            Object.assign(this.valiFormParams, values)
            this.$postParams(this.api.validateTelMsgApi, this.valiFormParams)
              .then((response) => {
                this.loading = false
                Util.processRes(response, () => {
                  this.accountRes.passportId = response.data.passportVO.id
                  callback && callback()
                })
                Util.processError(this, response);
              })
              .catch((err) => {
                this.loading = false
              })
          }
        })
      },
      /**
       *  重置密码
       */
      resetPwd(callback) {
        this.pwdForm.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.pwdFormParams, values)
            this.$post(this.api.resetPwdApi, {
              id: this.accountRes.passportId,
              passportPwd: this.pwdFormParams.passportPwd
            })
              .then((response) => {
                this.loading = false
                Util.processRes(response, () => {
                  callback && callback()
                })
                Util.processError(this, response);
              })
              .catch((err) => {
                this.loading = false
              })
          }
        })
      },
      /**
       * 获图形验证码
       */
      refreshVerificationCode() {
        this.$get(this.api.getImgValidateCodeApi)
          .then((response) => {
            this.loading = false
            Util.processRes(response, (res) => {
              this.verification_code = res
            })
          })
          .catch((err) => {
            this.loading = false
          })
      },
      /**
       * 发送手机验证码倒计时
       */
      sendAuthCodeCountDown() {
        if (!this.sendAuthCode) {
          this.$postParams(this.api.getTelValidateCodeApi, {phoneNumber: this.valiForm.getFieldValue('phoneNumber')})
            .then((response) => {
              this.loading = false
              Util.processRes(response, () => {
                this.$message.success("已发送短信，请注意查收！")
                if (!this.sendAuthCode) {
                  this.sendAuthCode = true
                  Util.countDown(60, (res) => {
                    this.countDown = res
                    this.sendBtn = this.countDown + 's后重新发送'
                  }, () => {
                    this.sendBtn = '重新发送'
                    this.sendAuthCode = false
                  })
                }
              })
              Util.processError(this, response);
            })
            .catch((err) => {
              this.loading = false
            })
        }

      },
      /**
       * 跳转页面倒计时
       */
      sendBackCountDown() {
        Util.countDown(3, (res) => {
          this.backCountDown = res
        }, () => {
          this.$router.push('/login')
        })
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #ForgotPwd {
    background: url('../assets/image/login/changpwd-bg.png') no-repeat;
    background-size: 100% 100%;
    height: 100%;
    min-width: 800px;
    min-height: 567px;
    padding: 5% 20% 15%;
    margin: 0 auto;
    .steps-content {
      padding-top: 10%;
      .form {
        max-width: 300px;
      }
    }
    /*.ant-steps-item-finish {
      .ant-steps-item-icon {
        @include primary_bg_color();
        @include primary_border_color();
        color:#fff;
      }
    }
    .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
      color: #fff;
    }*/
  }
</style>
