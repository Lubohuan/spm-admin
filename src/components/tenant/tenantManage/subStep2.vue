/**
* @Author: 路博欢
* @Date: 2019/8/20
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/20
**/
<comment>
  # 组件注释
  新增租户 step3 激活秘钥
</comment>
<template>
  <div id="subStep2">
    <a-skeleton active :loading="loading" :paragraph="{rows: 12}">
      <div class="modal-body">
        <subMessage0 ref="subMessage0" v-if="isLast"/>
        <subMessage1 ref="subMessage1"/>
        <subMessage2 ref="subMessage2"/>
        <subMessage3 ref="subMessage3" v-if="isLast"/>
        <div class="m-box" v-if="!isLast">
          <div class="m-title">
            <span class="m-text">密钥有效期</span>
          </div>
          <div class="m-content">
            <a-row :gutter="24" class="m-item">
              <a-col :span="12">
                <div class="m-item">
                  <span class="m-label">产品密钥有效期：</span>
                  <span class="m-value">
                    <a-radio-group @change="onChange" v-model="value">
                      <a-radio :value="1">有效期限</a-radio>
                      <a-radio :value="2">无期限</a-radio>
                    </a-radio-group>
                  </span>
                </div>
              </a-col>
            </a-row>
            <a-form :form="form" layout="vertical" v-show="value ==1">
              <a-row :gutter="24">
                <a-col :span="24">
                  <a-form-item
                    label="密钥有效期"
                    :validate-status="formError('dateValue') ? 'error' : ''"
                    :help="formError('dateValue') || ''"
                  >
                    <a-range-picker
                      :placeholder="['密钥有效起始日期', '密钥有效截止日期']"
                      format="YYYY-MM-DD"
                      :disabledDate="disabledDate"
                      v-decorator="[
                        'dateValue',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入密钥有效期！',
                            }
                          ],
                        }
                      ]"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
      </div>
    </a-skeleton>
    <div class="modal-btn">
      <span v-if="!showCloseBtn">
        <a-button
          v-if="value==1"
          type="primary"
          @click="nextStep(true)"
          :disabled="hasErrors(form.getFieldsError())"
        >激活密钥</a-button>
        <a-button v-else type="primary" @click="nextStep(false)">激活密钥</a-button>
      </span>
      <span v-if="showCloseBtn">
        <a-button type="primary" @click="close">关闭</a-button>
      </span>
    </div>
  </div>
</template>

<script>
  import subMessage0 from "@/tenant/tenantManage/subMessage0";
  import subMessage1 from "@/tenant/tenantManage/subMessage1";
  import subMessage2 from "@/tenant/tenantManage/subMessage2";
  import subMessage3 from "@/tenant/tenantManage/subMessage3";

  export default {
    name: "subStep3",
    components: {
      subMessage0,
      subMessage1,
      subMessage2,
      subMessage3
    },
    props: {},
    data() {
      return {
        value: 1,
        api: {
          tenantDetailsApi: Util.operationServer + "/web/tenant-info/tenant-details", // 申请密钥
          activateLicenceApi: Util.operationServer + "/web/license-info/activate-licence" // 激活密钥
        },
        showCloseBtn: false,
        currentRowData: null,
        form: this.$form.createForm(this),
        isLast: false,
        loading: false
      };
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      reset(rowData) {
        this.currentRowData = rowData;
        this.loading = false;
        this.value = 1;
        this.form.validateFields();
      },
      toggleCloseBtn(val) {
        this.showCloseBtn = val;
      },
      /**
       * 单选按钮切换
       * onChange
       */
      onChange(e) {
        //console.log("radio checked", e.target.value);
      },
      disabledDate(current) {
        // Can not select days before today and today
        return current < this.moment().subtract(1, 'day').endOf('day');
      },
      formError(field) {
        const {getFieldError, isFieldTouched} = this.form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      changeIsLast(isLast, rowData) {
        this.isLast = isLast;
        this.currentRowData = rowData;
        this.$nextTick(() => {
          this.getDetails(rowData);
        });
      },
      getDetails(rowData) {
        this.loading = true;
        let params = {
          id: rowData.id
        };
        this.$post(this.api.tenantDetailsApi, params)
          .then(response => {
            this.loading = false;
            Util.processRes(
              response,
              () => {
                this.$nextTick(() => {
                  this.$refs["subMessage1"].init(response.data);
                  this.$refs["subMessage2"].init(response.data);
                });

                if (this.isLast) {
                  this.$nextTick(() => {
                    this.$refs["subMessage0"].init(response.data);
                    this.$refs["subMessage3"].init(response.data);
                  });
                }
              },
              () => {
              }
            );
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      },
      /** 点击激活按钮*/
      nextStep(date) {
        this.activateLicence(date);
      },
      close() {
        this.$emit("handleClose");
      },
      activateLicence(date) {
        this.loading = true;
        let params = {
          licenceId: this.currentRowData.licenceId,
          tenantId: this.currentRowData.id,
          type: this.value
        };
        if (date) {
          var values = this.form.getFieldValue("dateValue");
          params.startTime = this.moment(values[0]["_d"]).format("X") * 1000;
          params.endTime = this.moment(values[1]["_d"]).format("X") * 1000;
        } else {
          params.startTime = 0;
          params.endTime = 0;
        }
        this.$post(this.api.activateLicenceApi, params)
          .then(response => {
            this.loading = false;
            Util.processRes(
              response,
              () => {
                this.$emit("handleStep", 3, "three");
                this.changeIsLast(true, this.currentRowData);
                this.$emit("upDateList");
                this.toggleCloseBtn(true);
                this.$message.success("激活成功！");
              },
              () => {
              }
            );
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
