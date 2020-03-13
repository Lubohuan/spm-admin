/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  新增租户
</comment>
<template>
  <a-modal
    v-model="visible"
    centered
    class="ModalConfigFile"
    :width="850"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">{{title}}</template>
    <a-form :form="form" layout="vertical" ref="aForm">
      <a-row :gutter="24">
        <a-col :span="12" v-show="false">
          <a-form-item
            label="模型id"
            :validate-status="formError('modelId') ? 'error' : ''"
            :help="formError('modelId') || ''"
          >
            <a-input
              v-decorator="[
                        'modelId',
                      ]"
              placeholder="请输入编码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="编码"
            :validate-status="formError('num') ? 'error' : ''"
            :help="formError('num') || ''"
          >
            <a-input
              :disabled="this.type=='edit'?true:false"
              v-decorator="[
                        'num',
                        {
                          rules: [
                            {
                              required: true,
                              message: '请输入编码！',
                            },
                            { pattern: Util.Reg9,  message: '请输入字母或数字或其组合!' }
                          ],
                        }
                      ]"
              placeholder="请输入编码"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="名称"
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
                              message: '请输入名称！',
                            },
                          ],
                        }
                      ]"
              placeholder="请输入名称"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="简称"
            :validate-status="formError('shortName') ? 'error' : ''"
            :help="formError('shortName') || ''"
          >
            <a-input v-decorator="['shortName']" placeholder="请输入简称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="启用"
            :validate-status="formError('isEnable') ? 'error' : ''"
            :help="formError('isEnable') || ''"
          >
            <a-switch
              v-model="isEnable"
              v-decorator="['isEnable', { rules: [{ required: true, message: ' '}] }]"
              style="margin-top:10px"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="显示顺序"
            :validate-status="formError('displayOrder') ? 'error' : ''"
            :help="formError('displayOrder') || ''"
          >
            <a-input
              v-decorator="['displayOrder',{
                          rules: [
                            {
                              required: true,
                              message: ' ',
                            },
                            {
                              validator: validatorOrder,
                            }
                          ],
                        }]"
              placeholder="请输入显示顺序（大于0的正整数）"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="创建组织"
            :validate-status="formError('orgName') ? 'error' : ''"
            :help="formError('orgName') || ''"
          >
            <a-input :disabled="true" v-decorator="['orgName']" placeholder="请输入创建组织" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-show="false">
          <a-form-item
            label="创建组织Id"
            :validate-status="formError('orgId') ? 'error' : ''"
            :help="formError('orgId') || ''"
          >
            <a-input :disabled="true" v-decorator="['orgId']" placeholder="请输入创建组织Id" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="备注"
            :validate-status="formError('desc') ? 'error' : ''"
            :help="formError('desc') || ''"
          >
            <a-textarea
              v-decorator="['desc']"
              placeholder="Autosize height with minimum and maximum number of lines"
              :autosize="{ minRows: 3, maxRows: 4 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="saveConfig" :disabled="hasErrors(form.getFieldsError())">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
import Cookie from "js-cookie";
export default {
  name: "ModalAddTenant",
  components: {},
  props: {
    modelId: String
  },
  data() {
    return {
      ///web/tenant-admin/add
      Util,
      api: {
        addArchivesContentApi:
          Util.systemServer +
          "/web/archives-content/add", // 新增管理员
        editArchivesContentApi:
          Util.systemServer +
          "/web/archives-content/edit" // 编辑管理员
      },
      visible: false,
      title: "",
      type: "",
      isEnable: true,
      form: this.$form.createForm(this),
      currentRowData: null,
      notReGetCode: true
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {

  },
  mounted() {},
  watch: {},
  methods: {
    reset(rowData, configType) {
      this.currentRowData = rowData;
      this.type = configType;
      this.title =
        configType == "add" ? "新增数据字典内容" : "编辑数据字典内容";
      this.$nextTick(() => {
        this.form.resetFields();
        this.form.setFieldsValue({
          isEnable: true,
          modelId: this.modelId,
          orgName:
            Cookie.get("isPlatform") == "yes" ? "平台" : this.curr_org.name,
          orgId: Cookie.get("isPlatform") == "yes" ? "-1" : this.curr_org.id
        });

        //this.defaultChecked = true;
        if (configType == "edit") {
          this.setForm(rowData);
        } else {
          this.isEnable = true;
          this.form.validateFields();
        }
      });
    },
    changeTel(e) {
      if (Util.tel.test(String(e.target.value))) {
        if (this.notReGetCode) {
          this.disGetCode = false;
        }
      } else {
        this.disGetCode = true;
      }
    },
    /*打开modal的事件*/
    handleOpen(rowData, configType) {
      this.visible = true;
      this.reset(rowData, configType);
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    setForm(rowData) {
      this.$nextTick(() => {
        this.isEnable = rowData.isEnable == 1 ? false : true;
        this.form.setFieldsValue({
          name: rowData.name,
          num: rowData.num,
          shortName: rowData.shortName,
          desc: rowData.desc,
          displayOrder: rowData.displayOrder
        });
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
    validatorOrder(rule, value, callback) {
      const form = this.form;
      if (Util.Reg4.test(String(value))) {
        callback();
      } else {
        callback("请输入大于0的正整数！");
      }
    },
    saveConfig() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.isEnable = values.isEnable ? 0 : 1;
          values.pid = 1;
          if (this.type == "add") {
            this.addAdmin(values); //新增请求后台接口
          } else if (this.type == "edit") {
            this.editAdmin(values); //编辑请求后台接口
          } else {
            this.replaceTelAdmin(values); //编辑请求后台接口
          }
        }
      });
    },
    addAdmin(values) {
      let params = values;
      this.$post(this.api.addArchivesContentApi, params)
        .then(response => {
          this.loading = false;
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
          Util.processError(this, res);
        });
    },
    editAdmin(values) {
      let params = values;
      params.id = this.currentRowData.id;
      this.$post(this.api.editArchivesContentApi, params)
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
    },
    replaceTelAdmin(values) {
      let params = {
        tenantAdminId: this.currentRowData.tenantAdminId,
        tel: values.newTel,
        code: values.code,
        password: values.newPassword
      };
      this.$post(this.api.replaceTelApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              this.$message.success("手机号更换成功！");
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
.ModalConfigFile {
  .ant-modal-body {
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
