
/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  租户
</comment>
<template>
  <div id="ContactModal">
    <a-modal centered title="选择租户范围" :width="550" :visible="visible" @cancel="closeModal">
      <a-card style="height: 450px;width: 100%;">
        <a-input-search
          style="width: 100%"
          class="m-b-10"
          v-model="params.other"
          placeholder="按名称搜索"
          @change="tableSearch"
        />
        <div class="t-content">
          <div class="t-table" style="height:305px">
            <a-skeleton active :loading="tableData.loading" :paragraph="{rows: 10}">
              <a-table
                :scroll="{x: 400, y:  280 }"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onSelect:onSelect,onSelectAll:onSelectAll,  type: multiple ? 'checkbox' : 'radio'}"
                :columns="columns"
                :pagination="false"
                :dataSource="tableData.list"
                :locale="{emptyText: '暂无数据'}"
                rowKey="id"
                size="middle"
              ></a-table>
            </a-skeleton>
          </div>
          <div class="t-pagination">
            <Pagination
              :total="pagination.totalCount"
              :pageSize="pagination.pageSize"
              :current="pagination.pageNo"
              @onChange="onChangePage"
              @onShowSizeChange="onShowSizeChangePage"
            ></Pagination>
          </div>
        </div>
      </a-card>
      <a-card style="height: 100px;overflow: auto" class="m-t-20">
        <span v-for="(tag, index) in resultTags" :key="tag.id">
          <a-tooltip v-if="tag.name.length > 15" :key="tag.id" :title="tag.name">
            <a-tag
              :key="tag.id"
              :closable="index !== 0"
              :afterClose="() => clearOne(tag)"
              class="m-b-10"
            >{{`${tag.name.slice(0, 15)}...`}}</a-tag>
          </a-tooltip>
          <a-tag v-else :key="tag.id" closable @close="clearOne(tag)" class="m-b-10">{{tag.name}}</a-tag>
        </span>
      </a-card>
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
import debounce from "lodash.debounce";
import Pagination from "@/Pagination"; //分页组件
export default {
  name: "ContactModal",
  components: {
    "select-tree-or-table": SelectTreeOrTable,
    Pagination
  },
  props: {
    selected: {
      // 选择结果
      type: Array,
      default: () => []
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
        getTenantApi: Util.operationServer + "/web/tenant-info/tenant-list" // 获取租户列表
      },
      multiple: true,
      visible: false,
      tableData: {
        loading: false,
        list: [],
        pagination: {
          current: 1,
          offset: 10,
          total: 0
        }
      },
      selectedRowKeys: [],
      resultTags: [],
      allRowKeys: [],
      allTags: [],
      columns: [
        {
          title: "租户编码",
          dataIndex: "tenantCode",
          width: 200
        },
        {
          title: "租户名称",
          dataIndex: "name",
          width: 150
        }
      ],
      key: "",
      checks: [], // 选择结果
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      params: {
        other: undefined,
        current: 1,
        size: 10,
        status: "3"
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {
    isVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    }
    // selected: {
    //   handler(val) {
    //     this.resultTags = val;
    //     val.forEach(element => {
    //       this.selectedRowKeys.push(element.id);
    //     });
    //     //this.checks = val;
    //   },
    //   immediate: true,
    //   deep: true
    // }
  },
  methods: {
    initSub(reshowAxios) {
      //this.getTableData(true);
      let params = {
        other: this.params.other,
        current: this.pagination.pageNo,
        size: this.pagination.pageSize,
        status: "3"
      };
      let requestLists = [
        this.$post(this.api.getTenantApi, params),
        reshowAxios
      ];
      this.feedbackTreeData(requestLists);
      // reShowData.forEach(element => {
      //   this.selectedRowKeys.push(element.id);
      // });
      // this.resultTags = reShowData;
    },
    /**
     * 确认
     */
    confirm() {
      this.$emit("change", this.resultTags);
      this.closeModal();
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.visible = !this.visible;
      this.clear();
      this.params.other = "";
      this.pagination.pageNo = 1;
      this.pagination.pageSize = 10;
      this.resultTags = [];
      this.selectedRowKeys = [];
      this.$emit("closed", false);
    },
    /**
     * 清除
     */
    clear() {
      this.resultTags = [];
      this.selectedRowKeys = [];
    },
    /**
     * 刷新
     */
    refresh() {
      this.getTableData(true);
    },
    //回显数据
    feedbackTreeData(requestLists) {
      this.tableData.loading = true;
      this.$getAll(requestLists)
        .then(response => {
          this.tableData.loading = false;
          let source = response[0];
          let result = response[1];
          if (source.data.records && source.data.records.length) {
            this.tableData.list = source.data.records;
          } else {
            this.tableData.list = [];
          }
          this.pagination.totalCount = Number(source.data.total);
          if (result.data && result.data.length) {
            result.data.forEach(item => {
              this.resultTags.push({
                name: item.name,
                id: item.tenantId
              });
              this.selectedRowKeys.push(item.tenantId);
            });
          }
        })
        .catch(res => {
          console.log(res);
          this.tableData.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * 获取table数据
     */
    getTableData(isInit) {
      this.tableData.loading = true;
      let params = {
        other: isInit ? "" : this.params.other,
        current: isInit ? 1 : this.pagination.pageNo,
        size: this.pagination.pageSize,
        status: "3"
      };
      this.$post(this.api.getTenantApi, params)
        .then(response => {
          this.tableData.loading = false;
          Util.processRes(response, () => {
            if (response.data.records && response.data.records.length) {
              this.tableData.list = response.data.records;
            } else {
              this.tableData.list = [];
            }
            this.pagination.totalCount = Number(response.data.total);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.tableData.loading = false;
          Util.processError(this, res);
        });
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      // 重新请求数据
      this.getTableData();
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      // 重新请求数据
      this.getTableData();
    },
    onPageChange(val) {
      this.params.pageNo = val.pageNo;
      this.params.pageSize = val.pageSize;
      this.getTableData();
    },
    /** */
    onSelect(record, selected, selectedRows, nativeEvent) {
      if (selected) {
        this.pushResultTags(selectedRows);
      } else {
        this.spliceResultTags([record]);
      }
    },
    onSelectAll(selected, selectedRows, changeRows) {
      if (selected) {
        this.pushResultTags(selectedRows);
      } else {
        this.spliceResultTags(changeRows);
      }
    },
    pushResultTags(data) {
      this.resultTags = this.resultTags.concat(data);
      //选中
      //this.resultTags = [...this.resultTags, ...checkData];
      let obj = {}; //有助于增加遍历效率
      this.resultTags = this.resultTags.reduce((cur, next) => {
        obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      let newIds = [];
      this.resultTags.forEach(item => {
        newIds.push(item.id);
      });
      this.selectedRowKeys = Array.from(new Set(newIds));
    },
    spliceResultTags(data) {
      this.resultTags = [...this.resultTags].filter(x =>
        [...data].every(y => y.id !== x.id)
      );
      this.selectedRowKeys = [...this.selectedRowKeys].filter(x =>
        [...data].every(y => y.id !== x)
      );
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
    clearOne(e) {
      this.resultTags.splice(
        this.resultTags.findIndex(item => item.id == e.id),
        1
      );
      this.selectedRowKeys.splice(
        this.selectedRowKeys.findIndex(item => item == e.id),
        1
      );
    },
    tableSearch: debounce(function(val) {
      //this.params.keyword = val;
      this.getTableData();
    }, 1000)
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
