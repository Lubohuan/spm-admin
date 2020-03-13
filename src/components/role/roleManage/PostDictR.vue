/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-19 11:18:30
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-31 10:12:52
 * @Description: 角色字典---右模块组件
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" :disabled="!isCheck" v-waves @click="addPostTypeClick">新增角色</a-button>
            <a-button
              class="m-l-10 m-r-10"
              :disabled="!hasSelected"
              v-waves
              @click="deleteHandle"
            >删 除</a-button>
          </div>
          <div class="table-search flex">
            <a-input-search
              class="search"
              placeholder="请输入角色名称"
              v-model="searchParam.search"
              @search="onSearch"
              @change="deb"
              enterButton="搜索"
            />
            <a
              class="m-l-20 align-center flex"
              style="width:50px"
              @click="toggleSlide"
            >{{showAdvancedSearch?"收起":"展开"}}</a>
          </div>
        </div>
      </div>
      <collapse>
        <div class="search-heigh" v-show="showAdvancedSearch">
          <a-form layout="vertical">
            <a-row :gutter="20">
              <a-col :span="6">
                <a-form-item label="角色属性">
                  <a-select v-model="searchParam.roleType" placeholder="请选择角色属性" @change="deb">
                    <a-select-option value>全部</a-select-option>
                    <a-select-option
                      v-for="( roleType, index ) in roleTypes"
                      :value="roleType.dictionaryCode"
                      :key="index + 'roleType'"
                    >{{ roleType.dictionaryName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="是否包含下级组织角色">
                  <div class="flex align-center" style="height:32px;">
                    <a-radio-group name="radioGroup" v-model="searchParam.type" :defaultValue="0" @change="deb">
                      <a-radio :value="1">是</a-radio>
                      <a-radio :value="0">否</a-radio>
                    </a-radio-group>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </collapse>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-table">
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              :dataSource="table.data"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
              :pagination="false"
              :scroll="{x:800, y: table.height }"
              rowKey="roleId"
              size="middle"
            >
              <!-- <template slot="classifyType" slot-scope="text, record">

              </template>-->
              <template slot="roleType" slot-scope="text, record">
                <span>{{ Util.getValueByKey(roleTypes, 'dictionaryCode', 'dictionaryName', record.roleType)}}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <div class="flex">
                  <span class="icon-btn" @click="showDetailModal(record)" title="查看">
                    <icon-font type="spm-icon-shangyicopy5" />
                  </span>
                  <span class="icon-btn" @click="editHandle(record)" title="编辑">
                    <icon-font type="spm-icon-shangyicopy4" />
                  </span>
                </div>
              </template>
            </a-table>
          </a-skeleton>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="pagination.totalCount"
            :pageSize="pagination.pageSize"
            :current="pagination.pageNo"
            @onChange="onChangePage"
            @onShowSizeChange="onShowSizeChangePage"
          ></Pagination>
        </div>
      </div>
    </div>
    <a-modal
      class="postTypeModal"
      centered
      :title="modal.title"
      v-model="modal.is_show"
      :width="800"
      :maskClosable="false"
    >
      <a-form :form="modal.form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="modal.is_typeNum">
            <a-form-item
              label="角色编码"
              :validate-status="formError('num') ? 'error' : ''"
              :help="formError('num') || ''"
            >
              <a-input
                v-decorator="['num',{initialValue: this.modal.typeNum,rules: [{ required: true }]}]"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="角色名称"
              :validate-status="formError('name') ? 'error' : ''"
              :help="formError('name') || ''"
            >
              <a-input
                v-decorator="['name',{rules: [{ required: true, message: '请输入角色名称！' }]}]"
                placeholder="请输入角色名称"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="所属分类"
              :validate-status="formError('roleClassifyName') ? 'error' : ''"
              :help="formError('roleClassifyName') || ''"
            >
              <a-input
                v-decorator="['roleClassifyName',{rules: [{ required: true, message: '请输入角色所属分类！' }]}]"
                placeholder="请输入角色所属分类"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item
              label="角色属性"
              :validate-status="formError('roleType') ? 'error' : ''"
              :help="formError('roleType') || ''"
            >
              <a-select
                v-decorator="['roleType',{rules: [{ required: true, message: '请选择角色属性！' }]}]"
                placeholder="请选择角色属性"
              >
                <a-select-option
                  v-for="( roleType, index ) in roleTypes"
                  :value="roleType.dictionaryCode"
                  :key="index + 'roleType'"
                >{{ roleType.dictionaryName }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="!modal.is_typeNum">
            <a-form-item
              label="编制组织"
              :validate-status="formError('orgName') ? 'error' : ''"
              :help="formError('orgName') || ''"
            >
              <a-input
                v-decorator="['orgName',{rules: [{ required: true, message: '请输入编制组织！' }]}]"
                placeholder="请输入编制组织"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-item label="角色字典描述">
              <a-textarea
                v-decorator="['desc']"
                placeholder="请输入角色字典描述"
                :autosize="{ minRows: 2, maxRows: 6 }"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <template slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          @click="handleOk"
          :disabled="hasErrors(modal.form.getFieldsError())"
        >确定</a-button>
      </template>
    </a-modal>
    <!-- 角色字典分类 组件 -->
    <!-- <PostTreeModal ref="postTree" :data="[]" @postTreeChange="postTreeChange"></PostTreeModal> -->
    <!-- 详情 -->
    <ModalRoleMessage ref="ModalRoleMessage" />
  </div>
</template>

<script>
import Pagination from "@/Pagination";
// import PostTreeModal from "./PostTreeModal";
import debounce from "lodash.debounce";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import ModalRoleMessage from "@/role/roleManage/ModalRoleMessage"; //查看详情
import { mapState } from "vuex";
export default {
  name: "PostDictR",
  components: {
    Pagination,
    collapse,
    ModalRoleMessage
    // PostTreeModal
  },
  props: {
    record: Object
  },
  data() {
    return {
      Util,
      api: {
        list: Util.orgServer + "/web/role-info/page-list", // 获取 角色分页列表
        add: Util.orgServer + "/web/role-info/add", // 新增角色
        roleDetailApi: Util.orgServer + "/web/role-info/detail", // 角色详情
        edit: Util.orgServer + "/web/role-info/edit", // 编辑角色
        delete: Util.orgServer + "/web/role-info/delete", // 删除
        order: Util.orgServer + "/web/post-classify-dict/order" // 上下移
      },
      showAdvancedSearch: false,
      loading: true,
      is_check: false,
      searchParam: {
        search: "",
      },
      table: {
        loading: false,
        height: null,
        columns: [
          {
            title: "角色编码",
            dataIndex: "num",
            width: 180
          },
          {
            title: "角色名称",
            dataIndex: "name",
            width: 180
          },
          {
            title: "编制组织",
            dataIndex: "orgName",
            width: 180
          },
          {
            title: "所属分类",
            dataIndex: "classifyName",
            width: 180
          },
          {
            title: "角色属性",
            dataIndex: "roleType",
            width: 180,
            scopedSlots: {
              customRender: "roleType"
            }
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 140,
            scopedSlots: {
              customRender: "action"
            }
          }
        ],
        data: [],
        selectedRowKeys: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      modal: {
        form: this.$form.createForm(this),
        title: "新增角色",
        is_show: false,
        typeNum: 1, // 分类编码
        typeName: null, //分类名称
        postNum: "",
        postId: "",
        typeData: {
          id: null, //分类id
          name: null, //分类 名称
          pid: null, //分类 父id
          level: null //分类 层级
        },
        is_typeNum: false
      }
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org,
      roleTypes: state => state.dicts.ROLE_ATTRIBUTE
    }),
    hasSelected() {
      return this.table.selectedRowKeys.length > 0;
    },
    isCheck() {
      return this.record.id && this.record.id != "";
    }
  },
  created() {},
  mounted() {
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
    //this.getData(this.record.id);
  },
  watch: {
    record: {
      handler(val, oldVal) {
        this.modal.typeData = val;
        this.searchParam = {
          search:'',
          roleType:'',
          type:0
        };
        this.getData(val.id);
      },
      deep: true
    }
  },
  methods: {
    deb: debounce(
      function() {
        // 搜索方法
        this.getData(this.record.id);
      },
      300 // 延迟时间
    ),
    formError(field) {
      const { getFieldError, isFieldTouched } = this.modal.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    /** 高级搜索条件*/
    toggleSlide() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
      this.changeTableHeight();
    },
    /*改变table的高度*/
    changeTableHeight() {
      if (this.showAdvancedSearch) {
        this.table.height = document.body.clientHeight - 450;
      } else {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      }
    },
    // 获取 角色字典 table
    getData(classifyId) {
      this.table.loading = true;
      let params = {
        current: this.pagination.pageNo,
        size: this.pagination.pageSize,
        other: this.searchParam.search,
        type: this.searchParam.type,
        roleType: this.searchParam.roleType,
        roleClassifyId: classifyId
      };
      // console.log(params);
      this.$post(this.api.list, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.pagination.pageNo = res.data.current;
            this.pagination.totalCount = parseInt(res.data.total);
            this.table.data = res.data.records ? res.data.records : [];
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    // 提交 新增字典
    postAddData(params) {
      this.$post(this.api.add, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            this.getData(this.record.id);
            this.modal.is_show = false;
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 获取 编辑 详情
    getEditData(id) {
      this.modal.postId = id;
      let params = {
        id: id
      };
      this.$get(this.api.roleDetailApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            this.$nextTick(() => {
              this.modal.form.setFieldsValue({
                num: res.data.num, //--角色编码
                name: res.data.name, //--角色名称
                //orgName: "", //编制组织
                roleClassifyName: res.data.roleClassifyName, //所属分类
                desc: res.data.desc, //-角色描述
                roleType: String(res.data.roleType) //角色属性
              });
              this.modal.form.validateFields();
            });
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    showDetailModal(rowData) {
      this.$refs["ModalRoleMessage"].handleOpen(rowData);
    },
    // 编辑 提交
    editSubmit(params) {
      this.$post(this.api.edit, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            this.$message.success("编辑成功！");
            this.getData(this.record.id);
            this.modal.is_show = false;
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 删除
    deleteHandle() {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          const params = {
            ids: this.table.selectedRowKeys
          };
          // console.log(params);
          this.$post(this.api.delete, params)
            .then(response => {
              Util.processRes(response, res => {
                // console.log(response);
                this.$message.success("删除成功！");
                this.getData(this.record.id);
              });
              Util.processError(this, response);
            })
            .catch(res => {
              Util.processError(this, res);
            });
        },
        onCancel() {}
      });
    },
    // 上下移
    moveHandle(id, type) {
      const params = {
        id,
        type
      };
      // console.log(params);
      this.$post(this.api.order, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.getData(this.record.id);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 搜索
    onSearch: debounce(function(val) {
      this.getData(this.record.id);
    }, 0),
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.table.selectedRowKeys = selectedRowKeys;
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      this.getData(this.record.id);
      // 重新请求数据
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageSize = pageSize;
      this.getData(this.record.id);
      // 重新请求数据
    },
    // -----------------------------modal 事件 Start -----------------------------------
    // 新增角色分类 事件
    addPostTypeClick() {
      this.modal.title = "新增角色字典";
      this.modal.is_typeNum = false;
      this.modal.is_show = true;
      this.$nextTick(() => {
        this.modal.form.resetFields();
        this.modal.form.setFieldsValue({
          roleClassifyName: this.modal.typeData.name,
          orgName: this.curr_org.name ? this.curr_org.name : "他的组织"
        });
        this.modal.form.validateFields();
      });
    },
    // 编辑
    editHandle(e) {
      // console.log(e);
      this.modal.typeData.id = e.roleClassifyId;
      this.modal.title = "编辑角色字典";
      this.modal.is_typeNum = true;
      this.modal.is_show = true;
      this.getEditData(e.roleId);
    },
    // 上级分类 选择
    lastTypeClick() {
      this.$refs.postTree.openModal(true);
    },
    // 角色字典 树选择回调
    postTreeChange(RowData) {
      this.modal.form.setFieldsValue({
        type: RowData.name
      });
      this.modal.typeData = RowData;
    },
    // modal 确认
    handleOk(e) {
      this.modal.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        // console.log(values);
        const params = {
          name: values.name, //名称
          roleClassifyId: this.modal.typeData.id, //角色分类id
          orgId: this.curr_org.id ? this.curr_org.id : "12", //组织id
          desc: values.desc, //描述
          roleType: values.roleType //属性
        };
        if (!this.modal.is_typeNum) {
          //新增
          // console.log(params);
          this.postAddData(params);
        } else {
          // 编辑
          params.id = this.modal.postId;
          // console.log(params);
          this.editSubmit(params);
        }
      });
    },
    // modal 取消
    handleCancel(e) {
      this.modal.is_show = false;
    },
    // 操作表单值 init
    initFormValue(
      num = null,
      name = undefined,
      type = this.record.name,
      order = undefined,
      desp = undefined
    ) {
      setTimeout(() => {
        this.modal.form.setFieldsValue({
          num,
          name,
          type,
          order,
          desp
        });
      }, 0);
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
#PostDictR {
  height: 100%;
  display: flex;
  flex-direction: column;
  header {
    padding-bottom: 18px;
    border-bottom: 2px solid #f0f2f5;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .search {
      width: 300px;
    }
  }
  .tableBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    .ant-table-wrapper {
      // flex: 1;
      .pointer {
        color: #1f1f1f;
      }
    }
  }
}
</style>
