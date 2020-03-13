/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  新增租户
</comment>
<template>
  <a-modal
    v-model="visible"
    centered
    class="ModalConfigAdmin"
    :width="850"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">{{title}}</template>
    <a-form :form="form" layout="vertical" ref="aForm">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            label="租户名称"
            :validate-status="formError('name') ? 'error' : ''"
            :help="formError('name') || ''"
          >
            <a-input
              :disabled="true"
              v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入租户名称！',
                            }
                          ],
                        }
                      ]"
              placeholder="请输入租户名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="管理员名称"
            :validate-status="formError('accountName') ? 'error' : ''"
            :help="formError('accountName') || ''"
          >
            <a-input
              :disabled="type=='tel'"
              v-decorator="[
                        'accountName',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator: validatorAdminName,
                            }
                          ],
                        }
                      ]"
              placeholder="请输入汉字、英文、数字或其组合"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="管理员账号"
            :validate-status="formError('accountId') ? 'error' : ''"
            :help="formError('accountId') || ''"
          >
            <a-input
              :disabled="type=='edit'||type=='tel'"
              v-decorator="[
                        'accountId',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                             {
                              validator: validatorAdminAccount,
                            }

                          ],
                        }
                      ]"
              placeholder="请输入6-18位字符，包含英文字母、数字、下划线，以英文字母开头"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="绑定手机号码"
            :validate-status="formError('tel') ? 'error' : ''"
            :help="formError('tel') || ''"
          >
            <a-input
              type="tel"
              @change="changeTel"
              :disabled="type=='edit'||type=='tel'"
              v-decorator="[
                        'tel',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator:validatorTel
                            }
                          ],
                        }
                      ]"
              placeholder="请输入手机号码！"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="type=='tel'">
          <a-form-item
            label="新手机号"
            :validate-status="formError('newTel') ? 'error' : ''"
            :help="formError('newTel') || ''"
          >
            <a-input
              type="tel"
              @change="changeTel"
              v-decorator="[
                        'newTel',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator:validatorTel
                            }
                          ],
                        }
                      ]"
              placeholder="请输入新的手机号码！"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="type!='edit'">
          <a-form-item
            label="短信验证码"
            :validate-status="formError('code') ? 'error' : ''"
            :help="formError('code') || ''"
          >
            <a-input-search
              v-decorator="[
                        'code',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入短信验证码！',
                            }
                          ],
                        }
                      ]"
              placeholder="请输入短信验证码"
              @search="getCodeByTel"
            >
              <a-button v-if="type=='add'" slot="enterButton" :disabled="disGetCode">
                <span v-if="showGet">获取短信验证码</span>
                <span v-else>
                  <span style="display:inline-block;width:20px;">{{seconds}}</span>秒后重新获取
                </span>
              </a-button>
              <a-button v-if="type=='tel'" slot="enterButton" :disabled="disGetCode">
                <span v-if="showGet">获取短信验证码</span>
                <span v-else>
                  <span style="display:inline-block;width:20px;">{{seconds}}</span>秒后重新获取
                </span>
              </a-button>
            </a-input-search>
          </a-form-item>
          <!-- <a-form-item
            v-if="type=='tel'"
            label="短信验证码"
            :validate-status="formError('code') ? 'error' : ''"
            :help="formError('code') || ''"
          >
            <a-input-search
              v-decorator="[
                        'code',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入短信验证码！',
                            }
                          ],
                        }
                      ]"
              placeholder="请输入短信验证码"
              @search="getCodeByTel"
            >
              <a-button
                v-if="type=='add'"
                slot="enterButton"
                type="primary"
                :disabled="disGetCodeNew"
              >
                <span v-if="showGet">获取短信验证码</span>
                <span v-else>
                  <span style="display:inline-block;width:20px;">{{seconds}}</span>秒后重新获取
                </span>
              </a-button>
            </a-input-search>
          </a-form-item>-->
        </a-col>
        <a-col :span="12" v-if="type=='add'">
          <a-form-item
            label="管理员初始密码"
            :validate-status="formError('password') ? 'error' : ''"
            :help="formError('password') || ''"
          >
            <a-input
              :type="eyePassWord?'text':'password'"
              v-decorator="[
                        'password',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator:validatorKey
                            }
                          ],
                        }
                      ]"
              placeholder="请输入8-14位字符，包含数字、字母、符号组合"
            >
              <a-icon
                slot="addonAfter"
                class="pointer"
                :type="eyePassWord?'eye':'eye-invisible'"
                @click="eyePassWord=!eyePassWord"
              />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="type=='tel'">
          <a-form-item
            label="密码"
            :validate-status="formError('newPassword') ? 'error' : ''"
            :help="formError('newPassword') || ''"
          >
            <a-input
              :type="eyePassWordNew?'text':'password'"
              v-decorator="[
                        'newPassword',
                        {
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator:validatorKey
                            }
                          ],
                        }
                      ]"
              placeholder="请输入您的密码用于安全验证"
            >
              <a-icon
                slot="addonAfter"
                class="pointer"
                :type="eyePassWordNew?'eye':'eye-invisible'"
                @click="eyePassWordNew=!eyePassWordNew"
              />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="saveConfig" :disabled="hasErrors(form.getFieldsError())">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalAddTenant",
  components: {},
  props: {},
  data() {
    return {
      ///web/tenant-admin/add
      Util,
      api: {
        addAdminApi: Util.operationServer + "/web/tenant-admin/add", // 新增管理员
        editAdminApi: Util.operationServer + "/web/tenant-admin/edit-admin", // 编辑管理员
        replaceTelApi: Util.operationServer + "/web/tenant-admin/replace-tel", //更换手机号
        sendSMSApi: Util.passportServer + "/web/user/send-code" //更换手机号
      },
      visible: false,
      title: "",
      type: "",
      eyePassWord: false,
      eyePassWordNew: false,
      disGetCode: true,
      seconds: 59,
      showGet: true,
      form: this.$form.createForm(this),
      currentRowData: null,
      notReGetCode: true
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    reset(rowData, configType) {
      this.disGetCode = true;
      this.seconds = 59;
      this.showGet = true;
      this.eyePassWord = false;
      this.eyePassWordNew = false;
      this.notReGetCode = true;
      this.type = configType;
      this.title =
        configType == "add"
          ? "新增超级管理员"
          : configType == "edit"
          ? "编辑超级管理员"
          : "修改手机号";
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.validateFields();
        this.form.setFieldsValue({
          name: rowData.name
        });
      });
    },
    changeTel(e) {
      if (Util.tel.test(String(e.target.value))) {
        if (this.notReGetCode) {
          this.disGetCode = false;
        }
      } else {
        this.disGetCode = true;
      }
    },
    /*打开modal的事件*/
    handleOpen(rowData, configType) {
      this.visible = true;
      this.currentRowData = rowData;
      this.reset(rowData, configType);
      if (configType != "add") {
        this.setForm(rowData);
      }
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    setForm(rowData) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: rowData.name,
          accountName: rowData.accountName,
          accountId: rowData.accountId,
          tel: rowData.tel
        });
      });
    },
    formError(field) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    /*管理员名称校验*/
    validatorAdminName(rule, value, callback) {
      const form = this.form;
      if (Util.adminName.test(String(value))) {
        callback();
      } else {
        callback("请输入汉字、英文、数字或其组合！");
      }
    },
    // 管理员账号校验
    validatorAdminAccount(rule, value, callback) {
      const form = this.form;
      if (
        Util.adminAccount.test(String(value)) &&
        Util.beginWidthAb.test(String(value))
      ) {
        callback();
      } else {
        callback(
          "请输入6-18位字符，包含英文字母、数字、下划线，以英文字母开头！"
        );
      }
    },
    // 管理员手机校验
    validatorTel(rule, value, callback) {
      const form = this.form;
      if (Util.tel.test(String(value))) {
        callback();
      } else {
        callback("请输入正确的手机号码！");
      }
    },
    //校验密码
    validatorKey(rule, value, callback) {
      const form = this.form;
      if (Util.key.test(String(value))) {
        callback();
      } else {
        callback("请输入8-14位字符，包含数字、字母、符号组合！");
      }
    },
    //获取短信验证码
    getCodeByTel() {
      this.reGetCode();
      let params = {
        phoneNumber:
          this.type == "add"
            ? this.form.getFieldValue("tel")
            : this.form.getFieldValue("newTel"),
        smsType: 3
      };
      this.$postParams(this.api.sendSMSApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("获取成功，请注意查收！");
            },
            () => {
              this.notReGetCode = true;
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.notReGetCode = true;
          this.loading = false;
          Util.processError(this, res);
        });
    },
    //60秒之后重新发送
    reGetCode() {
      this.showGet = false;
      this.disGetCode = true;
      this.notReGetCode = false;
      let timer = setInterval(() => {
        this.seconds--;
        if (this.seconds == -1) {
          this.showGet = true;
          this.disGetCode = false;
          this.seconds = 59;
          this.notReGetCode = true;
          clearInterval(timer);
        }
      }, 1000);
    },
    saveConfig() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.type == "add") {
            this.addAdmin(values); //新增请求后台接口
          } else if (this.type == "edit") {
            this.editAdmin(values); //编辑请求后台接口
          } else {
            this.replaceTelAdmin(values); //编辑请求后台接口
          }
        }
      });
    },
    addAdmin(values) {
      let params = values;
      params.tenantId = this.currentRowData.tenantId;
      this.$post(this.api.addAdminApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("新增成功！");
              this.handleClose();
              this.$emit("searchList");
            },
            () => {
              this.notReGetCode = true;
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          this.notReGetCode = true;
          Util.processError(this, res);
        });
    },
    editAdmin(values) {
      let params = {
        tenantAdminId: this.currentRowData.tenantAdminId,
        accountName: values.accountName
      };
      this.$post(this.api.editAdminApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("修改成功！");
              this.handleClose();
              this.$emit("searchList");
            },
            () => {
              this.notReGetCode = true;
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          this.notReGetCode = true;
          Util.processError(this, res);
        });
    },
    replaceTelAdmin(values) {
      let params = {
        tenantAdminId: this.currentRowData.tenantAdminId,
        tel: values.newTel,
        code: values.code,
        password: values.newPassword
      };
      this.$post(this.api.replaceTelApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("手机号更换成功！");
              this.handleClose();
              this.$emit("searchList");
            },
            () => {
              this.notReGetCode = true;
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          this.notReGetCode = true;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalConfigAdmin {
  .ant-modal-body {
    height: 380px;
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}

.modal-btn {
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  margin: 20px -49px -25px -49px;
}
</style>
