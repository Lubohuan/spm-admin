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
      <a-tabs @change="tabChange" type="card">
        <a-tab-pane tab="关联用户" key="a"></a-tab-pane>
        <a-tab-pane tab="应用权限" key="b"></a-tab-pane>
      </a-tabs>
      <div class="flex justify-between">
        <div class="table-config">
          <!-- <a-radio-group class="m-r-10" v-model="tabValue" @change="tabChange" buttonStyle="solid">
            <a-radio-button value="a">关联用户</a-radio-button>
            <a-radio-button value="a">应用权限</a-radio-button>
          </a-radio-group>-->
          <span v-if="tabValue=='a'">
            <a-button
              type="primary"
              v-waves
              style="margin-right:7px;"
              :disabled="currentId ? false : true"
              @click="selectUser"
            >选择用户</a-button>
            <a-button
              v-waves
              style="margin-left:0px;"
              :disabled="this.userObj.disDel"
              @click="remove('user')"
            >删除</a-button>
          </span>
          <span v-else>
            <a-button
              type="primary"
              v-waves
              style="margin-right:7px;"
              :disabled="currentId ? false : true"
              @click="selectPower"
            >选择应用</a-button>
            <a-button
              v-waves
              style="margin-left:0px;"
              :disabled="this.powerObj.disDel"
              @click="remove('license')"
            >删除</a-button>
          </span>
        </div>
        <div class="table-search flex">
          <span v-if="tabValue=='a'">
            <a-input-search
              placeholder="按名称搜索"
              v-model="userObj.keyword"
              @change="searchUser"
              @search="searchUser"
            >
              <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
            </a-input-search>
          </span>
          <span v-else>
            <a-input-search placeholder="按权限名称搜索" v-model="powerObj.keyword" @search="searchPower" @change="searchPower">
              <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
            </a-input-search>
          </span>
        </div>
      </div>
    </div>
    <div class="pannel-content">
      <!-- 关联用户 -->
      <rightContentUser
        :currentId="currentId"
        :orgId="orgId"
        v-show="tabValue=='a'"
        ref="rightContentUser"
        @toggleBtn="toggleDelDisabled"
      />
      <!-- 应用权限 -->
      <rightContentPower
        :currentId="currentId"
        :orgId="orgId"
        v-show="tabValue=='b'"
        ref="rightContentPower"
        @toggleBtn="toggleDelDisabled"
      />
    </div>
  </div>
</template>
<script>
import rightContentUser from "@/role/roleAppLicense/rightContentUser";
import rightContentPower from "@/role/roleAppLicense/rightContentPower";
export default {
  components: {
    rightContentUser, //关联用户
    rightContentPower //应用权限
  },
  props: {
    currentId: {
      //左侧table当前选中的角色
      type: String,
      default: ""
    },
    orgId: {
      //左侧当前选中的组织
      type: String,
      default: ""
    }
  },
  data() {
    return {
      tabValue: "a",
      disApply: true, //授权按钮是否不能点击
      disDel: true, //删除按钮是否不能点击
      userObj: {
        disDel: true,
        disSelect: true,
        selectedRowKeys: [],
        keyword: ""
      },
      powerObj: {
        keyword: "",
        disDel: true,
        disSelect: true,
        selectedRowKeys: []
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    tabChange(key) {
      this.tabValue = key;
    },
    //更新列表
    updateTable(id) {
      if (id) {
        this.userObj.disSelect = false;
        this.powerObj.disSelect = false;
        this.currentId = id;
      } else {
        this.userObj.disSelect = true;
        this.powerObj.disSelect = true;
      }
    },
    /*
    let obj = {
        type: "power",
        disValue: disValue,
        selectedRowKeys: selectedRowKeys
      };
    */
    toggleDelDisabled(obj) {
      if (obj.type == "user") {
        this.userObj.disDel = obj.disValue;
        this.userObj.selectedRowKeys = obj.selectedRowKeys;
      } else {
        this.powerObj.disDel = obj.disValue;
        this.powerObj.selectedRowKeys = obj.selectedRowKeys;
      }
    },
    /*选择人员*/
    selectUser() {
      this.$refs["rightContentUser"].showUserModal();
    },
    /**搜索人员 */
    searchUser() {
      this.$refs["rightContentUser"].getDataAction(1, 10, this.userObj.keyword);
    },
    /*选择应用*/
    selectPower() {
      this.$refs["rightContentPower"].showPowerModal();
    },
    /**搜索人员 */
    searchPower() {
      this.$refs["rightContentPower"].deb(this.powerObj.keyword);
    },
    /**
     * 删除
     * @param id
     */
    remove(type) {
      if (type == "license") {
        this.$refs["rightContentPower"].remove();
      } else {
        this.$refs["rightContentUser"].remove();
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
