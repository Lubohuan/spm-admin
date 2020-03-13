/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
  # 组件注释
  用户中心
  1.更换主题
  2.退出登录
  3.其他
</comment>
<template>
  <div id="UserMenu">
    <div class="user-wrapper">
      <div class="content-box">
        <a-dropdown :trigger="['click']">
          <div class="pointer">
            <a-avatar class="avatar" size="small" :src="login_msg.profile || '../../../static/man_2.jpg'"/>
            <span class="nick">{{ login_msg.name }}</span>
          </div>
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
            <!--更换主题-->
            <a-menu-item key="0">
              <p style="margin-bottom: 10px">
                <icon-font type="spm-icon-flag"/>
                更换主题
              </p>
              <ThemeColor></ThemeColor>
            </a-menu-item>
            <a-sub-menu key="test">
              <span slot="title">
                <span @click="changePwd">
                <icon-font type="spm-icon-fuzhi"/>
                <span>切换租户</span>
              </span>
              </span>
              <a-menu-item>3rd menu item</a-menu-item>
              <a-menu-item>4th menu item</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="2">
              <span @click="changePwd">
                <a-icon type="setting"/>
                <span>修改密码</span>
              </span>
            </a-menu-item>

            <a-menu-item key="3" :disabled="isPlatform == 'yes' ? true : false ">
              <span href="javascript:;"  @click="changeUserInfo">
                <a-icon type="user"/>
                <span>修改个人信息</span>
              </span>
            </a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="4">
              <a href="javascript:;" @click="handleLogout">
                <icon-font type="spm-icon-zhuxiao"/>
                <span>退出登录</span>
              </a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <ChangePwd v-show="false" ref="changePWD"></ChangePwd>
    <UserInfo v-show="false" ref="UserInfo"></UserInfo>
  </div>
</template>

<script>
  import ThemeColor from '@/themeColor/ThemeColor'
  import ChangePwd from '#/views/ChangePwd'
  import UserInfo from '#/views/UserInfo'

  import {mapState} from 'vuex'
  import Cookie from 'js-cookie'

  export default {
    name: 'UserMenu',
    components: {
      ThemeColor,
      ChangePwd,
      UserInfo
    },
    props: {},
    data() {
      return {
        isPlatform: ''
      }
    },
    computed: {
      ...mapState({
        login_msg: state => state.login_msg,
      })
    },
    created() {
      this.isPlatform = Cookie.get('isPlatform')
    },
    mounted() {
    },
    watch: {
     /* login_msg: {
        handler(val) {
          this.visible = val;
          console.log(val);
        },
        immediate: true
      },*/
    },
    methods: {
      // 登出
      handleLogout() {
        this.$confirm({
          title: '提示',
          content: '确定要注销登录吗 ?',
          okText: '确认',
          cancelText: '放弃',
          onOk: () => {
            // window.location.reload()
            Cookie.remove('jwt')

            if(this.isPlatform == 'yes') {
              this.$router.push({name: 'LoginByAdmin'})
            }else{
              this.$router.push({name: 'Login'})
            }

          },
          onCancel() {
          }
        })
      },
      // 修改密码
      changePwd() {
        this.$refs['changePWD'].openModal()
      },
      // 修改个人信息
      changeUserInfo() {
        this.$refs['UserInfo'].openModal()
      }
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
  #UserMenu {
    height: 100%;
    .user-wrapper {
      height: 100%;
      .content-box {
        height: 100%;
        .ant-dropdown-trigger {
          height: 100%;
        }
      }
    }
    .avatar {
      width: 30px;
      height: 30px;
      margin: 0 16px;
    }
    .nick {
      margin-right: 16px;
    }
  }

</style>
