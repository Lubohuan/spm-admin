import Title from '@/Title';
/**
* @Author: 路博欢
* @Date: 2019/8/6
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/6
**/
<comment>
    # 组件注释
    公用组件

      变量如下
    
      事件如下
      
</comment>
<template>
  <a-popover
    class="aTagsadd"
    trigger="click"
    placement="bottom"
    v-model="visible"
    @visibleChange="visibleChangeFunc"
  >
    <template slot="content">
      <div class="tag-container">
        <!-- 搜索选择区域 -->
        <div class="tag-search" v-show="showSearch">
          <div class="tag-input">
            <input
              id="searchTag"
              type="text"
              v-model="filterTagName"
              @input="filterTagFunc"
              class="form-control tag-input"
              placeholder="搜索标签"
            />
            <!-- 搜索框后面的加号 -->
            <div class="btn-in-input" @click.stop="tagAdd()">
              <a-icon type="plus-circle" class="plus-circle-icon" />
            </div>
          </div>
          <div class="tag-select">
            <!--  -->
            <ul class="tag-list" v-if="tagFilterList.length>0">
              <li
                class="tag-list-item"
                v-for="(item,index) in tagFilterList"
                :key="index"
                @click.stop="toggleSelect(item)"
              >
                <div class="tag-circle-wrap">
                  <div class="tag-circle" :class="item.class"></div>
                </div>
                <div class="tag">
                  <span class="tag-name">
                    {{item.name}}
                  </span>
                 </div>
                <span class="tag-edit" @click.stop="tagEdit(item)">
                  <a-icon type="form" class="form-icon" />
                </span>
                <span class="tag-isSelected" v-if="item.selected">
                  <!-- <a-icon type="check" class="check-icon" /> -->
                  <a-icon type="check" class="icon-selected" />
                </span>
              </li>
            </ul>
            <div class="no-tag" v-else></div>
          </div>
        </div>
        <!-- 新建标签 /编辑-->
        <div class="tag-create" v-show="showCreate">
          <div class="tag-title">
            <span class="pointer" @click.stop="showSearchFunc">
              <a-icon type="left" :style="{'color':'#9C9C9C'}" />
            </span>
            <span>{{showCreateC?'新建标签':'编辑标签'}}</span>
            <span class="pointer" @click.stop="closePopover">
              <a-icon type="close" :style="{'color':'#9C9C9C'}" />
            </span>
          </div>
          <div class="tag-content">
            <!-- 新建输入框 -->
            <div class="tag-content-input">
              <a-input placeholder="标签名称" v-model="currentTag.name" />
            </div>
            <!-- 新建颜色选择 -->
            <div class="tag-content-color">
              <ul class="color-list">
                <li class="color-circle" v-for="(item,index) in colorList" :key="index">
                  <a
                    class="color-circle-btn"
                    :class="item.class"
                    @click.stop="toggleColor(item.class)"
                  >
                    <a-icon v-if="currentTag.class==item.class" type="check" style="color:#fff" />
                  </a>
                </li>
                <!-- <li class="color-circle">
                  <a class="color-circle-btn tag-blue" @click.stop="toggleColor('tag-blue')">
                    <a-icon v-if="currentTag.class=='tag-blue'" type="check" style="color:#fff" />
                  </a>
                </li>-->
              </ul>
            </div>
            <!-- 创建按钮/删除以及确定 -->
            <div class="tag-content-btn">
              <p v-if="showCreateC==true">
                <a-button
                  type="primary"
                  size="large"
                  style="width:100%"
                  @click.stop="trueAddFunc"
                  :disabled="!String(currentTag.name).trim().length>0"
                >创建</a-button>
              </p>
              <p v-else class="flex justify-between">
                <a-button
                  type="danger"
                  size="large"
                  style="width:45%"
                  @click.stop="showConfirmDeleteFunc"
                >删除</a-button>
                <a-button
                  type="primary"
                  size="large"
                  style="width:45%"
                  :disabled="!String(currentTag.name).trim().length>0"
                  @click.stop="trueEditFunc"
                >确定</a-button>
              </p>
            </div>
          </div>
        </div>
        <!-- 确定删除吗？ -->
        <div class="tag-ConfirmDelete" v-show="showConfirmDelete">
          <div class="tag-title">
            <span class="pointer" @click.stop="showCreateFunc">
              <a-icon type="left" :style="{'color':'#9C9C9C'}" />
            </span>
            <span>删除标签</span>
            <span class="pointer" @click.stop="closePopover">
              <a-icon type="close" :style="{'color':'#9C9C9C'}" />
            </span>
          </div>
          <div class="tag-content">
            <p style="height:50px;">确认删除标签？</p>
            <div class="tag-delete">
              <a-button
                type="danger"
                size="large"
                style="width:100%"
                @click.stop="trueDeleteFunc"
              >删除</a-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 选择之后的标签 -->
    <ul class="tag-picker-list" v-if="tagSelecedtList.length>0">
      <li class="tag-wrap" v-for="(item,index) in tagSelecedtList" :key="index" @click.stop="">
        <span class="tag" :class="item.class">
          {{item.name}}
          <a-icon
            class="tag-del-icon"
            type="close-circle"
            theme="filled"
            @click.stop="delSelectedTag(item,index)"
          />
        </span>
      </li>
      <li class="tag-picker-add">
        <span class="add-icon">
          <a-icon type="plus" class="plus" />
        </span>
      </li>
    </ul>
    <!-- 选择之前的显示 -->
    <span v-else class="addText">新增标签</span>
  </a-popover>
