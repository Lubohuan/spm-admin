/**
* @Author: 李晨光
* @Date: 2019/8/20
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/20
**/
<comment>
  # 组件注释
  修改密码
</comment>
<template>
  <div id="ChangePwd">
    <a-modal
      title="修改密码"
      centered
      :width="500"
      :visible="formModalVisible"
      @ok="changePwd"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item
                label="输入密码"
                :validate-status="formError(form,'oldPwd') ? 'error' : ''"
                :help="formError(form,'oldPwd') || ''"
              >
                <a-input
                  type="password"
                  placeholder="请输入密码"
                  v-decorator="[
                      'oldPwd',
                      {rules: [
                        { required: true, message: '请输入登录密码！' },
                      ]
                    }
                  ]"/>
              </a-form-item>
              <a-form-item
                label="输入新密码"
                :validate-status="formError(form,'password') ? 'error' : ''"
                :help="formError(form,'password') || ''"
              >
                <a-input
                  type="password"
                  placeholder="请输入新密码"
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
                label="再次输入新密码"
                :validate-status="formError(form,'newPwd') ? 'error' : ''"
                :help="formError(form,'newPwd') || ''"
              >
                <a-input
                  type="password"
                  @blur="handleConfirmBlur"
                  placeholder="请再次输入新密码"
                  v-decorator="[
                      'newPwd',
                      {rules: [
                        { required: true, message: '请输入8-16位字符，包含数字、字母和符号组合！' },
                        { pattern: Util.password, message: '请输入8-16位字符，包含数字、字母和符号组合!' },
                        { validator: compareToFirstPassword}
                      ]
                    }
                  ]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="changePwd"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>

  export default {
    name: 'ChangePwd',
    components: {},
    props: {},
    data() {
      return {
        Util,
        api: {
          changePwdApi: Util.passportServer + '/web/user/update-pwd-new' // 修改密码
        },
        form: this.$form.createForm(this),
        formModalVisible: false,
        confirmDirty: false, // 新密码二次确认
        formParams: {
          oldPwd: undefined, // 旧密码
          newPwd: undefined, // 新密码
        },
        loading: false
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    watch: {},
    methods: {
      openModal() {
        this.formModalVisible = true
        this.$nextTick(() => {
          this.form.validateFields();
        })
      },
      closeModal() {
        this.formModalVisible = false
        this.form.resetFields()
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
        const form = this.form;
        if (value && value.length >= 8 && value.length <= 16 && value !== form.getFieldValue('password')) {
          callback('您输入的两个密码不一致!');
        } else {
          callback();
        }
      },
      validateToNextPassword(rule, value, callback) {
        const form = this.form;
        if (value && this.confirmDirty) {
          form.validateFields(['newPwd'], {force: true});
        }
        callback();
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value;
      },
      /**
       * 修改密码
       */
      changePwd() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            Object.assign(this.formParams, values)
            this.$postParams(this.api.changePwdApi, this.formParams)
              .then((response) => {
                this.loading = false
                Util.processRes(response, () => {
                  this.closeModal()
                  this.$message.success(response.statusMessage)
                  this.$router.back()
                })
                Util.processError(this, err);
              })
              .catch((err) => {
                this.loading = false
              })
          }
        })
      },
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #ChangePwd {
    background: rgba(248, 248, 248, 1);
    height: 100%;
    padding: 5% 15% 10%;
    margin: 0 auto;
  }
</style>
