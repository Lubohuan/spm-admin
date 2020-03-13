/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  项目施工区段
</comment>
<template>
  <div id="ProjectConstructionSection" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content" v-if="curr_org.projectType&&curr_org.projectType=='401'">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-button
                  type="primary"
                  v-waves
                  @click="showAddModal(false)"
                  :disabled="this.table.selectedRowKeys.length>0"
                >新增</a-button>
                <a-button
                  v-if="false"
                  type="primary"
                  v-waves
                  :disabled="!this.table.selectedRowKeys.length>0"
                >批量删除</a-button>
                <a-button type="primary" v-waves @click="showImportModal">导入</a-button>
                <a-button type="primary" v-waves @click="exportExcel">导出</a-button>
              </div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入施工区段名称"
                  v-model="searchParam.other"
                  @change="deb"
                  @search="deb"
                >
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
                <!-- <a
                  class="m-l-20 align-center flex"
                  style="width:50px"
                  @click="toggleSlide"
                >{{showAdvancedSearch?"收起":"展开"}}</a>-->
              </div>
            </div>
          </div>
          <!-- <collapse>
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
          </collapse>-->
        </div>
        <div class="pannel-content">
          <div class="table-box">
            <div class="table-table">
              <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
                <a-table
                  :locale="{emptyText: '暂无数据'}"
                  :columns="table.columns"
                  :pagination="false"
                  :dataSource="table.searchData"
                  size="middle"
                  :scroll="{x:1200, y: table.height }"
                  :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
                  rowKey="id"
                  :expandedRowKeys="table.expandedRowKeys"
                  @expand="expand"
                >
                  <!-- 施工区段名称 -->
                  <template slot="name" slot-scope="text, record">
                    <span class="table-input" v-if="record.enableEdit">
                      <a-input
                        v-model="record.name"
                        ref="$editInput"
                        @pressEnter="saveEdit(record,'enter')"
                        @blur="saveEdit(record,'blur')"
                      />
                    </span>
                    <span
                      v-else
                      @click="editName(record)"
                      class="enableEditCol"
                      title="单击可进行编辑"
                    >{{record.name}}</span>
                  </template>
                  <!-- 添加时间 -->
                  <template slot="createTime" slot-scope="text, record">
                    {{
                    moment(Number(record.createTime)).format("YYYY-MM-DD HH:mm")
                    }}
                  </template>
                  <!-- 最后编辑时间 -->
                  <template slot="updateTime" slot-scope="text, record">
                    {{
                    moment(Number(record.updateTime)).format("YYYY-MM-DD HH:mm")
                    }}
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record, index">
                    <div class="flex">
                      <span
                        title="新增子级"
                        class="icon-btn"
                        @click="showAddModal(true,record)"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-hebingxingzhuang" />
                      </span>
                      <span
                        title="删除"
                        class="icon-btn"
                        :class="record.children?'disabled':''"
                        @click="record.children?'':remove(record)"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shanchu" />
                      </span>
                      <!-- <span
                        title="查看组织"
                        class="icon-btn"
                        @click="openDetailModal(record)"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shangyicopy5" />
                      </span>-->
                      <a-dropdown placement="bottomRight" v-if="false">
                        <span title="更多" class="icon-btn" v-waves="{ type : 'center' }">
                          <icon-font type="spm-icon-copy19" />
                        </span>
                        <a-menu slot="overlay">
                          <!-- <a-menu-item>
                            <a href="javascript:;" @click="openDetailModal(record)">详情</a>
                          </a-menu-item>-->
                          <!-- <a-menu-item >
                            <a href="javascript:;" @click="addEditOrg('edit',record)">编辑</a>
                          </a-menu-item>-->
                          <!-- <a-menu-item>
                            <a
                              href="javascript:;"
                              @click="changeOrgStatus(record.status ? 0 : 1,record.id)"
                            >
                              {{
                              record.status ? '停用' : '启用'}}
                            </a>
                          </a-menu-item>-->
                          <a-menu-item>
                            <a href="javascript:;" @click="changeOrgOrd('up',record.id)">上移</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a href="javascript:;" @click="changeOrgOrd('down',record.id)">下移</a>
                          </a-menu-item>
                          <!-- <a-menu-item v-if="index">
                            <a href="javascript:;" @click="changeOrgOrd('up',record.id)">上移</a>
                          </a-menu-item>-->
                          <!-- <a-menu-item
                            v-if="(!record.pid || record.pid == null || record.pid == rootId) ? (table.data.length - 1 > index) :  (Util.getDataByProps(table.data,'id',record.pid).children.length - 1 > index)">
                            <a href="javascript:;" @click="changeOrgOrd('down',record.id)">下移</a>
                          </a-menu-item>-->
                        </a-menu>
                      </a-dropdown>
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
            <div class="table-pagination"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-content" v-else>
      <div class="pannel flex justify-center align-center">
        <a-empty>
          <p slot="description" class="text-center">请切换到项目级进行查看</p>
          <!-- <a-button type="primary">Create Now</a-button> -->
        </a-empty>
      </div>
    </div>
    <ModalAddConSect ref="ModalAddConSect" @addArea="addAreaSuccess" :tableData="table.searchData" />
    <ModalImportant ref="ModalImportant" upLoadType="1" @searchList="searchList" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import debounce from "lodash.debounce";
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalAddConSect from "@/projectWBS/projectConstructionSection/ModalAddConSect"; //添加模态框
import ModalImportant from "@/modalImportant/ModalImportant"; //导入模态框
export default {
  name: "ProjectConstructionSection",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalAddConSect,
    ModalImportant
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        treeList: Util.wbsServer + "/web/wbs/area/tree", // 获取列表
        editList: Util.wbsServer + "/web/wbs/area/edit", // 编辑
        areaExportApi: Util.wbsServer + "/web/wbs/area/export-excel", //施工区域导出excel
        delete: Util.wbsServer + "/web/wbs/area/delete" // 删除
      },
      ISItem: false,
      showAdvancedSearch: false,
      disabledDelSome: true,
      searchParam: {
        // date:null,
        // other:'',
        // status: "0",
        // nature: ""
      },
      table: {
        loading: false,
        editValue: null,
        height: 200,
        columns: [],
        searchData: [],
        data: [],
        expandedRowKeys: [],
        selectedRowKeys: [],
        plainOptions: [
          { label: "施工区段名称", value: 0 },
          { label: "添加时间", value: 1 },
          { label: "添加人", value: 2 },
          { label: "最后编辑时间", value: 3 },
          { label: "最后编辑人", value: 4 }
        ],
        operValue: [0, 1, 2, 3, 4],
        initColumns: {
          0: {
            title: "施工区段名称",
            dataIndex: "name",
            width: 450,
            scopedSlots: { customRender: "name" }
          },
          1: {
            title: "添加时间",
            width: 150,
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" }
          },
          2: {
            title: "添加人",
            width: 150,
            dataIndex: "createUserName",
            scopedSlots: { customRender: "createUserName" }
          },
          3: {
            title: "最后编辑时间",
            width: 150,
            dataIndex: "updateTime",
            scopedSlots: { customRender: "updateTime" }
          },
          4: {
            title: "最后编辑人",
            width: 150,
            dataIndex: "updateUserName",
            scopedSlots: { customRender: "updateUserName" }
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
    ...mapState(["curr_org"])
  },
  created() {},
  mounted() {
    if (this.curr_org.projectType && this.curr_org.projectType == "401") {
      this.searchList(true);
      this.operChange(this.table.operValue);
      this.changeTableHeight();
      window.onresize = () => {
        this.changeTableHeight();
      };
    }
  },
  watch: {},
  methods: {
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList(false);
      },
      300 // 延迟时间
    ),
    /** 高级搜索条件*/
    toggleSlide() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
      this.changeTableHeight();
    },
    expand(e, item) {
      e = !e;
      if (e) {
        this.table.expandedRowKeys.splice(
          this.table.expandedRowKeys.findIndex(i => i == item.id),
          1
        );
      } else {
        this.table.expandedRowKeys.push(item.id);
      }
    },
    dealWithExpandedRowKeys(type, id) {
      if (type == "add" || type == "edit") {
        if (this.table.expandedRowKeys.findIndex(i => i == id) != -1) {
          this.table.expandedRowKeys.push(id);
        }
      } else if (type == "del") {
        this.table.expandedRowKeys.splice(
          this.table.expandedRowKeys.findIndex(i => i == id),
          1
        );
      }
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
        this.table.height = document.body.clientHeight - 450 + 54 + 50 + 40;
      }
    },
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      //console.log(this.searchParam)
      let params = {
        projectId: this.curr_org.id
      };
      this.$get(this.api.treeList, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.table.data = response.data.length
              ? Util.dealData(response.data)
              : [];
            this.table.searchData = Util.treeSearch(
              this.searchParam.other,
              "name",
              this.table.data
            );
            isInit &&
              (this.table.expandedRowKeys = Util.getIds(this.table.searchData));
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    //配置table表头
    operChange(checkedValues) {
      let columns = [];
      let oper = {
        title: "操作",
        dataIndex: "operation",
        width: 100,
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.table.selectedRowKeys = selectedRowKeys;
    },
    /**
     * 点击导入按钮
     */
    showImportModal() {
      this.$refs["ModalImportant"].handleOpen();
    },
    /**
     * 点击新增按钮
     */
    showAddModal(isSub, record) {
      this.$refs["ModalAddConSect"].handleOpen(isSub, record);
    },
    // 新增成功回调
    addAreaSuccess(e) {
      e && this.searchList();
    },
    addSubset(record) {
      this.$post(this.api.changeOrgOrdApi, { type: type, id: record.id })
        .then(response => {
          Util.processRes(response, res => {
            this.$message.success(response.statusMessage);
            this.searchList();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
          // Util.processError(this, res)
        });
    },
    // 点击施工区段名称进行编辑
    editName(record) {
      this.$set(record, "enableEdit", true);
      this.$nextTick(() => {
        this.$refs["$editInput"].focus();
      });
      this.editValue = record.name;
    },
    // 施工区段名称编辑的保存操作
    saveEdit(record, type) {
      this.$set(record, "enableEdit", false);
      if (this.editValue === record.name) {
        return;
      }
      if (type == "enter") {
        return;
      }
      this.table.loading = true;
      let params = {
        id: record.id,
        name: record.name
      };
      this.$post(this.api.editList, params)
        .then(response => {
          this.table.loading = false;
          if (response.statusCode == 200) {
            this.$message.success("编辑成功！");
            this.searchList();
            this.$nextTick(() => {
              this.$set(record, "enableEdit", false);
            });
          }
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    //上移、下移
    changeOrgOrd(type, id) {
      this.$post(this.api.changeOrgOrdApi, { type: type, id: id })
        .then(response => {
          Util.processRes(response, res => {
            this.$message.success(response.statusMessage);
            this.searchList();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
          // Util.processError(this, res)
        });
    },
    // 删除
    remove(record) {
      this.$confirm({
        title: "删除",
        content: "确定要删除吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          this.delAjax(record);
        },
        onCancel() {}
      });
    },
    // 删除的请求
    delAjax(record) {
      //this.table.loading = true;
      const params = {
        name: record.name,
        pid: record.pid,
        id: record.id
      };
      this.$post(this.api.delete, params)
        .then(response => {
          Util.processRes(
            response,
            () => {
              //this.table.loading = false;
              this.$message.success("删除成功！");
              this.searchList();
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          //this.table.loading = false;
          Util.processError(this, res);
        });
    },
    exportExcel() {
      let params = {
        projectId: this.curr_org.id
      };
      this.$exportFile(this.api.areaExportApi, params)
        .then(response => {
          let a = document.createElement("a");
          let blob = new Blob([response], {
            type: "application/vnd.ms-excel"
          });
          let objectUrl = URL.createObjectURL(blob);
          a.setAttribute("href", objectUrl);
          a.setAttribute("download", this.curr_org.name + "项目施工区段.xls");
          a.click();
          // Util.processError(this, response);
        })
        .catch(res => {
          //this.table.loading = false;
          //Util.processError(this, res);
        });
    }
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss">
#ProjectConstructionSection {
  .table-input {
    display: inline-block;
    position: relative;
    .ant-input {
      position: absolute;
      top: 50%;
      left: 50%;
      min-width: 300px;
      max-width: 350px;
      margin-top: -20px;
      margin: -20px 0 0 -8px;
      //transform: translate(-50%,-50%)
    }
  }
  .enableEditCol {
    cursor: pointer;
  }
}
</style>
