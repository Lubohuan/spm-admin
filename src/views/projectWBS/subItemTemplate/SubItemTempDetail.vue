
/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  项目分部分项
</comment>
<template>
  <div id="ProjectSubItem" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-button
                  type="primary"
                  v-waves
                  @click="showAddModal(false)"
                  :disabled="$route.query.status&&curr_org.pid == '0'?false:true"
                >新增</a-button>
                <!-- <a-button
                  type="primary"
                  v-waves
                  :disabled="!this.table.selectedRowKeys.length>0"
                >批量删除</a-button>-->
                <a-button
                  type="primary"
                  v-waves
                  @click="showImportModal"
                  :disabled="$route.query.status&&curr_org.pid == '0'?false:true"
                >导入</a-button>
                <a-button
                  type="primary"
                  v-waves
                  @click="exportExcel"
                  :disabled="$route.query.status&&curr_org.pid == '0'?false:true"
                >导出</a-button>
              </div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入分部分项名称"
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
                  :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
                  rowKey="id"
                  :expandedRowKeys="table.expandedRowKeys"
                  @expand="expand"
                >
                  <!-- 分部分项名称-->
                  <template slot="name" slot-scope="text, record">
                    <span v-if="$route.query.status&&curr_org.pid == '0'">
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
                    </span>
                    <span v-else>{{record.name}}</span>
                  </template>
                  <!-- 属性 -->
                  <!-- 
                     { id: "1", name: "分部工程", disabled: false },
        { id: "2", name: "子分部工程", disabled: false },
        { id: "3", name: "分项工程", disabled: false },
        { id: "4", name: "子分项工程", disabled: false }
                  -->
                  <template slot="subType" slot-scope="text, record">
                    <span v-if="record.subType=='1'">分部工程</span>
                    <span v-else-if="record.subType=='2'">子分部工程</span>
                    <span v-else-if="record.subType=='3'">分项工程</span>
                    <span v-else>子分项工程</span>
                  </template>
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
                        v-if="record.subType!=4"
                        title="新增子级"
                        class="icon-btn"
                        :class="$route.query.status&&curr_org.pid == '0'?'':'disabled'"
                        @click="$route.query.status&&curr_org.pid == '0'?showAddModal(true,record):''"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-hebingxingzhuang" />
                      </span>
                      <span
                        title="删除"
                        class="icon-btn"
                        :class="$route.query.status&&curr_org.pid == '0'&&(!record.children)?'':'disabled'"
                        @click="$route.query.status&&curr_org.pid == '0'&&(!record.children)?remove(record):''"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shanchu" />
                      </span>
                      <a-dropdown placement="bottomRight" v-if="false">
                        <span title="更多" class="icon-btn" v-waves="{ type : 'center' }">
                          <icon-font type="spm-icon-copy19" />
                        </span>
                        <a-menu slot="overlay">
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
    <ModalAddSubItem
      ref="ModalAddSubItem"
      type="subDetail"
      :tableData="table.searchData"
      @searchList="searchList"
    />
    <ModalImportant ref="ModalImportant" upLoadType="2" @searchList="searchList" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";
import Title from "@/Title";
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import Pagination from "@/Pagination"; //分页组件
import ModalAddSubItem from "@/projectWBS/ModalAddSubItem"; //添加模态框
import ModalImportant from "@/modalImportant/ModalImportant"; //导入模态框
export default {
  name: "ProjectSubItem",
  components: {
    Title, //标题
    collapse,
    Pagination,
    ModalAddSubItem,
    ModalImportant
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        getListApi: Util.wbsServer + "/web/wbs/wbs/tree", // 查询分部分项模板内容列表
        getDetailApi: Util.wbsServer + "/web/wbs/wbs/detail", // 查询分部分项模板内容详情
        subExportApi: Util.wbsServer + "/web/wbs/wbs/export-excel", //分部分项导出excel
        editApi: Util.wbsServer + "/web/wbs/wbs/edit", // 编辑分部分项模板内容
        delApi: Util.wbsServer + "/web/wbs/wbs/delete" // 删除分部分项模板内容
      },
      wbsTypeId: "",
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
          { label: "分部分项名称", value: 0 },
          { label: "属性", value: 1 },
          { label: "添加时间", value: 2 },
          { label: "添加人", value: 3 },
          { label: "最后编辑时间", value: 4 },
          { label: "最后编辑人", value: 5 }
        ],
        operValue: [0, 1, 2, 3, 4, 5],
        initColumns: {
          0: {
            title: "分部分项名称",
            dataIndex: "name",
            width: 350,
            scopedSlots: { customRender: "name" }
          },
          1: {
            title: "属性",
            dataIndex: "subType",
            width: 150,
            scopedSlots: { customRender: "subType" }
          },
          2: {
            title: "添加时间",
            width: 200,
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" }
          },
          3: {
            title: "添加人",
            width: 150,
            dataIndex: "createUserName",
            scopedSlots: { customRender: "createUserName" }
          },
          4: {
            title: "最后编辑时间",
            width: 200,
            dataIndex: "updateTime",
            scopedSlots: { customRender: "updateTime" }
          },
          5: {
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
    ...mapState(["curr_org"]),
    ...mapState({
      companyTypes: state => state.dicts.COMPANY_NATURE
    })
  },
  created() {},
  mounted() {
    this.searchList(true);
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
        this.searchList(false);
      },
      300 // 延迟时间
    ),
    // 搜索
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
        wbsTypeId: this.$route.query.id
      };
      this.$get(this.api.getListApi, params)
        .then(response => {
          this.table.loading = false;
          if (response.data && response.data.length) {
            this.table.data = Util.dealData(response.data);
            this.table.searchData = Util.treeSearch(
              this.searchParam.other,
              "name",
              this.table.data
            );
            if (isInit) {
              //展开两个层级
              this.table.expandedRowKeys = Util.getIds(this.table.searchData);
            }
          } else {
            this.table.data = [];
            this.table.searchData = [];
            this.table.expandedRowKeys = [];
          }
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
      this.$refs["ModalAddSubItem"].handleOpen(isSub, record);
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
    // 点击分部分项名称进行编辑
    editName(record) {
      this.$set(record, "enableEdit", true);
      this.$nextTick(() => {
        this.$refs["$editInput"].focus();
      });
      this.editValue = record.name;
    },
    // 分部分项名称编辑的保存操作
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
      this.$post(this.api.editApi, params)
        .then(response => {
          this.table.loading = false;
          if (response.statusCode == 200) {
            this.$message.success("编辑成功！");
            this.searchList();
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
      //this.list.loading = true;
      this.$post(this.api.delApi, { id: record.id })
        .then(response => {
          Util.processRes(
            response,
            () => {
              //this.list.loading = false;
              this.$message.success("删除成功！");
              this.searchList(false);
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
    exportExcel() {
      let params = {
        wbsTypeId: this.$route.query.id
      };
      this.$exportFile(this.api.subExportApi, params)
        .then(response => {
          let a = document.createElement("a");
          let blob = new Blob([response], {
            type: "application/vnd.ms-excel"
          });
          let objectUrl = URL.createObjectURL(blob);
          a.setAttribute("href", objectUrl);
          a.setAttribute("download", this.$route.query.name + "分部分项.xls");
          a.click();
          //Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
          //this.table.loading = false;
          //Util.processError(this, res);
        });
    }
  },
  destroyed() {
    window.onresize = "";
  }
};
</script>

<style lang="scss">
#ProjectSubItem {
  .table-input {
    position: relative;
    display: inline-block;
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
