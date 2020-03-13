import vue from 'vue'
import './loading.scss'
export const MyLoading =  vue.directive('myloading', {
  bind: (el, binding) => {
    const tempDiv = document.createElement('div')
    tempDiv.className = 'v-ajax-loading v-load-status'
    const box = document.createElement('div')
    box.className = 'v-loading-box'
    const jelly = document.createElement('div')
    jelly.className = 'v-la-square-jelly-box'
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    jelly.appendChild(div)
    jelly.appendChild(div2)
    box.appendChild(jelly)
    tempDiv.appendChild(box)

    // const tempDiv = document.createElement('div')
    // tempDiv.className = 'ant-spin ant-spin-lg ant-spin-spinning'
    // const box = document.createElement('span')
    // box.className = 'ant-spin-dot ant-spin-dot-spin'
    // const i = document.createElement('i')
    // const i2 = document.createElement('i')
    // const i3 = document.createElement('i')
    // const i4 = document.createElement('i')
    // box.appendChild(i)
    // box.appendChild(i2)
    // box.appendChild(i3)
    // box.appendChild(i4)
    // tempDiv.appendChild(box)
    el.loadingElement = tempDiv
    /* if (binding.value) {
      const curStyle = window.getComputedStyle(el)
      const position = curStyle.position
      if (position === 'absolute' || position === 'relative') {
        el.style.position = position
      } else {
        el.style.position = 'relative'
      }
      el.appendChild(tempDiv)
    } else {
      if (tempDiv.parentNode !== null) {
        tempDiv.parentNode.removeChild(tempDiv)
      }
    } */
    const curStyle = window.getComputedStyle(el)
    const position = curStyle.position
    if (position === 'absolute' || position === 'relative') {
      el.style.position = position
    } else {
      el.style.position = 'relative'
    }
    if (binding.value) {
      el.appendChild(tempDiv)
    }
  },
  update: (el, binding) => {
    if (binding.value) {
      if (el.loadingElement.parentNode === null) {
        el.appendChild(el.loadingElement)
      }
    } else {
      if (el === el.loadingElement.parentNode) {
        el.removeChild(el.loadingElement)
      }
    }
  },
  unbind: (el) => {
    if (el.loadingElement.parentNode === el) {
      el.removeChild(el.loadingElement)
    }
    el.loadingElement = null
  }
})



