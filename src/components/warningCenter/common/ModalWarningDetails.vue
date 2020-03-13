/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 新增预警分类
</comment>
<template>
  <a-modal
    id="ModalWarningDetails"
    v-model="visible"
    :width="500"
    centered
    title="预警详情"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalWarningDetails"
  >
    <div class="body">
      <a-skeleton active :loading="loading" :paragraph="{rows: 10}"></a-skeleton>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleClose">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ModalWarningDetails",
  components: {},
  props: {
    tableData: {
      type: Array
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      Util,
      api: {
        detailApi: Util.systemServer + "/web/alarm-classify/detailApi" // 新增分部分项模板内容
      },
      loading: false,
      modalTitle: "",
      visible: false
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*
     *打开modal的事件*/
    handleOpen(rowData) {
      this.visible = true;
      this.getDetails();
    },
    /*关闭modal后的回调事件*/
    handleClose() {
      this.visible = false;
    },
    /**获取详情- */
    getDetails() {
      this.loading = true;
      this.$post(this.api.detailApi, params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, () => {}, () => {});
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.ModalWarningDetails {
}
</style>
