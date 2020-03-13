/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  租户基本信息
</comment>
<template>
  <a-modal
    v-model="visible"
    class="ModalApplyTotal"
    centered
    :width="800"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">应用授权情况</template>
    <div class="pannel">
      <div class="pannel-title">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button type="primary" @click="openTransfer" style="margin-right:7px;" v-waves>应用授权</a-button>
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
          <div class="table-table" style="height:600px">
            <a-skeleton active :loading="table.loading" :paragraph="{rows: 8}">
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
                :scroll="{ x:600,y: 600 }"
                :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange,
            getCheckboxProps:  record => ({
              props: {
                disabled: record.type === 'group', // Column configuration not to be checked
              }
            })}"
              >
                <template slot="time" slot-scope="text,record">
                  {{ Util.getValueByKey(licenseDetail, 'authId', 'grantTime', record.id) | formatTime('yyyy-MM-dd hh:mm')
                  }}
                </template>
                <template
                  slot="user"
                  slot-scope="text,record"
                >{{ Util.getValueByKey(licenseDetail, 'authId', 'userName', record.id) }}</template>
              </a-table>
            </a-skeleton>
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
  </a-modal>
</template>

<script>
import debounce from "lodash.debounce";
import TransferModal from "@/select/TransferModal";

export default {
  components: {
    "transfer-modal": TransferModal
  },
  data() {
    return {
      Util,
      api: {
        getAppLicenseApi: Util.adminServer + "/system-grant/list", // 租户权限详情
        getAppApi: Util.orgServer + "/web/resource/get-role-resource", // 查询应用列表
        setAppLicenseApi: Util.adminServer + "/system-grant/grant", // 租户新增权限
        delAppLicenseApi: Util.adminServer + "/system-grant/delete " // 解除权限
      },
      visible: false,
      currentRowData: null,
      disApply: true, //授权按钮是否不能点击
      disDel: true, //删除按钮是否不能点击
      table: {
        loading: false,
        height: null,
        expandAllRows: true,
        id: null,
        resultData: [],
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
  created() {},
  mounted() {
    this.table.height = document.body.clientHeight - 450 + 54 + 50 + 65;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 450 + 54 + 50 + 65;
    };
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
    initSub() {},
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.currentRowData = rowData;
      this.params.keyword = "";
      this.getDataAction();
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
    },
    /**
     * 搜索
     */
    search() {
      if (this.params.keyword) {
        this.table.data = Util.treeSearch(
          this.params.keyword,
          "name",
          this.table.resultData
        );
        this.expandedRowKeys = Util.getIds(this.table.data);
      } else {
        this.getAppLicense();
      }
    },

    /**
     * 所有应用的列表数据请求
     */
    getDataAction() {
      this.table.loading = true;
      this.$get(this.api.getAppApi)
        .then(response => {
          //this.tableLoading = false;
          Util.processRes(response, () => {
            this.table.init = response.data ? response.data : [];
            this.getAppLicense();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          console.log(res);
        });
    },
    /**
     * 获取授权详情
     */
    getAppLicense(type) {
      this.table.loading = true;
      this.$get(this.api.getAppLicenseApi, { adminId: this.currentRowData.id })
        .then(response => {
          Util.processRes(response, () => {
            this.table.loading = false;
            if (response.data && response.data.length) {
              let licenseIds = [];
              response.data.forEach(item => {
                if (!licenseIds.includes(item.authId)) {
                  licenseIds.push(item.authId);
                }
              });
              this.licenseDetail = response.data;
              this.table.resultData = Util.treeSearchByIds(
                licenseIds,
                this.table.init
              );
              this.table.data = this.table.resultData;
              this.table.expandedRowKeys = Util.getIds(this.table.data);
            } else {
              this.table.data = [];
              this.table.expandedRowKeys = [];
              this.licenseDetail = [];
            }
            if (type == "config") {
              this.$emit("searchList");
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
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
      let appLicenseIds = [];
      val.length &&
        val.forEach(item => {
          appLicenseIds.push(item.id);
        });
      this.$post(this.api.setAppLicenseApi, {
        adminId: this.currentRowData.id,
        ids: appLicenseIds
      })
        .then(response => {
          if (response.statusCode == 200) {
            this.$message.success("授权成功");
            this.getAppLicense("config");
          } else {
            this.$message.error("授权失败");
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    openTransfer() {
      this.isVisible = true;
      this.$nextTick(() => {
        this.$refs["TransferModal"].initSub(
          this.$get(this.api.getAppLicenseApi, {
            adminId: this.currentRowData.id
          }),
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
            adminId: this.currentRowData.id
          })
            .then(response => {
              Util.processRes(response, () => {
                this.$message.success(response.statusMessage);
                this.getAppLicense("config");
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

