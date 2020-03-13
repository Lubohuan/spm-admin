/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  新增租户 step0 新增租户
</comment>
<template>
  <div id="subStep0">
    <div class="modal-body">
      <div class="form-container">
        <a-form :form="form" layout="vertical" ref="aForm">
          <a-row :gutter="24">
            <!-- 编辑的时候展示租户编码 -->
            <a-col :span="12" v-if="type=='edit'">
              <a-form-item
                label="租户编码"
                :validate-status="formError('tenantCode') ? 'error' : ''"
                :help="formError('tenantCode') || ''"
              >
                <a-input
                  :disabled="true"
                  v-decorator="[
                        'tenantCode',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入租户编码！',
                            }
                          ],
                        }
                      ]"
                  placeholder="请输入租户编码！"
                />
              </a-form-item>
            </a-col>
            <!-- 公司名称 -->
            <a-col :span="12">
              <a-form-item
                label="公司名称"
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
                              message: '请输入公司名称！',
                            }
                          ],
                        }
                      ]"
                  placeholder="请输入公司名称"
                />
              </a-form-item>
            </a-col>
            <!-- 公司简称 -->
            <a-col :span="12">
              <a-form-item
                label="公司简称"
                :validate-status="formError('shortName') ? 'error' : ''"
                :help="formError('shortName') || ''"
              >
                <a-input
                  v-decorator="[
                        'shortName',
                         {
                          rules: [
                            {
                              required: true,
                              message: '请输入公司简称！',
                            }
                          ],
                        }
                      ]"
                  placeholder="请输入公司简称"
                />
              </a-form-item>
            </a-col>
            <!-- 公司性质 -->
            <a-col :span="12">
              <a-form-item
                label="公司性质"
                :validate-status="formError('nature') ? 'error' : ''"
                :help="formError('nature') || ''"
              >
                <a-select
                  v-decorator="[
                      'nature', {
                        rules: [{ required: true, message: '请选择公司性质！'}],
                      }]"
                  placeholder="请选择公司性质"
                >
                  <a-select-option
                    v-for="( companyType, index ) in companyTypes"
                    :value="companyType.dictionaryCode"
                    :key="index + 'companyType'"
                  >
                    {{
                    companyType.dictionaryName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- 社会统一信用代码 -->
            <a-col :span="12">
              <a-form-item
                label="社会统一信用代码"
                :validate-status="formError('num') ? 'error' : ''"
                :help="formError('num') || ''"
              >
                <a-input
                  v-decorator="['num',{rules: [{required: true, message: ' ',},{validator:validatorNum}]}]"
                  placeholder="请输入社会统一信用代码！"
                />
              </a-form-item>
            </a-col>
            <!-- 公司地址 -->
            <a-col :span="12">
              <a-form-item
                label="公司地址"
                :validate-status="formError('address') ? 'error' : ''"
                :help="formError('address') || ''"
              >
                <a-input
                  v-decorator="[
                        'address',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入公司地址！',
                            }
                          ],
                        }
                      ]"
                  placeholder="请输入公司地址"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="modal-btn" v-if="type=='add'">
      <!-- <a-button @click="saveStep0" :disabled="hasErrors(form.getFieldsError())" >暂存</a-button> -->
      <a-button type="primary" @click="saveConfig" :disabled="hasErrors(form.getFieldsError())">下一步</a-button>
    </div>
    <div class="modal-btn" v-if="type=='edit'">
      <!-- <a-button @click="saveStep0" :disabled="hasErrors(form.getFieldsError())" >暂存</a-button> -->
      <a-button type="primary" @click="saveConfig" :disabled="hasErrors(form.getFieldsError())">确定</a-button>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";

  export default {
    name: "subStep0",
    components: {},
    props: ["type"],
    data() {
      return {
        Util,
        api: {
          addTenantApi: Util.operationServer + "/web/tenant-info/add", // 新增租户
          editTenantApi: Util.operationServer + "/web/tenant-info/edit-tenant" // 编辑租户
        },
        currentRowData: null,
        loading: false,
        form: this.$form.createForm(this),
        code: ""
      };
    },
    computed: {
      ...mapState({
        companyTypes: state => state.dicts.COMPANY_NATURE
      })
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      reset(rowData) {
        this.$emit("toggleLoading", false);
        this.form.resetFields();
        this.form.validateFields();
      },
      setForm(rowData) {
        this.currentRowData = rowData;
        this.form.setFieldsValue({
          tenantCode: rowData.tenantCode,
          name: rowData.name,
          nature: rowData.nature,
          address: rowData.address,
          shortName: rowData.shortName,
          num: rowData.num
        });
      },
      formError(field) {
        const {getFieldError, isFieldTouched} = this.form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      validatorNum(rule, value, callback) {
        const form = this.form;
        if (Util.Reg7.test(value)) {
          callback();
        } else {
          callback("请输入18位大写英文字母或数字或其组合！");
        }
      },
      validatorTel(rule, value, callback) {
        const form = this.form;
        if (Util.tel.test(String(value))) {
          callback();
        } else {
          callback("请输入正确的手机号码！");
        }
      },
      validatorCompanyName(rule, value, callback) {
        const form = this.form;
        // if (value && value !== form.getFieldValue("password")) {
        //   callback("Two passwords that you enter is inconsistent!");
        // } else {
        //   callback();
        // }
      },
      /**
       * 暂存
       */
      saveStep0() {
        this.$emit("handleClose");
      },
      /** 进行第二步*/
      saveConfig() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.type == "add") {
              this.addTenant(values); //请求后台接口
            } else {
              this.editTenant(values); //请求后台接口
            }
          }
        });
      },
      /**
       * 新增租户
       *
       */
      addTenant(params) {
        this.$emit("toggleLoading", true);
        this.$post(this.api.addTenantApi, params).then(response => {
          this.$emit("toggleLoading", false);
          Util.processRes(
            response,
            () => {
              this.$message.success("新增成功！");
              this.$emit("handleStep", 1, "one", {id: response.data.id});
              this.$emit("upDateList");
            },
            () => {
            }
          );
          Util.processError(this, response);
        });
        // .catch(res => {
        //   this.$emit("toggleLoading", false);
        //   Util.processError(this, res);
        // });
      },
      editTenant(params) {
        this.$emit("toggleLoading", true);
        params.id = this.currentRowData.id;
        this.$post(this.api.editTenantApi, params).then(response => {
          this.$emit("toggleLoading", false);
          Util.processRes(
            response,
            () => {
              this.$message.success("编辑成功！");
              this.$emit("handleClose");
              this.$emit("upDateList");
            },
            () => {
            }
          );

          Util.processError(this, response);
        });
        // .catch(res => {
        //   this.$emit("toggleLoading", false);
        //   Util.processError(this, res);
        // });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
