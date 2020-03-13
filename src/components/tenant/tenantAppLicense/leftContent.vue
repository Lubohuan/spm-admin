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
      <a-input-search placeholder="请输入租户名称/租户编码" v-model="params.other" @change="deb">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-table">
          <a-table
            :columns="table.columns"
            :pagination="false"
            :dataSource="table.data"
            size="middle"
            :scroll="{x:300, y: table.height }"
            :loading="table.loading"
            :customRow="rowClick"
            :rowClassName="rowClassName"
            rowKey="id"
          >
            <template slot="name" slot-scope="text">
              <a href="javascript:;">{{text}}</a>
            </template>
          </a-table>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="pagination.totalCount"
            :pageSize="pagination.pageSize"
            :current="pagination.pageNo"
            @onChange="onChangePage"
            @onShowSizeChange="onShowSizeChangePage"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Pagination from "@/Pagination"; //分页组件
import debounce from "lodash.debounce";
export default {
  name: "TenantAppLicense",
  components: {
    Pagination
  },
  props: {
    selected: {
      type: String,
      default: ""
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
        getTenantApi: Util.operationServer + '/web/tenant-info/tenant-list'  // 获取租住列表
      },
      table: { // table 参数
        loading: false,
        height: null,
        id: null,
        columns: [ // 配置表头
          {
            title: "租户编码",
            dataIndex: "tenantCode",
            width: 150
          },
          {
            title: "租户名称",
            width: 150,
            dataIndex: "name"
          }
        ],
        data: [] // table 数据
      },
      pagination: { //分页参数
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      params: {  // 请求参数
        current: 1,
        size: 10,
        status: "3",
        other: undefined
      }
    };
  },
  computed: {},
  created() {
    this.getDataAction();
  },
  mounted() {
    this.table.height = document.body.clientHeight - 450;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 450;
    };

    //默认选中第一行
    // this.table.id = this.table.data[0]["id"];
    // this.rowClick(this.table.data[0]);
    // this.rowClassName(this.table.data[0]);
  },
  watch: {},
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
      this.getDataAction();
    },
    /**
     * 页数变化回调
     * @param pageNo  页码
     * @param pageSize  每页多少条
     */
    onChangePage(pageNo, pageSize) {
      // 重新请求数据
      this.pagination.pageNo = pageNo;
      this.getDataAction(pageNo, pageSize);
    },
    /**
     * 每页条数变化回调
     * @param pageNo  页码
     * @param pageSize  每页多少条
     */
    onShowSizeChangePage(pageNo, pageSize) {
      // 重新请求数据
      this.pagination.pageSize = pageSize;
      this.getDataAction(pageNo, pageSize);
    },
    /**
     * 列表数据请求
     */
    getDataAction(pageNo = 1, pageSize = 10) {
      this.params.current = pageNo;
      this.params.size = pageSize;
      this.$post(this.api.getTenantApi, this.params)
        .then(response => {
          this.tableLoading = false;
          Util.processRes(response, () => {
            this.table.data = response.data.records
              ? response.data.records
              : [];
            this.pagination.totalCount = Number(response.data.total);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.tableLoading = false;
          console.log(res);
        });
    },

    //table行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.table.id = record.id;
          }
        }
      };
    },
    //table行class
    rowClassName(record, index) {
      let className = "";
      if (record.id == this.table.id) {
        className = "rowActive";
        this.is_check = true;
        this.$emit("change", this.table.id);
      }
      return className;
    },
    //加载右边的表格
    updateRightTable(id) {},
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
