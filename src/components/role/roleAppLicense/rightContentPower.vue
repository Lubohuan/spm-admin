/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  角色授权
</comment>
<template>
  <div class="table-box-special">
    <div class="table-table">
      <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
        <a-table
          rowKey="id"
          size="middle"
          :scroll="{ y: table.height }"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.data"
          :locale="{emptyText: '暂无数据'}"
          :expandedRowKeys="table.expandedRowKeys"
          @expand="expand"
          :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange,
          getCheckboxProps: record => ({
              props: {
                disabled: record.type === 'group', // Column configuration not to be checked
              }
            })}"
        >
          <template slot="time" slot-scope="text,record">
            {{ Util.getValueByKey(licenseDetail, 'authId', 'createTime', record.appResourceId) | formatTime('yyyy-MM-dd hh:mm') }}
          </template>
          <template slot="user" slot-scope="text,record">
            {{ Util.getValueByKey(licenseDetail, 'authId', 'createUser', record.appResourceId) }}
          </template>

        </a-table>
      </a-skeleton>
    </div>
    <TransferModal ref="TransferModal" :isVisible="Visible" @closed="Visible = false" @change="setApply"/>
  </div>
</template>
<script>
  import TransferModal from "@/select/TransferModal"; //穿梭框组件
  import debounce from 'lodash.debounce'
  import {mapState} from 'vuex'

  export default {
    components: {
      TransferModal
    },
    props: {
      currentId: {
        type: String,
        default: ''
      },
      orgId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        Util,
        api: {
          getRoleLicenseApi: Util.orgServer + '/web/role-app-resource/list', // 根据角色获取应用权限范围列表
          setRoleLicenseApi: Util.orgServer + '/web/role-app-resource/add-resources', //新增授权限定新增应用资源
          getAppApi: Util.orgServer + '/web/resource/tree',  // 查询应用列表
          delRoleLicenseApi: Util.orgServer + '/web/role-app-resource/remove-resources' // 移除角色下的资源
        },
        Visible: false,
        table: {
          loading: false,
          height: 352,
          id: null,
          selectedRowKeys: [],
          expandedRowKeys: [],
          columns: [
            {
              title: "权限",
              dataIndex: "name",
              key: "name",
              width: "50%"
            },
            {
              title: "授权人",
              dataIndex: "age",
              key: "age",
              width: '20%',
              scopedSlots: {
                customRender: 'user'
              },
            },
            {
              title: "授权时间",
              dataIndex: "time",
              width: "30%",
              scopedSlots: {
                customRender: 'time'
              },
            }

          ],
          init: [],
          data: []
        },
        licenseDetail: []
      };
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org,
      })
    },
    created() {
      this.getDataAction()
    },
    mounted() {
      this.table.height = document.body.clientHeight - 325 -52;
      window.onresize = () => {
        this.table.height = document.body.clientHeight - 325 -52;
      };
    },
    watch: {
      'currentId': {
        handler(val, oldVal) {
          this.search()
        },
        immediate: true
      },
      'orgId': {
        handler(val, oldVal) {
          this.search()
        },
        immediate: true
      }

    },
    methods: {
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(function (keyword) {
          // 搜索方法
          this.search(keyword)
        }, 1000  // 延迟时间
      ),
      /**
       * 搜索
       */
      search(keyword) {
        if (keyword) {
          this.getRoleLicense((data) => {
            this.table.data = Util.treeSearch(keyword, 'name', data)
          })
        } else {
          this.getRoleLicense()
        }
      },
      //  获取角色权限详情
      getRoleLicense(callback) {
        if (this.currentId) {
          this.$get(this.api.getRoleLicenseApi, {roleId: this.currentId})
            .then(response => {
              Util.processRes(response, () => {
                if (response.data && response.data.length) {
                  let licenseIds = []
                  response.data.forEach(item => {
                    if (!licenseIds.includes(item.appResourceId)) {
                      licenseIds.push(item.appResourceId)
                    }
                  })
                  this.licenseDetail = response.data
                  if(callback) {
                    callback(Util.treeSearchByIds(licenseIds, this.table.init))
                  }else{
                    this.table.data = Util.treeSearchByIds(licenseIds, this.table.init)
                  }
                  this.table.expandedRowKeys = Util.getIds(this.table.data)
                } else {
                  this.table.data = []
                }
              })
              Util.processError(this, response)
            })
            .catch(res => {
            })
        } else {
          this.table.data = []
        }
      },
      /**
       * 列表数据请求
       */
      getDataAction() {
        this.$get(this.api.getAppApi)
          .then(response => {
            this.tableLoading = false
            Util.processRes(response, () => {
              this.table.init = response.data ? Util.deepCopyDelChildrenNull(response.data) : []
              console.log(this.table.init)
              this.table.expandedRowKeys = Util.getIds(response.data)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false
          })
      },
      expand(e,item) {
        e = !e
        if(e){
          this.table.expandedRowKeys.splice(this.table.expandedRowKeys.findIndex(i => i == item.id), 1)
        }else{
          this.table.expandedRowKeys.push(item.id)
        }
      },
      showPowerModal() {
        this.Visible = true;
        this.$nextTick(()=>{
          this.$refs['TransferModal'].initSub(this.$get(this.api.getRoleLicenseApi, {roleId: this.currentId}),'appResourceId')
        })
      },
      // 角色授权
      setApply(val) {
        let licenseIds = []
        val.length && val.forEach(item => {
          licenseIds.push(item.id)
        })
        this.$postParams(this.api.setRoleLicenseApi, {
          orgId: this.orgId ? this.orgId : this.curr_org.id,
          roleId: this.currentId,
          resourceIds: licenseIds.join(',')
        })
          .then(response => {
            Util.processRes(response, () => {
              this.getRoleLicense()
            })
            Util.processError(this, response)
          })
          .catch(res => {
          })
      },
      // 复选框select change
      onSelectChange(selectedRowKeys, selectedRows) {
        let disValue = false;
        if (selectedRowKeys.length > 0) {
          disValue = false;
        } else {
          disValue = true;
        }
        this.table.selectedRowKeys = selectedRowKeys;
        let obj = {
          type: "power",
          disValue: disValue,
          selectedRowKeys: selectedRowKeys
        };
        this.$emit("toggleBtn", obj);
      },
      /**
       * 删除权限
       * @param id
       */
      remove() {
        this.$confirm({
          title: '删除',
          content: '确定要删除所选权限吗?',
          okText: '确 认',
          cancelText: '取 消',
          onOk: () => {
            this.$postParams(this.api.delRoleLicenseApi, {
              orgId: this.orgId ? this.orgId : this.curr_org.id,
              roleId: this.currentId,
              resourceIds: this.table.selectedRowKeys.join(',')
            })
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage)
                  this.getRoleLicense()
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
  };
</script>

<style lang="scss">
</style>
