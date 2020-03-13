/**
* @Author: 路博欢
* @Date: 2019/8/22
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/22
**/
<comment>
  # 组件注释
  租户应用授权
</comment>
<template>
  <div id="GeneralFileDefinition" class="page-box">
    <div class="page-title">
      <Title></Title>
    </div>
    <div class="page-content flex">
      <!-- 左边内容 -->
      <div class="page-content-left" style="width:260px;">
        <div class="pannel">
          <div class="pannel-content">
            <a-skeleton active :loading="list.loading" :paragraph="{rows: 5}">
              <ul class="platformList">
                <li
                  class="platform-item"
                  :class="item.enableEdit?'':'noBorder'"
                  :data-active="currentId==item.id?'liActive':''"
                  v-for="(item,index) in platformList"
                  :key="index"
                  @click="liClick(item)"
                  :title="item.name"
                >
                  <div class="platform-item-input">
                    <a-input
                      :id="'$editInput'+index"
                      @pressEnter="inputChange('edit',item,index)"
                      @blur="inputChange('edit',item,index)"
                      :readOnly="!item.enableEdit"
                      v-model="item.name"
                    />
                  </div>
                  <!-- 编辑以及删除 -->
                  <div class="platform-item-config" v-if="isPlatform">
                    <span class="congfig-edit" @click.stop="editClick(item,index)">
                      <icon-font type="spm-icon-shangyicopy4"></icon-font>
                    </span>
                    <span class="congfig-del" @click.stop="delClick(item,index)">
                      <icon-font type="spm-icon-delete"></icon-font>
                    </span>
                  </div>
                </li>
                <li class="platform-item" :class="isAdd?'':'noBorder'" v-if="isPlatform">
                  <span v-if="isAdd">
                    <a-input
                      ref="$addInput"
                      v-model="addValue"
                      @pressEnter="inputChange('add')"
                      @blur="inputChange('add')"
                    />
                  </span>
                  <span v-else>
                    <a-button
                      type="link"
                      v-waves
                      @click="addClick()"
                      icon="plus"
                      style="padding-left:11px;"
                    >新增</a-button>
                  </span>
                </li>
              </ul>
            </a-skeleton>
          </div>
        </div>
      </div>
      <!-- 右边内容 -->
      <div class="page-content-right flex-1">
        <rightContent :currentLeftId="currentId" :platformList="platformList"/>
      </div>
    </div>
  </div>
