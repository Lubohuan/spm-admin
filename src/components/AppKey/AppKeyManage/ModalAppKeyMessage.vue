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
    centered
    :width="800"
    class="ModalAppKeyMessage"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">密钥详情</template>
    <!--租户基本信息  -->
    <a-skeleton active :loading="loading" :paragraph="{rows: 10}">
      <div>
        <div class="m-box">
          <div class="m-title">
            <span class="m-text">密钥申请信息</span>
          </div>
          <div class="m-content">
            <a-row :gutter="24" class="m-item">
              <a-col :span="12">
                <div class="m-item">
                  <span class="m-label">申请编号：</span>
                  <span class="m-value">{{message.applyNum}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="m-item">
                  <span class="m-label">申请时间：</span>
                  <span
                    class="m-value"
                  >{{message.createTime?moment(Number(message.createTime)).format("YYYY-MM-DD"):'--'}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="m-item">
                  <span class="m-label">申请人：</span>
                  <span class="m-value">{{message.userName}}</span>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="m-item">
                  <span class="m-label">租户名称：</span>
                  <span class="m-value">{{message.name}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="m-item flex">
                  <span class="m-label">申请理由：</span>
                  <span class="m-value flex-1">{{message.reason}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="m-item">
                  <span class="m-label">合同/协议附件：</span>
                  <span class="m-value">
                    <!-- <a
                      class="fileDownLoad"
                      :href="message.url"
                      :download="message.fileName"
                    >{{message.fileName}}</a>-->
                    <span
                      class="fileDownLoad"
                      @click="downLoadFile(message.url,message.fileName)"
                    >{{message.fileName}}</span>
                  </span>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="m-box">
          <div class="m-title">
            <span class="m-text">密钥详情</span>
          </div>
          <div class="m-content">
            <a-row :gutter="24" class="m-item">
              <a-col :span="24">
                <div class="m-item">
                  <span class="m-label">产品密钥状态：</span>
                  <span class="m-value" v-if="message.secretType==0">
                    未生成
                    <a-button
                      type="primary"
                      class="m-l-20"
                      @click="generateLicence"
                      v-if="noCreated"
                    >生成密钥</a-button>
                  </span>
                  <span class="m-value" v-else-if="message.secretType==1">未使用</span>
                  <span class="m-value" v-else-if="message.secretType==2">已使用</span>
                  <span class="m-value" v-else-if="message.secretType==3">已失效</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="m-item">
                  <span class="m-label">产品密钥：</span>
                  <span class="m-value">{{message.secretNum}}</span>
                </div>
              </a-col>
              <a-col :span="24">
                <div class="m-item flex">
                  <span class="m-label">状态变更记录：</span>
                  <span class="m-value flex-1">
                    <p class="m-b-10" v-if="message.createTime!=0">
                      <span>密钥生成时间</span>
                      {{message.createTime?moment(Number(message.createTime)).format("YYYY-MM-DD"):'--'}}
                      <span>操作人</span>
                      {{message.userName}}
                    </p>
                    <p class="m-b-10" v-if="message.activationTime!=0">
                      <span>密钥激活时间</span>
                      {{message.activationTime?moment(Number(message.activationTime)).format("YYYY-MM-DD"):'--'}}
                      <span>操作人</span>
                      {{message.userName}}
                    </p>
                    <p v-if="message.activationTime!=0">
                      <span>密钥失效时间</span>
                      {{message.endTime?moment(Number(message.endTime)).format("YYYY-MM-DD"):'--'}}
                    </p>
                  </span>
                </div>
              </a-col>
            </a-row>
          </div>
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
    name: "ModalAppKeyMessage",
    components: {},
    props: {},
    data() {
      return {
        Util,
        api: {
          licenceDetailsApi: Util.operationServer + "/web/license-info/licence-details", // 详情
          generateLicenceApi: Util.operationServer + "/web/license-info/generate-licence" // 详情
        },
        loading: false,
        noCreated: true,
        title: "",
        visible: false,
        currentRowData: null,
        message: {
          tenantId: "", //--租户id
          tenantCode: "", //--租户编码
          name: "", //--公司名称
          shortName: "", // --公司简称
          address: "", //--公司地址
          nature: "", //--公司性质
          num: "", //--统一信用编码
          applyNum: "", //--申请编码
          reason: "", //--申请事由
          url: "", //--附件url
          fileName: "",
          secretType: "", // --密钥状态 0 未生成 1.未使用2.已使用 3.已失效
          secretNum: "", //--产品密钥
          id: "", // --密钥表id
          startTime: "", //-- 0 为无限期
          endTime: "", //--0为无限期
          activationTime: "", //--0为未激活 激活时间
          userId: "", //--操作人id
          userName: ""
        }
      };
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      /*打开modal的事件*/
      handleOpen(rowData) {
        this.currentRowData = rowData;
        this.visible = true;
        this.reset();
        this.getDetails(rowData.id);
      },
      /**获取详情 */
      getDetails(id) {
        this.loading = true;
        let params = {
          id: id
        };
        this.$post(this.api.licenceDetailsApi, params).then(response => {
          this.loading = false;
          Util.processRes(response, () => {
            this.message = response.data;
          });
          Util.processError(this, response);
        });
        // .catch(res => {
        //   this.loading = false;
        //   Util.processError(this, res);
        // });
      },
      downLoadFile(href, name) {
        //window.open(href,'_blank')
        // let a = document.createElement("a");
        // a.setAttribute("href", href);
        // if (Util.getFileType(name) == "image") {
        //   a.setAttribute("target", "_blank");
        // }
        // a.setAttribute("download", name);
        // a.click();
        let fileType = Util.getFileType(name);
        if (fileType == "excel" || fileType == "ppt" || fileType == "word") {
          window.open(
            "https://view.officeapps.live.com/op/view.aspx?src=" + href,
            "_blank"
          );
        } else {
          //image/pdf/txt
          window.open(href, "_blank");
        }
      },
      /**
       *
       * 生成密钥
       */
      generateLicence() {
        this.noCreated = false;
        let params = {
          id: this.currentRowData.id
        };
        this.$post(this.api.generateLicenceApi, params)
          .then(response => {
            this.loading = false;
            Util.processRes(response, () => {
              //this.handleClose();
              this.$message.success("已生成密钥");
              this.$set(this.message, "secretNum", response.data);
              this.$set(this.message, "secretType", 1);
              this.$emit("searchList", true);
            });
            Util.processError(this, response);
          })
          .catch(res => {
            this.noCreated = true;
            this.loading = false;
            Util.processError(this, res);
          });
      },
      /*关闭modal的事件*/
      handleClose() {
        this.visible = false;
        //this.reset();
      },
      init(rowData) {
      },
      reset() {
        this.noCreated = true;
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .ModalAppKeyMessage {
    .ant-modal-body {
    }
  }
</style>
