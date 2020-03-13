/*
* @Autor: 何景春
* @Version: 1.0
* @Date: 2019-08-19 11:18:30
* @LastEditors: OBKoro1
* @LastEditTime: 2019-09-19 18:17:07
* @Description: 岗位字典---右模块组件
*/

<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" :disabled="!isCheck" v-waves @click="addPostTypeClick">新增岗位字典</a-button>
            <a-button
              class="m-l-10 m-r-10"
              :disabled="!hasSelected"
              v-waves
              @click="deleteHandle"
            >删 除
            </a-button>
          </div>
          <div class="table-search flex">
            <a-input-search
              class="search"
              placeholder="请输入岗位字典名称"
              v-model="search"
              @search="onSearch"
              enterButton="搜索"
            />
            <a
              v-if="false"
              class="m-l-20 align-center flex"
              style="width:50px"
              @click="toggleSlide"
            >{{showAdvancedSearch?"收起":"展开"}}</a>
          </div>
        </div>
      </div>
      <collapse>
        <div class="search-heigh" v-show="showAdvancedSearch"></div>
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
              :loading="loading"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
              :pagination="false"
              :scroll="{ y: table.height }"
              rowKey="id"
              size="middle"
            >
              <template slot="action" slot-scope="text,record,index">
                <span class="pointer" @click="editHandle(record)">
                  <icon-font type="spm-icon-shangyicopy4"/>
                </span>
                <!-- <span class="m-l-10 pointer" v-show="isCheck && index" @click="moveHandle(record.id,1)">
            <a-icon type="arrow-up" />
          </span>
          <span
            class="m-l-10 pointer"
            v-show="isCheck && ((!record.pid || record.pid == null || record.pid == '0') ? (table.data.length - 1 > index) :  (Util.getDataByProps(table.data,'id',record.pid).children.length - 1 > index))"
            @click="moveHandle(record.id,2)"
          >
            <a-icon type="arrow-down" />
                </span>-->
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
    <!-- 岗位分类 弹层 -->
    <a-modal
      class="postTypeModal"
      :title="modal.title"
      v-model="modal.is_show"
      okText="确认"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-skeleton active :loading="loading" :paragraph="{rows: 4}">
        <a-form :form="modal.form">
          <a-form-item
            v-show="modal.is_typeNum"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            label="岗位字典编码"
          >
            <a-input
              v-decorator="['num',{initialValue: this.modal.typeNum,rules: [{ required: true }]}]"
              disabled
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="岗位字典名称">
            <a-input
              v-decorator="['name',{rules: [{ required: true, message: '请输入岗位字典名称' }]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 6}" :wrapper-col="{ span: 18 }" label="岗位字典分类">
            <!-- <a-row>
              <a-col :span="20">
                <a-input
                  v-decorator="['type',{rules: [{ required: true, message: '请选择岗位字典分类' }]}]"
                  placeholder="请选择"
                  disabled
                />
              </a-col>
              <a-col :span="4">
                <a-button class="m-l-10 lastType" v-waves @click="lastTypeClick" size="small">选择</a-button>
              </a-col>
            </a-row> -->
            <a-input-search
              v-decorator="['type']"
              placeholder="请选择岗位字典分类"
              read-only
              @search="lastTypeClick"
            >
              <a-button slot="enterButton">
                <span>选择</span>
              </a-button>
            </a-input-search>
          </a-form-item>
          <a-form-item
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            label="岗位序列"
            has-feedback
          >
            <a-select
              v-decorator="['order',{rules: [{ required: true, message: '请选择岗位序列' }]}]"
              placeholder="请选择"
            >
              <a-select-option
                v-for="( postSequence, index ) in postSequences"
                :value="postSequence.dictionaryCode"
                :key="index + 'dept'"
              >{{ postSequence.dictionaryName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" label="岗位字典描述">
            <a-textarea
              v-decorator="['desc']"
              placeholder="请输入岗位字典描述"
              :autosize="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-item>
        </a-form>
      </a-skeleton>
    </a-modal>
    <!-- 岗位字典分类 组件 -->
    <PostTreeModal ref="postTree" :data="[]" @postTreeChange="postTreeChange"></PostTreeModal>
  </div>
</template>

<script>
  import Pagination from "@/Pagination";
  import PostTreeModal from "./PostTreeModal";
  import debounce from "lodash.debounce";
  import collapse from "#/assets/js/collapse.js"; //伸缩组件
  import {mapState} from "vuex";

  export default {
    name: "PostDictR",
    components: {
      Pagination,
      PostTreeModal,
      collapse
    },
    props: {
      record: Object
    },
    data() {
      return {
        Util,
        api: {
          list: Util.orgServer + "/web/post-classify-dict/page-list", // 获取 岗位字典分页列表
          add: Util.orgServer + "/web/post-classify-dict/add", // 新增岗位字典
          editDetail: Util.orgServer + "/web/post-classify-dict/detail", // 获取 编辑详情
          edit: Util.orgServer + "/web/post-classify-dict/edit", // 编辑岗位字典
          delete: Util.orgServer + "/web/post-classify-dict/delete", // 删除
          order: Util.orgServer + "/web/post-classify-dict/order" // 上下移
        },
        showAdvancedSearch: false,
        loading: true,
        is_check: false,
        search: "",
        table: {
          height: 200,
          columns: [
            {
              title: "岗位字典编码",
              dataIndex: "dictNum",
              width: 180
            },
            {
              title: "岗位字典名称",
              dataIndex: "dictName",
              width: 180
            },
            {
              title: "岗位字典描述",
              dataIndex: "desc",
              width: 180
            },
            {
              title: "岗位序列",
              dataIndex: "sequenceName",
              width: 180
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
          title: "",
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
        postSequences: state => state.dicts.JOB_SEQUENCE
      }),
      hasSelected() {
        return this.table.selectedRowKeys.length > 0;
      },
      isCheck() {
        return this.record.id && this.record.id != "";
      }
    },
    created() {
      this.changeTableHeight();
      window.onresize = () => {
        this.changeTableHeight();
      };
    },
    mounted() {
      this.getData(this.record.id);
    },
    watch: {
      record: {
        handler(val, oldVal) {
          this.modal.typeData.id = val.id;
          this.search = "";
          this.getData(val.id);
        },
        deep: true
      }
    },
    methods: {
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
      // 获取 岗位字典 table
      getData(classifyId) {
        let params =
          "?current=" +
          this.pagination.pageNo +
          "&size=" +
          this.pagination.pageSize +
          "&classifyId=" +
          classifyId +
          "&name=" +
          this.search;
        this.$get(this.api.list + params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              this.pagination.pageNo = res.data.current;
              this.pagination.totalCount = parseInt(res.data.total);
              this.table.data = res.data.records ? res.data.records : [];
              if (res.data.records) {
                res.data.records.forEach(v => {
                  switch (v.sequenceId) {
                    case "1":
                      v.sequenceName = "建造类";
                      break;
                    case "2":
                      v.sequenceName = "技术类";
                      break;
                    case "3":
                      v.sequenceName = "商务类";
                      break;
                    case "4":
                      v.sequenceName = "财务类";
                      break;
                    case "5":
                      v.sequenceName = "物资类";
                      break;
                  }
                });
                this.table.data = res.data.records;
              } else {
                this.table.data = [];
              }
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
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
        this.$get(this.api.editDetail + "?id=" + id)
          .then(response => {
            this.loading = false;
            Util.processRes(response, res => {
              // console.log(response);
              this.initFormValue(
                response.data.dictNum,
                response.data.dictName,
                response.data.classifyName,
                response.data.sequenceId,
                response.data.desc
              );
              this.modal.is_show = true;
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
        const params = {
          ids: this.table.selectedRowKeys
        };
        // console.log(params);
        this.$post(this.api.delete, params)
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
      onSearch: debounce(function (val) {
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
      // 新增岗位分类 事件
      addPostTypeClick() {
        this.modal.title = "新增岗位字典";
        this.modal.is_typeNum = false;
        this.initFormValue(1);
        this.modal.is_show = true;
      },
      // 编辑
      editHandle(e) {
        // console.log(e);
        this.modal.typeData.id = e.classifyId;
        this.modal.title = "编辑岗位字典";
        this.modal.is_typeNum = true;
        this.getEditData(e.id);
      },
      // 上级分类 选择
      lastTypeClick() {
        this.$refs.postTree.init();
      },
      // 岗位字典 树选择回调
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
            dictName: values.name,
            classifyId: this.modal.typeData.id,
            sequenceId: values.order,
            desc: values.desc
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
      initFormValue(num = null,
                    name = undefined,
                    type = this.record.name,
                    order = undefined,
                    desc = undefined) {
        setTimeout(() => {
          this.modal.form.setFieldsValue({
            num,
            name,
            type,
            order,
            desc
          });
        }, 0);
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .postTypeModal {
    .ant-form-item-label {
      margin: 10px 0 0;
    }
  }
</style>
