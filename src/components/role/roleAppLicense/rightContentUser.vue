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
  <div class="table-box">
    <div class="table-table">
      <a-skeleton active :loading="table.loading" :paragraph="{rows: 15}">
        <a-table
          :locale="{emptyText: '暂无数据'}"
          :columns="table.columns"
          :pagination="false"
          :dataSource="table.data"
          size="middle"
          :scroll="{x: 1000,y:table.height}"
          :rowSelection="{selectedRowKeys: table.selectedRowKeys, onChange: onSelectChange}"
          rowKey="memberId"
        >
          <!-- 表头设置 -->
          <div
            slot="createTime"
            slot-scope="text"
          >{{new Date(Number(text)) | formatDate('yyyy-MM-dd hh:mm')}}
          </div>
          <div slot="status" slot-scope="text">{{text ? text == 1 ? '隶属' : '注销' : '直属'}}</div>
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
            style="border-left:1px solid #ddd;"
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
    <user-modal
      v-if="userVisible"
      :isVisible="userVisible"
      @closed="userVisible = false"
      @change="setUserValue"
      :multiple="true"
      :currentOrg="orgId ? orgId : curr_org.id"
    ></user-modal>
  </div>
</template>
<script>
  import Pagination from "@/Pagination"; //分页组件
  import UserModal from "@/select/UserModal"; //分页组件
  import debounce from "lodash.debounce";
  import {mapState} from "vuex";

  export default {
    components: {
      Pagination,
      UserModal
    },
    props: {
      currentId: {
        type: String,
        default: ""
      },
      orgId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        Util,
        api: {
          getRoleUserApi: Util.orgServer + "/web/role-user/list", // 根据角色获取应用权限范围列表
          setRoleUserApi: Util.orgServer + "/web/role-user/add-members", //新增授权限定新增应用资源
          getAppApi: Util.orgServer + "/web/resource/tree", // 查询应用列表
          delRoleUserApi: Util.orgServer + "/web/role-user/remove-members" // 移除角色下的资源
        },
        userVisible: false,
        table: {
          loading: false,
          columns: [],
          selectedRowKeys: [],
          data: [],
          plainOptions: [
            {label: "用户账号", value: 0},
            {label: "用户名称", value: 1},
            {label: "任职组织", value: 2},
            {label: "属性", value: 3},
            {label: "授权人", value: 4},
            {label: "授权时间", value: 5}
          ],
          operValue: [0, 1, 2, 3, 4, 5],
          initColumns: {
            0: {
              title: "用户账号",
              dataIndex: "phone",
              width: 200
            },
            1: {
              title: "用户名称",
              dataIndex: "name",
              width: 200
            },
            2: {
              title: "任职组织",
              dataIndex: "orgName",
              width: 300
            },
            3: {
              title: "属性",
              dataIndex: "status",
              width: 150,
              scopedSlots: {
                customRender: "status"
              }
            },
            4: {
              title: "授权人",
              width: 150,
              dataIndex: "createUser"
            },
            5: {
              title: "授权时间",
              dataIndex: "createTime",
              width: 150,
              scopedSlots: {
                customRender: "createTime"
              }
            },
            6: {
              title: "",
              dataIndex: "operation",
              width: 50,
              scopedSlots: {
                filterDropdown: "filterDropdown",
                filterIcon: "operIcon",
                customRender: "action"
              },
              onFilter: (value, record) =>
                record.address.toLowerCase().includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
                if (visible) {
                  setTimeout(() => {
                    // this.searchInput.focus()
                  });
                }
              }
            }
          }
        },
        pagination: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        },
        params: {
          current: 1,
          size: 10,
          keyword: ""
        }
      };
    },
    computed: {
      ...mapState({
        curr_org: state => state.curr_org
      })
    },
    created() {
    },
    mounted() {
      this.operChange(this.table.operValue);
      this.table.height = document.body.clientHeight - 450 + 54 + 50 - 52;
      window.onresize = () => {
        this.table.height = document.body.clientHeight - 450 + 54 + 50 - 52;
      };
    },
    watch: {
      currentId: {
        handler(val, oldVal) {
          this.search();
        }
      },
      orgId: {
        handler(val, oldVal) {
          this.search();
        },
        immediate: true
      }
    },
    methods: {
      /**
       * 监听input 执行debounce 延时1S后执行搜索方法
       */
      deb: debounce(
        function () {
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
       * 列表数据请求
       */
      getDataAction(pageNo = 1, pageSize = 10, keyword = "") {
        this.params.current = pageNo;
        this.params.size = pageSize;
        this.params.keyword = keyword;
        if (this.currentId) {
          this.$get(this.api.getRoleUserApi, {
            roleId: this.currentId,
            orgId: this.orgId ? this.orgId : this.curr_org.id,
            ...this.params
          })
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
        } else {
          this.table.data = [];
          this.pagination.totalCount = 0;
        }
      },
      showUserModal() {
        this.userVisible = true;
      },
      // 页数变化回调
      onChangePage(pageNo, pageSize) {
        this.pagination.pageNo = pageNo;
        // 重新请求数据
        this.getDataAction(pageNo, pageSize);
      },
      // 每页条数变化回调
      onShowSizeChangePage(pageNo, pageSize) {
        this.pagination.pageSize = pageSize;
        // 重新请求数据
        this.getDataAction(pageNo, pageSize);
      },
      //配置table表头
      operChange(checkedValues) {
        let columns = [];
        let oper = {
          title: "",
          dataIndex: "operation",
          width: 0,
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
          type: "user",
          disValue: disValue,
          selectedRowKeys: selectedRowKeys
        };
        this.$emit("toggleBtn", obj);
      },
      setUserValue(val) {
        let ids = [];
        val.length &&
        val.forEach(item => {
          ids.push(item.id);
        });
        this.$postParams(this.api.setRoleUserApi, {
          orgId: this.orgId ? this.orgId : this.curr_org.id,
          roleId: this.currentId,
          memberIds: ids.join(",")
        })
          .then(response => {
            Util.processRes(response, () => {
              this.getDataAction();
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
          });
      },
      /**
       * 删除用户
       * @param id
       */
      remove() {
        this.$confirm({
          title: "删除",
          content: "确定要删除所选用户吗?",
          okText: "确 认",
          cancelText: "取 消",
          onOk: () => {
            this.$postParams(this.api.delRoleUserApi, {
              orgId: this.orgId ? this.orgId : this.curr_org.id,
              roleId: this.currentId,
              memberIds: this.table.selectedRowKeys.join(",")
            })
              .then(response => {
                Util.processRes(response, () => {
                  this.$message.success(response.statusMessage);
                  this.getDataAction();
                });
                Util.processError(this, response);
              })
              .catch(res => {
                console.log(res);
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
