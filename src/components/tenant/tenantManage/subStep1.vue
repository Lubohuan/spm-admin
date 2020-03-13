/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  新增租户 step1 申请秘钥
</comment>
<template>
  <div id="subStep1">
    <a-skeleton active :loading="loading" :paragraph="{rows: 8}">
      <div class="modal-body">
        <div class="form-container" v-show="!isAfterApply">
          <a-form :form="form" layout="vertical">
            <a-row :gutter="24">
              <a-col :span="24">
                <a-form-item
                  label="申请理由"
                  :validate-status="formError('reason') ? 'error' : ''"
                  :help="formError('reason') || ''"
                >
                  <a-textarea
                    :rows="4"
                    v-decorator="[
                          'reason',
                          {
                            rules: [
                              {
                                required: true,
                                message: '请输入申请理由！',
                              }
                            ],
                          }
                        ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="上传合同/协议附件" class="file-required">
                  <a-upload
                    :fileList="fileList"
                    :remove="handleRemove"
                    :customRequest="customRequest"
                    :beforeUpload="beforeUpload"
                  >
                    <a-button>
                      <a-icon type="upload"/>
                      选择文件
                    </a-button>
                  </a-upload>
                  <div class="has-error" v-if="hasNoFile">
                    <div class="ant-form-explain">请上传合同或者协议附件！</div>
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="24" v-show="false">
                <a-form-item
                  label="上传文件隐藏input"
                  :validate-status="formError('url') ? 'error' : ''"
                  :help="formError('url') || ''"
                >
                  <a-input
                    :rows="4"
                    @change="handleInputChange"
                    v-decorator="[
                          'url',
                          {
                            rules: [
                              {
                                required: true,
                                message: '请选择文件！',
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
        <div class="message-container" v-show="isAfterApply">
          <!-- 密钥申请信息 -->
          <subMessage1 ref="subMessage1"/>
          <!-- 产品密钥信息 -->
          <subMessage2 ref="subMessage2"/>
        </div>
      </div>
    </a-skeleton>
    <div class="modal-btn">
      <!-- <a-button
        key="submit"
        @click="saveStep1"
        v-show="!isAfterApply"
        :disabled="hasErrors(form.getFieldsError())"
      >暂存</a-button> -->
      <a-button
        type="primary"
        @click="applyKey"
        v-show="!isAfterApply"
        :disabled="hasErrors(form.getFieldsError())"
      >申请密钥
      </a-button>
      <a-button
        type="primary"
        @click="nextStep"
        v-show="isAfterApply"
        :disabled="isNoSuccessApply"
      >去激活密钥
      </a-button>
    </div>
  </div>
</template>
<script>
  import subMessage1 from "@/tenant/tenantManage/subMessage1";
  import subMessage2 from "@/tenant/tenantManage/subMessage2";

  export default {
    name: "subStep1",
    components: {
      subMessage1,
      subMessage2
    },
    props: {},
    data() {
      /**web/license-info/apply-licence */
      return {
        Util,
        api: {
          applyTenantApi: Util.operationServer + "/web/license-info/apply-licence", // 申请密钥
          tenantDetailsApi: Util.operationServer + "/web/tenant-info/tenant-details" // 详情
        },
        loading: false,
        currentRowData: null,
        currentRowId: "",
        form: this.$form.createForm(this),
        fileList: [],
        fileObj: {
          fileName: "",
          url: ""
        },
        hasNoFile: false,
        isAfterApply: false,
        isNoSuccessApply: true
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
        this.hasNoFile = false;
        this.isAfterApply = false;
        this.isNoSuccessApply = true;
        this.fileList = [];
        this.fileObj = {
          fileName: "",
          url: ""
        };
        this.$nextTick(() => {
          this.form.resetFields();
          this.form.validateFields();
        });
      },
      //回显
      setForm() {
        this.fileList = [
          {
            uid: "1",
            name: "xxx.png",
            status: "done",
            response: "Server Error 500", // custom error message to show
            url: "http://www.baidu.com/xxx.png"
          }
        ];
      },
      /**
       * 请求后台获取密钥申请信息
       */
      getCodeApplyMessage() {
        let rowData = {};
        this.$refs["subMessage1"].init(rowData);
      },
      handleInputChange() {
      },
      formError(field) {
        const {getFieldError, isFieldTouched} = this.form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      /**
       * 删除文件
       */
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
        if (this.fileList.length > 0) {
        } else {
          this.fileObj = {
            fileName: "",
            url: ""
          };
          this.form.setFieldsValue({
            url: this.fileObj.url
          });
        }
        this.$nextTick(() => {
          this.form.validateFields();
        });
      },
      /**
       * 上传中、完成、失败都会调用这个函数。
       文件状态改变的回调，返回为：
       {
         file: { },
         fileList: [  ],
         event: {  },
       }
       */
      /**
       * 上传文件之前
       */
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        //return false;
      },
      //上传文件
      customRequest(data) {
        //this.loading = true;
        let params = {
          file: data.file,
          module: "spm-operation", //租户、密钥模块
          business: "tenantContract" //租户合同
        };
        this.$uploadFile(params).then(response => {
          Util.processRes(response, () => {
            this.$message.success("上传成功！");
            //this.loading = false;
            this.$nextTick(() => {
              this.fileObj = {
                fileName: response.data[0].realName,
                url: response.data[0].path
              };
              this.form.setFieldsValue({
                url: this.fileObj.url
              });
              this.form.validateFields();
            });
          });
          Util.processError(this, response);
        });
        // .catch(res => {
        //   Util.processError(this, res);
        // });
      },
      /**
       * saveStep1
       * 暂存第二步
       */
      saveStep1() {
        this.$emit("handleClose");
      },
      /**
       * 申请密钥
       */
      applyKey() {
        this.form.validateFields((err, values) => {
          this.applyKeyAjax(values);
        });
      },
      applyKeyAjax(values) {
        this.loading = true;
        let params = {
          tenantId: this.currentRowData.id,
          reason: values.reason,
          url: values.url,
          fileName: this.fileObj.fileName
        };
        this.$post(this.api.applyTenantApi, params).then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("申请成功！");
              this.isAfterApply = true;
              // this.$emit("handleStep", 1);
              this.$emit("upDateList");
              console.log(this.currentRowData);
              this.$nextTick(() => {
                this.getDetails();
              });
            },
            () => {
            }
          );

          Util.processError(this, response);
        });
        // .catch(res => {
        //   console.log(res)
        //   // this.loading=false;
        //   // Util.processError(this, res);
        // });
      },
      /**
       * 父组件调用 改变isAfterApply
       */
      changeIsAfterApply(isAfterApply) {
        this.isAfterApply = isAfterApply;
        if (isAfterApply) {
          this.$nextTick(() => {
            this.getDetails();
          });
        }
      },
      /*
      获取详情信息
      */
      getDetails() {
        this.loading = true;
        let params = {
          id: this.currentRowData.id
        };
        this.$post(this.api.tenantDetailsApi, params).then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.$nextTick(() => {
              this.$refs["subMessage1"].init(response.data);
              this.$refs["subMessage2"].init(response.data);
              this.enableClick(response.data);
            });
          });
          Util.processError(this, response);
        });
        // .catch(res => {
        //   console.log(res);
        //   this.loading=false;
        //   Util.processError(this, res);
        // });
      },
      /**
       * 判断激活密钥是否能点击
       */
      enableClick(data) {
        if (data && data.secretNum) {
          this.isNoSuccessApply = false;
        } else {
          this.isNoSuccessApply = true;
        }
      },
      /**
       * 进行第三步
       * 去激活密钥
       */
      nextStep() {
        this.$emit("handleStep", 2, "two", this.currentRowData);
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .file-required {
    .ant-form-item-label {
      label:before {
        display: inline-block;
        margin-right: 4px;
        content: "*";
        font-family: SimSun;
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
      }
    }
  }
</style>
