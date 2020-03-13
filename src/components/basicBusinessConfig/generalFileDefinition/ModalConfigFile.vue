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
    <!-- <div style="height:380px"> -->
      <a-form :form="form" layout="vertical" ref="aForm">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item
              label="数据字典编码"
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
                              message: '请输入数据字典编码！',
                            },
                             { pattern: Util.Reg9,  message: '请输入字母或数字或其组合!' }
                          ],
                        }
                      ]"
                placeholder="请输入数据字典编码"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="数据字典名称"
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
                              message: '请输入数据字典名称！',
                            },
                          ],
                        }
                      ]"
                placeholder="请输入数据字典名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="模块"
              :validate-status="formError('modelType') ? 'error' : ''"
              :help="formError('modelType') || ''"
            >
              <a-select
                placeholder="请选择模块"
                v-decorator="[
                      'modelType', {
                        rules: [{ required: true, message: '请选择模块！'}],
                      }]"
                :disabled="type=='add'?true:false"
              >
                <a-select-option
                  v-for="(item,index) in platformList"
                  :key="index"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="字典类型"
              :validate-status="formError('type') ? 'error' : ''"
              :help="formError('type') || ''"
            >
              <a-select
                :disabled="this.type=='edit'?true:false"
                v-decorator="[
                      'type', {
                        rules: [{ required: true, message: '请选择字典类型！'}],
                      }]"
                placeholder="请选择字典类型"
              >
                <a-select-option value="1">列表型</a-select-option>
                <a-select-option value="0">树状型</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 2019年10月21注释掉 -->
          <!-- <a-col :span="12">
            <a-form-item
              label="组织隔离"
              :validate-status="formError('orgStatus') ? 'error' : ''"
              :help="formError('orgStatus') || ''"
            >
              <a-select
                @change="orgStatusChange"
                v-decorator="[
                      'orgStatus', {
                        rules: [{ required: true, message: '请选择组织隔离！'}],
                      }]"
                placeholder="请选择组织隔离"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="hasOrgStatus">
            <a-form-item
              label="数据权限范围"
              :validate-status="formError('range') ? 'error' : ''"
              :help="formError('range') || ''"
            >
              <a-select
                v-decorator="[
                      'range', {
                        rules: [{ required: true, message: '请选择数据权限范围！'}],
                      }]"
                placeholder="请选择数据权限范围"
              >
                <a-select-option value="2">平台+本级</a-select-option>
                <a-select-option value="3">平台+本级+最近上级</a-select-option>
                <a-select-option value="1">平台+本级+所有上级</a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :span="12">
            <a-form-item
              label="租户可维护"
              :validate-status="formError('tenantStatus') ? 'error' : ''"
              :help="formError('tenantStatus') || ''"
            >
              <a-select
                v-decorator="[
                      'tenantStatus', {
                        rules: [{ required: true, message: '请选择租户可维护！'}],
                      }]"
                placeholder="请选择租户可维护"
              >
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="来源"
              :validate-status="formError('source') ? 'error' : ''"
              :help="formError('source') || ''"
            >
              <a-select
                v-decorator="[
                      'source'
                      ]"
                placeholder="请选择来源"
              >
                <a-select-option value="1">平台</a-select-option>
                <a-select-option value="2">标准档案</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注">
              <a-textarea
                placeholder="备注"
                v-decorator="['desc']"
                :autosize="{ minRows: 3, maxRows: 4 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    <!-- </div> -->

    <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="saveConfig" :disabled="hasErrors(form.getFieldsError())">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalAddTenant",
  components: {},
  props: ["currentLeftId", "platformList"],
  data() {
    return {
      ///web/tenant-admin/add
      Util,
      api: {
        archivesTypeListApi:
          Util.systemServer +
          "/web/archives-type/list", // 数据字典list
        addArchivesModelApi:
          Util.systemServer +
          "/web/archives-model/add", // 新增
        editArchivesModelApi:
          Util.systemServer +
          "/web/archives-model/edit" // 编辑
      },
      hasOrgStatus: true,
      visible: false,
      title: "",
      type: "",
      form: this.$form.createForm(this),
      currentRowData: null,
      notReGetCode: true
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    reset(rowData, configType) {
      this.hasOrgStatus = true;
      this.currentRowData = rowData;
      this.type = configType;
      this.title =
        configType == "add" ? "新增数据字典模型" : "编辑数据字典模型";
      this.$nextTick(() => {
        this.form.resetFields();
        if (this.type == "edit") {
          this.setForm(rowData);
        } else {
          this.form.setFieldsValue({
            modelType: this.currentLeftId
          });
          this.form.validateFields();
        }
      });
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
    // orgStatusChange(e) {//2019年10月21注释掉
    //   e == "1" ? (this.hasOrgStatus = true) : (this.hasOrgStatus = false);
    // },
    setForm(rowData) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: rowData.name,
          num: rowData.num,
          modelType: this.currentLeftId,
          type: rowData.type+'',
          // orgStatus: rowData.orgStatus+'',//是否组织隔离  2019年10月21注释掉
          // range: rowData.range+'',//数据权限范围  2019年10月21注释掉
          desc: rowData.desc?rowData.desc:'',
          source: rowData.source?rowData.source+'':'',
          tenantStatus: rowData.tenantStatus
        });
        //2019年10月21注释掉
        // if (rowData.orgStatus == 1) {
        //   this.form.setFieldsValue({
        //     range: rowData.range
        //   });
        // }
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
    /*管理员名称校验*/
    validatorAdminName(rule, value, callback) {
      const form = this.form;
      if (Util.adminName.test(String(value))) {
        callback();
      } else {
        callback("请输入汉字、英文、数字或其组合！");
      }
    },
    // 管理员账号校验
    validatorAdminAccount(rule, value, callback) {
      const form = this.form;
      if (
        Util.adminAccount.test(String(value)) &&
        Util.beginWidthAb.test(String(value))
      ) {
        callback();
      } else {
        callback(
          "请输入6-18位字符，包含英文字母、数字、下划线，以英文字母开头！"
        );
      }
    },
    saveConfig() {
      this.form.validateFields((err, values) => {
        if (!err) {
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
      this.$post(this.api.addArchivesModelApi, params)
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
      values.id = this.currentRowData.id
      this.$post(this.api.editArchivesModelApi, params)
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
