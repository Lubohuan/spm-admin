/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  我的预警
</comment>
<template>
  <div id="WarningOfMine" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <a-tabs @change="tabChange" type="card">
            <a-tab-pane tab="待处理" key="a"></a-tab-pane>
            <a-tab-pane tab="已处理" key="b"></a-tab-pane>
          </a-tabs>

          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-button
                  type="primary"
                  v-waves
                  @click="skipReminderPage"
                  style="margin-right:7px;"
                  :disabled="table.selectedRowKeys<1"
                >查看催办记录</a-button>
              </div>

              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入预警名称/预警信息关键字"
                  v-model="searchParam.other"
                  @change="deb"
                  @search="searchList(true)"
                >
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
                <a
                  class="m-l-20 align-center flex"
                  style="width:50px"
                  @click="toggleSlide"
                >{{showAdvancedSearch?"收起":"展开"}}</a>
              </div>
            </div>
          </div>
          <collapse>
            <div class="search-heigh" v-show="showAdvancedSearch">
              <a-form layout="vertical">
                <a-row :gutter="16">
                  <a-col :span="6">
                    <a-form-item label="预警日期">
                      <a-range-picker
                        :placeholder="['开始日期', '结束日期']"
                        format="YYYY-MM-DD"
                        v-model="searchParam.date"
                        @change="deb"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </collapse>
        </div>
        <div class="pannel-content">
          <div class="table-box">
            <div class="table-table">
              <a-skeleton active :loading="table.loading" :paragraph="{rows: 10}">
                <a-table
                  :locale="{emptyText: '暂无数据'}"
                  :columns="table.columns"
                  :pagination="false"
                  :dataSource="table.data"
                  size="middle"
                  :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
                  :scroll="{x:1200, y: table.height }"
                  rowKey="id"
                >
                  <!-- 预警名称-->
                  <!-- 有效期-->
                  <template slot="startTime" slot-scope="text, record">
                    <span v-if="record.status=='1'">--</span>
                    <span v-else-if="record.status=='2'">--</span>
                    <span v-else>
                      <p v-if="record.startTime==0">无限期</p>
                      <p v-else>
                        <span>{{record.startTime?moment(Number(record.startTime)).format("YYYY-MM-DD"):'--'}}</span>
                        ~
                        <span>{{record.endTime?moment(Number(record.endTime)).format("YYYY-MM-DD"):'--'}}</span>
                      </p>
                    </span>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <span
                        class="icon-btn"
                        @click="manualClear(record)"
                        title="手动解除"
                        v-if="tabValue=='a'"
                      >
                        <icon-font type="spm-icon-shoudongjiechu" />
                      </span>
                      <span class="icon-btn" @click="showDetailsModal(record)" title="查看">
                        <icon-font type="spm-icon-shangyicopy5" />
                      </span>
                    </div>
                  </template>
                  <!-- 表头设置 -->
                  <div
                    slot="filterDropdown"
                    slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    class="custom-filter-dropdown"
                  >
                    <a-checkbox-group
                      :options="table.plainOptions"
                      v-model="table.operValue"
                      @change="operChange"
                    />
                  </div>
                  <icon-font
                    slot="operIcon"
                    slot-scope="filtered"
                    type="spm-icon-setting"
                    :style="{ color: filtered ? '#111' : undefined }"
                    style="border-left:1px solid #ddd;"
                  />
                </a-table>
              </a-skeleton>
            </div>
            <div class="table-pagination">
              <Pagination
                :total="pagination.totalCount"
                :pageSize="pagination.pageSize"
                :current="pagination.pageNo"
                @onChange="onChangePage"
                @onShowSizeChange="onShowSizeChangePage"
              ></Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalWarningDetails ref="ModalWarningDetails" />
    <ModalClearWarning ref="ModalClearWarning" @searList="searchList" />
  </div>
