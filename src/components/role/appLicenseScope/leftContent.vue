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
      <a-input-search placeholder="请输入角色名称搜索" v-model="params.name" @change="deb" @search="search">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-config" style="margin-top:-15px;margin-bottom:10px;">
          <a-form>
            <a-form-item v-bind="formItemLayout" label="角色属性" class="special-label">
              <a-radio-group v-model="params.roleType" @change="deb">
                <a-radio v-for="( roleType, index ) in roleTypes"
                         :value="roleType.dictionaryCode" :key="index + 'roleType'">{{ roleType.dictionaryName }}
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </div>
        <div class="table-table">
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 10}">
            <a-table
              :columns="table.columns"
              :pagination="false"
              :dataSource="table.data"
              size="middle"
              :scroll="{ y: table.height }"
              :customRow="rowClick"
              :rowClassName="rowClassName"
              rowKey="roleId"
            >
              <template slot="classifyType" slot-scope="text">
                <a href="javascript:;">{{ text == '1' ? '业务类' : '运营类' }}</a>
              </template>
            </a-table>
          </a-skeleton>
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
import OrgModal from "@/select/OrgModal"; //组织组件
import debounce from 'lodash.debounce'
import { mapState } from "vuex";
export default {
  name: "TenantAppLicense",
  components: {
    Pagination,
    OrgModal
  },
  props: {
    selected: {
      type: String,
      default: ''
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
        getRoleApi: Util.orgServer + '/web/role-info/scope'
      },
      Visible: false,
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      table: {
        loading: false,
        height: null,
        id: null,
        columns: [
          {
            title: "角色分类属性",
            dataIndex: "classifyType",
            width: 150,
            scopedSlots: { customRender: "classifyType" }
          },
          {
            title: "角色名称",
            width: 150,
            dataIndex: "name"
          },
          {
            title: "编制组织",
            width: 150,
            dataIndex: "orgName"
          }
        ],
        data:[]
      },
      pagination: { //分页参数
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      params: {  // 请求参数
        current: 1,
        size: 10,
        name: undefined,
        orgId: undefined,
        roleType: '1',
        classifyType: '2'
      }
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org,
      roleTypes: state => state.dicts.ROLE_ATTRIBUTE,
    }),
  },
  created() {
    this.params.orgId = this.curr_org.id
    this.getDataAction()
  },
  mounted() {
    this.table.height = document.body.clientHeight - 410 ;
    window.onresize = () => {
      this.table.height = document.body.clientHeight - 410 ;
    };

    //默认选中第一行
    // this.table.id = this.table.data[0]["id"];
    // this.$emit("handleRow", this.table.id);
    // this.rowClick(this.table.data[0]);
    // this.rowClassName(this.table.data[0]);
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
      this.pagination.pageNo = pageNo
      this.getDataAction(pageNo, pageSize)
    },
    /**
     * 每页条数变化回调
     * @param pageNo  页码
     * @param pageSize  每页多少条
     */
    onShowSizeChangePage(pageNo, pageSize) {
      // 重新请求数据
      this.pagination.pageSize = pageSize
      this.getDataAction(pageNo, pageSize)
    },
    /**
     * 列表数据请求
     */
    getDataAction(pageNo = 1, pageSize = 10) {
      this.params.current = pageNo
      this.params.size = pageSize
      this.$post(this.api.getRoleApi, this.params)
        .then(response => {
          this.tableLoading = false
          Util.processRes(response, () => {
            this.table.data = response.data.records ? response.data.records : []
            this.pagination.totalCount = Number(response.data.total)
          })
          Util.processError(this, response)
        })
        .catch(res => {
          this.tableLoading = false
          console.log(res)
        })
    },
    //table行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.table.id = record.roleId;

          }
        }
      };
    },
    //table行class
    rowClassName(record, index) {
      let className = "";
      if (record.roleId == this.table.id) {
        className = "rowActive";
        this.is_check = true;
        this.$emit('change', this.table.id)
      }
      return className;
    },
    //加载右边的表格
    updateRightTable(id) {}
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
