/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  数据字典内容-树型
</comment>
<template>
  <div id="ListTree" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex" style="height:calc(100vh)">
      <!-- 左边内容 -->
      <div class="page-content-left" style="width:426px;">
        <div class="pannel">
          <div class="pannel-title">
            <a-input-search placeholder="请输入名称" v-model="searchValue" @change="search">
              <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
            </a-input-search>
          </div>
          <div class="pannel-content">
            <div class="table-box">
              <div class="btnBox m-b-20">
                <a-button type="primary" v-waves @click="addClick()" v-if="enableConfig">新增</a-button>
                <!-- 平台情况 -->
                <span v-if="isPlatform">
                  <a-button
                    type="primary"
                    v-waves
                    @click="editClick()"
                    :disabled="!(selectedId.length>0&&selectedOrgId==-1)"
                  >编辑</a-button>
                  <a-button
                    v-waves
                    @click="delClick()"
                    :disabled="!(selectedId.length>0&&selectedOrgId==-1)"
                  >删 除</a-button>
                  <!-- <a-button v-waves @click="upLoadClick()">导入</a-button>
                  <a-button v-waves @click="downLoadClick()">下载导入模板</a-button>-->
                </span>
                <!-- 租户情况 -->
                <span v-else>
                  <a-button
                    type="primary"
                    v-waves
                    @click="editClick()"
                    :disabled="!(selectedId.length>0&&selectedOrgId==curr_org.id)"
                  >编辑</a-button>
                  <a-button
                    v-waves
                    @click="delClick()"
                    :disabled="!(selectedId.length>0&&selectedOrgId==curr_org.id)"
                  >删 除</a-button>
                  <!-- <a-button v-waves @click="upLoadClick()">导入</a-button>
                  <a-button v-waves @click="downLoadClick()">下载导入模板</a-button>-->
                </span>
              </div>
              <div class="table-table">
                <a-skeleton active :loading="loading" :paragraph="{rows: 15}">
                  <div class="tree-box">
                    <a-tree
                      v-if="treeData.length>0"
                      class="draggable-tree"
                      defaultExpandAll
                      :selectedKeys="selectedId"
                      :treeData="treeData"
                      @select="onSelect"
                    />
                    <div v-else class="ant-table-placeholder">暂无数据</div>
                  </div>
                </a-skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-1">
        <div class="pannel">
          <div class="pannel-content">
            <div class="table-box">
              <div class="table-table">
                <a-skeleton active :loading="formLoading" :paragraph="{rows: 15}">
                  <a-form :form="form" layout="vertical" ref="aForm">
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item
                          label="编码"
                          :validate-status="formError('num') ? 'error' : ''"
                          :help="formError('num') || ''"
                        >
                          <a-input
                            :disabled="(this.configType=='edit'||this.configType=='detail')?true:false"
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
                            :disabled="(this.configType=='detail')?true:false"
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
                          label="上级"
                          :validate-status="formError('projectName') ? 'error' : ''"
                          :help="formError('projectName') || ''"
                        >
                          <a-input-search
                            v-decorator="['projectName']"
                            placeholder="请选择上级"
                            read-only
                            :disabled="(this.configType!='add')?true:false"
                            @search="showSelectModal"
                          >
                            <a-button
                              slot="enterButton"
                              :disabled="(this.configType!='add')?true:false"
                            >
                              <span>选择</span>
                            </a-button>
                          </a-input-search>
                          <!-- <a-input
                            class="pointer"
                            :disabled="(this.configType=='detail')?true:false"
                            v-decorator="['projectName']"
                            placeholder="请选择上级"
                            read-only
                            @click="showSelectModal"
                          />-->
                        </a-form-item>
                      </a-col>
                      <!-- 隐藏的上级id -->
                      <a-col :span="12" v-show="false">
                        <a-form-item
                          label="上级ID"
                          :validate-status="formError('pid') ? 'error' : ''"
                          :help="formError('pid') || ''"
                        >
                          <a-input class="pointer" v-decorator="['pid']" placeholder="上级ID" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item
                          label="简称"
                          :validate-status="formError('shortName') ? 'error' : ''"
                          :help="formError('shortName') || ''"
                        >
                          <a-input
                            :disabled="(this.configType=='detail')?true:false"
                            v-decorator="['shortName']"
                            placeholder="请输入简称"
                          />
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
                            style="margin-top:10px"
                            :disabled="(this.configType=='detail')?true:false"
                            v-decorator="['isEnable', { rules: [{ required: true, message: ' '}] }]"
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
                            :disabled="(this.configType=='detail')?true:false"
                            placeholder="请输入显示顺序"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item
                          label="创建组织"
                          :validate-status="formError('orgName') ? 'error' : ''"
                          :help="formError('orgName') || ''"
                        >
                          <a-input
                            :disabled="true"
                            v-decorator="['orgName']"
                            placeholder="请输入创建组织"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12" v-show="false">
                        <a-form-item
                          label="创建组织id"
                          :validate-status="formError('orgId') ? 'error' : ''"
                          :help="formError('orgId') || ''"
                        >
                          <a-input :disabled="true" v-decorator="['orgId']" placeholder />
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
                            :disabled="(this.configType=='detail')?true:false"
                            placeholder
                            :autosize="{ minRows: 3, maxRows: 4 }"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
                </a-skeleton>
              </div>
            </div>
          </div>
          <div class="pannel-title top" v-if="configType!='detail'">
            <a-button v-waves @click="cancelClick">取消</a-button>
            <a-button
              type="primary"
              v-waves
              @click="saveClick"
              :disabled="hasErrors(form.getFieldsError())"
            >确定</a-button>
          </div>
        </div>
      </div>
    </div>
    <ModalTree
      ref="ModalTree"
      @selectHigherLevel="selectHigherLevel"
      :treeData="treeData"
      :treeInitData="treeInitData"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";
