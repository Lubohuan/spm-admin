/*
* @Autor: 何景春
* @Version: 1.0
* @Date: 2019-08-19 11:18:49
* @LastEditors: OBKoro1
* @LastEditTime: 2019-08-31 10:03:25
* @Description:预警任务设置---左模块组件
*/
<template>
  <div class="pannel" id="warningSettingsLeft">
    <div class="pannel-title">
      <a-input-search placeholder="请输入预警分类名称" v-model="search" @change="onSearch">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="btnBox m-b-20">
          <a-button type="primary" v-waves @click="addClassify('add')">新增</a-button>
        </div>
        <div class="table-table">
          <a-skeleton active :loading="loading" :paragraph="{rows: 15}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              rowKey="id"
              :dataSource="table.searchData"
              :scroll="{ y: table.height }"
              :pagination="false"
              :customRow="rowClick"
              :expandedRowKeys="table.expandedRowKeys"
              @expand="expand"
              :rowClassName="rowClassName"
              size="middle"
            >
              <template slot="name" slot-scope="text, record">
                <!-- <span class="table-input" v-if="record.enableEdit">
                  <a-input
                    v-model="record.name"
                    ref="$editInput"
                    @pressEnter="saveEdit(record,'enter')"
                    @blur="saveEdit(record,'blur')"
                  />
                </span>-->
                <span class="enableEditCol">{{record.name}}</span>
              </template>
              <template slot="action" slot-scope="text,record">
                <div class="flex">
                  <span
                    title="新增子级"
                    class="icon-btn"
                    v-waves="{ type : 'center' }"
                    @click.stop="addClassify('addSub',record)"
                  >
                    <icon-font type="spm-icon-hebingxingzhuang" />
                  </span>
                  <span class="icon-btn" @click.stop="addClassify('editSub',record)" title="编辑">
                    <icon-font type="spm-icon-shangyicopy4" />
                  </span>
                  <span title="删除" class="icon-btn" @click.stop="delTask(record)">
                    <icon-font type="spm-icon-delete" />
                  </span>
                </div>
              </template>
            </a-table>
          </a-skeleton>
        </div>
      </div>
    </div>
    <ModalAddWarningClassify
      ref="ModalAddWarningClassify"
      @searchList="getData"
      :tableData="table.data"
    />
  </div>
</template>
<script>
// import roleModal from "@/select/roleModal"
import ModalAddWarningClassify from "@/warningCenter/warningSettings/ModalAddWarningClassify";
import debounce from "lodash.debounce";
export default {
  name: "warningSettingsLeft",
  components: {
    ModalAddWarningClassify
  },
  model: {
    // v-model
    prop: "currentId",
    event: "changeId"
  },
  data() {
    return {
      Util,
      api: {
        getListApi: Util.systemServer + "/web/alarm-classify/tree", // 获取树结构
        delApi: Util.systemServer + "/web/alarm-classify/delete" // 删除预警分类名称
      },

      loading: false,
      is_check: false,
      search: "",
      editValue: "",
      table: {
        height: null,
        record: {},
        expandedRowKeys: [],
        columns: [
          {
            title: "预警分类",
            dataIndex: "name",
            width: 430,
            scopedSlots: {
              customRender: "name"
            }
          },
          {
            title: "操作",
            dataIndex: "action",
            width: 120,
            scopedSlots: {
              customRender: "action"
            }
          }
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
  mounted() {},
  watch: {},
  methods: {
    formError(field) {
      const { getFieldError, isFieldTouched } = this.modal.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    pageInitLeft() {
      this.$nextTick(() => {
        this.table.height = document.body.clientHeight - 365;
        window.onresize = () => {
          this.table.height = document.body.clientHeight - 365;
        };
        this.getData();
      });
    },
    // 获取 树结构
    getData(init) {
      this.$get(this.api.getListApi)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(res);

            if (response.data) {
              this.table.data = res.data ? Util.dealTreeData(res.data, 1) : [];
              this.table.searchData = this.table.data;
              //展开两个层级
              this.table.expandedRowKeys = Util.getIds(this.table.searchData);
            } else {
              this.table.data = [];
              this.table.searchData = [];
              this.table.expandedRowKeys = [];
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    expand(e, item) {
      e = !e;
      if (e) {
        this.table.expandedRowKeys.splice(
          this.table.expandedRowKeys.findIndex(i => i == item.id),
          1
        );
      } else {
        this.table.expandedRowKeys.push(item.id);
      }
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
    // 删除
    delTask(record) {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.deleteHandle(record);
        },
        onCancel() {}
      });
    },
    // 删除
    deleteHandle(record) {
      this.$post(this.api.delApi, { id: record.id })
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
    // 搜索
    onSearch: debounce(function(val) {
      this.searchValue = val.target.value;
      this.handleSearch(val.target.value);
    }, 1000),
    handleSearch(val) {
      this.table.searchData = val
        ? Util.treeSearch(val, "name", this.table.data)
        : this.table.data;
      this.table.expandedRowKeys = Util.getIds(this.table.searchData);
    },
    // 行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.table.record = record;
            this.$emit("changeId", record.id);
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

    // -----------------------------modal 事件 Start -----------------------------------
    // 新增角色分类 事件
    addClassify(isSub, rowData) {
      this.$refs["ModalAddWarningClassify"].handleOpen(isSub, rowData);
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss">
#warningSettingsLeft {
  .table-input {
    display: inline-block;
    position: relative;
    .ant-input {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 200px;
      max-width: 300px;
      margin-top: -20px;
      margin: -20px 0 0 -8px;
      //transform: translate(-50%,-50%)
    }
  }
  .enableEditCol {
    display: inline-block;
    cursor: pointer;
    min-width: 200px;
  }
}
</style>
