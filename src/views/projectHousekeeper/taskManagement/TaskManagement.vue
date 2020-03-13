/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
  #组件说明
  项管家-任务管理
</comment>
<template>
  <div id="TaskManagement" class="flex">
    <Title></Title>
    <a-layout-sider
      :trigger="null"
      width="250px"
      :collapsedWidth="0"
      collapsible
      theme="light"
      v-model="collapsed"
    >
      <div class="task-left p-l-15 p-r-15">
        <ul class="task-left-project pointer">
          <li class="flex justify-between align-center">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy" style="font-size: 16px"></icon-font>
              <div>标准任务</div>
            </div>
            <icon-font type="spm-icon-copy"></icon-font>
          </li>
          <li class="flex justify-between align-center" @click="openTaskSelectAction">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy5" style="font-size: 16px"></icon-font>
              <div>金控项目</div>
            </div>
            <icon-font type="spm-icon-copy"></icon-font>
          </li>
          <li class="flex justify-between align-center">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy4" style="font-size: 16px"></icon-font>
              <div>任务分类</div>
            </div>
            <icon-font type="spm-icon-plus-circle"></icon-font>
          </li>
        </ul>
        <TaskClassify v-model="selected" :classifys="classifys"></TaskClassify>
        <ul class="task-left-project pointer">
          <li class="flex justify-between align-center" @click="selectTaskType(1)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy" style="font-size: 16px"></icon-font>
              <div class="pro-label">所有任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(2)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy1" style="font-size: 16px;color: #f99"></icon-font>
              <div class="pro-label">今日任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(3)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy7" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">未完成任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(4)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy3" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">已完成任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(5)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy15" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">已逾期任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(6)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy8" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">逾期已完成任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(7)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy6" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">我创建的任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(8)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy10" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">我负责的任务</div>
            </div>
          </li>
          <li class="flex justify-between align-center" @click="selectTaskType(9)">
            <div class="flex align-center">
              <icon-font type="spm-icon-copy11" fill="#f99" style="font-size: 16px"></icon-font>
              <div class="pro-label">抄送我的任务</div>
            </div>
          </li>
        </ul>
      </div>
    </a-layout-sider>
    <div class="task-right p-15">
      <div class="top_menu">
        <span class="taks_list" @click="collapsed = !collapsed">
          <icon-font type="spm-icon-copy12"></icon-font>
          任务列表
        </span>
        <span class="task_filter" :class="{task_filter_active:taskFilterActive}" @click="openTaskFilterAction">
          筛选
          <icon-font type="spm-icon-yincang"></icon-font>
        </span>

      </div>
      <ul class="flex task-right-lists">
        <li class="">
          <div class="card-title m-t-20 flex justify-between align-center">
            <span>待处理</span>
            <icon-font type="spm-icon-gengduo"></icon-font>
          </div>
          <a-divider/>
          <div class="table-content">
            <TableLists tableType="card"></TableLists>
          </div>
          <div @click="handleModalNewTask(true)" class="add-btn m-t-10 pointer flex align-center justify-center"
               v-waves>
            <icon-font type="spm-icon-copy6"></icon-font>
          </div>
        </li>
        <li class="m-l-15">
          <div class="card-title m-t-20 flex justify-between align-center">
            <span>待处理</span>
            <icon-font type="spm-icon-gengduo"></icon-font>
          </div>
          <a-divider/>
          <div class="table-content">
            <TableLists tableType="card"></TableLists>
          </div>
          <div @click="handleModalNewTask(true)" class="add-btn m-t-10 pointer flex align-center justify-center"
               v-waves>
            <icon-font type="spm-icon-copy6"></icon-font>
          </div>
        </li>
        <li class="m-l-15">
          <div class="card-title m-t-20 flex justify-between align-center">
            <span>待处理</span>
            <icon-font type="spm-icon-gengduo"></icon-font>
          </div>
          <a-divider/>
          <div class="table-content">
            <TableLists tableType="card"></TableLists>
          </div>
          <div @click="handleModalNewTask(true)" class="add-btn m-t-10 pointer flex align-center justify-center"
               v-waves>
            <icon-font type="spm-icon-copy6"></icon-font>
          </div>
        </li>
      </ul>

      <!-- 选择项目 -->
      <TaskSelect ref="taskSelect" />
      <!-- 任务筛选 -->
      <TaskFilter ref="TaskFilter" @closeTaskFilterAction="closeTaskFilterAction" @taskFilter="taskFilter"/>
    </div>
    <!-- <a-card class="m-20">
       <div class="item">
         <span class="label">姓名</span>：
         <span class="value">呵呵</span>
       </div>
       <div class="item">
         <span class="label">出生日期</span>：
         <span class="value">25他</span>
       </div>
       <a-button type="primary" v-waves @click="handleModalNewTask(true)">
         <icon-font type="spm-icon-plus-circle"></icon-font>
         新建任务
       </a-button>


     </a-card>-->
    <!-- 新建任务模态框 -->
    <ModalNewTask ref="ModalNewTask" />
    <org-modal v-if="orgVisible" :isVisible='orgVisible' @closed="orgVisible = false"
    ></org-modal>
  </div>
</template>

