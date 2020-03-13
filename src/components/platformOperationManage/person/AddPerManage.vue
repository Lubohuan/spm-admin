/*
 * @Autor: 何景春
 * @Version: 1.0.1
 * @Date: 2019-10-23 11:00:51
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-10-25 10:37:28
 * @Description: 新增/编辑 人员
 */

<template>
  <div id="AddPerManage">
    <a-modal
      class="AddPerManage"
      :title="modal.title"
      v-model="modal.visible"
      :width="800"
      okText="确认"
      cancelText="取消"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
        <a-form :form="form">
          <a-row :gutter="20">
            <!-- <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="任职组织"
                :validate-status="formError(form,'orgName') ? 'error' : ''"
                :help="formError(form,'orgName') || ''"
              >
                <a-input
                  :disabled="true"
                  v-decorator="['orgName',{initialValue: orgData.name,rules: [{ required: true, message: ' ' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门"
                :validate-status="formError(form,'depName') ? 'error' : ''"
                :help="formError(form,'depName') || ''"
              >
                <a-input
                  :disabled="true"
                  v-decorator="['depName',{initialValue: orgMsg.deptName,rules: [{ required: true, message: ' ' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>-->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="姓名"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '请输入姓名' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="性别"
                :validate-status="formError(form,'sex') ? 'error' : ''"
                :help="formError(form,'sex') || ''"
              >
                <a-select
                  v-decorator="['sex',{initialValue: '男',rules: [{ required: true, message: '请选择性别' }]}]"
                >
                  <a-select-option value="0">男</a-select-option>
                  <a-select-option value="1">女</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="证件类型"
                :validate-status="formError(form,'identityType') ? 'error' : ''"
                :help="formError(form,'identityType') || ''"
              >
                <a-select
                  v-decorator="['identityType',{initialValue: '1',rules: [{ required: true, message: '请选择证件类型' }]}]"
                  @change="selectChange"
                >
                  <a-select-option value="1">身份证</a-select-option>
                  <a-select-option value="2">居住证</a-select-option>
                  <a-select-option value="3">驾驶证</a-select-option>
                  <a-select-option value="4">特种操作证</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="12"
              style="height: 87px;;overflow: hidden;"
            >
              <a-form-item
                label="证件号码"
                :validate-status="formError(form,'identityNo') ? 'error' : ''"
                :help="formError(form,'identityNo') || ''"
              >
                <a-input
                  v-decorator="['identityNo',{rules: [{ required: true, message: ' ' },{
                              validator: validatorICard
                            }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="手机号"
                :validate-status="formError(form,'phone') ? 'error' : ''"
                :help="formError(form,'phone') || ''"
              >
                <a-input
                  v-decorator="['phone',
                    {
                        rules: [
                            { required: true, message: ' ' },
                            {
                              validator:validatorTel
                            }
                        ]
                    }
                  ]"
                  placeholder="请输入手机号码！"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item v-bind="modal.birthday" label="出生日期">
                <a-date-picker
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  placeholder="请选择日期"
                  :showToday="false"
                  v-decorator="['birthday']"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="邮箱"
                :validate-status="formError(form,'mail') ? 'error' : ''"
                :help="formError(form,'mail') || ''"
              >
                <a-input
                  v-decorator="['mail',
                    {
                      rules: [
                        { pattern: Util.email,  message: '请输入正确的邮箱格式!' }
                      ]
                    }
                ]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="员工号"
                :validate-status="formError(form,'jobNumber') ? 'error' : ''"
                :help="formError(form,'jobNumber') || ''"
              >
                <a-input v-decorator="['jobNumber']" placeholder="请输入" />
              </a-form-item>
            </a-col>-->
            <!-- <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="岗位"
                :validate-status="formError(form,'jobNumber') ? 'error' : ''"
                :help="formError(form,'jobNumber') || ''"
              >
                <a-input
                  read-only
                  v-decorator="['postName']"
                  placeholder="请选择岗位"
                  @click="postSelect"
                />
                <a-input-search
                  read-only
                  v-decorator="['postName']"
                  placeholder="请选择岗位"
                  @search="postSelect"
                >
                  <a-button slot="enterButton">
                    <span>选择</span>
                  </a-button>
                </a-input-search>
              </a-form-item>
            </a-col>-->
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="handleCancel">取 消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          @click="handleOk"
          :disabled="hasErrors(form.getFieldsError())"
        >确 认</a-button>
      </template>
    </a-modal>
    <!-- <post-modal
      ref="PostModal"
      :isVisible="postVisible"
      tableType="table"
      @closed="postVisible = false"
      @change="setPostValue"
      :multiple="false"
    ></post-modal>-->
  </div>
</template>

