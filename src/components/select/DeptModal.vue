/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  部门选择
</comment>
<template>
  <div id="DeptModal">
    <a-modal centered title="选择部门" :width="1000" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="orgTree"
        type="tree-table"
        :treeData="orgTree"
        v-model="checks"
        :multiple="multiple"
        fullProps
        showIcon
        :tableData='tableData'
        @tree-change="getTableData"
        :columns="columns"
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
    name: "DeptModal",
    components: {
      "select-tree-or-table": SelectTreeOrTable
    },
    props: {
      selected: {
        // 选择结果
        type: Array,
        default: () => []
      },
      multiple: { // 是否多选
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
          getTreeDataApi: Util.orgServer + "/web/org/org-tree", // 获取组织
          getTableDataApi: Util.orgServer + "/web/dept/tree" // 获取部门
        },
        visible: false,
        orgTree: [], // 组织树数据
        tableData: {
          list: []
        },
        columns: [{// 列表头部配置表
          title: '部门编号',
          dataIndex: 'num',
          width: '40%',
        }, {
          title: '部门名称',
          dataIndex: 'name',
          width: '40%',
        }],
        checks: [] // 选择结果
      };
    },
    computed: {},
    created() {
      this.getTreeData();
    },
    mounted() {
    },
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
        this.$get(this.api.getTreeDataApi)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data && response.data.length) {
                this.orgTree = Util.dealData(response.data);
                this.getTableData(this.orgTree[0].id)
              }
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
      },
      /**
       * 获取table数据
       */
      getTableData(val) {
        this.$get(this.api.getTableDataApi, {orgId: val[0].id})
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data && response.data.length) {
                this.tableData.list = Util.dealData(response.data);
              }else{
                this.tableData.list = []
              }
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
