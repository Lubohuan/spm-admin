/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 新增分部分项
</comment>
<template>
  <a-modal
    id="ModalAddSubItem"
    v-model="visible"
    :width="500"
    centered
    :title="modalTitle"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalAddSubItem"
  >
    <div class="body">
      <a-form :form="form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item
              label="分部分项名称"
              :validate-status="formError('name') ? 'error' : ''"
              :help="formError('name') || ''"
            >
              <a-input
                type="text"
                placeholder="请输入分部分项名称"
                v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入分部分项名称！' },
                      ],
                    }
                  ]"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item
              label="属性"
              :validate-status="formError('subType') ? 'error' : ''"
              :help="formError('subType') || ''"
            >
              <a-select v-decorator="[
                      'subType']" placeholder="请选择属性">
                <a-select-option
                  v-for="( item, index ) in subTypeList"
                  :value="item.id"
                  :key="index"
                  :disabled="item.disabled"
                >
                  {{
                  item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-show="isSub">
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
  name: "ModalAddSubItem",
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
        addApi: Util.wbsServer + "/web/wbs/wbs/add", // 新增分部分项模板内容
        addArea: Util.wbsServer + "/web/wbs/wbs-project/add" // 新增
      },
      ajaxLoading: false,
      modalTitle: "",
      isSub: false,
      showPname: false,
      visible: false,
      subTypeList: [
        { id: "1", name: "分部工程", disabled: false },
        { id: "2", name: "子分部工程", disabled: false },
        { id: "3", name: "分项工程", disabled: false },
        { id: "4", name: "子分项工程", disabled: false }
      ],
      subType: "1",
      currentRowData: {
        id: "",
        name: "",
        subType: "1"
      },
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
      if (this.isSub) {
        this.showPname = true;
        pName = this.currentRowData.name;
        pid = this.currentRowData.id;
      } else {
        this.showPname = false;
        pName = "无";
        pid = "0";
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          pName: pName,
          pid: pid,
          subType: this.subType + ""
        });
      });

      this.form.validateFields();
    },
    /*
     *@params  isSub:是否为添加子集
     *打开modal的事件*/
    handleOpen(isSub, rowData) {
      this.visible = true;
      this.isSub = isSub;

      if (isSub) {
        this.modalTitle = "新增分部分项（子级）";
        this.currentRowData = rowData;
      } else {
        this.modalTitle = "新增分部分项";
      }
      this.delWithSubTypeList(isSub, rowData);
    },
    delWithSubTypeList(isSub, rowData) {
      this.subTypeList.forEach(item => {
        if (isSub) {
          //新增子节点
          if (rowData.subType == 1) {
            //给分部工程添加子节点
            if (item.id == 2 || item.id == 3) {
              //只有子分部工程和分项工程可以选择
              item.disabled = false;
            } else {
              item.disabled = true;
            }
            this.subType = 2;
          } else if (rowData.subType == 2) {
            //给子分部工程添加子节点
            if (item.id == 3) {
              //只有分项工程可以选择
              item.disabled = false;
            } else {
              item.disabled = true;
            }
            this.subType = 3;
          } else if (rowData.subType == 3) {
            //给分项工程添加子节点

            if (item.id == 4) {
              //只有子分项工程可以选择
              item.disabled = false;
            } else {
              item.disabled = true;
            }
            this.subType = 4;
          }
        } else {
          //新增根节点
          if (item.id == 1) {
            item.disabled = false;
          } else {
            item.disabled = true;
          }
          this.subType = 1;
        }
      });
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
          var params = {
            pid: values.pid,
            name: values.name,
            subType: values.subType
          };
          let url = "";
          if (this.type == "subDetail") {
            url = this.api.addApi;
            params.wbsTypeId = this.$route.query.id;
          } else {
            url = this.api.addArea;
            params.projectId = this.curr_org.id;
          }
          this.$post(url, params)
            .then(response => {
              this.loading = false;
              this.ajaxLoading = false;
              Util.processRes(
                response,
                () => {
                  this.$message.success("新增成功！");
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
.ModalAddSubItem {
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
