/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  租户基本信息
</comment>
<template>
  <a-modal
    v-model="visible"
    class="ModalRangeTotal"
    centered
    :width="550"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">租户范围情况</template>
    <!--租户基本信息  -->
    <div class="t-box">
      <div class="t-title m-b-20">
        <div class="flex justify-between">
          <div class="t-config">
            <a-button
              type="primary"
              v-waves
              style="margin-right:7px;"
              @click="addTenant"
              v-show="currentRowData.username!='sysadmin'"
            >新增租户</a-button>
            <a-button
              v-waves
              style="margin-left:0px;"
              :disabled="disDel"
              @click="delTenant"
              v-show="currentRowData.username!='sysadmin'"
            >删除</a-button>
          </div>
          <div class="t-search">
            <a-input-search
              placeholder="请输入租户名称"
              @search="searchList(true)"
              @change="deb"
              v-model="other"
            >
              <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
            </a-input-search>
          </div>
        </div>
      </div>
      <div class="t-content">
        <div class="t-table">
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 13}">
            <a-table
              :columns="table.columns"
              :pagination="false"
              :dataSource="table.data"
              size="middle"
              rowKey="tenantId"
              :scroll="{ y: 500 }"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
            >
              <template slot="name" slot-scope="text">
                <a href="javascript:;">{{text}}</a>
              </template>
            </a-table>
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
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleClose">关闭</a-button>
    </template>
    <!-- 
      @changeModel="changeModel"
    -->
    <TenantModal
      ref="TenantModal"
      :isVisible="TenantVisible"
      @closed="TenantVisible = false"
      @change="setBossValue"
      @clearData="clearData"
      :multiple="true"
    />
  </a-modal>
</template>

<script>
import debounce from "lodash.debounce";
import Pagination from "@/Pagination"; //分页组件
import TenantModal from "@/select/TenantModal"; //分页组件
export default {
  name: "ModalRangeTotal",
  components: {
    Pagination,
    TenantModal
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        adminRangeApi: Util.adminServer + "/system-tenant/page", // 获取所有已选租户——分页
        reshowTenantApi: Util.adminServer + "/system-tenant/list", // 获取所有已选租户——不分页
        delRangeApi: Util.adminServer + "/system-tenant/delete", // 删除租户
        addRangeApi: Util.adminServer + "/system-tenant/grant " // 增加租户
      },
      title: "",
      other: "",
      visible: false,
      disDel: true,
      reshowData: [],
      TenantVisible: false,
      table: {
        loading: false,
        height: null,
        id: null,
        selectedRowKeys: [],
        columns: [
          {
            title: "租户编码",
            dataIndex: "tenantCode",
            width: 150,
            scopedSlots: { customRender: "tenantCode" }
          },
          {
            title: "租户名称",
            width: 150,
            dataIndex: "name",
            scopedSlots: { customRender: "name" }
          }
        ],
        data: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      currentRowData: {
        id: "",
        name: ""
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList(true);
      },
      1000 // 延迟时间
    ),
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.currentRowData = rowData;
      this.searchList(true, "first");
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    /** 搜索列表*/
    searchList(isInit, isFirst) {
      this.table.loading = true;
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        adminId: this.currentRowData.id,
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        other: this.other ? this.other : ""
      };
      this.$get(this.api.adminRangeApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, () => {
            this.pagination.totalCount = Number(response.data.total);
            if (response.data.records && response.data.records.length) {
              this.table.data = response.data.records;
              if (isFirst) {
                this.reshowData = this.table.data;
              }
            } else {
              this.table.data = [];
            }
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
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      if (selectedRowKeys.length > 0) {
        this.disDel = false;
      } else {
        this.disDel = true;
      }
      this.table.selectedRowKeys = selectedRowKeys;
    },
    changeModel() {
      let checks = [];
      this.table.data.forEach(item => {
        checks.push({
          name: item.name,
          id: item.tenantId
        });
      });
      this.reshowData = checks;
    },
    addTenant() {
      this.TenantVisible = true;
      let params = {
        adminId: this.currentRowData.id
      };
      let reshowAxios = this.$get(this.api.reshowTenantApi, params);
      this.$nextTick(() => {
        this.$refs["TenantModal"].initSub(reshowAxios);
      });
    },
    delTenant() {
      this.$confirm({
        title: "删除",
        content: "确定要删除选中的租户吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          let params = {
            adminId: this.currentRowData.id,
            ids: this.table.selectedRowKeys
          };
          this.$post(this.api.delRangeApi, params)
            .then(response => {
              this.table.loading = false;
              Util.processRes(response, () => {
                this.$message.success("删除成功！");
                this.searchList();
                this.$emit("searchList");
              });
              Util.processError(this, response);
            })
            .catch(res => {
              this.table.loading = false;
              Util.processError(this, res);
            });
        },
        onCancel() {}
      });
    },
    clearData(val) {
      this.eee = val;
    },
    setBossValue(val) {
      let ids = [];
      val.forEach(item => {
        ids.push(item.id);
      });
      let params = {
        adminId: this.currentRowData.id,
        ids: ids
      };
      this.$post(this.api.addRangeApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, () => {
            this.$message.success("添加成功！");
            this.searchList();
            this.$emit("searchList");
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalRangeTotal {
  .ant-modal-body {
    .t-content {
      .t-table {
        height: 500px;
      }
    }
  }
}
</style>
