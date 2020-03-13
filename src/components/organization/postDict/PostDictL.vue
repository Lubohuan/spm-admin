/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-19 11:18:49
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-19 18:22:47
 * @Description: 岗位字典---左模块组件
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <a-input-search placeholder="请输入岗位字典分类" v-model="search" @change="onSearch" />
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-config m-b-20">
          <a-button type="primary" v-waves @click="addPostTypeClick">新增岗位分类</a-button>
          <a-button class="m-l-10" :disabled="!is_check" v-waves @click="editPostTypeClick">编 辑</a-button>
          <a-button class="m-l-10" :disabled="!is_check" v-waves @click="deletePostTypeClick">删 除</a-button>
        </div>
        <div class="table-table">
          <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              :rowKey="record => record.id"
              :dataSource="table.searchData"
              :scroll="{ y: table.height }"
              :pagination="false"
              :loading="loading"
              :customRow="rowClick"
              :rowClassName="rowClassName"
              :expandedRowKeys="expandedRowKeys"
              @expand="expand"
              size="middle"
            >
              <template slot="action" slot-scope="text,record,index">
                <span class="pointer m-r-20" v-show="index" @click.stop="moveHandle(record.id,1)">
                  <a-icon type="arrow-up" />
                </span>
                <span
                  class="pointer"
                  v-show="(!record.pid || record.pid == null || record.pid == '0') ? (table.data.length - 1 > index) :  (Util.getDataByProps(table.data,'id',record.pid).children.length - 1 > index)"
                  @click.stop="moveHandle(record.id,2)"
                >
                  <a-icon type="arrow-down" />
                </span>
              </template>
            </a-table>
          </a-skeleton>
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
            :label-col="{ span: 5 }"
            :wrapper-col="{ span: 18 }"
            label="分类编码"
          >
            <a-input
              v-decorator="['typeNum',{initialValue: this.modal.typeNum,rules: [{ required: true }]}]"
              disabled
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }" label="分类名称">
            <a-input
              v-decorator="['typeName',{rules: [{ required: true, message: '请输入分类名称' }]}]"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item :label-col="{ span: 5}" :wrapper-col="{ span: 18 }" label="上级分类">
            <!-- <a-row>
              <a-col :span="20">
                <a-input v-decorator="['lastTypeName']" placeholder="请选择" readonly />
              </a-col>
              <a-col :span="4">
                <a-button
                  class="m-l-10 lastType"
                  v-waves
                  v-show="!modal.is_typeNum"
                  @click="lastTypeClick"
                  size="small"
                >选择</a-button>
              </a-col>
            </a-row>-->
            <a-input-search
              v-decorator="['lastTypeName']"
              placeholder="请选择"
              read-only
              :disabled="modal.is_typeNum"
              @search="lastTypeClick"
            >
              <a-button slot="enterButton" :disabled="modal.is_typeNum">
                <span>选择</span>
              </a-button>
            </a-input-search>
          </a-form-item>
        </a-form>
      </a-skeleton>
    </a-modal>
    <!-- 岗位字典分类 组件 -->
    <PostTreeModal ref="postTree" :data="table.data" @postTreeChange="postTreeChange"></PostTreeModal>
  </div>
</template>

<script>
import PostTreeModal from "./PostTreeModal";
import debounce from "lodash.debounce";
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
        list: Util.orgServer + "/web/post-classify/list", // 获取 岗位分类树结构
        add: Util.orgServer + "/web/post-classify/add", // 新增岗位分类
        editDetail: Util.orgServer + "/web/post-classify/detail", // 获取 编辑详情
        edit: Util.orgServer + "/web/post-classify/edit", // 编辑 提交
        delete: Util.orgServer + "/web/post-classify/delete", // 删除
        order: Util.orgServer + "/web/post-classify/order" // 上下移
      },
      expandedRowKeys: [],
      loading: true,
      is_check: false,
      search: "",
      table: {
        height: 200,
        record: {},
        columns: [
          {
            title: "岗位分类编码",
            dataIndex: "num"
          },
          {
            title: "岗位字典分类",
            dataIndex: "title",
            width: 200
          }
          // {
          //   title: "操作",
          //   dataIndex: "operation",
          //   width: 100,
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
  computed: {},
  created() {},
  mounted() {
    this.table.height = document.body.clientHeight - 385;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 385;
    };
    this.getData();
  },
  watch: {},
  methods: {
    // 获取 岗位分类树结构
    getData() {
      this.$get(this.api.list)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(res);
            this.table.data = res.data ? Util.dealData(res.data) : [];
            this.expandedRowKeys = Util.getIds(this.table.data);
            this.table.searchData = this.table.data;
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    expand(e, item) {
      e = !e;
      if (e) {
        this.expandedRowKeys.splice(
          this.expandedRowKeys.findIndex(i => i == item.id),
          1
        );
      } else {
        this.expandedRowKeys.push(item.id);
      }
    },
    // 提交 新增岗位分类
    postAddData(params) {
      this.$post(this.api.add, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
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
    getEditData(id) {
      this.$get(this.api.editDetail + "?id=" + id)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.initFormValue(
              res.data.classifyNum,
              res.data.classifyName,
              res.data.parentName
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
    deleteHandle(params) {
      this.$post(this.api.delete, params)
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
    onSearch: debounce(function(val) {
      this.searchValue = val.target.value;
      this.handleSearch(val.target.value);
    }, 1000),
    handleSearch(val) {
      this.table.searchData = val
        ? Util.treeSearch(val, "name", this.table.data)
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
      if (this.table.record.children) {
        this.$message.warning("该层级有下级分类，不可删除！");
        return;
      }
      this.deleteHandle(this.table.record.id);
    },
    // -----------------------------modal 事件 Start -----------------------------------
    // 新增岗位分类 事件
    addPostTypeClick() {
      this.modal.title = "新增岗位分类";
      this.modal.is_typeNum = false;
      this.initFormValue(1);
      this.modal.is_show = true;
    },
    // 编辑岗位分类 事件
    editPostTypeClick() {
      this.modal.title = "编辑岗位分类";
      this.modal.is_typeNum = true;
      this.getEditData(this.table.record.id);
    },
    // 上级分类 选择
    lastTypeClick() {
      this.$refs.postTree.init();
    },
    // 岗位字典 树选择回调
    postTreeChange(RowData) {
      this.modal.form.setFieldsValue({
        lastTypeName: RowData.name
      });
      this.modal.lastTypeData = RowData;
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
            classifyName: values.typeName,
            pid: !this.modal.lastTypeData.id ? 0 : this.modal.lastTypeData.id,
            level: !this.modal.lastTypeData.level
              ? 1
              : this.modal.lastTypeData.level + 1
          };
          // console.log(params);
          this.postAddData(params);
        } else {
          // 编辑
          const params = {
            id: this.table.record.id,
            classifyName: values.typeName
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
  destroyed() {}
};
</script>

<style lang="scss">
</style>
