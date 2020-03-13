/**
* @Author: 李晨光
* @Date: 2019/8/16
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/16
**/
<comment>
  # 组件注释
  账户管理
</comment>
<template>
  <div id="AccountManage" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content">
      <div class="pannel">
        <div class="pannel-title">
          <div class="search-lower">
            <div class="flex justify-between">
              <div class="table-config">
                <a-radio-group class="m-r-10" defaultValue="a" buttonStyle="solid">
                  <a-radio-button value="a">包含下级组织</a-radio-button>
                  <a-radio-button value="b">不包含下级组织</a-radio-button>
                </a-radio-group>
              </div>
              <div class="table-search flex">
                <a-input-search
                  placeholder="请输入用户姓名/用户账号/手机号"
                  v-model="searchParam.keyword"
                  @change="deb"
                  @search="searchList(true)"
                >
                  <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
                </a-input-search>
              </div>
            </div>
          </div>
        </div>
        <div class="pannel-content">
          <div class="table-box">
            <div class="table-table">
              <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
                <a-table
                  :locale="{emptyText: '暂无数据'}"
                  :columns="table.columns"
                  :pagination="false"
                  :dataSource="table.data"
                  size="middle"
                  :scroll="{x:1200, y: table.height }"
                  rowKey="id"
                >
                  <template slot="state" slot-scope="text,record">
                    <a href="javascript:;">{{record.state==0?'启用':'停用'}}</a>
                  </template>
                  <template slot="personNo" slot-scope="text,record">
                    <a href="javascript:;">{{record.phone}}</a>
                  </template>
                  <!-- 操作 -->
                  <template slot="action" slot-scope="text, record">
                    <div class="flex">
                      <!-- :class="'disabled'" -->
                      <span
                        class="icon-btn"
                        :class="record.state==1?'disabled':''"
                        title="编辑"
                        @click="record.state==0?editAccount(record):null"
                      >
                        <icon-font type="spm-icon-shangyicopy4"/>
                      </span>
                      <span title="查看" class="icon-btn" @click="seeDetails(record)">
                        <icon-font type="spm-icon-shangyicopy5"/>
                      </span>
                      <a-dropdown placement="bottomRight">
                        <span class="icon-btn">
                          <icon-font type="spm-icon-copy19"/>
                        </span>
                        <a-menu slot="overlay">
                          <a-menu-item
                            :disabled="record.state==1?true:false"
                            @click="sTopUseAccount(record)"
                          >
                            <span>停用</span>
                          </a-menu-item>
                          <a-menu-item
                            :disabled="record.state==0?true:false"
                            @click="startUseAccount(record)"
                          >
                            <span>启用</span>
                          </a-menu-item>
                          <a-menu-item
                            :disabled="record.state==1?true:false"
                            @click="resetPassword(record)"
                          >
                            <span>重置密码</span>
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>
                    </div>
                  </template>
                  <div
                    slot="filterDropdown"
                    slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                    class="custom-filter-dropdown"
                  >
                    <a-checkbox-group
                      :options="table.plainOptions"
                      v-model="table.operValue"
                      @change="operChange"
                    />
                  </div>
                  <icon-font
                    slot="operIcon"
                    slot-scope="filtered"
                    type="spm-icon-setting"
                    :style="{ color: filtered ? '#111' : undefined }"
                    style="border-left:1px solid #ddd"
                  />
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
    </div>
    <ModalEditAccount ref="ModalEditAccount" @searchList="searchList"/>
    <ModalAccountMessage ref="ModalAccountMessage"/>
  </div>
</template>

