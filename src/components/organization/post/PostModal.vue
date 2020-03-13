/*
* @Autor: 何景春
* @Version: 1.0
* @Date: 2019-08-28 10:15:54
* @LastEditors: OBKoro1
* @LastEditTime: 2019-09-05 10:52:30
* @Description: 新增岗位 组件
*/
<template>
  <div id="PostModal">
    <a-modal centered title="新增岗位" :width="950" :visible="visible" @cancel="closeModal">
      <select-tree-or-table
        ref="postTree"
        :type="tableType"
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
        <a-button style="margin-left: 10px" type="primary" :disabled="!checks.length>0" @click="confirm">确 认</a-button>
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
      tableType: {
        type: String,
        default: 'tree-table'
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
          list: Util.orgServer + "/web/post-classify/list", // 获取 岗位分类树结构
          tableList: Util.orgServer + "/web/post-classify-dict/page-list" // 获取 岗位字典分页列表
        },
        noSelect: true,
        visible: false,
        classifyId: "",
        postTree: [], // 岗位分类树数据
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
        checks: [] // 选择结果
      };
    },
    computed: {},
    created() {
    },
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
      // 获取岗位分类树 数据
      getTreeData() {
        this.$get(this.api.list)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              // console.log(response);
              if (response.data) {
                this.postTree = response.data ? Util.dealData(response.data) : [];
                this.classifyId = this.postTree.length ? this.postTree[0].id : "";
                this.getTableData();
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
      // 获取 岗位字典 table
      getTableData(param = "", search = "") {
        typeof param === "object" &&
        param.length &&
        (this.classifyId = param[0].id);
        let params =
          "?current=" +
          this.tableData.pagination.current +
          "&size=" +
          this.tableData.pagination.offset +
          "&classifyId=" +
          this.classifyId +
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
              if (response.data.records && response.data.records.length) {
                response.data.records.forEach(item => {
                  item['name'] = item.dictName
                })
                this.tableData.list = response.data.records
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
      // table 搜索
      getSearchData(val) {
        this.getTableData("", val);
      },
      /**
       * 确认
       */
      confirm() {
        this.$emit("change", this.checks);
        this.closeModal();
        this.refresh();
      },
      /**
       * 关闭弹窗
       */
      closeModal() {
        this.visible = !this.visible;
        this.$emit("closed", false);
        this.refresh();
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
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
