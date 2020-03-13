/**
* @Author: 李晨光
* @Date: 2019/8/16
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
  部门管理
</comment>
<template>
  <div id="Department">
    <Title/>
    <a-row class="m-20">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card class="table-area">
          <a-row>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="18" class="flex align-center"
                   :class="{'m-b-20': isHSearch}">
              <div class="flex align-center">
                <a-button type="primary" v-waves @click="addEditDept('add',true)">
                  新 增
                </a-button>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="6" class="flex align-center justify-end">
              <a-input-search placeholder="按名称搜索" v-model="params.keyword" @change="deb" @search="search">
                <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
              </a-input-search>
            </a-col>
          </a-row>
          <a-divider style="margin-left:-20px;width: calc(100% + 20px);"></a-divider>
          <a-skeleton active :loading="tableLoading" :paragraph="{rows: 15}">
            <a-table
              :scroll="{x: 1024}"
              :columns="initColumns"
              :pagination="false"
              :dataSource="tableData.list"
              :locale="{emptyText: '暂无数据'}"
              rowKey="id"
              size="middle"
              :expandedRowKeys="expandedRowKeys"
              @expand="expand">
              <div slot="status" slot-scope="text">
                {{text ? '启用' : '停用'}}
              </div>
              <div slot="deptType" slot-scope="text">
                {{Util.getValueByKey(deptTypes, 'dictionaryCode', 'dictionaryName', text) || '--'}}
              </div>
              <template slot="action" slot-scope="text, record, index">
                <div class="flex">
                  <span title="新增部门" class="icon-btn" @click="addEditDept('add', false, record)"
                        v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-hebingxingzhuang"/>
                  </span>
                  <span title="删除部门" class="icon-btn" @click="remove(record.id)" v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-shanchu"/>
                  </span>
                  <a-dropdown placement="bottomRight">
                  <span class="icon-btn" v-waves="{ type : 'center' }">
                    <icon-font type="spm-icon-copy19"/>
                  </span>
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a href="javascript:;" @click="openDetailModal(record)">详情</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="addEditDept('edit', false ,record)">编辑</a>
                      </a-menu-item>
                      <a-menu-item>
                        <a href="javascript:;" @click="changeDeptStatus(record.status ? 0 : 1,record.id)">{{
                          record.status ? '停用' : '启用'}}</a>
                      </a-menu-item>
                      <!--<a-menu-item v-if="index">
                        <a href="javascript:;" @click="changeDeptOrd('up',record.id)">上移</a>
                      </a-menu-item>
                      <a-menu-item
                        v-if="(!record.pid || record.pid == null || record.pid == rootId) ? (tableData.list.length - 1 > index) :  (Util.getDataByProps(tableData.list,'id',record.pid).children.length - 1 > index)">
                        <a href="javascript:;" @click="changeDeptOrd('down',record.id)">下移</a>
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
          </a-skeleton>
        </a-card>
      </a-col>
    </a-row>
    <!--新增编辑部门弹窗-->
    <a-modal
      :title="operType == 'add' ? '新增部门': '编辑部门'"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitDept"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 5}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                label="部门编码"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  readOnly
                  disabled
                  type="text"
                  placeholder="请输入部门编码"
                  v-decorator="[
                      'num',
                      {rules: [
                        { required: true, message: '请输入部门编码！' },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门名称"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入部门名称"
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入部门简称！' },
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门简称"
                :validate-status="formError(form,'shortName') ? 'error' : ''"
                :help="formError(form,'shortName') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入部门简称"
                  v-decorator="[
                      'shortName',
                      {rules: [
                        { required: true, message: '请输入部门简称！' },
                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="!isAddRoot">
              <a-form-item
                label="上级部门"
                :validate-status="formError(form,'pid') ? 'error' : ''"
                :help="formError(form,'pid') || ''"
              >
                <div style="position: relative" class="pointer">
                  <a-input
                    readOnly
                    style="position: absolute;z-index: -1;"
                    type="text"
                    placeholder="请选择上级部门"
                    v-decorator="[
                      'pid',
                      {rules: [
                        { required: true, message: '请选择上级部门！' },
                      ]
                    }
                  ]"/>
                  <a-input-search
                    placeholder="请选择上级部门"
                    v-model="pName"
                    readOnly
                    @search="deptVisible = !deptVisible">
                    <a-button slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门类型"
                :validate-status="formError(form,'type') ? 'error' : ''"
                :help="formError(form,'type') || ''"
              >
                <a-select
                  notFoundContent="暂无数据"
                  placeholder="请选择部门类型"
                  v-decorator="[
                  'type',
                  {rules: [{ required: false, message: '请选择部门类型！' }]}
                ]">
                  <a-select-option v-for="( deptType, index ) in deptTypes"
                                   :value="deptType.dictionaryCode" :key="index + 'dept'">{{ deptType.dictionaryName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门主管"
                :validate-status="formError(form,'bossId') ? 'error' : ''"
                :help="formError(form,'bossId') || ''"
              >
                <div style="position: relative" class="pointer">
                  <a-input
                    readOnly
                    style="position: absolute;z-index: -1;"
                    type="text"
                    placeholder="请选择部门主管"
                    v-decorator="[
                      'bossId',
                      {rules: [
                        { required: false, message: '请选择部门主管！' },
                      ]
                    }
                  ]"/>
                  <a-input-search
                    placeholder="请选择部门主管"
                    v-model="bossName"
                    readOnly
                    @search="userVisible = !userVisible">
                    <a-button slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="所属组织"
                :validate-status="formError(form,'orgId') ? 'error' : ''"
                :help="formError(form,'orgId') || ''"
              >
                <div style="position: relative" class="pointer">
                  <a-input
                    readOnly
                    disabled
                    style="position: absolute;z-index: -1;"
                    type="text"
                    placeholder="请选择所属组织"
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
                    disabled
                    readOnly
                    @search="orgVisible = !orgVisible">
                    <a-button slot="enterButton" disabled>选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>

      <dept-modal v-if="deptVisible" :isVisible='deptVisible' @closed="deptVisible = false"
                  @change="setDeptValue"></dept-modal>
      <org-modal v-if="orgVisible" :isVisible='orgVisible' @closed="orgVisible = false"
                 @change="setOrgValue('change', $event)"></org-modal>
      <user-modal v-if="userVisible" :isVisible='userVisible' :multiple='false'
                  @closed="userVisible = false"
                  @change="setBossValue('change', $event)"></user-modal>
      <template slot="footer">
        <a-button key="back" @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="submitDept"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
    <a-modal v-model="detailVisible"
             :width="800"
             title="部门详情"
             centered>
      <!--租户基本信息  -->
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 5}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" v-if="operType == 'edit'">
              <a-form-item
                label="部门编码"
              >
                <span class="form-value">{{deptDetail.num}}</span>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门名称"
              >
                <span class="form-value">{{deptDetail.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门简称"
              >
                <span class="form-value">{{deptDetail.shortName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="上级部门"
              >
                <span
                  class="form-value"
                >{{deptDetail.parentName ? deptDetail.parentName : '--' }}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门类型"
              >
                <span
                  class="form-value"
                >{{Util.getValueByKey(deptTypes, 'dictionaryCode', 'dictionaryName', deptDetail.type) || '--'}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="部门主管"
              >
                <span
                  class="form-value"
                >{{deptDetail.bossName ? deptDetail.bossName : '--'}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="所属组织"
              >
                <span
                  class="form-value"
                >{{deptDetail.orgName ? deptDetail.orgName : '--'}}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeDetailModal" type="primary" v-waves>关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/Title'
  import debounce from 'lodash.debounce'
  import DeptModal from '@/select/DeptModal'
  import OrgModal from '@/select/OrgModal'
  import UserModal from '@/select/UserModal'
  import {mapState} from 'vuex'

  export default {
    name: 'Department',
    components: {
      Title,
      'dept-modal': DeptModal,
      'org-modal': OrgModal,
      'user-modal': UserModal
    },
    props: {},
    data() {
      return {
        api: {
          getDeptTreeApi: Util.orgServer + '/web/dept/tree',  // 查询部门列表树
          addDeptApi: Util.orgServer + '/web/dept/add', // 新增部门
          editDeptApi: Util.orgServer + '/web/dept/edit', // 编辑部门
          delDeptApi: Util.orgServer + '/web/dept/delete', // 删除部门
          getDeptDetailApi: Util.orgServer + '/web/dept/detail', // 部门详情
          changeDeptStatusApi: Util.orgServer + '/web/dept/status', // 启用、停用部门
          changeDeptOrdApi: Util.orgServer + '/web/dept/order', // 排序
          getDeptTypesApi: Util.orgServer + '', // 获取部门类型
        },
        // eee: [{id: "265bb6d5d2124f758907025bcb56a98e", name: "张三8888"}],
        Util,
        isHSearch: false,
        plainOptions: [  // 列表头部配置选项
          {label: '部门编号', value: 0},
          {label: '部门名称', value: 1},
          {label: '部门简称', value: 2},
          {label: '部门类型', value: 3},
          {label: '状态', value: 4},
        ],
        operValue: [0, 1, 2, 3, 4], // 列表头部默认配置
        columns: {  // 列表头部配置表
          0: {
            title: '部门编号',
            dataIndex: 'num',
            width: 80,
          },
          1: {
            title: '部门名称',
            dataIndex: 'name',
            width: 200,
          },
          2: {
            title: '部门简称',
            dataIndex: 'shortName',
            width: 150,
          },
          3: {
            title: '部门类型',
            dataIndex: 'type',
            width: 100,
            scopedSlots: {
              customRender: 'deptType'
            },
          },
          4: {
            title: '状态',
            dataIndex: 'status',
            width: 100,
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
        deptDetail: {}, // 部门详情 -- 显示用
        detailVisible: false, // 详情显示状态
        form: this.$form.createForm(this), // 新增部门
        dept: {}, // 部门信息 -- 编辑用
        pName: undefined, // 上级部门名称
        bossName: undefined,// 主管名称
        orgName: undefined,// 所属组织名称
        formModalVisible: false, // 新增编辑弹窗显示状态
        deptTree: [], // 部门树结构
        operType: 'add', // 操作类型   add 新增   edit 编辑
        params: { //查询请求参数
          // keyword: '',
        },
        tableLoading: true,
        detailLoading: true,
        isAddRoot: true,
        deptVisible: false, // 选择部门弹窗显示状态
        orgVisible: false,// 选择组织弹窗显示状态
        userVisible: false,// 选择人员弹窗显示状态
        res: [],
        rootId: ''
      }
    },

    computed: {
      ...mapState({
        curr_org: state => state.curr_org,
        deptTypes: state => state.dicts.DEPARTMENT_TYPE,
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
      getDataAction(callback) {
        this.$get(this.api.getDeptTreeApi, this.params)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              if (response.data) {
                this.tableData.init = response.data ? response.data : []
                this.tableData.list = Util.treeSearch(this.params.keyword, 'name', this.tableData.init)
                this.rootId = this.tableData.list.length ? this.tableData.list[0].pid : undefined
                this.expandedRowKeys = Util.getIds(this.tableData.list)
              } else {
                this.tableData.init = []
                this.tableData.list = []
              }
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
            Util.processError(this, res)
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
       * 新增编辑部门
       * @param type
       * @param data
       */
      addEditDept(type = 'add', root = true, item = {}) {
        this.operType = type
        this.isAddRoot = root
        this.openModal()
        if (item.id) {
          this.$get(this.api.getDeptDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.deptDetail = response.data
                this.pName = response.data.parentName
                this.bossName = response.data.bossName
                // this.bossId = response.data.bossId
                this.orgName = response.data.orgName
                // this.eee = [{id: response.data.bossId, name: '111'}]
                this.dealDetail(root, type, response.data)
              })
              Util.processError(this, response)
            })
            .catch(res => {
              this.detailLoading = false
              Util.processError(this, res)
            })
        } else {
          this.detailLoading = false
          this.dealDetail(root, type)
        }
      },
      // 编辑数据处理回填
      dealDetail(root, type, data = {}) {
        let _obj = {}
        if (root) {
          if (type == 'add') {
            this.dept = { // 部门信息
              name: undefined,  // 部门名称
              shortName: undefined, // 部门简称
              pid: '0',
              status: 1,
              type: undefined, // 部门类型
              orgId: this.curr_org.id
            }
            Object.assign(_obj, this.dept)
            this.setOrgValue('add', [Util.delParams(this.curr_org, ['id', 'name'])])
          } else {
            Object.assign(this.dept, data)
            _obj = Util.deepCopy(data)
            // 处理多余参数
            _obj = Util.delParams(_obj, ['num', 'name', 'shortName', 'type', 'bossId', 'orgId'])
            this.setOrgValue('edit', [data])
            this.setBossValue('edit', [data])
          }
        } else {
          if (type == 'add') {
            this.dept = { // 部门信息
              name: undefined,  // 部门名称
              shortName: undefined, // 部门简称
              pid: data.id, // 上级部门id
              status: data.status,
              type: undefined, // 部门类型
              orgId: this.curr_org.id
            }
            Object.assign(_obj, this.dept)
            this.setOrgValue('add', [this.curr_org])
            this.setDeptValue('add', [data])
          } else {
            Object.assign(this.dept, data)
            _obj = Util.deepCopy(data)
            // 处理多余参数
            _obj = Util.delParams(_obj, ['num', 'pid', 'name', 'shortName', 'type', 'bossId', 'orgId'])
            this.setOrgValue('edit', [data])
            this.setDeptValue('edit', [data])
            this.setBossValue('edit', [data])
          }
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
        this.bossName = undefined
        this.orgName = undefined
      },
      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        // console.log(Object.keys(fieldsError).some(field => fieldsError[field]))
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      /**
       * 提交信息
       */
      submitDept() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.dept, values)

            let _addEditDeptApi = ''
            let _params = {}
            if (this.operType == 'add') {
              _addEditDeptApi = this.api.addDeptApi
              _params = Util.delParams(this.dept, ['name', 'shortName', 'pid', 'type', 'status', 'bossId', 'orgId'])
            } else {
              _addEditDeptApi = this.api.editDeptApi
              _params = Util.delParams(this.dept, ['id', 'name', 'shortName', 'pid', 'type', 'status', 'bossId', 'orgId'])
            }
            this.$post(_addEditDeptApi, _params)
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.closeModal()
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                Util.processError(this, res)
              })
          }
        })
      },
      /**
       * 删除部门信息
       * @param id
       */
      remove(id) {
        // console.log(id)
        this.$confirm({
          title: '删除',
          content: '确定要删除当前部门吗?',
          okText: '确 定',
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.delDeptApi, {id: id})
              .then(response => {
                Util.processRes(response, (res) => {
                  this.$message.success(response.statusMessage)
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                Util.processError(this, res)
              })
          },
          onCancel: () => {
          }
        })
      },
      /**
       * 停启用部门信息
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeDeptStatus(status, id) {
        const TYPE = status ? '启用' : '停用'
        this.$confirm({
          title: TYPE,
          content: `确定要${ TYPE }当前部门吗?`,
          okText: TYPE,
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.changeDeptStatusApi, {status: status, id: id})
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                Util.processError(this, res)
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
      changeDeptOrd(type, id) {
        this.$post(this.api.changeDeptOrdApi, {type: type, id: id})
          .then(response => {
            Util.processRes(response, () => {
              this.$message.success(response.statusMessage)
              this.search()
            })
            Util.processError(this, response)
          })
          .catch(res => {
            Util.processError(this, res)
          })
      },
      setDeptValue(type, val) {
        if (val.length) {
          console.log('v', val[0].name)
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
      setOrgValue(type, val) {
        if (val.length) {
          if (type == 'add' || type == 'change') {
            console.log({value: val[0].id})
            this.form.setFields({'orgId': {value: val[0].id}})
            this.orgName = val[0].name
          } else if (type == 'edit') {
            this.form.setFields({'orgId': {value: val[0].orgId}})
            this.orgName = val[0].orgName
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
      setBossValue(type, val) {
        if (val.length) {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'bossId': {value: val[0].id}})
            this.bossName = val[0].name
          } else if (type == 'edit') {
            this.form.setFields({'bossId': {value: val[0].bossId}})
            this.bossName = val[0].bossName
          }
        } else {
          if (type == 'add' || type == 'change') {
            this.form.setFields({'bossId': {value: undefined}})
            this.bossName = undefined
          } else if (type == 'edit') {
            this.form.setFields({'bossId': {value: undefined}})
            this.bossName = undefined
          }
        }

        // if (val.length) {
        //   this.form.setFields({'bossId': {value: val[0].id}})
        //   this.bossName = val[0].name
        // }
      },
      openDetailModal(item) {
        this.detailVisible = true
        this.$get(this.api.getDeptDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.deptDetail = response.data
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            Util.processError(this, res)
          })
      },
      closeDetailModal() {
        this.detailVisible = false
      },
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">

</style>
