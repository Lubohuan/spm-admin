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
    class="ModalMessage"
    centered
    :width="500"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">系统管理员详情</template>
    <!--租户基本信息  -->
    <div class="m-box">
      <div class="m-title" v-show="false">
        <span class="m-text"></span>
      </div>
      <div class="m-content">
        <a-form>
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="管理员名称">
                <span class="form-value">{{message.username}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="管理员账号">
                <span class="form-value">{{message.accountId}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="绑定手机号">
                <span class="form-value">{{message.tel}}</span>
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
      api: {
        adminDetailApi: Util.adminServer + "/admin-user/details" // 管理员详情
      },
      title: "",
      visible: false,
      message: {
        accountId: "",
        tel: "",
        username: ""
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
      this.getDetais(rowData);
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    //获取详情
    getDetais(rowData) {
      let params = {
        id: rowData.id
      };
      this.$get(this.api.adminDetailApi, params)
        .then(response => {
          // this.loading = false;
          Util.processRes(response, () => {
            this.message = response.data;
          });
          Util.processError(this, response);
        })
        .catch(res => {
          // this.table.loading = false;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalMessage {
  .ant-modal-body {
  }
}
</style>
