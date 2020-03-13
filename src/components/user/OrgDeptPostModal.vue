/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-09-05 10:20:20
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-12 17:52:06
 * @Description: 组织-部门-岗位 选择 modal
 */
/*

<template>
  <div id="PostModal">
    <a-modal centered :title="title" :width="950" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="postTree"
        type="tree-table"
        :treeData="postTree"
        v-model="checks"
        :multiple="multiple"
        fullProps
        :tableData="tableData"
        @tree-change="getTableData"
        @search-change="getSearchData"
        :columns="columns"
        pagination
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
  name: "PostModal",
  components: {
    "select-tree-or-table": SelectTreeOrTable
  },
  props: {
    selected: {
      // 选择结果
      type: Array,
      default: () => []
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: true
    },
    isVisible: {
      // modal状态  显示隐藏
      type: Boolean,
      default: false
    },
    title: String
  },
  model: {
    // v-model
    prop: "selected",
    event: "change"
  },
  data() {
    return {
      api: {
        list: Util.orgServer + "/web/org/org-dept-tree", // 获取组织部门树
        tableList: Util.orgServer + "/web/post-info/page-list" //岗位列表
      },
      visible: false,
      postTree: [], // 组织部分 树
      tableData: {
        list: [],
        pagination: {
          current: 1,
          offset: 10,
          total: 0
        }
      },
      columns: [
        {
          // 列表头部配置表
          title: "岗位字典编码",
          dataIndex: "dictNum",
          width: 150
        },
        {
          title: "岗位字典名称",
          dataIndex: "dictName",
          width: 150
        }
      ],
      treeRow: [],
      orgId: null,
      deptId: null, //部门Id
      orgType: null, // 组织类型  1 组织  2 项目  3部门
      checks: [] // 岗位Id
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getTreeData();
  },
  watch: {
    isVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    selected: {
      handler(val) {
        this.checks = val;
        // console.log(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 获取组织部门树 数据
    getTreeData() {
      this.$get(this.api.list)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            console.log(response);
            if (response.data) {
              this.postTree = response.data ? Util.dealData(response.data) : [];
              this.postTree.length && this.getTableData(this.postTree[0]);
            } else {
              this.postTree = [];
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 获取 岗位 table
    getTableData(param = "", search = "") {
      // console.log(param);
      this.treeRow = param;
      if (typeof param === "object" && param.length) {
        if (param[0].orgId && param[0].type === 100) {
          this.orgId = param[0].orgId;
          this.orgType = param[0].type;
          this.deptId = param[0].id;
          let params =
            "?current=" +
            this.tableData.pagination.current +
            "&size=" +
            this.tableData.pagination.offset +
            "&deptId=" +
            this.deptId +
            "&name=" +
            search;
          // console.log(params);
          this.$get(this.api.tableList + params)
            .then(response => {
              this.loading = false;
              Util.processRes(response, res => {
                // console.log(response);
                this.tableData.pagination.current = res.data.current;
                this.tableData.pagination.total = parseInt(res.data.total);
                this.tableData.list = response.data.records
                  ? this.dealData(response.data.records)
                  : [];
              });
              Util.processError(this, response);
            })
            .catch(res => {
              this.loading = false;
              Util.processError(this, res);
            });
        } else {
          this.orgId = null;
          this.orgType = null;
          this.deptId = null;
          this.tableData.pagination.current = 0;
          this.tableData.pagination.total = 0;
          this.tableData.list = [];
        }
      }
    },
    // 修改数据类型
    dealData(e){
      let dealData = Util.deepCopy(e);
      dealData.forEach(v => {
        v.name = v.dictName
      });
      return dealData;
    },
    // table 搜索
    getSearchData(val) {
      this.getTableData(this.treeRow, val);
    },
    /**
     * 确认
     */
    confirm() {
      if (this.orgId && this.deptId) {
        let postId = this.checks.length ? this.checks[0].id : '';
        const params = {
          orgId: this.orgId,
          deptId: this.deptId,
          postId
        };
        // console.log(params);
        this.$emit("change", params);
      }
      this.closeModal();
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.visible = !this.visible;
      this.$emit("closed", false);
      this.checks = [];
    },
    /**
     * 清除
     */
    clear() {
      this.checks = [];
    },
    /**
     * 刷新
     */
    refresh() {
      this.checks = [];
      this.getTreeData();
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