</template>
<script>
export default {
  name: "aTagsadd",
  components: {},
  props: {},
  data() {
    return {
      tagSelecedtList: [
        //选择的标签
      ],
      tagList: [
        //所有标签
        { id: "1", name: "1", class: "tag-cyan", selected: false },
        { id: "2", name: "紧急情况1", class: "tag-blue", selected: false },
        { id: "3", name: "紧急情况2", class: "tag-red", selected: false },
        { id: "4", name: "现场安全3", class: "tag-purple", selected: false },
        { id: "5", name: "生产进度4", class: "tag-green", selected: false },
        { id: "6", name: "紧急情况5", class: "tag-red", selected: false },
        { id: "7", name: "紧急情况6", class: "tag-green", selected: false },
        { id: "8", name: "紧急", class: "tag-red", selected: false },
        { id: "9", name: "紧急情况7", class: "tag-yellow", selected: false },
        { id: "10", name: "紧急情况8", class: "tag-red", selected: false }
      ],
      tagFilterList: [
        //筛选之后的标签 tagFilterList与tagList其实是一模一样的，地址存储的一样，因为不是深拷贝
      ],
      colorList: [
        { id: "1", class: "tag-blue" },
        { id: "2", class: "tag-green" },
        { id: "3", class: "tag-cyan" },
        { id: "4", class: "tag-purple" },
        { id: "5", class: "tag-yellow" },
        { id: "6", class: "tag-red" }
      ],
      visible: false,
      showSearch: true,
      showCreate: false,
      showCreateC: true,
      showConfirmDelete: false,
      filterTagName: "",
      currentTag: {
        id: "",
        name: "",
        class: "tag-blue"
      }
    };
  },
  computed: {},
  created() {
    //创建此组件时，需要请求后台接口  获取tagList
    console.log('created')
    this.tagFilterList = this.tagList;
  },
  mounted() {},
  watch: {
    value(newVal, oldVal) {
      this.value = Number(newVal);
    },
    filterTagName(newVal, oldVal) {}
  },
  methods: {
    //显示列表的模块
    showSearchFunc() {
      this.showConfirmDelete = false;
      this.showCreate = false;
      this.showSearch = true;
      this.showCreateC = true;
    },
    //显示新建的模块
    showCreateFunc() {
      this.showSearch = false;
      this.showConfirmDelete = false;
      this.showCreate = true;
      this.showCreateC = true;
    },
    //显示 确认删除的模块
    showConfirmDeleteFunc() {
      this.showCreate = false;
      this.showConfirmDelete = true;
    },
    //关闭气泡弹出框
    closePopover() {
      this.visible = false;
      this.$nextTick(() => {
        var timer1 = setTimeout(() => {
          this.showSearchFunc();//关闭之后，默认展示搜索的模块
          clearTimeout(timer1);
        }, 500);
      });
    },
    //气泡框显示的回调
    visibleChangeFunc(val) {
      if (val) {
        this.filterTagName = '';
        this.filterTagFunc();
        this.$nextTick(() => {
          var timer2 = setTimeout(() => {
            document.getElementById("searchTag").focus();//搜索框自动获取焦点
            clearTimeout(timer2);
          }, 500);
          //document.getElementById('searchTag').focus()
        });
      }
    },
    //筛选标签的方法 
    filterTagFunc() {
      let searchKey = this.filterTagName;
      this.tagFilterList = this.tagList.filter(item => {
        return item.name.indexOf(searchKey) != -1;
      });
    },
    //颜色切换 在6个颜色进行切换选择
    toggleColor(val) {
      this.currentTag.class = val;
    },
    //选中/取消选中
    toggleSelect(data) {
      let index = this.tagList.findIndex(item => item.id == data.id);
      this.$set(this.tagList[index], "selected", !data.selected);

      let selectedIndex = this.tagSelecedtList.findIndex(
        item => item.id == data.id
      );
      if (data.selected && selectedIndex == -1) {
        this.tagSelecedtList.push(data);
      } else {
        this.tagSelecedtList.splice(selectedIndex, 1);
      }
    },
    //删除已经选择的标签 点击已经选择的标签后面的删除图标
    delSelectedTag(data, index) {
      let selectedIndex = this.tagList.findIndex(item => item.id == data.id);
      if (selectedIndex != -1) {
        this.$set(this.tagList[selectedIndex], "selected", false);
        this.tagSelecedtList.splice(index, 1);
      }
    },
    //新增标签的方法 点击新增的图标
    tagAdd() {
      this.showCreateFunc();
      this.currentTag = {
        name: String(this.filterTagName).trim() ? this.filterTagName : "",
        id: "",
        class: "tag-blue"
      };

    },
    //编辑标签的方法 点击编辑图标
    tagEdit(item) {
      this.showSearch = false;
      this.showConfirmDelete = false;
      this.showCreate = true;
      this.showCreateC = false;
      this.currentTag = {
        name: item.name,
        id: item.id,
        class: item.class
      };
    },
    //新增标签 调后台接口 点击创建按钮
    trueAddFunc() {
      //寻找tagList有没有当前新增的tag
      let index = this.tagList.findIndex(
        item => item.name == this.currentTag.name
      );
      if (index == -1) {//如果没有就新增
        //newItem是传给后台的参数
        var newItem={
          name: String(this.currentTag.name).trim(),
          class: this.currentTag.class,
          id: this.currentTag.id //id需要请求后台获取
        }
        //请求成功之后调用
        this.tagList.unshift(newItem);
        this.tagSelecedtList.push(newItem);
        this.filterTagName = '';
        this.showSearchFunc();
        this.filterTagFunc();
      } else {//否则提醒标签名称已存在
        this.$message.warning("标签名称已经存在！");
      }
    },
    //编辑标签 调后台接口 点击确定按钮
    trueEditFunc() {

       //寻找tagList有没有当前新增的tag
      let index = this.tagList.findIndex(
        item => item.name == this.currentTag.name
      );
      if(index!=-1){
         this.$message.warning("标签名称已经存在！");
         return false;
      }
      //找到当前锁编辑标签在标签列表的位置
      let currentIndex = this.tagList.findIndex(
        item => item.id == this.currentTag.id
      );
      //找到当前锁编辑标签在已经选择的标签列表的位置
      let currentIndex_selected = this.tagSelecedtList.findIndex(
        item => item.id == this.currentTag.id
      );
      //this.currentTag.id 作为传给后台的参数
      //以下代码 请求成功之后调用
      if (currentIndex != -1) {
        this.$set(this.tagList[currentIndex], "name", this.currentTag.name);
        this.$set(this.tagList[currentIndex], "class", this.currentTag.class);
      }
      if (currentIndex_selected != -1) {
        this.$set(
          this.tagSelecedtList[currentIndex_selected],
          "name",
          this.currentTag.name
        );
        this.$set(
          this.tagSelecedtList[currentIndex_selected],
          "class",
          this.currentTag.class
        );
      }
      this.filterTagFunc();
      this.showSearchFunc(); //请求成功之后的回调
    },
    //删除标签 调后台接口 确定删除之后点击删除按钮
    trueDeleteFunc() {
      //找到当前锁编辑标签在标签列表的位置
      let currentIndex = this.tagList.findIndex(
        item => item.id == this.currentTag.id
      );
      //找到当前锁编辑标签在已经选择的标签列表的位置
      let currentIndex_selected = this.tagSelecedtList.findIndex(
        item => item.id == this.currentTag.id
      );
      //this.currentTag.id 作为传给后台的参数
      //以下代码 请求成功之后调用
      if (currentIndex != -1) {
        this.tagList.splice(currentIndex, 1);
       // this.tagFilterList = this.tagList;
      }
      if (currentIndex_selected != -1) {
        this.tagSelecedtList.splice(currentIndex_selected, 1);
      }
      this.filterTagFunc();
      this.showSearchFunc(); //请求成功之后的回调
    }
  },
  destroyed() {
  }
};
</script>

