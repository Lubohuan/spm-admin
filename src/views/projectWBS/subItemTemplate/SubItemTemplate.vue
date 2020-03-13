/**
* @Author: 李晨光
* @Date: 2019/10/18
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/10/18
**/
<comment>
  # 组件注释
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
                  @click="addEditSubItemTemp('add')"
                  v-waves
                  :disabled="curr_org.pid != '0'"
                >新增分部分项模板</a-button>
              </div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入模板名称"
                  v-model="params.search"
                  @change="deb"
                  @search="search"
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
              <a-skeleton active :loading="tableLoading" :paragraph="{rows: 15}">
                <a-table
                  :columns="initColumns"
                  :scroll="{x: 1024,y:table.height}"
                  :pagination="false"
                  :dataSource="tableData.list"
                  :locale="{emptyText: '暂无数据'}"
                  rowKey="id"
                  size="middle"
                  :customRow="rowClick"
                  :rowClassName="rowClassName"
                >
                  <!-- 序号 -->
                  <template slot="order" slot-scope="text, record,index">{{index+1}}</template>
                  <!-- 模板名称 -->
                  <template slot="name" slot-scope="text, record">
                    <a @click="goToSubItemDetail(record)">{{text}}</a>
                  </template>
                  <!-- 工程类别 -->
                  <template slot="type" slot-scope="text, record">
                    <span>{{Util.getDataByProps(engineeringTypes,'id',record.type).name}}</span>
                  </template>
                  <div slot="status" slot-scope="text">{{text ? '启用' : '停用'}}</div>
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <span
                        title="编辑"
                        class="icon-btn"
                        :class="record.status&&curr_org.pid == '0'?'':'disabled'"
                        @click="record.status&&curr_org.pid == '0'?addEditSubItemTemp('edit', record):''"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shangyicopy4" />
                      </span>
                      <span
                        title="删除"
                        class="icon-btn"
                        :class="record.status&&curr_org.pid == '0'?'':'disabled'"
                        @click="record.status&&curr_org.pid == '0'?remove(record.id):''"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shanchu" />
                      </span>
                      <span
                        class="icon-btn"
                        :class="curr_org.pid == '0'?'':'disabled'"
                        :title="record.status ? '停用' : '启用'"
                        @click="curr_org.pid == '0'?changeSubItemTempStatus(record.status ? 0 : 1,record.id):''"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font
                          :type="record.status ? 'spm-icon-shangyicopy' : 'spm-icon-shangyicopy1'"
                        />
                      </span>
                    </div>
                  </template>
                  <div
                    slot="filterDropdown"
                    slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    class="custom-filter-dropdown"
                  >
                    <a-checkbox-group
                      :options="plainOptions"
                      v-model="operValue"
                      @change="operChange"
                    />
                  </div>
                  <icon-font
                    slot="operIcon"
                    slot-scope="filtered"
                    type="spm-icon-setting"
                    :style="{ color: filtered ? '#111' : undefined }"
                    style="border-left:1px solid #ddd;};"
                  />
                </a-table>
              </a-skeleton>
            </div>
            <div class="table-pagination">
              <Pagination
                :total="tableData.pagination.total"
                :pageSize="tableData.pagination.pageSize"
                :current="tableData.pagination.pageNo"
                @onChange="onChangePage"
                @onShowSizeChange="onShowSizeChangePage"
              ></Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal
      :title="operType == 'add' ? '新增分部分项模板': '编辑分部分项模板'"
      centered
      :width="500"
      :visible="formModalVisible"
      @ok="submitSubItemTemp"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 4}">
        <a-form :form="form">
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item
                label="分部分项模板名称"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入分部分项模板名称"
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入分部分项模板名称！' },
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item
                label="工程类别"
                :validate-status="formError(form,'type') ? 'error' : ''"
                :help="formError(form,'type') || ''"
              >
                <a-select
                  notFoundContent="暂无数据"
                  placeholder="请选择工程类别"
                  v-decorator="[
                  'type',
                  {rules: [{ required: true, message: '请选择工程类别！' }]}
                ]"
                >
                  <a-select-option
                    v-for="( engineeringType, index ) in engineeringTypes"
                    :value="engineeringType.id"
                    :key="index + 'type'"
                  >{{ engineeringType.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          :loading="ajaxLoading"
          @click="submitSubItemTemp"
          :disabled="hasErrors(form.getFieldsError())||ajaxLoading"
        >确 认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/Title";
import debounce from "lodash.debounce";
import Pagination from "@/Pagination";

export default {
  name: "ProjectSubItem",
  components: {
    Title,
    Pagination
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        getSubItemTempApi: Util.wbsServer + "/web/wbs/wbs-type/page", // 查询分部分项模板列表
        getSubItemTempDetailApi: Util.wbsServer + "/web/wbs/wbs-type/detail", // 查询分部分项模板详情
        addSubItemTempApi: Util.wbsServer + "/web/wbs/wbs-type/add", // 新增分部分项模板
        editSubItemTempApi: Util.wbsServer + "/web/wbs/wbs-type/edit", // 编辑分部分项模板
        delSubItemTempApi: Util.wbsServer + "/web/wbs/wbs-type/delete", // 删除分部分项模板
        changeSubItemTempStatusApi: Util.wbsServer + "/web/wbs/wbs-type/status" // 启用、停用分部分项模板
      },
      ajaxLoading: false,
      table: {
        height: null,
        id: ""
      },
      disabledAjax: true,
      plainOptions: [
        // 列表头部配置选项
        { label: "序号", value: 0 },
        { label: "编码", value: 1 },
        { label: "分部分项模板名称", value: 2 },
        { label: "工程类别", value: 3 },
        { label: "创建组织", value: 4 },
        { label: "状态", value: 5 }
      ],
      operValue: [0, 1, 2, 3, 4, 5], // 列表头部默认配置
      columns: {
        // 列表头部配置表
        0: {
          title: "序号",
          width: 100,
          dataIndex: "order",
          scopedSlots: {
            customRender: "order"
          }
        },
        1: {
          title: "编码",
          width: 300,
          dataIndex: "num"
        },
        2: {
          title: "分部分项模板名称",
          dataIndex: "name",
          width: 250,
          scopedSlots: {
            customRender: "name"
          }
        },
        3: {
          title: "工程类别",
          width: 200,
          dataIndex: "type",
          scopedSlots: {
            customRender: "type"
          }
        },
        4: {
          title: "创建组织",
          width: 250,
          dataIndex: "orgId"
        },
        5: {
          title: "状态",
          width: 150,
          dataIndex: "status",
          scopedSlots: {
            customRender: "status"
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
          onFilter: (value, record) => {},
          onFilterDropdownVisibleChange: visible => {}
        }
      },
      initColumns: [], // 初始化列表头部配置表
      tableData: {
        // 列表数据
        list: [],
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10
        }
      },
      params: {
        //查询请求参数
        search: undefined,
        current: 1,
        size: 10
      },
      detailParams: {
        subcontractorId: "",
        current: 1,
        size: 10
      },
      engineeringTypes: [
        { id: 1, name: "房建" },
        { id: 2, name: "路桥" },
        { id: 3, name: "隧道" }
      ], // 工程类型
      expandedRowKeys: [],
      tableLoading: true,
      form: this.$form.createForm(this), // 新增分部分项模板
      formModalVisible: false, // 新增分部分项模板弹窗状态
      operType: "add", // 操作类型
      subItemTemp: {},
      subItemTempDetail: {}, // 组织详情  -- 详情显示用
      detailVisible: false, // 详情弹窗状态
      detailLoading: true
    };
  },
  computed: {
    ...mapState(["curr_org"])
  },
  created() {},
  mounted() {
    this.operChange(this.operValue);
    this.search();
    this.changeTableHeight();
    window.onresize = () => {
      this.changeTableHeight();
    };
  },
  watch: {},
  methods: {
    /**
     * 监听input 执行debounce 延时1S后执行搜索方法
     */
    deb: debounce(
      function() {
        // 搜索方法
        this.search();
      },
      1000 // 延迟时间
    ),
    /**
     * 搜索
     */
    search() {
      this.getDataAction();
    },
    /**
     * 页数变化回调
     * @param pageNo  页码
     * @param pageSize  每页多少条
     */
    onChangePage(pageNo, pageSize) {
      // 重新请求数据
      this.tableData.pagination.pageNo = pageNo;
      this.getDataAction(pageNo, pageSize);
    },
    /**
     * 每页条数变化回调
     * @param pageNo  页码
     * @param pageSize  每页多少条
     */
    onShowSizeChangePage(pageNo, pageSize) {
      // 重新请求数据
      this.tableData.pagination.pageNo = 1;
      this.tableData.pagination.pageSize = pageSize;
      this.getDataAction(1, pageSize);
    },

    /**
     * 列表数据请求
     */
    getDataAction(pageNo = 1, pageSize = 10) {
      let params = {
        current: pageNo,
        size: pageSize,
        name: this.params.search
      };
      this.$get(this.api.getSubItemTempApi, params)
        .then(response => {
          this.tableLoading = false;
          Util.processRes(response, () => {
            this.tableData.list = response.data.records
              ? response.data.records
              : [];
            this.tableData.pagination.total = Number(response.data.total);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.tableLoading = false;
          console.log(res);
        });
    },
    changeTableHeight() {
      this.table.height = document.body.clientHeight - 450 + 54 + 30;
    },
    //table行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.table.id = record.id;
          }
        }
      };
    },
    //table行class
    rowClassName(record, index) {
      let className = "";
      if (record.id == this.table.id) {
        className = "rowActive";
      }
      return className;
    },
    /**
     * 配置table表头
     */
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
          columns.push(this.columns[checked]);
        });
      columns.push(oper);
      this.initColumns = columns;
    },

    // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
    formError(form, field) {
      const { getFieldError, isFieldTouched } = form;
      return isFieldTouched(field) && getFieldError(field);
    },
    hasErrors(fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    /**
     * 新增编辑分部分项模板
     * @param type
     * @param data
     */
    addEditSubItemTemp(type = "add", item = {}) {
      this.operType = type;
      this.openModal();
      if (item.id) {
        //编辑
        this.$get(this.api.getSubItemTempDetailApi, { id: item.id })
          .then(response => {
            this.detailLoading = false;
            Util.processRes(response, () => {
              this.SubItemTempDetail = response.data;
              this.dealDetail(type, response.data);
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.detailLoading = false;
          });
      } else {
        this.detailLoading = false;
      }
    },
    // 编辑数据处理回填
    dealDetail(type = "add", data = {}) {
      console.log(data);
      let _obj = {};
      if (type == "add") {
        this.subItemTemp = {
          // 参建单位信息
          type: undefined, // 唯一代码
          name: undefined // 参建名称
        };
        Object.assign(_obj, this.subItemTemp);
      } else {
        Object.assign(this.subItemTemp, data);

        _obj = Util.deepCopy(data);
        // form数据回填
        _obj = Util.delParams(_obj, ["name", "type"]);
      }
      // 这里是必须要给一个延时器的
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: _obj.name,
          type: Number(_obj.type)
        });
        this.form.validateFields();
      });
    },

    /**
     * 打开弹窗
     */
    openModal() {
      this.formModalVisible = true;
      this.$nextTick(() => {
        this.form.validateFields();
      });
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.formModalVisible = false;
      this.form.resetFields();
    },
    /**
     * 提交信息
     */
    submitSubItemTemp() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.ajaxLoading = true;
          console.log("Received values of form: ", values);
          Object.assign(this.subItemTemp, values);

          let _addEditSubItemTempApi = "";
          let _params = {};
          if (this.operType == "add") {
            _addEditSubItemTempApi = this.api.addSubItemTempApi;
            _params = Util.delParams(this.subItemTemp, ["name", "type"]);
          } else {
            _addEditSubItemTempApi = this.api.editSubItemTempApi;
            _params = Util.delParams(this.subItemTemp, ["id", "name", "type"]);
          }
          this.$post(_addEditSubItemTempApi, _params)
            .then(response => {
              this.ajaxLoading = false;
              Util.processRes(response, () => {
                this.$message.success(
                  this.operType == "add" ? "添加成功！" : "编辑成功！"
                );
                this.closeModal();
                this.getDataAction(
                  this.tableData.pagination.pageNo,
                  this.tableData.pagination.pageSize
                );
              });
              Util.processError(this, response);
            })
            .catch(res => {
              this.ajaxLoading = false;
              console.log(res);
              // Util.processError(this, res)
            });
        }
      });
    },
    /**
     * 打开详情弹窗
     * @param item
     */
    openDetailModal(item) {
      this.detailVisible = true;
      this.$get(this.api.getSubItemTempDetailApi, { id: item.id })
        .then(response => {
          this.detailLoading = false;
          Util.processRes(response, () => {
            this.subItemTempDetail = response.data;
            this.detailParams.subcontractorId = response.data.id;
            this.getDetailDataAction();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.detailLoading = false;
          console.log(res);
        });
    },
    /**
     * 列表数据请求
     */
    getDetailDataAction(pageNo, pageSize) {
      this.detailParams.current = pageNo;
      this.detailParams.size = pageSize;
      this.$get(this.api.getBindParticInConstrApi, this.detailParams)
        .then(response => {
          this.tableLoading = false;
          Util.processRes(response, () => {
            this.detailTableData.list = response.data.records
              ? response.data.records
              : [];
            this.detailTableData.pagination.total = Number(response.data.total);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.tableLoading = false;
          console.log(res);
        });
    },
    /**
     * 关闭详情弹窗
     */
    closeDetailModal() {
      this.detailVisible = false;
    },
    /**
     * 删除组织信息
     * @param id
     */
    remove(id) {
      this.$confirm({
        title: "删除",
        content: "确定要删除当前分部分项模板吗?",
        okText: "确 认",
        cancelText: "取 消",
        onOk: () => {
          this.$post(this.api.delSubItemTempApi, { id: id })
            .then(response => {
              Util.processRes(response, () => {
                this.$message.success("删除成功！");
                this.getDataAction(
                  this.tableData.pagination.pageNo,
                  this.tableData.pagination.pageSize
                );
              });
              Util.processError(this, response);
            })
            .catch(res => {
              console.log(res);
              // Util.processError(this, res)
            });
        },
        onCancel: () => {}
      });
    },
    /**
     * 停启用参建单位信息
     * @param status  停启用 状态 1=启用 0=停用
     * @param id
     */
    changeSubItemTempStatus(status, id) {
      const TYPE = status ? "启用" : "停用";
      this.$confirm({
        title: TYPE,
        content: `确定要${TYPE}当前分部分项模板吗?`,
        okText: TYPE,
        cancelText: "取 消",
        onOk: () => {
          this.$post(this.api.changeSubItemTempStatusApi, {
            status: status,
            id: id
          })
            .then(response => {
              Util.processRes(response, res => {
                this.$message.success(TYPE + "成功！");
                this.getDataAction(
                  this.tableData.pagination.pageNo,
                  this.tableData.pagination.pageSize
                );
              });
              Util.processError(this, response);
            })
            .catch(res => {
              console.log(res);
            });
        },
        onCancel: () => {}
      });
    },
    goToSubItemDetail(record) {
      this.$router.push({
        name: "SubItemTemplateDetail",
        query: { id: record.id, status: record.status, name: record.name }
      });
    }
  },
  destroyed() {
    window.onresize = "";
  }
};
</script>

<style lang="scss">
</style>
