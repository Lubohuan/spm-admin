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
            style="margin-right:7px;"
            :disabled="!currentId"
            v-waves
            @click="selectSubItem"
          >选择分部分项</a-button>
          <a-button
            type="primary"
            style="margin-right:7px;"
            :disabled="!currentId||this.table.data.length<1"
            v-waves
            @click="applyOtherArea"
          >应用到其他区段</a-button>
          <!-- <a-button type="primary" style="margin-right:7px;" :disabled="disDel" v-waves>删除</a-button> -->
        </div>
        <div class="table-search flex">
          <a-input-search
            placeholder="请输入分部分项名称"
            v-model="params.keyword"
            @change="deb"
            @search="searchList"
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
            :pagination="false"
            :columns="table.columns"
            :dataSource="table.searchData"
            :expandedRowKeys="table.expandedRowKeys"
            @expand="expand"
            :loading="table.loading"
            :locale="{emptyText: '暂无数据'}"
            :scroll="{ x:800,y: table.height }"
            :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange,
            getCheckboxProps:  record => ({
              props: {
                disabled: record.type === 'group', // Column configuration not to be checked
              }
            })}"
          >
            <!-- 操作 -->
            <template slot="action" slot-scope="text, record, index">
              <div class="flex">
                <span
                  title="删除"
                  class="icon-btn"
                  :class="record.children?'disabled':''"
                  @click="record.children?'':remove(record)"
                  v-waves="{ type : 'center' }"
                >
                  <icon-font type="spm-icon-shanchu" />
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <CheckedTree
      v-if="Visible"
      :multiple="true"
      :isVisible="Visible"
      title="选择分部分项"
      ref="selectSubCheckedTree"
      modalType="single"
      apiType="selectSub"
      @closed="Visible = false"
      @change="setSubValue"
    ></CheckedTree>
    <CheckedTree
      :multiple="true"
      v-if="areaVisible"
      :isVisible="areaVisible"
      ref="selectAreaCheckedTree"
      title="应用到其他区段"
      modalType="single"
      apiType="selectArea"
      @closed="areaVisible = false"
      @change="setAreaValue"
    ></CheckedTree>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import debounce from "lodash.debounce";
import OrgModal from "@/select/OrgModal"; //组织组件
import CheckedTree from "@/select/CheckedTree"; //组织组件
export default {
  components: {
    OrgModal,
    CheckedTree
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
        wbsListApi: Util.wbsServer + "/web/wbs/wbs-project-area/tree",
        wbsDelApi: Util.wbsServer + "/web/wbs/wbs-project-area/delete-many",
        wbsAddApi: Util.wbsServer + "/web/wbs/wbs-project-area/add-many",
        wbsApplyApi:
          Util.wbsServer + "/web/wbs/wbs-project-area/copy-wbs-project-area",
        reShowSubApi:
          Util.wbsServer +
          "/web/wbs/wbs-project-area/get-wbs-project-ids-by-area-id"
      },
      Visible: false,
      areaVisible: false,
      disDel: true, //删除按钮是否不能点击
      table: {
        loading: false,
        height: null,
        expandAllRows: true,
        id: null,
        selectedRowKeys: [],
        columns: [
          {
            title: "分部分项名称",
            dataIndex: "name",
            key: "name",
            width: "80%"
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 100,
            scopedSlots: {
              filterDropdown: "filterDropdown",
              filterIcon: "operIcon",
              customRender: "action"
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
  computed: {
    ...mapState(["curr_org"])
  },
  created() {
    //this.searchList(true);
  },
  mounted() {
    this.table.height = document.body.clientHeight - 450 + 54 + 50 + 25;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 450 + 54 + 50 + 25;
    };
  },
  watch: {
    currentId: {
      handler(val, oldVal) {
        if (val) {
          this.searchList(true);
        }
      }
    }
  },
  methods: {
    /*选择分部分项*/
    selectSubItem() {
      this.Visible = true;
      this.$nextTick(() => {
        ///reShowSubAxios  选择分部分项的回显接口
        let reShowSubAxios = this.$get(this.api.reShowSubApi, {
          areaId: this.currentId
        });
        this.$refs["selectSubCheckedTree"].initSub(reShowSubAxios);
      });
    },
    /**应用到其他区段 */
    applyOtherArea() {
      this.areaVisible = true;
      this.$nextTick(() => {
        this.$refs["selectAreaCheckedTree"].initSub(this.currentId);
      });
    },
    //选择分部分项的确定按钮
    setSubValue(ids) {
      let result = [];
      ids.forEach((item, index) => {
        result.push({
          wbsProjectId: item,
          areaId: this.currentId
        });
      });
      this.setSubValueAjax(result);
      //   console.log(val);
    },
    /**
     * 选择分部分项的请求
     */
    setSubValueAjax(params) {
      this.$post(this.api.wbsAddApi, params)
        .then(response => {
          Util.processRes(response, res => {
            this.searchList(true);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    /**应用到其他区段的确定按钮 */
    setAreaValue(ids) {
      this.setAreaValueAjax(ids);
    },

    /**
     * 应用到其他区段的请求
     */
    setAreaValueAjax(ids) {
      let params = {
        copyAreaId: this.currentId,
        areaIds: ids
      };
      this.$post(this.api.wbsApplyApi, params)
        .then(response => {
          Util.processRes(response, res => {});
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * 监听input 执行debounce 延时1S后执行搜索方法
     */
    deb: debounce(
      function() {
        // 搜索方法
        this.searchList();
      },
      1000 // 延迟时间
    ),
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      //console.log(this.searchParam)
      let params = {
        areaId: this.currentId
      };
      this.$get(this.api.wbsListApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            if (response.data && response.data.length) {
              this.table.data = Util.dealData(response.data);
              this.table.searchData = Util.treeSearch(
                this.params.keyword,
                "name",
                this.table.data
              );
              isInit &&
                (this.table.expandedRowKeys = Util.getIds(
                  this.table.searchData
                ));
            } else {
              this.table.data = [];
              this.table.searchData = [];
              this.table.expandedRowKeys = [];
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
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
      if (selectedRowKeys.length > 0) {
        this.disDel = false;
      } else {
        this.disDel = true;
      }
      this.table.selectedRowKeys = selectedRowKeys;
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
    remove(record) {
      this.$confirm({
        title: "删除",
        content: "确定要删除所选吗?",
        okText: "确 认",
        cancelText: "取 消",
        onOk: () => {
          this.$post(this.api.wbsDelApi, [record.id])
            .then(response => {
              Util.processRes(response, () => {
                this.$message.success("删除成功！");
                this.searchList();
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
  destroyed() {
    window.onresize = null;
  }
};
</script>

<style lang="scss">
</style>
