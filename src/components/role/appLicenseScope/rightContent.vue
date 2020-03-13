/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户应用范围授权
</comment>
<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="flex justify-between">
        <div class="table-config">
          <span>
            <a-button
              type="primary"
              v-waves
              style="margin-right:7px;"
              :disabled="!currentId"
              @click="selectPower"
            >选择应用</a-button>
            <a-button
              v-waves
              style="margin-left:0px;"
              :disabled="table.selectedRowKeys.length ? false : true "
              @click="remove"
            >删除</a-button>
          </span>
        </div>
        <div class="table-search flex">
          <span>
            <a-input-search placeholder="按权限名称搜索" v-model="params.keyword" @change="deb" @search="search">
              <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
            </a-input-search>
          </span>
        </div>
      </div>
    </div>
    <div class="pannel-content">
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
              :expandedRowKeys="table.expandedRowKeys"
              @expand="expand"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
            >
              <template slot="time" slot-scope="text,record">
                {{ Util.getValueByKey(licenseDetail, 'authId', 'createTime', record.appResourceId) |
                formatTime('yyyy-MM-dd hh:mm') }}
              </template>
              <template slot="user" slot-scope="text,record">
                {{ Util.getValueByKey(licenseDetail, 'authId', 'createUser', record.appResourceId) }}
              </template>
            </a-table>
          </a-skeleton>
        </div>
        <TransferModal
          ref="TransferModal"
          :isVisible="Visible"
          @closed="Visible = false"
          @change="setApply"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import TransferModal from "@/select/TransferModal"; //穿梭组件
  import {mapState} from "vuex";
  import debounce from 'lodash.debounce'

  export default {
    components: {
      TransferModal
    },
    props: {
      currentId: {
        //左侧table当前选中的租户
        type: String,
        default: ""
      }
    },
    data() {
      return {
        Util,
        api: {
          getAppLicenseApi: Util.orgServer + "/web/role-auth-resource/list",
          getAppApi: Util.orgServer + "/web/resource/tree", // 查询应用列表
          setRoleLicenseApi: Util.orgServer + "/web/role-auth-resource/add-resources",
          delRoleLicenseApi: Util.orgServer + "/web/role-auth-resource/remove-resources"
        },
        disDel: true, //删除按钮是否不能点击
        powerObj: {
          disDel: true,
          disSelect: true,
          selectedRowKeys: []
        },
        Visible: false,
        table: {
          loading: false,
          height: 352,
          expandedRowKeys: [],
          id: null,
          selectedRowKeys: [],
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
        licenseDetail: [],
        params: {
          keyword: ''
        }
      };
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org
      })
    },
    created() {
      this.getDataAction();
    },
    mounted() {
      this.table.height = document.body.clientHeight - 325;
      window.onresize = () => {
        this.table.height = document.body.clientHeight - 325;
      };
    },
    watch: {
      currentId: {
        handler(val, oldVal) {
          this.search();
        }
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
        if (this.params.keyword) {
          this.table.data = Util.treeSearch(this.params.keyword, 'name', this.table.init)
          this.expandedRowKeys = Util.getIds(this.table.data)
        } else {
          this.getAppLicense()
        }
      },

      /**
       * 列表数据请求
       */
      getDataAction() {
        this.$get(this.api.getAppApi)
          .then(response => {
            this.tableLoading = false;
            Util.processRes(response, () => {
              this.table.init = response.data ? response.data : []
              this.table.expandedRowKeys = Util.getIds(response.data)
            })
            Util.processError(this, response)
          })
          .catch(res => {
            this.tableLoading = false;
            console.log(res);
          });
      },
      getAppLicense() {
        if (this.currentId) {
          this.$get(this.api.getAppLicenseApi, {
            orgId: this.curr_org.id,
            roleId: this.currentId
          })
            .then(response => {
              Util.processRes(response, () => {
                if (response.data && response.data.length) {
                  let licenseIds = [];
                  response.data.forEach(item => {
                    if (!licenseIds.includes(item.appResourceId)) {
                      licenseIds.push(item.appResourceId);
                    }
                  })
                  this.licenseDetail = response.data
                  this.table.data = Util.treeSearchByIds(licenseIds, this.table.init)
                  this.table.expandedRowKeys = Util.getIds(this.table.data)
                } else {
                  this.table.data = []
                }
              });
              Util.processError(this, response);
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          this.table.data = [];
        }
      },
      setApply(val) {
        let licenseIds = [];
        val.length &&
        val.forEach(item => {
          licenseIds.push(item.id);
        });
        this.$postParams(this.api.setRoleLicenseApi, {
          orgId: this.curr_org.id,
          roleId: this.currentId,
          resourceIds: licenseIds.join(",")
        })
          .then(response => {
            Util.processRes(response, () => {
              this.getAppLicense();
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
          });
      },
      selectPower() {
        this.Visible = true;
        this.$nextTick(() => {
          this.$refs["TransferModal"].initSub(
            this.$get(this.api.getAppLicenseApi, {
              orgId: this.curr_org.id,
              roleId: this.currentId
            }),
            "appResourceId"
          );
        });
      },
      searchList() {
      },
      // 复选框select change
      onSelectChange(selectedRowKeys, selectedRows) {
        console.log(selectedRowKeys, selectedRows);
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
      expand(e, item) {
        e = !e
        if (e) {
          this.table.expandedRowKeys.splice(this.table.expandedRowKeys.findIndex(i => i == item.id), 1)
        } else {
          this.table.expandedRowKeys.push(item.id)
        }
      },
      /**
       * 删除权限
       * @param id
       */
      remove() {
        this.$confirm({
          title: "删除",
          content: "确定要删除所选权限吗?",
          okText: "删 除",
          okType: "danger",
          cancelText: "取 消",
          onOk: () => {
            this.$postParams(this.api.delRoleLicenseApi, {
              orgId: this.curr_org.id,
              roleId: this.currentId,
              resourceIds: this.table.selectedRowKeys.join(",")
            })
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage);
                  this.getAppLicense();
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
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