</template>
<script>
  import Cookie from "js-cookie";
  import Title from "@/Title";
  import rightContent from "@/basicBusinessConfig/generalFileDefinition/rightContent";

  export default {
    name: "TenantManage",
    components: {
      Title,
      rightContent
    },
    props: {},
    data() {
      return {
        Util,
        api: {
          addArchivesTypeApi:
          Util.systemServer +
          "/web/archives-type/add", // 新增数据字典所属的平台
          archivesTypeListApi:
          Util.systemServer +
          "/web/archives-type/list", // 数据字典list
          delArchivesTypeApi:
          Util.systemServer +
          "/web/archives-type/delete", // 删除字典list
          editArchivesTypeApi:
          Util.systemServer +
          "/web/archives-type/edit" // 删除字典list
        },
        isPlatform: false,
        list: {
          loading: false
        },
        isAdd: false,
        isFirstEnter: true,
        addValue: "",
        editValue: "",
        currentId: "", //当前选中的li
        platformList: []
      };
    },
    // beforeRouteEnter(to, from, next) {
    //   if (from.name === "ListCommon" || from.name === "ListTree") {
    //     //判断是从哪个路由过来的，若是detail页面不需要刷新获取新数据，直接用之前缓存的数据即可
    //     to.meta.isBack = true;
    //   }
    //   next();
    // },
    computed: {},
    created() {
      this.isPlatform = Cookie.get("isPlatform") == "yes" ? true : false;
      this.isFirstEnter = true;
      this.initList();
    },
    mounted() {
    },
    // activated() {
    //   if (!this.$route.meta.isBack || this.isFirstEnter) {
    //     // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
    //     console.log(this.$refs["leftContent"]);
    //     this.$refs["leftContent"].initList();
    //     // if (this.$route.params.id) {
    //     //   this.currentId = String(this.$route.params.id);
    //     // } else {
    //     //}
    //   }
    //   // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
    //   this.$route.meta.isBack = false;
    //   this.isFirstEnter = false;
    // },
    watch: {},
    methods: {
      /**enter或blur
       * @params type:编辑 或者 新增
       * @params item:当前项具体值
       * @params index:数组中的位置
       */
      initList() {
        this.list.loading = true;
        this.$get(this.api.archivesTypeListApi)
          .then(response => {
            Util.processRes(
              response,
              () => {
                this.list.loading = false;
                this.platformList = response.data;
                if (this.platformList && this.platformList.length > 0) {
                  this.currentId = this.platformList[0].id;
                }
              },
              () => {
              }
            );
            Util.processError(this, response);
          })
          .catch(res => {
            this.list.loading = false;
            Util.processError(this, res);
          });
      },
      /**enter或blur
       * @params item:当前项具体值
       * @params index:数组中的位置
       */
      inputChange(type, item, index) {
        if (type == "edit") {
          //编辑
          if (!item.enableEdit) {
            return;
          }
          if (String(item.name).trim()) {
            if (this.editValue == item.name) {
              this.$set(this.platformList[index], "enableEdit", false);
            } else {
              this.editArchivesType(item, index);
            }
          } else {
            // alert('控制')
          }
        } else {
          //新增
          if (String(this.addValue).trim()) {
            this.addArchivesType();
          } else {
            this.isAdd = false;
            // alert('控制')
          }
        }
      },
      /**
       * 点击编辑按钮
       * @params item:当前项具体值
       * @params index:数组中的位置
       */
      editClick(item, index) {
        this.$set(this.platformList[index], "enableEdit", true);
        document.getElementById("$editInput" + index).focus();
        this.editValue = item.name;
      },
      /***编辑的请求 */
      editArchivesType(item, index) {
        //this.list.loading = true;
        this.$post(this.api.editArchivesTypeApi, {id: item.id, name: item.name})
          .then(response => {
            Util.processRes(
              response,
              () => {
                //this.list.loading = false;
                this.$message.success("编辑成功！");
                this.$set(this.platformList[index], "enableEdit", false);
                this.$set(this.platformList[index], "name", response.data.name);
              },
              () => {
              }
            );
            Util.processError(this, response);
          })
          .catch(res => {
            //this.list.loading = false;
            Util.processError(this, res);
          });
      },
      /**
       * 点击新增按钮
       */
      addClick() {
        this.isAdd = true;
        this.$nextTick(() => {
          this.$refs["$addInput"].focus();
        });
      },
      /**点击删除按钮
       * @params item:当前项具体值
       * @params index:数组中的位置
       */
      delClick(item, index) {
        this.$confirm({
          title: "删除",
          content: "确定要删除吗 ?",
          okText: "确认",
          cancelText: "取消",
          onOk: () => {
            this.delArchivesType(item, index);
          },
          onCancel() {
          }
        });
      },
      // 删除的请求
      delArchivesType(item, index) {
        //this.list.loading = true;
        this.$post(this.api.delArchivesTypeApi, {id: item.id})
          .then(response => {
            Util.processRes(
              response,
              () => {
                //this.list.loading = false;
                this.$message.success("删除成功！");
                this.platformList.splice(index, 1);
              },
              () => {
              }
            );
            Util.processError(this, response);
          })
          .catch(res => {
            //this.list.loading = false;
            Util.processError(this, res);
          });
      },
      addClick() {
        this.isAdd = true;
        this.$nextTick(() => {
          this.$refs["$addInput"].focus();
        });
      },
      /**新增的请求 */
      addArchivesType() {
        this.$post(this.api.addArchivesTypeApi, {name: this.addValue}).then(
          response => {
            Util.processRes(
              response,
              () => {
                this.$message.success("新增成功！");
                this.platformList.push({
                  id: response.data.id,
                  enableEdit: false,
                  name: response.data.name
                });
                this.$nextTick(() => {
                  this.addValue = "";
                  this.isAdd = false;
                });
              },
              () => {
                this.$nextTick(() => {
                  this.addValue = "";
                  this.isAdd = false;
                });
              }
            );
            Util.processError(this, response);
          }
        );
        // .catch(res => {
        //   this.$nextTick(() => {
        //     this.addValue = "";
        //     this.isAdd = false;
        //   });
        // });
      },
      /**
       * 点击切换右边table
       */
      liClick(item) {
        this.currentId = item.id;
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .platformList {
    height: calc(100vh - 200px);
    overflow: auto;
    .platform-item {
      margin-bottom: 3px;
      position: relative;
      .platform-item-input {
        .ant-input {
          cursor: pointer;
        }
      }
      .platform-item-config {
        position: absolute;
        display: none;
        opacity: 1;
        top: 8px;
        right: 3px;
        font-size: 17px;
        transition: all 0.3s linear;
        > span {
          display: inline-block;
          cursor: pointer;
        }
        > span:hover {
          @include primary_color();
        }
      }
    }
    .platform-item.noBorder .ant-input {
      border-color: transparent;
    }
    .platform-item.noBorder {
      &:hover .platform-item-config {
        display: block;
        opacity: 1;
      }
      .ant-input {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover .ant-input {
        padding-right: 35px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .platform-item:hover,
    .platform-item[data-active="liActive"] {
      .ant-input {
        @include primary_bg_color_o();
      }
    }
  }
</style>
