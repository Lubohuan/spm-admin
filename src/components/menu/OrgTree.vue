/**
* @Author: 李晨光
* @Date: 2019/8/20
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/20
**/
<comment>
  # 组件注释
  切换组织 -- 组织树带搜索
</comment>
<template>
  <div id="OrgTree">
    <a-auto-complete
      style="width: 100%"
      class="m-b-10"
      @search="search"
      placeholder="按名称搜索组织"
      @select="searchSelected"
      v-model="params.search"
    >
      <template slot="dataSource">
        <a-select-option v-for="res in result" :key="res.id">{{res.name}}</a-select-option>
      </template>
    </a-auto-complete>
    <a-skeleton active :loading="loading" :paragraph="{rows: 3}">
      <a-tree
        showIcon
        :treeData="treeData"
        :expandedKeys.sync="expandKeys"
        :selectedKeys.sync="checkedKeys"
        :checkedKeys="checkedKeys"
        @select="treeSelected"
      >
        <template slot="custom" slot-scope="record">
          <icon-font
            :type="record.dataRef.type == 100 ? 'spm-icon-bumen' : record.dataRef.type == 4 ? 'spm-icon-xiangmubu' : 'spm-icon-zuzhi'"
          />
        </template>
        <!--<template slot="custom" slot-scope="{selected}">-->
        <!--<a-icon :type="selected ? 'frown':'frown-o'" />-->
        <!--</template>-->
      </a-tree>
    </a-skeleton>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import Cookie from "js-cookie";
import { mapState } from "vuex";
export default {
  name: "OrgTree",
  components: {},
  inject: ["reload"],
  props: {},
  data() {
    return {
      Util,
      api: {
        getOrgTreeApi: Util.orgServer + "/web/org/org-all-tree", // 获取组织树数据
        getOrgListApi: Util.orgServer + "/web/org/search", // 获取组织下拉列表数据
        switchOrgApi: Util.orgServer + "/web/member/changeOrgId" // 切换组织
      },
      result: [], // 搜索结果
      value: "",
      expandKeys: [],
      checkedKeys: [],
      treeData: [],
      loading: true,
      params: {
        search: ""
      }
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {
    this.getOrgTree();
  },
  mounted() {},
  watch: {
    curr_org: {
      handler(val) {
        this.checks = val;
        // console.log(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    search: debounce(function() {
      this.handleSearch();
    }, 300),
    handleSearch() {
      this.$get(this.api.getOrgListApi, { search: this.params.search })
        .then(response => {
          Util.processRes(response, () => {
            if (response.data) {
              this.result = response.data;
            } else {
              this.result = [];
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
        });
    },
    searchSelected(e) {
      let curr = Util.getDataByProps(this.result, "id", e);
      this.$store.commit("SET_CURR_ORG", curr);
      this.reload();
    },
    /**
     * 切换组织项目
     */
    treeSelected(e) {
      let sessions = Cookie.get("sessions")
        ? JSON.parse(Cookie.get("sessions"))
        : "";
      if (e.length) {
        this.$get(this.api.switchOrgApi, {
          changeOrgId: e[0],
          passportId: sessions.passportId
        })
          .then(response => {
            Util.processRes(response, () => {
              let curr = Util.getDataByProps(this.treeData, "id", e[0]);
              this.$store.commit("SET_CURR_ORG", curr);
              this.reload();
              this.$root.eventHub.$emit("orgChange");
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
          });
      } else {
        this.selectedKeys = [this.curr_org.id];
        this.$get(this.api.switchOrgApi, {
          changeOrgId: this.curr_org.id,
          passportId: sessions.passportId
        })
          .then(response => {
            Util.processRes(response, () => {
              let curr = Util.getDataByProps(
                this.treeData,
                "id",
                this.curr_org.id
              );
              this.$store.commit("SET_CURR_ORG", curr);
              this.reload();
              this.$root.eventHub.$emit("orgChange");
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
          });
      }
    },
    getOrgTree() {
      this.$get(this.api.getOrgTreeApi)
        .then(response => {
          Util.processRes(response, () => {
            this.loading = false;
            if (response.data && response.data.length) {
              this.treeData = Util.dealData(response.data);
              this.checkedKeys = [this.curr_org.id];
              this.expandKeys = Util.getIds(this.treeData);
            } else {
              this.$store.commit("SET_CURR_ORG", {});
            }
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          console.log(res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
