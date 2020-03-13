/*
 * @Autor: 一个
 * @Version: 1.0
 * @Date: 2019-08-19 11:18:30
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-08-31 10:12:52
 * @Description: 预警任务设置---右模块组件
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" :disabled="!currentId" v-waves @click="addTask">新增</a-button>
          </div>
          <div class="table-search flex">
            <a-input-search
              class="search"
              placeholder="请输入预警任务名称"
              v-model="searchParam.search"
              @search="onSearch"
              @change="deb"
              enterButton="搜索"
            />
          </div>
        </div>
      </div>
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
              rowKey="id"
              size="middle"
            >
              <template slot="action" slot-scope="text, record">
                <div class="flex">
                  <span class="icon-btn" @click="editTask(record)" title="编辑">
                    <icon-font type="spm-icon-shangyicopy4" />
                  </span>
                  <span title="删除" class="icon-btn" @click.stop="delTask(record)">
                    <icon-font type="spm-icon-delete" />
                  </span>
                  <span class="icon-btn" @click="skipLogsPage(record)" title="查看日志">
                    <icon-font type="spm-icon-chakanrizhi" />
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
    <!--  -->
    <ModalConfigWarningTask
      ref="ModalConfigWarningTask"
      @searchList="getData"
      :classifyId="currentId"
    />
  </div>
</template>

<script>
import Pagination from "@/Pagination";
import debounce from "lodash.debounce";
import ModalConfigWarningTask from "@/warningCenter/warningSettings/ModalConfigWarningTask";
import { mapState } from "vuex";
import AppClassify from "@/integration/appIntegrate/AppClassify";
export default {
  name: "PostDictR",
  components: {
    Pagination,
    ModalConfigWarningTask
  },
  props: {
    currentId: String
  },
  data() {
    return {
      Util,
      api: {
        getListApi: Util.systemServer + "/web/alarm-task/page", // 获取预警任务列表
        delApi: Util.systemServer + "/web/alarm-task/delete" // 删除预警任务
      },
      showAdvancedSearch: false,
      loading: true,
      is_check: false,
      searchParam: {
        search: ""
      },
      table: {
        loading: false,
        height: null,
        columns: [
          {
            title: "预警任务编码",
            dataIndex: "code",
            width: 250
          },
          {
            title: "预警任务名称",
            dataIndex: "name",
            width: 180
          },
          {
            title: "成功次数",
            dataIndex: "suCount",
            width: 100
          },
          {
            title: "失败次数",
            dataIndex: "faCount",
            width: 100
          },
          {
            title: "距离下次执行时间",
            dataIndex: "exTime",
            width: 180
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 100,
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
  computed: {},
  created() {},
  mounted() {
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
    //this.getData(this.record.id);
  },
  watch: {
    currentId: {
      handler(val, oldVal) {
        if (val) {
          this.getData(true);
        }
      }
    }
  },
  methods: {
    deb: debounce(
      function() {
        // 搜索方法
        this.getData();
      },
      1000 // 延迟时间
    ),
    // 搜索
    onSearch: debounce(function(val) {
      this.getData();
    }, 0),
    formError(field) {
      const { getFieldError, isFieldTouched } = this.modal.form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
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
    getData() {
      this.table.loading = true;
      let params = {
        current: this.pagination.pageNo,
        size: this.pagination.pageSize,
        name: this.searchParam.search,
        classifyId: this.currentId
      };
      // console.log(params);
      this.$post(this.api.getListApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
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
    //查看日志
    skipLogsPage(rowData) {
      this.$router.push({
        name: "WarningLogs",
        query: {
          id: rowData.id
        }
      });
    },
    // 新增
    addTask() {
      this.$refs["ModalConfigWarningTask"].handleOpen("add");
    },
    // 编辑
    editTask(record) {
      this.$refs["ModalConfigWarningTask"].handleOpen("edit", record);
    },
    // 删除
    delTask(record) {
      this.$confirm({
        title: "删除",
        content: "确定要删除当前任务吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          const params = {
            id: record.id
          };
          this.$post(this.api.delApi, params)
            .then(response => {
              Util.processRes(response, res => {
                this.$message.success("删除成功！");
                this.getData();
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

    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.table.selectedRowKeys = selectedRowKeys;
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      this.getData();
      // 重新请求数据
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      this.getData();
      // 重新请求数据
    }
  },
  destroyed() {
    window.onresize = null;
  }
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
