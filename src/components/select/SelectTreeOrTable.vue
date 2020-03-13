/**
* @Author: 李晨光
* @Date: 2019/8/23
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/23
**/
<comment>
  # 组件注释
  props:
  type 类型 String 1.tree 树结构 2.table 列表 3.tree-table 左边数结构 + 右边列表
  multiple 是否多选 Boolean
  treeData 树结构数据 Array
  columns table表头 Array
  tableData table列表数据 Object {list: [],pagination: { current: 1, offset: 10, total: 10}}
  pagination 是否含有分页器 Boolean
  v-model 选择结果 Array [1,2,3]
  fullProps 选择结果是否是全部数据
</comment>
<template>
  <div id="SelectTreeOrTable">
    <a-row :gutter="20">
      <!--tree-table-->
      <a-col v-if="type == 'tree-table'" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <a-skeleton active :loading="loading">
          <a-card style="height: 450px;">
            <a-input-search
              style="width: 100%"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="search"
            />
            <div style="height: 370px;width: 100%;overflow: auto" v-if="treeResultData.length">
              <a-tree
                v-if="treeResultData.length"
                :treeData="treeResultData"
                :defaultSelectedKeys="defaultSelected"
                :checkedKeys="checkedKeys"
                :showIcon="showIcon"
                :selectedKeys.sync="checkedKeys"
                :expandedKeys.sync="expandKeys"
                @select="treeSelected"
              >
                <template slot="custom" slot-scope="record">
                  <icon-font
                    :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
                  />
                </template>
              </a-tree>
            </div>
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </a-card>
        </a-skeleton>
      </a-col>
      <a-col v-if="type == 'tree-table'" :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
        <a-skeleton active :loading="loading">
          <a-card style="height: 450px">
            <a-input-search
              style="width: 100%;"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="tableSearch"
            />
            <a-table
              ref="table"
              :defaultExpandedRowKeys="expandedRowKeys"
              :scroll="{x: 400,y: pagination? 280 : 320}"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps,type: multiple ? 'checkbox' : 'radio'}"
              :columns="columns"
              :pagination="false"
              :dataSource="tableResultData.list"
              :locale="{emptyText: '暂无数据'}"
              rowKey="id"
              size="middle"
              :rowClassName="rowClassName"
            >
              <div slot="status" slot-scope="text">{{text ? text == 1 ? '隶属' : '注销' : '直属'}}</div>
            </a-table>
            <!--分页-->
            <div v-if="pagination" class="m-t-10 flex justify-end align-center">
              共{{ tableResultData.pagination.total }}条
              <a-pagination
                showSizeChanger
                :pageSize="tableResultData.pagination.offset"
                simple
                @change="onChangePage"
                @showSizeChange="onShowSizeChangePage"
                :total="tableResultData.pagination.total"
                :showTotal="total => `共 ${total} 条`"
                :current="tableResultData.pagination.current"
              >
                <template slot="buildOptionText" slot-scope="props">
                  <span>{{props.value}}条/页</span>
                </template>
              </a-pagination>
            </div>
          </a-card>
        </a-skeleton>
      </a-col>
      <!--tree-->
      <a-col v-if="type == 'tree'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-skeleton active :loading="loading">
          <a-card style="height: 450px;">
            <a-input-search
              style="width: 100%"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="search"
            />
            <div style="height: 370px;width: 100%;overflow: auto" v-if="treeResultData.length">
              <a-tree
                :defaultSelectedKeys="defaultSelected"
                :showIcon="showIcon"
                :multiple="type != 'tree-table' && multiple"
                :treeData="treeResultData"
                :checkedKeys="checkedKeys"
                :selectedKeys.sync="checkedKeys"
                :expandedKeys.sync="expandKeys"
                @select="treeSelected"
              >
                <template slot="custom" slot-scope="record">
                  <icon-font
                    :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
                  />
                </template>
              </a-tree>
            </div>
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </a-card>
        </a-skeleton>
      </a-col>
      <!--table-->
      <a-col v-if="type == 'table'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-skeleton active :loading="loading">
          <a-card style="height: 450px;width: 100%;">
            <a-input-search
              style="width: 100%"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="tableSearch"
            />
            <a-table
              :defaultExpandedRowKeys="expandedRowKeys"
              :scroll="{x: 400, y: pagination? 280 : 320}"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps, type: multiple ? 'checkbox' : 'radio'}"
              :columns="columns"
              :pagination="false"
              :dataSource="tableResultData.list"
              :locale="{emptyText: '暂无数据'}"
              rowKey="id"
              size="middle"
              :rowClassName="rowClassName"
            >
              <slot name="customTable"></slot>
            </a-table>
            <div v-if="pagination" class="m-t-10 flex justify-end align-center">
              共{{ tableResultData.pagination.total }}条
              <a-pagination
                showSizeChanger
                :pageSize="tableResultData.pagination.offset"
                simple
                @change="onChangePage"
                @showSizeChange="onShowSizeChangePage"
                :total="tableResultData.pagination.total"
                :showTotal="total => `共 ${total} 条`"
                :current="tableResultData.pagination.current"
              >
                <template slot="buildOptionText" slot-scope="props">
                  <span>{{props.value}}条/页</span>
                </template>
              </a-pagination>
            </div>
          </a-card>
        </a-skeleton>
      </a-col>
      <!--z-->
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="m-t-20">
        <a-card style="height: 100px;overflow: auto">
          <span v-for="(tag, index) in resultTags" :key="tag.id">
            <a-tooltip v-if="tag.name.length > 15" :key="tag.id" :title="tag.name">
              <a-tag
                :key="tag.id"
                :closable="index !== 0"
                :afterClose="() => clearOne(tag)"
                class="m-b-10"
              >{{`${tag.name.slice(0, 15)}...`}}</a-tag>
            </a-tooltip>
            <a-tag
              v-else
              :key="tag.id"
              closable
              :afterClose="() => clearOne(tag)"
              class="m-b-10"
            >{{tag.name}}</a-tag>
          </span>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import Pagination from "@/Pagination";

