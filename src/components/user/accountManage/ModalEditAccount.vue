/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 组件注释
</comment>
<template>
  <a-modal
    id="ModalEditAccount"
    v-model="visible"
    :width="800"
    title="编辑账户"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalEditAccount"
  >
    <div class="body">
      <a-form :form="form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="所属组织"
              :validate-status="formError('org') ? 'error' : ''"
              :help="formError('org') || ''"
            >
              <a-input
                type="text"
                disabled
                placeholder="请输入所属组织"
                v-decorator="[
                      'org',
                      {rules: [
                        { required: true, message: '请输入所属组织！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="用户名称"
              :validate-status="formError('name') ? 'error' : ''"
              :help="formError('name') || ''"
            >
              <a-input
                type="text"
                placeholder="请输入用户名称"
                v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入用户名称！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="用户账号"
              :validate-status="formError('account') ? 'error' : ''"
              :help="formError('account') || ''"
            >
              <a-input
                type="text"
                disabled
                placeholder="请输入用户账号"
                v-decorator="[
                      'account',
                      {rules: [
                        { required: true, message: '请输入用户账号！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="手机号"
              :validate-status="formError('phone') ? 'error' : ''"
              :help="formError('phone') || ''"
            >
              <a-input
                type="tel"
                placeholder="请输入手机号"
                v-decorator="[
                      'phone',
                      {rules: [
                        { required: true, message: '请输入手机号！' },
						{ pattern: regTel, message: '手机号格式不正确！'}
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="邮箱"
              :validate-status="formError('mail') ? 'error' : ''"
              :help="formError('mail') || ''"
            >
              <a-input
                type="email"
                placeholder="请输入邮箱"
                v-decorator="[
                      'mail',
                      {rules: [
                        { required: false, message: '请输入邮箱！' },
						{ pattern: regEmail, message: '邮箱格式不正确！'}
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleClose">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        @click="saveEdit"
        :disabled="hasErrors(form.getFieldsError())"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalEditAccount",
  components: {},
  data() {
    return {
      Util,
      api: {
        updateAcountApi: Util.orgServer + "/web/member/update" // 列表
      },
      visible: false,
      currentRowData: null,
      form: this.$form.createForm(this),
      defaultForm: {},
      regTel: Util.tel,
      regEmail: Util.email
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*重置模态框中的值*/
    reset(rowData) {
      this.setForm(rowData);
      this.form.resetFields();
      this.form.validateFields();
    },
    setForm(rowData) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: rowData.name,
          org: rowData.orgName,
          account: rowData.phone,
          phone: rowData.phone,
          mail: rowData.mail
        });
      });
    },
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.currentRowData = rowData;
      this.$nextTick(() => {
        this.reset(rowData);
      });
    },
    /*关闭modal后的回调事件*/
    handleClose() {
      this.visible = false;
    },
    formError(field) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    saveEdit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            id: this.currentRowData.id,
            tenantId: this.currentRowData.tenantId,
            name:values.name,
            mail:values.mail,
            phone:values.phone
          };
          this.$post(this.api.updateAcountApi, params)
            .then(response => {
              this.loading = false;
              Util.processRes(
                response,
                () => {
                  this.$message.success("修改成功！");
                  this.handleClose();
                  this.$emit("searchList");
                },
                () => {}
              );
              Util.processError(this, response);
            })
            .catch(res => {
              this.loading = false;
              Util.processError(this, res);
            });
        }
      });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.ModalEditAccount {
  .ant-form {
    .ant-row{
      div[class^='ant-col'] {
      height: 82px;
      overflow: hidden;
    }
    }

  }
}
</style>
