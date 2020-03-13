/**
* @Author: 李晨光
* @Date: 2019/8/16
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
  基础组织
</comment>
<template>
  <div id="BaseOrg">
    <Title/>
    <div class="m-20">
      <a-row>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-card class="table-area">
            <a-row>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="18" class="flex  align-center"
                     :class="{'m-b-20': isHSearch}">
                <div class="flex align-center">
                </div>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" class="flex align-center justify-end">
                <a-input-search placeholder="按名称搜索" v-model="params.keyword" @change="deb" @search="search">
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
              </a-col>
            </a-row>
            <transition name="fade">
              <a-form v-show="false" class="filter">
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
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
                  :expandedRowKeys="expandedRowKeys"
                  @expand="expand"
                >
                  <template slot="expandIcon" slot-scope="props">
                    <icon-font type="spm-icon-you"></icon-font>
                  </template>
                  <div slot="status" slot-scope="text">
                    {{text ? '启用' : '停用'}}
                  </div>
                  <div slot="orgType" slot-scope="text">
                    {{Util.getValueByKey(orgTypes, 'dictionaryCode', 'dictionaryName', text) || '--'}}
                  </div>
                  <template slot="action" slot-scope="text, record, index">
                    <div class="flex">
                  <span title="新增组织" class="icon-btn" @click="addEditOrg('add', record)" v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-hebingxingzhuang"/>
                  </span>
                      <span title="删除组织" class="icon-btn" v-if="record.pid != rootId" @click="remove(record.id)"
                            v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-shanchu"/>
                  </span>
                      <span title="查看组织" class="icon-btn" v-if="record.pid == rootId" @click="openDetailModal(record)"
                            v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-shangyicopy5"/>
                  </span>
                      <a-dropdown placement="bottomRight" v-if="record.pid != rootId">
                        <span title="更多" class="icon-btn" v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-copy19"/>
                  </span>
                        <a-menu slot="overlay">
                          <a-menu-item>
                            <a href="javascript:;" @click="openDetailModal(record)">详情</a>
                          </a-menu-item>
                          <a-menu-item v-if="record.pid != '0'">
                            <a href="javascript:;" @click="addEditOrg('edit',record)">编辑</a>
                          </a-menu-item>
                          <a-menu-item>
                            <a href="javascript:;" @click="changeOrgStatus(record.status ? 0 : 1,record.id)">{{
                              record.status ? '停用' : '启用'}}</a>
                          </a-menu-item>
                          <!--<a-menu-item v-if="index">
                            <a href="javascript:;" @click="changeOrgOrd('up',record.id)">上移</a>
                          </a-menu-item>
                          <a-menu-item
                            v-if="(!record.pid || record.pid == null || record.pid == rootId) ? (tableData.list.length - 1 > index) :  (Util.getDataByProps(tableData.list,'id',record.pid).children.length - 1 > index)">
                            <a href="javascript:;" @click="changeOrgOrd('down',record.id)">下移</a>
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
      :title="operType == 'add' ? '新增组织': '编辑组织'"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitOrg"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                label="组织编码"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  readOnly
                  disabled
                  type="text"
                  placeholder="请输入组织编码"
                  v-decorator="[
                      'num',
                      {rules: [
                        { required: true, message: '请输入组织编码！' },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织名称"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入组织名称"
                  allowClear
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入组织名称！' },
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织简称"
                :validate-status="formError(form,'shortName') ? 'error' : ''"
                :help="formError(form,'shortName') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入组织简称"
                  v-decorator="[
                      'shortName',
                      {rules: [
                        { required: true, message: '请输入组织简称！' },
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="!(org.pid == '0' && operType == 'edit')">
              <a-form-item
                label="上级组织"
                :validate-status="formError(form,'pid') ? 'error' : ''"
                :help="formError(form,'pid') || ''"
              >
                <!-- <a-tree-select
                   notFoundContent="暂无数据"
                   treeNodeFilterProp="id"
                   title="name"
                   allowClear
                   :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                   :treeData="orgTree"
                   placeholder='请选择上级组织'
                   v-decorator="[
                     'pid',
                     {rules: [{ required: true, message: '请选择上级组织！'}]}
                   ]"
                 >
                 </a-tree-select>-->

                <div style="position: relative">
                  <a-input
                    style="position: absolute;z-index: -1;"
                    readOnly
                    :disabled="operType == 'add' || true"
                    type="text"
                    v-decorator="[
                      'pid',
                      {rules: [
                        { required: true, message: '请选择上级组织！' },
                      ]
                    }
                  ]"/>
                  <a-input-search placeholder="请选择上级组织" v-model="pName" readOnly :disabled="operType == 'add' || true"
                                  @search="Visible = !Visible">
                    <a-button :disabled="operType == 'add' || true" slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织类型"
                :validate-status="formError(form,'orgType') ? 'error' : ''"
                :help="formError(form,'orgType') || ''"
              >
                <a-select
                  notFoundContent="暂无数据"
                  placeholder="请选择组织类型"
                  v-decorator="[
                  'orgType',
                  {rules: [{ required: false, message: '请选择组织类型！' }]}
                ]">
                  <a-select-option v-for="( orgType, index ) in orgTypes"
                                   :value="orgType.dictionaryCode" :key="index + 'orgType'">{{ orgType.dictionaryName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>

      <org-modal v-if="Visible" :isVisible='Visible' v-model="res" @closed="Visible = false"
                 @change="setValue('change',$event)"></org-modal>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="submitOrg"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model="detailVisible"
             :width="800"
             title="组织详情"
             centered>
      <!--租户基本信息  -->

      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织编码"
              >
                <span class="form-value">{{orgDetail.num}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织名称"
              >
                <span class="form-value">{{orgDetail.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织简称"
              >
                <span class="form-value">{{orgDetail.shortName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="上级组织名称"
              >
                <span class="form-value">{{orgDetail.parentName ? orgDetail.parentName : '--'}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织类型"
              >
                <span class="form-value">{{ Util.getValueByKey(orgTypes, 'dictionaryCode', 'dictionaryName', orgDetail.orgType) || '--' }}</span>
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
  import Title from '@/Title'
  import OrgModal from '@/select/OrgModal'
  import debounce from 'lodash.debounce'
  import {mapState} from 'vuex'

  export default {
    name: 'BaseOrg',
    components: {
      Title,
      'org-modal': OrgModal
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          getOrgTreeApi: Util.orgServer + '/web/org/tree',  // 查询组织列表树
          addOrgApi: Util.orgServer + '/web/org/add', // 新增组织
          editOrgApi: Util.orgServer + '/web/org/edit', // 编辑组织
          delOrgApi: Util.orgServer + '/web/org/delete', // 删除组织
          getOrgDetailApi: Util.orgServer + '/web/org/detail', // 组织详情
          changeOrgStatusApi: Util.orgServer + '/web/org/status', // 启用、停用组织
          changeOrgOrdApi: Util.orgServer + '/web/org/order', // 排序
          getOrgTypesApi: Util.orgServer + '',// 获取组织类型
        },
        isHSearch: false,
        plainOptions: [  // 列表头部配置选项
          {label: '组织编号', value: 0},
          {label: '组织名称', value: 1},
          {label: '组织简称', value: 2},
          {label: '组织类型', value: 3},
          {label: '组织状态', value: 4},
        ],
        operValue: [0, 1, 2, 3, 4],// 列表头部默认配置
        columns: {// 列表头部配置表
          0: {
            title: '组织编号',
            dataIndex: 'num',
          },
          1: {
            title: '组织名称',
            dataIndex: 'name',
          },
          2: {
            title: '组织简称',
            dataIndex: 'shortName',
          },
          3: {
            title: '组织类型',
            dataIndex: 'orgType',
            scopedSlots: {
              customRender: 'orgType'
            },
          },
          4: {
            title: '组织状态',
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
        initColumnsForSelect: [{
          title: '组织编号',
          dataIndex: 'num',
        },
          {
            title: '组织名称',
            dataIndex: 'name',
          },
        ],// 初始化列表头部配置表
        tableData: {  // 列表数据
          list: [],
          init: []
        },
        expandedRowKeys: [],
        org: {}, // 组织信息 -- 编辑用
        pName: undefined,  // 上级组织名称
        orgDetail: {}, // 组织详情  -- 详情显示用
        detailVisible: false, // 详情弹窗状态
        form: this.$form.createForm(this), // 新增组织
        formModalVisible: false,
        orgTree: [], // 组织树结构
        operType: 'add',
        params: { //请求参数
          keyword: undefined,
        },
        tableLoading: true,
        detailLoading: true,
        res: [],
        Visible: false,
        rootId: ''
      }
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org,
        orgTypes: state => state.dicts.ORGANIZATION_TYPE,
      })
    },
    created() {
      this.operChange(this.operValue)
      this.getDataAction()
    },
    mounted() {
    },
    watch: {},
    methods: {
      /*changeHeight: debounce(function () {
          // 搜索方法
          let filterHeight = document.querySelector('.filter') && document.querySelector('.filter').clientHeight
        console.log('111111111111',filterHeight)
          this.tableData.scrollHeigth = document.body.clientHeight - 314 - filterHeight;
          console.log(this.tableData.scrollHeigth)
        }, 1000  // 延迟时间
      ),*/
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
        this.$get(this.api.getOrgTreeApi, this.params)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              if (response.data) {
                this.tableData.init = response.data ? response.data : []
                this.tableData.list = Util.treeSearch(this.params.keyword, 'name', this.tableData.init)
                this.rootId = this.tableData.list[0].pid
                this.expandedRowKeys = Util.getIds(this.tableData.list)

              } else {
                this.tableData.init = response.data ? response.data : []
                this.tableData.list = Util.deepCopy(this.tableData.init)
              }

            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
            console.log(res)
            // Util.processError(this, res)
          })
      },
      expand(e, item) {
        e = !e
        if (e) {
          this.expandedRowKeys.splice(this.expandedRowKeys.findIndex(i => i == item.id), 1)
        } else {
          this.expandedRowKeys.push(item.id)
        }
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
       * 新增编辑组织
       * @param type
       * @param data
       */
      addEditOrg(type = 'add', item = {}) {
        this.operType = type
        this.openModal()
        if (item.id) {
          this.$get(this.api.getOrgDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.orgDetail = response.data
                this.pName = response.data.parentName
                this.dealDetail(type, response.data)
              })
              Util.processError(this, response)
            })
            .catch(res => {
              this.detailLoading = false
              // Util.processError(this, res)
            })
        } else {
          this.detailLoading = false
          this.dealDetail(type)
        }


      },
      // 编辑数据处理回填
      dealDetail(type = 'add', data = {}) {
        let _obj = {}
        if (type == 'add') {
          this.org = { // 组织信息
            name: '',  // 组织名称
            shortName: '', // 组织简称
            pid: data.id, // 上级组织id
            status: data.status,
            type: undefined, // 组织类型
          }
          Object.assign(_obj, this.org)
          this.setValue('add', [data])
        } else {
          Object.assign(this.org, data)
          _obj = Util.deepCopy(data)
          // 处理多余参数
          _obj = Util.delParams(_obj, ['num', 'pid', 'name', 'shortName', 'orgType'])
          this.setValue('edit', [data])
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
        this.pName = undefined
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
      submitOrg() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.org, values)

            let _addEditOrgApi = ''
            let _params = {}
            if (this.operType == 'add') {
              _addEditOrgApi = this.api.addOrgApi
              _params = Util.delParams(this.org, ['name', 'shortName', 'pid', 'orgType', 'status'])
            } else {
              _addEditOrgApi = this.api.editOrgApi
              _params = Util.delParams(this.org, ['id', 'name', 'shortName', 'pid', 'orgType', 'status'])
            }
            this.$post(_addEditOrgApi, _params)
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
       * 删除组织信息
       * @param id
       */
      remove(id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前组织吗?',
          okText: '确 认',
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.delOrgApi, {id: id})
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
       * 停启用组织信息
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeOrgStatus(status, id) {
        const TYPE = status ? '启用' : '停用'
        this.$confirm({
          title: TYPE,
          content: `确定要${ TYPE }当前组织吗?`,
          okText: TYPE,
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.changeOrgStatusApi, {status: status, id: id})
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
      changeOrgOrd(type, id) {
        this.$post(this.api.changeOrgOrdApi, {type: type, id: id})
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
       * form---pid 数据回填
       * @param val
       */
      setValue(type, val) {
        if (val.length) {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'pid': {value: val[0].id}})
            this.pName = val[0].name
          } else if (type == 'edit') {
            this.form.setFields({'pid': {value: val[0].pid}})
            this.pName = val[0].parentName
          }
        } else {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'pid': {value: undefined}})
            this.pName = undefined
          } else if (type == 'edit') {
            this.form.setFields({'pid': {value: undefined}})
            this.pName = undefined
          }
        }
      },
      /**
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true
        this.$get(this.api.getOrgDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.orgDetail = response.data

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
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #BaseOrg {
    height: 100%;
    /*overflow: hidden;*/
  }
</style>
