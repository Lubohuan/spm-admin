/**
* @Author: 李晨光
* @Date: 2019/8/7
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/7
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="TableLists">
    <!--list-->
    <a-table class="table-tree-lists" v-if="tableType == 'list'"  @expand="expand" :pagination="false" :columns="listsTitles"
             :dataSource="tableData"
    >
      <template slot="name" slot-scope="text, record">
        <div class="justify-between align-center tree-content" style="display: inline-flex;min-width: 100px;">
          <div class="tree-line-left"></div>
          <div class="tree-line-bottom"></div>
          <img class="avatar m-r-10" src="../../../static/man_2.jpg" alt="">
          <div>{{record.name}}</div>
        </div>
        <div :class="{
        'level0': record.level == '0',
        'level1': record.level == '1',
        'level2': record.level == '2',
        'level3': record.level == '3',
        }" style="width: 3px;height: 100%;position: absolute;top: 0;left: 0;border-radius: 2px 0 0 2px">
        </div>
      </template>
    </a-table>
    <!--card-->
    <a-table class="table-tree-card" v-if="tableType == 'card'"  @expand="expand" ref="table-tree-card" :pagination="false"
             :showHeader="false" :columns="cardTitles" :dataSource="tableData"
    >
      <template slot="name" slot-scope="text, record">
        <div class="justify-between align-start content" style="display: inline-flex">
          <div class="line-left"></div>
          <div class="line-bottom"></div>
          <img class="avatar m-r-10" src="../../../static/man_2.jpg" alt="">
          <div class="flex direction-column justify-start">
            <div>{{record.name}}</div>
            <div v-if="record.level ==  1" class="time">2019.06.05-2019.07.1</div>
            <div class="time">2019.06.05-2019.07.1</div>
            <div v-if="record.level ==  1" class="time">2019.06.05-2019.07.1</div>
            <div class="time">2019.06.05-2019.07.1</div>
          </div>
        </div>
        <a-checkbox style="position: absolute;right: 10px;top: 15px;" ></a-checkbox>
        <div :class="{
        'level0': record.level == '0',
        'level1': record.level == '1',
        'level2': record.level == '2',
        'level3': record.level == '3',
        }" style="width: 3px;height: 100%;position: absolute;top: 0;left: 0;border-radius: 2px 0 0 2px">
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>

  export default {
    name: 'TableLists',
    components: {},
    props: {
      tableType: {
        type: String,
        default: 'card'
      }
    },
    data() {
      return {
        screenWidth:window.innerWidth,
        listsTitles: [
          {
            title: '共70个任务',
            dataIndex: 'name',
            key: 'name',
            width: 100,
            scopedSlots: {customRender: 'name'},
          },
          {
            title: '标签',
            dataIndex: 'time',
            key: 'level',
            width: 100,
            align: 'center',
            scopedSlots: {customRender: 'name2'},
          },
          {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: 150,
            align: 'center'
          },
          {
            title: '从属关系',
            dataIndex: 'belong',
            key: 'belong',
            width: 200,
            align: 'center'
          },
        ],
        cardTitles: [{
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: {customRender: 'name'},
        },],
        tableData: [{
          key: 1,
          name: '吃火锅',
          time: '2019.06.05 23:20 - 2019.07.10 23:30',
          belong: '标准任务-金控项目-吃-待处理',
          level: '1',
          children: [{
            key: 11,
            name: '吃火锅',
            time: '2019.06.05 23:20 - 2019.07.10 23:30',
            belong: '标准任务-金控项目-吃-待处理',
            level: '3',
          }, {
            key: 12,
            name: '吃火锅',
            time: '2019.06.05 23:20 - 2019.07.10 23:30',
            belong: '标准任务-金控项目-吃-待处理',
            level: '1',
            children: [{
              key: 121,
              name: '吃火锅',
              time: '2019.06.05 23:20 - 2019.07.10 23:30',
              belong: '标准任务-金控项目-吃-待处理',
              level: '0',
            }],
          }, {
            key: 13,
            name: '吃火锅',
            time: '2019.06.05 23:20 - 2019.07.10 23:30',
            belong: '标准任务-金控项目-吃-待处理',
            level: '2',
            children: [{
              key: 131,
              name: '吃火锅',
              time: '2019.06.05 23:20 - 2019.07.10 23:30',
              belong: '标准任务-金控项目-吃-待处理',
              level: '1',
              children: [{
                key: 1311,
                name: '吃火锅',
                time: '2019.06.05 23:20 - 2019.07.10 23:30',
                belong: '标准任务-金控项目-吃-待处理',
                level: '3',
              }, {
                key: 1312,
                nname: '吃火锅',
                time: '2019.06.05 23:20 - 2019.07.10 23:30',
                belong: '标准任务-金控项目-吃-待处理',
                level: '1',
              }],
            }],
          }],
        }, {
          key: 2,
          name: '吃火锅',
          time: '2019.06.05 23:20 - 2019.07.10 23:30',
          belong: '标准任务-金控项目-吃-待处理',
          level: '1',
        }]
      }
    },
    computed: {},
    created() {
      setTimeout(() => {
        this.setStyleOfLine()
      })
    },
    mounted() {
      window.onresize = () => {
        return (() => {
           this.screenWidth = window.innerWidth
        })()
      }
    },
    watch: {
      screenWidth(val) {
        setTimeout(() => {
          this.setStyleOfLine()
        })
      }
    }
    ,
    methods: {
      /**
       * 设置树结构连接线
       */
      setStyleOfLine() {
        let tr = document.querySelectorAll('.content')
        let line = document.querySelectorAll('.line-left')
        let treeTr = document.querySelectorAll('.tree-content')
        let treeLine = document.querySelectorAll('.tree-line-left')
        let newTr = []
        let newTreeTr = []
        let newLine = []
        let newTreeLine = []
        tr.forEach((t, index) => {
          if (window.getComputedStyle(t.parentNode.parentNode, null).display != 'none') {
            newTr.push(t)
          }
        })
        line.forEach((l, index) => {
          if (window.getComputedStyle(l.parentNode.parentNode.parentNode, null).display != 'none') {
            newLine.push(l)
          }
        })
        treeTr.forEach((tt, index) => {
          if (window.getComputedStyle(tt.parentNode.parentNode, null).display != 'none') {
            newTreeTr.push(tt)
          }
        })
        treeLine.forEach((tl, index) => {
          if (window.getComputedStyle(tl.parentNode.parentNode.parentNode, null).display != 'none') {
            newTreeLine.push(tl)
          }
        })

        newLine.forEach((l, index) => {
          l.style.height = '0px'
          l.style.top = '0px'
        })
        newTr.forEach((t, index) => {
          if (newLine[index + 1]) {
            newLine[index + 1].style.height = (newTr[index].parentNode.offsetHeight) + 'px'
            newLine[index + 1].style.top = -(newTr[index].offsetHeight + 16) + 'px'
          }
        })
        treeLine.forEach((l, index) => {
          l.style.height = '0px'
          l.style.top = '0px'
        })
        newTreeTr.forEach((t, index) => {
          if (newTreeLine[index + 1]) {
            newTreeLine[index + 1].style.height = (newTreeTr[index].parentNode.offsetHeight) + 'px'
            newTreeLine[index + 1].style.top = -(newTreeTr[index].parentNode.offsetHeight - 16) + 'px'
          }
        })
      }
      ,
      expand() {
        setTimeout(() => {
          this.setStyleOfLine()
        })
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #TableLists {
    .table-tree-lists {
      .ant-table-thead > tr > th {
        background: #fff;
      }
      .ant-table-tbody > tr > td {
        position: relative;
      }
      .ant-table-row-expand-icon {
        position: absolute;
        width: 15px;
        height: 15px;
        line-height: 10px;
        top: 18px;
        bottom: 0;
        margin: auto 0;
        margin-left: -3px;
        border-radius: 50%;
        background: rgba(156, 156, 156, 1);
        border: 1px solid rgba(255, 255, 255, 1);
        z-index: 3;
      }
      .ant-table-row-expand-icon::after {
        color: #fff;
      }
      .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
        background: #fff;
      }
      .ant-table-row {
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          position: relative;
          z-index: 2;
        }
      }
      .ant-table-row-level-0 {
        .tree-content .tree-line-bottom {
          display: none;
        }
        .tree-content .tree-line-left {
          display: none;
        }
      }
      .ant-table-row:not(.ant-table-row-level-0) {
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          position: relative;
          z-index: 2;
        }
        .tree-content {
          position: relative;
        }

        .tree-content .tree-line-left {
          position: absolute;
          content: '';
          top: 0;
          left: -16px;
          width: 5px;
          height: 0px;
          border-style: none none none dashed;
          border-width: 1px;
          border-color: #ddd;

        }
        .tree-content .tree-line-bottom {
          position: absolute;
          content: '';
          top: 16px;
          margin-left: -15px;
          width: 13px;
          border-style: none none dashed none;
          border-width: 1px;
          border-color: #ddd;
          overflow: hidden;
        }
      }
    }
    .table-tree-card {
      background: transparent;
      .ant-table-tbody > .ant-table-row-level-0 {
        /*margin-bottom: 10px;*/
        background: #F8F8F8;
        border-top: 5px solid transparent;
        margin-top: 5px;
        border-bottom: 0px solid transparent;
        td {
          border-top: 5px solid transparent;
        }
      }
      .ant-table-tbody > tr > td {
        position: relative;
        background: #fff;
        border-bottom: none;
        margin:0;
      }
      .ant-table-row-expand-icon {
        position: absolute;
        width: 15px;
        height: 15px;
        line-height: 10px;
        top: 38px;
        margin-left: -3px;
        border-radius: 50%;
        background: rgba(156, 156, 156, 1);
        border: 1px solid rgba(255, 255, 255, 1);
        z-index: 3;
      }
      .ant-table-row-expand-icon::after {
        color: #fff;
      }
      .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
        background: #fff;
      }
      .ant-table-row {
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          position: relative;
          z-index: 2;
        }
      }
      .ant-table-row-level-0 {
        .content .line-bottom {
          display: none;
        }
        .content .line-left {
          display: none;
        }
      }
      .ant-table-row:not(.ant-table-row-level-0) {
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 18px;
          position: relative;
          z-index: 2;
        }
        .content {
          position: relative;
        }

        .content .line-left {
          position: absolute;
          content: '';
          top: 0;
          left: -16px;
          width: 5px;
          height: 70px;
          border-style: none none none dashed;
          border-width: 1px;
          border-color: #ddd;

        }
        .content .line-bottom {
          position: absolute;
          content: '';
          top: 16px;
          margin-left: -15px;
          width: 13px;
          border-style: none none dashed none;
          border-width: 1px;
          border-color: #ddd;
          overflow: hidden;
        }
      }
    }
    .level0 {
      background: $default-color;
    }
    .level1 {
      background: $success-color;
    }
    .level2 {
      background: $warning-color;
    }
    .level3 {
      background: $danger-color;
    }

    .time {
      color: $font-color-3;
      font-size: $font-size-3;
      line-height: $line-height-3;
    }
  }
</style>
