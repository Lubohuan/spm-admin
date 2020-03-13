/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 新增预警分类
</comment>
<template>
  <a-modal
    id="ModalAddWarningClassify"
    v-model="visible"
    :width="500"
    centered
    :title="modalTitle"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalAddWarningClassify"
  >
    <div class="body">
      <a-form :form="form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item
              label="预警分类名称"
              :validate-status="formError('name') ? 'error' : ''"
              :help="formError('name') || ''"
            >
              <a-input
                type="text"
                placeholder="请输入预警分类名称"
                v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入预警分类名称！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="showPname">
            <a-form-item label="所属节点">
              <a-input
                type="text"
                disabled
                placeholder="所属节点"
                v-decorator="[
                      'pName',
                  ]"
              />
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="false">
            <a-form-item label="所属节点Id">
              <a-input
                type="text"
                disabled
                placeholder="所属节点Id"
                v-decorator="[
                      'pid',
                  ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleClose">取消</a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="ajaxLoading"
        @click="saveAdd"
        :disabled="hasErrors(form.getFieldsError())||ajaxLoading"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ModalAddWarningClassify",
  components: {},
  props: {
    tableData: {
      type: Array
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      Util,
      api: {
        addApi: Util.systemServer + "/web/alarm-classify/add", // 新增预警分类
        editApi: Util.systemServer + "/web/alarm-classify/edit" // 编辑预警分类
      },
      ajaxLoading: false,
      modalTitle: "",
      isSub: false,
      showPname: false,
      visible: false,
      form: this.$form.createForm(this),
      defaultForm: {}
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*重置模态框中的值*/
    async reset() {
      this.form.resetFields();
      this.setForm();
    },
    setForm() {
      let pName = "";
      let pid = "";
      let name = "";
      if (this.isSub == "addSub") {
        pName = this.currentRowData.name;
        pid = this.currentRowData.id;
        name = "";
      } else if (this.isSub == "add") {
        pName = "无";
        pid = "0";
        name = "";
      } else if (this.isSub == "editSub") {
        pName = this.currentRowData.pname;
        pid = this.currentRowData.pid;
        name = this.currentRowData.name;
      }
      this.form.setFieldsValue({
        pName: pName,
        pid: pid,
        name: name
      });
      this.form.validateFields();
    },
    /*
     *@params  isSub:是否为添加子集
     *打开modal的事件*/
    handleOpen(isSub, rowData) {
      this.visible = true;
      this.isSub = isSub;
      if (rowData) {
        this.currentRowData = rowData;
        this.currentRowData.level > 1
          ? (this.showPname = true)
          : (this.showPname = false);
      } else {
        this.currentRowData = null;
        this.showPname = false;
      }

      if (isSub == "addSub") {
        this.modalTitle = "新增预警分类（子级）";
      } else if (isSub == "add") {
        this.modalTitle = "新增预警分类";
      } else if (isSub == "editSub") {
        this.modalTitle = "编辑预警分类";
      }
      this.$nextTick(() => {
        this.reset();
      });
    },
    /*关闭modal后的回调事件*/
    handleClose() {
      this.visible = false;
    },
    formError(field) {
      const { getFieldError, isFieldTouched } = this.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    saveAdd() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.ajaxLoading = true;
          var params = {};
          var url = "";
          var message = "";
          if (this.isSub == "editSub") {
            url = this.api.editApi;
            message = "编辑成功！";
            params = {
              id: this.currentRowData.id,
              name: values.name
            };
          } else {
            url = this.api.addApi;
            message = "新增成功！";
            params = {
              pid: values.pid,
              name: values.name
            };
          }
          this.$post(url, params)
            .then(response => {
              this.loading = false;
              this.ajaxLoading = false;
              Util.processRes(
                response,
                () => {
                  this.$message.success(message);
                  this.handleClose();
                  this.$emit("searchList", false);
                },
                () => {}
              );
              Util.processError(this, response);
            })
            .catch(res => {
              this.loading = false;
              this.ajaxLoading = false;
              Util.processError(this, res);
            });
        }
      });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.ModalAddWarningClassify {
  .ant-form {
    .ant-row {
      div[class^="ant-col"] {
        height: 82px;
        overflow: hidden;
      }
    }
  }
}
</style>
