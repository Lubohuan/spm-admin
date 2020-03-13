import Title from '@/Title';
import { Select } from 'ant-design-vue';
/**
* @Author: 路博欢
* @Date: 2019/8/12
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/12
**/
<comment>
    # 组件注释
    公用组件

      变量如下
    
      事件如下
      addFreeStyle:为父组件增加日期
</comment>
<template>
  <a-popover
    class="aTagsadd"
    trigger="click"
    placement="left"
    v-model="visible"
    @visibleChange="visibleChangeFunc"
  >
    <!-- 内容 -->
    <template slot="content">
      <div class="freeStyle-box">
        <div class="freeStyle-title">
          <span class="pointer" @click.stop="closePopover">
            <a-icon type="left" :style="{'color':'#9C9C9C'}" />
          </span>
          <ul class="tab-list">
            <li class="tab" @click="toggleTab('pre')" :class="showTab=='pre'?'active':''">提前</li>
            <li class="tab" @click="toggleTab('free')" :class="showTab=='free'?'active':''">自定义</li>
          </ul>
          <span class="pointer" @click.stop="closePopover">
            <a-icon type="close" :style="{'color':'#9C9C9C'}" />
          </span>
        </div>
        <div class="freeStyle-content">
          <div class="tab-content" v-if="showTab=='pre'">
            <div class="preContent">
              <div class="pre-left">
                <p
                  class="pre-tab"
                  :class="preType=='day'?'active':''"
                  @click="togglepreType('day')"
                >
                  <span>天</span>
                </p>
                <p
                  class="pre-tab"
                  :class="preType=='hour'?'active':''"
                  @click="togglepreType('hour')"
                >
                  <span>时</span>
                </p>
                <p
                  class="pre-tab"
                  :class="preType=='minute'?'active':''"
                  @click="togglepreType('minute')"
                >
                  <span>分</span>
                </p>
              </div>
              <div class="pre-right">
                <ul class="time-list">
                  <li
                    class="time-col"
                    :class="currentPreTime==item?'active':''"
                    v-for="(item,index) in timeArray"
                    :key="index"
                    @click="selectPreTime(item)"
                  >
                    <span>{{item}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="tab-content" v-else>
            <div class="calendar-container">
                <div class="calendar-timePicker">
                    <a-time-picker  v-model="currentFreeTime_hm" format="HH:mm" size="small" placeholder="选择时间" @change="changecurrentFreeTime_hm"/>
                </div>
                <div :style="{ width: '290px', border: '1px solid #fff', borderRadius: '3px',marginTop:'-10px' }">
                <a-calendar :validRange="[moment(),moment().add(10,'years')]"  :fullscreen="false" @change="changeFreeDate" :disabledDate="disabledDate"/>
                </div>
            </div>
          </div>

        </div>
        <div class="freeStyle-footer">
            <a-button type="primary" @click="trueCreateTime">确定</a-button>
        </div>
      </div>
    </template>
    <span class="remindFreeStyle-setting">
      <a-icon type="plus" />自定义设置
    </span>
  </a-popover>
</template>
<script>
export default {
  name: "aTagsadd",
  components: {},
  props: {},
  data() {
    return {
      visible: false,
      showTab: "pre",
      preType: "day",
      currentPreTime: "",
      defaultDate:this.moment(),
      currentFreeTime_date:this.moment(),
      currentFreeTime_hm:this.moment().add(1, 'h'),
      currentFreeTime:'',
      timeArray: []
    };
  },
  computed: {},
  created() {
    this.getTimeArray("day");
  },
  mounted() {},
  watch: {
    value(newVal, oldVal) {
      this.value = Number(newVal);
    },
    filterTagName(newVal, oldVal) {}
  },
  methods: {
    /*组件重置*/
    reset() {
      this.showTab = "pre";
      this.preType = "day";
      this.currentPreTime = '';
      this.currentFreeTime = "";
      this.getTimeArray(this.preType);
    },
    /*获取提前天/时/分的选项*/
    getTimeArray(preType) {
      var array = [];
      if (preType == "day") {
        for (var i = 1; i < 31; i++) {
          array.push(i);
        }
      } else if (preType == "hour") {
        for (var i = 1; i < 24; i++) {
          array.push(i);
        }
      } else {
        for (var i = 5; i < 60; i += 5) {
          array.push(i);
        }
      }
      this.timeArray = array;
    },
    //日历组件不可选择的时间
    disabledDate(val){
        return this.moment(val) <= this.moment().subtract(1, 'days') ;
    },
    //关闭气泡弹出框
    closePopover() {
      this.visible = false;
      this.$nextTick(() => {
        var timer1 = setTimeout(() => {
          this.reset();
          clearTimeout(timer1);
        }, 500);
      });
    },
    //气泡框显示的回调
    visibleChangeFunc(val) {
      if (val) {
        this.$nextTick(() => {
          var timer2 = setTimeout(() => {
            clearTimeout(timer2);
          }, 500);
          //document.getElementById('searchTag').focus()
        });
      }
    },
    /*提前和自定义 tab切换*/
    toggleTab(style) {
      this.showTab = style;
      if(style=="pre"){
          this.currentFreeTime = '';
      }else{
          this.currentPreTime = '';
          this.togglepreType('day');
          this.currentFreeTime_date = this.moment().format('YYYY-MM-DD');
          this.currentFreeTime_hm = this.moment().add(1, 'h');
      }
    },
    /*提前的类型 切换*/
    togglepreType(style) {
      this.currentPreTime = "";
      this.preType = style;
      this.getTimeArray(this.preType);
    },
    /*选中提前的时间*/
    selectPreTime(item) {
        // if(this.currentPreTime){
        //     this.currentPreTime = ''
        // }else{
            this.currentPreTime = item;
        //}
    },
    /*改变小时和分钟*/
    changecurrentFreeTime_hm(){
        let hm = this.moment(this.currentFreeTime_hm).format('HH:mm');
        this.compareTime(this.currentFreeTime_date,hm);
    },
    /*日期面板变化/点击选择日期 以上两种都触发此事件*/
    changeFreeDate(value){
        this.currentFreeTime_date = this.moment(value['_d']).format('YYYY-MM-DD');
        let hm = this.moment(this.currentFreeTime_hm).format('HH:mm');
        this.compareTime(this.currentFreeTime_date,hm);
    },
    compareTime(date,hm){
        let detailTime = date+" "+ hm
        let nowTime = new Date().getTime();
        let selectTime = new Date(detailTime).getTime()
        if(nowTime<selectTime){
            this.currentFreeTime = this.moment(detailTime).format('YYYY-MM-DD HH:mm');
        }else{
            this.$message.warning("所选时间不能晚于当前时间!");
            this.currentFreeTime_hm = this.moment().add(1, 'h'),
            this.currentFreeTime = this.moment(this.currentFreeTime_date).format('YYYY-MM-DD')+" "+this.moment(this.currentFreeTime_hm).format('HH:mm')
        }
    },
    /*点击确定按钮*/
    trueCreateTime(){
        if(!this.currentPreTime&&!this.currentFreeTime){
             this.$message.warning("请选择时间!");
        }else{
            if(this.currentPreTime){
                let unit = ''
                if(this.preType=="day"){
                    unit="天"
                }else if(this.preType=="hour"){
                    unit="小时"
                }else{
                    unit="分钟"
                }
                this.$emit('addFreeStyle',"提前"+this.currentPreTime+unit)
            }
            if(this.currentFreeTime){
                this.$emit('addFreeStyle',this.currentFreeTime+'提醒')
            }
        }
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.freeStyle-box {
  width: 310px;
  margin: -12px -16px;
}
.freeStyle-title {
  display: flex;
  height: 40px;
  padding: 0 10px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $border-color-1;
}
$freeStyle-content-height:320px;
.freeStyle-content {
  padding: 10px;
  height: $freeStyle-content-height;
  .ant-fullcalendar-header{
      text-align: left;
  }
  .ant-radio-group{//隐藏日历年/月切换
      display: none;
  }
}
.freeStyle-footer{
    padding: 10px 16px;
    text-align: right;
    border-top: 1px solid $border-color-1;
}
.calendar-container{
    position: relative;
    .calendar-timePicker{
         position: absolute;
         right: 0;
         top: 12px;
    }
}
.tab-list {
  display: flex;

  justify-content: center;
  .tab {
    cursor: pointer;
    padding: 13px 2px 10px 2px;
    width: 49px;
    text-align: justify;
    text-align-last: justify;
    margin: 0 15px;
    border-bottom: 2 solid transparent;
  }
  .tab.active {
    @include primary_color();
    border-bottom: 2px solid;
    @include primary_border_color();
  }
}
.preContent {
  display: flex;
  .pre-left {
    height: calc(320px - 20px);
    border-right: 1px solid $border-color-1;
    display: flex;
    flex-direction: column;
    .pre-tab:first-child {
      border-radius: 3px 0 0 0;
    }
    .pre-tab:last-child {
      border-radius: 0px 0 0px 3px;
    }
    .pre-tab {
      display: inline-block;
      position: relative;
      width: 38px;
      height: 26px;
      margin-top: -1px;
      border: 1px solid $border-color-1;
      border-right: none;
      //   @include primary_border_color();
      //   border-right-color: #fff!important;
      text-align: center;
      cursor: pointer;
      span {
        position: absolute;
        top: 0;
        margin-left: 1px;
        left: 1px;
        padding: 5px 11px 5px 11px;
      }
    }
    .pre-tab.active {
      span {
        background: #fff;
        @include primary_color();
      }
    }
  }
  .pre-right {
    flex: 1;
    padding-left: 10px;
    height: calc(320px - 20px);
    border: 1px solid $border-color-1;
    border-radius: 0 3px 3px 3px;
    border-left: none;
    margin-top: -1px;
    margin-left: -1px;
    .time-list {
      display: flex;
      flex-wrap: wrap;
      .time-col {
        width: 25px;
        height: 25px;
        border-radius: 3px;
        line-height: 25px;
        text-align: center;
        cursor: pointer;
        margin: 12px 10px 12px 12px;
      }
      .time-col.active,
      .time-col:hover {
        color: #fff;
        @include primary_bg_color();
      }
    }
  }
}
</style>
