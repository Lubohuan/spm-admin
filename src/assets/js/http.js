/**
 * @Description: 封装axios请求
 * @author LiChenGuang
 * @date 2019/7/10
 */
import axios from 'axios'
import { message } from 'ant-design-vue'
import Cookie from 'js-cookie'

/*国际化*/
import i18n from '#/i18n/i18n';

let isFormData = (v) => {
  return Object.prototype.toString.call(v) === '[object FormData]';
}
axios.defaults.timeout = 10000
// axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
let sessions = {}
//http request 拦截器
axios.interceptors.request.use(
  config => {
    if (!isFormData(config.data)) {
      config.data = JSON.stringify(config.data)
    }
    const jwt = Cookie.get('jwt');
    const sessions = Cookie.get('sessions') ? JSON.parse(Cookie.get('sessions')) : {}
    // 判断是否是登录请求
    // true
    if (config.url.indexOf('admin-user/login') > -1) {
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      }
    } else {
      // false
      // 判断是否有登录token
      if (jwt) {
        if (isFormData(config.data)) {
          config.headers = {
            "Content-Type": "multipart/form-data",
            'Authorization': jwt,
            ...sessions
          }
        } else {
          config.headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': jwt,
            ...sessions
          }
        }
      } else {
        if (isFormData(config.data)) {
          config.headers = {
            "Content-Type": "multipart/form-data",
            ...sessions
          }
        } else {
          config.headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            ...sessions
          }
        }

      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)
//http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log('success',response)
    response.headers.Authorization && Cookie.set('jwt', 'Bearer ' + response.headers.Authorization, { expires: 7 })
    return response;
  },
  err => {
    console.log('fail', err.response)
    console.log('fail', err)
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break

        case 401:
          err.message = i18n.t('message.401')
          break

        case 403:
          err.message = i18n.t('message.403')
          break

        case 404:
          err.message = `${i18n.t('message.404')}: ${err.response.config.url}`
          break

        case 408:
          err.message = '请求超时'
          break

        case 500:
          err.message = i18n.t('message.500')
          break

        case 501:
          err.message = '服务未实现'
          break

        case 502:
          err.message = '网关错误'
          break

        case 503:
          err.message = '服务不可用'
          break

        case 504:
          err.message = '网关超时'
          break

        case 505:
          err.message = 'HTTP版本不受支持'
          break

        default:
      }
    } else {
      err.message = '网络出现问题，请稍后再试'
    }
    message.error(err.message);
    return Promise.reject(err)
  }
)


/**
 * get请求
 * @param url
 * @param params
 * @returns {Promise}
 */

export function get(url, params = {}) {
  sessions = Cookie.get('sessions') ? JSON.parse(Cookie.get('sessions')) : {}
  return new Promise((resolve, reject) => {
    axios.get(Util.baseUrl + url, {
      params: params
    })
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(Util.baseUrl + url, data)
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * post请求 params
 * @param url
 * @param data
 * @returns {Promise}
 */

export function postParams(url, params = {}, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: Util.baseUrl + url,
      params: params,

      body: data
    })
      .then(response => {
        console.log(response)
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 文件上传 uploadFile(使用post请求)
 * @param url
 * @param data
 * @returns {Promise}
 * @param 不需要传passportId
 *
 *$$$$$$参数module取值参考如下$$$$$$$$$

 *运营中心服务【租户、秘钥】  【20010】
 'spm-operation'

 *统一组织机构服务[组织、部门等] 【20020】
 'spm-org-structure'

 *权限管理服务[资源菜单、角色、用户等] 【20030】
 'spm-admin'

 *账号信息服务[统一账号、账户管理] 【20040】
 'spm-passport'

 *统一鉴权中心服务[Token管理、认证、刷新] 【20050】
 'spm-auth-server'

 *应用中心服务[应用注册] 【20060】
 'spm-app-center'

 *第三方服务【提供短信、消息推送】 【20070】
 'spm-third-party'

 *系统服务（基础数据、版本、服务等） 【20080】
 'spm-system'

 *文件服务[文件/图片上传下载/处理等功能] 【20090】
 'spm-file-upload'

 *即时通讯信息服务[im管理] 【20100】
 'spm-im'

 *日志监控服务logstash  【20110】
 'spm-logstash'
 */
export function uploadFile(data = {}) {
  return new Promise((resolve, reject) => {
    //固定参数
    const fixedParams = {
      appId: 'spm',
      appName: 'spm',
    }
    //合并参数
    let params = { ...fixedParams, ...data }
    //创建formData 并赋值
    let formData = new FormData();
    for (let key in params) {
      formData.append(key, params[key])
    }
    //请求后台
    axios({
      method: 'post',
      //url: Util.baseUrl + Util.fileUploadServer + '/V1.0.0/api/file/upload',
      url: 'http://39.105.163.75:20090/V1.0.0/api/file/upload',
      data: formData,
    })
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function uploadFileBusiness(url, data = {}) {
  return new Promise((resolve, reject) => {
    //固定参数

    //合并参数
    let params = data
    //创建formData 并赋值
    let formData = new FormData();
    for (let key in params) {
      formData.append(key, params[key])
    }
    //请求后台
    axios({
      method: 'post',
      //url: Util.baseUrl + Util.fileUploadServer + '/V1.0.0/api/file/upload',
      url: Util.baseUrl + url,
      data: formData,
    })
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function uploadImg(data = {}) {
  return new Promise((resolve, reject) => {

    //请求后台
    axios({
      method: 'post',
      // url: Util.baseUrl + Util.fileUploadServer + '/V1.0.0/api/file/upload',
      url: 'http://39.105.163.75:20090/V1.0.0/api/file/upload',
      data: data,
    })
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export function exportFile(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: Util.baseUrl + url,
      params: data,
      responseType: 'arraybuffer'
    })
      .then(response => {
        // 请求成功
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 并发请求
 * @param requestLists
 * @returns {Promise<any>}
 */
export function getAll(requestLists = []) {
  let counter = 1 // 请求次数
  let maxRequestTimes = 5 // 最大请求次数，因为有可能别个页面就是访问不了，请求多少次也没用- -
  let result = [] // 最后的结果
  let failedList = []
  return new Promise((resolve, reject) => {
    axios.all(requestLists)
      .then(response => {
        result = result.concat(response.filter(i => i)) // filter返回true的时候保留该数组项，因为getDataById的catch里没有给返回值（这里也不需要），这里的resolve里就会有undefined，需要过滤掉
        let failedLength = failedList.length
        if (failedLength > 0 && counter < maxRequestTimes) { // 如果失败列表里有请求，并且请求次数不超过设定的值，就进行下一次请求，并且打出log
          //console.log(`第${counter}次请求完成，其中成功${requestLists.length - failedLength}个，失败${failedLength}个，正在进行第${++counter}次请求...`)
          getAll(failedList)
          failedList = [] // 这里要清空failedList，不然会一直调用。不用担心，下一次请求失败的会在getAll填充到failedList里。
        } else { // 表示所有请求都成功了，或者达到了最大请求次数。到这里就可以对result做进一步处理了。
          //console.log(`请求完成，共请求${counter}次, 其中成功${requestLists.length - failedLength}个，失败${failedLength}个\n`, result)
          counter = 1
          resolve(response)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
