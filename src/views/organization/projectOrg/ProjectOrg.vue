/**
* @Author: 李晨光
* @Date: 2019/9/5
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/5
**/
<comment>
  # 组件注释
  项目部--组织
</comment>
<template>
  <div id="ProjectOrg">
    <Title/>
    <div class="m-20">
      <a-row>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card class="table-area">
            <a-row>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="18" class="flex  align-center">
                <div class="flex align-center">
                  <a-button type="primary" @click="addEditProjectOrg('add', 'command')" v-waves>新增指挥部</a-button>
                  <a-button class="m-l-10" type="primary" @click="addEditProjectOrg('add', 'project')" v-waves>新增项目部
                  </a-button>
                </div>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" class="flex align-center justify-end">
                <a-input-search placeholder="按名称搜索" v-model="params.keyword" @change="deb" @search="search"
                                :class="{'m-b-10': isHSearch}">
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
              </a-col>
            </a-row>
            <transition name="fade">
              <a-form v-show="isHSearch" layout="vertical" class="isHSearch">
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                    <a-form-item
                      label="组织状态"
                    >
                      <a-select
                        notFoundContent="暂无数据"
                        placeholder="请选择组织状态"
                        v-model="params.status">
                        <a-select-option v-for="( orgType, index ) in orgTypes"
                                         :value="orgType.id" :key="index + 'orgType'">{{ orgType.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>

              </a-form>
            </transition>
            <a-divider style="margin-left:-20px;width: calc(100% + 40px);"></a-divider>
            <a-skeleton active :loading="tableLoading" :paragraph="{rows: 5}">
              <div>
                <a-table
                  :columns="initColumns"
                  :scroll="{x: 1024}"
                  :pagination="false"
                  :dataSource="tableData.list"
                  :locale="{emptyText: '暂无数据'}"
                  rowKey="id"
                  size="middle"
                  :defaultExpandedRowKeys="expandedRowKeys"
                >
                  <div slot="status" slot-scope="text">
                    {{text ? '启用' : '停用'}}
                  </div>
                  <template slot="action" slot-scope="text, record, index">
                    <div class="flex">
                      <span title="关联项目部" v-if="record.projectType == '402'" class="icon-btn"
                            @click="getProjectOrgMsg(record)"
                            v-waves="{ type : 'center' }">
                        <a-icon type="link"/>
                      </span>
                      <span title="编辑" v-if="record.projectType == '401'" class="icon-btn"
                            @click="addEditProjectOrg('edit',record.projectType == 401 ? '' : 'command',record)"
                                v-waves="{ type : 'center' }">
                        <icon-font type="spm-icon-shangyicopy4"/>
                      </span>
                      <span title="详情" class="icon-btn" @click="openDetailModal(record)" v-waves="{ type : 'center' }">
                        <icon-font type="spm-icon-shangyicopy5"/>
                      </span>
                          <a-dropdown placement="bottomRight">
                      <span title="更多" class="icon-btn" v-waves="{ type : 'center' }">
                        <icon-font type="spm-icon-copy19"/>
                      </span>
                        <a-menu slot="overlay">
                          <a-menu-item>
                            <a href="javascript:;" @click="remove(record.id)">删除</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a href="javascript:;"
                               @click="addEditProjectOrg('edit',record.projectType == 401 ? '' : 'command',record)">编辑</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a href="javascript:;" @click="changeProjectOrgStatus(record.status ? 0 : 1,record.id)">{{
                              record.status ? '停用' : '启用'}}</a>
                          </a-menu-item>
                          <!--<a-menu-item v-if="index">
                            <a href="javascript:;" @click="changeProjectOrgOrd('up',record.id)">上移</a>
                          </a-menu-item>
                          <a-menu-item
                            v-if="(!record.orgId || record.orgId == null || record.orgId == '0') ? (tableData.list.length - 1 > index) :  (Util.getDataByProps(tableData.list,'id',record.orgId).children.length - 1 > index)">
                            <a href="javascript:;" @click="changeProjectOrgOrd('down',record.id)">下移</a>
                          </a-menu-item>-->
                        </a-menu>
                      </a-dropdown>
                    </div>
                  </template>
                  <div slot="filterDropdown"
                       slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                       class='custom-filter-dropdown'>
                    <a-checkbox-group :options="plainOptions" v-model="operValue" @change="operChange"/>
                  </div>
                  <icon-font slot="operIcon"
                             slot-scope="filtered"
                             type='spm-icon-setting'
                             :style="{ color: filtered ? '#111' : undefined }"
                             style="border-left:1px solid #ddd;};"/>
                </a-table>
              </div>
            </a-skeleton>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <!--新增编辑组织弹窗-->
    <a-modal
      :title="( operType == 'add' ? '新增': '编辑' ) + ( (type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' ) "
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitProjectOrg"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                :label="`${ (type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }编码`"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  readOnly
                  disabled
                  type="text"
                  :placeholder="`请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }编码`"
                  v-decorator="[
                      'num',
                      {rules: [
                        { required: true, message: `请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }编码!` },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="type == 'command'">
              <a-form-item
                label="指挥部类型"
                :validate-status="formError(form,'areaType') ? 'error' : ''"
                :help="formError(form,'areaType') || ''"
              >
                <a-radio-group name="radioGroup" v-decorator="[
                      'areaType',
                      {rules: [
                        { required: true, message: '请选择指挥部类型！' },
                      ]
                    }
                  ]">
                  <a-radio :value="1">
                    项目指挥部
                  </a-radio>
                  <a-radio :value="2">
                    地区指挥部
                  </a-radio>
                </a-radio-group>

              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                :label="`${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }名称`"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  :placeholder="`请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }名称`"
                  allowClear
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: `请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' } 名称！` },
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                :label="`${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }简称`"
                :validate-status="formError(form,'shortName') ? 'error' : ''"
                :help="formError(form,'shortName') || ''"
              >
                <a-input
                  type="text"
                  :placeholder="`请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }简称`"
                  v-decorator="[
                      'shortName',
                      {rules: [
                        { required: true, message: `请输入${(type == 'command' || projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }简称！`},
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <!--    <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="type == 'project' && false">
                  <a-form-item
                    label="所属指挥部"
                    :validate-status="formError(form,'orgId') ? 'error' : ''"
                    :help="formError(form,'orgId') || ''"

                  >
                    <div style="position: relative">
                      <a-input
                        style="position: absolute;z-index: -1;"
                        readOnly
                        type="text"
                        v-decorator="[
                          'orgId',
                          {rules: [
                            { required: true, message: '请选择所属指挥部！' },
                          ]
                        }
                      ]"/>
                      <a-input
                        @click="Visible = !Visible"
                        readOnly
                        placeholder="请选择所属指挥部"
                        type="text"
                        v-model="pName"
                      />
                    </div>
                  </a-form-item>
                </a-col>-->
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="所属组织"
                :validate-status="formError(form,'orgId') ? 'error' : ''"
                :help="formError(form,'orgId') || ''"

              >
                <div style="position: relative">
                  <a-input
                    style="position: absolute;z-index: -1;"
                    readOnly
                    :disabled="operType == 'edit'"
                    type="text"
                    v-decorator="[
                      'orgId',
                      {rules: [
                        { required: true, message: '请选择所属组织！' },
                      ]
                    }
                  ]"/>
                  <a-input-search
                    placeholder="请选择所属组织"
                    v-model="orgName"
                    readOnly
                    :disabled="operType == 'edit'"
                    @search="Visible = !Visible">
                    <a-button :disabled="operType == 'edit'" slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>

      <org-modal v-if="Visible" :isVisible='Visible' v-model="res" @closed="Visible = false"
                 @change="setOrgValue('change', $event)"></org-modal>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="submitProjectOrg"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model="detailVisible"
             :width="500"
             title="项目部详情"
             centered>
      <!--租户基本信息  -->
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                :label="`${(projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }编码`"
              >
                <span class="form-value">{{projectOrgDetail.num}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                :label="`${(projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }名称`"
              >
                <span class="form-value">{{projectOrgDetail.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                :label="`${(projectOrgDetail.projectType == 402) ? '指挥部' : '项目部' }简称`"
              >
                <span class="form-value">{{projectOrgDetail.shortName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="所属组织"
              >
                <span class="form-value">{{projectOrgDetail.parentName ? projectOrgDetail.parentName : '--'}}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeDetailModal" type="primary">关闭</a-button>
      </template>
    </a-modal>
    <project-org-modal mutiple v-if="projectOrgVisible" :isVisible='projectOrgVisible' :dataType="dataType"
                       v-model="res"
                       :disabled="disabled"
                       @closed="projectOrgVisible = false"
                       @change="setValue"></project-org-modal>
  </div>
</template>

<script>
  import Title from '@/Title'
  import OrgModal from '@/select/OrgModal'
  import ProjectOrgModal from '@/select/ProjectOrgModal'
  import debounce from 'lodash.debounce'
  import {mapState} from 'vuex'

  export default {
    name: 'ProjectOrg',
    components: {
      Title,
      'org-modal': OrgModal,
      'project-org-modal': ProjectOrgModal
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          getProjectOrgTreeApi: Util.orgServer + '/web/project/tree',  // 查询项目部列表树
          addProjectOrgApi: Util.orgServer + '/web/project/add', // 新增项目部
          editProjectOrgApi: Util.orgServer + '/web/project/edit', // 编辑项目部
          delProjectOrgApi: Util.orgServer + '/web/project/delete', // 删除项目部
          getProjectOrgDetailApi: Util.orgServer + '/web/project/detail', // 项目部详情
          changeProjectOrgStatusApi: Util.orgServer + '/web/project/status', // 启用、停用项目部
          changeProjectOrgOrdApi: Util.orgServer + '/web/project/order', // 排序
          bindProjectOrgApi: Util.orgServer + '/web/project/relation',// 项目指挥部关联项目部
          unbindProjectOrgApi: Util.orgServer + '/web/project/remove',// 项目指挥部移除项目部
        },
        isHSearch: false,
        plainOptions: [  // 列表头部配置选项
          {label: '项目部编码', value: 0},
          {label: '项目部名称', value: 1},
          {label: '项目部简称', value: 2},
          {label: '所属组织', value: 3},
          {label: '项目部状态', value: 4},
        ],
        operValue: [0, 1, 2, 3, 4],// 列表头部默认配置
        columns: {// 列表头部配置表
          0: {
            title: '项目部编码',
            dataIndex: 'num',
          },
          1: {
            title: '项目部名称',
            dataIndex: 'name',
          },
          2: {
            title: '项目部简称',
            dataIndex: 'shortName',
          },
          3: {
            title: '所属组织',
            dataIndex: 'parentName',
          },
          4: {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status'
            },
          },
          5: {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'operIcon',
              customRender: 'action'
            },
            onFilter: (value, record) => {
            },
            onFilterDropdownVisibleChange: (visible) => {
            },
          }
        },
        initColumns: [],// 初始化列表头部配置表
        tableData: {  // 列表数据
          list: [],
          init: []
        },
        expandedRowKeys: [],
        projectOrg: {}, // 组织信息 -- 编辑用
        orgName: undefined,  // 上级组织名称
        projectOrgDetail: {}, // 组织详情  -- 详情显示用
        detailVisible: false, // 详情弹窗状态
        form: this.$form.createForm(this), // 新增组织
        formModalVisible: false,
        operType: 'add',
        type: 'command',
        orgTypes: [{
          id: 1, name: '类型1',
        },
          {
            id: 2, name: '类型2'
          }],
        params: { //请求参数
          keyword: undefined,
          status: undefined
        },
        tableLoading: true,
        detailLoading: true,
        res: [],
        Visible: false,
        projectOrgVisible: false,
        rootId: '',
        dataType: 'command',
        disabled: []
      }
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org,
      })
    },
    created() {
      this.operChange(this.operValue)
      this.search()
    },
    mounted() {
    },
    watch: {},
    methods: {
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(function () {
          // 搜索方法
          this.search()
        }, 300  // 延迟时间
      ),
      /**
       * 搜索
       */
      search() {
        this.getDataAction()
      },

      /**
       * 列表数据请求
       */
      getDataAction() {
        this.$get(this.api.getProjectOrgTreeApi, this.params)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              this.tableData.init = response.data ? response.data : []
              this.tableData.list = Util.treeSearch(this.params.keyword, 'name', this.tableData.init)
              this.rootId = this.tableData.list[0].pid
              this.expandedRowKeys = Util.getIds(this.tableData.list)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
            console.log(res)
            // Util.processError(this, res)
          })
      },

      /**
       * 配置table表头
       */
      operChange(checkedValues) {
        let columns = []
        let oper = {
          title: '操作',
          dataIndex: 'operation',
          width: 150,
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'operIcon',
            customRender: 'action'
          }
        }
        checkedValues.length && checkedValues.forEach(checked => {
          columns.push(this.columns[checked])
        })
        columns.push(oper)
        this.initColumns = columns
      },
      /**
       * 新增编辑项目部
       * @param type
       * @param data
       */
      addEditProjectOrg(operType = 'add', type = 'command', item = {}) {
        this.operType = operType
        this.type = type
        this.openModal()
        if (item.id) {
          this.$get(this.api.getProjectOrgDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.orgDetail = response.data
                this.orgName = response.data.parentName
                this.dealDetail(operType, type, response.data)
              })
              Util.processError(this, response)
            })
            .catch(res => {
              this.detailLoading = false
              // Util.processError(this, res)
            })
        } else {
          this.detailLoading = false
          this.dealDetail(operType, type)
        }


      },
      // 编辑数据处理回填
      dealDetail(operType = 'add', type, data = {}) {
        let _obj = {}
        if (operType == 'add') {
          this.projectOrg = { // 组织信息
            name: '',  // 组织名称
            shortName: '', // 组织简称
            orgId: this.curr_org.id, // 上级组织id
            projectType: type == 'command' ? '402' : '401', // 项目部类型 401=普通项目 402=指挥部
            areaType: 1 // 指挥部类型  1=项目指挥部 2=地区指挥部
          }
          Object.assign(_obj, this.projectOrg)
          this.setOrgValue('add', [this.curr_org])
        } else {
          Object.assign(this.projectOrg, data)
          _obj = Util.deepCopy(data)
          // 处理参数
          _obj = Util.delParams(_obj, ['num', 'orgId', 'name', 'shortName', 'projectType', 'areaType'])
          this.setOrgValue('edit', [data])
        }
        // form数据回填
        this.$nextTick(() => {

          this.form.setFieldsValue(_obj)
          this.form.validateFields()
        })
      },
      /**
       * 打开弹窗
       */
      openModal() {
        this.formModalVisible = true
      },
      /**
       * 关闭弹窗
       */
      closeModal() {
        this.formModalVisible = false
        this.form.resetFields()
        this.orgName = undefined
      },
      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      /**
       * 提交信息
       */
      submitProjectOrg() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.projectOrg, values)

            let _addEditProjectOrgApi = ''
            let _params = {}
            let filter = []
            if (this.type == 'command') {
              filter = ['orgId', 'name', 'shortName', 'projectType', 'areaType']
            } else {
              filter = ['orgId', 'name', 'shortName', 'projectType']
            }
            if (this.operType == 'add') {
              _addEditProjectOrgApi = this.api.addProjectOrgApi
              _params = Util.delParams(this.projectOrg, filter)
            } else {
              _addEditProjectOrgApi = this.api.editProjectOrgApi
              _params = Util.delParams(this.projectOrg, ['id', ...filter])
            }
            this.$post(_addEditProjectOrgApi, _params)
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.closeModal()
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
                // Util.processError(this, res)
              })
          }
        })
      },
      /**
       * 删除项目部
       * @param id
       */
      remove(id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前项目部吗?',
          okText: '确 认',
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.delProjectOrgApi, {id: id})
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
                // Util.processError(this, res)
              })
          },
          onCancel: () => {
          }
        })
      },
      /**
       * 停启用项目部
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeProjectOrgStatus(status, id) {
        const TYPE = status ? '启用' : '停用'
        this.$confirm({
          title: TYPE,
          content: `确定要${ TYPE }当前项目部吗?`,
          okText: TYPE,
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.changeProjectOrgStatusApi, {status: status, id: id})
              .then(response => {
                Util.processRes(response, (res) => {
                  this.$message.success(response.statusMessage)
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
                // Util.processError(this, res)
              })
          },
          onCancel: () => {
          }
        })
      },
      /**
       * 排序
       * @param type
       * @param id
       */
      changeProjectOrgOrd(type, id) {
        this.$post(this.api.changeProjectOrgOrdApi, {type: type, id: id})
          .then(response => {
            Util.processRes(response, (res) => {
              this.$message.success(response.statusMessage)
              this.search()
            })
            Util.processError(this, response)
          })
          .catch(res => {
            console.log(res)
            // Util.processError(this, res)
          })
      },
      /**
       * form---orgId 数据回填
       * @param val
       */
      setOrgValue(type, val) {
        if (val.length) {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'orgId': {value: val[0].id}})
            this.orgName = val[0].name
          } else if (type == 'edit') {
            this.form.setFields({'orgId': {value: val[0].pid}})
            this.orgName = val[0].parentName
          }
        } else {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'orgId': {value: undefined}})
            this.orgName = undefined
          } else if (type == 'edit') {
            this.form.setFields({'orgId': {value: undefined}})
            this.orgName = undefined
          }
        }
      },
      setValue(val) {

        this.bindProjectOrg(val[0])
      },
      /**
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true
        this.$get(this.api.getProjectOrgDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.projectOrgDetail = response.data

            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
            // Util.processError(this, res)
          })
      },
      /**
       * 关闭详情弹窗
       */
      closeDetailModal() {
        this.detailVisible = false
      },
      getProjectOrgMsg(item) {
        this.projectOrgVisible = true
        this.projectOrg = item
        this.disabled = [item.id]
        if(item.areaType == 1) {
          this.dataType = 'project'
        }else if(item.areaType == 2){
          this.dataType = 'command'
        }
      },
      /**
       * 项目指挥部关联项目
       * @param item
       */
      bindProjectOrg(item) {
        this.$post(this.api.bindProjectOrgApi, {orgId: this.projectOrg.id, projectId: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.search()
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
            // Util.processError(this, res)
          })

      },
      /**
       * 移除项目指挥部关联项目
       * @param item
       */
      unbindProjectOrg(item) {
        this.$post(this.api.unbindProjectOrgApi, {orgId: item.id, projectId: []})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {

            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
            // Util.processError(this, res)
          })

      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #ProjectOrg {
    height: 100%;
    /*overflow: hidden;*/
    .isHSearch {
      .ant-form-item {
        margin-bottom: 0;
      }
      .ant-form-vertical .ant-form-item {
        padding-bottom: 0;
      }
    }
  }

</style>