<script>
  import debounce from "lodash.debounce";
  import Title from "@/Title";
  import Pagination from "@/Pagination";
  import ModalEditAccount from "@/user/accountManage/ModalEditAccount";
  import ModalAccountMessage from "@/user/accountManage/ModalAccountMessage";

  export default {
    name: "AccountManage",
    components: {
      Pagination,
      Title,
      ModalEditAccount,
      ModalAccountMessage
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          searchMemberApi: Util.orgServer + "/web/member/user-search", // 列表
          updateUserStateApi: Util.orgServer + "/web/member/update-user-state", // 列表
          recoverPasswordApi: Util.passportServer + "/web/user/recover-password" // 重置密码
        },
        table: {
          loading: false,
          height: null,
          columns: [],
          data: [],
          plainOptions: [
            // 列表头部配置选项
            {label: "用户名称", value: 0},
            {label: "用户账号", value: 1},
            {label: "所属组织", value: 2},
            {label: "手机号", value: 3},
            {label: "邮箱", value: 4},
            {label: "状态", value: 5}
          ],
          operValue: [0, 1, 2, 3, 4, 5], // 列表头部默认配置
          initColumns: {
            // 列表头部配置表
            0: {
              title: "用户名称",
              dataIndex: "name"
            },
            1: {
              title: "用户账号",
              dataIndex: "phone",
              width: 200
            },
            2: {
              title: "所属组织",
              dataIndex: "orgName",
              width: 200
            },
            3: {
              title: "手机号",
              dataIndex: "personNo",
              width: 200,
              scopedSlots: {customRender: "personNo"}
            },
            4: {
              title: "邮箱",
              dataIndex: "mail",
              width: 250
            },
            5: {
              title: "状态",
              dataIndex: "state",
              width: 150,
              scopedSlots: {customRender: "state"}
            },
            6: {
              title: "操作",
              dataIndex: "operation",
              width: 150,
              scopedSlots: {
                filterDropdown: "filterDropdown",
                filterIcon: "operIcon",
                customRender: "action"
              },
              onFilter: (value, record) => {
              },
              onFilterDropdownVisibleChange: visible => {
              }
            }
          }
        },
        pagination: {
          totalCount: 0,
          pageSize: 10,
          pageNo: 1
        },
        searchParam: {
          // other:'',
        },
        userModalShow: true,
        form: this.$form.createForm(this),
        defaultForm: {},
        isCheck: false,
        regTel: Util.tel,
        regEmail: Util.email
      };
    },
    computed: {},
    created() {
      this.searchList(true);
    },
    mounted() {
      this.operChange(this.table.operValue);
      this.table.height = document.body.clientHeight - 450 + 54 + 50;
      window.onresize = () => {
        this.table.height = document.body.clientHeight - 450 + 54 + 50;
      };
    },
    watch: {},
    methods: {
      deb: debounce(
        function () {
          // 搜索方法
          this.searchList(true);
        },
        300 // 延迟时间
      ),
      // 分页选择第几页
      onChangePage(pageNo, pageSize) {
        this.pagination.pageNo = pageNo;
        this.searchList();
      },
      // 分页选择 展示多少条数据
      onShowSizeChangePage(pageNo, pageSize) {
        this.pagination.pageNo = 1;
        this.pagination.pageSize = pageSize;
        this.searchList();
      },
      //配置table表头
      operChange(checkedValues) {
        let columns = [];
        let oper = {
          title: "操作",
          dataIndex: "operation",
          width: 150,
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "operIcon",
            customRender: "action"
          }
        };
        checkedValues.length &&
        checkedValues.forEach(checked => {
          columns.push(this.table.initColumns[checked]);
        });
        columns.push(oper);
        this.table.columns = columns;
      },
      // 关闭MODAL
      closeModal() {
        this.userModalShow = false;
      },
      // 查看MODAL
      checkModal() {
        this.isCheck = true;
        this.userModalShow = true;
      },
      /**编辑 */
      editAccount(rowData) {
        this.$refs["ModalEditAccount"].handleOpen(rowData);
      },
      /**查看详情 */
      seeDetails(rowData) {
        this.$refs["ModalAccountMessage"].handleOpen(rowData);
      },
      /**停用 */
      sTopUseAccount(rowData) {
        this.changeAccountStatus(1, rowData.id);
      },
      /**启用 */
      startUseAccount(rowData) {
        if (rowData.status == 2) {
          //已注销
          this.$message.warning(
            "该人员已被注销，无法启用用户，如需启用，请先对人员进行复职"
          );
        } else {
          this.changeAccountStatus(0, rowData.id);
        }
      },
      /**重置密码 */
      resetPassword(rowData) {
        this.$confirm({
          title: "重置密码",
          content: "确定要重置密码吗?",
          okText: "确定",
          cancelText: "取 消",
          onOk: () => {
            this.$postParams(this.api.recoverPasswordApi, {
              passportId: rowData.passportId,
              phoneNumber: rowData.phone
            })
              .then(response => {
                Util.processRes(response, res => {
                  this.$message.success("重置密码成功，已发送短信！");
                  this.searchList();
                });
                Util.processError(this, response);
              })
              .catch(res => {
                Util.processError(this, res);
              });
          },
          onCancel: () => {
          }
        });
      },
      /**
       * 启用/停用公用方法
       * @param state  停启用 状态 1=停用 0=启用
       * @param id 标识
       */
      changeAccountStatus(state, id) {
        const TYPE = state == 0 ? "启用" : "停用";
        this.$confirm({
          title: TYPE,
          content: `确定要${TYPE}当前账户吗?`,
          okText: TYPE,
          cancelText: "取 消",
          onOk: () => {
            this.$postParams(this.api.updateUserStateApi, {
              state: state,
              id: id
            })
              .then(response => {
                Util.processRes(response, res => {
                  this.$message.success(TYPE + response.statusMessage);
                  this.searchList(false);
                });
                Util.processError(this, response);
              })
              .catch(res => {
                Util.processError(this, res);
              });
          },
          onCancel: () => {
          }
        });
      },
      /**请求列表
       * @param isInit  是否终止当前页为第一页
       */
      searchList(isInit) {
        this.table.loading = true;
        //console.log(this.searchParam)
        if (isInit) {
          this.pagination.pageNo = 1;
        }
        let params = {
          keyword: this.searchParam.keyword ? this.searchParam.keyword : "",
          size: this.pagination.pageSize,
          current: this.pagination.pageNo
        };
        this.$get(this.api.searchMemberApi, params)
          .then(response => {
            this.table.loading = false;
            Util.processRes(response, () => {
              this.pagination.totalCount = Number(response.data.total);
              response.data.records && response.data.records.length > 0
                ? (this.table.data = response.data.records)
                : (this.table.data = []);
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.table.loading = false;
            Util.processError(this, res);
          });
      },
      // 提交编辑用户
      submit() {
        this.form.validateFields(err => {
          if (!err) {
            console.info("success");
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
