/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  租户基本信息
</comment>
<template>
  <a-modal
    v-model="visible"
    class="ModalReason"
    centered
    :width="600"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">失败原因</template>
    <!--租户基本信息  -->
    <div class="m-box">
      <div class="m-title" v-show="false">
        <span class="m-text"></span>
      </div>
      <div class="m-content">
        <a-form>
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="预警任务名称">
                <span class="form-value">{{message.taskName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="结束时间">
                <span class="form-value" v-if="message.endTime==0">无限期</span>
                <span
                  class="form-value"
                  v-else
                >{{moment(message.endTime).format('YYYY-MM-DD HH:ss')}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="执行结果">
                <span class="form-value">{{message.exResult}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="原因">
                <span class="form-value">{{message.reason}}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleClose">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalMessage",
  components: {},
  props: {},
  data() {
    return {
      Util,
      api: {},
      title: "",
      visible: false,
      message: {
        taskName: "",
        endTime: "",
        exResult: "",
        reason: ""
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.message = rowData;
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    }
  },
  //获取详情
  destroyed() {}
};
</script>

<style lang="scss">
.ModalReason {
  .ant-modal-body {
  }
}
</style>
