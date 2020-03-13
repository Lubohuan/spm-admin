import config from '@/themeColor/defaultSettings';
/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  手动解除预警 弹出框
</comment>
<template>
  <a-modal
    v-model="visible"
    centered
    class="ModalClearWarning"
    :width="635"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">手动解除预警</template>
    <a-form :form="form" layout="vertical" ref="aForm">
      <a-row :gutter="24">
        <!-- 说明 -->
        <a-col :span="24">
          <div class="flex" style="color:#DD3535;margin-bottom:35px;line-height:1.4">
            <a-icon type="info-circle" style="margin-top:3px;" />
            <span
              style="margin-left:5px;"
            >手动解除预警是将本条预警进行消项处理；手动解除预警后预警任务是否继续执行并预警，选择“是”本任务将继续执行并预警，选择“否”本任务将不再执行及产生预警。</span>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <!-- 手动解除预警 -->
        <a-col :span="12">
          <a-form-item
            label="手动解除预警"
            :validate-status="formError('isClear') ? 'error' : ''"
            :help="formError('isClear') || ''"
          >
            <a-radio-group
              name="isClear"
              style="margin-top:10px;"
              v-decorator="[
                        'isClear',
                        {
                          initialValue:1,
                          rules: [
                            {
                              required: true,
                              message: '请确认是否手动解除预警',
                            }
                          ],
                        }
                      ]"
            >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2" :disabled="true">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <!-- 是否继续预警 -->
        <a-col :span="12">
          <a-form-item
            label="是否继续预警"
            :validate-status="formError('isContinue') ? 'error' : ''"
            :help="formError('isContinue') || ''"
          >
            <a-radio-group
              name="isContinue"
              style="margin-top:10px;"
              v-decorator="[
                        'isContinue',
                        {
                          initialValue:1,
                          rules: [
                            {
                              required: true,
                              message: '请确认是否继续预警',
                            }
                          ],
                        }
                      ]"
            >
              <a-radio :value="1">是</a-radio>
              <a-radio :value="2">否</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <!-- 备注 -->
        <a-col :span="24">
          <a-form-item
            :validate-status="formError('remark') ? 'error' : ''"
            :help="formError('remark') || ''"
          >
            <template slot="label">
              <span style="margin-right:2px;">手动解除说明</span>
            </template>
            <a-textarea
              v-decorator="[
                        'remark',
                      ]"
              :rows="4"
              placeholder="请输入手动解除说明"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button
        type="primary"
        @click="saveConfig"
        :loading="ajaxLoading"
        :disabled="hasErrors(form.getFieldsError())||ajaxLoading"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalClearWarning",
  components: {},
  data() {
    return {
      Util,
      api: {
        clearApi: Util.systemServer + "/web/alarm-task/clear" // 解除预警任务
      },
      code: "",
      ajaxLoading: false,
      visible: false,
      form: this.$form.createForm(this)
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.currentRowData = rowData;
      this.initForm();
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      this.form.resetFields();
      //this.reset();
    },
    initForm() {
      this.$nextTick(() => {
        this.form.setFieldsValue({});
        this.form.validateFields();
      });
    },
    formError(field) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    validatorTemplate(rule, value, callback) {
      const form = this.form;
      let sendType = this.form.getFieldValue("sendType");
      if (sendType && sendType.includes("2")) {
        String(value).length > 17
          ? callback(
              " 若需发送短信，请确认消息模板通过阿里云审核，且字数在70个字以内。"
            )
          : callback();
      } else {
        callback();
      }
    },
    saveConfig() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.clearWarning(values);
        }
      });
    },
    clearWarning(values) {
      this.btnLoading = true;
      this.$post(this.api.clearApi, values)
        .then(response => {
          this.loading = false;
          this.btnLoading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("解除成功！");
              this.handleClose();
              this.$emit("searchList");
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          this.btnLoading = false;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalClearWarning {
  .ant-radio-wrapper {
    display: inline-block;
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
