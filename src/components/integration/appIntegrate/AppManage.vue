/**
* @Author: 李晨光
* @Date: 2019/9/6
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/6
**/
<comment>
  # 组件注释
  应用注册 -- 应用管理
</comment>
<template>
  <div id="AppManage">
    <a-card class="table-area" >
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex  align-center">
          <div class="flex align-center">
            <a-button type="primary" :disabled="!appClassify['id'] || appClassify['pid'] == '0'"
                      @click="addEditApp('add')" v-waves>新增
            </a-button>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex align-center justify-end">
          <a-input-group compact class="flex align-center justify-end">
            <a-input style="width: 50%" v-model="params.name" @input="deb" placeholder="按名称搜索">
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
            :scroll="{x: 870,y: tableData.height}"
            :pagination="false"
            :dataSource="tableData.list"
            :locale="{emptyText: '暂无数据'}"
            rowKey="id"
            size="middle"
          >
            <div slot="status" slot-scope="text">
              {{text ? '启用' : '停用'}}
            </div>
            <div slot="isPlatform" slot-scope="text">
              {{text=="1" ? '是' : '否'}}
            </div>
            <template slot="action" slot-scope="text, record, index">
              <div class="flex">
                      <span type="link" title="查看" class="icon-btn" @click="openDetailModal(record)"
                            v-waves="{ type : 'center' }">
                        <icon-font type="spm-icon-shangyicopy5"/>
                      </span>
                <span title="维护应用" class="icon-btn" @click="maintainApp(record)" v-waves="{ type : 'center' }">
                        <icon-font type="spm-icon-setting"/>
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
                      <a href="javascript:;" @click="addEditApp('edit', record)">编辑</a>
                    </a-menu-item>
                    <!--<a-menu-item v-if="index">
                      <a href="javascript:;" @click="changeOrgOrd('up',record.id)">上移</a>
                    </a-menu-item>
                    <a-menu-item
                      v-if="(!record.pid || record.pid == null || record.pid == appClassify.id) ? (tableData.list.length - 1 > index) :  (Util.getDataByProps(tableData.list,'id',record.pid).children.length - 1 > index)">
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
          <!--分页-->
          <Pagination class="page-pagination" :total="tableData.pagination.total"
                      :pageSize="tableData.pagination.pageSize"
                      :current="tableData.pagination.pageNo"
                      @onChange="onChangePage"
                      @onShowSizeChange="onShowSizeChangePage"></Pagination>
        </div>

      </a-skeleton>
    </a-card>
    <!--新增编辑应用弹窗-->
    <a-modal
      :title="operType == 'add' ? '新增应用': '编辑应用'"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitApp"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用编码"
                :validate-status="formError(form,'code') ? 'error' : ''"
                :help="formError(form,'code') || ''"
              >
                <a-input
                  type="text"
                  placeholder="应用编码"
                  v-decorator="[
                      'code',
                      {rules: [
                        { required: true, message: '应用编码！' },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用名称"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  placeholder="应用名称"
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '应用名称！' },
                      ]
                    }
                  ]"/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用分类"
                :validate-status="formError(form,'pid') ? 'error' : ''"
                :help="formError(form,'pid') || ''"

              >
                <div style="position: relative">
                  <a-input
                    style="position: absolute;z-index: -1;"
                    readOnly
                    disabled
                    type="text"
                    v-decorator="[
                      'pid',
                      {rules: [
                        { required: false, message: '请选择分类！' },
                      ]
                    }
                  ]"/>
                  <a-input
                    class="pointer"
                    @click="contactVisible = !contactVisible"
                    readOnly
                    disabled
                    placeholder="请选择分类"
                    type="text"
                    v-model="appClassifyName"
                  />
                </div>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用类型"
                :validate-status="formError(form,'appType') ? 'error' : ''"
                :help="formError(form,'appType') || ''"
              >
                <a-select
                  notFoundContent="暂无数据"
                  placeholder="请选择应用类型"
                  v-decorator="[
                  'appType',
                  {rules: [{ required: true, message: '请选择应用类型！' }]}
                ]">
                  <a-select-option v-for="( AppType, index ) in AppTypes"
                                   :value="AppType.id" :key="index + 'AppType'">{{ AppType.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="是否是平台级应用"
                :validate-status="formError(form,'isPlatform') ? 'error' : ''"
                :help="formError(form,'isPlatform') || ''"
              >
                <a-radio-group name="radioGroup" v-decorator="[
                      'isPlatform',
                      {rules: [
                        { required: true, message: '请选择！' },
                      ]
                    }
                  ]">
                  <a-radio :value="1">
                    是
                  </a-radio>
                  <a-radio :value="0">
                    否
                  </a-radio>
                </a-radio-group>

              </a-form-item>
            </a-col>
            <!--<a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="排序号"
                :validate-status="formError(form,'order') ? 'error' : ''"
                :help="formError(form,'order') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入排序号"
                  v-decorator="[
                        'order',
                        {rules: [
                          { required: true, message: '请输入排序号！' },
                        ]
                      }
                    ]"/>
              </a-form-item>

            </a-col>-->
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item
                label="描述"
                :validate-status="formError(form,'description') ? 'error' : ''"
                :help="formError(form,'description') || ''"
              >
                <a-input
                  type="textarea"
                  placeholder="请输入描述"
                  v-decorator="[
                      'description',
                      {rules: [
                        { required: false, message: '请输入组织简称！' },

                      ]
                    }
                  ]"/>

              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="submitApp"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
    <!--查看应用详情-->
    <a-modal v-model="detailVisible"
             :width="800"
             title="应用详情"
             centered>
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="组织编码"
              >
                <span class="form-value">{{AppDetail.code}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用名称"
              >
                <span class="form-value">{{AppDetail.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用分类"
              >
                <span class="form-value">{{AppDetail.pname}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用类型"
              >
                <span class="form-value">{{AppDetail['appType'] ? Util.getValueByKey(AppTypes,'id','name',AppDetail['appType']) : '--'}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="是否是平台级应用"
              >
                <span class="form-value">{{ AppDetail.isPlatform ? '是' : '否' }}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="排序号"
              >
                <span class="form-value">{{ AppDetail.orderNumber }}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="描述"
              >
                <span class="form-value">{{ AppDetail.description || '--'}}</span>
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
  import Pagination from '@/Pagination'
  import debounce from 'lodash.debounce'

  export default {
    name: 'AppRegistry',
    components: {
      Pagination,
    },
    props: {
      appClassify: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        Util,
        api: {
          getAppApi: Util.orgServer + '/web/resource/app/list',  // 查询应用列表
          getAppDetailApi: Util.orgServer + '/web/resource/app/detail',  // 查询应用详情
          delAppApi: Util.orgServer + '/web/resource/app/delete',// 删除应用
          addAppApi: Util.orgServer + '/web/resource/app/add', // 新增应用
          editAppApi: Util.orgServer + '/web/resource/app/update', // 编辑应用
          maintainAppApi: Util.orgServer + '/web/resource/app/update', // 维护应用
          // changeAppStatusApi: Util.orgServer + '/web/project-subcontractor/status', // 启用、停用参建单位
        },
        plainOptions: [  // 列表头部配置选项
          {label: '应用编码', value: 0},
          {label: '应用名称', value: 1},
          {label: '是否平台应用', value: 2},
          {label: '排序号', value: 3},
        ],
        operValue: [0, 1, 2, 3],// 列表头部默认配置
        columns: {// 列表头部配置表
          0: {
            title: '应用编码',
            dataIndex: 'code',
            width: 150,
          },
          1: {
            title: '应用名称',
            dataIndex: 'name',
            width: 200,
          },
          2: {
            title: '是否平台应用',
            dataIndex: 'isPlatform',
            width: 100,
            scopedSlots: {
              customRender: 'isPlatform'
            },
          },
          3: {
            title: '排序号',
            dataIndex: 'orderNumber',
            width: 100,
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
          height: null,
          list: [],
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        tableLoading: true, // table loading
        params: { //查询请求参数
          name: undefined,
          pageNo: 1,
          pageSize: 10,
          projectId: undefined,
        },
        appClassifyName: undefined, // 项目部名称
        form: this.$form.createForm(this), // 新增应用
        formModalVisible: false, // 新增应用弹窗状态
        operType: 'add', // 操作类型
        App: {}, //应用信息 -- 编辑用
        AppDetail: {}, // 应用详情  -- 详情显示用
        detailVisible: false, // 详情弹窗状态
        detailLoading: true, // 详情loading
        AppTypes: [
          {
            id: 1,
            name: '内部应用'
          },
          {
            id: 2,
            name: '内部系统'
          },
          {
            id: 3,
            name: '外部应用'
          },
          {
            id: 4,
            name: '外部系统'
          },
        ],
      }
    },
    computed: {},
    created() {
      this.tableData.height = document.body.clientHeight - 300 > 425 ? document.body.clientHeight - 300 : 425;
      window.onresize = () => {
        this.tableData.height = document.body.clientHeight - 300 > 425 ? document.body.clientHeight - 300 : 425;
        console.log(this.tableData.height)

      };
      this.operChange(this.operValue)
      this.tableLoading = false
    },
    mounted() {
    },
    watch: {
      'appClassify.id': {
        handler(val, oldVal) {
          this.search()
        },
        deep: true
      }
    },
    methods: {
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(function () {
          // 搜索方法
          this.search()
        }, 1000  // 延迟时间
      ),
      /**
       * 搜索
       */
      search() {
        this.getDataAction()
      },
      /**
       * 页数变化回调
       * @param pageNo  页码
       * @param pageSize  每页多少条
       */
      onChangePage(pageNo, pageSize) {
        // 重新请求数据
        this.tableData.pagination.pageNo = pageNo
        this.getDataAction(pageNo, pageSize)
      },
      /**
       * 每页条数变化回调
       * @param pageNo  页码
       * @param pageSize  每页多少条
       */
      onShowSizeChangePage(pageNo, pageSize) {
        // 重新请求数据
        this.tableData.pagination.pageSize = pageSize
        this.getDataAction(pageNo, pageSize)
      },
      /**
       * 列表数据请求
       */
      getDataAction(pageNo = 1, pageSize = 10) {
        this.params.id = this.appClassify.id
        this.params.pageNo = pageNo
        this.params.pageSize = pageSize
        if (this.params.id) {
          this.$get(this.api.getAppApi, this.params)
            .then(response => {
              this.tableLoading = false
              Util.processRes(response, () => {
                this.tableData.list = response.data.records ? response.data.records : []
                this.tableData.pagination.total = Number(response.data.total)
              })
              Util.processError(this, response)
            })
            .catch(res => {
              this.tableLoading = false
              console.log(res)
            })
        } else {
          this.tableData.list = []
          this.tableData.pagination.total = 0
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
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true
        this.$get(this.api.getAppDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.AppDetail = response.data
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
          })
      },
      /**
       * 关闭详情弹窗
       */
      closeDetailModal() {
        this.detailVisible = false
      },
      setValue(type = 'add', val) {
        console.log(val)
        if (val.length) {
          if (type == 'add') {
            this.form.setFields({'pid': {value: val[0].id}})
            this.appClassifyName = val[0].name
          }
        } else {
          this.form.setFields({'pid': {value: undefined}})
          this.appClassifyName = undefined
        }
      },
      /**
       * 获取
       * @param projectId
       */
      getAppType(projectId) {
        this.$get(this.api.getAppDetailApi, {projectId: this.projectId})
          .then(response => {
            Util.processRes(response, () => {
              this.AppTypes = response.data
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
          })
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
       * 新增编辑应用
       * @param type
       * @param data
       */
      addEditApp(type = 'add', item = {}) {
        this.operType = type
        this.openModal()
        if (item.id) {
          this.$get(this.api.getAppDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.AppDetail = response.data
                this.dealDetail(type, response.data)
              })
              Util.processError(this, response)
            })
            .catch(res => {
              this.detailLoading = false
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
          this.App = { // 参建单位信息
            pid: this.appClassify.id, // pid
            name: undefined,  // 名称id
            code: undefined,  // 编码
            isPlatform: 0, // 是否是平台级应用
            description: undefined, // 描述
            type: 1, // 类型
          }
          Object.assign(_obj, this.App)
        } else {
          Object.assign(this.App, data)
          _obj = Util.deepCopy(data)
          // form数据回填
          _obj = Util.delParams(_obj, ['code', 'name', 'isPlatform', 'description', 'appType', 'pid', 'order'])
        }
        // 这里是必须要给一个延时器的
        this.$nextTick(() => {
          this.setValue('add', [this.appClassify])
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
      },
      /**
       * 提交信息
       */
      submitApp() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.App, values)

            let _addEditAppApi = ''
            let _params = {}
            if (this.operType == 'add') {
              _addEditAppApi = this.api.addAppApi
              _params = {
                type: 'menu',
                projectId: this.projectId, ...Util.delParams(this.App, ['code', 'name', 'isPlatform', 'description', 'appType', 'pid', 'order'])
              }
            } else {
              _addEditAppApi = this.api.editAppApi
              _params = {type: 'menu', ...Util.delParams(this.App, ['id', 'code', 'name', 'isPlatform', 'description', 'appType', 'pid', 'order'])}
            }
            this.$post(_addEditAppApi, _params)
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
       * 删除应用
       * @param id
       */
      remove(id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前应用吗?',
          okText: '删 除',
          okType: 'danger',
          cancelText: '取 消',
          onOk: () => {
            this.$postParams(this.api.delAppApi, {id: id})
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
       * 停启用
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeAppStatus(status, id) {
        const TYPE = status ? '启用' : '停用'
        this.$confirm({
          title: TYPE,
          content: `确定要${ TYPE }当前参建单位吗?`,
          okText: TYPE,
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.changeAppStatusApi, {status: status, id: id})
              .then(response => {
                Util.processRes(response, (res) => {
                  this.$message.success(response.statusMessage)
                  this.search()
                })
                Util.processError(this, response)
              })
              .catch(res => {
                console.log(res)
              })
          },
          onCancel: () => {
          }
        })
      },
      maintainApp(item) {
        this.$router.push({name: 'Maintain', query: {appInfoId: item.id}})
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
</style>
