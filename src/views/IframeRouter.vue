/**
* @Author: 李晨光
* @Date: 2019/8/12
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/8/12
**/
<comment>
  # 组件注释
  iframe组件，为了引入外部链接
</comment>
<template>
  <div id="IframeRouter" v-myloading="loading">
    <iframe id="iframe" ref="iframe" :src="url" frameborder="0" scrolling="auto"></iframe>
  </div>
</template>

<script>
  import { mapState, mapActions } from "vuex"
  import Cookie from 'js-cookie'
  import OrgModal from '@/select/OrgModal'
  export default {
    name: 'IframeRouter',
    components: {
      OrgModal
    },
    props: {
    },
    data() {
      return {
        url: '',
        msg: {},
        loading: true
      }
    },
    computed: {
      ...mapState({
        primaryColor: state => state.color,
      })
    },
    created() {

    },
    mounted() {
      /**
       * iframe加载完成时通过postMessage传递数据
       */
      //TODO
      this.url = this.$route.query.url + '?passportId=' + JSON.parse(Cookie.get('sessions')).passportId
      this.msg = this.$route.query.msg
      this.changeMobsfIframe()
      let mapFrame = this.$refs['iframe']
      mapFrame.onload = () => {
        this.loading = false
        let iframeWin = mapFrame.contentWindow
        iframeWin.postMessage({...this.msg, jwt:  Cookie.get('jwt'), primaryColor: this.primaryColor}, '*')
      }

      this.$root.eventHub.$on('resizeIframe', () => {
        this.changeMobsfIframe()
      })

      window.addEventListener('message', function(event){
        console.log('event.data是子页面通过postMessage传来的数据'+event.data);
        if(event.data != undefined && event.data !='ubaLoadDone'){
          // do something
        }
      }, false)
    },
    watch: {
      '$route':  {
        handler(val){
          this.url = val.query.url + '?passportId=' + JSON.parse(Cookie.get('sessions')).passportId
          this.msg = val.query.msg
          this.changeMobsfIframe()
          let mapFrame = this.$refs['iframe']
          mapFrame.onload = () => {
            this.loading = false
            let iframeWin = mapFrame.contentWindow
            iframeWin.postMessage({...this.msg, jwt:  Cookie.get('jwt'), primaryColor: this.primaryColor}, '*')
          }
          this.$root.eventHub.$on('resizeIframe', () => {
            this.changeMobsfIframe()
          })
          window.addEventListener('message', function(event){
            console.log('event.data是子页面通过postMessage传来的数据'+event.data);
            if(event.data != undefined && event.data !='ubaLoadDone'){
              // do something
            }
          }, false)
        },
        immediate: true,
        deep: true
      },
    },
    methods: {
      /**
       *  根据页面尺寸变化动态改变iframe尺寸
       */
      changeMobsfIframe() {
        const mobsf = document.getElementById('iframe')
        const IframeRouter = document.getElementById('IframeRouter')
        if(IframeRouter) {
          const deviceWidth = IframeRouter.offsetWidth
          const deviceHeight = IframeRouter.offsetHeight
          mobsf.style.width = deviceWidth + 'px'
          mobsf.style.height = deviceHeight  + 'px'
        }
      },
    },
    destroyed() {
      this.$root.eventHub.$off('resizeIframe')
      this.url = ''
    }
  }
</script>

<style lang="scss">
  #IframeRouter{
    width: 100%;
    height: calc( 100% - 4px);
  }
</style>
