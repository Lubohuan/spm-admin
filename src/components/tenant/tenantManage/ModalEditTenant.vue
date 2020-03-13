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
    class="ModalEditTenant"
    :footer="null"
    :width="800"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">编辑租户信息</template>
    <div class="steps-box">
      <div class="steps-content">
        <subStep0 ref="subStep0" type="edit" @handleClose="handleClose()" @upDateList="updateList"></subStep0>
      </div>
    </div>
    <!-- <template slot="footer">
      <a-button @click="handleClose">取消</a-button>
      <a-button type="primary" @click="saveEdit">确定</a-button>
    </template>-->
  </a-modal>
</template>

<script>
import subStep0 from "@/tenant/tenantManage/subStep0";
export default {
  name: "ModalEditTenant",
  components: {
    subStep0
  },
  props: {},
  data() {
    return {
      visible: false
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    reset() {
      this.$refs["subStep0"].reset();
    },
    setForm(rowData) {
      this.$refs["subStep0"].setForm(rowData);
    },
    updateList() {
      this.$emit("searchList");
    },
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.$nextTick(() => {
        this.setForm(rowData);
      });
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      this.reset();
    },
    /**
     * 保存编辑
     */
    saveEdit() {}
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalEditTenant {
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
</style>
