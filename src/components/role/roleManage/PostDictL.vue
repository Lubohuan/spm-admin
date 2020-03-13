/*
* @Autor: 何景春
* @Version: 1.0
* @Date: 2019-08-19 11:18:49
* @LastEditors: OBKoro1
* @LastEditTime: 2019-08-31 10:03:25
* @Description: 角色字典---左模块组件
*/

<template>
  <div class="pannel">
    <div class="pannel-title">
      <a-input-search placeholder="请输入角色分类名称" v-model="search" @change="onSearch">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="btnBox m-b-20">
          <a-button type="primary" v-waves @click="addPostTypeClick">新增角色分类</a-button>
          <a-button class="m-l-10" :disabled="!is_check" v-waves @click="editPostTypeClick">编 辑</a-button>
          <a-button class="m-l-10" :disabled="!is_check" v-waves @click="deletePostTypeClick">删 除</a-button>
        </div>
        <div class="table-table">
          <a-skeleton active :loading="loading" :paragraph="{rows: 15}">
            <a-table
              v-if="table.searchData.length>0"
              :defaultExpandAllRows="true"
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              rowKey="id"
              :dataSource="table.searchData"
              :scroll="{ y: table.height }"
              :pagination="false"
              :customRow="rowClick"
              :rowClassName="rowClassName"
              size="middle"
            >
              <template slot="type" slot-scope="text,record,index">
                <span>{{record.type==1?'业务类':"运营类"}}</span>
              </template>
              <template slot="action" slot-scope="text,record,index">
                <span class="pointer m-r-20" v-show="index" @click.stop="moveHandle(record.id,1)">
                  <a-icon type="arrow-up"/>
                </span>
                <span
                  class="pointer"
                  v-show="(!record.pid || record.pid == null || record.pid == '0') ? (table.data.length - 1 > index) :  (Util.getDataByProps(table.data,'id',record.pid).children.length - 1 > index)"
                  @click.stop="moveHandle(record.id,2)"
                >
                  <a-icon type="arrow-down"/>
                </span>
              </template>
            </a-table>
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </a-skeleton>
        </div>
      </div>
    </div>
    <a-modal class="postTypeModal" centered :title="modal.title" :width="800" v-model="modal.is_show"
             :maskClosable="false">
      <a-skeleton active :loading="loading" :paragraph="{rows: 4}">
        <a-form :form="modal.form">
          <a-row :gutter="20">
            <!-- 分类编码：编辑时出现 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="modal.is_typeNum">
              <a-form-item
                label="分类编码"
                :validate-status="formError('num') ? 'error' : ''"
                :help="formError('num') || ''"
              >
                <a-input v-decorator="['num',{rules: [{ required: true }]}]" disabled/>
              </a-form-item>
            </a-col>
            <!-- 分类名称 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="分类名称"
                :validate-status="formError('name') ? 'error' : ''"
                :help="formError('name') || ''"
              >
                <a-input
                  v-decorator="['name',{rules: [{ required: true, message: '请输入分类名称' }]}]"
                  placeholder="请输入"
                />
              </a-form-item>
            </a-col>
            <!-- 上级分类 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="上级分类"
                :validate-status="formError('lastTypeName') ? 'error' : ''"
                :help="formError('lastTypeName') || ''"
              >
                <a-input-search
                  v-decorator="['lastTypeName']"
                  placeholder="请选择上级分类"
                  read-only
                  :disabled="modal.is_typeNum?true:false"
                  @search="lastTypeClick"
                >
                  <a-button slot="enterButton" :disabled="modal.is_typeNum?true:false">
                    <span>选择</span>
                  </a-button>
                </a-input-search>
              </a-form-item>
            </a-col>
            <!-- 上级分类id -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="false">
              <a-form-item label="上级分类">
                <a-input class="pointer" v-decorator="['pid']" placeholder="请选择上级分类id"/>
              </a-form-item>
            </a-col>
            <!-- 层级 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-show="false">
              <a-form-item label="层级">
                <a-input class="pointer" v-decorator="['level']" placeholder="请选择层级"/>
              </a-form-item>
            </a-col>
            <!-- 分类树形 -->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="分类属性"
                :validate-status="formError('classifyType') ? 'error' : ''"
                :help="formError('classifyType') || ''"
              >
                <a-select
                  v-decorator="[
                      'classifyType', {
                        rules: [{ required: true, message: '请选择分类属性！'}],
                      }]"
                  placeholder="请选择分类属性"
                >
                  <a-select-option value="1">业务类</a-select-option>
                  <a-select-option value="2">运营类</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="handleCancel">取消</a-button>
        <a-button
          type="primary"
          @click="handleOk"
          :disabled="hasErrors(modal.form.getFieldsError())"
        >确定
        </a-button>
      </template>
    </a-modal>
    <!-- 角色分类 组件 -->
    <PostTreeModal ref="postTree" :data="table.data" @postTreeChange="postTreeChange"></PostTreeModal>
    <!-- 选择角色分类组件 -->
    <!-- <roleModal  v-if="userVisible" :isVisible='userVisible' @closed="userVisible = false"
    @change="setBossValue"/>-->
  </div>
