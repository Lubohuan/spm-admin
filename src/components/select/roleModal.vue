/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  角色分类
</comment>
<template>
  <div id="UserModal">
    <a-modal centered title="选择角色分类" :width="1000" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="orgTree"
        type="tree-table"
        :treeData="orgTree"
        v-model="checks"
        :multiple="multiple"
        :tableData="tableData"
        showIcon
        fullProps
        :columns="columns"
        @page-change="onPageChange"
        @tree-change="getTableData"
        @search-change="tableSearch"
        pagination
      >
      </select-tree-or-table>
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
    name: "UserModal",
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
          getTreeDataApi: Util.orgServer + "/web/org/org-dept-tree", // 获取组织部门树
          getTableDataApi: Util.orgServer + "/web/member/search" // 获取人员
        },
        visible: false,
        orgTree: [], // 组织树数据
        tableData: {
          list: [],
          pagination: {
            current: 1,
            offset: 10,
            total: 0
          },
        },
        columns: [/*{// 列表头部配置表
        title: '部门编号',
        dataIndex: 'personNo',
        width: 150
      }, */
          {
            title: '姓名',
            dataIndex: 'name',
            width: 80
          }, {
            title: '组织',
            dataIndex: 'orgName',
            width: 150

          }, {
            title: '部门',
            dataIndex: 'depName',
            width: 150

          }, {
            title: '属性',
            dataIndex: 'status',
            width: 50,
            scopedSlots: {
              customRender: 'status'
            },
          }],
        checks: [], // 选择结果
        params: {
          keyword: undefined,
          pageNo: 1,
          pageSize: 10
        }
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
        if (val[0].type == 1) {
          this.params.orgId = val[0].id
          this.params.deptId = null
        } else {
          this.params.deptId = val[0].id
          this.params.orgId = null
        }
        this.$get(this.api.getTableDataApi, this.params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data.records && response.data.records.length) {
                this.tableData.list = Util.dealData(response.data.records);
              } else {
                this.tableData.list = []
              }
              this.tableData.pagination.total = Number(response.data.total)
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      },
      onPageChange(val) {
        this.params.pageNo = val.pageNo
        this.params.pageSize = val.pageSize
        this.$get(this.api.getTableDataApi, this.params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data.records && response.data.records.length) {
                this.tableData.list = Util.dealData(response.data.records);
                console.log(this.tableData.list)
              } else {
                this.tableData.list = []
              }
              this.tableData.pagination.total = Number(response.data.total)
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.loading = false;
            Util.processError(this, res);
          });
      },
      tableSearch(val) {
        this.params.keyword = val
        this.$get(this.api.getTableDataApi, this.params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data.records && response.data.records.length) {
                this.tableData.list = Util.dealData(response.data.records);
                console.log(this.tableData.list)
              } else {
                this.tableData.list = []
              }
              this.tableData.pagination.total = Number(response.data.total)
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
