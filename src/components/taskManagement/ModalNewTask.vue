/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 组件注释
</comment>
<template>
  <a-modal
    id="ModalNewTask"
    v-model="visible"
    :width="570"
    title="新建任务"
    :destroyOnClose="true"
    :afterClose="handleClose"
    :maskClosable="false"
    class="bodyContainer"
  >
    <div class="body">
      <a-form refs="formNewTask" :form="form">
        <a-form-item>
          <a-input placeholder="任务标题" v-decorator="['title']"></a-input>
        </a-form-item>
        <a-form-item>
          <div class="textareaContainer">
            <a-textarea placeholder="详情描述" v-decorator="['detail']" :rows="4" />
            <span class="appendix">
              <a-icon type="paper-clip" :style="{'font-size':iconSize}" />
            </span>
          </div>
        </a-form-item>
      </a-form>
      <!-- 负责人 -->
      <ul class="info-list">
        <li class="info-item">
          <!-- 负责人单选 -->
          <div class="info-item-label">
            <icon-font type="spm-icon-copy10" class="label-icon-style"></icon-font>
            <span>负责人·</span>
            <span>{{executors_fuze.length}}</span>
          </div>
          <div class="info-item-control">
            <a-executor
              v-for="(item,index) in executors_fuze"
              @handleDel="executorDelete_fuze"
              :key="index"
              :delAbled="true"
              :src="item.src"
              :name="item.name"
            />
            <div class="executor-add-container" v-if="executors_fuze.length<=0">
               <div class="add-icon-container">
                  <span class="add-icon">
                    <a-icon type="plus" class="plus" />
                  </span>
                </div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 展开与收起 -->
      <div class="toggleActive">
        <span @click="isActive=!isActive">
          {{isActive?'收起':'显示全部'}}
          <a-icon :type="isActive?'down':'up'" style="margin-left:5px;font-size:10px;" />
        </span>
      </div>
      <!-- 其他 -->
      <collapse>
        <ul class="info-list" v-show="isActive">
          <!-- 执行人 -->
          <li class="info-item">
            <!-- 执行人多选 -->
            <div class="info-item-label">
              <icon-font type="spm-icon-copy18" class="label-icon-style"></icon-font>
              <span>执行人·</span>
              <span>{{executors_zhixing.length}}</span>
            </div>
            <div class="info-item-control" style="dispaly:flex;align-items: center;">
              <a-executor
                v-for="(item,index) in executors_zhixing"
                @handleDel="executorDelete_zhixing"
                :key="index"
                :delAbled="true"
                :src="item.src"
                :name="item.name"
              />
              <div class="executor-add-container">
                 <div class="add-icon-container">
                  <span class="add-icon">
                    <a-icon type="plus" class="plus" />
                  </span>
                </div>
              </div>
            </div>
          </li>
          <!-- 抄送人 -->
          <li class="info-item">
            <!-- 抄送人多选 -->
            <div class="info-item-label">
              <icon-font type="spm-icon-copy11" class="label-icon-style"></icon-font>
              <span>抄送人·</span>
              <span>{{executors_chaosong.length}}</span>
            </div>
            <div class="info-item-control">
              <a-executor
                v-for="(item,index) in executors_chaosong"
                @handleDel="executorDelete_chaosong"
                :key="index"
                :delAbled="true"
                :src="item.src"
                :name="item.name"
              />
              <div class="executor-add-container">
                <div class="add-icon-container">
                  <span class="add-icon">
                    <a-icon type="plus" class="plus" />
                  </span>
                </div>
              </div>
            </div>
          </li>
          <!-- 时间 -->
          <li class="info-item">
            <div class="info-item-label">
              <icon-font type="spm-icon-copy9" class="label-icon-style"></icon-font>
              <span>时间</span>
            </div>
            <div class="info-item-control">
              <div class="date-picker-container flex justify-between">
                <!-- 时间选择 -->
                <div>
                  <a-date-picker
                    style="width:137px;"
                    :showTime="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="请设置开始时间"
                    suffixIcon
                  />
                  <div class="info-item-control-label" style="margin-right:5px;">—</div>
                  <a-date-picker
                    style="width:137px"
                    :showTime="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="请设置截止时间"
                    suffixIcon
                  />
                </div>
                <!--  -->
                <div class="info-item-control-label" style="margin-right:9px;">
                  <icon-font
                    type="spm-icon-copy17"
                    class="clock-icon-style"
                    @click.stop="handleModalClock"
                  ></icon-font>
                </div>
              </div>
            </div>
          </li>
          <!-- 优先级 -->
          <li class="info-item">
            <div class="info-item-label">
              <icon-font type="spm-icon-copy16" class="label-icon-style"></icon-font>
              <span>优先级</span>
            </div>
            <div class="info-item-control">
              <aOptionselect :menuKey="menuKey" :menuList="menuList" @handleMenuValue="handlePrioritylevel" />
            </div>
          </li>
          <!-- 标签 -->
          <li class="info-item">
            <div class="info-item-label">
              <icon-font type="spm-icon-copy14" class="label-icon-style"></icon-font>
              <span>标签</span>
            </div>
            <div class="info-item-control">
              <aTagsadd />
            </div>
          </li>
        </ul>
      </collapse>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleClose">取消</a-button>
      <a-button key="submit" type="primary">创建</a-button>
    </template>
    <aClock ref="aClock" />
  </a-modal>
