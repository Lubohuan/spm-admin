/**
* @Author: 李晨光
* @Date: 2019/9/7
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/9/7
**/
<comment>
  # 组件注释
  应用注册 -- 应用分组
</comment>
<template>
  <div id="AppClassify">
    <a-card class="table-area" >
      <a-row>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="flex align-center justify-end">
          <div style="position: relative;width: 100%;max-width: 500px" class="pointer">
            <a-input-group compact class="flex align-center justify-end">
              <a-input style="width: 50%" v-model="params.name" @input="deb" placeholder="按名称搜索">
                <a-button slot="enterButton">Custom</a-button>
              </a-input>
              <a-button type="primary" v-waves @click="search">
                <icon-font type="spm-icon-filesearch"></icon-font>
                搜 索
              </a-button>
            </a-input-group>
          </div>
        </a-col>
      </a-row>
      <a-divider class="table-divider"></a-divider>
      <a-skeleton active :loading="tableLoading" :paragraph="{rows: 5}">
        <div >
          <div class="flex align-center m-b-20">
            <a-button type="primary" @click="addEditAppClassify('add')" v-waves>新增</a-button>
            <a-button type="primary" class="m-l-10" :disabled="!this.tableData.record.id"
                      @click="addEditAppClassify('edit', selected)" v-waves>编辑
            </a-button>
            <a-button type="danger" class="m-l-10" :disabled="!this.tableData.record.id" @click="remove()" v-waves>删除
            </a-button>
          </div>
          <a-table
            :columns="initColumns"
            :scroll="{x: 300,y: tableData.height}"
            :pagination="false"
            :dataSource="tableData.list"
            :locale="{emptyText: '暂无数据'}"
            rowKey="id"
            :customRow="rowClick"
            :rowClassName="rowClassName"
            :expandedRowKeys="expandedRowKeys"
            @expand="expand"
            size="middle"
          >
            <div slot="status" slot-scope="text">
              {{text ? '启用' : '停用'}}
            </div>
            <template slot="action" slot-scope="text, record, index">
              <div class="flex">
                <!--<span type="link" title="编辑" class="icon-btn" @click="addEditAppClassify('edit', record)"
                      v-waves="{ type : 'center' }">
                  <icon-font type="spm-icon-shangyicopy4"/>
                </span>
                <span type="link" title="删除" class="icon-btn" @click="openDetailModal(record)"
                      v-waves="{ type : 'center' }">
                  <icon-font type="spm-icon-shangyicopy5"/>
                </span>-->
               <!-- <span type="link" :title="record.status ? '停用' : '启用'" class="icon-btn"
                      @click="changeParticInConstrStatus(record.status ? 0 : 1, record.id)"
                      v-waves="{ type : 'center' }">
                  <icon-font :type="record.status ? 'spm-icon-shangyicopy' : 'spm-icon-shangyicopy1'"/>
                </span>-->
                <!--<span v-if="index" title="上移" class="icon-btn" @click.stop="changeAppClassifyOrd('UP',record.id)"
                      v-waves="{ type : 'center' }">
                  <icon-font type="spm-icon-shangyi1"/>
                </span>
                <span v-if="(!record.pid || record.pid == null || record.pid == '0') ? (tableData.list.length - 1 > index) :
                    (Util.getDataByProps(tableData.list,'id',record.pid).children.length - 1 > index)"
                      title="下移" class="icon-btn" @click.stop="changeAppClassifyOrd('DOWN',record.id)"
                      v-waves="{ type : 'center' }">
                  <icon-font type="spm-icon-shangyicopy3"/>
                </span>-->
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

    <!--新增编辑应用分组-->
    <a-modal
      :title="operType == 'add' ? '新增应用分组': '编辑应用分组'"
      centered
      :width="800"
      :visible="formModalVisible"
      @ok="submitParticInConstr"
      @cancel="closeModal()"
    >
      <a-skeleton active :loading="detailLoading" :paragraph="{rows: 10}">
        <a-form
          :form="form"
        >
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用分组编码"
                :validate-status="formError(form,'code') ? 'error' : ''"
                :help="formError(form,'code') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入应用分组编码"
                  v-decorator="[
                      'code',
                      {rules: [
                        { required: true, message: '请输入应用分组编码！' },
                      ]
                    }
                  ]"/>
              </a-form-item>

            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="应用分组名称"
                :validate-status="formError(form,'certificate') ? 'error' : ''"
                :help="formError(form,'certificate') || ''"
              >
                <a-input
                  type="text"
                  placeholder="请输入应用分组名称"
                  v-decorator="[
                      'name',
                      {rules: [
                        { required: true, message: '请输入应用分组名称！' },
                      ]
                    }
                  ]"/>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="上级应用分组"
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
                      'pid',
                      {rules: [
                        { required: false, message: '请选择上级应用分组！' },
                      ]
                    }
                  ]"/>
                  <a-input-search placeholder="请选择上级应用分组" v-model="pName" readOnly :disabled="operType == 'edit'"
                                  @search="appClassifyVisible = !appClassifyVisible">
                    <a-button :disabled="operType == 'edit'" slot="enterButton">选 择</a-button>
                  </a-input-search>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
          <app-classify-modal v-if="appClassifyVisible" :isVisible='appClassifyVisible'
                              @closed="appClassifyVisible = false"
                              @change="setValue('change', $event)"></app-classify-modal>
        </a-form>
      </a-skeleton>
      <template slot="footer">
        <a-button @click="closeModal()">取 消</a-button>
        <a-button style="margin-left: 10px" type="primary" @click="submitParticInConstr"
                  :disabled="hasErrors(form.getFieldsError())">确 认
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import AppClassifyModal from '@/select/AppClassifyModal'

  export default {
    name: 'AppClassify',
    components: {
      'app-classify-modal': AppClassifyModal
    },
    props: {
      selected: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    model: {
      // v-model
      prop: "selected",
      event: "change"
    },
    data() {
      return {
        Util,
        api: {
          getAppClassifyApi: Util.orgServer + '/web/resource/group/all',  // 查询应用分组列表
          getAppClassifyDetailApi: Util.orgServer + '/web/resource/app/detail',  // 查询应用分组详情
          delAppClassifyApi: Util.orgServer + '/web/resource/group/delete',// 删除应用分组
          addAppClassifyApi: Util.orgServer + '/web/resource/group/add', // 新增应用分组
          editAppClassifyApi: Util.orgServer + '/web/resource//group/update', // 编辑应用分组
          changeAppClassifyOrdApi: Util.orgServer + '/web/resource/group/order', // 应用分组排序
        },
        plainOptions: [  // 列表头部配置选项
          {label: '分组编码', value: 0},
          {label: '分组名称', value: 1},
        ],
        operValue: [0, 1],// 列表头部默认配置
        columns: {// 列表头部配置表
          0: {
            title: '分组编码',
            dataIndex: 'code',
            width: 150,
          },
          1: {
            title: '分组名称',
            dataIndex: 'name',
            width: 150,
          },
          3: {
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
          init: [],
          record: {
            id: null
          },
          height: null
        },
        expandedRowKeys: [],
        tableLoading: true, // table loading
        params: { //查询请求参数
          name: undefined,
        },
        appClassifyVisible: false, // 应用分组弹窗状态
        pId: undefined, // 应用分组Id
        pName: undefined, // 应用分组名称
        form: this.$form.createForm(this), // 新增应用分组
        formModalVisible: false, // 新增应用分组弹窗状态
        operType: 'add', // 操作类型
        appClassify: {}, //应用分组信息 -- 编辑用
        appClassifyDetail: {}, // 应用分组详情  -- 详情显示用
        detailLoading: false
      }
    },
    computed: {},
    created() {
      this.tableData.height = document.body.clientHeight - 370 > 380 ? document.body.clientHeight - 370 : 380;
      window.onresize = () => {
        this.tableData.height = document.body.clientHeight - 370 > 380 ? document.body.clientHeight - 370 : 380;
      };
      this.operChange(this.operValue)
      this.search()
    },
    mounted() {
    },
    watch: {

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
       * 列表数据请求
       */
      getDataAction() {
        this.$get(this.api.getAppClassifyApi, this.params)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              this.tableData.init = response.data ? Util.deepCopyDelChildrenNull(response.data) : []
              this.tableData.list = Util.deepCopyDelChildrenNull(Util.treeSearch(this.params.name, 'name', this.tableData.init))
              this.rootId = this.tableData.list[0].pid
              this.expandedRowKeys = Util.getIds(this.tableData.list)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
            console.log(res)
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
        /*let oper = {
          title: '',
          dataIndex: 'operation',
          width: 150,
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'operIcon',
            customRender: 'action'
          }
        }*/
        checkedValues.length && checkedValues.forEach(checked => {
          columns.push(this.columns[checked])
        })
        /*columns.push(oper)*/
        this.initColumns = columns
      },
      // 行点击
      rowClick(record, index) {
        return {
          on: {
            click: () => {
              this.tableData.record = record;
            }
          }
        };
      },
      // 新增 行 class
      rowClassName(record, index) {
        let className = "";
        if (record.id === this.tableData.record.id) {
          className = "rowActive";
          this.is_check = true;
          this.$emit('change', this.tableData.record)
        }
        return className;
      },
      /**
       * 打开详情弹窗
       * @param item
       */
      openDetailModal(item) {
        this.detailVisible = true
         this.$get(this.api.getAppClassifyDetailApi, {id: item.id})
           .then(response => {
             this.detailLoading = false
             Util.processRes(response, () => {
               this.appClassifyDetail = response.data
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
      setValue(type, val) {
        if (val.length) {
          if(type == 'add' || type == 'change') {
            this.form.setFields({'pid': {value: val[0].id}})
            this.pName = val[0].name
          }else if(type == 'edit'){
            this.form.setFields({'pid': {value: val[0].pid}})
            this.pName = val[0].parentName
          }
        }else{
          if(type == 'add' || type == 'change') {
            this.form.setFields({'pid': {value: undefined}})
            this.pName = undefined
          }else if(type == 'edit'){
            this.form.setFields({'pid': {value: undefined}})
            this.pName = undefined
          }
        }
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
       * 新增编辑分组
       * @param type
       * @param data
       */
      addEditAppClassify(type = 'add', item = {}) {
        this.operType = type
        this.openModal()
        if (item.id) {
          this.$get(this.api.getAppClassifyDetailApi, {id: item.id})
            .then(response => {
              this.detailLoading = false
              Util.processRes(response, () => {
                this.appClassifyDetail = response.data
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
          this.appClassify = {
            code: undefined, // 编码
            pid: undefined, // 上级
            name: undefined, // 名称
          }
          Object.assign(_obj, this.appClassify)
          this.setValue('add', [data])
        } else {
          Object.assign(this.appClassify, data)
          _obj = Util.deepCopy(data)
          // form数据回填
          _obj = Util.delParams(_obj, ['code', 'pid', 'name'])
          this.setValue('edit', [data])
        }
        // 这里是必须要给一个延时器的
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
      },
      /**
       * 提交信息
       */
      submitParticInConstr() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log('Received values of form: ', values)
            Object.assign(this.appClassify, values)

            let _addEditAppClassifyApi = ''
            let _params = {}
            if (this.operType == 'add') {
              _addEditAppClassifyApi = this.api.addAppClassifyApi
              _params = {type: 'group', ...Util.delParams(this.appClassify, ['name', 'pid', 'code'])}
            } else {
              _addEditAppClassifyApi = this.api.editAppClassifyApi
              _params = {type: 'group', ...Util.delParams(this.appClassify, ['id', 'name', 'pid', 'code'])}
            }
            console.log(Util.delParams(this.appClassify, ['id', 'name', 'pid', 'code']))
            this.$post(_addEditAppClassifyApi, _params)
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
       * 删除应用分组
       * @param id
       */
      remove() {
        this.$confirm({
          title: '删除',
          content: '确定要删除当前应用分组吗?',
          okText: '删 除',
          okType: 'danger',
          cancelText: '取 消',
          onOk: () => {
            this.$postParams(this.api.delAppClassifyApi, {id: this.tableData.record.id})
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
       * 排序
       * @param type
       * @param id
       */
      changeAppClassifyOrd(type, id) {
        this.$postParams(this.api.changeAppClassifyOrdApi, {orderType: type, id: id})
          .then(response => {
            Util.processRes(response, () => {
              this.$message.success(response.statusMessage)
              this.search()
            })
            Util.processError(this, response)
          })
          .catch(res => {
            console.log(res)
          })
      },
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #AppClassify {
    .rowActive {
      @include primary_bg_color_o
    }
  }

</style>
