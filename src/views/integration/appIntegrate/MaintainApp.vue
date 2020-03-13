/**
* @Author: 李晨光
* @Date: 2019/9/7
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/7
**/
<comment>
  # 组件注释
  维护应用
</comment>
<template>
  <div id="MaintainApp">
    <Title/>
    <div class="m-l-20 m-r-20 m-b-20 ">
      <a-tabs defaultActiveKey="1" >
        <a-tab-pane tab="菜单应用" key="1"></a-tab-pane>
        <a-tab-pane tab="移动应用" key="2" forceRender></a-tab-pane>
      </a-tabs>
      <a-row :gutter="20">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card class="table-area-tab">
            <a-skeleton active :loading="false" :paragraph="{rows: 10}">
              <a-form
                :form="form"
                style="max-width: 1200px;"
              >
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9" >
                    <a-form-item
                      label="应用ID"
                      :validate-status="formError(form,'appCode') ? 'error' : ''"
                      :help="formError(form,'appCode') || ''"
                    >
                      <a-input
                        type="text"
                        disabled
                        placeholder="应用ID"
                        v-decorator="[
                        'appCode',
                        {rules: [
                          { required: true, message: '应用ID！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9">
                    <a-form-item
                      label="应用Key"
                      :validate-status="formError(form,'appKey') ? 'error' : ''"
                      :help="formError(form,'appKey') || ''"

                    >
                      <a-input
                        type="text"
                        disabled
                        placeholder="应用KEY"
                        v-decorator="[
                        'appKey',
                        {rules: [
                          { required: true, message: '应用Key！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9" >
                    <a-form-item
                      label="菜单应用名称"
                      :validate-status="formError(form,'certificate') ? 'error' : ''"
                      :help="formError(form,'certificate') || ''"
                    >
                      <a-input
                        type="text"
                        placeholder="请输入菜单应用名称"
                        v-decorator="[
                        'name',
                        {rules: [
                          { required: true, message: '请输入菜单应用名称！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="9" >
                    <a-form-item
                      label="是否为第三方应用"
                      :validate-status="formError(form,'isThird') ? 'error' : ''"
                      :help="formError(form,'isThird') || ''"
                    >
                      <a-radio-group name="radioGroup" v-decorator="[
                      'isThird',
                      {rules: [
                        { required: true, message: '请选择！' },
                      ]
                    }
                  ]">
                        <a-radio :value="1">
                          是
                        </a-radio>
                        <a-radio :value="0">
                          否
                        </a-radio>
                      </a-radio-group>

                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="18">
                    <a-form-item
                      label="应用图标"
                      :validate-status="formError(form,'icon') ? 'error' : ''"
                      :help="formError(form,'icon') || ''"
                    >
                      <a-upload
                        :fileList="fileList"
                        listType="picture-card"
                        :remove="handleRemove"
                        :customRequest="customRequest"
                        :beforeUpload="beforeUpload"
                        @preview="handlePreview"
                      >
                        <div v-if="fileList.length < 1">
                          <a-icon type="plus" />
                          <div class="ant-upload-text">上传</div>
                        </div>
                      </a-upload>

                      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" class="m-t-20" :src="previewImage" />
                      </a-modal>
                      <a-input
                        style="position: absolute;z-index: -1"
                        type="text"
                        placeholder=""
                        v-decorator="[
                        'icon',
                        {rules: [
                          { required: false, message: '请选择应用图标！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>


                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="18" >
                    <a-form-item
                      label="应用地址"
                      :validate-status="formError(form,'uri') ? 'error' : ''"
                      :help="formError(form,'uri') || ''"
                    >
                      <a-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        placeholder="请输入应用地址"
                        v-decorator="[
                        'uri',
                        {rules: [
                          { required: true, message: '请输入应用地址！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="18" >
                    <a-form-item
                      label="应用描述"
                      :validate-status="formError(form,'description') ? 'error' : ''"
                      :help="formError(form,'description') || ''"
                    >
                      <a-input
                        type="textarea"
                        :autosize="{ minRows: 3, maxRows: 6 }"
                        placeholder="请输入应用描述"
                        v-decorator="[
                        'description',
                        {rules: [
                          { required: false, message: '请输入应用描述！' },
                        ]
                      }
                    ]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="18" >
                    <div class="flex align-center justify-end m-r-10" style="margin-top: 150px;">
                      <a-button type="default"  @click="$router.back()" v-waves>取 消</a-button>
                      <a-button type="primary" class="m-l-10" @click="submitApp" :disabled="hasErrors(form.getFieldsError())" v-waves>确 认</a-button>
                    </div>
                  </a-col>
                </a-row>
              </a-form>
            </a-skeleton>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import Title from '@/Title'
  export default {
    name: 'MaintainApp',
    components: {
      Title
    },
    props: {
    },
    data() {
      return {
        Util,
        api: {
          getAppDetailApi: Util.orgServer + '/web/resource/app/detail', // 获取应用详情
          addMaintainAppApi: Util.orgServer + '/web/resource/app/update',// 首次维护应用
          editMaintainAppApi: Util.orgServer + '/web/resource/app/update',// 维护应用
        },
        form: this.$form.createForm(this), // 维护应用
        fileList: [],
        previewVisible: false,
        previewImage: '',
        appDetail: {
          appId: undefined,
          appKey: undefined,
          areaType: undefined,
          description: undefined,
          icon: undefined,
          name: undefined,
          uri: undefined,
        },
        appInfoId: '',
        isEdit: false
      }
    },
    computed: {},
    created() {
      this.appInfoId = this.$route.query.appInfoId
      this.getAppDetail()
      console.log(this.appInfoId)
    },
    mounted() {
    },
    watch: {},
    methods: {
      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleChange ({ fileList }) {
        this.fileList = fileList
      },
      handleCancel () {
        this.previewVisible = false
      },
      /**
       * 上传文件之前
       */
      beforeUpload(file) {
        // console.log(file)
        // this.fileList = [file];
        //return false;
      },
      //上传文件
      customRequest(data) {
        let params = {
          file: data.file,
          module: "spm-operation", //租户、密钥模块
          business: "tenantContract" //租户合同
        };
        this.$uploadFile(params).then(response => {
          Util.processRes(response, () => {
            this.$message.success("上传成功！");
            this.$nextTick(() => {
              this.fileObj = {
                fileName: response.data[0].realName,
                url: response.data[0].path
              };
              this.fileList = [{
                uid: '-1',
                name: response.data[0].realName,
                status: 'done',
                url: response.data[0].path,
              }]
              console.log(this.fileList)
              this.form.setFieldsValue({
                icon: this.fileObj.url
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
            icon: this.fileObj.url
          });
        }
        this.$nextTick(() => {
          this.form.validateFields();
        });
      },
      /**
       * 新增编辑应用
       * @param type
       * @param data
       */
      getAppDetail() {
        this.$get(this.api.getAppDetailApi, {id: this.appInfoId})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.appDetail = response.data || {}
              if(response.data && response.data.name) {
                if(response.data.icon) {
                  this.fileList = [{
                    uid: '-1',
                    name: '',
                    status: 'done',
                    url: response.data.icon,
                  }]
                }else{
                  this.fileList = []
                }

                this.isEdit = true
              }else{
                this.isEdit = false
              }
              this.dealDetail(response.data)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
          })
      },
      // 编辑数据处理回填
      dealDetail(data = {}) {
        console.log(data)
        let _obj = {}
        Object.assign(this.appDetail, data)
        _obj = Util.deepCopy(data)
        // form数据回填
        _obj = Util.delParams(_obj, ['appCode', 'appKey', 'description', 'name', 'icon', 'isThird', 'uri'])
        // 这里是必须要给一个延时器的
        this.$nextTick(() => {
          this.form.setFieldsValue(_obj)
          this.form.validateFields()
        })
      },

      /**
       * 提交信息
       */
      submitApp() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            Object.assign(this.appDetail, values)
            let _addEditAppApi = ''
            let _params = {}
            if (!this.isEdit) {
              _addEditAppApi = this.api.addMaintainAppApi
              _params = {id: this.appInfoId, ...Util.delParams(this.appDetail, ['appCode', 'appKey', 'description', 'name', 'icon', 'isThird', 'uri'])}
            } else {
              _addEditAppApi = this.api.editMaintainAppApi
              _params = {id: this.appInfoId, ...Util.delParams(this.appDetail, ['appCode', 'appKey', 'description', 'name', 'icon', 'isThird', 'uri'])}
            }
            this.$post(_addEditAppApi, _params)
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.$router.back()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
                // Util.processError(this, res)
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
  #MaintainApp{
    .ant-tabs-bar{
      border: 0!important;
    }
  }
</style>