</template>

<script>
import collapse from "#/assets/js/collapse.js"; //伸缩组件
import aExecutor from "@/common/aExecutor"; //人组件
import aOptionselect from "@/common/aOptionselect"; //下拉选择组件
import aTagsadd from "@/common/aTagsadd"; //新增标签组件
import aClock from "@/common/aClock"; //闹钟组件
export default {
  name: "ModalNewTask",
  components: {
    aExecutor,
    collapse,
    aOptionselect,
    aTagsadd,
    aClock
  },
  data() {
    return {
      visible: false,
      isActive: false,
      iconSize: "15px",
      menuKey: 0,
      menuList:[
        {
          id:"0",
          name:"普通",
          class:"option-gray"
        },
        {
          id:"1",
          name:"紧急",
          class:"option-yellow"
        },
        {
          id:"2",
          name:"重要",
          class:"option-purple"
        },
        {
          id:"3",
          name:"重要紧急",
          class:"option-red"
        },
      ],
      form: this.$form.createForm(this),
      executors_fuze: [
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "奥斯特洛夫斯基"
        }
      ],
      executors_zhixing: [
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "奥斯特洛夫斯基"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "曹操"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "刘备"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "曹操"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "刘备"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "诸葛亮"
        }
      ],
      executors_chaosong: [
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "刘备"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "诸葛亮"
        },

        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "曹操"
        },
        {
          src:
            "https://striker.teambition.net/thumbnail/111j265d4260632c87bb57912c8e862f7213/w/200/h/200",
          name: "奥斯特洛夫斯基"
        }
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
      this.menuKey = 0;
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
    /*删除负责的事件*/
    executorDelete_fuze(index) {
      this.executors_fuze.splice(index, 1);
    },
    /*删除抄送的事件*/
    executorDelete_chaosong(index) {
      this.executors_chaosong.splice(index, 1);
    },
    /*删除负责人的事件*/
    executorDelete_zhixing(index) {
      this.executors_zhixing.splice(index, 1);
    },
    /*选择优先级*/
    handlePrioritylevel(val) {
      this.menuKey = val;
    },
    /*点击闹钟*/
    handleModalClock() {
      this.$refs["aClock"].handleOpen();
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.bodyContainer {
  .ant-modal-body {
    max-height: $modal-maxHeight-550;
    overflow-y: auto;
  }
}
.toggleActive {
  @include primary_color();
  margin: 20px 0;
  > span {
    cursor: pointer;
  }
}
.textareaContainer {
  position: relative;
  .appendix {
    position: absolute;
    cursor: pointer;
    font-weight: 20px;
    padding: 5px;
    right: 3px;
    bottom: 3px;
  }
}
.label-icon {
  color: $font-color-1;
  margin-right: 2px;
}

.info-item-control-label {
  line-height: 32px;
  display: inline-block;
}
.executor-add-container {
  display: inline-block;
  .add-icon-container{
    display: flex;
    height: 29.5px;
    overflow: hidden;
    align-items: center;
  }
}
.label-icon-style,
.clock-icon-style {
  font-size: $icon-size-20;
  vertical-align: -0.25em;
}
.label-icon-style {
  //color: $font-color-1;
  margin-right: 2px;
}
.clock-icon-style {
  @include primary_color();
  cursor: pointer;
}
</style>
