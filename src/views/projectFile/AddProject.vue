/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-09-09 10:34:59
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-10 16:56:37
 * @Description: 新增项目
 */

<template>
  <div id="AddProject" class="static-warp">
    <Title />
    <div class="content m-20">
      <a-skeleton active :loading="false" :paragraph="{rows: 20}">
        <a-form :form="form">
          <div class="floor">
            <header class="p-t-10">
              <icon-font type="spm-icon-copy2" class="icon" />
              <span>项目基本信息</span>
            </header>
            <div class="formBox">
              <a-row :gutter="20">
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-if="configType!='add'"
                >
                  <a-form-item
                    label="项目编码"
                    :validate-status="formError(form,'pNum') ? 'error' : ''"
                    :help="formError(form,'pNum') || ''"
                  >
                    <a-input
                      v-decorator="['pCompanyNum',{initialValue: '系统默认带出',rules: [{ required: true, message: ' ' }]}]"
                      disabled
                      placeholder="请输入"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目名称"
                    :validate-status="formError(form,'pName') ? 'error' : ''"
                    :help="formError(form,'pName') || ''"
                  >
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['pName',{rules: [{ required: true, message: '请输入项目名称 ' }]}]"
                      placeholder="请输入项目名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目简称"
                    :validate-status="formError(form,'pShortName') ? 'error' : ''"
                    :help="formError(form,'pShortName') || ''"
                  >
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['pShortName',{rules: [{ required: true, message: '请输入项目简称' }]}]"
                      placeholder="请输入项目简称"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-show="false"
                >
                  <a-form-item
                    label="项目经理id"
                    :validate-status="formError(form,'pUserManagerId') ? 'error' : ''"
                    :help="formError(form,'pUserManagerId') || ''"
                  >
                    <a-input
                      read-only
                      class="pointer"
                      :disabled="configType=='detail'"
                      v-decorator="['pUserManagerId',{rules: [{ required: true, message: '请选择项目经理' }]}]"
                      placeholder="请选择项目经理"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目经理"
                    :validate-status="formError(form,'pUserManagerName') ? 'error' : ''"
                    :help="formError(form,'pUserManagerName') || ''"
                  >
                    <!-- <a-input
                      read-only
                      :disabled="configType=='detail'"
                      v-decorator="['pUserManagerName',{rules: [{ required: true, message: '请选择项目经理' }]}]"
                      placeholder="请选择项目经理"
                      @click="managerSelect"
                    />-->
                    <a-input-search
                      read-only
                      :disabled="configType=='detail'"
                      v-decorator="['pUserManagerName',{rules: [{ required: true, message: '请选择项目经理' }]}]"
                      placeholder="请选择项目经理"
                      @search="managerSelect"
                    >
                      <a-button slot="enterButton" :disabled="configType=='detail'">
                        <span>选择</span>
                      </a-button>
                    </a-input-search>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="公司项目编号">
                    <a-input
                      v-decorator="['pCompanyNum']"
                      placeholder="请输入公司项目编号"
                      :disabled="configType=='detail'"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="承建模式"
                    :validate-status="formError(form,'pModel') ? 'error' : ''"
                    :help="formError(form,'pModel') || ''"
                  >
                    <a-select
                      :disabled="configType=='detail'"
                      v-decorator="['pModel',{rules: [{ required: true, message: '请选择承建模式' }]}]"
                      placeholder="请选择承建模式"
                    >
                      <a-select-option value="1">1</a-select-option>
                      <a-select-option value="2">2</a-select-option>
                      <a-select-option value="3">3</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="所属区域"
                    :validate-status="formError(form,'pArea') ? 'error' : ''"
                    :help="formError(form,'pArea') || ''"
                  >
                    <a-cascader
                      :disabled="configType=='detail'"
                      notFoundContent="暂无数据"
                      expandTrigger="hover"
                      :fieldNames="{ label: 'value', value: 'value', children: 'children' }"
                      v-decorator="['pArea',{rules: [{ required: true, message: '请选择区域分布！' }]}]"
                      placeholder="请选择区域"
                      :options="cities"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目地址"
                    :validate-status="formError(form,'pAddress') ? 'error' : ''"
                    :help="formError(form,'pAddress') || ''"
                  >
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['pAddress',{rules: [{ required: true, message: '请输入项目地址' }]}]"
                      placeholder="请输入项目地址"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="floor">
            <header>
              <icon-font type="spm-icon-copy2" class="icon" />
              <span>组织信息</span>
            </header>
            <div class="formBox">
              <a-row :gutter="20">
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-if="configType!='add'"
                >
                  <a-form-item
                    label="所属单位"
                    :validate-status="formError(form,'oCompany') ? 'error' : ''"
                    :help="formError(form,'oCompany') || ''"
                  >
                    <a-input
                      read-only
                      v-decorator="['oCompany',{rules: [{ required: true, message: '请选择所属单位' }]}]"
                      placeholder="主页面带出"
                      disabled
                      @click="changeOrg"
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-show="false"
                >
                  <a-form-item
                    label="所属单位id"
                    :validate-status="formError(form,'oCompanyId') ? 'error' : ''"
                    :help="formError(form,'oCompanyId') || ''"
                    v-if="configType!='add'"
                  >
                    <a-input
                      read-only
                      v-decorator="['oCompanyId']"
                      placeholder="主页面带出"
                      disabled
                      @click="changeOrg"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目部名称"
                    :validate-status="formError(form,'oPName') ? 'error' : ''"
                    :help="formError(form,'oPName') || ''"
                  >
                    <a-input
                      v-decorator="['oPName',{rules: [{ required: true, message: '请选择项目部名称' }]}]"
                      disabled
                    />
                  </a-form-item>
                </a-col>
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-show="false"
                >
                  <a-form-item
                    label="项目部名称id"
                    :validate-status="formError(form,'oPNameId') ? 'error' : ''"
                    :help="formError(form,'oPNameId') || ''"
                  >
                    <a-input
                      v-decorator="['oPNameId',{rules: [{ required: true, message: '请选择项目部名称' }]}]"
                      disabled
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="floor">
            <header>
              <icon-font type="spm-icon-copy2" class="icon" />
              <span>项目概况</span>
            </header>
            <div class="formBox">
              <a-row :gutter="20">
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="投资主体"
                    :validate-status="formError(form,'investType') ? 'error' : ''"
                    :help="formError(form,'investType') || ''"
                  >
                    <a-select
                      :disabled="configType=='detail'"
                      v-decorator="['investType',{rules: [{ required: true, message: '请选择投资主体' }]}]"
                      placeholder="请选择投资主体"
                    >
                      <a-select-option value="1">政府投资</a-select-option>
                      <a-select-option value="2">国有企业</a-select-option>
                      <a-select-option value="3">股份公司</a-select-option>
                      <a-select-option value="4">个人投资</a-select-option>
                      <a-select-option value="5">外商投资</a-select-option>
                      <a-select-option value="6">其他</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="建设单位">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['conCompany']"
                      placeholder="请输入建设单位"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="监理单位">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['supCompany']"
                      placeholder="请输入监理单位"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="勘察单位">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['prosCompany']"
                      placeholder="请输入勘察单位"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="设计单位">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['designCompany']"
                      placeholder="请输入设计单位"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="项目实际开工日期">
                    <a-date-picker
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      placeholder="请选择日期"
                      :showToday="false"
                      :disabled="configType=='detail'"
                      v-decorator="['startTime']"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="项目实际竣工日期">
                    <a-date-picker
                      :disabled="configType=='detail'"
                      style="width: 100%"
                      format="YYYY-MM-DD"
                      placeholder="请选择日期"
                      :showToday="false"
                      v-decorator="['compTime']"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="项目状态"
                    :validate-status="formError(form,'pStatus') ? 'error' : ''"
                    :help="formError(form,'pStatus') || ''"
                  >
                    <a-select
                      :disabled="configType=='detail'"
                      v-decorator="['pStatus',{rules: [{ required: true, message: '请选择项目状态' }]}]"
                      placeholder="请选择项目状态"
                    >
                      <a-select-option value="1">在建</a-select-option>
                      <a-select-option value="2">竣工</a-select-option>
                      <a-select-option value="3">停工</a-select-option>
                      <a-select-option value="4">完工</a-select-option>
                      <a-select-option value="5">新承建未开工</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col
                  :xs="24"
                  :sm="24"
                  :md="8"
                  :lg="8"
                  :xl="8"
                  style="padding: 0 20px"
                  v-show="false"
                >
                  <a-form-item
                    label="图片url"
                    :validate-status="formError(form,'pUrl') ? 'error' : ''"
                    :help="formError(form,'pUrl') || ''"
                  >
                    <a-input v-decorator="['pUrl']" placeholder="图片url" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="20" class="p-l-20 p-r-20">
                <p class="p-b-20">项目效果图：</p>

                <div class="itemImgBox">
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

                  <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false">
                    <img alt="example" style="width: 100%" class="m-t-20" :src="previewImage" />
                  </a-modal>
                </div>
              </a-row>
            </div>
          </div>
          <div class="floor">
            <header>
              <icon-font type="spm-icon-copy2" class="icon" />
              <span>工程信息</span>
            </header>
            <div class="formBox">
              <a-row :gutter="20">
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="工程类别">
                    <a-select
                      :disabled="configType=='detail'"
                      v-decorator="['eType']"
                      placeholder="请选择工程类别"
                    >
                      <a-select-option value="1">数据字典</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="工程造价（万元）">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="[
                        'eMoney',
                        {
                          rules: [
                            {
                              validator:validatorNumber
                            }
                          ],
                        }
                      ]"
                      placeholder="请输入工程造价"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item label="工程规模">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="[
                        'scale',
                        {
                          rules: [
                            {
                              validator:validatorNumber
                            }
                          ],
                        }
                      ]"
                      placeholder="请输入工程规模"
                    >
                      <a-select
                        :disabled="configType=='detail'"
                        slot="addonAfter"
                        style="width: 100px"
                        v-decorator="[
                        'units',
                      ]"
                      >
                        <a-select-option value="万平方米">万平方米</a-select-option>
                        <a-select-option value="km">km</a-select-option>
                        <a-select-option value="亿元">亿元</a-select-option>
                      </a-select>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" style="padding: 0 20px">
                  <a-form-item label="工程概况">
                    <a-input
                      :disabled="configType=='detail'"
                      v-decorator="['projectDesc']"
                      placeholder="请输入工程概况"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" style="padding: 0 20px">
                  <a-form-item
                    label="是否重点项目"
                    :validate-status="formError(form,'isImport') ? 'error' : ''"
                    :help="formError(form,'isImport') || ''"
                  >
                    <a-radio-group
                      :disabled="configType=='detail'"
                      v-decorator="['isImport',{rules: [{ required: true, message: '请选择是否重点项目' }]}]"
                    >
                      <a-radio :value="0">是</a-radio>
                      <a-radio :value="1">否</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </div>
        </a-form>
      </a-skeleton>
      <div class="submitBox m-b-20">
        <a-button @click="handleCancel">清 空</a-button>
        <a-button
          class="m-l-20"
          type="primary"
          @click="handleSubmit"
          :disabled="hasErrors(form.getFieldsError())"
        >确 定</a-button>
      </div>
    </div>
    <user-modal
      v-if="userVisible"
      :isVisible="userVisible"
      @closed="userVisible = false"
      @change="setUserValue"
      :multiple="false"
    ></user-modal>
    <org-modal :isVisible="orgVisible" @closed="orgVisible = false" @change="setValue"></org-modal>
  </div>
