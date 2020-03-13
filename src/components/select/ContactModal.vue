
/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  参建单位
</comment>
<template>
  <div id="ContactModal">
    <a-modal centered title="选择参建单位" :width="800" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="orgTree"
        type="table"
        v-model="checks"
        :multiple="multiple"
        :tableData="tableData"
        fullProps
        :columns="columns"
        @search-change="tableSearch"
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
    name: "ContactModal",
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
          getTableDataApi: Util.domain + Util.portForOrg + "/web/subcontractor/list" // 获取参建单位
        },
        visible: false,
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
            title: '参建单位编码',
            dataIndex: 'num',
            width: '20%'
          }, {
            title: '参建单位名称',
            dataIndex: 'name',
            width: '35%'

          }, {
            title: '社会统一信用代码',
            dataIndex: 'certificate',
            width: '35%'
          },],
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
      this.getTableData()
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
      getTableData() {
        this.$get(this.api.getTableDataApi)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              if (response.data && response.data.length) {
                this.tableData.list = Util.dealData(response.data);
              } else {
                this.tableData.list = []
              }
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
