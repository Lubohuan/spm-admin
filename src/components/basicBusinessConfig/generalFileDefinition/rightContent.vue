/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
   数据字典定义
</comment>
<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" v-waves @click="showConfigModal('add')" v-if="isPlatform">新增</a-button>
            <!-- <a-button v-waves :disabled="!hasSelected" @click="delArchivesModel">
              删除
            </a-button>-->
          </div>
          <div class="table-search flex">
            <a-input-search
              placeholder="请输入数据字典名称"
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
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 5}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              :pagination="false"
              :dataSource="table.data"
              size="middle"
              :scroll="{x:1200, y: table.height }"
              rowKey="id"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
            >
              <template slot="num" slot-scope="text,record">
                <a
                  href="javascript:;"
                  class="tenantCode"
                  @click="clickCodeToSkip(record)"
                >{{record.num}}</a>
              </template>
              <!-- 字典类型 -->
              <template slot="type" slot-scope="text,record">
                <span>{{record.type==1?'列表型':"树型"}}</span>
              </template>
              <template slot="orgStatus" slot-scope="text,record">
                <span>{{record.orgStatus==1?'是':"否"}}</span>
              </template>
              <template slot="range" slot-scope="text,record">
                <!-- 1平台/本级/所有上级 2平台/本级 3平台/本级/最近上级 -->
                <span>{{record.range==1?'平台+本级+所有上级':record.range==2?'平台+本级':'平台+本级+最近上级'}}</span>
              </template>
              <template slot="source" slot-scope="text,record">
                <!-- 1平台/本级/所有上级 2平台/本级 3平台/本级/最近上级 -->
                <span>{{record.source==1?'平台':record.range==2?'标准档案':''}}</span>
              </template>
              <!-- 租户可维护 -->
              <template slot="tenantStatus" slot-scope="text,record">
                <!-- 1平台/本级/所有上级 2平台/本级 3平台/本级/最近上级 -->
                <span>{{record.tenantStatus==1?'是':'否'}}</span>
              </template>

              <!-- 操作 -->
              <template slot="action" slot-scope="text, record">
                <div class="flex">
                  <!-- :class="'disabled'" -->
                  <span
                    class="icon-btn"
                    :class="isPlatform?'':'disabled'"
                    title="编辑"
                    @click="isPlatform?showConfigModal('edit',record):''"
                  >
                    <icon-font type="spm-icon-shangyicopy4" />
                  </span>
                  <span
                    title="删除"
                    class="icon-btn"
                    :class="isPlatform?'':'disabled'"
                    @click="isPlatform?delArchivesModel(record):''"
                  >
                    <icon-font type="spm-icon-delete" />
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
    <ModalConfigFile
      ref="ModalConfigFile"
      @searchList="searchList"
      :currentLeftId="currentLeftId"
      :platformList="platformList"
    />
  </div>
</template>
<script>
import Cookie from "js-cookie";
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalConfigFile from "@/basicBusinessConfig/generalFileDefinition/ModalConfigFile";
import debounce from "lodash.debounce";
// import ModalMessage from "@/platformOperationManage/systemAdmin/ModalMessage";
export default {
  name: "TenantManage",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalConfigFile //新增/编辑
    // ModalMessage
  },
  props: {
    platformList: Array,
    currentLeftId: String
  },
  data() {
    return {
      Util,
      api: {
        archivesModelListApi:
          Util.systemServer + "/web/archives-model/page-list", // 字典的项目list
        delArchivesModelApi: Util.systemServer + "/web/archives-model/delete" // 删除
      },
      isPlatform: false,
      showAdvancedSearch: true,
      searchParam: {},
      table: {
        loading: false,
        height: null,
        selectedRowKeys: [],
        columns: [],
        data: [],
        plainOptions: [
          { label: "数据字典编码", value: 0 },
          { label: "数据字典名称", value: 1 },
          { label: "字典类型", value: 2 },
          // { label: "组织隔离", value: 3 },//2019年10月21注释掉
          // { label: "数据权限范围", value: 4 },//2019年10月21注释掉
          { label: "备注", value: 3 },
          { label: "来源", value: 4 },
          { label: "租户可维护", value: 5 }
        ],
        operValue: [0, 1, 2, 3, 4, 5],
        initColumns: {
          0: {
            title: "数据字典编码",
            dataIndex: "num",
            width: 300,
            scopedSlots: { customRender: "num" }
          },
          1: {
            title: "数据字典名称",
            className: "column-name",
            width: 200,
            dataIndex: "name"
          },
          2: {
            title: "字典类型",
            className: "column-type",
            width: 150,
            dataIndex: "type",
            scopedSlots: { customRender: "type" }
          },
          // 3: {
          //   title: "组织隔离",
          //   className: "column-orgStatus",
          //   width: 150,
          //   dataIndex: "orgStatus",
          //   scopedSlots: { customRender: "orgStatus" }
          // },
          // 4: {
          //   title: "数据权限范围",
          //   className: "column-range",
          //   width: 180,
          //   dataIndex: "range",
          //   scopedSlots: { customRender: "range" }
          // },
          3: {
            title: "备注",
            className: "column-desc",
            width: 250,
            dataIndex: "desc"
          },
          4: {
            title: "来源",
            className: "column-source",
            width: 80,
            dataIndex: "source",
            scopedSlots: { customRender: "source" }
          },
          5: {
            title: "租户可维护",
            className: "column-tenantStatus",
            width: 120,
            dataIndex: "tenantStatus",
            scopedSlots: { customRender: "tenantStatus" }
          },
          6: {
            title: "操作",
            width: 80,
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
  computed: {
    hasSelected() {
      return this.table.selectedRowKeys.length > 0;
    }
  },
  created() {
    this.isPlatform = Cookie.get("isPlatform") == "yes" ? true : false;
  },
  mounted() {
    this.operChange(this.table.operValue);
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  watch: {
    currentLeftId: {
      handler(id) {
        this.searchList(true);
      },
      deep: true
    }
  },
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
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.table.selectedRowKeys = selectedRowKeys;
    },
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      //console.log(this.searchParam)
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        modelType: this.currentLeftId,
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        name: this.searchParam.other ? this.searchParam.other : ""
      };
      this.$post(this.api.archivesModelListApi, params)
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
    showConfigModal(type, rowData) {
      this.$refs["ModalConfigFile"].handleOpen(rowData, type);
    },
    showMessageModal(rowData) {
      //this.$refs["ModalMessage"].handleOpen(rowData);
    },
    clickCodeToSkip(rowData) {
      if (rowData.type == 1) {
        this.$router.push({
          name: "ListCommon",
          query: {
            id: rowData.id
          }
        });
      } else {
        this.$router.push({
          name: "ListTree",
          query: {
            id: rowData.id
          }
        });
      }
    },
    delArchivesModel(rowData) {
      const params = {
        id: rowData.id,
        type: "1"
      };
      this.delAjax(params, "step1");
    },
    // 删除
    delAjax(params, step) {
      this.$post(this.api.delArchivesModelApi, params)
        .then(response => {
          Util.processRes(response, res => {
            if (step == "step1") {
              this.$confirm({
                title: "删除",
                content: response.data
                  ? "此数据字典下包含内容，是否确认删除 ?"
                  : "确认删除此数据字典吗 ?",
                okText: "确认",
                cancelText: "取消",
                onOk: () => {
                  this.delAjax({ id: params.id, type: "2" }, "step2");
                },
                onCancel() {}
              });
            } else {
              this.$message.success("删除成功！");
              this.searchList();
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.tenantCode {
  @include primary_color();
}
</style>
