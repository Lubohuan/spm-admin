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
  <div id="subMessage0">
    <!--租户基本信息  -->
    <div class="m-box">
      <div class="m-title">
        <span class="m-text">租户基本信息</span>
      </div>
      <div class="m-content">
        <a-row :gutter="24" class="m-item">
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">租户编码：</span>
              <span class="m-value">{{message.tenantCode}}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">公司名称：</span>
              <span class="m-value">{{message.name}}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">公司简称：</span>
              <span class="m-value">{{message.shortName}}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">公司地址：</span>
              <span class="m-value">{{message.address}}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">公司性质：</span>
              <span class="m-value">{{message.nature}}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="m-item">
              <span class="m-label">社会统一信用代码：</span>
              <span class="m-value">{{message.num}}</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "subMessage0",
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
          startTime: "", //-- 0 为无限期
          endTime: "", //--0为无限期
          activationTime: "", //--0为未激活 激活时间
          userId: "" //--操作人id
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
      init(data) {
        this.message = data;
      },
      reset() {
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
</style>
