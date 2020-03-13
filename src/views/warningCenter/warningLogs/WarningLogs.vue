/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  预警日志
</comment>
<template>
  <div id="WarningLogs" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-button type="primary" v-waves @click="searchList(true)">刷新</a-button>
              </div>
              <div class="table-search flex align-center">
                <span>任务开始时间：</span>
                <a-range-picker @change="onChangeDate" style="width:300px" />
              </div>
            </div>
          </div>
        </div>
        <div class="pannel-content">
          <div class="table-box">
            <div class="table-table">
              <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
                <a-table
                  :locale="{emptyText: '暂无数据'}"
                  :columns="table.columns"
                  :pagination="false"
                  :dataSource="table.data"
                  size="middle"
                  :scroll="{x:1200, y: table.height }"
                  rowKey="id"
                >
                  <!-- 结束时间-->
                  <template slot="startTime" slot-scope="text, record">
                    <span>{{moment(record.startTime).format('YYYY-MM-DD HH:ss')}}</span>
                  </template>
                  <!-- 结束时间-->
                  <template slot="endTime" slot-scope="text, record">
                    <span v-if="record.endTime==0">无限期</span>
                    <span v-else>{{moment(record.endTime).format('YYYY-MM-DD HH:ss')}}</span>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <span class="icon-btn" @click="showResonModal(record)" title="查看原因">
                        <icon-font type="spm-icon-chakanyuanyin" />
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
    <!-- 查看原因 -->
    <ModalReason ref="ModalReason" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";
import Title from "@/Title";
import Pagination from "@/Pagination"; //分页组件
import ModalReason from "@/warningCenter/warningLogs/ModalReason";

export default {
  name: "WarningLogs",
  components: {
    Title, //标题
    Pagination,
    ModalReason //新增租户弹出框
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        logsListApi: Util.systemServer + "/web/alarm-log/page" // 租户列表
      },
      showAdvancedSearch: false,
      searchParam: {
        startDate: "",
        endDate: ""
      },
      skipId: "",
      table: {
        loading: false,
        height: null,
        columns: [],
        data: [],
        plainOptions: [
          { label: "预警任务编码", value: 0 },
          { label: "预警任务名称", value: 1 },
          { label: "预警任务分类", value: 2 },
          { label: "开始时间", value: 3 },
          { label: "结束时间", value: 4 },
          { label: "执行结果", value: 5 }
        ],
        operValue: [0, 1, 2, 3, 4, 5],
        /**
         * "id": "b1b81ec2f2c346b69356366addae758f", --日志id
                "classifyId": "4d280faba5a04d51bc31bc1939c25b1c", --分类id
                "classifyName": "不分类we", --分类名称
                "code": "1-YJ201911220004", --任务编码
                "taskName": "质量预警", --任务名称
                "startTime": "2019-11-22 16:48:18",--开始时间
                "endTime": "2019-11-25 15:54:44", --结束时间，0为无限期
                "exResult": "失败", --执行结果
                "reason": "target values must be absolute." --原因
         */
        initColumns: {
          0: {
            title: "预警任务编码",
            dataIndex: "code",
            width: 250,
            scopedSlots: { customRender: "code" }
          },
          1: {
            title: "预警任务名称",
            width: 250,
            dataIndex: "taskName"
          },
          2: {
            title: "预警任务分类",
            className: "column-nature",
            width: 250,
            dataIndex: "classifyName",
            scopedSlots: { customRender: "classifyName" }
          },
          3: {
            title: "开始时间",
            width: 150,
            dataIndex: "startTime",
            scopedSlots: { customRender: "startTime" }
          },
          4: {
            title: "结束时间",
            width: 150,
            dataIndex: "endTime",
            scopedSlots: { customRender: "endTime" }
          },
          5: {
            title: "执行结果",
            width: 150,
            dataIndex: "exResult",
            scopedSlots: { customRender: "exResult" }
          },
          6: {
            title: "操作",
            dataIndex: "operation",
            width: 150,
            scopedSlots: {
              filterDropdown: "filterDropdown",
              filterIcon: "operIcon",
              customRender: "action"
            },
            onFilter: (value, record) =>
              record.address.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: visible => {
              if (visible) {
                setTimeout(() => {
                  // this.searchInput.focus()
                });
              }
            }
          }
        }
      },

      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  computed: {},
  created() {
    this.skipId = this.$route.query.id;
    this.searchList(true);
  },
  mounted() {
    this.operChange(this.table.operValue);
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  watch: {},
  methods: {
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList(true);
      },
      300 // 延迟时间
    ),

    changeTableHeight() {
      if (this.showAdvancedSearch) {
        this.table.height = document.body.clientHeight - 450;
      } else {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      }
    },
    onChangeDate(date, dateString) {
      this.searchParam.startDate = dateString[0];
      this.searchParam.endDate = dateString[1];
      this.searchList(true);
    },
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        startTime: this.searchParam.startDate,
        endTime: this.searchParam.endDate,
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        taskId: this.skipId
      };

      this.$post(this.api.logsListApi, params)
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
    },
    onSelectChange() {},
    /**
     * 点击新增租户按钮
     */
    /**
     * 点击查看
     */
    showResonModal(rowData) {
      this.$refs["ModalReason"].handleOpen(rowData);
    },
    // 删除
    remove() {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk() {},
        onCancel() {}
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
