/**
* @Author: 李晨光
* @Date: 2019/8/26
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/26
**/
<comment>
  # 组件注释
  组织选择
</comment>
<template>
  <div id="CheckedTree">
    <a-modal
      centered
      :title="title"
      :width="modalType=='double'?1000:500"
      :visible="visible"
      @cancel="closeModal"
    >
      <!-- 单独的tree -->
      <a-row :gutter="20" v-if="modalType=='single'">
        <a-col :xs="24">
          <a-card style="height: 480px;">
            <a-input-search
              style="width: 100%"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="search"
            />
            <a-skeleton active :loading="loading" :paragraph="{rows: 7}">
              <div style="height: 370px;width: 100%;overflow: auto" v-if="treeResultData.length">
                <a-tree
                  :checkable="multiple"
                  :defaultExpandedKeys="expandedKeys"
                  v-model="checkedKeys"
                  @check="onCheck"
                  :treeData="treeResultData"
                  :selectedKeys="selectedKeys"
                  @select="onSelect"
                />
              </div>
              <div v-else class="ant-table-placeholder">暂无数据</div>
            </a-skeleton>
          </a-card>
        </a-col>
      </a-row>
      <!-- 左边table + 右边tree -->
      <a-row :gutter="20" v-if="modalType=='double'">
        <a-col :xs="13">
          <a-card style="height: 480px;">
            <a-input-search
              style="width: 100%"
              class="m-b-20"
              placeholder="按名称搜索"
              v-model="table.key"
              @change="deb"
            />
            <div class="table-box">
              <div class="table-table" style="height: 335px;width: 100%;">
                <a-skeleton active :loading="table.loading" :paragraph="{rows: 7}">
                  <a-table
                    :columns="table.columns"
                    :scroll="{y:300}"
                    :pagination="false"
                    :dataSource="table.data"
                    :locale="{emptyText: '暂无数据'}"
                    rowKey="id"
                    size="middle"
                    :customRow="rowClick"
                    :rowClassName="rowClassName"
                  >
                    <!-- 工程类别 -->
                    <template slot="type" slot-scope="text, record">
                      <span>{{Util.getDataByProps(engineeringTypes,'id',record.type).name}}</span>
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
          </a-card>
        </a-col>
        <a-col :xs="11">
          <a-card style="height: 480px;">
            <a-input-search
              style="width: 100%"
              class="m-b-10"
              placeholder="按名称搜索"
              @change="search"
            />
            <a-skeleton active :loading="loading" :paragraph="{rows: 13}">
              <div style="height: 370px;width: 100%;overflow: auto" v-if="treeResultData.length">
                <a-tree
                  checkable
                  :defaultExpandedKeys="expandedKeys"
                  v-model="checkedKeys"
                  @check="onCheck"
                  :treeData="treeResultData"
                />
              </div>
              <div v-else class="ant-table-placeholder">暂无数据</div>
            </a-skeleton>
          </a-card>
        </a-col>
      </a-row>
      <!-- 选择结果 -->
      <a-row :gutter="20">
        <a-col :xs="24">
          <a-card style="height: 100px;overflow: auto" class="m-t-20">
            <span v-for="(tag, index) in resultTags" :key="tag.id">
              <a-tooltip v-if="tag.name.length > 15" :key="tag.id" :title="tag.name">
                <a-tag
                  :key="tag.id"
                  :closable="index !== 0"
                  @close="clearOne(tag)"
                  class="m-b-10"
                >{{`${tag.name.slice(0, 15)}...`}}</a-tag>
              </a-tooltip>
              <a-tag
                v-else
                :key="tag.id"
                closable
                @close="clearOne(tag)"
                class="m-b-10"
              >{{tag.name}}</a-tag>
            </span>
          </a-card>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button @click="refresh">刷 新</a-button>
        <a-button @click="clear">清 除</a-button>
        <a-button @click="closeModal">取 消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          @click="confirm"
          :disabled="resultTags.length?false:true"
        >确 认</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";
