/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户应用授权
</comment>
<template>
  <div class="pannel" id="projectWBSLeft">
    <div class="pannel-title">
      <a-input-search
        placeholder="请输入施工区段名称"
        v-model="searchValue"
        @change="search"
        @search="search"
      >
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-table">
          <a-skeleton active :loading="loading" :paragraph="{rows: 15}">
            <div class="tree-box">
              <a-tree
                v-if="treeData.length>0"
                class="draggable-tree"
                :defaultExpandedKeys="expandKeys"
                :selectedKeys="selectedId"
                :treeData="treeData"
                @select="onSelect"
              />
              <div v-else class="ant-table-placeholder">暂无数据</div>
            </div>
          </a-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState} from "vuex";
  import Pagination from "@/Pagination"; //分页组件
  import debounce from "lodash.debounce";

  export default {
    name: "projectWBSLeft",
    components: {
      Pagination
    },
    props: {
      treeItemId: {
        type: String,
        default: ""
      }
    },
    model: {
      // v-model
      prop: "treeItemId",
      event: "changeId"
    },
    data() {
      return {
        Util,
        api: {
          getTreeListApi: Util.wbsServer + "/web/wbs/area/tree"
        },
        expandKeys: [],
        searchValue: "",
        selectedId: [],
        loading: false,
        treeInitData: [],
        treeData: []
      };
    },
    computed: {
      ...mapState(["curr_org"])
    },
    created() {
      this.searchList();
    },
    mounted() {
    },
    watch: {},
    methods: {
      search: debounce(function (val) {
        this.handleSearch(val.target.value);
      }, 1000),
      handleSearch(val) {
        this.treeData = val
          ? Util.treeSearch(val, "name", this.treeInitData)
          : this.treeInitData;
        this.expandKeys = Util.getIds(this.treeData);
      },
      searchList() {
        this.loading = true;
        this.$get(this.api.getTreeListApi, {projectId: this.curr_org.id})
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              this.treeInitData = response.data
                ? Util.dealDataLastDisabled(response.data)
                : [];
              this.treeData = this.treeInitData;
              this.expandKeys = Util.getIds(this.treeData);
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
            this.loading = false;
            Util.processError(this, res);
          });
      },
      /**
       * tree搜索
       */
      search: debounce(function (val) {
        this.searchValue = val.target.value;
        this.handleSearch(val.target.value);
      }, 1000),
      // 搜索
      handleSearch(val) {
        this.treeData = val
          ? Util.treeSearch(val, "name", this.treeInitData)
          : this.treeInitData;
        this.expandKeys = Util.getIds(this.treeData);
      },
      onSelect(selectedKeys, info) {
        if (!info.selected) {
          return;
        }
        this.selectedId = selectedKeys;
        if (this.selectedId.length > 0) {
          this.$emit("changeId", this.selectedId[0]);
        }
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  #projectWBSLeft {
    .tree-box {
      height: calc(100vh - 270px);
      overflow: auto;
    }
  }
</style>
