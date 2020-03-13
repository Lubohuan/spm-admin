/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  产品密钥管理
</comment>
<template>
  <div id="AppKeyManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-end">
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入申请编码/租户名称/产品密钥/申请人"
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
                    <a-form-item label="申请日期">
                      <a-range-picker v-model="searchParam.date" :placeholder="['开始日期', '结束日期']" format="YYYY-MM-DD"
                                      @change="deb"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-item label="密钥状态">
                      <!-- 0 未生成 1.未使用2.已使用 3.已失效 -->
                      <a-select placeholder="请选择密钥状态" v-model="searchParam.secretType" @change="deb">
                        <a-select-option value>全部</a-select-option>
                        <a-select-option value="0">未生成</a-select-option>
                        <a-select-option value="1">未使用</a-select-option>
                        <a-select-option value="2">已使用</a-select-option>
                        <a-select-option value="3">已失效</a-select-option>
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
                  :scroll="{ x:1200,y: table.height }"
                  rowKey="id"
                >
                  <!-- 产品密钥-->
                  <template slot="secretNum" slot-scope="text, record">
                    <span>{{record.secretNum?record.secretNum:'--'}}</span>
                  </template>
                  <!-- 申请时间-->
                  <template slot="createTime" slot-scope="text, record">
                    <span>{{record.createTime?moment(Number(record.createTime)).format("YYYY-MM-DD"):'--'}}</span>
                  </template>
                  <!-- 密钥状态-->
                  <!--  0 未生成 1.未使用2.已使用 3.已失效 -->
                  <template slot="secretType" slot-scope="text, record">
                    <span v-if="record.secretType=='0'">未生成</span>
                    <span v-else-if="record.secretType=='1'">未使用</span>
                    <span v-else-if="record.secretType=='2'">已使用</span>
                    <span v-else>已失效</span>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <span class="icon-btn" @click="showDetailModal(record)" title="查看">
                        <icon-font type="spm-icon-shangyicopy5"/>
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
    <!-- 查看信息 -->
    <ModalAppKeyMessage ref="ModalAppKeyMessage" @searchList="searchList"/>
  </div>
</template>

<script>
  import debounce from "lodash.debounce";
  import Title from "@/Title";
  import collapse from "#/assets/js/collapse.js"; //伸缩组件
  import Pagination from "@/Pagination"; //分页组件
  import ModalAppKeyMessage from "@/AppKey/AppKeyManage/ModalAppKeyMessage";

  export default {
    name: "AppKeyManage",
    components: {
      Title, //标题
      collapse,
      Pagination,
      ModalAppKeyMessage //编辑租户弹出框
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          licenceListApi: Util.operationServer + "/web/license-info/licence-list" // 密钥列表
        },
        showAdvancedSearch: false,
        searchParam: {},
        table: {
          loading: false,
          height: null,
          columns: [],
          data: [],
          plainOptions: [
            {label: "申请编号", value: 0},
            {label: "租户名称", value: 1},
            {label: "产品密钥", value: 2},
            {label: "申请人", value: 3},
            {label: "申请时间", value: 4},
            {label: "密钥状态", value: 5}
          ],
          operValue: [0, 1, 2, 3, 4, 5],
          initColumns: {
            0: {
              title: "申请编号",
              dataIndex: "num",
              width: "20%",
              scopedSlots: {customRender: "num"}
            },
            1: {
              title: "租户名称",
              className: "column-name",
              width: "15%",
              dataIndex: "name"
            },
            2: {
              title: "产品密钥",
              className: "column-secretNum",
              width: "15%",
              dataIndex: "secretNum"
            },
            3: {
              title: "申请人",
              className: "column-userName",
              width: "15%",
              dataIndex: "userName"
            },
            4: {
              title: "申请时间",
              className: "column-createTime",
              width: "15%",
              dataIndex: "createTime",
              scopedSlots: {customRender: "createTime"}
            },
            5: {
              title: "密钥状态",
              className: "column-secretType",
              width: "10%",
              dataIndex: "secretType",
              scopedSlots: {customRender: "secretType"}
            },
            6: {
              title: "操作",
              dataIndex: "operation",
              width: "10%",
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
        function () {
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
          startTime: this.searchParam.date
            ? this.moment(this.searchParam.date[0]).format("X") * 1000
            : "",
          endTime: this.searchParam.date
            ? this.moment(this.searchParam.date[1]).format("X") * 1000
            : "",
          secretType: this.searchParam.secretType
            ? this.searchParam.secretType
            : "",
          other: this.searchParam.other ? this.searchParam.other : "",
          size: this.pagination.pageSize,
          current: this.pagination.pageNo
        };
        this.$post(this.api.licenceListApi, params)
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
      /**
       * 点击查看
       */
      showDetailModal(record) {
        this.$refs["ModalAppKeyMessage"].handleOpen(record);
      },
      // 删除
      remove() {
        this.$confirm({
          title: "删除",
          content: "确定要删除吗 ?",
          okText: "确认",
          cancelText: "取消",
          onOk() {
          },
          onCancel() {
          }
        });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
