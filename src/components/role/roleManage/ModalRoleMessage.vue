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
  <a-modal
    v-model="visible"
    class="ModalMessage"
    centered
    :width="500"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">角色详情</template>
    <!--租户基本信息  -->
    <div class="m-box">
      <div class="m-title" v-show="false">
        <span class="m-text"></span>
      </div>
      <div class="m-content">
        <!-- <a-row :gutter="24" class="m-item">
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">角色编码：</span>
              <span class="m-value">{{message.num}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">角色名称：</span>
              <span class="m-value">{{message.name}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">所属分类：</span>
              <span class="m-value">{{message.roleClassifyName}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">角色属性：</span>
              <span class="m-value">{{Util.getValueByKey(roleTypes, 'dictionaryCode', 'dictionaryName', message.roleType)}}</span>
            </div>
          </a-col>
          <a-col :span="24" v-if="false">
            <div class="m-item">
              <span class="m-label">编制组织：</span>
              <span class="m-value">{{message.orgName}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item flex">
              <span class="m-label">角色描述：</span>
              <span class="m-value flex-1">{{message.desc}}</span>
            </div>
          </a-col>
        </a-row> -->
        <a-form>
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="角色编码"
              >
                <span class="form-value">{{message.num}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="角色名称"
              >
                <span class="form-value">{{message.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="所属分类"
              >
                <span class="form-value">{{message.roleClassifyName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="角色属性"
              >
                <span class="form-value">{{Util.getValueByKey(roleTypes, 'dictionaryCode', 'dictionaryName', message.roleType)}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="编制组织"
              >
                <span class="form-value">{{message.orgName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item
                label="角色描述"
              >
                <span class="form-value">{{message.desc}}</span>
              </a-form-item>
            </a-col>

          </a-row>
        </a-form>
      </div>
    </div>
    <template slot="footer">
      <a-button type="primary" @click="handleClose">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
  import {mapState} from "vuex";

  export default {
    name: "ModalMessage",
    components: {},
    props: {},
    data() {
      return {
        Util,
        api: {
          roleDetailApi: Util.orgServer + "/web/role-info/detail" // 角色详情
        },
        title: "",
        visible: false,
        message: {
          num: "", //--角色编码
          name: "", //--角色名称
          orgName: '',//编制组织
          roleClassifyName: "", //所属分类
          desc: "", //-角色描述
          roleType: ""//角色属性
        }
      };
    },
    computed: {
      ...mapState({
        roleTypes: state => state.dicts.ROLE_ATTRIBUTE,
      }),
    },
    created() {
    },
    mounted() {
    },
    watch: {},
    methods: {
      /*打开modal的事件*/
      handleOpen(rowData) {
        this.visible = true;
        this.getDetais(rowData);
      },
      /*关闭modal的事件*/
      handleClose() {
        this.visible = false;
        //this.reset();
      },
      //获取详情
      getDetais(rowData) {
        let params = {
          id: rowData.roleId
        };
        this.$get(this.api.roleDetailApi, params)
          .then(response => {
            // this.loading = false;
            Util.processRes(response, () => {
              this.message = response.data
            });
            Util.processError(this, response);
          })
          .catch(res => {
            // this.table.loading = false;
            Util.processError(this, res);
          });
      }
    },
    destroyed() {
    }
  };
</script>

<style lang="scss">
  .ModalMessage {
    .ant-modal-body {
    }
  }
</style>
