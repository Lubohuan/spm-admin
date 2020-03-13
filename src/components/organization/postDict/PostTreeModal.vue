/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-21 09:57:15
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-04 14:13:13
 * @Description: 岗位字典分类 树组件
 */

<template>
  <div id="postTreeModal">
    <a-modal
      class="postTree"
      title="岗位字典分类"
      v-model="is_show"
      okText="确认"
      cancelText="取消"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="postTreeWarp">
        <div class="search">
          <a-input-search placeholder="请输入搜索关键字" v-model="search" @change="onSearch" />
        </div>
        <a-skeleton active :loading="loading" :paragraph="{rows:13}">
          <div style="height:460px">
            <a-table
              class="p-t-20"
              :locale="{emptyText: '暂无数据'}"
              :rowKey="record => record.id"
              :columns="table.columns"
              :dataSource="table.searchData"
              :scroll="{ y: 400 }"
              :pagination="false"
              :customRow="rowClick"
              :rowClassName="rowClassName"
              size="middle"
              :expandedRowKeys="expandedRowKeys"
              @expand="expand"
            ></a-table>
          </div>
        </a-skeleton>
      </div>
    </a-modal>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
export default {
  name: "postTreeModal",
  components: {},
  props: {
    data: Array
  },
  data() {
    return {
      Util,
      api: {
        list: Util.orgServer + "/web/post-classify/list" // 获取 岗位分类树结构
      },
      expandedRowKeys: [],
      loading: true,
      is_show: false,
      search: "",
      rowData: {
        id: null,
        pid: null,
        name: null,
        level: null
      },
      table: {
        height: null,
        columns: [
          {
            title: "岗位分类编码",
            dataIndex: "num",
            width: 180
          },
          {
            title: "岗位字典分类",
            dataIndex: "title",
            width: 120
          }
        ],
        data: [],
        searchData: []
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    data: {
      handler(val, oldVal) {
        this.table.data = val;
        this.table.searchData = this.table.data;
      },
      deep: true
    }
  },
  methods: {
    // init
    init() {
      this.search = "";
      this.table.rowId = "";
      this.is_show = true;
      this.getData();
    },
    // 获取 岗位分类树结构
    getData() {
      this.$get(this.api.list)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.table.data = res.data ? Util.dealData(res.data) : [];
            this.table.searchData = this.table.data;
            this.$nextTick(() => {
              this.expandedRowKeys = Util.getIds(this.table.data);
            });
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
    // 打开岗位字典
    openModal(e) {
      if (e) {
        this.init();
        this.is_show = true;
      }
    },
    // 行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.rowData = {
              id: record.id,
              pid: record.pid,
              name: record.name,
              level: record.level
            };
          }
        }
      };
    },
    // 新增 行 class
    rowClassName(record, index) {
      let className = "";
      if (record.id === this.rowData.id) {
        className = "rowActive";
        this.is_check = true;
      }
      return className;
    },
    // modal 确认
    handleOk(e) {
      this.$emit("postTreeChange", this.rowData);
      this.is_show = false;
    },
    // modal 取消
    handleCancel(e) {
      this.is_show = false;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.postTree {
  .postTreeWarp {
    .rowActive {
      background-color: #cfe8fc;
    }
  }
}
</style>
