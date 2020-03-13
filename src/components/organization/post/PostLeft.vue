/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-08-26 16:17:11
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-05 13:56:27
 * @Description: 岗位管理-左模块
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <a-input-search placeholder="请输入部门名称" v-model="searchValue" @change="search" />
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
          <div class="tree-box" :style="{height:tree.height+'px',overflow:'auto'}">
            <a-tree
              v-if="treeResultData.length"
              :treeData="treeResultData"
              showIcon
              :defaultSelectedKeys="treeDefaultKeys"
              @select="treeSelect"
              :defaultExpandedKeys="treeDefaultKeys"
            >
              <template slot="custom" slot-scope="record">
                <icon-font
                  :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
                />
              </template>
            </a-tree>
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </div>
        </a-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/Title";
import debounce from "lodash.debounce";
export default {
  name: "PostL",
  components: {
    Title
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        tree: Util.orgServer + "/web/dept/tree" // 获取 组织结构
      },
       tree:{
        height:200,
      },
      loading: false,
      // 部门列表数 -- 搜索值
      searchValue: "",
      // 部门列表数 -- 默认层级
      treeDefaultKeys: [],
      // 部门列表数 -- 数据
      treeData: [],
      // tree 搜索结果
      treeResultData: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.treeInit();
    this.tree.height = document.body.clientHeight - 365 + 100;
    window.onresize = () => {
      this.tree.height = document.body.clientHeight - 365 + 100;
    };
  },
  watch: {},
  methods: {
    // 部门列表数--初始化
    treeInit() {
      this.searchValue = "";
      this.getData();
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
      this.treeResultData = val
        ? Util.treeSearch(val, 'name',this.treeData)
        : this.treeData;
    },
    // 获取--部门列表 数据
    getData() {
      this.$get(this.api.tree)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.treeData = response.data ? Util.dealData(response.data) : [];
            this.treeResultData = this.treeData;
            // this.treeDefaultKeys = [this.treeData[0].id];
            // this.$emit("treeClickHandle", this.treeData[0].id);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 部门列表数--点击
    treeSelect(selectedKeys, e) {
      // console.log(selectedKeys, e);
      this.$emit("treeClickHandle", selectedKeys[0]);
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
