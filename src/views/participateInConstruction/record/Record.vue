/**
* @Author: 李晨光
* @Date: 2019/9/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/3
**/
<comment>
  # 组件注释
  参建单位台账
</comment>
<template>
  <div id="Record">
    <Title/>
    <a-row class="m-20">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card class="table-area">
          <a-row>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex  align-center">
              <div class="flex align-center">
                <a-button type="primary" @click="addEditParticInConstrRecord('add')" v-waves>新增参建单位</a-button>
              </div>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="flex align-center justify-end">
              <a-input-group compact class="flex align-center justify-end">
                <a-input style="width: 50%" v-model="params.search" @input="deb" placeholder="按名称搜索">
                  <a-button slot="enterButton">Custom</a-button>
                </a-input>
                <a-button type="primary" v-waves @click="search">
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
                <div slot="status" slot-scope="text">
                  {{text ? '启用' : '停用'}}
                </div>
                <template slot="action" slot-scope="text, record, index">
                  <div class="flex">
                    <span title="编辑" class="icon-btn" @click="addEditParticInConstrRecord('edit', record)"
                          v-waves="{ type : 'center' }">
                      <icon-font type="spm-icon-shangyicopy4"/>
                    </span>
                    <span title="查看" class="icon-btn" @click="openDetailModal(record)" v-waves="{ type : 'center' }">
                      <icon-font type="spm-icon-shangyicopy5"/>
                    </span>
                    <span class="icon-btn" :title="record.status ? '停用' : '启用'"
                          @click="changeParticInConstrRecordStatus(record.status ? 0 : 1,record.id)"
                          v-waves="{ type : 'center' }">
                      <icon-font :type="record.status ? 'spm-icon-shangyicopy' : 'spm-icon-shangyicopy1'"/>
                    </span>
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
      </a-col>
    </a-row>
    <!--新增编辑参建单位弹窗-->
    <a-modal
      :title="operType == 'add' ? '新增参建单位': '编辑参建单位'"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitParticInConstrRecord"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
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
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位名称"
                :validate-status="formError(form,'name') ? 'error' : ''"
                :help="formError(form,'name') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入参建单位名称"
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入参建单位名称！' },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="社会统一信用代码"
                :validate-status="formError(form,'certificate') ? 'error' : ''"
                :help="formError(form,'certificate') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入社会统一信用代码"
                  v-decorator="[
                      'certificate',
                      {rules: [
                        { required: true, message: '请输入社会统一信用代码！' },
                        { pattern: Util.Reg7,  message: '请输入18位大写英文字母或数字或其组合!' }
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
        <a-button style="margin-left: 10px" type="primary" @click="submitParticInConstrRecord"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
    <!--查看参建单位详情-->
    <a-modal v-model="detailVisible"
             :width="1000"
             title="组织详情"
             centered>
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位编码"
              >
                <span class="form-value">{{particInConstrRecordDetail.num}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="参建单位名称"
              >
                <span class="form-value">{{particInConstrRecordDetail.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="社会统一信用代码"
              >
                <span class="form-value">{{particInConstrRecordDetail.certificate}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="总人数"
              >
                <span class="form-value">{{particInConstrRecordDetail.userNum}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <a-form-item
                label="参建项目"
              >
                <div class="m-t-10" style="position: relative">
                  <a-table
                    :columns="detailInitColumns"
                    :scroll="{x: 1024}"
                    :pagination="false"
                    :dataSource="detailTableData.list"
                    :locale="{emptyText: '暂无数据'}"
                    rowKey="id"
                    size="middle"
                  >
                    <div slot="type" slot-scope="text">
                      {{text ? Util.getValueByKey(particInConstrTypes,'id','name',text) : '--'}}
                    </div>
                    <div slot="status" slot-scope="text">
                      {{text ? '启用' : '停用'}}
                    </div>
                    <div slot="updateTime" slot-scope="text">
                      {{text | formatTime('yyyy-MM-dd hh:mm')}}
                    </div>
                    <template slot="action" slot-scope="text, record, index">
                      <div class="flex">
                          <span title="编辑" class="icon-btn" @click="addEditParticInConstrRecord('edit', record)"
                                v-waves="{ type : 'center' }">
                            <icon-font type="spm-icon-shangyicopy4"/>
                          </span>
                        <span title="查看" class="icon-btn" @click="openDetailModal(record)"
                              v-waves="{ type : 'center' }">
                            <icon-font type="spm-icon-shangyicopy5"/>
                          </span>
                        <span class="icon-btn" :title="record.status ? '停用' : '启用'"
                              @click="changeParticInConstrRecordStatus(record.status ? 0 : 1,record.id)"
                              v-waves="{ type : 'center' }">
                            <icon-font :type="record.status ? 'spm-icon-shangyicopy' : 'spm-icon-shangyicopy1'"/>
                          </span>
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
                  <Pagination :total="detailTableData.pagination.total"
                              :pageSize="detailTableData.pagination.pageSize"
                              :current="detailTableData.pagination.pageNo"
                              @onChange="onChangeDetailPage"
                              @onShowSizeChange="onShowSizeChangeDetailPage"></Pagination>
                </div>
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
  import debounce from 'lodash.debounce'
  import Pagination from '@/Pagination'

  export default {
    name: 'Record',
    components: {
      Title,
      Pagination
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          getParticInConstrRecordApi: Util.orgServer + '/web/subcontractor/page',  // 查询参建单位台账列表
          getParticInConstrRecordDetailApi: Util.orgServer + '/web/subcontractor/detail',  // 查询参建单位台账详情
          addParticInConstrRecordApi: Util.orgServer + '/web/subcontractor/add',  // 新增参建单位台账
          editParticInConstrRecordApi: Util.orgServer + '/web/subcontractor/edit',  // 编辑参建单位台账
          delParticInConstrRecordApi: Util.orgServer + '/web/subcontractor/delete',  // 删除参建单位台账
          changeParticInConstrRecordStatusApi: Util.orgServer + '/web/subcontractor/status', // 启用、停用参建单位台账
          getBindParticInConstrApi: Util.orgServer + '/web/project-subcontractor/page'// 查询关联参建单位列表
        },
        plainOptions: [  // 列表头部配置选项
          {label: '参建单位编码', value: 0},
          {label: '参建单位名称', value: 1},
          {label: '社会统一信用代码', value: 2},
          {label: '参建项目数', value: 3},
          {label: '总人数', value: 4},
        ],
        operValue: [0, 1, 2, 3, 4, 5],// 列表头部默认配置
        columns: {// 列表头部配置表
          0: {
            title: '参建单位编码',
            dataIndex: 'num',
          },
          1: {
            title: '参建单位名称',
            dataIndex: 'name',
          },
          2: {
            title: '社会统一信用代码',
            dataIndex: 'certificate',
          },
          3: {
            title: '参建项目数',
            dataIndex: 'projectNum',
          },
          4: {
            title: '总人数',
            dataIndex: 'userNum'
          },
          5: {
            title: '状态',
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status'
            },
          },
          6: {
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
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        params: { //查询请求参数
          search: undefined,
          current: 1,
          size: 10,
        },
        detailParams: {
          subcontractorId: '',
          current: 1,
          size: 10,
        },
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
        detailInitColumns: [
          {
            title: '项目编码',
            dataIndex: 'num',
          },
          {
            title: '项目名称',
            dataIndex: 'projectName',
          },
          {
            title: '参建单位分类',
            dataIndex: 'type',
            scopedSlots: {
              customRender: 'type'
            },
          },
          {
            title: '参建单位联系人',
            dataIndex: 'contacts',
          },
          {
            title: '联系电话',
            dataIndex: 'contactsTel',
          },
          {
            title: '参建单位状态',
            dataIndex: 'status',
            scopedSlots: {
              customRender: 'status'
            },
          },
          {
            title: '状态更新时间',
            dataIndex: 'updateTime',
            scopedSlots: {
              customRender: 'updateTime'
            },
          },
        ],// 初始化详情中列表头部配置表
        detailTableData: {  // 详情列表数据
          list: [],
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        expandedRowKeys: [],
        tableLoading: true,
        form: this.$form.createForm(this), // 新增参建单位
        formModalVisible: false, // 新增参建单位弹窗状态
        operType: 'add', // 操作类型
        particInConstrRecord: {},
        particInConstrRecordDetail: {}, // 组织详情  -- 详情显示用
        detailVisible: false, // 详情弹窗状态
        detailLoading: true,
      }
    },
    computed: {},
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


        this.params.current = pageNo
        this.params.size = pageSize
        this.$get(this.api.getParticInConstrRecordApi, this.params)
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

      // 验证表单 获取表单validate 状态 按钮根据状态可不可操作
      formError(form, field) {
        const {getFieldError, isFieldTouched} = form;
        return isFieldTouched(field) && getFieldError(field);
      },
      hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },
      /**
       * 新增编辑组织
       * @param type
       * @param data
       */
      addEditParticInConstrRecord(type = 'add', item = {}) {

        this.operType = type
        this.openModal()
        if (item.id) {
          this.$get(this.api.getParticInConstrRecordDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.particInConstrRecordDetail = response.data
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
        console.log(data)
        let _obj = {}
        if (type == 'add') {
          this.particInConstrRecord = { // 参建单位信息
            certificate: undefined, // 唯一代码
            name: undefined, // 参建名称
          }
          Object.assign(_obj, this.particInConstrRecord)
        } else {
          Object.assign(this.particInConstrRecord, data)

          _obj = Util.deepCopy(data)
          // form数据回填
          _obj = Util.delParams(_obj, ['id', 'num', 'name', 'certificate'])
        }
        // 这里是必须要给一个延时器的
        this.$nextTick(() => {
          console.log(_obj)
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
      submitParticInConstrRecord() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
            Object.assign(this.particInConstrRecord, values)

            let _addEditParticInConstrRecordApi = ''
            let _params = {}
            if (this.operType == 'add') {
              _addEditParticInConstrRecordApi = this.api.addParticInConstrRecordApi
              _params = Util.delParams(this.particInConstrRecord, ['name', 'certificate'])
            } else {
              _addEditParticInConstrRecordApi = this.api.editParticInConstrRecordApi
              _params = Util.delParams(this.particInConstrRecord, ['id', 'name', 'certificate'])
            }
            this.$post(_addEditParticInConstrRecordApi, _params)
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
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true
        this.$get(this.api.getParticInConstrRecordDetailApi, {id: item.id})
          .then(response => {
            this.detailLoading = false
            Util.processRes(response, () => {
              this.particInConstrRecordDetail = response.data
              this.detailParams.subcontractorId = response.data.id
              this.getDetailDataAction()
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.detailLoading = false
            console.log(res)
          })
      },
      /**
       * 页数变化回调
       * @param pageNo  页码
       * @param pageSize  每页多少条
       */
      onChangeDetailPage(pageNo, pageSize) {
        // 重新请求数据
        this.detailTableData.pagination.pageNo = pageNo
        this.getDetailDataAction(pageNo, pageSize)
      },
      /**
       * 每页条数变化回调
       * @param pageNo  页码
       * @param pageSize  每页多少条
       */
      onShowSizeChangeDetailPage(pageNo, pageSize) {
        // 重新请求数据
        this.detailTableData.pagination.pageSize = pageSize
        this.getDetailDataAction(pageNo, pageSize)
      },
      /**
       * 列表数据请求
       */
      getDetailDataAction(pageNo, pageSize) {
        this.detailParams.current = pageNo
        this.detailParams.size = pageSize
        this.$get(this.api.getBindParticInConstrApi, this.detailParams)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              this.detailTableData.list = response.data.records ? response.data.records : []
              this.detailTableData.pagination.total = Number(response.data.total)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
            console.log(res)
          })
      },
      /**
       * 关闭详情弹窗
       */
      closeDetailModal() {
        this.detailVisible = false
      },
      /**
       * 删除组织信息
       * @param id
       */
      remove(id) {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前参建单位吗?',
          okText: '确 认',
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.delParticInConstrRecordApi, {id: id})
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
       * 停启用参建单位信息
       * @param status  停启用 状态 1=启用 0=停用
       * @param id
       */
      changeParticInConstrRecordStatus(status, id) {
        const TYPE = status ? '启用' : '停用'
        this.$confirm({
          title: TYPE,
          content: `确定要${ TYPE }当前参建单位吗?`,
          okText: TYPE,
          cancelText: '取 消',
          onOk: () => {
            this.$post(this.api.changeParticInConstrRecordStatusApi, {status: status, id: id})
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
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">

</style>

