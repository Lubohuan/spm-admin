/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户超级管理员管理
</comment>
<template>
  <div id="tenantSuperAdmin" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-end">
              <div class="table-search">
                <a-input-search
                  placeholder="请输入租户编码/租户名称/超级管理员账号"
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
                  rowKey="tenantId"
                >
                  <template slot="name" slot-scope="text">
                    <a href="javascript:;">{{text}}</a>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <!-- 
                      1：未激活
                      2：已停用
                      3：已激活
                      存在accountId：2已停用 3已激活
                      不存在accountId：1未激活
                      注：列表中不展示已停用的
                    -->
                    <div v-if="record.accountId" class="flex">
                      <span
                        class="icon-btn"
                        :class="record.status==2?'disabled':''"
                        title="编辑"
                        @click="record.status==2?'':showConfigModal(record,'edit')"
                      >
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span
                        title="查看"
                        class="icon-btn"
                        :class="record.status==2?'disabled':''"
                        @click="record.status==2?'':showMessageModal(record)"
                      >
                        <icon-font type="spm-icon-shangyicopy5" />
                      </span>
                      <span
                        class="icon-btn"
                        :class="record.status==2?'disabled':''"
                        title="修改手机号"
                        @click="record.status==2?'':showConfigModal(record,'tel')"
                      >
                        <icon-font type="spm-icon-xiugaishoujihao" />
                      </span>
                    </div>
                    <div v-else class="flex">
                      <span
                        v-if="record.status==3"
                        class="icon-btn"
                        title="新增超级管理员"
                        @click="showConfigModal(record,'add')"
                      >
                        <icon-font type="spm-icon-xinzengguanliyuan" />
                      </span>
                      <span v-else class="icon-btn disabled" title="新增超级管理员">
                        <icon-font type="spm-icon-xinzengguanliyuan" />
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
    <!-- 新增/编辑管理员-->
    <ModalConfigAdmin ref="ModalConfigAdmin" @searchList="searchList" />
    <ModalMessage ref="ModalMessage" />
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalConfigAdmin from "@/tenant/tenantSuperAdmin/ModalConfigAdmin";
import ModalMessage from "@/tenant/tenantSuperAdmin/ModalMessage";

export default {
  name: "TenantManage",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalConfigAdmin, //新增/编辑租户弹出框
    ModalMessage
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        tenantAdminList:
          Util.operationServer + "/web/tenant-admin/tenant-admin-list" // 超级管理员列表
      },
      showAdvancedSearch: false,
      searchParam: {},
      table: {
        loading: false,
        height: null,
        columns: [],
        data: [],
        plainOptions: [
          { label: "租户编码", value: 0 },
          { label: "租户名称", value: 1 },
          { label: "租户超级管理员名称", value: 2 },
          { label: "租户超级管理员账号", value: 3 },
          { label: "绑定手机号", value: 4 }
        ],
        operValue: [0, 1, 2, 3, 4],
        initColumns: {
          0: {
            title: "租户编码",
            dataIndex: "tenantCode",
            width: 150,
            scopedSlots: { customRender: "tenantCode" }
          },
          1: {
            title: "租户名称",
            className: "column-name",
            width: 300,
            dataIndex: "name"
          },
          2: {
            title: "租户超级管理员名称",
            className: "column-accountName",
            width: 150,
            dataIndex: "accountName"
          },
          3: {
            title: "租户超级管理员账号",
            className: "column-accountId",
            width: 150,
            dataIndex: "accountId"
          },
          4: {
            title: "绑定手机号",
            className: "column-tel",
            width: 150,
            dataIndex: "tel"
          },
          5: {
            title: "操作",
            dataIndex: "operation",
            width: 100,
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
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        other: this.searchParam.other ? this.searchParam.other : ""
      };
      this.$post(this.api.tenantAdminList, params)
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
      this.searchList();
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      // 重新请求数据
      this.searchList();
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
    /**
     * 点击新增/编辑租户按钮
     */
    showConfigModal(rowData, type) {
      this.$refs["ModalConfigAdmin"].handleOpen(rowData, type);
    },
    showMessageModal(rowData) {
      this.$refs["ModalMessage"].handleOpen(rowData);
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
