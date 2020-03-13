/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-10-23 10:59:37
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-10-23 16:42:29
 * @Description: 参建单位人员 -- 组织树
 */

<template>
  <div class="pannel">
    <div class="pannel-title">
      <a-input-search
        placeholder="请选择所属项目部"
        v-model="orgData.projectName"
        readonly
        @search="projectVisible = !projectVisible"
      >
        <a-button slot="enterButton">选 择</a-button>
      </a-input-search>
    </div>
    <div class="pannel-title">
      <a-input-search placeholder="按名称搜索" v-model="params.search" @change="deb" />
    </div>
    <div class="pannel-content">
      <div class="table-box">
        <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
          <div class="tree-box" :style="{height:tree.height+'px',overflow:'auto'}">
            <a-tree
              v-if="treeResultData.length"
              :treeData="treeResultData"
              showIcon
              :expandedKeys.sync="expandedKeys"
              :selectedKeys="treeDefaultKeys"
              @select="treeSelect"
            >
              <template slot="custom" slot-scope="record">
                <icon-font
                  :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
                />
              </template>
            </a-tree>
            <!--<a-empty v-else/>-->
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </div>
        </a-skeleton>
      </div>
    </div>
    <project-org-modal
      v-if="projectVisible"
      :isVisible="projectVisible"
      @closed="projectVisible = false"
      @change="setValue($event)"
    ></project-org-modal>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import { mapState } from "vuex";
import OrgModal from "@/select/OrgModal";
import ProjectOrgModal from "@/select/ProjectOrgModal";
export default {
  name: "PerManageTree",
  components: {
    "org-modal": OrgModal,
    "project-org-modal": ProjectOrgModal
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        tree: Util.orgServer + "/web/subcontractor/tree" // 获取 组织结构
      },
      loading: true,
      Visible: false,
      tree: {
        height: 200
      },
      projectVisible: false, // 组织弹窗状态
      // 项目列表数 -- 搜索值
      searchValue: "",
      // 项目列表数 -- 默认层级
      treeDefaultKeys: [],
      // 项目列表数 -- 数据
      treeData: [],
      // tree 搜索结果
      treeResultData: [],
      // orgName: "",
      //  组织回填数据
      orgData: {
        // orgId: "",
        // name: "",
        // type: "",
        projectId: null, // 项目id
        projectName: null //项目名称
      },
      expandedKeys: [],
      params: {
        search: undefined
      }
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {},
  mounted() {
    this.treeInit();
    this.tree.height = document.body.clientHeight - 325;
    window.onresize = () => {
      this.tree.height = document.body.clientHeight - 325;
    };
  },
  watch: {},
  methods: {
    // 项目列表数--初始化
    treeInit() {
      console.log(this.orgData);

      this.orgData.type = this.curr_org.type;
      if (this.curr_org.type === 4) {
        this.orgData.projectId = this.curr_org.id;
        this.orgData.projectName = this.curr_org.name;
        this.getData();
        // this.$emit("treeSelect", this.orgData);
      }else{
        this.orgData.projectId = null;
        this.orgData.projectName = null;
        this.treeResultData = [];
        this.loading = false;
      }
    },
    /**
     * tree搜索
     */
    deb: debounce(function(val) {
      this.search();
    }, 1000),
    // 搜索
    search() {
      if (this.params.search) {
        this.treeResultData = Util.treeSearch(
          this.params.search,
          "title",
          this.treeData
        );
        this.expandedRowKeys = Util.getIds(this.treeResultData);
      } else {
        this.getData();
      }
    },
    // 获取--项目列表 数据
    getData() {
      this.$get(this.api.tree, { projectId: this.orgData.projectId })
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            this.treeData = response.data ? Util.dealData(response.data) : [];
            this.treeResultData = this.treeData;
            this.expandedKeys = Util.getIds(this.treeResultData);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 项目列表数--点击
    treeSelect(selectedKeys, e) {
      if (!e.selected) {
        return;
      }
      this.treeDefaultKeys = selectedKeys;
      // 选择结果对象获取
      let selectObj = {};
      selectObj = Util.getDataByProps(
        this.treeResultData,
        "id",
        selectedKeys[0]
      );
      this.orgData.type = selectObj.type;
      // this.orgData.type  数据类型  100 项目  2、3 组织 4 项目部
      if (this.orgData.type == 100) {
        this.orgData.deptId = selectedKeys[0];
        this.orgData.orgId = selectObj.orgId;
        this.orgData.name = Util.getDataByProps(
          this.treeResultData,
          "id",
          this.orgData.orgId
        ).name;
        this.orgData.deptName = selectObj.name;
        this.$emit("treeSelect", this.orgData);
      } else {
        this.orgData.orgId = selectedKeys[0];
        this.orgData.name = selectObj.name;
      }
      console.log(this.orgData);
      this.$emit("treeSelect", this.orgData);
    },
    setValue(val) {
      // console.log(val);
      if (val.length) {
        this.orgData.projectId = val[0].id;
        this.orgData.projectName = val[0].name;
        this.getData();
      } else {
        this.orgData.projectId = null;
        this.orgData.projectName = null;
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
