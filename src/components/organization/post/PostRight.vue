/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-26 16:17:11
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-05 18:02:57
 * @Description: 岗位管理-右模块
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" v-waves :disabled="!isCheck" @click="addClick">新增岗位</a-button>
            <a-button
              class="m-l-10 m-r-10"
              v-waves
              @click="deleteClick"
              :disabled="!hasSelected"
            >删 除</a-button>
          </div>
          <div class="table-search flex">
            <a-input-search
              placeholder="请输入岗位名称"
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
        <div class="search-heigh" v-show="showAdvancedSearch">
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
              :scroll="{ y: table.height }"
              rowKey="id"
              size="middle"
            ></a-table>
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
    <post-modal
      v-show="modal.Visible"
      :isVisible="modal.Visible"
      @closed="modal.Visible = false"
      @change="setPostValue"
    ></post-modal>
  </div>
</template>

<script>
import Title from "@/Title";
import Pagination from "@/Pagination";
import PostModal from "./PostModal";
import debounce from "lodash.debounce";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
export default {
  name: "PostR",
  components: {
    Title,
    Pagination,
    collapse,
    "post-modal": PostModal
  },
  props: {
    deptId: String
  },
  data() {
    return {
      Util,
      api: {
        pageList: Util.orgServer + "/web/post-info/page-list", // 获取 岗位管理分业列表
        delete: Util.orgServer + "/web/post-info/delete", // 删除
        add: Util.orgServer + "/web/post-info/add" // 新增岗位
      },
      showAdvancedSearch: false,
      loading: true,
      search: "",
      modal: {
        Visible: false,
        data: []
      },
      table: {
        height: 200,
        loading: false,
        columns: [
          {
            title: "岗位字典编码",
            dataIndex: "dictNum",
            width: 200
          },
          {
            title: "岗位名称",
            dataIndex: "dictName",
            width: 200
          }
        ],
        data: [],
        selectedRowKeys: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  computed: {
    /*
     * @param true/false --- 新增岗位按钮是否停用
     */
    isCheck() {
      return this.deptId && this.deptId != "";
    },
    /*
     * @param true/false --- 删除按钮是否停用
     */
    hasSelected() {
      return this.table.selectedRowKeys.length > 0;
    }
  },
  created() {
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  mounted() {
    !this.deptId && (this.table.loading = false);
  },
  watch: {
    /*
     * @description: 监听 部门id 不为空时 获取 岗位列表
     */
    deptId: {
      handler(val, oldVal) {
        this.search = "";
        val && this.getData();
      },
      deep: true
    }
  },
  methods: {
    // 获取 岗位管理分业列表
    // this.deptId +
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
    getData() {
      this.table.loading = true;
      const params =
        "?current=" +
        this.pagination.pageNo +
        "&size=" +
        this.pagination.pageSize +
        "&deptId=" +
        this.deptId +
        "&name=" +
        this.search;
      this.$get(this.api.pageList + params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
            // console.log(res);
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
    // 新增岗位
    addClick() {
      this.modal.Visible = true;
    },
    // 删除岗位
    deleteClick() {
      const params = {
        ids: this.table.selectedRowKeys
      };
      this.$post(this.api.delete, params)
        .then(response => {
          Util.processRes(response, res => {
            // console.log(response);
            this.getData();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          Util.processError(this, res);
        });
    },
    // 搜索
    onSearch: debounce(function(val) {
      this.getData();
    }, 0),
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.table.selectedRowKeys = selectedRowKeys;
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      this.getData();
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageSize = pageSize;
      this.getData();
    },
    // 新增 岗位选择 回调
    setPostValue(val) {
      if (val.length) {
        const dictIds = [];
        val.forEach(v => {
          dictIds.push(v.id);
        });
        const params = {
          deptId: this.deptId,
          dictIds: dictIds,
          orgId: this.$store.state.curr_org.id
        };
        // return
        this.$post(this.api.add, params)
          .then(response => {
            Util.processRes(response, res => {
              console.log(response);
              this.getData();
              this.modal.Visible = false;
            });
            Util.processError(this, response);
          })
          .catch(res => {
            Util.processError(this, res);
          });
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
