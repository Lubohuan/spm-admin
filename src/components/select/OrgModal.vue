/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  组织选择
</comment>
<template>
  <div id="OrgModal">
    <a-modal centered title="选择组织" :width="500" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="orgTree"
        type="tree"
        :treeData="orgTree"
        showIcon
        v-model="checks"
        :multiple="multiple"
        fullProps
      ></select-tree-or-table>
      <template slot="footer">
        <a-button @click="refresh">刷 新</a-button>
        <a-button @click="clear">清 除</a-button>
        <a-button @click="closeModal">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="confirm">确 认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import SelectTreeOrTable from "@/select/SelectTreeOrTable";

export default {
  name: "OrgModal",
  components: {
    "select-tree-or-table": SelectTreeOrTable
  },
  props: {
    /**
     * org
     * orgProject
     */
    apiType: {
      type: String,
      default: "org"
    },
    selected: {
      // 选择结果
      type: Array,
      default: () => []
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    isVisible: {
      // modal状态  显示隐藏
      type: Boolean,
      default: false
    }
  },
  model: {
    // v-model
    prop: "selected",
    event: "change"
  },
  data() {
    return {
      api: {
        getOrgTreeDataApi: Util.orgServer + "/web/org/org-tree", // 获取基础组织
        getOrgProjectTreeDataApi: Util.orgServer + "/web/org/org-all-tree", // 获取组织
        getOrgParentTreeApi: Util.orgServer + "/web/org/org-parent-tree" // 获取父级组织
      },
      visible: false,
      orgTree: [], // 组织树数据
      checks: [] // 选择结果
    };
  },
  computed: {},
  created() {
    this.getTreeData();
  },
  mounted() {},
  watch: {
    isVisible: {
      handler(val) {
        this.visible = val;
        console.log(val);
      },
      immediate: true
    },
    selected: {
      handler(val) {
        this.checks = val;
        console.log(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getTreeData() {
      this.loading = true;
      let _getTreeDataApi = "";
      if (this.apiType == "org") {
        _getTreeDataApi = this.api.getOrgTreeDataApi;
      } else if (this.apiType == "orgProject") {
        _getTreeDataApi = this.api.getOrgProjectTreeDataApi;
      }
      this.$get(_getTreeDataApi)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.orgTree = response.data ? Util.dealData(response.data) : [];
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * 确认
     */
    confirm() {
      this.$emit("change", this.checks);
      this.closeModal();
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.visible = !this.visible;
      this.$emit("closed", false);
    },
    /**
     * 清除
     */
    clear() {
      this.checks = [];
      this.$emit("change", this.checks);
      this.$refs["orgTree"].clear();
    },
    /**
     * 刷新
     */
    refresh() {
      this.getTreeData();
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
