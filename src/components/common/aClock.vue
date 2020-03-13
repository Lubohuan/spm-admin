/**
* @Author: 路博欢
* @Date: 2019/8/9
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/9
**/
<comment>
    # 组件注释
    公用组件

      变量如下
      
      事件如下
</comment>
<template>
  <a-modal
    id="aClock"
    v-model="visible"
    :width="350"
    :destroyOnClose="true"
    :afterClose="handleClose"
    :maskClosable="false"
    class="aClockModal"
  >
    <template slot="title">
      <icon-font type="spm-icon-copy17" class="clock-icon-style"></icon-font>
      <!-- 任务提醒设置 -->
    </template>
    <div class="body">
      <!-- 提醒人员 -->
      <div class="clock-box">
        <div class="clock-title">
          <span>选择提醒人员</span>
        </div>
        <div class="clock-content">
          <ul class="clock-selectList remindPerson">
            <li class="clock-selectList-item" v-for="(item,index) in remindPerson" :key="index" @click="toggleSelect(remindPerson,item,index)">
              <div class="item-name">{{item.name}}</div>
              <span class="item-isSelected" v-if="item.selected">
                <a-icon type="check" class="check-icon icon-selected" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clock-splitLine"></div>
      <!-- 提醒方式 -->
      <div class="clock-box">
        <div class="clock-title">
          <span>选择提醒方式</span>
        </div>
        <div class="clock-content">
          <ul class="clock-selectList remindType">
            <li class="clock-selectList-item" v-for="(item,index) in remindType" :key="index" @click="toggleSelect(remindType,item,index)">
              <div class="item-name">{{item.name}}</div>
              <span class="item-isSelected" v-if="item.selected">
                <a-icon type="check" class="check-icon icon-selected" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="clock-splitLine"></div>
      <!-- 提醒时间 -->
      <div class="clock-box">
        <div class="clock-title">
          <span>选择提醒时间</span>
        </div>
        <div class="clock-content">
          <ul class="clock-selectList remindTime">
            <li class="clock-selectList-item" v-for="(item,index) in remindTime" :key="index" @click="toggleSelect(remindTime,item,index)">
              <div class="item-name">{{item.name}}</div>
              <span class="item-isSelected" v-if="item.selected">
                <a-icon type="check" class="check-icon icon-selected" />
              </span>
            </li>
            <li class="" style="display:inline-block">
                <!-- 自定义设置提醒时间组件 -->
               <aClockFree ref="aClockFree" @addFreeStyle="addFreeStyle"/>(<span>{{remindFreeStyle.length}}</span>)
            </li>
            <li class="clock-selectList-item" v-for="(rtem,ri) in remindFreeStyle" :key="'ri'+ri">
              <div class="remindFreeStyle-setting">
                  {{rtem}}
                  <a-icon class="delFreeStyle-icon" theme="filled" type="close-circle" @click="delFreeStyle(ri)"/>
                </div>
               <span class="item-isDelete" >
                <a-icon type="check" class="check-icon icon-selected" />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <template slot="footer">
      <a-button key="back" @click="reset">清除</a-button>
      <a-button key="submit" type="primary" @click="commitClock">确定</a-button>
    </template>
  </a-modal>
</template>
<script>
import aClockFree from "@/common/aClockFree"; //自定义时间选择组件
export default {
  name: "aClock",
  components: {
      aClockFree
  },
  // props:{
  //   delAbled:{
  //     type:Boolean,
  //     default:false
  //   },
  //   src:{
  //     type:String,
  //     default:''
  //   },
  //   name:{
  //     type:String,
  //     default:''
  //   }
  // },
  data() {
    return {
      visible: false,
      remindPerson: [
        {
          name: "创建人",
          id: "1",
          selected: false
        },
        {
          name: "负责人",
          id: "2",
          selected: false
        },
        {
          name: "参与人",
          id: "3",
          selected: false
        },
        {
          name: "抄送人",
          id: "4",
          selected: false
        }
      ],
      remindType: [
        {
          name: "系统内部提醒",
          id: "1",
          selected: false
        },
        {
          name: "短信提醒",
          id: "2",
          selected: false
        }
      ],
      remindTime: [
        {
          name: "提前1天",
          id: "1",
          selected: false
        },
        {
          name: "提前1小时",
          id: "2",
          selected: false
        },
        {
          name: "提前30分钟",
          id: "3",
          selected: false
        },
        {
          name: "提前10分钟",
          id: "4",
          selected: false
        },
      ],
      remindFreeStyle:[

      ]
    };
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*重置模态框中的值*/
    reset() {
        this.remindPerson.forEach((item)=>{
            item.selected = false;
        })  
        this.remindType.forEach((item)=>{
            item.selected = false;
        })  
        this.remindTime.forEach((item)=>{
            item.selected = false;
        })  
        this.remindFreeStyle = [];
    },
    /*打开modal的事件*/
    handleOpen() {
      this.visible = true;
    },
    /*关闭modal后的回调事件*/
    handleClose() {
      this.visible = false;
      this.reset();
    },
    /*选择与取消选择*/
    toggleSelect(array,item,index){
        this.$set(array[index],'selected',!item.selected)
    },
    /**新增自定义事件,供子组件调用 */
    addFreeStyle(item){
        this.remindFreeStyle.push(item)
    },
    /*删除自定义时间*/
    delFreeStyle(index){
        this.remindFreeStyle.splice(index,1)
    },
    /*确定提交*/
    commitClock(){

    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.aClock {
}
.aClockModal {
  .ant-modal-body {
    height: $modal-maxHeight-600;
    max-height: $modal-maxHeight-700;
    overflow-y: auto;
  }
  .ant-modal-body{
    padding:0 15px;
  }
}
.clock-splitLine{
    border: 5px solid #f9f9f9;
}
$clock-Height:32px;
$clock-lineHeight:32px;
$clock-padding-left:6px;
.clock-box {
  padding: 10px 0;
  .clock-title {
    color: $font-color-3;
    padding-left: $clock-padding-left;
    height: $clock-Height;
    line-height: $clock-lineHeight;
    font-size: 15px;
  }
  .clock-content {
    ul.clock-selectList {
      padding: 4px 0;
      li.clock-selectList-item {
        &:hover {
          @include primary_bg_color_o();
        }
      }
      li{
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        line-height: $clock-lineHeight;
        height: $clock-Height;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 $clock-padding-left;
        .remindFreeStyle-setting,
        .item-name {
          flex: 1;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .remindFreeStyle-setting{
            @include primary_color();
            .delFreeStyle-icon{
                margin-left: 10px;
                color:$font-color-3;
                display: none;
                &:hover{
                     @include primary_color();
                }
            }

        }
        .remindFreeStyle-setting:hover{
             .delFreeStyle-icon{
                 display: inline-block;
             }
        }
        // .tag-edit {
        //   display: none;
        //   margin-right: 15px;
        //   padding: 0 5px;
        //   font-size: 16px;
        //   &:hover .form-icon {
        //     @include primary_color();
        //   }
        // }
        .check-icon {
        
        }
      }
    }
  }
}
</style>
