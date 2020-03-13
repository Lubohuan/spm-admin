<template>
  <div class="pannel" id="warningLedgerLeft">
    <div class="pannel-title">
      <a-input-search placeholder="请输入名称" v-model="searchValue" @change="search">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-table">
          <a-skeleton active :loading="loading" :paragraph="{rows: 15}">
            <div class="tree-box">
              <!-- defaultExpandAll -->
              <a-tree
                v-if="treeData.length>0"
                :expandedKeys.sync="expandedKeys"
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
import debounce from "lodash.debounce";
import Title from "@/Title";
export default {
  name: "warningLedgerLeft",
  components: {
    Title
  },
  props: {},
  model: {
    // v-model
    prop: "currentId",
    event: "changeId"
  },
  data() {
    return {
      Util,
      api: {
        getListApi: Util.systemServer + "/web/alarm-classify/tree" // 获取树结构
      },
      selectedOrgId: "",
      newAddId: "",
      configType: "detail",
      searchValue: "",
      selectedId: [],
      loading: false,
      form: this.$form.createForm(this),
      expandedKeys: [],
      treeData: [],
      treeInitData: []
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    pageInitLeft() {
      this.searchList();
    },
    searchList() {
      this.loading = true;
      this.$get(this.api.getListApi)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.treeInitData = response.data
              ? Util.dealData(response.data)
              : [];
            this.treeData = this.treeInitData;
            this.expandedKeys = Util.getIds(this.treeData);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
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
      this.treeData = val
        ? Util.treeSearch(val, "name", this.treeInitData)
        : this.treeInitData;
      this.expandedKeys = Util.getIds(this.treeData);
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
  destroyed() {}
};
</script>

<style lang="scss">
#ListTree {
  .ant-modal-body {
  }
  .tree-box {
    height: calc(100vh - 300px);
    overflow: auto;
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