export default {
  name: "SelectTreeOrTable",
  components: { Pagination },
  props: {
    selected: {
      // 选择结果
      type: Array,
      default: () => []
    },
    defaultSelected: {
      // 选择结果
      type: Array,
      default: () => []
    },
    fullProps: {
      // 全结构数据
      type: Boolean,
      default: false
    },
    type: {
      // 类型
      type: String,
      default: "tree-table" // tree  table
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    showIcon: {
      // 是否显示icon
      type: Boolean,
      default: false
    },
    treeData: {
      // 树结构数据
      type: Array,
      default: () => []
    },
    columns: {
      // table 表头
      type: Array,
      default: () => []
    },
    tableData: {
      // table数据
      type: Object,
      default: () => {
        return {
          list: [],
          pagination: {
            current: 1,
            offset: 10,
            total: 0
          }
        };
      }
    },
    pagination: {
      // 分页器数据
      type: Boolean,
      default: false
    },
    treeDisabled: [],
    tableDisabled: {
      // table数据
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  model: {
    prop: "selected",
    event: "change"
  },
  data() {
    return {
      Util,
      treeResultData: [], // tree数据
      tableResultData: {
        // table数据
        list: []
      },
      checkedKeys: [], // tree已选数据
      selectedRowKeys: [], // table数据 已选数据
      expandKeys: [], // tree默认展开项
      expandedRowKeys: [], // table默认展开项
      loading: false,
      resultTags: []
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    /**
     * tree数据监听
     */
    treeData: {
      handler(val) {
        this.loading = false;
        this.treeResultData = val;
        this.expandKeys = Util.getIds(val);
        this.treeResultData &&
          this.treeResultData.length &&
          setTimeout(() => {
            if (this.type == "tree-table") {
              // this.checkedKeys =
            }
          });
      },
      immediate: true,
      deep: true
    },
    /**
     * table数据监听
     */
    tableData: {
      handler(val) {
        this.tableResultData = Util.deepCopy(val);
        this.expandedRowKeys = Util.getIds(val.list);
        // this.onSelectChange(this.defaultSelected);
      },
      immediate: true,
      deep: true
    },
    /**
     * 选择结果
     */
    selected: {
      handler(val) {
        let arr = [];
        let tags = [];
        val &&
          val.length &&
          val.forEach(item => {
            arr.push(item.id);
            tags.push(item);
          });
        if (this.type == "tree") {
          this.checkedKeys = arr;
        } else {
          this.selectedRowKeys = arr;
        }
        this.resultTags = tags;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     * tree选择结果change
     * @param val
     */
    treeSelected(val) {
      let arr = [];
      if (this.fullProps) {
        val.length &&
          val.forEach(item => {
            arr.push(Util.getDataByProps(this.treeData, "id", item));
          });
      } else {
        arr = val;
      }
      /**
       * type为tree 默认值只存在tree ，触发change 双向数据绑定结果
       * type为tree-table 触发tree-change ----- 改变table数据
       */
      if (this.type == "tree") {
        this.$emit("change", arr);
      } else {
        this.$emit("tree-change", arr);
      }
    },
    /**
     * tree搜索
     */
    search: debounce(function(val) {
      this.handleSearch(val.target.value);
    }, 1000),
    /**
     * table搜索
     */
    tableSearch: debounce(function(val) {
      this.handleTableSearch(val.target.value);
    }, 1000),
    handleSearch(val) {
      this.treeResultData = val
        ? Util.treeSearch(val, "name", this.treeData)
        : this.treeData;
      this.expandKeys = Util.getIds(this.treeResultData);
    },
    handleTableSearch(val) {
      // this.$emit('search-change', val);
      if (this.pagination) {
        this.$emit("search-change", val);
      } else {
        this.tableResultData.list = val
          ? Util.treeSearch(val, "name", this.tableData.list)
          : this.tableData.list;
        this.expandedRowKeys = Util.getIds(this.tableResultData.list);
      }
    },
    /**
     * table 选择
     * @param val
     */
    onSelectChange(val) {
      this.selectedRowKeys = val;
      let arr = [];
      if (this.fullProps) {
        val.length &&
          val.forEach(item => {
            arr.push(Util.getDataByProps(this.tableData.list, "id", item));
          });
      } else {
        arr = val;
      }
      this.$emit("change", arr);
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: this.tableDisabled.length
            ? this.tableDisabled.includes(record.id)
            : false // Column configuration not to be checked
        }
      };
    },
    /**
     * 清除选择
     */
    clear() {
      if (this.type == "tree") {
        this.checkedKeys = [];
        this.$emit("tree-change", this.checkedKeys);
      } else {
        this.selectedRowKeys = [];
        this.$emit("change", this.selectedRowKeys);
      }
    },
    /**
     * 清除选择
     */
    clearOne(e) {
      if (this.type == "tree") {
        this.checkedKeys.splice(
          this.checkedKeys.findIndex(item => item == e.id),
          1
        );
        this.$emit("change", this.checkedKeys);
      } else {
        this.selectedRowKeys.splice(
          this.selectedRowKeys.findIndex(item => item == e.id),
          1
        );
        this.onSelectChange(this.selectedRowKeys);
      }
    },
    onChangePage(pageNo, pageSize) {
      this.tableResultData.pagination.current = pageNo;
      this.$emit("page-change", { pageNo: pageNo, pageSize: pageSize });
    },
    onShowSizeChangePage(pageNo, pageSize) {
      this.tableResultData.pagination.offset = pageSize;
      this.$emit("page-change", { pageNo: pageNo, pageSize: pageSize });
    },
    rowClassName(record) {
      let className = "";
      if (this.tableDisabled.includes(record.id)) {
        className = "disabled";
      }
      return className;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.disabled {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.55);
}
.disabled:hover {
  cursor: not-allowed;
  background: transparent;
  color: rgba(0, 0, 0, 0.55);
}
</style>
