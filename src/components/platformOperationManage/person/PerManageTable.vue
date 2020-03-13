/*
 * @Autor: 何景春
 * @Version: 1.0.1
 * @Date: 2019-10-23 10:59:51
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-10-24 09:43:01
 * @Description:  参建单位人员 -- table
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <div class="search-lower">
        <div class="flex justify-between">
          <div class="table-config">
            <a-button class="m-r-10" type="primary" v-waves :disabled="!isCheck" @click="addUserHanle">新增人员</a-button>
            <a-button class="m-r-10" type="primary" v-waves @click="importUserHanle" disabled>批量导入</a-button>
            <a-button
              class="m-r-10"
              type="primary"
              v-waves
              @click="moveUserHanle(1)"
              disabled
            >邀请人员注册</a-button>
            <!-- <a-button type="primary" v-waves @click="moveUserHanle(2)" :disabled="!hasSelected">人员兼任</a-button> -->
          </div>
          <div class="table-search">
            <a-input-search
              class="search"
              placeholder="请输入搜索关键字"
              v-model="params.search"
              @search="searchList"
              @change="deb"
              enterButton="搜索"
            />
            <!-- <a
              class="m-l-20 align-center flex"
              style="width:50px"
              @click="toggleSlide"
            >{{showAdvancedSearch?"收起":"展开"}}</a>-->
          </div>
        </div>
      </div>
      <!-- <collapse>
        <div class="search-heigh" v-show="showAdvancedSearch">
          <a-form layout="vertical">
            <a-row :gutter="20">
              <a-col :span="3">
                <a-form-item label="是否包含下级组织">
                  <div class="flex align-center" style="height:32px;">
                    <a-radio-group
                      :options="radioGroup.data"
                       @change="deb"
                      :defaultValue="radioGroup.defaultValue"
                    />
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="岗位序列">
                  <a-select
                    v-model="searchParam.order"
                    style="width: 100%"
                    @change="deb"
                  >
                   <a-select-option
                value=""
              >全部</a-select-option>
                   <a-select-option
                v-for="( postSequence, index ) in postSequences"
                :value="postSequence.dictionaryCode"
                :key="index + 'dept'"
              >{{ postSequence.dictionaryName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="任职状态">
                  <a-select
                    defaultValue="0"
                    v-model="params.status"
                    style="width: 100%"
                    @change="deb"
                  >
                    <a-select-option value="0">直属</a-select-option>
                    <a-select-option value="1">隶属</a-select-option>
                    <a-select-option value="2">注销</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </collapse>-->
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <div class="table-table">
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              :dataSource="table.data"
              :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
              :pagination="false"
              :scroll="{ y: table.height }"
              rowKey="id"
              size="middle"
            >
              <template slot="name" slot-scope="text,record">
                <!-- 隶属 -->
                <span v-if="record.status==1">
                  <span class="m-r-10">{{text}}</span>
                  <a-tag color="#485EA6">隶属</a-tag>
                </span>
                <span v-else>
                  <span class="m-r-10">{{text}}</span>
                </span>
              </template>
              <template slot="sex" slot-scope="text">{{text==0 ? '男' : '女'}}</template>
              <template slot="action" slot-scope="text,record">
                <span
                  class="pointer m-r-10"
                  @click="editHandle(record)"
                  title="编辑"
                  v-if="record.status!=2"
                >
                  <icon-font type="spm-icon-shangyicopy4" />
                </span>
                <span class="m-r-10 pointer" @click="lookHandle(record)" title="查看">
                  <icon-font type="spm-icon-shangyicopy5" />
                </span>
                <span
                  class="m-r-10 pointer"
                  @click="record.status==2?logOffHandle(record,0):logOffHandle(record,2)"
                  :title="record.status==2?'复职':'注销'"
                >
                  <icon-font :type="record.status==2?'spm-icon-fuzhi':'spm-icon-zhuxiao'" />
                </span>
              </template>
            </a-table>
          </a-skeleton>
        </div>
        <div class="table-pagination">
          <Pagination
            :total="pagination.total"
            :pageSize="pagination.pageSize"
            :current="pagination.pageNo"
            @onChange="onChangePage"
            @onShowSizeChange="onShowSizeChangePage"
          ></Pagination>
        </div>
      </div>
    </div>
    <add-permanage ref="addUserModal" @change="userChange" :orgMsg="orgData"></add-permanage>
    <perManage-info-modal ref="UserInfoModal"></perManage-info-modal>
    <!-- <org-dept-post-modal
      :isVisible="deptPostSelect"
      @closed="deptPostSelect = false"
      @change="setDeptPostValue"
      :title="title"
      :multiple="false"
    ></org-dept-post-modal>-->
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import Pagination from "@/Pagination";
import AddPerManage from "./AddPerManage";
import PerManageInfo from "./PerManageInfo";
// import collapse from "#/assets/js/collapse.js"; //伸缩组件
// import OrgDeptPostModal from "./OrgDeptPostModal";
import { mapState } from "vuex";
export default {
  name: "perManageTable",
  components: {
    Pagination,
    // collapse,
    "add-permanage": AddPerManage, //新增、编辑 人员
    "perManage-info-modal": PerManageInfo //  用户信息查看
    // "org-dept-post-modal": OrgDeptPostModal //组织部门岗位 选择
  },
  props: {
    // 选中回调组织  部门 信息
    orgData: Object
  },
  data() {
    return {
      Util,
      api: {
        list: Util.orgServer + "/web/member/search", // 获取列表 信息
        status: Util.orgServer + "/web/member/update-status", // 修改状态
        transfer: Util.orgServer + "/web/member/transfer", //人员调动
        parttimeJob: Util.orgServer + "/web/member/parttime-job" // 人员兼职
      },
      loading: true,
      // showAdvancedSearch:true,
      // deptPostSelect: false,
      // title: "人员调用",
      // btnType: 1, //1 人员调用   2 人员兼职
      // radioGroup: {
      //   data: [{ label: "是", value: "1" }, { label: "否", value: "2" }],
      //   defaultValue: "2"
      // },
      table: {
        loading: false,
        columns: [
          // 列表头部配置表
          {
            title: "人员编码",
            dataIndex: "personNo",
            width: 100
          },
          {
            title: "姓名",
            dataIndex: "name",
            width: 100,
            scopedSlots: {
              customRender: "name"
            }
          },
          {
            title: "性别",
            dataIndex: "sex",
            width: 100,
            scopedSlots: {
              customRender: "sex"
            }
          },
          {
            title: "手机号",
            dataIndex: "phone",
            width: 150
          },
          {
            title: "用户账号",
            dataIndex: "userNum",
            width: 150
          },
          {
            title: "状态",
            dataIndex: "status",
            width: 100
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 200,
            scopedSlots: {
              customRender: "action"
            }
          }
        ],
        data: [],
        height: 200,
        selectedRowKeys: [] //人员 Id
      },
      pagination: {
        totalCount: 0,
        pageSize: 10,
        pageNo: 1
      },
      // searchParam:{

      // },
      params: {
        id: undefined,
        type: undefined,
        search: "",
        current: 1,
        size: 10,
        status: "0"
      }
    };
  },
  computed: {
    ...mapState({
      postSequences: state => state.dicts.JOB_SEQUENCE
    }),
    hasSelected() {
      return this.table.selectedRowKeys.length > 0;
    },
    isCheck() {
      return (
        this.orgData.deptId &&
        this.orgData.deptId != "" &&
        this.orgData.type == 100
      );
    }
  },
  created() {
    // this.changeTableHeight();
    this.table.height = document.body.clientHeight - 450;
    window.onresize = () => {
      // this.changeTableHeight();
      this.table.height = document.body.clientHeight - 450;
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    orgData: {
      handler(val, oldVal) {
        // console.log(val);
        this.search = "";
        this.getData();
      },
      deep: true
    }
  },
  methods: {
    // 搜索
    deb: debounce(function() {
      this.getData();
    }, 300),
    searchList() {
      this.getData();
    },
    // /** 高级搜索条件*/
    // toggleSlide() {
    //   this.showAdvancedSearch = !this.showAdvancedSearch;
    //   this.changeTableHeight();
    // },
    // /*改变table的高度*/
    // changeTableHeight() {
    //   if (this.showAdvancedSearch) {
    //     this.table.height = document.body.clientHeight - 450;
    //   } else {
    //     this.table.height = document.body.clientHeight - 450 + 54 + 50;
    //   }
    // },
    // 获取列表数据
    getData(pageNo = 1, pageSize = 10) {
      this.table.loading = true;
      this.params.type = this.orgData.type;
      if (this.orgData.type == 100) {
        this.params.id = this.orgData.deptId;
      } else {
        this.params.id = this.orgData.orgId;
      }
      this.params.current = pageNo;
      this.params.size = pageSize;
      this.$get(this.api.list, this.params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            this.pagination.totalCount = parseInt(res.data.total);
            this.table.data = res.data.records ? res.data.records : [];
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    // 分页选择第几页
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      this.getData(pageNo, pageSize);
    },
    // 分页选择 展示多少条数据
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageSize = pageSize;
      this.getData(pageNo, pageSize);
    },

    // 新增人员
    addUserHanle() {
      const modal = {
        title: "新增人员",
        type: 1
      };
      this.$refs.addUserModal.modalInit(modal);
    },
    // 导入人员
    importUserHanle() {},
    // 人员调用 人员兼职
    // moveUserHanle(e) {
    //   this.deptPostSelect = true;
    //   this.btnType = e;
    //   this.title = Number(e) === 1 ? "人员调用" : "人员兼职";
    // },
    // table 编辑
    editHandle(record) {
      // console.log(record);
      const modal = {
        title: "编辑人员",
        type: 2,
        id: record.id
      };
      this.$refs.addUserModal.modalInit(modal);
    },
    // 新增编辑人员 数据 刷新 回调
    userChange(e) {
      this.getData();
    },
    // 查看
    lookHandle(record) {
      // console.log(record);
      this.$refs.UserInfoModal.handleOpen(record.id);
    },
    // 注销
    logOffHandle(record, status) {
      let textHead = status == 0 ? "复职" : "注销";
      this.$confirm({
        title: textHead,
        content: "确定要" + textHead + "该人员吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          const params = {
            id: record.id,
            status: status
          };

          this.$postParams(this.api.status, params)
            .then(response => {
              this.loading = false;
              Util.processRes(response, res => {
                this.$message.success(textHead + "成功！");
                this.getData();
              });
              Util.processError(this, response);
            })
            .catch(res => {
              this.loading = false;
              Util.processError(this, res);
            });
        },
        onCancel: () => {}
      });
    },
    // 岗位序列
    // postSelect() {},
    // 任职状态选择
    // statusSelect() {},
    // 复选框select change
    onSelectChange(selectedRowKeys, selectedRows) {
      // console.log(selectedRowKeys, selectedRows);
      this.table.selectedRowKeys = selectedRowKeys;
    },

    // 是否包含下级组织
    showSubTableData(type) {
      console.log(type.target.value);
    }
    // 选择部门岗位 回调
    // setDeptPostValue(e) {
    //   // console.log(e);
    //   const memberArr = Util.deepCopy(this.table.selectedRowKeys);
    //   const params = {
    //     memberId: memberArr.join(","),
    //     orgId: e.orgId,
    //     depId: e.deptId,
    //     postId: e.postId
    //   };
    //   // console.log(params);
    //   switch (Number(this.btnType)) {
    //     case 1:
    //       this.userMoveSubmit(this.api.transfer, params);
    //       break;
    //     case 2:
    //       this.userMoveSubmit(this.api.parttimeJob, params);
    //       break;
    //   }
    // },
    // 人员调动、人员兼职  数据请求
    // userMoveSubmit(url, params) {
    //   // console.log(params);
    //   this.$postParams(url, params)
    //     .then(response => {
    //       this.loading = false;
    //       Util.processRes(response, res => {
    //         // console.log(response);
    //         this.table.selectedRowKeys = [];
    //         this.getData();
    //       });
    //       Util.processError(this, response);
    //     })
    //     .catch(res => {
    //       this.loading = false;
    //       Util.processError(this, res);
    //     });
    // }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
