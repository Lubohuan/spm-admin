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
  <a-modal v-model="visible" :width="500" class="ModalAccountMessage" :afterClose="handleClose">
    <template slot="title">账户详情</template>
    <!--租户基本信息  -->
    <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
      <div class="m-box">
        <div class="m-content">
          <!-- <a-row :gutter="24" class="m-item">
            <a-col :span="12">
              <div class="m-item">
                <span class="m-label">所属组织：</span>
                <span class="m-value">{{message.orgName}}</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="m-item">
                <span class="m-label">用户名称：</span>
                <span class="m-value">{{message.name}}</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="m-item">
                <span class="m-label">用户账号：</span>
                <span class="m-value">{{message.phone}}</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="m-item">
                <span class="m-label">手机号：</span>
                <span class="m-value">{{message.phone}}</span>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="m-item flex">
                <span class="m-label">邮箱：</span>
                <span class="m-value flex-1">{{message.mail}}</span>
              </div>
            </a-col>
          </a-row> -->

          <a-form>
            <a-row :gutter="20">
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item label="所属组织">
                  <span class="form-value">{{message.orgName}}</span>
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item label="用户名称">
                  <span class="form-value">{{message.name}}</span>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item label="用户账号">
                  <span class="form-value">{{message.phone}}</span>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item label="手机号">
                  <span
                    class="form-value"
                  >{{message.phone}}</span>
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item label="邮箱">
                  <span
                    class="form-value"
                  >{{message.mail}}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </a-skeleton>
    <template slot="footer">
      <a-button @click="handleClose" type="primary">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: "ModalAccountMessage",
  components: {},
  props: {},
  data() {
    return {
      Util,
      api: {
        searchMemberApi: Util.orgServer + "/web/member/search" // 列表
      },
      loading: false,
      noCreated: true,
      title: "",
      visible: false,
      currentRowData: null,
      message: {
        orgName: "",
        name: "", //用户名称
        phone: "",
        mail: ""
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
      this.currentRowData = rowData;
      this.message = rowData;
      this.visible = true;
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    init(rowData) {},
    reset() {
      this.noCreated = true;
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalAccountMessage {
  .ant-modal-body {
  }
}
</style>