<script>
// import PostModal from "../position/PostModal";
export default {
  name: "AddPerManage",
  components: {
    // "post-modal": PostModal
  },
  props: {
    orgMsg: Object
  },
  data() {
    return {
      Util,
      api: {
        join: Util.orgServer + "/web/member/join", // 新增人员
        update: Util.orgServer + "/web/member/update", // 编辑人员
        details: Util.orgServer + "/web/member/details" // 人员详情弹层
      },
      loading: false,
      form: this.$form.createForm(this),
      postVisible: false,
      useId: null,
      identityType: 1,
      modal: {
        title: "",
        visible: false,
        type: null,
        orgName: "", //组织名称
        birthday: "" //生日
        // postId: "", //岗位ID
        // postName: "" //岗位名称
      }
    };
  },
  computed: {
    orgData() {
      const orgData = Util.deepCopy(this.orgMsg);
      return orgData;
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    // modalinit
    modalInit(e) {
      this.modal.visible = true;
      this.modal.title = e.title;
      this.modal.type = e.type;
      this.$nextTick(() => {
        //新增
        this.form.resetFields();
      });
      switch (this.modal.type) {
        case 1:
          this.$nextTick(() => {
            //新增
            this.form.validateFields();
          });
          break;
        case 2: //编辑
          this.getDetais(e.id);
          break;
      }
    },
    // 设置表单数据回填
    setForm(record) {
      // console.log(record);
      let identityType = "";
      this.form.setFieldsValue({
        // orgName: record.orgName,
        // depName: record.depName,
        name: record.name,
        sex: record.sex === 0 ? "男" : "女",
        identityType: record.identityType + "",
        identityNo: record.identityNo,
        phone: record.phone,
        birthday: record.birthday ? this.moment(Number(record.birthday)) : null,
        mail: record.mail,
        // jobNumber: record.jobNumber,
        postName: record.postName
      });
    },
    // modal 确认
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        let userSex;
        if (values.sex == "男") {
          userSex = "0";
        } else if (values.sex == "女") {
          userSex = "1";
        } else {
          userSex = values.sex;
        }
        const params = {
          name: values.name, //人员姓名
          sex: userSex, //人员性别
          identityType: values.identityType, //身份类型： 1身份证， 2护照
          identityNo: values.identityNo, //证件号码
          birthday: values.birthday
            ? this.moment(values.birthday).format("X") * 1000
            : "", //生日
          // birthday: values.birthday,
          mail: values.mail ? values.mail : "", //邮箱
          // jobNumber: values.jobNumber ? values.jobNumber : "", //员工号
          // orgId: this.orgData.orgId, //所在组织
          // depId: this.orgMsg.deptId, //所在部门
          // postId: this.modal.postId, //所在岗位
          phone: values.phone, //手机号  即登陆号
          nick: "", //昵称
          profile: "", //头像
          area: "" //所在地区
        };
        switch (this.modal.type) {
          case 1:
            this.submitForm(this.api.join, params);
            break;
          case 2:
            params.id = this.useId;
            this.submitForm(this.api.update, params);
            break;
        }
      });
    },
    // 新增、编辑 提交
    submitForm(url, params) {
      this.$post(url, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.$emit("change", "新增成功");
            this.modal.visible = false;
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // modal 取消
    handleCancel(e) {
      this.modal.visible = false;
      this.form.resetFields();
    },
    // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
    formError(form, field) {
      const { getFieldError, isFieldTouched } = form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
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
    // 邮箱
    validatorMail(rule, value, callback) {
      const form = this.form;
      if (Util.email.test(value)) {
        callback();
      } else {
        callback("请输入正确的邮箱！");
      }
    },
    // 身份证验证
    validatorICard(rule, value, callback) {
      const form = this.form;
      let identityType = this.form.getFieldValue("identityType");
      if (identityType == 1) {
        if (Util.iCard.test(String(value))) {
          callback();
          let date = "";
          if (value.length == 15) {
            date = "19" + value.substr(6, 6);
          } else if (value.length == 18) {
            date = value.substr(6, 8);
          }
          date = date.replace(/(.{4})(.{2})/, "$1-$2-");
          this.form.setFieldsValue({
            birthday: this.moment(date)
          });
        } else {
          callback("请输入正确的证件号码！");
        }
      } else {
        callback();
      }
    },
    // 岗位选择
    // postSelect() {
    //   this.postVisible = true;
    //   this.$nextTick(() => {
    //     this.$refs["PostModal"].getTableData([{ id: this.orgData.deptId }]);
    //   });
    // },
    // // 选择岗位回调
    // setPostValue(val) {
    //   if (val.length) {
    //     this.modal.postId = val[0].id;
    //     this.modal.postName = val[0].dictName;
    //     this.form.setFieldsValue({
    //       postName: this.modal.postName
    //     });
    //   }
    //   this.postVisible = false;
    // },
    //获取详情
    getDetais(id) {
      this.useId = id;
      const params = "?id=" + id;
      this.$get(this.api.details + params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            if (response.data) {
              this.$nextTick(() => {
                this.setForm(response.data);
              });
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 证件类型切换处理
    selectChange(e) {
      // console.log(e);
      this.form.setFieldsValue({
        identityNo: "",
        birthday: null
      });
      this.form.validateFields();
      this.identityType = Number(e) + "";
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.AddPerManage {
  .ant-form {
    [class*="ant-col"] {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
