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
    class="ModalAddTenant"
    :width="800"
    :footer="null"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">{{title}}</template>
    <div class="steps-box">
      <div class="steps-title">
        <a-steps :current="currentStep">
          <a-step v-for="(item,index) in steps" :key="index" :title="item.title" />
        </a-steps>
      </div>
      <!-- <a-skeleton active :loading="loading" :paragraph="{rows: 10}"> -->
        <div class="steps-content">
          <div class="steps-content-item step1" v-if="currentStep==0">
            <subStep0
              ref="subStep0"
              @toggleLoading="toggleLoading"
              @handleStep="handleStep"
              @handleClose="handleClose()"
              type="add"
              @upDateList="updateList"
            ></subStep0>
          </div>
          <div class="steps-content-item step2" v-if="currentStep==1">
            <subStep1
              ref="subStep1"
              @toggleLoading="toggleLoading"
              @handleStep="handleStep"
              @handleClose="handleClose()"
              @upDateList="updateList"
            ></subStep1>
          </div>
          <div class="steps-content-item step3" v-if="currentStep==2">
            <subStep2
              ref="subStep2"
              @toggleLoading="toggleLoading"
              @handleStep="handleStep"
              @handleClose="handleClose()"
              @upDateList="updateList"
            ></subStep2>
          </div>
          <div class="steps-content-item step4" v-if="currentStep==3">
            <subStep2
              ref="subStep2"
              @toggleLoading="toggleLoading"
              @handleStep="handleStep"
              @handleClose="handleClose()"
              @upDateList="updateList"
            ></subStep2>
          </div>
        </div>
      <!-- </a-skeleton> -->
    </div>
  </a-modal>
</template>

<script>
import subStep0 from "@/tenant/tenantManage/subStep0";
import subStep1 from "@/tenant/tenantManage/subStep1";
import subStep2 from "@/tenant/tenantManage/subStep2";
//import subStep3 from "@/tenant/tenantManage/subStep3";
export default {
  name: "ModalAddTenant",
  components: {
    subStep0,
    subStep1,
    subStep2
    //subStep3
  },
  props: {},
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      currentStep: 0,
      currentRowData: null,
      steps: [
        {
          title: "新增租户",
          content: "First-content"
        },
        {
          title: "申请密钥",
          content: "Second-content"
        },
        {
          title: "激活租户",
          content: "Last-content"
        }
      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    reset(configType, rowData) {
      this.loading = false;
      if (configType == "add") {
        this.currentStep = 0;
        this.title = "新增租户";
      } else {
        this.title = "查看";
      }
      this.$nextTick(() => {
        if (this.currentStep == 0) {
          this.$refs["subStep0"].reset(rowData);
        } else if (this.currentStep == 1) {
          this.$refs["subStep1"].reset(rowData);
        } else {
          this.$refs["subStep2"].reset(rowData);
        }
        // this.$refs["subStep3"].reset(rowData);
      });
    },
    toggleLoading(val) {
      this.loading = val;
    },
    /*打开modal的事件*/
    handleOpen(configType, rowData) {
      this.visible = true;
      this.currentRowData = rowData;
      this.reset(configType, rowData);
      if (rowData) {
        if (rowData.status == "2" || rowData.status == "3") {
          this.currentStep = 3;
          this.reset(configType, rowData);
          this.$nextTick(() => {
            this.$refs["subStep2"].changeIsLast(true, rowData);
            this.$refs["subStep2"].toggleCloseBtn(true);
          });
        } else {
          if (rowData.type == 1) {
            this.currentStep = 1;
            this.reset(configType, rowData);
            this.$nextTick(() => {
              this.$refs["subStep1"].changeIsAfterApply(false);
            });
          } else if (rowData.type == 2) {
            this.currentStep = 1;
            this.reset(configType, rowData);
            this.$nextTick(() => {
              this.$refs["subStep1"].changeIsAfterApply(true);
            });
          } else if (rowData.type == 3) {
            this.currentStep = 2;
            this.reset(configType, rowData);
            this.$nextTick(() => {
              this.$refs["subStep2"].changeIsLast(false, rowData);
            });
          } else if (rowData.type == 4) {
            this.currentStep = 3;
            this.reset(configType, rowData);
            this.$nextTick(() => {
              this.$refs["subStep2"].changeIsLast(true, rowData);
              this.$refs["subStep2"].toggleCloseBtn(true);
            });
          }
        }
      }
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
      //this.reset();
    },
    /**
     *
     */
    handleStep(val, isTrue, data) {
      this.currentStep = val;
      if (isTrue && isTrue == "one") {
        this.$nextTick(() => {
          this.$refs["subStep1"].reset(this.currentRowData || data);
        });
      }
      if (isTrue && isTrue == "two") {
        this.$nextTick(() => {
          this.$refs["subStep2"].changeIsLast(
            false,
            this.currentRowData || data
          );
        });
      }
      if (isTrue && isTrue == "three") {
        this.$refs["subStep2"].toggleCloseBtn(false);
      }
    },
    updateList() {
      this.$emit("searchList");
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.ModalAddTenant {
  .ant-modal-body {
    padding-bottom: 0;
    border-radius: 0 0 2px 2px;
  }
  .ant-form-vertical {
    .ant-col-12 {
      height: 82px;
      overflow: hidden;
    }
  }
}
.modal-btn {
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  margin: 20px -49px -25px -49px;
}
</style>
