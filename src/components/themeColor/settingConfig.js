import { message } from 'ant-design-vue/es'
let lessNodesAppended
const colorList = [
  {
    key: '主题色1', color: '#E1673A'
  },
  {
    key: '主题色2', color: '#1173CE'
  },
  {
    key: '主题色3', color: '#30579D'
  },
  {
    key: '主题色4', color: '#009B94'
  }
]

const updateTheme = (primaryColor,callback) => {
  // Don't compile less in production!
  /* if (process.env.NODE_ENV === 'production') {
    return;
  } */
  // Determine if the component is remounted
  if (!primaryColor) {
    return
  }
  // const hideMessage = message.loading('正在切换主题！', 0)
  function buildIt () {
    if (!window.less) {
      return
    }
    setTimeout(() => {
      window.less
        .modifyVars({
          '@primary-color': primaryColor
        })
        .then(() => {
          let theme = ''
          switch (primaryColor) {
            case '#E1673A':
              theme = 1
              break;
            case '#1173CE':
              theme = 2
              break;
            case '#30579D':
              theme = 3
              break;
            case '#009B94':
              theme = 4
              break;
          }
          window.document.documentElement.setAttribute("data-theme", "theme" + theme);
          callback && callback()
          // hideMessage()
        })
        .catch(() => {
          let theme = ''
          switch (primaryColor) {
            case '#E1673A':
              theme = 1
              break;
            case '#1173CE':
              theme = 2
              break;
            case '#30579D':
              theme = 3
              break;
            case '#009B94':
              theme = 4
              break;
          }
          callback && callback()
          window.document.documentElement.setAttribute("data-theme", "theme" + theme);
          // message.error('Failed to update theme')
          // hideMessage()
        })
    })
  }
  if (!lessNodesAppended) {
    // insert less.js and color.less
    const lessStyleNode = document.createElement('link')
    const lessConfigNode = document.createElement('script')
    const lessScriptNode = document.createElement('script')
    lessStyleNode.setAttribute('rel', 'stylesheet/less')
    lessStyleNode.setAttribute('href', './static/less/color.less')
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `
    lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'
    lessScriptNode.async = true
    lessScriptNode.onload = () => {
      buildIt()
      lessScriptNode.onload = null
    }
    document.body.appendChild(lessStyleNode)
    document.body.appendChild(lessConfigNode)
    document.body.appendChild(lessScriptNode)
    lessNodesAppended = true
  } else {
    buildIt()
  }
}



export { updateTheme, colorList }
