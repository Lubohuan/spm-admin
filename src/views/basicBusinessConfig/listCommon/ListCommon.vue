te/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  数据字典内容-列表
</comment>
<template>
  <div id="ListCommon" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config" v-if="this.enableConfig">
                <!-- <a-button v-waves @click="goBack" class="m-r-20">返回</a-button> -->
                <a-button type="primary" v-waves @click="showConfigModal('add')">新增</a-button>
                <!-- <a-button v-waves>
                  删除
                </a-button>-->
                <!-- <a-button v-waves>
                  导入
                </a-button>
                <a-button v-waves>
                  下载导入模板
                </a-button>-->
              </div>
              <div class="table-search flex" v-show="false">
                <a-input-search
                  placeholder="请输入数据字典名称"
                  v-model="searchParam.other"
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
                  :scroll="{ x:1200,y: table.height }"
                  rowKey="id"
                  :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
                >
                  <template slot="isEnable" slot-scope="text,record">
                    <span>{{record.isEnable==0?'启用':"停用"}}</span>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <!-- 平台登录的情况 -->
                    <div class="flex" v-if="isPlatform">
                      <!-- :class="'disabled'" -->
                      <span
                        class="icon-btn"
                        :class="record.orgId=='-1'?'':'disabled'"
                        title="编辑"
                        @click="record.orgId=='-1'?showConfigModal('edit',record):''"
                      >
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span
                        title="删除"
                        class="icon-btn"
                        :class="record.orgId=='-1'?'':'disabled'"
                        @click="record.orgId=='-1'?delClick(record):''"
                      >
                        <icon-font type="spm-icon-delete" />
                      </span>
                    </div>
                    <!-- 租户登录的情况 -->
                    <div class="flex" v-else>
                      <!-- :class="'disabled'" -->
                      <span
                        class="icon-btn"
                        :class="record.orgId==curr_org.id?'':'disabled'"
                        title="编辑"
                        @click="record.orgId==curr_org.id?showConfigModal('edit',record):''"
                      >
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span
                        title="删除"
                        class="icon-btn"
                        :class="record.orgId==curr_org.id?'':'disabled'"
                        @click="record.orgId==curr_org.id?delClick(record):''"
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
        <ModalConfigCommonList
          ref="ModalConfigCommonList"
          :modelId="modelId"
          @searchList="searchList"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Cookie from "js-cookie";
import { mapState } from "vuex";
import Title from "@/Title";
import Pagination from "@/Pagination"; //分页组件
import ModalConfigCommonList from "@/basicBusinessConfig/listCommon/ModalConfigCommonList";
export default {
  name: "ListCommon",
  components: {
    Title, //标题
    Pagination,
    ModalConfigCommonList //新增/编辑
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        archivesContentListApi:
          Util.systemServer + "/web/archives-content/page-list", // 列表
        deleteArchivesContentApi:
          Util.systemServer + "/web/archives-content/delete" // 列表
      },
      isPlatform: false,
      enableConfig: false,
      modelId: "",
      currentId: "",
      searchParam: {},
      showAdvancedSearch: false,
      table: {
        loading: false,
        height: 200,
        selectedRowKeys: [],
        columns: [],
        data: [
          { id: "1", tenantCode: "WERG1212312", type: 1 },
          { id: "2", tenantCode: "AERG2212312", type: 2 }
        ],
        plainOptions: [
          { label: "编码", value: 0 },
          { label: "名称", value: 1 },
          { label: "简称", value: 2 },
          { label: "启用", value: 3 },
          { label: "显示顺序", value: 4 },
          { label: "备注", value: 5 },
          { label: "创建组织", value: 6 }
        ],
        operValue: [0, 1, 2, 3, 4, 5, 6],
        initColumns: {
          0: {
            title: "编码",
            dataIndex: "num",
            width: 250,
            scopedSlots: { customRender: "num" }
          },
          1: {
            title: "名称",
            className: "column-name",
            width: 200,
            dataIndex: "name"
          },
          2: {
            title: "简称",
            className: "column-accountName",
            width: 150,
            dataIndex: "shortName"
          },
          3: {
            title: "状态",
            className: "column-accountId",
            width: 150,
            dataIndex: "isEnable",
            scopedSlots: { customRender: "isEnable" }
          },
          4: {
            title: "显示顺序",
            className: "column-displayOrder",
            width: 150,
            dataIndex: "displayOrder"
          },
          5: {
            title: "备注",
            className: "column-tel",
            width: 150,
            dataIndex: "desc"
          },
          6: {
            title: "创建组织",
            className: "column-orgName",
            width: 250,
            dataIndex: "orgName"
          },
          7: {
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
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {
    this.isPlatform = Cookie.get("isPlatform") == "yes" ? true : false;
    this.enableConfig =
      Cookie.get("isPlatform") == "yes" || this.curr_org.pid == "0"
        ? true
        : false;
    this.modelId = this.$route.query.id;
    this.searchList();
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  mounted() {
    this.operChange(this.table.operValue);
  },
  watch: {},
  methods: {
    /**返回主页 */
    goBack() {
      this.$router.push({
        name: "GeneralFileDefinition",
        params: {
          id: "1"
        }
      });
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
        modelId: this.modelId,
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        other: this.searchParam.other ? this.searchParam.other : ""
      };
      this.$post(this.api.archivesContentListApi, params)
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
    changeTableHeight() {
      if (this.showAdvancedSearch) {
        this.table.height = document.body.clientHeight - 450;
      } else {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      }
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
      this.$refs["ModalConfigCommonList"].handleOpen(rowData, type);
    },
    showMessageModal(rowData) {
      //this.$refs["ModalMessage"].handleOpen(rowData);
    },
    clickCodeToSkip(rowData) {
      if (rowData.type == 1) {
        this.$router.push({
          name: "ListCommon",
          params: {
            id: rowData.id
          }
        });
      } else {
        this.$router.push({
          name: "ListTree",
          params: {
            id: rowData.id
          }
        });
      }
    },
    delClick(rowData) {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.$post(this.api.deleteArchivesContentApi, { id: rowData.id })
            .then(response => {
              Util.processRes(
                response,
                () => {
                  //this.list.loading = false;
                  this.$message.success("删除成功！");
                  this.searchList();
                },
                () => {}
              );
              Util.processError(this, response);
            })
            .catch(res => {
              //this.list.loading = false;
              Util.processError(this, res);
            });
        },
        onCancel() {}
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