</template>

<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
import { mapState } from "vuex";
import UserModal from "@/select/UserModal"; //分页组件
import OrgModal from "@/select/OrgModal"; //组织组件
import Title from "@/Title";
import cities from "#/assets/js/cities";
export default {
  name: "AddProject",
  components: {
    Title,
    UserModal,
    OrgModal
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        listArchivesProjectApi: Util.systemServer + "/web/archives-project/add", // 新增的保存接口
        editArchivesProjectApi:
          Util.systemServer + "/web/archives-project/edit", // 编辑的保存接口
        detailArchivesProjectApi:
          Util.systemServer + "/web/archives-project/details" // 详情接口
      },
      orgVisible: false,
      userVisible: false,
      configType: "",
      currentId: "",
      projectId: "",
      loading: false,
      form: this.$form.createForm(this),
      cities: cities, // 省市区三级联动数据
      imageUrl: "",
      fileList: [],
      previewVisible: false,
      previewImage: ""
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {
    // console.log(this.configType)
  },
  mounted() {
    this.init();
  },
  watch: {},
  methods: {
    // 组件初始化
    init() {
      this.configType = this.$route.query.configType;
      if (this.configType != "add") {
        //编辑或详情
        this.currentId = this.$route.query.id;
        this.$nextTick(() => {
          this.getDetails(this.currentId);
        });
      } else {
        //新增
        this.projectId = this.$route.query.projectId;
        this.$nextTick(() => {
          this.form.setFieldsValue({
            isImport: 1,
            oPName: this.$route.query.projectName,
            oPNameId: this.$route.query.projectId,
            units: "万平方米"
          });
          this.form.validateFields();
        });
      }
    },
    // 清空
    handleCancel() {
      this.init();
    },
    goBack() {
      this.$router.push({
        path: "/main/projectFile" //跳转的路径
      });
    },
    // 项目经理选择
    managerSelect() {
      this.userVisible = true;
    },
    changeOrg() {
      this.orgVisible = true;
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
          pUrl: this.fileObj.url
        });
      }
      this.$nextTick(() => {
        this.form.validateFields();
      });
    },
    validatorNumber(rule, value, callback) {
      const form = this.form;
      if (Util.Reg6.test(value)) {
        callback();
      } else {
        callback("请输入数字，小数点保留4位小数！");
      }
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
      // this.fileList = [...this.fileList, file];
      //return false;
    },
    //上传文件
    customRequest(data) {
      this.loading = true;
      let params = {
        file: data.file,
        module: "spm-operation", //租户、密钥模块
        business: "tenantContract" //租户合同
      };
      this.$uploadFile(params).then(response => {
        Util.processRes(response, () => {
          this.$message.success("上传成功！");
          this.loading = false;
          this.$nextTick(() => {
            this.fileObj = {
              fileName: response.data[0].realName,
              url: response.data[0].path
            };
            this.fileList = [
              {
                uid: "-1",
                name: response.data[0].realName,
                status: "done",
                url: response.data[0].path
              }
            ];
            this.form.setFieldsValue({
              pUrl: this.fileObj.url
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
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },

    // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
    formError(form, field) {
      const { getFieldError, isFieldTouched } = form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    // 提交
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.pArea = values.pArea ? values.pArea.join("/") : "";
          values.startTime = values.startTime
            ? this.moment(values.startTime).format("X") * 1000
            : "";
          values.compTime = values.compTime
            ? this.moment(values.compTime).format("X") * 1000
            : "";
          if (this.configType == "add") {
            this.addPost(values); //新增请求后台接口
          } else if (this.configType == "edit") {
            this.editPost(values); //编辑请求后台接口
          } else {
          }
        }
        console.log(values);
      });
    },
    addPost(values) {
      let params = values;
      params.orgId = this.$route.query.orgId;
      this.$post(this.api.listArchivesProjectApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("新增成功！");
              this.goBack();
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    editPost(values) {
      let params = values;
      params.id = this.currentId;
      this.$post(this.api.editArchivesProjectApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("修改成功！");
              this.goBack();
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    getDetails(id) {
      this.loading = true;
      this.$get(this.api.detailArchivesProjectApi, { id: id })
        .then(response => {
          //this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$nextTick(() => {
                this.setForm(response.data);
              });
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          // this.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * 表单回显
     */
    setForm(rowData) {
      let stime = rowData.startTime
        ? this.moment(Number(rowData.startTime))
        : undefined;
      let etime = rowData.compTime
        ? this.moment(Number(rowData.compTime))
        : undefined;
      this.fileList = [
        {
          uid: "-1",
          name: "12",
          status: "done",
          url: rowData.purl ? rowData.purl : undefined
        }
      ];
      this.form.setFieldsValue({
        isImport: Number(rowData.isImport),
        pNum: rowData.pnum ? rowData.pnum : undefined,
        pName: rowData.pname ? rowData.pname : undefined,
        pShortName: rowData.pshortName ? rowData.pshortName : undefined,
        pUserManagerId: rowData.puserManagerId
          ? rowData.puserManagerId
          : undefined,
        pUserManagerName: rowData.pUserManagerName
          ? rowData.pUserManagerName
          : "13",
        pCompanyNum: rowData.pcompanyNum ? rowData.pcompanyNum : undefined,
        pModel: rowData.pmodel ? rowData.pmodel + "" : undefined,
        pArea: rowData.parea.split("/"),
        pAddress: rowData.paddress ? rowData.paddress : undefined,
        oCompany: rowData.orgName ? rowData.orgName : "12342",
        oCompanyId: rowData.orgId ? rowData.orgId : undefined,
        oPName: rowData.opname ? rowData.opname : "项目",
        oPNameId: rowData.opnameId ? rowData.opnameId : undefined,
        investType: rowData.investType ? rowData.investType + "" : undefined,
        conCompany: rowData.conCompany ? rowData.conCompany : undefined,
        supCompany: rowData.supCompany ? rowData.supCompany : undefined,
        prosCompany: rowData.prosCompany ? rowData.prosCompany : undefined,
        designCompany: rowData.designCompany
          ? rowData.designCompany
          : undefined,
        startTime: stime,
        compTime: etime,
        pStatus: rowData.pstatus ? rowData.pstatus + "" : undefined,
        pUrl: rowData.purl ? rowData.purl : undefined,
        eType: rowData.etype ? rowData.etype + "" : undefined,
        eMoney: rowData.emoney ? rowData.emoney : undefined,
        scale: rowData.scale ? rowData.scale : undefined,
        units: rowData.units ? rowData.units : "万平方米",
        projectDesc: rowData.projectDesc ? rowData.projectDesc : undefined
      });
      this.form.validateFields();
    },
    setValue(val) {
      //   console.log(val);
    },
    //经理回填
    setUserValue(val) {
      if (val.length > 0) {
        this.form.setFieldsValue({
          pUserManagerId: val[0].id,
          pUserManagerName: val[0].name
        });
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
#AddProject {
  .content {
    padding: 0 20px;
    overflow-y: auto;
    .floor {
      header {
        @include primary_color();
        line-height: 45px;
        .icon {
          font-size: 26px;
          vertical-align: middle;
          margin-bottom: 3px;
        }
      }
      .formBox {
        padding: 10px 10px 0;
        .itemImgBox {
          .avatar-uploader > .ant-upload {
            width: 500px;
            height: 200px;
          }
          .ant-upload-select-picture-card i {
            font-size: 32px;
            color: #999;
          }

          .ant-upload-select-picture-card .ant-upload-text {
            margin-top: 8px;
            color: #666;
          }
        }
      }
    }
    .submitBox {
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
  }
}
</style>
