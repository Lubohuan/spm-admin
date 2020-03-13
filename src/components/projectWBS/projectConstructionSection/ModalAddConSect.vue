/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 新增施工区段
</comment>
<template>
  <a-modal
    id="ModalAddConSect"
    v-model="visible"
    centered
    :width="500"
    :title="modalTitle"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalAddConSect"
  >
    <div class="body">
      <a-form :form="form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item
              label="区段名称"
              :validate-status="formError('name') ? 'error' : ''"
              :help="formError('name') || ''"
            >
              <a-input
                type="text"
                placeholder="请输入区段名称"
                v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入区段名称！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-if="isSub">
            <a-form-item label="所属节点">
              <a-input
                type="text"
                disabled
                placeholder="所属节点"
                v-decorator="[
                      'pName',
                      {rules: [
                        { required: true },
                      ],
                    }
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
        @click="saveAdd"
        :laoding="ajaxLoading"
        :disabled="hasErrors(form.getFieldsError())||ajaxLoading"
      >确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ModalAddConSect",
  components: {},
  props: {
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      Util,
      api: {
        addArea: Util.wbsServer + "/web/wbs/area/add" // 新增
      },
      ajaxLoading: false,
      modalTitle: "",
      isSub: false,
      visible: false,
      currentRowData: null,
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
      await this.setForm();
      this.form.validateFields();
    },
    setForm() {
      let pName = "";
      if (this.isSub) {
        pName = this.currentRowData.name;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          pName: pName
        });
      });
    },
    /*
     *@params  isSub:是否为添加子集
     *打开modal的事件*/
    handleOpen(isSub, rowData) {
      this.visible = true;
      this.isSub = isSub;
      if (this.isSub) {
        this.modalTitle = "新增施工区段（子级）";
        this.currentRowData = rowData;
      } else {
        this.modalTitle = "新增施工区段";
        this.currentRowData = null;
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
    // 提交
    saveAdd() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.ajaxLoading = true;
          let params = {
            projectId: this.curr_org.id,
            pid: this.currentRowData ? this.currentRowData.id : 0,
            name: values.name
          };
          this.$post(this.api.addArea, params)
            .then(response => {
              this.ajaxLoading = false;
              this.visible = false;
              Util.processRes(
                response,
                () => {
                  this.$message.success("添加成功！");
                  this.$emit("addArea", true);
                },
                () => {}
              );
              Util.processError(this, response);
            })
            .catch(res => {
              this.ajaxLoading = false;
              this.visible = false;
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
.ModalAddConSect {
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
