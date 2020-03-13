/*
 * @Autor: 何景春
 * @Version: 1.0
 * @Date: 2019-09-04 15:55:12
 * @LastEditors: OBKoro1
 * @LastEditTime: 2019-09-12 16:30:10
 * @Description: 查看人员 详情 弹层
 */

<template>
  <a-modal
    v-model="visible"
    class="ModalMessage"
    centered
    :width="600"
    :afterClose="handleClose"
    :maskClosable="false"
  >
    <template slot="title">查看人员</template>
    <!--查看人员  -->
    <div class="m-box">
      <div class="m-title" v-show="false">
        <span class="m-text"></span>
      </div>
      <div class="m-content">
        <!-- <a-row :gutter="24" class="m-item">
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">任职组织：</span>
              <span class="m-value">{{message.orgName}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">部门：</span>
              <span class="m-value">{{message.depName}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">编码：</span>
              <span class="m-value">{{message.personNo}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">姓名：</span>
              <span class="m-value">{{message.name}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">性别：</span>
              <span class="m-value">{{userSex}}</span>
            </div>
          </a-col>

          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">证件类型：</span>
              <span class="m-value">{{userInfoType}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">证件号码：</span>
              <span class="m-value">{{message.identityNo}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">手机号：</span>
              <span class="m-value">{{message.phone}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">出生日期：</span>
              <span class="m-value">{{message.birthday}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">邮箱：</span>
              <span class="m-value">{{message.mail}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">员工号：</span>
              <span class="m-value">{{message.jobNumber}}</span>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="m-item">
              <span class="m-label">岗位：</span>
              <span class="m-value">{{message.postName}}</span>
            </div>
          </a-col>
        </a-row>-->
        <a-form>
          <a-row :gutter="20">
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="任职组织">
                <span class="form-value">{{message.orgName}}</span>
              </a-form-item>
            </a-col>

            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="部门">
                <span class="form-value">{{message.depName}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="编码">
                <span class="form-value">{{message.personNo}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="姓名">
                <span class="form-value">{{message.name}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="性别">
                <span class="form-value">{{userSex}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="证件类型">
                <span class="form-value">{{userInfoType}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="证件号码">
                <span class="form-value">{{message.identityNo}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="手机号">
                <span class="form-value">{{message.phone}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="出生日期">
                <span class="form-value">{{moment(Number(message.birthday)).format('YYYY-MM-DD')}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="邮箱">
                <span class="form-value">{{message.mail}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="员工号">
                <span class="form-value">{{message.jobNumber}}</span>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <a-form-item label="岗位">
                <span class="form-value">{{message.postName}}</span>
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
export default {
  name: "ModalMessage",
  components: {},
  props: {},
  data() {
    return {
      Util,
      api: {
        details: Util.orgServer + "/web/member/details" // 人员详情弹层
      },
      visible: false,
      message: {
        personNo: "", //员工号
        name: "", //人员姓名
        sex: null, //性别   0女， 1男
        identityType: null, //身份类型： 1身份证， 2护照
        identityNo: "", //证件号码
        birthday: "", //生日
        mail: "", //邮箱
        jobNumber: "", //员工号
        orgName: "", //组织名称
        depName: "", //部门名称
        phone: "", //手机号码
        postName: "", //岗位名称
        nick: "", //昵称
        profile: "", //人员头像
        area: "" //所在地区
      }
    };
  },
  computed: {
    userSex() {
      let sex = "";
      switch (Number(this.message.sex)) {
        case 0:
          sex = "男";
          break;
        case 1:
          sex = "女";
          break;
      }
      return sex;
    },
    userInfoType() {
      let identityType = "";
      switch (Number(this.message.identityType)) {
        case 1:
          identityType = "身份证";
          break;
        case 2:
          identityType = "居住证";
          break;
        case 3:
          identityType = "驾驶证";
          break;
        case 4:
          identityType = "特种操作证";
          break;
      }
      return identityType;
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    /*打开modal的事件*/
    handleOpen(id) {
      this.visible = true;
      this.getDetais(id);
    },
    /*关闭modal的事件*/
    handleClose() {
      this.visible = false;
    },
    //获取详情
    getDetais(id) {
      const params = "?id=" + id;
      this.$get(this.api.details + params)
        .then(response => {
          this.loading = false;
          Util.processRes(response, res => {
            // console.log(response);
            response.data && (this.message = response.data);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.loading = false;
          Util.processError(this, res);
        });
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
</style>
