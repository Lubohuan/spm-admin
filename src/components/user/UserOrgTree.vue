/**
* @Author: zmm
* @Date: 2019/8/23
* @Version: 1.0
* @Last Modified by: 何景春
* @Last Modified time: 2019/8/29
**/
<comment>
  # 组件注释
  用户中心入口
</comment>
<template>
  <div class="pannel">
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
            <div v-else class="ant-table-placeholder">暂无数据</div>
          </div>
        </a-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import { mapState } from "vuex";
import OrgModal from "@/select/OrgModal";
export default {
  name: "UserOrgTree",
  components: {
    "org-modal": OrgModal
  },
  props: {},
  data() {
    return {
      Util,
      api: {
        tree: Util.orgServer + "/web/org/org-dept-tree" // 获取 组织结构
      },
      loading: true,
      Visible: false,
      tree:{
        height:200,
      },
      // 部门列表数 -- 搜索值
      searchValue: "",
      // 部门列表数 -- 默认层级
      treeDefaultKeys: [],
      // 部门列表数 -- 数据
      treeData: [],
      // tree 搜索结果
      treeResultData: [],
      orgName: "",
      //  组织回填数据
      orgData: {
        orgId: "",
        name: "",
        type: "",
        deptId: "", // 部门id
        deptName: "" //部门名称
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
    this.tree.height = document.body.clientHeight - 365 + 100;
    window.onresize = () => {
      this.tree.height = document.body.clientHeight - 365 + 100;
    };
  },
  watch: {},
  methods: {
    // 部门列表数--初始化
    treeInit() {
      this.orgData.type = this.curr_org.type;
      if (this.curr_org.type != 100) {
        this.orgData.orgId = this.curr_org.id;
        this.orgData.name = this.curr_org.name;
      }
      this.getData();
      this.$emit("treeSelect", this.orgData);
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
    // 获取--部门列表 数据
    getData() {
      this.$get(this.api.tree, { orgId: this.curr_org.id, status: 1 })
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            this.treeData = response.data ? Util.dealData(response.data) : [];
            this.treeResultData = this.treeData
            this.expandedKeys = Util.getIds(this.treeResultData);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    },
    // 部门列表数--点击
    treeSelect(selectedKeys, e) {
      if(!e.selected){
        return
      }
      this.treeDefaultKeys=selectedKeys
      // 选择结果对象获取
      let selectObj = {};
      selectObj = Util.getDataByProps(
        this.treeResultData,
        "id",
        selectedKeys[0]
      );
      this.orgData.type = selectObj.type;
      // this.orgData.type  数据类型  100 部门  2、3 组织 4 项目部
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
    }
    /*// 组织选择
    orgSelect() {
      this.Visible = true;
    },*/
    /*// 组织选择 数据回填
    setValue(val) {
      // console.log(val);
      if (val.length) {
        this.orgData = {
          orgId: val[0].id, //组织id
          name: val[0].name, //组织名称
          deptId: "", // 部门id
          deptName: "" //部门名称
        };
        this.orgName = val[0].name;

      }
    }*/
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
