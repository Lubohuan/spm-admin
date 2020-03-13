/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户应用授权
</comment>
<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="flex justify-between">
        <div class="table-config">
          <a-button
            type="primary"
            @click="openTransfer"
            style="margin-right:7px;"
            :disabled="!currentId"
            v-waves
          >应用授权</a-button>
          <a-button
            v-waves
            style="margin-left:0px;"
            :disabled="table.selectedRowKeys.length ? false : true"
            @click="remove"
          >解除权限</a-button>
        </div>
        <div class="table-search flex">
          <a-input-search
            placeholder="按权限名称搜索"
            v-model="params.keyword"
            @change="deb"
            @search="search"
          >
            <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
          </a-input-search>
        </div>
      </div>
    </div>
    <div class="pannel-content">
      <div class="table-box-special">
        <div class="table-table">
          <a-table
            size="middle"
            rowKey="id"
            :locale="{emptyText: '暂无数据'}"
            :pagination="false"
            :columns="table.columns"
            :dataSource="table.data"
            :expandedRowKeys="table.expandedRowKeys"
            @expand="expand"
            :loading="table.loading"
            :scroll="{ x:800,y: table.height }"
            :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange,
            getCheckboxProps:  record => ({
              props: {
                disabled: record.type === 'group', // Column configuration not to be checked
              }
            })}"
          >
            <template
              slot="time"
              slot-scope="text,record"
            >{{ Util.getValueByKey(licenseDetail, 'authId', 'grantTime', record.id) | formatTime('yyyy-MM-dd hh:mm') }}</template>
            <template
              slot="user"
              slot-scope="text,record"
            >{{ Util.getValueByKey(licenseDetail, 'authId', 'userName', record.id) }}</template>
          </a-table>
        </div>
      </div>
    </div>
    <transfer-modal
      ref="TransferModal"
      v-if="isVisible"
      :isVisible="isVisible"
      @closed="isVisible = false"
      @change="setApply"
    ></transfer-modal>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import TransferModal from "@/select/TransferModal";

export default {
  components: {
    "transfer-modal": TransferModal
  },
  props: {
    currentId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      Util,
      api: {
        getAppLicenseApi: Util.operationServer + "/web/tenant-grant/details", // 租户权限详情
        getAppApi: Util.orgServer + "/web/resource/tree", // 查询应用列表
        setAppLicenseApi: Util.operationServer + "/web/tenant-grant/add", // 租户新增权限
        delAppLicenseApi: Util.operationServer + "/web/tenant-grant/delete" // 解除权限
      },
      disApply: true, //授权按钮是否不能点击
      disDel: true, //删除按钮是否不能点击
      table: {
        loading: false,
        height: null,
        expandAllRows: true,
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
            width: "20%",
            scopedSlots: {
              customRender: "user"
            }
          },
          {
            title: "授权时间",
            dataIndex: "time",
            width: "30%",
            scopedSlots: {
              customRender: "time"
            }
          }
        ],
        init: [],
        data: [],
        expandedRowKeys: []
      },
      isVisible: false,
      licenseDetail: [],
      params: {
        keyword: ""
      }
    };
  },
  computed: {},
  created() {
    this.getDataAction();
  },
  mounted() {
    this.table.height = document.body.clientHeight - 450 + 54 + 50 + 65;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 450 + 54 + 50 + 65;
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
    deb: debounce(
      function() {
        // 搜索方法
        this.search();
      },
      1000 // 延迟时间
    ),
    /**
     * 搜索
     */
    search() {
      if (this.params.keyword) {
        this.table.data = Util.treeSearch(
          this.params.keyword,
          "name",
          this.table.init
        );
        this.expandedRowKeys = Util.getIds(this.table.data);
      } else {
        this.getAppLicense();
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
            this.table.init = response.data ? response.data : [];
            this.table.expandedRowKeys = Util.getIds(response.data);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.tableLoading = false;
          console.log(res);
        });
    },
    /**
     * 获取授权详情
     */
    getAppLicense() {
      // this.table.data = Util.treeSearchByIds(['b2291ebc7d50411d8666e3eb0fdc0fb3'],this.table.init)
      this.$get(this.api.getAppLicenseApi, { tenantId: this.currentId })
        .then(response => {
          Util.processRes(response, () => {
            if (response.data && response.data.length) {
              let licenseIds = [];
              response.data.forEach(item => {
                if (!licenseIds.includes(item.authId)) {
                  licenseIds.push(item.authId);
                }
              });
              this.licenseDetail = response.data;
              this.table.data = Util.treeSearchByIds(
                licenseIds,
                this.table.init
              );
              this.table.expandedRowKeys = Util.getIds(this.table.data);
            } else {
              this.table.data = [];
              this.table.expandedRowKeys = [];
              this.licenseDetail = [];
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
        });
    },
    expand(e, item) {
      e = !e;
      if (e) {
        this.table.expandedRowKeys.splice(
          this.table.expandedRowKeys.findIndex(i => i == item.id),
          1
        );
      } else {
        this.table.expandedRowKeys.push(item.id);
      }
    },
    //更新列表
    updateTable(id) {
      if (id) {
        this.disApply = false;
        this.currentId = id;
      } else {
        this.disApply = true;
      }
    },
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRowKeys, selectedRows);
      if (selectedRowKeys.length > 0) {
        this.disDel = false;
      } else {
        this.disDel = true;
      }
      this.table.selectedRowKeys = selectedRowKeys;
    },
    /**
     * 授权
     */
    setApply(val) {
      console.log(val);
      let appLicenseIds = [];
      val.length &&
        val.forEach(item => {
          appLicenseIds.push(item.id);
        });
      this.$post(this.api.setAppLicenseApi, {
        tenantId: this.currentId,
        ids: appLicenseIds
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
    openTransfer() {
      this.isVisible = true;
      this.$nextTick(() => {
        this.$refs["TransferModal"].initSub(
          this.$get(this.api.getAppLicenseApi, { tenantId: this.currentId }),
          "authId"
        );
      });
    },
    /**
     * 删除权限
     * @param id
     */
    remove() {
      this.$confirm({
        title: "删除",
        content: "确定要删除所选权限吗?",
        okText: "确 认",
        cancelText: "取 消",
        onOk: () => {
          this.$post(this.api.delAppLicenseApi, {
            ids: this.table.selectedRowKeys,
            tenantId: this.currentId
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
        onCancel: () => {}
      });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
