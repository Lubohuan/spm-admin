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
            <div class="flex justify-between">
              <div class="table-config">
                <a-button type="primary" v-waves @click="showConfigModal(null,'add')">新增管理员</a-button>
              </div>
              <div class="table-search flex" style="width:400px">
                <a-input-search
                  placeholder="请输入管理员名称/管理员账号/手机号"
                  v-model="searchParam.other"
                  @search="searchList(true)"
                  @change="deb"
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
                  <!-- 权限个数 -->
                  <template slot="authCount" slot-scope="text,record">
                    <a
                      href="javascript:;"
                      class="a-total"
                      @click="showApplyTotalModal(record)"
                    >{{record.authCount}}</a>
                  </template>
                  <!-- 租户范围数量 -->
                  <template slot="tenantCount" slot-scope="text,record">
                    <a
                      href="javascript:;"
                      class="a-total"
                      @click="showRangeTotalModal(record)"
                    >{{record.tenantCount}}</a>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex" v-if="record.username!='sysadmin'">
                      <!-- :class="'disabled'" -->
                      <span class="icon-btn" title="编辑" @click="showConfigModal(record,'edit')">
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span title="查看" class="icon-btn" @click="showMessageModal(record)">
                        <icon-font type="spm-icon-shangyicopy5" />
                      </span>

                      <span class="icon-btn" title="修改手机号" @click="showConfigModal(record,'tel')">
                        <icon-font type="spm-icon-xiugaishoujihao" />
                      </span>
                      <!-- <a-dropdown placement="bottomRight">
                        <span class="icon-btn">
                          <icon-font type="spm-icon-copy19" />
                        </span>
                        <a-menu slot="overlay">
                          <a-menu-item @click="showConfigModal(record,'tel')">
                            <span>修改手机号</span>
                          </a-menu-item>
                          <a-menu-item
                            :disabled="record.state==0?true:false"
                            @click="delAdmin(record)"
                          >
                            <span>删除</span>
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>-->
                    </div>
                    <div v-else>
                      <span title="查看" class="icon-btn" @click="showMessageModal(record)">
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
    <!-- 新增/编辑管理员-->
    <ModalConfigAdmin ref="ModalConfigAdmin" @searchList="searchList" />
    <!-- 详情 -->
    <ModalMessage ref="ModalMessage" />
    <!-- 权限数量 -->
    <ModalApplyTotal ref="ModalApplyTotal" @searchList="searchList" />
    <!-- 租户范围 -->
    <ModalRangeTotal ref="ModalRangeTotal" @searchList="searchList" />
  </div>
</template>

<script>
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalConfigAdmin from "@/platformOperationManage/systemAdmin/ModalConfigAdmin";
import ModalMessage from "@/platformOperationManage/systemAdmin/ModalMessage";
import ModalApplyTotal from "@/platformOperationManage/systemAdmin/ModalApplyTotal";
import ModalRangeTotal from "@/platformOperationManage/systemAdmin/ModalRangeTotal"; //租户范围
import debounce from "lodash.debounce";
export default {
  name: "TenantManage",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalConfigAdmin, //新增/编辑租户弹出框
    ModalMessage, //详情
    ModalApplyTotal, //权限数量
    ModalRangeTotal //租户范围
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        sysAdminList: Util.adminServer + "/admin-user/page", //系统管理员列表
        delAdminApi: Util.adminServer + "/admin-user/delete" //删除系统管理员
      },
      showAdvancedSearch: true,
      searchParam: {},
      table: {
        loading: false,
        height: null,
        columns: [],
        data: [],
        plainOptions: [
          { label: "管理员名称", value: 0 },
          { label: "管理员账号", value: 1 },
          { label: "绑定手机号", value: 2 },
          { label: "权限个数", value: 3 },
          { label: "租户范围数量", value: 4 }
        ],
        operValue: [0, 1, 2, 3, 4],
        initColumns: {
          0: {
            title: "管理员名称",
            dataIndex: "username",
            width: 300,
            scopedSlots: { customRender: "username" }
          },
          1: {
            title: "管理员账号",
            width: 100,
            dataIndex: "accountId"
          },
          2: {
            title: "绑定手机号",
            width: 150,
            dataIndex: "tel"
          },
          3: {
            title: "权限个数",
            width: 100,
            dataIndex: "authCount",
            scopedSlots: { customRender: "authCount" }
          },
          4: {
            title: "租户范围数量",
            width: 150,
            dataIndex: "tenantCount",
            scopedSlots: { customRender: "tenantCount" }
          },
          5: {
            title: "操作",
            dataIndex: "operation",
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
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList(true);
      },
      1000 // 延迟时间
    ),
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
      this.$post(this.api.sysAdminList, params)
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
    /**
     * 查看详情
     */
    showMessageModal(rowData) {
      this.$refs["ModalMessage"].handleOpen(rowData);
    },
    /**重置密码 */
    resetPassword(rowData) {
      this.$confirm({
        title: "重置密码",
        content: "确定要重置密码吗?",
        okText: "确定",
        cancelText: "取 消",
        onOk: () => {
          this.$postParams(this.api.recoverPasswordApi, {
            passportId: rowData.passportId,
            phoneNumber: rowData.phone
          })
            .then(response => {
              Util.processRes(response, res => {
                this.$message.success("重置密码成功，已发送短信！");
                this.searchList();
              });
              Util.processError(this, response);
            })
            .catch(res => {
              Util.processError(this, res);
            });
        },
        onCancel: () => {}
      });
    },
    /** */
    delAdmin(rowData) {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$postParams(this.api.delAdminApi, {
            adminUserId: rowData.id
          })
            .then(response => {
              Util.processRes(response, res => {
                this.$message.success("删除成功");
                this.searchList();
              });
              Util.processError(this, response);
            })
            .catch(res => {
              Util.processError(this, res);
            });
        },
        onCancel() {}
      });
    },
    /**
     * 权限数量模态框显示
     */
    showApplyTotalModal(rowData) {
      this.$refs["ModalApplyTotal"].handleOpen(rowData);
    },
    /**
     * 租户范围模态框显示
     */
    showRangeTotalModal(rowData) {
      this.$refs["ModalRangeTotal"].handleOpen(rowData);
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss">
.a-total {
  @include primary_color();
}
</style>
