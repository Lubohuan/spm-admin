/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
  # 组件注释
  error页面组件 404 403 500
</comment>
<template>
  <div class="exception flex flex-wrap align-center justify-between">
    <div class="imgBlock">
      <div class="imgEle" :style="{backgroundImage: `url(${config[type].img})`}">
      </div>
    </div>
    <div class="content flex flex-wrap justify-center direction-column">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="actions">
        <a-button type="primary" @click="handleToHome">返回首页</a-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Exception',
    props: {
      type: {
        type: String,
        default: '404'
      }
    },
    data() {
      return {
        config: {
          403: {
            img: 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg',
            title: '403',
            desc: '抱歉，你无权访问该页面'
          },
          404: {
            img: 'https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg',
            title: '404',
            desc: '抱歉，你访问的页面不存在或仍在开发中'
          },
          500: {
            img: 'https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg',
            title: '500',
            desc: '抱歉，服务器出错了'
          }
        }
      }
    },
    methods: {
      handleToHome() {
        this.$router.push({name: 'Home'})
      }
    }
  }
</script>
<style lang="scss">
  .exception {
    height: 100%;
    padding: 0 100px;
    .imgBlock {
      padding: 0 100px;
      width: 50%;
      zoom: 1;
      &::before,
      &::after {
        content: ' ';
        display: table;
      }
      &::after {
        clear: both;
        height: 0;
        font-size: 0;
        visibility: hidden;
      }
    }

    .imgEle {
      width: 100%;
      height: 360px;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: contain;
    }

    .content {
      padding: 0 100px;
      width: 50%;
      h1 {
        margin-bottom: 24px;
        color: #434e59;
        font-weight: 600;
        font-size: 72px;
        line-height: 72px;
      }

      .desc {
        margin-bottom: 16px;
        color: $font-color-3;
        font-size: 20px;
        line-height: 28px;
      }
      .actions {
        button:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }

</style>
