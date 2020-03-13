/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  新增租户
</comment>
<template>
  <a-modal
    v-model="visible"
    centered
    class="ModalTree"
    :width="450"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">选择上级档案</template>
    <div class="body">
      <a-input-search placeholder="请输入角色分类名称" v-model="searchValue" @change="search" class="m-b-20">
        <a-button slot="enterButton" type="primary" v-waves>搜索</a-button>
      </a-input-search>
      <div style="height:500px;overflow-y:auto">
        <a-tree
          class="draggable-tree"
          defaultExpandAll
          :selectedKeys="selectedId"
          :treeData="treeData"
          @select="onSelect"
        />
      </div>
    </div>
    <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="saveConfig" :disabled="!selectedId.length>0">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
  import debounce from "lodash.debounce";

  export default {
    name: "ModalAddTenant",
    components: {},
    props: {
      treeData: Array,
      treeInitData: Array
    },
    data() {
      return {
        ///web/tenant-admin/add
        Util,
        api: {
          addAdminApi: Util.operationServer + "/web/tenant-admin/add", // 新增管理员
          editAdminApi: Util.operationServer + "/web/tenant-admin/edit-admin", // 编辑管理员
          replaceTelApi: Util.operationServer + "/web/tenant-admin/replace-tel", //更换手机号
          sendSMSApi: Util.operationServer + "/web/user/send-code" //更换手机号
        },
        searchValue: "",
        selectedId: [],
        visible: false
      };
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      /**
       * tree搜索
       */
      search: debounce(function (val) {
        this.searchValue = val.target.value;
        this.handleSearch(val.target.value);
      }, 1000),
      // 搜索
      handleSearch(val) {
        this.treeData = val
          ? Util.treeSearch(val, this.treeInitData)
          : this.treeInitData;
      },
      onSelect(selectedKeys, info) {
        this.selectedId = selectedKeys;
      },
      /*打开modal的事件*/
      handleOpen(rowData, configType) {
        this.visible = true;
      },
      /*关闭modal的事件*/
      handleClose() {
        this.selectedId = [];
        this.visible = false;
        //this.reset();
      },
      saveConfig() {
        this.$emit(
          "selectHigherLevel",
          Util.getDataByProps(this.treeData, "id", this.selectedId[0])
        );
        this.handleClose();
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
