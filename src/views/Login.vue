/**
* @Author: 李晨光
* @Date: 2019/7/2
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/2
**/
<comment>
  # 组件注释
  登录页——租户登录
</comment>
<template>
  <div id="Login" class="flex">
    <div class="ad">
      <a-carousel arrows class="ad-swiper">
        <div
          slot="prevArrow" slot-scope="props"
          class="custom-slick-arrow"
          style="left: 30px;color: #fff;zIndex: 1;font-size: 48px"
        >
          <a-icon type="left"/>
        </div>
        <div
          slot="nextArrow" slot-scope="props"
          class="custom-slick-arrow"
          style="right: 58px;color: #fff;font-size: 48px"
        >
          <a-icon type="right"/>
        </div>
        <img style="width: 100%;height: 100%;min-width: 1080px;" src="../assets/image/login/swiper4.png" alt="">
        <img style="width: 100%;height: 100%;min-width: 1080px;" src="../assets/image/login/swiper.jpg" alt="">
      </a-carousel>
    </div>
    <div class="login-box flex">
      <a-row type="flex" justify="center" align="middle" style="width: 100%;">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-form
            v-if="isAccount"
            class="user-layout-login"
            hideRequiredMark
            ref="accountForm"
            :form="accountForm"
          >
            <a-form-item style="margin-bottom: 40px;text-align: center;">
              <img style="width: 240px ;height: 33px;" src="../assets/image/login/loginTitle.png" alt="">
            </a-form-item>
            <a-form-item style="margin-bottom: 67px;text-align: center;color: #303030;">
              登录到您的账户
            </a-form-item>

            <a-form-item label="账号">
              <a-input
                size="large"
                type="text"
                autocomplete="false"
                placeholder=""
                @keyup.enter="login"
                v-decorator="[
                'account',
                {rules: [{ required: true, message: '请输入帐号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>

            <a-form-item :label="$t('message.password')">
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                placeholder=""
                @keyup.enter="login"
                v-decorator="[
                'passportPwd',
                {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
              ]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <div class="flex justify-between align-center" style="font-size: 12px">
                <a-checkbox :checked="rememberMe" @change="rememberMeChange"><span style="font-size: 12px">记住密码</span>
                </a-checkbox>
                <a @click="$router.push('/forgotPwd')">忘记密码了吗?</a>
              </div>
            </a-form-item>

            <a-form-item style="margin-top:24px">
              <a-button
                block
                size="large"
                type="primary"
                class="login-button"
                :loading="loading"
                :disabled="loading"
                @click="login(true)"
              >登 录
              </a-button>
            </a-form-item>
            <a-form-item style="margin-top:24px" class="flex align-center" @click="isAccount = !isAccount">
              <a @click="switchLoginType">手机号快捷登录</a>
            </a-form-item>
          </a-form>
          <a-form
            v-else
            class="user-layout-login"
            hideRequiredMark
            ref="telForm"
            :form="telForm"
          >
            <a-form-item style="margin-bottom: 40px;text-align: center;">
              <img style="width: 240px ;height: 33px;" src="../assets/image/login/loginTitle.png" alt="">
            </a-form-item>
            <a-form-item style="margin-bottom: 67px;text-align: center;color: #303030;">
              登录到您的账户
            </a-form-item>

            <a-form-item label="手机号">
              <a-input
                size="large"
                type="tel"
                autocomplete="false"
                placeholder="请输入手机号"
                @keyup.enter="login"
                v-decorator="[
                'account',
                {rules: [{ required: true, message: '请输入手机号' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}
              ]"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
            <!--<a-form-item
              label="图形验证码"
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
            </a-form-item>-->
            <a-form-item label="验证码">
              <a-input
                size="large"
                type="text"
                autocomplete="false"
                placeholder="请输入短信验证码"
                @keyup.enter="login"
                v-decorator="[
                'code',
                {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}
              ]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>


            <a-form-item>
              <div class="flex justify-end align-center" style="font-size: 12px">
                <a @click="sendAuthCodeCountDown()">{{ sendBtn }}</a>
              </div>
            </a-form-item>

            <a-form-item style="margin-top:24px">
              <a-button
                block
                size="large"
                type="primary"
                class="login-button"
                :loading="loading"
                :disabled="loading"
                @click="login"
              >登 录
              </a-button>
            </a-form-item>
            <a-form-item style="margin-top:24px" class="flex align-center">
              <a @click="switchLoginType">账号登录</a>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import Cookie from 'js-cookie'

  export default {
    name: 'Login',
    components: {},
    props: {},
    data() {
      return {
        Util,
        api: {
          valiAccountApi: Util.domain + Util.port + '', // 验证账号
          accountLoginApi: Util.passportServer + '/web/user/login-pwd', // 账号登录
          telLoginApi: Util.passportServer + '/web/user/login-code',// 手机号登录
          sendAuthCodeApi: Util.passportServer + '/web/user/send-code', // 发送手机短信
          getImgValidateCodeApi: Util.domain + Util.port + '', // 获取图形验证码
          getCurrOrgApi: Util.orgServer + '/web/org/detail', // 组织详情
          getResourceApi: Util.orgServer + '/web/resource/get-user-role-resource'
        },
        loading: false, //登录按钮加载状态
        accountForm: this.$form.createForm(this),
        telForm: this.$form.createForm(this),
        rememberMe: false,
        isAccount: true, // 是否为账号登录
        verification_code: '',
        countDown: 60, //计时器的初始值
        sendAuthCode: false,
        sendBtn: "发送验证码至手机",
      }
    },
    computed: {},
    created() {
      // form数据回填
      let account = Cookie.get('account')
      console.log(Cookie.get('rememberMe'))
      this.rememberMe = (Cookie.get('rememberMe') == 'false' ? false : true) || false
      let passportPwd = Cookie.get('passportPwd')
      let obj = {}
      if (this.rememberMe) {
        obj = {
          account: account,
          passportPwd: passportPwd,
        }
      } else {
        obj = {
          account: account,
        }
      }
      this.$nextTick(() => {
        this.accountForm.setFieldsValue(obj)
      })
    },
    mounted() {
    },
    watch: {},
    methods: {
      rememberMeChange() {
        this.rememberMe = !this.rememberMe
      },
      handleUsernameOrEmail(rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        callback()
      },
      // 问候语
      timeFix() {
        const time = new Date()
        const hour = time.getHours()
        return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
      },
      // 欢迎语
      welcome() {
        const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
        const index = Math.floor(Math.random() * arr.length)
        return arr[index]
      },
      /**
       * 登录
       * 两种loading状态
       * 1.按钮loading
       * 2.全局loading
       */
      login() {
        if (this.isAccount) {
          this.accountForm.validateFields((err, values) => {
            if (!err) {
              Cookie.remove('jwt')
              Cookie.remove('sessions')
              console.log('Received values of form: ', values);
              Cookie.set('account', values.account, {expires: 7})
              this.loginSubmit('account', {...values, accountType: 1})
            }
          });
        } else {
          this.telForm.validateFields((err, values) => {
            if (!err) {
              Cookie.remove('jwt')
              Cookie.remove('sessions')
              this.loginSubmit('tel', values)
              // console.log('Received values of form: ', values);

            }
          });
        }
      },
      // 提交登录信息
      loginSubmit(type, params) {
        this.loading = true
        let _loginApi = ''
        let post
        if (type == 'account') {
          _loginApi = this.api.accountLoginApi
          post = this.$post(_loginApi, params)
        } else {
          _loginApi = this.api.telLoginApi
          post = this.$postParams(_loginApi, params)
        }
        post.then((response) => {
          Util.processRes(response, () => {
            if (type == 'account') {
              Cookie.set('rememberMe', this.rememberMe, {expires: 7})
              if (this.rememberMe) {
                Cookie.set('passportPwd', params.passportPwd, {expires: 7})
              }
            }
            Cookie.set('isPlatform', 'no')
            Cookie.set('jwt', 'Bearer ' + response.data.tokenVo.accessToken, {expires: 7})
            Cookie.set('sessions', JSON.stringify({passportId: response.data.userMemberVo.passportId}))
            this.$store.commit('SET_LOGINMSG', response.data.userMemberVo)
            this.$store.commit('SET_CURR_TENANT', response.data.userMemberVo.tenantId)
            this.getCurrOrg(response.data.userMemberVo.changeOrgId)
            this.getResource(response.data.userMemberVo.passportId)

          })
          Util.processError(this, response);
        })
          .catch((err) => {
            this.loading = false
          })
      },
      switchLoginType() {
        this.isAccount = !this.isAccount
      },
      /**
       * 获取资源
       * */
      getResource(id) {
        this.$get(this.api.getResourceApi, {passportId: id})
          .then((response) => {
            this.loading = false
            Util.processRes(response, () => {
              if (response.data) {
                this.$store.commit('SET_RESOURCES', this.addCollectionProps(response.data))
                this.$router.push('/main/home')
                this.$store.commit('SET_ROUTE', ['/main/home'])
                this.$store.commit('SET_OPENKEYS', [])
                // this.$notification['success']({
                //   message: '欢迎',
                //   description: `${ this.timeFix() },${ this.welcome() }`,
                // });
              } else {
                this.$store.commit('SET_RESOURCES', [])
                this.$router.push('/main/home')
                this.$store.commit('SET_ROUTE', ['/main/home'])
              }
            })
            Util.processError(this, response);
          })
          .catch((err) => {
            this.loading = false
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
        let tel = this.telForm.getFieldValue('account')
        let params = {
          phoneNumber: tel,
          smsType: 1
        };
        tel && this.$postParams(this.api.sendAuthCodeApi, params)
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
      },
      /**
       * 获取当前组织信息
       * @param id
       */
      getCurrOrg(id) {
        this.$get(this.api.getCurrOrgApi, {id: id})
          .then((response) => {
            Util.processRes(response, () => {
              if (response.data.children) {
                response.data.children = []
              }
              this.$store.commit('SET_CURR_ORG', response.data)
            })
            Util.processError(this, response);
          })
          .catch((err) => {
            this.loading = false
          })
      },
      /**
       * 收藏按钮增加属性
       * @param arr
       * @returns {Array}
       */
      addCollectionProps(arr) {
        let resources = []
        arr.length && arr.forEach(item => {
          if (item.type == 'menu') {
            item['isCollected'] = false
          }
          if (item.children && item.children.length) {
            item.children = this.addCollectionProps(item.children)
          }
          resources.push(item)
        })
        return resources
      }
    },
    destroyed() {
    }
  }
</script>
<style lang="scss">
  #Login {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .ad {
      width: calc(100% - 420px);
      height: 100%;
      min-height: 800px;
      .ad-swiper {
        width: 100%;
        height: 100%;
        .slick-slider {
          width: 100%;
          height: 100%;
          .slick-list {
            width: 100%;
            height: 100%;
            .slick-track {
              width: 100%;
              height: 100%;
              .slick-slide {
                text-align: center;
                height: 100%;
                overflow: hidden;
              }
              .slick-slide > div {
                height: 100%;
                .swiper {
                  height: 100%;
                  background: url("../assets/image/login/swiper.jpg");
                  background-size: 100% 100%;
                }
              }
            }
          }
          .slick-dots {
            bottom: 32px;
          }
        }
      }

    }
    .login-box {
      width: 500px;
      height: 100%;
      background: #fff;
      .user-layout-login {
        padding: 0 60px;
      }
    }
  }
</style>
