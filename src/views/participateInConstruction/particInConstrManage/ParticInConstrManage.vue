/**
* @Author: 李晨光
* @Date: 2019/9/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/3
**/
<comment>
  # 组件注释
  参建单位管理
</comment>
<template>
  <div id="ParticInConstrManage">
    <Title/>
    <div class="m-20">
      <a-row :gutter="20">
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-card class="table-area">
            <a-row>
              <a-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24"
                class="flex align-center justify-end"
              >
                <div style="position: relative;width: 100%;max-width: 500px" class="pointer">
                  <a-input
                    readOnly
                    disabled
                    style="position: absolute;z-index: -1;"
                    type="text"
                    placeholder="请选择所属项目部"
                    v-model="projectId"
                  />

                  <a-input-search
                    placeholder="请选择所属项目部"
                    v-model="projectName"
                    readOnly
                    @search="projectVisible = !projectVisible"
                  >
                    <a-button slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-col>
            </a-row>
            <a-divider class="table-divider"></a-divider>
            <a-skeleton active :loading="tableLoading" :paragraph="{rows: 5}">
              <div>
                <a-tabs
                  style="height: 50vh ;"
                  v-model="params.type"
                  @change="getDataAction(1, 10)"
                  tabPosition="left"
                  class="left-line"
                  v-if="particInConstrTypes.length"
                >
                  <a-tab-pane
                    v-for="( particInConstrType) in [{id: undefined, name: '全部'},...particInConstrTypes] "
                    :tab="particInConstrType.name"
                    :key="particInConstrType.id"
                  ></a-tab-pane>
                </a-tabs>
                <div v-if="!particInConstrTypes.length" class="ant-table-placeholder p-b-52">暂无数据</div>
              </div>
            </a-skeleton>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <a-card class="table-area">
            <a-row>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex align-center">
                <div class="flex align-center">
                  <!-- <a-button type="primary" :disabled="(!projectId || (currProject.projectType != '401')) || !(curr_org.type == '4' && curr_org.projectType == '401')" @click="addEditParticInConstr('add')" v-waves>关联参建单位</a-button> -->
                  <a-button
                    type="primary"
                    :disabled="projectId ? false : (curr_org.type == '4' && curr_org.projectType == 401) ? false : true"
                    @click="addEditParticInConstr('add')"
                    v-waves
                  >关联参建单位
                  </a-button>
                </div>
              </a-col>
              <a-col
                :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                :xl="12"
                class="flex align-center justify-end"
              >
                <a-input-group compact class="flex align-center justify-end">
                  <a-input
                    style="width: 50%"
                    v-model="params.search"
                    @input="deb"
                    placeholder="按名称搜索"
                  >
                    <a-button slot="enterButton">Custom</a-button>
                  </a-input>
                  <a-button type="primary" v-waves @click="search">
                    <icon-font type="spm-icon-filesearch"></icon-font>
                    搜 索
                  </a-button>
                </a-input-group>
              </a-col>
            </a-row>
            <a-divider class="table-divider"></a-divider>
            <a-skeleton active :loading="tableLoading" :paragraph="{rows: 5}">
              <div>
                <a-table
                  class="p-b-52"
                  :columns="initColumns"
                  :scroll="{x: 1024}"
                  :pagination="false"
                  :dataSource="tableData.list"
                  :locale="{emptyText: '暂无数据'}"
                  rowKey="id"
                  size="middle"
                >
                  <div
                    slot="type"
                    slot-scope="text"
                  >{{Util.getValueByKey(particInConstrTypes, 'id', 'name', text)}}
                  </div>
                  <template slot="action" slot-scope="text, record, index">
                    <div class="flex">
                      <span
                        title="编辑"
                        class="icon-btn"
                        @click="addEditParticInConstr('edit', record)"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shangyicopy4"/>
                      </span>
                      <span
                        title="查看"
                        class="icon-btn"
                        @click="openDetailModal(record)"
                        v-waves="{ type : 'center' }"
                      >
                        <icon-font type="spm-icon-shangyicopy5"/>
                      </span>
                      <span
                        type="link"
                        :title="record.status ? '停用' : '启用'"
                        class="icon-btn"
                        @click="changeParticInConstrStatus(record.status ? 0 : 1, record.id)"
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
                <!--分页-->
                <Pagination
                  class="page-pagination"
                  :total="tableData.pagination.total"
                  :pageSize="tableData.pagination.pageSize"
                  :current="tableData.pagination.pageNo"
                  @onChange="onChangePage"
                  @onShowSizeChange="onShowSizeChangePage"
                ></Pagination>
              </div>
            </a-skeleton>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <project-org-modal
      v-if="projectVisible"
      :isVisible="projectVisible"
      @closed="projectVisible = false"
      @change="setValue('project',$event)"
    ></project-org-modal>
    <!--新增编辑参建单位弹窗-->
    <a-modal
      title="关联参建单位"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitParticInConstr"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form :form="form">
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                label="参建单位编码"
                :validate-status="formError(form,'num') ? 'error' : ''"
                :help="formError(form,'num') || ''"
              >
                <a-input
                  readOnly
                  disabled
                  type="text"
                  placeholder="参建单位编码"
                  v-decorator="[
                      'num',
                      {rules: [
                        { required: true, message: '参建单位编码！' },
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位"
                :validate-status="formError(form,'pid') ? 'error' : ''"
                :help="formError(form,'pid') || ''"
              >
                <div style="position: relative">
                  <a-input
                    style="position: absolute;z-index: -1;"
                    readOnly
                    :disabled="operType == 'edit'"
                    type="text"
                    v-decorator="[
                      'subcontractorId',
                      {rules: [
                        { required: true, message: '请选择参建单位！' },
                      ]
                    }
                  ]"
                  />
                  <a-input-search
                    placeholder="请选择参建单位"
                    v-model="subcontractorName"
                    readOnly
                    :disabled="operType == 'edit'"
                    @search="contactVisible = !contactVisible"
                  >
                    <a-button :disabled="operType == 'edit'" slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                label="社会统一信用代码"
                :validate-status="formError(form,'certificate') ? 'error' : ''"
                :help="formError(form,'certificate') || ''"
              >
                <a-input
                  readOnly
                  disabled
                  type="text"
                  placeholder="请输入社会统一信用代码"
                  v-decorator="[
                      'certificate',
                      {rules: [
                        { required: true, message: '请输入社会统一信用代码！' },
                        { pattern: Util.Reg7,  message: '请输入18位大写英文字母或数字或其组合!' }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位分类"
                :validate-status="formError(form,'type') ? 'error' : ''"
                :help="formError(form,'type') || ''"
              >
                <a-select
                  notFoundContent="暂无数据"
                  placeholder="请选择参建单位分类"
                  v-decorator="[
                  'type',
                  {rules: [{ required: true, message: '请选择参建单位分类！' }]}
                ]"
                >
                  <a-select-option
                    v-for="( particInConstrType, index ) in particInConstrTypes"
                    :value="particInConstrType.id"
                    :key="index + 'particInConstrType'"
                  >{{ particInConstrType.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="联系人"
                :validate-status="formError(form,'contacts') ? 'error' : ''"
                :help="formError(form,'contacts') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入联系人"
                  v-decorator="[
                      'contacts',
                      {rules: [
                        { required: true, message: '请输入联系人！' },
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="联系电话"
                :validate-status="formError(form,'contactsTel') ? 'error' : ''"
                :help="formError(form,'contactsTel') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入联系电话"
                  v-decorator="[
                      'contactsTel',
                      {rules: [
                        { required: true, message: '请输入联系电话！' },
                        { pattern: Util.tel,  message: '请输入正确的联系电话!' }
                      ]
                    }
                  ]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <contact-modal
            v-if="contactVisible"
            :isVisible="contactVisible"
            @closed="contactVisible = false"
            @change="setValue('contact',$event)"
          ></contact-modal>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          @click="submitParticInConstr"
          :disabled="hasErrors(form.getFieldsError())"
        >确 认
        </a-button>
      </template>
    </a-modal>
    <!--查看参建单位详情-->
    <a-modal v-model="detailVisible" :width="800" title="组织详情" centered>
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位编码"
              >
                <span class="form-value">{{particInConstrDetail.num}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位名称"
              >
                <span class="form-value">{{particInConstrDetail.subcontractorName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="社会统一信用代码"
              >
                <span class="form-value">{{particInConstrDetail.certificate}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位分类"
              >
                <span class="form-value">{{particInConstrDetail['type'] ? Util.getValueByKey(particInConstrTypes,'id','name',particInConstrDetail['type']) : '--'}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="联系人"
              >
                <span class="form-value">{{ particInConstrDetail['contacts'] }}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="联系电话"
              >
                <span class="form-value">{{ particInConstrDetail.contactsTel }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeDetailModal" type="primary">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import Title from "@/Title";
  import Pagination from "@/Pagination";
  import debounce from "lodash.debounce";
  import {mapState} from "vuex";
  import ProjectOrgModal from "@/select/ProjectOrgModal";

  import OrgModal from "@/select/OrgModal";
  import ContactModal from "@/select/ContactModal";

  export default {
    name: "ParticInConstrManage",
    components: {
      Title,
      Pagination,
      "org-modal": OrgModal,
      "contact-modal": ContactModal,
      "project-org-modal": ProjectOrgModal
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          getParticInConstrApi: Util.orgServer + "/web/project-subcontractor/page", // 查询参建单位列表
          getParticInConstrDetailApi: Util.orgServer + "/web/project-subcontractor/detail", // 查询参建单位详情
          delParticInConstrApi: Util.orgServer + "/web/project-subcontracto/delete", // 删除参建单位
          addParticInConstrApi: Util.orgServer + "/web/project-subcontractor/add", // 关联参建单位
          editParticInConstrApi: Util.orgServer + "/web/project-subcontractor/edit", // 关联参建单位
          changeParticInConstrStatusApi: Util.orgServer + "/web/project-subcontractor/status", // 启用、停用参建单位
          getParticInConstrRecordApi: Util.orgServer + "/web/subcontractor/list" // 获取参建单位--下拉选择
        },
        plainOptions: [
          // 列表头部配置选项
          {label: "参建单位编码", value: 0},
          {label: "参建单位名称", value: 1},
          {label: "参建单位分类", value: 2},
          {label: "联系人", value: 3},
          {label: "联系电话", value: 4}
        ],
        operValue: [0, 1, 2, 3, 4], // 列表头部默认配置
        columns: {
          // 列表头部配置表
          0: {
            title: "参建单位编码",
            dataIndex: "num"
          },
          1: {
            title: "参建单位名称",
            dataIndex: "subcontractorName"
          },
          2: {
            title: "参建单位分类",
            dataIndex: "type",
            scopedSlots: {
              customRender: "type"
            }
          },
          3: {
            title: "联系人",
            dataIndex: "contacts"
          },
          4: {
            title: "联系电话",
            dataIndex: "contactsTel"
          },
          5: {
            title: "操作",
            dataIndex: "operation",
            width: 150,
            scopedSlots: {
              filterDropdown: "filterDropdown",
              filterIcon: "operIcon",
              customRender: "action"
            },
            onFilter: (value, record) => {
            },
            onFilterDropdownVisibleChange: visible => {
            }
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
        tableLoading: true, // table loading
        params: {
          //查询请求参数
          search: undefined,
          current: 1,
          size: 10,
          projectId: undefined,
          type: undefined
        },
        projectVisible: false, // 组织弹窗状态
        currProject: {},
        projectId: undefined, // 项目部Id
        projectName: undefined, // 项目部名称
        contactVisible: false, // 参建弹窗状态
        subcontractorId: undefined, // 参建Id
        subcontractorName: undefined, // 参建名称
        particInConstrTypes: [
          {id: 1, name: "建设单位"},
          {id: 2, name: "施工单位"},
          {id: 3, name: "劳务单位"},
          {id: 4, name: "专业分包"},
          {id: 5, name: "其他分包"},
          {id: 6, name: "设计单位"},
          {id: 7, name: "政府部门"},
          {id: 8, name: "监理单位"},
          {id: 9, name: "其他"}
        ], // 参建单位类型
        form: this.$form.createForm(this), // 新增参建单位
        formModalVisible: false, // 新增参建单位弹窗状态
        operType: "add", // 操作类型
        particInConstr: {}, //参建单位信息 -- 编辑用
        particInConstrDetail: {}, // 组织详情  -- 详情显示用
        detailVisible: false, // 详情弹窗状态
        detailLoading: true // 详情loading
      };
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org
      })
    },
    created() {
      this.operChange(this.operValue);
      this.search();
    },
    mounted() {
    },
    watch: {},
    methods: {
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(
        function () {
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
        this.tableData.pagination.pageSize = pageSize;
        this.getDataAction(pageNo, pageSize);
      },
      /**
       * 列表数据请求
       */
      getDataAction(pageNo = 1, pageSize = 10) {
        this.params.projectId = this.projectId
          ? this.projectId
          : this.curr_org.id;
        this.params.current = pageNo;
        this.params.size = pageSize;

        this.$get(this.api.getParticInConstrApi, this.params)
          .then(response => {
            this.tableLoading = false;
            Util.processRes(response, () => {
              this.tableData.list = response.data.records
                ? response.data.records
                : [];
              this.tableData.pagination.total = response.data.total;
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.tableLoading = false;
            console.log(res);
          });
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
      linkStatus() {
        if (this.projectId) {
          return false
        } else {
          if (curr_org.type == '4' && curr_org.projectType == 401) {
            return false
          } else {
            return true
          }
        }
      },

      /**
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true;
        this.$get(this.api.getParticInConstrDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false;
            Util.processRes(response, () => {
              this.particInConstrDetail = response.data;
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.detailLoading = false;
            console.log(res);
          });
      },
      /**
       * 关闭详情弹窗
       */
      closeDetailModal() {
        this.detailVisible = false;
      },
      setValue(type = "", val) {
        console.log(val[0]);
        if (val.length) {
          if (type == "project") {
            this.projectId = val[0].id;
            this.projectName = val[0].name;
            this.currProject = val[0];
            this.getDataAction(1, 10);
          } else if (type == "contact") {
            this.form.setFields({subcontractorId: {value: val[0].id}});
            this.subcontractorId = val[0].id;
            this.subcontractorName = val[0].name;
          } else if (type == "contactEdit") {
            this.form.setFields({
              subcontractorId: {value: val[0].subcontractorId}
            });
            this.subcontractorId = val[0].subcontractorId;
            this.subcontractorName = val[0].subcontractorName;
          }
        } else {
          this.form.setFields({subcontractorId: {value: undefined}});
          this.currProject = {};
          this.projectId = undefined;
          this.projectName = undefined;
        }
      },
      /**
       * 获取参建单位类型
       * @param projectId
       */
      getParticInConstrType(projectId) {
        this.$get(this.api.getParticInConstrDetailApi, {
          projectId: this.projectId
        })
          .then(response => {
            Util.processRes(response, () => {
              this.particInConstrTypes = response.data;
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.detailLoading = false;
            console.log(res);
          });
      },
      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
      },
      /**
       * 新增编辑组织
       * @param type
       * @param data
       */
      addEditParticInConstr(type = "add", item = {}) {
        this.operType = type;
        this.openModal();
        if (item.id) {
          this.$get(this.api.getParticInConstrDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false;
              Util.processRes(response, () => {
                this.particInConstrDetail = response.data;
                this.dealDetail(type, response.data);
              });
              Util.processError(this, response);
            })
            .catch(res => {
              this.detailLoading = false;
            });
        } else {
          this.detailLoading = false;
          this.dealDetail(type);
        }
      },
      // 编辑数据处理回填
      dealDetail(type = "add", data = {}) {
        let _obj = {};
        if (type == "add") {
          this.particInConstr = {
            // 参建单位信息
            projectId: this.projectId ? this.projectId : this.curr_org.id, // 项目id
            subcontractorId: this.subcontractorId, // 参建单位id
            contacts: undefined, // 联系人姓名
            contactsTel: undefined, // 联系人电话
            type: this.params.type // 参建类型类型 1-9种类型
          };
          Object.assign(_obj, this.particInConstr);
        } else {
          Object.assign(this.particInConstr, data);
          _obj = Util.deepCopy(data);
          // form数据回填
          _obj = Util.delParams(_obj, [
            "num",
            "subcontractorId",
            "subcontractorName",
            "contacts",
            "contactsTel",
            "type",
            "certificate"
          ]);
        }
        // 这里是必须要给一个延时器的
        this.$nextTick(() => {
          this.setValue("contactEdit", [data]);
          this.form.setFieldsValue(_obj);
          this.form.validateFields();
        });
      },

      /**
       * 打开弹窗
       */
      openModal() {
        this.formModalVisible = true;
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
      submitParticInConstr() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.particInConstr, values);

            let _addEditParticInConstrApi = "";
            let _params = {};
            if (this.operType == "add") {
              _addEditParticInConstrApi = this.api.addParticInConstrApi;
              _params = {
                projectId: this.projectId ? this.projectId : this.curr_org.id,
                ...Util.delParams(this.particInConstr, [
                  "subcontractorId",
                  "contacts",
                  "contactsTel",
                  "type"
                ])
              };
            } else {
              _addEditParticInConstrApi = this.api.editParticInConstrApi;
              _params = Util.delParams(this.particInConstr, [
                "id",
                "contacts",
                "contactsTel",
                "type"
              ]);
            }
            this.$post(_addEditParticInConstrApi, _params)
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage);
                  this.closeModal();
                  this.search();
                });
                Util.processError(this, response);
              })
              .catch(res => {
                console.log(res);
                // Util.processError(this, res)
              });
          }
        });
      },
      /**
       * 删除组织信息
       * @param id
       */
      remove(id) {
        this.$confirm({
          title: "删除",
          content: "确定要删除当前参建单位吗?",
          okText: "确 认",
          cancelText: "取 消",
          onOk: () => {
            this.$post(this.api.delParticInConstrApi, {id: id})
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage);
                  this.search();
                });
                Util.processError(this, response);
              })
              .catch(res => {
                console.log(res);
                // Util.processError(this, res)
              });
          },
          onCancel: () => {
          }
        });
      },
      /**
       * 停启用参建单位信息
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeParticInConstrStatus(status, id) {
        const TYPE = status ? "启用" : "停用";
        this.$confirm({
          title: TYPE,
          content: `确定要${TYPE}当前参建单位吗?`,
          okText: TYPE,
          cancelText: "取 消",
          onOk: () => {
            this.$post(this.api.changeParticInConstrStatusApi, {
              status: status,
              id: id
            })
              .then(response => {
                Util.processRes(response, res => {
                  this.$message.success(response.statusMessage);
                  this.search();
                });
                Util.processError(this, response);
              })
              .catch(res => {
                console.log(res);
              });
          },
          onCancel: () => {
          }
        });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .left-line.ant-tabs-vertical.ant-tabs-left > .ant-tabs-bar {
    border-left: 1px solid #e8e8e8 !important;
    border-right: 0;
  }

  .left-line .ant-tabs-left-bar .ant-tabs-ink-bar {
    left: 0 !important;
  }

  .left-line .ant-tabs-left-bar .ant-tabs-nav-container {
    margin-left: -1px;
  }

  .left-line .ant-tabs-left-bar .ant-tabs-tab {
    text-align: left !important;
  }
</style>
