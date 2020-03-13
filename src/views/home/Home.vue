/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="Home" class="m-20">
    <a-row :gutter="20">
      <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4" class="m-b-20">
        <!--<ProfileCard></ProfileCard>-->
        <img style="width: 100%;height: 170px;" src="../../assets/image/home/profileCard.png" alt="">
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4" class="m-b-20">
        <!--<ProfileCard></ProfileCard>-->
        <img style="width: 100%;height: 170px;" src="../../assets/image/home/warning.png" alt="">
      </a-col>
      <a-col  :xs="24" :sm="24" :md="8" :lg="8" :xl="4" class="m-b-20">
        <!--<ProfileCard></ProfileCard>-->
        <img style="width: 100%;height: 170px;" src="../../assets/image/home/work.png" alt="">
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="4" class="m-b-20">
        <!--<ProfileCard></ProfileCard>-->
        <img style="width: 100%;height: 170px;" src="../../assets/image/home/msg.png" alt="">
      </a-col>
     <!-- <a-col v-for="(msg, index) in msgs" :key="index" :xs="24" :sm="12" :md="4" :lg="4" :xl="4" class="m-b-20">
        <WorkTipCard :msg="msg"></WorkTipCard>
      </a-col>-->
      <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="8" class="m-b-20">
        <img style="width: 100%;height: 170px;" src="../../assets/image/home/weather.png" alt="">
        <!--<ProfileCard></ProfileCard>-->
      </a-col>
      <a-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16" class="m-b-20">
        <!--<ProfileCard></ProfileCard>-->
        <img style="width: 100%;height: 260px;" src="../../assets/image/home/video.png" alt="">
      </a-col>
      <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="m-b-20">
        <img style="width: 100%;height: 260px;" src="../../assets/image/home/app.png" alt="">
        <!--<ProfileCard></ProfileCard>-->
      </a-col>
      <a-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" class="m-b-20">
        <img style="width: 100%;height: 656px;" src="../../assets/image/home/list.png" alt="">
        <!--<ProfileCard></ProfileCard>-->
      </a-col>
      <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" class="m-b-20">
        <img style="width: 100%;height: 656px;" src="../../assets/image/home/list2.png" alt="">
        <!--<ProfileCard></ProfileCard>-->
      </a-col>
      <a-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="m-b-20">
        <img style="width: 100%;height: 656px;" src="../../assets/image/home/tel.png" alt="">
        <!--<ProfileCard></ProfileCard>-->
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { mapState, mapMutations } from "vuex";
  import Overview from '@/home/Overview'
  import ProfileCard from '@/home/ProfileCard'
  import WorkTipCard from '@/home/WorkTipCard'
  export default {
    name: 'Home',
    components: {
      Overview,
      ProfileCard,
      WorkTipCard
    },
    props: {},
    data() {
      return {
        api: {
          getDictApi:
          Util.systemServer + "/web/system/dictionary/findChildDictionary", // 获取系统字典
          getCitysApi: Util.systemServer + "/web/system/dictionary/findAllArea" // 获取省市联动数据
        },
        msgs: [
          {
            title: '我的预警',
            num: 10,
            icon: 'spm-icon-xiangji',
            lists: [
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
            ]
          },
          {
            title: '我的待办',
            num: 10,
            icon: 'spm-icon-copy9',
            lists: [
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
            ]
          },
          {
            title: '我的消息',
            num: 10,
            icon: 'spm-icon-bell',
            lists: [
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
              {
                icon: '../../../static/man_2.jpg',
              },
            ]
          },
        ],
        citys: [],
        dicts: {
          GENDER_TYPE: [], // 性别
          COMPANY_NATURE: [], // 公司性质
          JOB_SEQUENCE: [], // 岗位序列
          TENANT_STATE: [], // 租户状态
          ORGANIZATION_TYPE: [], // 	组织类型
          DATA_PERMISSION_SCOPE: [], // 数据权限范围
          FILE_TYPE: [], // 档案类型
          ROLE_ATTRIBUTE: [], // 角色属性
          CATEGORICAL_ATTRIBUTE: [], // 分类属性
          APPLICATION_TYPE: [], // 应用类型
          DOCUMENT_TYPE: [], // 证件类型
          DEPARTMENT_TYPE: [] // 部门类型
        },
      }
    },
    computed: {},
    created() {
      this.getDictAll()
      // this.getCitys()
    },
    mounted() {
    },
    watch: {},
    methods: {
      // 获取词典
      getDictAll() {
        for (let key in this.dicts) {
          this.$get(this.api.getDictApi, { code: key })
            .then(response => {
              Util.processRes(response, () => {
                if (response.data) {
                  this.dicts[key] = response.data;
                  // this.$store.commit("SET_DICTS", this.dicts);
                  this.setDicts(this.dicts);
                }
              });
            })
            .catch(res => {
              console.log(res);
            });
        }
        console.log(this.dicts);
      },
      getCitys() {
        this.$get(this.api.getCitysApi)
          .then(response => {
            Util.processRes(response, () => {
              response.data &&
              response.data.length &&
              this.setCitys(response.data);
              // this.$store.commit("SET_CITYS", response.data);
            });
            Util.processError(this, response);
          })
          .catch(res => {
            console.log(res);
          });
      },
      ...mapMutations({ setDicts: "SET_DICTS", setCitys: "SET_CITYS" })
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  .ant-form-item-label{
    label{
      animation: shake .6s cubic-bezier(.25,.8,.5,1);
    }
  }
</style>