<style lang="scss">
//
.addText {
  display: inline-block;
  padding: 0px;
  margin-bottom: 0;
  line-height: 34px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  // border: 1px solid #d9d9d9;
  border-radius: 3px;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: $font-color-3;
}
.addText:hover {
  @include primary_color();
}
.tag-container {
  min-width: 248px;
  width: 248px;
  margin: -12px -16px;
  .no-tag {
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 208px;
    color: #a6a6a6;
    font-size: 14px;
  }

  div.tag-input {
    display: flex;
    border-bottom: 1px solid $border-color-1;
    .btn-in-input {
      cursor: pointer;
      width: 48px;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      .plus-circle-icon {
        @include primary_color();
        font-size: 16px;
      }
    }
  }
  div.tag-select {
    ul.tag-list {
      max-height: 208px;
      overflow-y: auto;
      padding: 4px 0;
      li.tag-list-item {
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        cursor: pointer;
        line-height: 40px;
        height: 40px;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0 16px;
        &:hover {
          @include primary_bg_color_o();
        }
        &:hover .tag-edit {
          display: inline-block;
        }
        .tag-circle-wrap {
          padding-right: 8px;
          .tag-circle {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }
        }
        .tag{
          max-width: 200px;
          flex:1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .tag-name {
            font-size: 14px;
            color: grey;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .tag-edit {
          display: none;
          margin-right: 15px;
          padding: 0 5px;
          font-size: 16px;
          &:hover .form-icon {
            @include primary_color();
          }
        }
        .check-icon {
          color: $font-color-3;
        }
      }
    }
  }

  .tag-title {
    display: flex;
    height: 40px;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid $border-color-1;
  }
  .tag-content {
    padding: 15px;
    ul.color-list {
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-justify-content: space-between;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding: 20px 0;
      li.color-circle {
        line-height: 24px;
        a.color-circle-btn {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          text-align: center;
        }
      }
    }
  }
}
//选中的tag的样式
ul.tag-picker-list {
  margin-top: 3px;
  display: flex;
  flex-wrap: wrap;
  li {
    overflow: hidden;
    // margin: 8px 0 0 8px;
    height: 28px;
    margin-right: 11px;
    margin-bottom: 5px;
    position: relative;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    opacity: 0.7;
    .tag {
      height: 28px;
      line-height: 28px;
      // display: -webkit-flex;
      // display: -ms-flexbox;
      // display: flex;
      // -webkit-align-items: center;
      // -ms-flex-align: center;
      // align-items: center;
      border-radius: 28px;
      padding: 0 12px;
      font-weight: 500;
      color: #000;
      transition: padding-right 218ms ease;
      z-index: 1;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      .tag-del-icon {
        cursor: pointer;
        position: absolute;
        top: 6px;
        right: 6px;
        color: rgba(0, 0, 0, 0.7);
        font-size: 15px;
        display: none;
        opacity: 0;
        transition: all 1s;
      }
      &:hover{
        padding-right:25px;
      }
      &:hover .tag-del-icon {
        opacity: 1;
        display: block;
      }
    }
    .tag.tag-red{
      line-height: 29px;
      .tag-del-icon {
        top: 7px;
        right: 6px;
      
      }
    }
  }
  li.tag-picker-add{
    margin-left:2px;
  }
}
input.form-control {
  height: 40px;
  line-height: 26px;
  color: #383838;
  box-shadow: none;
  width: 100%;
  display: block;
  font-size: 14px;
}
input.form-control,
textarea.form-control {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  line-height: 20px;
}
input.tag-input {
  padding: 8px 18px;
  border: none;
}
input.tag-input::-webkit-input-placeholder {
  color: $font-color-3;
}
input.tag-input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: $font-color-3;
}
input.tag-input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: $font-color-3;
}
input.tag-input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: $font-color-3;
}

</style>