<script>
  import ModalNewTask from "@/taskManagement/ModalNewTask";
  // import TaskClassify from "@/taskManagement/TaskClassify";
  import { TaskClassify, Pagination, OrgModal } from 'hz-components'
  import 'hz-components/dist/hz-components.css'
  import TableLists from "@/taskManagement/TableLists";
  import TaskSelect from '@/taskManagement/TaskSelect'
  import TaskFilter from '@/taskManagement/TaskFilter'
  export default {
    name: 'TaskManagement',
    components: {
      ModalNewTask,
      TaskClassify,
      TableLists,
      TaskSelect,
      TaskFilter,
      Pagination,
      'org-modal': OrgModal
    },
    props: {},
    data() {
      return {
        showModalNewTask: false,
        selected: 1,
        collapsed: false,
        classifys: [
          {
            title: '吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃吃',
            finished: 2,
            total: 5,
            level0: 2,
            level1: 1,
            level2: 1,
            level3: 1
          },
          {
            title: '喝',
            finished: 2,
            total: 5,
            level0: 2,
            level1: 1,
            level2: 1,
            level3: 1
          },
          {
            title: '睡',
            finished: 4,
            total: 20,
            level0: 4,
            level1: 2,
            level2: 10,
            level3: 4
          },
        ],
        taskFilterActive:false,
        globalFilterType:1,
        options: {},
        orgVisible: true
      }
    },
    computed: {},
    created() {
      this.initOptions()
    },
    mounted() {
    },
    watch: {},
    methods: {
      handleModalNewTask() {
        this.$refs['ModalNewTask'].handleOpen()
      },
      // 打开选择任务组件
      openTaskSelectAction() {
        this.$refs.taskSelect.openTaskSelect()
      },
      // 打开任务筛选
      openTaskFilterAction(){
        this.$refs.TaskFilter.openTaskFilter(this.globalFilterType)
        this.taskFilterActive = true
      },
      // 关闭筛选
      closeTaskFilterAction(){
        this.taskFilterActive = false
      },
      // 筛选任务
      taskFilter(e){
        console.log(e)
      },
      // 选择任务分类
      selectTaskType(type){
        this.globalFilterType = type
        this.$refs.TaskFilter.closeTaskFilter()
      },
      initOptions() {
        let xdata = [
          "广西分公司",
          "基础设施分公司",
          "深圳分公司",
          "云贵分公司",
          "广州分公司",
          "川渝分公司"
        ];
        let dataArr = [84.4, 98.68, 77.52, 67.13, 82.77, 93.98];
        this.options = {
          tooltip: {
            // 提示框组件
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            },
            show: true,
            formatter: function(params) {
              return params[0].name + "<br>" + params[0].data + "%";
            }
          },
          grid: {
            left: "2%",
            right: "4%",
            bottom: "5%",
            top: "27%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            data: xdata,
            axisTick: {
              show: false
            },
            axisLine: {
              //x轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: "rgba(219,225,255,1)",
                width: 1,
                type: "solid"
              }
            },
            axisLabel: {
              //x轴文字的配置
              show: true,
              //interval: 0,//使x轴文字显示全
              textStyle: {
                color: "rgba(219, 225, 255, 1)"
              },
            }
          },
          yAxis: {
            type: "value",
            name: "合格率", //y轴上方的单位
            nameTextStyle: {
              //y轴上方单位的颜色
              color: "#fff",
              fontSize: 10
            },
            axisLabel: {
              //y轴文字的配置
              textStyle: {
                color: "rgba(219,225,255,1)",
                margin: 15,
                fontSize: 10
              },
              formatter: "{value} %" //y轴的每一个刻度值后面加上‘%’号
            },
            axisTick: {
              show: false
            },
            axisLine: {
              //y轴线的颜色以及宽度
              show: true,
              lineStyle: {
                color: "rgba(219,225,255,1)",
                width: 1,
                type: "solid"
              }
            },
            splitLine: {
              //分割线配置
              show: false,
              lineStyle: {
                color: "rgba(219,225,255,1)"
              }
            }
          },
          series: [
            {
              name: "1",
              type: "bar",
              barWidth: "20%",
              itemStyle: {
                normal: {
                  color: "#0063FF"
                  // barBorderRadius: 12,
                }
              },
              data: dataArr
            }
          ]
        };
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #TaskManagement {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .task-left {
      box-shadow: 1px 0px 3px 0px rgba(0, 0, 0, 0.2);
      height: 100%;
      background: #fff;
      .task-left-project {
        li {
          height: 40px;
          .pro-label {
            color: $font-color-3;
          }

        }

      }
    }
    .task-right {
      position: relative;
      width: 100%;
      box-shadow: 1px 0px 3px 0px rgba(0, 0, 0, 0.2);
      height: 100%;
      overflow: hidden;
      background: rgba(248, 248, 248, 1);
      .task-right-lists {
        height: 100%;
        li {
          height: 100%;
          width: 280px;
          .table-content {
            max-height: calc(100% - 100px);
            height: auto;
            overflow: auto;
          }
        }
      }
      .top_menu{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .taks_list{
          cursor: pointer;
        }
        .task_filter{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          width: 60px;
          border-radius:2px;
          font-size:14px;
          font-weight:400;
          cursor: pointer;
          color:rgba(48,48,48,1);
        }
        .task_filter_active{
          background:rgba(234,111,70,.1);
          color: rgba(234, 111, 70, 1);
        }
      }
    }
    .add-btn {
      width: 280px;
      height: 35px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
  }

  .item {
    margin-bottom: 8px;
    .label {
      display: inline-block;
      height: 100%;
      width: 100px;
      text-align: justify;
      text-align-last: justify;
    }
    .value {
      padding-right: 10px;
    }
  }
</style>
