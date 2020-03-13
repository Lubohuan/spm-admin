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
  预警任务 新增/编辑
</comment>
<template>
  <a-modal
    v-model="visible"
    centered
    class="ModalConfigWarningTask"
    :width="790"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">{{title}}</template>
    <a-form :form="form" layout="vertical" ref="aForm">
      <a-row :gutter="24" v-show="configType=='edit'">
        <!-- 预警任务编码 -->
        <a-col :span="12">
          <a-form-item label="预警任务编码">
            <a-input
              disabled
              v-decorator="[
                       'code',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入预警任务编码',
                            }
                          ],
                        }
                      ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <!-- 名称 -->
        <a-col :span="12">
          <a-form-item
            label="预警任务名称"
            :validate-status="formError('name') ? 'error' : ''"
            :help="formError('name') || ''"
          >
            <a-input
              v-decorator="[
                        'name',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入预警任务名称',
                            }
                          ],
                        }
                      ]"
              placeholder="请输入预警任务名称"
            />
          </a-form-item>
        </a-col>
        <!-- 地址 -->
        <a-col :span="12">
          <a-form-item
            label="预警任务地址"
            :validate-status="formError('url') ? 'error' : ''"
            :help="formError('url') || ''"
          >
            <a-input
              v-decorator="[
                        'url',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入预警任务地址',
                            }
                          ],
                        }
                      ]"
              placeholder="请输入预警任务地址"
            />
          </a-form-item>
        </a-col>
        <!-- 模板 -->
        <a-col :span="24">
          <a-form-item
            :validate-status="formError('template') ? 'error' : ''"
            :help="formError('template') || ''"
          >
            <template slot="label">
              <span>
                <span style="margin-right:2px;">预警消息模板</span>
                <!-- trigger="click" -->
                <a-popover placement="right">
                  <template slot="title">
                    <span class="ant-popover-slotTitle">预警消息模板说明</span>
                  </template>
                  <template slot="content">
                    <p style="width:300px">【超期未整改】{项目名称}有隐患超过整改期限{整改期限}未整改，请立即整改。</p>
                  </template>
                  <a-icon type="question-circle" class="pointer" />
                </a-popover>
              </span>
              <span class="pull-right" style="color:#DD3535">
                <a-icon type="info-circle" />
                <font>若需发送短信，请确认消息模板通过阿里云审核，且字数在70个字以内。</font>
              </span>
            </template>
            <!--   {
                              validator: validatorTemplate,
            }-->
            <a-textarea
              style="margin-bottom:0px;"
              v-decorator="[
                        'template',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入预警消息模板',
                            },
                          {
                              validator: validatorTemplate,
            }
                          ],
                        }
                      ]"
              :rows="4"
              placeholder="请输入预警消息模板"
            />
          </a-form-item>
        </a-col>
        <!-- 发送方式 -->
        <a-col :span="12">
          <a-form-item
            label="发送方式"
            :validate-status="formError('sendType') ? 'error' : ''"
            :help="formError('sendType') || ''"
          >
            <a-checkbox-group
              style="margin-top:17px;"
              @change="sendTypeChange"
              v-decorator="[
                        'sendType',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请选择发送方式',
                            }
                          ],
                        }
                      ]"
            >
              <a-checkbox value="1">站内信</a-checkbox>
              <a-checkbox value="2">短信</a-checkbox>
              <a-checkbox value="3">邮件</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <!-- 触发时间 -->
        <a-col :span="12">
          <a-form-item
            label="Cron表达式（预警任务触发时间）"
            :validate-status="formError('taskCron') ? 'error' : ''"
            :help="formError('taskCron') || ''"
          >
            <a-input-search
              v-decorator="[
                        'taskCron',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请编辑预警任务触发时间',
                            }
                          ],
                        }
                      ]"
              :readOnly="true"
              placeholder="请编辑预警任务触发时间"
              @click="showCronModal"
              @search="showCronModal"
            >
              <a-button @click="showCronModal" slot="enterButton" type="primary">
                <span>请选择</span>
              </a-button>
            </a-input-search>
          </a-form-item>
        </a-col>
        <!-- 预警任务截止时间 -->
        <a-col :span="12" v-if="deadlineValue==1">
          <a-form-item
            :validate-status="formError('endTime') ? 'error' : ''"
            :help="formError('endTime') || ''"
          >
            <template slot="label">
              <span>预警任务截止时间</span>
              <span class="pull-right" style="margin-right:50px;">
                <a-radio-group @change="deadlineChange" v-model="deadlineValue" size="small">
                  <a-radio :value="1">有效期限</a-radio>
                  <a-radio :value="2">无期限</a-radio>
                </a-radio-group>
              </span>
            </template>
            <a-date-picker
              style="width: 200px"
              @change="dateChange"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="[
                        'endTime',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请选择预警任务截止时间',
                            }
                          ],
                        }
                      ]"
            />
          </a-form-item>
        </a-col>
        <!-- 预警任务截止时间 -->
        <a-col :span="12" v-if="deadlineValue==2">
          <a-form-item
            :validate-status="formError('endTime1') ? 'error' : ''"
            :help="formError('endTime1') || ''"
          >
            <template slot="label">
              <span>预警任务截止时间</span>
              <span class="pull-right" style="margin-right:50px;">
                <a-radio-group @change="deadlineChange" v-model="deadlineValue" size="small">
                  <a-radio :value="1">有效期限</a-radio>
                  <a-radio :value="2">无期限</a-radio>
                </a-radio-group>
              </span>
            </template>
            <a-select
              style="width: 200px"
              disabled
              v-decorator="[
                        'endTime1',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请选择预警任务截止时间',
                            }
                          ],
                        }
                      ]"
            >
              <a-select-option value="0">无期限</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- 是否重复发送 -->
        <a-col :span="12">
          <a-form-item
            label="是否重复发送"
            :validate-status="formError('isRepeat') ? 'error' : ''"
            :help="formError('isRepeat') || ''"
          >
            <a-radio-group
              name="isRepeat"
              style="margin-top:10px;"
              v-decorator="[
                        'isRepeat',
                        {
                          initialValue:2,
                          rules: [
                            {
                              required: true,
                              message: '请确认是否重复发送',
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
              <span style="margin-right:2px;">备注</span>
            </template>
            <a-textarea
              v-decorator="[
                        'remark',
                      ]"
              :rows="4"
              placeholder="请输入备注"
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
    <JCronModal ref="innerVueCron" :data="cron" @ok="setCorn"></JCronModal>
  </a-modal>
</template>

<script>
import JCron from "@/cron/JCron.vue";
import moment from "moment";
import JCronModal from "@/cron/JCronModal";
export default {
  name: "ModalConfigWarningTask",
  components: {
    JCronModal
  },
  props: ["classifyId"],
  data() {
    return {
      Util,
      api: {
        addApi: Util.systemServer + "/web/alarm-task/add", // 新增预警任务
        editApi: Util.systemServer + "/web/alarm-task/edit" // 编辑预警任务
      },
      code: "",
      ajaxLoading: false,
      visible: false,
      showDate: true,
      currentDate: null,
      title: "",
      configType: "",
      cron: "0 0 * * * ?",
      deadlineValue: 1,
      form: this.$form.createForm(this)
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*打开modal的事件*/
    handleOpen(configType, rowData) {
      this.visible = true;
      this.configType = configType;
      this.title = this.configType == "add" ? "新增预警任务" : "编辑预警任务";
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
      let taskCron = "";
      let code = "";
      if (this.configType == "add") {
        taskCron = "0 0 * * * ?";
        code = "124";
      } else {
        taskCron = this.currentRowData.taskCron;
        code = this.currentRowData.code;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          taskCron: taskCron,
          code: code
        });
        if (this.configType == "edit") {
          this.form.setFieldsValue({
            name: this.currentRowData.name,
            url: this.currentRowData.url,
            template: this.currentRowData.template,
            sendType: this.currentRowData.sendType,
            isRepeat: this.currentRowData.isRepeat,
            remark: this.currentRowData.remark
          });
          if (this.currentRowData.endTime == "0") {
            this.deadlineValue = 2;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                endTime1: "0"
              });
            });
          } else {
            this.deadlineValue = 1;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                endTime: this.currentRowData.endTime
                  ? this.moment(this.currentRowData.endTime)
                  : null
              });
            });
          }
        }

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
    showCronModal() {
      this.cron = this.form.getFieldValue("taskCron");
      this.$refs.innerVueCron.show();
    },
    setCorn(data) {
      console.log("data)", data);
      this.$nextTick(() => {
        this.form.setFieldsValue({
          taskCron: data
        });
      });

      // console.log(Object.keys(data).length==0);
      // if (Object.keys(data).length==0) {
      //   this.$message.warning('请输入cron表达式!');
      // }
    },
    sendTypeChange(val) {
      this.$nextTick(() => {
        this.form.validateFields();
      });
    },
    dateChange(dates, dateStrings) {
      this.currentDate = dates;
    },
    deadlineChange(e) {
      this.$nextTick(() => {
        if (e.target.value == 1) {
          this.form.setFieldsValue({
            endTime: this.currentDate
          });
        } else {
          this.form.setFieldsValue({
            endTime1: "0"
          });
        }
        this.form.validateFields();
      });
    },
    saveConfig() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {};
          console.log(values.endTime1);
          if (this.deadlineValue == 1) {
            values.endTime = this.moment(values.endTime1).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            params = values;
          } else {
            values.endTime = values.endTime1;
            params = values;
            delete params.endTime1;
          }
          delete params.code;
          if (this.configType == "add") {
            this.addTask(params); //新增请求后台接口
          } else if (this.configType == "edit") {
            this.editTask(params); //编辑请求后台接口
          }
        }
      });
    },
    addTask(values) {
      this.btnLoading = true;
      values.classifyId = this.classifyId;
      this.$post(this.api.addApi, values)
        .then(response => {
          this.loading = false;
          this.btnLoading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("新增成功！");
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
    },
    editTask(values) {
      values.id = this.currentRowData.id;
      this.$post(this.api.editApi, values)
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
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ant-popover-title {
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}
.ant-popover-inner-content {
  padding: 10px;
  min-height: 100px;

  line-height: 1.5;
}
.ant-popover-slotTitle {
  font-weight: bold;
}
.ModalConfigWarningTask {
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
