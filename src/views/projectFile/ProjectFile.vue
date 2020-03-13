/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-09-09 10:34:59
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-10 10:12:38
 * @Description: 项目档案--主页
 */
<template>
  <div id="ProjectFile" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left flex-1">
        <div class="pannel">
          <div class="pannel-title">
            <a-input-search placeholder="请输入组织名称" v-model="searchValue" @change="search" />
          </div>
          <div class="pannel-content">
            <div class="table-box" style="overflow:auto">
              <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
                <div class="treeWarp">
                  <a-tree
                    defaultExpandAll
                    v-if="treeResultData.length"
                    :treeData="treeResultData"
                    :selectedKeys="selectedId"
                    @select="treeSelect"
                  >
                    <template slot="custom" slot-scope="record">
                      <icon-font
                        :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
                      />
                    </template>
                  </a-tree>
                  <div v-else class="ant-table-placeholder">暂无数据</div>
                </div>
              </a-skeleton>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-4">
        <div id="ProjectFileTable" class="pannel">
          <div class="pannel-title">
            <div class="search-lower">
              <div class="flex justify-between">
                <div class="table-config">
                  <a-button type="primary" v-waves @click="addClick" :disabled="disabledAdd">新增</a-button>
                  <!-- <a-button class="m-l-10 m-r-10" v-waves @click="deleteClick">
                    删 除
                  </a-button>-->
                </div>
                <div class="table-search flex">
                  <a-input-search
                    placeholder="请输入项目编码、项目名称"
                    v-model="searchParam.other"
                    @search="searchList(true)"
                    enterButton="搜索"
                  />
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
                      <a-form-item label="项目状态">
                        <a-select
                          style="width: 100%"
                          v-model="searchParam.pStatus"
                          placeholder="请选择"
                        >
                          <!-- 0所有 1在建2 竣工 3 停工 4 完工 5 新承建未开工 -->
                          <a-select-option value="0">所有</a-select-option>
                          <a-select-option value="1">在建</a-select-option>
                          <a-select-option value="2">竣工</a-select-option>
                          <a-select-option value="3">停工</a-select-option>
                          <a-select-option value="4">完工</a-select-option>
                          <a-select-option value="5">新承建未开工</a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="工程类别">
                        <a-select style="width: 100%" v-model="searchParam.eType" placeholder="请选择">
                          <a-select-option value="1">工程1</a-select-option>
                          <a-select-option value="2">工程2</a-select-option>
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
                    :scroll="{x:800, y: table.height }"
                    rowKey="id"
                  >
                    <!-- 注册时间-->
                    <template slot="createTime" slot-scope="text, record">
                      <span>{{record.createTime?moment(Number(record.createTime)).format("YYYY-MM-DD"):'--'}}</span>
                    </template>
                    <!-- 租户状态-->
                    <template slot="isEnable" slot-scope="text, record">
                      <span>{{record.isEnable=='0'?'启用':"停用"}}</span>
                    </template>
                    <!-- 有效期-->
                    <template slot="startTime" slot-scope="text, record">
                      <p v-if="record.startTime==0">无限期</p>
                      <p v-else>
                        <span>{{record.startTime?moment(Number(record.startTime)).format("YYYY-MM-DD"):'--'}}</span>
                        ~
                        <span>{{record.endTime?moment(Number(record.endTime)).format("YYYY-MM-DD"):'--'}}</span>
                      </p>
                    </template>
                    <!-- 项目状态-->
                    <template slot="pstatus" slot-scope="text, record">
                      <span v-if="text=='1'">在建</span>
                      <span v-if="text=='2'">竣工</span>
                      <span v-if="text=='3'">停工</span>
                      <span v-if="text=='4'">完工</span>
                      <span v-if="text=='5'">新承建未开工</span>
                    </template>
                    <!-- 操作 -->
                    <template slot="action" slot-scope="text,record">
                      <span class="pointer" @click="editHandle(record)" title="编辑">
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span class="m-l-10 pointer" @click="delHandle(record)" title="删除">
                        <icon-font type="spm-icon-shanchu" />
                      </span>
                      <span
                        title="停用"
                        v-if="record.isEnable=='0'"
                        class="m-l-10 pointer"
                        @click="enableHandle(record,1)"
                      >
                        <icon-font type="spm-icon-shangyicopy" />
                      </span>
                      <span
                        title="启用"
                        v-if="record.isEnable=='1'"
                        class="m-l-10 pointer"
                        @click="enableHandle(record,0)"
                      >
                        <icon-font type="spm-icon-shangyicopy1" />
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
  </div>
</template>