</template>
<script>
import Title from "@/Title";
import debounce from "lodash.debounce";
import Pagination from "@/Pagination"; //分页组件
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import ModalWarningDetails from "@/warningCenter/common/ModalWarningDetails";
import ModalClearWarning from "@/warningCenter/warningOfMine/ModalClearWarning";
export default {
  components: {
    Title,
    Pagination,
    collapse,
    ModalWarningDetails,
    ModalClearWarning
  },
  props: {
    currentId: {
      //左侧table当前选中的角色
      type: String,
      default: ""
    },
    orgId: {
      //左侧当前选中的组织
      type: String,
      default: ""
    }
  },
  data() {
    return {
      Util,
      api: {
        processingListApi:
          Util.operationServer + "/web/tenant-info/tenant-list", // 待处理
        processedListApi: Util.operationServer + "/web/tenant-info/tenant-list" // 已处理
      },
      needAjax: true,
      tabValue: "a",
      currentDate: null,
      showAdvancedSearch: false,
      disApply: true, //授权按钮是否不能点击
      disDel: true, //删除按钮是否不能点击
      searchParam: {
        date: null
      },
      table: {
        loading: false,
        height: null,
        selectedRowKeys: [],
        columns: [],
        data: [
          {
            id: "1",
            name: "嘻嘻预警"
          }
        ],
        plainOptions: [],
        operValue: [],
        initColumns: {}
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  computed: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "WarningReminderRecord") {
        vm.needAjax = false;
      } else {
        vm.needAjax = true;
      }
      vm.needAjax ? vm.pageInit() : "";
    });
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    pageInit() {
      this.getTableOptions();
      this.$nextTick(() => {
        this.changeTableHeight();
        window.onresize = () => {
          this.changeTableHeight();
        };
      });
    },
    tabChange(key) {
      this.tabValue = key;
      this.table.selectedRowKeys = [];
      this.getTableOptions();
    },
    getTableOptions() {
      if (this.tabValue == "a") {
        this.table.plainOptions = [
          { label: "预警名称", value: 0 },
          { label: "预警信息", value: 1 },
          { label: "预警时间", value: 2 },
          { label: "催办次数", value: 3 }
        ];
        this.table.operValue = [0, 1, 2, 3];
        this.table.initColumns = {
          0: {
            title: "预警名称",
            width: 150,
            dataIndex: "name"
          },
          1: {
            title: "预警信息",
            width: 250,
            dataIndex: "message",
            scopedSlots: { customRender: "message" }
          },
          2: {
            title: "预警时间",
            width: 150,
            dataIndex: "time",
            scopedSlots: { customRender: "time" }
          },
          3: {
            title: "催办次数",
            width: 150,
            dataIndex: "number",
            scopedSlots: { customRender: "number" }
          }
        };
      } else {
        let plainOptions = [
          { label: "处理负责人", value: 4 },
          { label: "处理完成时间", value: 5 }
        ];
        this.table.plainOptions = this.table.plainOptions.concat(plainOptions);
        let operValue = [4, 5];
        this.table.operValue = this.table.operValue.concat(operValue);
        let initColumns = {
          4: {
            title: "处理负责人",
            width: 150,
            dataIndex: "person",
            scopedSlots: { customRender: "person" }
          },
          5: {
            title: "处理完成时间",
            width: 150,
            dataIndex: "completeTime",
            scopedSlots: { customRender: "completeTime" }
          }
        };
        this.table.initColumns = Object.assign(
          this.table.initColumns,
          initColumns
        );
      }
      this.$nextTick(() => {
        this.operChange(this.table.operValue);
      });
    },
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList(true);
      },
      300 // 延迟时间
    ),
    toggleSlide() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
      this.changeTableHeight();
    },
    changeTableHeight() {
      if (this.showAdvancedSearch) {
        this.table.height = document.body.clientHeight - 450;
      } else {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      }
    },
    /**列表搜索 */
    searchList(isInit) {
      this.table.loading = true;
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        startTime:
          this.searchParam.date && this.searchParam.date.length > 0
            ? this.moment(this.searchParam.date[0]).format("X") * 1000
            : "",
        endTime:
          this.searchParam.date && this.searchParam.date.length > 0
            ? this.moment(this.searchParam.date[1]).format("X") * 1000
            : "",
        size: this.pagination.pageSize,
        current: this.pagination.pageNo
      };
      let url = "";
      if (this.tabValue == "a") {
        //待处理
        url = this.api.processingListApi;
      } else {
        //已处理
        url = this.api.processedListApi;
      }
      this.$post(url, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, () => {
            this.pagination.totalCount = Number(response.data.total);
            response.data.records && response.data.records.length > 0
              ? (this.table.data = response.data.records)
              : (this.table.data = []);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    /**催办记录 */
    skipReminderPage() {
      this.$router.push({
        name: "WarningReminderRecord",
        query: {
          ids: this.table.selectedRowKeys
        }
      });
    },
    /**手动解除 */
    manualClear(record) {
      this.$refs["ModalClearWarning"].handleOpen(record);
    },
    showDetailsModal(record) {
      this.$refs["ModalWarningDetails"].handleOpen(record);
    },
    /**table check事件 */
    onSelectChange(selectedRowKeys) {
      this.table.selectedRowKeys = selectedRowKeys;
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      // 重新请求数据
      this.searchList(false);
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      // 重新请求数据
      this.searchList(false);
    },
    //配置table表头
    operChange(checkedValues) {
      let columns = [];
      let oper = {
        title: "操作",
        dataIndex: "operation",
        width: 150,
        scopedSlots: {
          filterDropdown: "filterDropdown",
          filterIcon: "operIcon",
          customRender: "action"
        }
      };
      checkedValues.length &&
        checkedValues.forEach(checked => {
          columns.push(this.table.initColumns[checked]);
        });
      columns.push(oper);
      this.table.columns = columns;
      this.searchList(true);
    },
    /**
     * 删除
     * @param id
     */
    remove(type) {}
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss">
</style>