import Pagination from "@/Pagination"; //分页组件
export default {
  name: "CheckedTree",
  components: {
    Pagination
  },
  props: {
    /**
     * org
     * orgProject
     */
    title: {
      type: String,
      default: "选择分部分项"
    },
    modalType: {
      type: String,
      default: "single"
    },
    apiType: {
      type: String,
      default: ""
    },
    selected: {
      // 选择结果
      type: Array,
      default: () => []
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    isVisible: {
      // modal状态  显示隐藏
      type: Boolean,
      default: false
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
        getSubItemTempApi: Util.wbsServer + "/web/wbs/wbs-type/page", // 查询分部分项模板列表
        getDetailApi: Util.wbsServer + "/web/wbs/wbs/tree",
        projectItemListApi: Util.wbsServer + "/web/wbs/wbs-project/tree", // 分部分项列表
        areaListApi: Util.wbsServer + "/web/wbs/area/tree" //施工区段列表
      },
      ajaxLoading: false,
      loading: false,
      visible: false,
      leftCurrentId: "",
      resultTags: [], //选中结果集合
      autoExpandParent: true, //是否自动展开父节点
      treeData: [], // 组织树初始数据
      treeResultData: [], // 组织树搜索结果数据
      expandedKeys: [], //展开的
      checkedKeys: [], //选中的结果
      selectedKeys: [], //单选
      halfCheckedKeys: [],
      checks: [], // 选择结果
      engineeringTypes: [
        { id: 1, name: "房建" },
        { id: 2, name: "路桥" },
        { id: 3, name: "隧道" }
      ], // 工程类型
      table: {
        id: "",
        key: "",
        loading: false,
        height: null,
        columns: [
          {
            title: "编码",
            width: 150,
            dataIndex: "num"
          },
          {
            title: "分部分项模板名称",
            dataIndex: "name",
            width: 150,
            scopedSlots: {
              customRender: "name"
            }
          },
          {
            title: "工程类别",
            width: 100,
            dataIndex: "type",
            scopedSlots: {
              customRender: "type"
            }
          }
        ],
        data: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  computed: {
    ...mapState(["curr_org"])
  },
  created() {
    if (this.apiType == "selectTemplate") {
      this.getTableData(true);
    } else {
      //
    }
  },
  mounted() {},
  watch: {
    isVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    selected: {
      handler(val) {
        this.checks = val;
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    initSub(reShowListAxios) {
      this.checkedKeys = [];
      let params = {
        projectId: this.curr_org.id
      };
      if (this.apiType == "selectSub") {
        //选择分部分项
        let requestLists = [
          this.$get(this.api.projectItemListApi, params),
          reShowListAxios
        ];
        this.feedbackTreeData(requestLists);
      } else if (this.apiType == "selectArea") {
        this.leftCurrentId = reShowListAxios;
        //应用到其他区段
        this.getWbsData();
      }
    },
    //回显数据
    feedbackTreeData(requestLists) {
      this.loading = true;
      this.$getAll(requestLists)
        .then(response => {
          this.loading = false;
          let source = response[0];
          let result = response[1];
          /**回显数据的需求 */
          /*if (source.data && source.data.length > 0) {
            this.afterGetSingleTree(source);
          }
          if (result.data && result.data.length > 0) {
            this.resultTags = [];
            this.checkedKeys = [];
            let noChilData = [];
            result.data.forEach(item => {
              let currentData = Util.getDataByProps(source.data, "id", item);
              if (Object.keys(currentData).length && !currentData.children) {
                noChilData.push(currentData);
              }
            });
            //this.resultTags = Util.getLastLevelData(noChilData);
            this.resultTags = noChilData;
            this.resultTags.forEach(item => {
              this.checkedKeys.push(item.id);
            });
          }*/
          /**不回显数据，禁止点击的需求 */
          let resultTags = [];
          let checkedKeys = [];
          let noChilData = [];
          if (result.data && result.data.length > 0) {
            /**搜索的ids */
            /**最后一级的数据以及ids */
            result.data.forEach(item => {
              let currentData = Util.getDataByProps(source.data, "id", item);
              if (Object.keys(currentData).length && !currentData.children) {
                noChilData.push(currentData);
              }
            });
            //resultTags = Util.getLastLevelData(noChilData);
            resultTags = noChilData;
            resultTags.forEach(item => {
              checkedKeys.push(item.id);
            });
          }
          if (source.data && source.data.length > 0) {
            this.afterGetSingleTree(source, checkedKeys);
          }
        })
        .catch(res => {
          console.log(res);
          this.loading = false;
          Util.processError(this, res);
        });
    },
    deb: debounce(function(val) {
      this.getTableData(true);
    }, 1000),
    search: debounce(function(val) {
      this.handleSearch(val.target.value);
    }, 1000),
    handleSearch(val) {
      this.treeResultData = val
        ? Util.treeSearch(val, "name", this.treeData)
        : this.treeData;
      this.expandedKeys = Util.getIds(this.treeResultData);
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys;
      this.halfCheckedKeys = info.halfCheckedKeys;
      let checkData = Util.getLastLevelData([info.node.dataRef]);
      if (info.checked) {
        this.resultTags = this.resultTags.concat(checkData);
        //选中
        //this.resultTags = [...this.resultTags, ...checkData];
        let obj = {}; //有助于增加遍历效率
        this.resultTags = this.resultTags.reduce((cur, next) => {
          obj[next.id] ? "" : (obj[next.id] = true && cur.push(next));
          return cur;
        }, []); //设置cur默认类型为数组，并且初始值为空的数组
      } else {
        //未选中
        this.resultTags = [...this.resultTags].filter(x =>
          [...checkData].every(y => y.id !== x.id)
        );
      }
    },
    onSelect(selectedKeys, info) {
      if (!info.selected) {
        return;
      }
      this.selectedKeys = selectedKeys;
      this.resultTags = [info.node.dataRef];
    },
    getWbsData() {
      let params = {
        projectId: this.curr_org.id
      };
      let url = "";
      if (this.apiType == "selectSub") {
        //选择分部分项
        url = this.api.projectItemListApi;
      } else if (this.apiType == "selectArea") {
        //应用到其他区段
        url = this.api.areaListApi;
      }
      this.getSingleTree(url, params);
    },
    getTableData(isInit) {
      this.table.loading = true;
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        current: this.pagination.pageNo,
        size: this.pagination.pageSize,
        name: this.table.key,
        status: 1
      };
      this.$get(this.api.getSubItemTempApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, () => {
            this.table.data = response.data.records
              ? response.data.records
              : [];
            this.pagination.totalCount = Number(response.data.total);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          console.log(res);
        });
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      // 重新请求数据
      this.getTableData(false);
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      // 重新请求数据
      this.getTableData(false);
    },
    //table行点击
    rowClick(record, index) {
      return {
        on: {
          click: () => {
            this.table.id = record.id;
            this.getTreeData();
          }
        }
      };
    },
    //table行class
    rowClassName(record, index) {
      let className = "";
      if (record.id == this.table.id) {
        className = "rowActive";
      }
      return className;
    },
    /**左右交互中  右边树结构的请求*/
    getTreeData() {
      this.loading = true;
      this.$get(this.api.getDetailApi, { wbsTypeId: this.table.id })
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.treeData = response.data ? Util.dealData(response.data) : [];
            this.treeResultData = this.treeData;
            this.expandedKeys = Util.getIds(this.treeResultData);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    /**只有一个树结构的请求 */
    getSingleTree(url, params) {
      this.loading = true;
      this.$get(url, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.afterGetSingleTree(response);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    },
    afterGetSingleTree(response, ids) {
      if (this.apiType == "selectArea") {
        //应用到其他区段
        this.treeData = response.data
          ? Util.dealDataLastDisabled(response.data, this.leftCurrentId)
          : [];
      } else {
        //this.treeData = response.data ? Util.dealData(response.data) : [];
        /**不能点击的需求 */
        this.treeData = response.data
          ? Util.dealDataIdsDisabled(response.data, ids)
          : [];
      }
      this.treeResultData = this.treeData;
      this.expandedKeys = Util.getIds(this.treeResultData);
    },
    reShowTags() {},
    getIdsFun(id) {
      return new Promise((resolve, reject) => {
        let itemData = Util.treeSearch(id, "id", this.treeResultData);
        let delIds = Util.getTreeAllId(itemData);
        resolve(delIds);
      });
    },
    /**
     * 清除选择
     */
    async clearOne(e) {
      this.resultTags.splice(
        this.resultTags.findIndex(item => item.id == e.id),
        1
      );
      let delIds = await this.getIdsFun(e.id);
      delIds.forEach(element => {
        let index = this.checkedKeys.findIndex(item => item == element);
        if (index != -1) {
          this.checkedKeys.splice(index, 1);
        }
      });
    },
    /**
     * 确认
     */
    confirm() {
      //console.log(this.halfCheckedKeys);
      if (this.multiple) {
        this.$emit("change", this.halfCheckedKeys.concat(this.checkedKeys));
      } else {
        this.$emit("change", this.selectedKeys);
      }
      this.closeModal();
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.visible = !this.visible;
      this.$emit("closed");
    },
    /**
     * 清除
     */
    clear() {
      this.checkedKeys = [];
      this.resultTags = [];
      this.halfCheckedKeys = [];
      // this.$emit("change", this.checks);
    },
    /**
     * 刷新
     */
    refresh() {
      if (this.apiType == "selectTemplate") {
        this.getTableData(false);
        this.getTreeData();
      } else {
        this.getWbsData();
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
