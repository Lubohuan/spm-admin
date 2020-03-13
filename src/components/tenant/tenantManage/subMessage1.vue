import aClock from '@/common/aClock';
/**
* @Author: 路博欢
* @Date: 2019/8/19
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/19
**/
<comment>
  # 组件注释
  密钥申请信息
</comment>
<template>
  <div id="subMessage1">
    <!--密钥申请信息  -->
    <div class="m-box">
      <div class="m-title">
        <span class="m-text">密钥申请信息</span>
      </div>
      <div class="m-content">
        <a-row :gutter="24" class="m-item">
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">申请编码：</span>
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
          <a-col :span="24">
            <div class="m-item flex">
              <span class="m-label">申请理由：</span>
              <span class="m-value flex-1">{{message.reason}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item flex">
              <span class="m-label">合同/协议附件：</span>
              <span class="m-value flex-1">
                <!-- <a
                  
                  :href="message.url"
                  :download="message.fileName"
                >{{message.fileName}}</a> -->
                <span class="fileDownLoad" @click="downLoadFile(message.url,message.fileName)">{{message.fileName}}</span>
              </span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "subMessage1",
  components: {},
  props: {},
  data() {
    return {
      message: {
        tenantId: "", //--租户id
        tenantCode: "", //--租户编码
        name: "", //--公司名称
        shortName: "", // --公司简称
        address: "", // --公司地址
        nature: "", // --公司性质
        num: "", //--统一信用编码
        applyNum: "", // --申请编码
        reason: "", //"申请事由", --申请事由
        url: "", // --附件url
        secretType: "", //--密钥状态
        secretNum: "", // --产品密钥
        id: "", // --密钥表id
        fileName: "", //文件名称
        startTime: "", //-- 0 为无限期
        endTime: "", //--0为无限期
        activationTime: "", //--0为未激活 激活时间
        userId: "", //--操作人id
        createTime: "" //申请时间
      }
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    init(data) {
      this.message = data;
    },
    downLoadFile(href,name){
      //let a = document.createElement('a');
      //a.setAttribute("href",href);
      let fileType = Util.getFileType(name)
      if(fileType=='excel'||fileType=='ppt'||fileType=='word'){
        window.open('https://view.officeapps.live.com/op/view.aspx?src=' + href,'_blank')
      }else{//image/pdf/txt
        window.open(href,'_blank')
      }
      //a.setAttribute("download", name);
      //a.click();
    },
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
