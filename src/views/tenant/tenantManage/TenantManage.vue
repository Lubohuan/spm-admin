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
  <div id="TenantManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-button type="primary" v-waves @click="showAddModal">新增租户</a-button>
              </div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入租户名称/租户编码"
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
                    <a-form-item label="注册日期">
                      <a-range-picker
                        :placeholder="['开始日期', '结束日期']"
                        format="YYYY-MM-DD"
                        v-model="searchParam.date"
                        @change="deb"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="租户状态">
                      <a-select placeholder="请选择租户状态" v-model="searchParam.status" @change="deb">
                        <!-- -1.未激活 2.已停用 3.已激活（与密钥状态关联） -->
                        <a-select-option value>全部</a-select-option>
                        <a-select-option value="1">未激活</a-select-option>
                        <a-select-option value="3">已激活</a-select-option>
                        <a-select-option value="2">已停用</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="公司性质">
                      <a-select placeholder="请选择公司性质" v-model="searchParam.nature" @change="deb">
                        <a-select-option value>全部</a-select-option>
                        <a-select-option
                          v-for="( companyType, index ) in companyTypes"
                          :value="companyType.dictionaryCode"
                          :key="index + 'companyType'"
                        >
                          {{
                          companyType.dictionaryName }}
                        </a-select-option>
                      </a-select>
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
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <span
                        class="icon-btn"
                        :class="record.status=='2'?'disabled':''"
                        @click="record.status=='2'?'':showDetailModal(record)"
                        title="查看"
                      >
                        <icon-font type="spm-icon-shangyicopy5" />
                      </span>
                      <span
                        class="icon-btn"
                        :class="record.status=='2'?'disabled':''"
                        @click="record.status=='2'?'':showEditModal(record)"
                        title="编辑"
                      >
                        <icon-font type="spm-icon-shangyicopy4" />
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
    <!-- 新增租户模态框 -->
    <ModalAddTenant ref="ModalAddTenant" @searchList="searchList" />
    <!-- 编辑租户基本信息 -->
    <ModalEditTenant ref="ModalEditTenant" @searchList="searchList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalAddTenant from "@/tenant/tenantManage/ModalAddTenant";
import ModalEditTenant from "@/tenant/tenantManage/ModalEditTenant";

export default {
  name: "TenantManage",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalAddTenant, //新增租户弹出框
    ModalEditTenant //编辑租户弹出框
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
      table: {
        loading: false,
        height: null,
        columns: [],
        data: [],
        plainOptions: [
          { label: "租户编码", value: 0 },
          { label: "公司名称", value: 1 },
          { label: "公司性质", value: 2 },
          { label: "租户注册时间", value: 3 },
          { label: "租户状态", value: 4 },
          { label: "有效期", value: 5 }
        ],
        operValue: [0, 1, 2, 3, 4, 5],
        initColumns: {
          0: {
            title: "租户编码",
            dataIndex: "tenantCode",
            width: 250,
            scopedSlots: { customRender: "tenantCode" }
          },
          1: {
            title: "公司名称",
            className: "column-name",
            width: 250,
            dataIndex: "name"
          },
          2: {
            title: "公司性质",
            className: "column-nature",
            width: 150,
            dataIndex: "nature",
            scopedSlots: { customRender: "nature" }
          },
          3: {
            title: "租户注册时间",
            className: "column-createTime",
            width: 250,
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" }
          },
          4: {
            title: "租户状态",
            className: "column-status",
            width: 150,
            dataIndex: "status",
            scopedSlots: { customRender: "status" }
          },
          5: {
            title: "有效期",
            className: "column-startTime",
            width: 250,
            dataIndex: "startTime",
            scopedSlots: { customRender: "startTime" }
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
  computed: {
    ...mapState({
      companyTypes: state => state.dicts.COMPANY_NATURE
    })
  },
  created() {
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
        startTime:
          this.searchParam.date && this.searchParam.date.length > 0
            ? this.moment(this.searchParam.date[0]).format("X") * 1000
            : "",
        endTime:
          this.searchParam.date && this.searchParam.date.length > 0
            ? this.moment(this.searchParam.date[1]).format("X") * 1000
            : "",
        nature: this.searchParam.nature ? this.searchParam.nature : "",
        status: this.searchParam.status ? this.searchParam.status : "",
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
    showAddModal() {
      this.$refs["ModalAddTenant"].handleOpen("add");
    },

    //编辑租户进本信息
    showEditModal(rowData) {
      this.$refs["ModalEditTenant"].handleOpen(rowData);
    },
    /**
     * 点击查看
     */
    showDetailModal(rowData) {
      this.$refs["ModalAddTenant"].handleOpen("detail", rowData);
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
