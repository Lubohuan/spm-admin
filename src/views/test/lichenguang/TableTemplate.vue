/**
* @Author: 李晨光
* @Date: 2019/7/9
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/9
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="TableTemplate">
    <Title>
      <div slot="handle" class="flex">
        <div v-waves>
          <a-button>返 回</a-button>
        </div>
        <!--<div v-waves>
          <a-button type="primary">Primary</a-button>
        </div>
        <div v-waves>
          <a-button type="dashed">Dashed</a-button>
        </div>
        <div v-waves>
          <a-button type="danger">Danger</a-button>
        </div>-->
      </div>
    </Title>
    <a-row class="m-20">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <a-card>
          <div class="" style="min-height: 600px;height: auto;">
            <a-row>
              <a-col class="flex m-b-20">
                <a-input-group compact>
                  <a-select style="width: 10%" defaultValue="名称">
                    <a-select-option value="名称">名称</a-select-option>
                    <a-select-option value="电话">电话</a-select-option>
                  </a-select>
                  <a-input style="width: 30%" placeholder="按名称搜索">
                    <a-button slot="enterButton">Custom</a-button>
                  </a-input>
                  <div v-waves style="display: inline-block">
                    <a-button type="primary">
                      <icon-font type="spm-icon-filesearch"></icon-font>
                      搜 索
                    </a-button>
                  </div>
                  <div class="flex align-center m-l-20 ">
                    <a-checkbox :checked="isHSearch"
                                @change="onChange">高级搜索
                    </a-checkbox>
                  </div>
                </a-input-group>
              </a-col>
            </a-row>
            <transition name="fade">
              <a-form v-show="isHSearch">
                <a-row :gutter="20">
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="6">
                    <a-form-item
                      label="Field A"
                    >
                      <a-input placeholder="input placeholder"/>
                    </a-form-item>
                  </a-col>
                </a-row>

              </a-form>
            </transition>
            <a-divider orientation="right"></a-divider>
            <div style="height: 40px;margin-bottom: 10px" class="flex align-center">
              <a-button  type="primary" v-waves>
                新 增
              </a-button>
              <a-button class="m-l-10" v-waves>
                导 入
              </a-button>
              <a-button class="m-l-10" v-waves>
                导 出
              </a-button>
            </div>
            <a-table :columns="initColumns" :pagination="false" :dataSource="tableDate" size="small" bordered>
              <template slot="name" slot-scope="text">
                <a href="javascript:;">{{text}}</a>
              </template>
              <template slot="progress" slot-scope="progress">
                <div style="width: 150px;">
                  <a-progress :strokeColor="progress > 0 && progress <= 25 ?
               'rgba(203,63,84,1)' : progress > 25 && progress <= 50 ?
               'rgba(229,192,92,1)' : progress > 50 && progress <= 75 ?
               '#3F71AE' : progress > 75 && progress <= 100 ? 'rgba(114,213,154,1)' : ''"
                              :percent="progress"
                              strokeLinecap="square"
                              size="small" status="active"/>
                </div>
              </template>
              <!--<template slot="title" slot-scope="currentPageData">
                <div style="height: 40px" class="flex align-center justify-end">
                  <div v-waves style="display: inline-block">
                    <a-button type="primary">
                      新 增
                    </a-button>
                  </div>
                  <div v-waves style="display: inline-block" class="m-l-20">
                    <a-button>
                      导 入
                    </a-button>
                  </div>
                  <div v-waves style="display: inline-block" class="m-l-20">
                    <a-button>
                      导 出
                    </a-button>
                  </div>
                </div>
              </template>-->
              <template slot="action" slot-scope="text, record">
              <span class="pointer">
                <icon-font type="spm-icon-shangyicopy4"/>
                编辑
              </span>
              <span class="m-l-20 pointer" @click="remove()">
                <icon-font type="spm-icon-shanchu"/>
                删除
              </span>
              </template>
              <div slot="filterDropdown"
                   slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                   class='custom-filter-dropdown'>
                <!-- <a-input
                   v-ant-ref="c => searchInput = c"
                   :placeholder="`Search ${column.dataIndex}`"
                   :value="selectedKeys[0]"
                   @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                   @pressEnter="() => handleSearch(selectedKeys, confirm)"
                   style="width: 188px; margin-bottom: 8px; display: block;"
                 />-->
                <a-checkbox-group :options="plainOptions" v-model="operValue" @change="operChange"/>
                <!--<a-button
                  type='primary'
                  @click="() => handleSearch(selectedKeys, confirm)"
                  icon="search"
                  size="small"
                  style="width: 90px; margin-right: 8px"
                >Search</a-button>
                <a-button
                  @click="() => handleReset(clearFilters)"
                  size="small"
                  style="width: 90px"
                >Reset</a-button>-->
              </div>
              <icon-font slot="operIcon"
                         slot-scope="filtered"
                         type='spm-icon-setting'
                         :style="{ color: filtered ? '#111' : undefined }"
                         style="border-left:1px solid #ddd;"/>
            </a-table>
            <Pagination :total="pagination.totalCount"
                        :pageSize="pagination.pageSize"
                        :current="pagination.pageNo"
                        @onChange="onChangePage"
                        @onShowSizeChange="onShowSizeChangePage"></Pagination>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Title from '@/Title'
  import Pagination from '@/Pagination'
  export default {
    name: 'TableTemplate',
    components: {
      Title,
      Pagination
    },
    props: {},
    data() {
      return {
        isHSearch: false,
        plainOptions:[
          { label: '日期', value: 'name' },
          { label: '任务名称', value: 'taskName' },
          { label: '任务进度', value: 'progress' },
          { label: '计划产值（万元）', value: 'money1' },
          { label: '完成值（万元）', value: 'money2' },
        ],
        operValue:['name', 'taskName', 'progress', 'money1', 'money2'],
        columns: [
          {
            title: '日期',
            dataIndex: 'name',
            scopedSlots: {customRender: 'name'},
          }, {
            title: '任务名称',
            className: 'column-money',
            dataIndex: 'taskName',
          }, {
            title: '任务进度',
            dataIndex: 'progress',
            width: 200,
            scopedSlots: {customRender: 'progress'},
          }, {
            title: '计划产值（万元）',
            className: 'column-money',
            dataIndex: 'money1',
          }, {
            title: '完成值（万元）',
            className: 'column-money',
            dataIndex: 'money2',
          }, {
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            scopedSlots: {
              filterDropdown: 'filterDropdown',
              filterIcon: 'operIcon',
              customRender: 'action'
            },
            onFilter: (value, record) => record.address.toLowerCase().includes(value.toLowerCase()),
            onFilterDropdownVisibleChange: (visible) => {
              if (visible) {
                setTimeout(() => {
                  // this.searchInput.focus()
                })
              }
            },

          }],
        initColumns:[],
        tableDate: [
          {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 60,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'New York No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 30,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 10,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 48,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 58,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 80,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'Sidney No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 60,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'New York No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 30,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 10,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 48,
            mmoney1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 10,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 48,
            mmoney1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 10,
            money1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }, {
            name: '2019-07-06',
            taskName: '年度目标计划产值',
            progress: 48,
            mmoney1: '300,000.00',
            money2: '300,000.00',
            address: 'London No. 1 Lake Park',
          }],
        pagination: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 29
        },
      }
    },
    computed: {},
    created() {
    },
    mounted() {
      this.operChange(this.operValue)
      // this.$get('admin-user/get-user-role',{adminUserId:'1232133'})
      //   .then((reponse) => {
      //     console.log(reponse)
      //   })
      //   .catch()
      // this.$getAll([this.$get('/admin-user/get-user-role',{adminUserId:'1232133'})
      //   ,this.$get('/admin-user/get-user-role',{adminUserId:'1232133'})])
      //     .then((reponse) => {
      //       // console.log(reponse)
      //     })
      //     .catch()
    },
    watch: {},
    methods: {
      // 高级搜索
      onChange() {
        this.isHSearch = !this.isHSearch
      },
      // 页数变化回调
      onChangePage (pageNo, pageSize) {
        this.pagination.pageNo = pageNo
        // 重新请求数据
      },
      // 每页条数变化回调
      onShowSizeChangePage (pageNo, pageSize) {
        this.pagination.pageSize = pageSize
        // 重新请求数据
      },
      //配置table表头
      operChange (checkedValues) {
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
          columns[this.columns.findIndex(item => item.dataIndex === checked)] = this.columns.find(item => item.dataIndex === checked)
        })
        columns.push(oper)
        this.initColumns = columns
      },
      // 删除
      remove() {
        this.$confirm({
          title: '删除',
          content: '确定要删除吗 ?',
          okText: '确认',
          cancelText: '取消',
          onOk () {

          },
          onCancel () {
          }
        })
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #TableTemplate{
    .custom-filter-dropdown {
      padding: 8px;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
      max-width: 300px;
    }
  }
</style>