<script>
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination";
import debounce from "lodash.debounce";
export default {
  name: "ProjectFile",
  components: {
    Title,
    Pagination,
    collapse
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        getOrgTreeApi: Util.orgServer + "/web/org/org-project-tree", // 查询项目部列表树
        listArchivesProject:
          Util.systemServer + "/web/archives-project/page-list", // 获取 列表
        enableArchivesProject:
          Util.systemServer + "/web/archives-project/enable", // 获取 列表
        deleteArchivesProject:
          Util.systemServer + "/web/archives-project/delete" // 获取 列表
      },
      selectedId: [],
      loading: false,
      // 组织列表数 -- 搜索值
      searchValue: "",
      // 组织列表数 -- 默认层级
      treeDefaultKeys: [],
      // 组织列表数 -- 数据
      treeData: [],
      // tree 搜索结果
      treeResultData: [],
      deptId: "",

      disabledAdd: true,
      currentTreeData: null,
      showAdvancedSearch: false,
      loading: false,
      searchParam: {},
      table: {
        height: null,
        data: [],
        columns: [],
        initColumns: {
          0: {
            title: "项目编码",
            dataIndex: "pnum",
            width: 150
          },
          1: {
            title: "项目名称",
            dataIndex: "pname",
            width: 150
          },
          2: {
            title: "建设单位",
            dataIndex: "conCompany",
            width: 150
          },
          3: {
            title: "所属地区",
            dataIndex: "parea",
            width: 250
          },
          4: {
            title: "项目状态",
            dataIndex: "pstatus",
            width: 150,
            scopedSlots: {
              customRender: "pstatus"
            }
          },
          5: {
            title: "启用状态",
            dataIndex: "isEnable",
            width: 150,
            scopedSlots: {
              customRender: "isEnable"
            }
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
        },
        plainOptions: [
          { label: "项目编码", value: 0 },
          { label: "项目名称", value: 1 },
          { label: "建设单位", value: 2 },
          { label: "所属地区", value: 3 },
          { label: "项目状态", value: 4 },
          { label: "启用状态", value: 5 }
        ],
        operValue: [0, 1, 2, 3, 4, 5],
        selectedRowKeys: []
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
    this.treeInit();
    this.operChange(this.table.operValue);
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  mounted() {},
  watch: {},
  methods: {
    // 组织列表数--初始化
    treeInit() {
      this.searchValue = "";
      this.getData();
    },
    /**
     * tree搜索
     */
    search: debounce(function(val) {
      this.searchValue = val.target.value;
      this.handleSearch(val.target.value);
    }, 1000),
    // 搜索
    handleSearch(val) {
      this.treeResultData = val
        ? Util.treeSearch(val, this.treeData)
        : this.treeData;
    },
    // 获取--组织列表 数据
    getData() {
      this.$get(this.api.getOrgTreeApi)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.treeData = response.data
              ? Util.dealDataProjectTypeDisabled(response.data)
              : [];
            this.treeResultData = this.treeData;
            if (this.treeData.length > 0) {
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 组织列表数--点击
    treeSelect(selectedKeys, info) {
      // console.log(selectedKeys, e);
      if (!info.selected) {
        return;
      }
      if (selectedKeys.length > 0) {
        this.currentTreeData = info.node.dataRef;
        this.disabledAdd = false;
        this.selectedId = selectedKeys;
        this.searchList(true);
      }
    },
    treeClickHandle(deptId) {
      // console.log(deptId);
      this.deptId = deptId;
    },

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
    // 获取 项目
    searchList(init) {
      if (init) {
        this.pagination.pageNo = 1;
      }
      let params = {
        size: this.pagination.pageSize,
        current: this.pagination.pageNo,
        projectId: this.currentTreeData.id
      };
      params = { ...params, ...this.searchParam };
      this.$post(this.api.listArchivesProject, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.pagination.totalCount = Number(response.data.total);
            response.data.records && response.data.records.length > 0
              ? (this.table.data = response.data.records)
              : (this.table.data = []);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 新增项目
    addClick() {
      this.$router.push({
        path: "/main/projectFile/AddProject", //跳转的路径
        query: {
          configType: "add",
          projectId: this.currentTreeData.id,
          projectName: this.currentTreeData.name,
          orgId: this.currentTreeData.pid
          //id: this.id
        }
      });
    },
    editHandle(record) {
      this.$router.push({
        path: "/main/projectFile/editProject", //跳转的路径
        query: {
          configType: "edit",
          id: record.id
        }
      });
    },
    enableHandle(rowData, type) {
      this.$post(this.api.enableArchivesProject, {
        id: rowData.id,
        isEnable: type
      })
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.$message.success(type == 1 ? "停用成功！" : "启用成功！");
            this.searchList();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 删除项目
    delHandle(rowData) {
      this.$post(this.api.deleteArchivesProject, { id: rowData.id })
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.$message.success("删除成功！");
            this.searchList();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 搜索
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
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.table.selectedRowKeys = selectedRowKeys;
    },
    // 新增 项目选择 回调
    setPostValue(val) {}
  },
  destroyed() {}
};
</script>

<style lang="scss">
#ProjectFile {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    > div {
      height: 100%;
      background-color: #fff;
    }
  }
}
</style>