import Title from "@/Title";
import ModalTree from "@/basicBusinessConfig/listTree/ModalTree";
import Cookie from "js-cookie";
export default {
  name: "ListTree",
  components: {
    Title,
    ModalTree
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        treeArchivesContentApi:
          Util.systemServer + "/web/archives-content/tree", //列表
        addArchivesContentApi: Util.systemServer + "/web/archives-content/add", // 新增
        editArchivesContentApi:
          Util.systemServer + "/web/archives-content/edit", // 编辑
        detailArchivesContentApi:
          Util.systemServer + "/web/archives-content/detail", // 详情
        delArchivesContentApi:
          Util.systemServer + "/web/archives-content/delete" // 删除
      },
      selectedOrgId: "",
      newAddId: "",
      isPlatform: false,
      enableConfig: false,
      formLoading: false,
      configType: "detail",
      searchValue: "",
      selectedId: [],
      modelId: "",
      loading: false,
      isEnable: true,
      form: this.$form.createForm(this),
      treeData: [],
      treeInitData: []
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {
    this.isPlatform = Cookie.get("isPlatform") == "yes" ? true : false;
    this.enableConfig =
      Cookie.get("isPlatform") == "yes" || this.curr_org.pid == "0"
        ? true
        : false;
    this.modelId = this.$route.query.id;
    this.searchList();
  },
  mounted() {},
  watch: {},
  methods: {
    searchList() {
      this.loading = true;
      this.$post(this.api.treeArchivesContentApi, { modelId: this.modelId })
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.treeInitData = response.data
              ? Util.dealData(response.data)
              : [];
            this.treeData = this.treeInitData;
            if (
              (this.configType == "add" || this.configType == "edit") &&
              this.selectedId.length > 0
            ) {
              this.configType = "detail";
              this.getDetails(this.selectedId[0]);
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * tree搜索
     */
    search: debounce(function(val) {
      this.searchValue = val.target.value;
      this.handleSearch(val.target.value);
    }, 1000),
    // 搜索
    handleSearch(val) {
      this.treeData = val
        ? Util.treeSearch(val, "name", this.treeInitData)
        : this.treeInitData;
    },
    onSelect(selectedKeys, info) {
      if (!info.selected) {
        return;
      }
      this.selectedOrgId = info.node.dataRef.orgId;
      this.configType = "detail";
      this.selectedId = selectedKeys;
      if (this.selectedId.length > 0) {
        this.getDetails(this.selectedId[0]);
      }
    },
    selectHigherLevel(data) {
      this.form.setFieldsValue({
        projectName: data.name,
        pid: data.id
      });
    },
    //获取详情
    getDetails(id) {
      this.formLoading = true;
      this.$get(this.api.detailArchivesContentApi, { id: id })
        .then(response => {
          this.formLoading = false;
          Util.processRes(response, () => {
            this.setForm(response.data);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.formLoading = false;
          Util.processError(this, res);
        });
    },
    reset() {
      this.$nextTick(() => {
        //this.form.resetFields();
        this.isEnable = true;
        this.form.setFieldsValue({
          isEnable: this.isEnable,
          orgName:
            Cookie.get("isPlatform") == "yes" ? "平台" : this.curr_org.name,
          orgId: Cookie.get("isPlatform") == "yes" ? "-1" : this.curr_org.id
        });
        this.form.validateFields();
      });
    },
    //编辑的回显 详情的回显
    setForm(rowData) {
      this.$nextTick(() => {
        this.isEnable = rowData.isEnable == 0 ? true : false;
        this.form.setFieldsValue({
          isEnable: this.isEnable,
          orgName: rowData.orgName ? rowData.orgName : "",
          orgId: rowData.orgId ? rowData.orgId : "",
          name: rowData.name,
          num: rowData.num,
          projectName: rowData.projectName,
          pid: rowData.pid,
          shortName: rowData.shortName ? rowData.shortName : "",
          desc: rowData.desc ? rowData.desc : "",
          displayOrder: rowData.displayOrder
        });
        this.form.validateFields();
      });
    },
    showSelectModal() {
      this.$refs["ModalTree"].handleOpen();
    },
    addClick() {
      this.configType = "add";
      this.form.resetFields();
      this.reset();
    },
    editClick() {
      this.configType = "edit";
    },
    delClick() {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.configType = "del";
          this.$post(this.api.delArchivesContentApi, { id: this.selectedId[0] })
            .then(response => {
              Util.processRes(
                response,
                () => {
                  //this.list.loading = false;
                  this.$message.success("删除成功！");
                  this.searchList();
                  this.form.resetFields();
                  this.reset();
                  this.selectedId = [];
                  this.configType = "detail";
                },
                () => {}
              );
              Util.processError(this, response);
            })
            .catch(res => {
              //this.list.loading = false;
              Util.processError(this, res);
            });
        },
        onCancel() {}
      });
    },
    upLoadClick() {},
    downLoadClick() {},
    cancelClick() {
      this.configType = "detail";
    },
    saveClick() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.pid = values.pid ? values.pid : "0";
          values.projectName = values.projectName ? values.projectName : "";
          values.isEnable = values.isEnable ? 0 : 1;
          values.modelId = this.modelId;
          if (this.configType == "add") {
            this.addPost(values); //添加请求后台接口
          } else if (this.configType == "edit") {
            this.editPost(values); //编辑请求后台接口
          } else {
          }
        }
      });
    },
    addPost(values) {
      let params = values;
      this.$post(this.api.addArchivesContentApi, params)
        .then(response => {
          Util.processRes(
            response,
            () => {
              this.$message.success("添加成功！");
              this.newAddId = response.modelId;
              this.searchList();
            },
            () => {
              this.reset();
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.reset();
          Util.processError(this, res);
        });
    },
    editPost(values) {
      let params = values;
      params.id = this.selectedId[0];
      this.$post(this.api.editArchivesContentApi, params)
        .then(response => {
          Util.processRes(
            response,
            () => {
              this.$message.success("修改成功！");
              this.searchList();
            },
            () => {
              this.reset();
            }
          );
          Util.processError(this, response);
        })
        .catch(res => {
          this.reset();
          Util.processError(this, res);
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
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
#ListTree {
  .ant-modal-body {
  }
  .tree-box {
    height: calc(100vh - 300px);
    overflow: auto;
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