</template>

<script>
  import PostTreeModal from "./PostTreeModal";
  // import roleModal from "@/select/roleModal"
  import debounce from "lodash.debounce";
  import {mapState} from "vuex";

  export default {
    name: "PostDictL",
    components: {
      PostTreeModal
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          list: Util.orgServer + "/web/role-classify/list", // 获取 角色分类树结构
          add: Util.orgServer + "/web/role-classify/add", // 新增角色分类
          editDetail: Util.orgServer + "/web/role-classify/detail", // 获取 编辑详情
          edit: Util.orgServer + "/web/role-classify/edit", // 编辑 提交
          delete: Util.orgServer + "/web/role-classify/delete", // 删除
          order: Util.orgServer + "/web/post-classify/order" // 上下移
        },
        loading: true,
        is_check: false,
        search: "",
        table: {
          height: null,
          record: {},
          columns: [
            {
              title: "分类编码",
              dataIndex: "num"
            },
            {
              title: "分类名称",
              dataIndex: "title",
              width: 200
            },
            {
              title: "分类属性",
              dataIndex: "type",
              width: 100,
              scopedSlots: {
                customRender: "type"
              }
            }
            // {
            //   title: "操作",
            //   dataIndex: "operation",
            //   width: 80,
            //   scopedSlots: {
            //     customRender: "action"
            //   }
            // }
          ],
          data: [],
          searchData: []
        },
        modal: {
          form: this.$form.createForm(this),
          title: "",
          is_show: false,
          typeNum: 1, // 分类编码
          typeName: null, //分类名称
          lastTypeData: {
            id: null, //上级分类id
            name: null, //上级分类 名称
            pid: null, //上级分类 父id
            level: null //上级分类 层级
          },
          is_typeNum: false
        }
      };
    },
    computed: {
      ...mapState({
        roleClassifyTypes: state => state.dicts.ORGANIZATION_TYPE
      })
    },
    created() {
    },
    mounted() {
      this.table.height = document.body.clientHeight - 365;
      window.onresize = () => {
        this.table.height = document.body.clientHeight - 365;
      };
      this.getData();
    },
    watch: {},
    methods: {
      formError(field) {
        const {getFieldError, isFieldTouched} = this.modal.form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      // 获取 角色分类树结构
      getData(init) {
        this.$get(this.api.list)
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              // console.log(res);
              this.table.data = res.data ? Util.dealData(res.data) : [];
              this.table.searchData = this.table.data;
              //默认选中第一行
              if (init && this.table.data && this.table.data.length > 0) {
                this.table.record = this.table.searchData[0];
                this.table.record.id = this.table.searchData[0]["id"];
                this.$emit("handleRow", this.table.record.id);
                this.rowClick(this.table.searchData[0]);
                this.rowClassName(this.table.searchData[0]);
              }
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            console.log(res);
          });
      },
      // 提交 新增角色分类
      postAddData(params) {
        this.$post(this.api.add, params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              this.$message.success("新增成功！");
              this.getData();
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
      getEditData() {
        console.log(this.table.record);
        /**
         * res.data.classifyNum,
         res.data.classifyName,
         res.data.parentName
         */

        this.$get(this.api.editDetail, {id: this.table.record.id})
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              // console.log(response);
              console.log(res);
              this.$nextTick(() => {
                this.modal.form.setFieldsValue({
                  num: res.data.num,
                  name: res.data.name,
                  classifyType: String(res.data.type)
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
      // 编辑 提交
      editSubmit(params) {
        this.$post(this.api.edit, params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              this.$message.success("编辑成功！");
              this.getData();
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
        this.$post(this.api.delete, {id: this.table.record.id})
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              // console.log(response);
              this.$message.success("删除成功！");
              this.getData(true);
            });

            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
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
              this.getData();
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      },
      // 搜索
      onSearch: debounce(function (val) {
        this.searchValue = val.target.value;
        this.handleSearch(val.target.value);
      }, 1000),
      handleSearch(val) {
        this.table.searchData = val
          ? Util.treeSearch(val, 'name', this.table.data)
          : this.table.data;
      },
      // 行点击
      rowClick(record, index) {
        return {
          on: {
            click: () => {
              this.table.record = record;
              // console.log(this.table.record);
            }
          }
        };
      },
      // 新增 行 class
      rowClassName(record, index) {
        let className = "";
        if (record.id === this.table.record.id) {
          className = "rowActive";
          this.is_check = true;
          this.$emit("rowActiveHandle", this.table.record);
        }
        return className;
      },
      // 删除
      deletePostTypeClick() {
        this.$confirm({
          title: "删除",
          content: "确定要删除吗 ?",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            this.deleteHandle();
          },
          onCancel() {
          }
        });
      },
      // -----------------------------modal 事件 Start -----------------------------------
      // 新增角色分类 事件
      addPostTypeClick() {
        this.modal.title = "新增角色分类";
        this.modal.is_typeNum = false;
        this.modal.is_show = true;
        this.$nextTick(() => {
          this.modal.form.resetFields();
          this.modal.form.validateFields();
        });
      },
      // 编辑角色分类 事件
      editPostTypeClick() {
        this.modal.title = "编辑角色分类";
        this.modal.is_typeNum = true;
        this.modal.is_show = true;
        this.getEditData();
      },
      // 上级分类 选择
      lastTypeClick() {
        this.$refs.postTree.openModal(true);
      },
      // 角色字典 树选择回调
      postTreeChange(RowData) {
        this.modal.form.setFieldsValue({
          lastTypeName: RowData.name,
          pid: RowData.id,
          level: RowData.level
        });
      },
      // modal 确认
      handleOk(e) {
        this.modal.form.validateFields((err, values) => {
          if (err) {
            return;
          }
          if (!this.modal.is_typeNum) {
            //新增
            const params = {
              name: values.name,
              classifyType: values.classifyType,
              pid: !values.pid ? 0 : values.pid,
              level: !values.level ? 1 : values.level + 1
            };
            // console.log(params);
            this.postAddData(params);
          } else {
            // 编辑
            const params = {
              id: this.table.record.id,
              name: values.name,
              classifyType: values.classifyType
            };
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
      initFormValue(typeNum = null, typeName = null, lastTypeName = null) {
        setTimeout(() => {
          this.modal.form.setFieldsValue({
            typeNum,
            typeName,
            lastTypeName
          });
        }, 0);
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  #PostDictL {
    height: 100%;
    //   padding: 20px;
    display: flex;
    flex-direction: column;
    .search {
      padding-bottom: 18px;
      border-bottom: 2px solid #f0f2f5;
    }
    .tableBox {
      flex: 1;
      .btnBox {
        padding-bottom: 0;
      }
      .pointer {
        // display: inline-block;
        // width: 14px;
        color: #1f1f1f;
      }
      .rowActive {
        background-color: #cfe8fc;
      }
      .lastType {
        color: aqua;
      }
    }
  }

  .postTypeModal {
    /*.ant-form-item-label {
      margin: 9px 0;
    }*/
    .ant-row {
      line-height: 32px;
    }
  }
</style>
