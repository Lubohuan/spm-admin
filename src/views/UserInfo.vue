/**
* @Author: 李晨光
* @Date: 2019/9/9
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/9
**/
<comment>
  # 组件注释
  个人中心
</comment>
<template>
  <div id="UserInfo">
    <a-modal
      title="个人信息"
      centered
      wrapClassName="userInfo"
      :width="800"
      :visible="formModalVisible"
      @ok="changeUserInfo"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="false" :paragraph="{rows: 10}">
        <a-form
          :form="form"

        >
          <div class="flex" style="position: relative">

            <!-- <a-upload
               class="profilePhoto"
               :fileList="fileList"
               listType="picture-card"
               :remove="handleRemove"
               :customRequest="customRequest"
               :beforeUpload="beforeUpload"
               @preview="handlePreview"
             >
               <div v-if="fileList.length < 1" style="border-radius: 50px">
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
                   { required: true, message: '请输入应用描述！' },
                 ]
               }
             ]"/>-->
            <div @click="iconModalVisible = !iconModalVisible" class="profile pointer">
              <img :src="icon" alt="">
            </div>
            <div style="margin-top: 80px;">
              <a-row :gutter="20">
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <a-form-item
                    label="手机号"
                    :validate-status="formError(form,'phone') ? 'error' : ''"
                    :help="formError(form,'phone') || ''"
                  >
                    <a-input
                      type="text"
                      placeholder="请输入手机号"
                      disabled
                      v-decorator="[
                            'phone',
                            {rules: [
                              { required: true, message: '请输入手机号！' },
                            ]
                          }
                        ]"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <a-form-item
                    label="用户名"
                    :validate-status="formError(form,'name') ? 'error' : ''"
                    :help="formError(form,'name') || ''"

                  >
                    <a-input
                      type="text"
                      placeholder="用户名"
                      v-decorator="[
                            'name',
                            {rules: [
                              { required: true, message: '用户名！' },
                            ]
                          }
                        ]"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <a-form-item
                    label="邮箱"
                    :validate-status="formError(form,'mail') ? 'error' : ''"
                    :help="formError(form,'mail') || ''"

                  >
                    <a-input
                      type="text"
                      placeholder="邮箱"
                      v-decorator="[
                            'mail',
                            {rules: [
                              { required: false, message: '邮箱！' },
                            ]
                          }
                        ]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="changeUserInfo"
                  :disabled="hasErrors(form.getFieldsError())">保 存
        </a-button>
      </template>
    </a-modal>
    <a-modal
      title="上传图片"
      centered
      :width="500"
      :visible="iconModalVisible"
      @cancel="iconModalVisible = false"
    >
      <a-skeleton active :loading="false" :paragraph="{rows: 10}">
        <div class="flex align-center justify-center">
          <croppa ref="croppa" :width="300"
                  :height="300"
                  placeholder="上传头像"
                  v-model="myCroppa"
                  prevent-white-space
                  canvas-color="transparent"
                  @zoom="onZoom"
                  initial-image="../../static/man_2.jpg"
                  @init="onInit">
            <icon-font type="spm-icon-shouqicopy"></icon-font>
          </croppa>
          <a-slider :marks="{0: '缩小', 100 : '放大'}"
                    style="height: 200px;margin-left: 60px;"
                    id="test"
                    :vertical="true"
                    :zoom-speed="10"
                    :min="sliderMin"
                    :max="sliderMax"
                    @new-image-drawn="onNewImage"
                    :step="10" v-model="sliderVal" @change="changeIconSize"/>
        </div>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="iconModalVisible = false">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary"
                  @click="submitImg">确 认
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/Title'
  import 'vue-croppa/dist/vue-croppa.css'
  import {mapState} from 'vuex'
  // import Croppa from 'vue-croppa'
  export default {
    name: 'UserInfo',
    components: {
      Title,
    },
    props: {},
    data() {
      return {
        api: {
          changeUserInfoApi: Util.orgServer + '/web/member/update '
        },
        form: this.$form.createForm(this), // 新增应用
        fileList: [],
        previewVisible: false,
        previewImage: '',
        myCroppa: {},
        iconModalVisible: false,
        sliderVal: 0,
        sliderMin: 0,
        sliderMax: 100,
        icon: '../../static/man_2.jpg',
        formModalVisible: false
      }
    },
    computed: {
      ...mapState({
        login_msg: state => state.login_msg
      })
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      openModal() {
        let _obj = Util.delParams(this.login_msg, ['name', 'phone', 'mail'])
        this.formModalVisible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(_obj)
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
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleChange({fileList}) {
        this.fileList = fileList
      },
      handleCancel() {
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
        // console.log(this.fileList)
        //固定参数

        const params = {
          appId: 'spm',
          appName: 'spm',
          module: "spm-user", //租户、密钥模块
          business: "profile" //租户合同
        }
        //合并参数
        //创建formData 并赋值
        let formData = new FormData();
        for (let key in params) {
          formData.append(key, params[key])
        }

        formData.append('file', data, 'profile.png')

        this.$uploadImg(formData).then(response => {
          Util.processRes(response, () => {
            this.$message.success("上传成功！");
            this.icon = response.data[0].path
            this.iconModalVisible = false
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
      onInit() {
        this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
          /*
           * ctx: canvas context
           * x: start point (top-left corner) x coordination
           * y: start point (top-left corner) y coordination
           * w: croppa width
           * h: croppa height
          */
          console.log(x, y, w, h)
          ctx.beginPath()
          ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
          ctx.closePath()
        })
      },
      changeIconSize(e) {
        this.myCroppa.scaleRatio = e / 10
        console.log(this.myCroppa.scaleRatio)
      },
      onZoom() {
        this.sliderVal = this.myCroppa.scaleRatio * 10
      },
      onNewImage() {
        this.sliderVal = this.myCroppa.scaleRatio
        this.sliderMin = this.myCroppa.scaleRatio / 2
        this.sliderMax = this.myCroppa.scaleRatio * 2
      },
      submitImg() {
        console.log(this.myCroppa)
        this.myCroppa.generateBlob((blob) => {
          console.log(blob)
          this.customRequest(blob)
        }, "image/png", .8)
      },
      changeUserInfo() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            let _obj = Util.deepCopy(this.login_msg)
            Object.assign(_obj, values)
            _obj.profile = this.icon
            let _params = Util.delParams(_obj, ['tenantId', 'name', 'id', 'profile', 'mail', 'phone'])
            this.$post(this.api.changeUserInfoApi, _params)
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.$store.commit('SET_LOGINMSG', response.data)
                  this.closeModal()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
                // Util.processError(this, res)
              })
          }
        })


      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #UserInfo {
    .profilePhoto {
      .ant-upload.ant-upload-select-picture-card > .ant-upload {
        border-radius: 50px;
      }
      .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
        width: 100px;
        height: 100px;
      }
    }
    .croppa-container {
      border-radius: 50%;
    }
  }

  .userInfo {
    .ant-modal-header {
      height: 170px;
      background: url('../assets/image/login/userInfo-bg.png') no-repeat;
      background-size: 100% 100%;
      color: #fff;
    }
    .ant-modal-title, .ant-modal-close {
      color: #fff;
    }
    .profile {
      position: absolute;
      left: 0;
      right: 0;
      top: -105px;
      margin: 0 auto;
      width: 150px;
      height: 150px;
      padding: 5px;
      background: #eee;
      border-radius: 75px;
      overflow: hidden;
      img{
        width: 140px;
        height: 140px;
        border-radius: 70px;
      }
    }
  }


</style>
