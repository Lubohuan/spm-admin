/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户管理
</comment>
<template>
  <div id="WarningReminderRecord" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config"></div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入催办信息/催办对象关键字"
                  v-model="searchParam.other"
                  @change="deb"
                  @search="searchList(true)"
                >
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
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
                  <!-- 公司性质-->
                  <template slot="nature" slot-scope="text, record">
                    <span v-if="record.nature==1">国有</span>
                    <span v-if="record.nature==2">合作</span>
                    <span v-if="record.nature==3">合资</span>
                  </template>
                  <!-- 注册时间-->
                  <template slot="createTime" slot-scope="text, record">
                    <span>{{record.createTime?moment(Number(record.createTime)).format("YYYY-MM-DD"):'--'}}</span>
                  </template>
                  <!-- 租户状态-->
                  <template slot="status" slot-scope="text, record">
                    <span v-if="record.status=='1'">未激活</span>
                    <span v-else-if="record.status=='2'">已停用</span>
                    <span v-else>已激活</span>
                  </template>
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
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import Title from "@/Title";
import Pagination from "@/Pagination"; //分页组件
export default {
  name: "WarningReminderRecord",
  components: {
    Title, //标题
    Pagination
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        addTenantApi: Util.operationServer + "/web/tenant-info/add", // 新增租户
        tenantListApi: Util.operationServer + "/web/tenant-info/tenant-list" // 租户列表
      },
      showAdvancedSearch: false,
      searchParam: {
        // date:null,
        // other:'',
        // status: "0",
        // nature: ""
      },
      skipIds: [],
      table: {
        loading: false,
        height: null,
        columns: [],
        data: [],
        plainOptions: [
          { label: "催办信息", value: 0 },
          { label: "催办对象", value: 1 },
          { label: "催办人", value: 2 },
          { label: "催办消息发出时间", value: 3 }
        ],
        operValue: [0, 1, 2, 3],
        initColumns: {
          0: {
            title: "催办信息",
            dataIndex: "tenantCode",
            width: 250,
            scopedSlots: { customRender: "tenantCode" }
          },
          1: {
            title: "催办对象",
            className: "column-name",
            width: 250,
            dataIndex: "name"
          },
          2: {
            title: "催办人",
            className: "column-nature",
            width: 150,
            dataIndex: "nature",
            scopedSlots: { customRender: "nature" }
          },
          3: {
            title: "催办消息发出时间",
            className: "column-createTime",
            width: 250,
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" }
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
    this.skipIds = this.$route.query.ids;
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
    /** 高级搜索条件*/
    toggleSlide() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
      this.changeTableHeight();
    },
    disabledDate(current) {
      // Can not select days before today and today
      return (
        current <
        this.moment()
          .subtract(1, "day")
          .endOf("day")
      );
    },
    changeTableHeight() {
      if (this.showAdvancedSearch) {
        this.table.height = document.body.clientHeight - 450;
      } else {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      }
    },
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      //console.log(this.searchParam)
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        other: this.searchParam.other ? this.searchParam.other : "",
        size: this.pagination.pageSize,
        current: this.pagination.pageNo
      };

      this.$post(this.api.tenantListApi, params)
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
        dataIndex: "operation",
        width: 10,
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
      //columns.push(oper);
      this.table.columns = columns;
    },
    onSelectChange() {}
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
