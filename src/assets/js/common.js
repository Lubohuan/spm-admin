/**
 * @Description: 基础方法
 * @author LiChenGuang
 * @date 2019/07/01
 */

(function (window) {
  let Common = {}
  /**
   * 作者 李晨光
   * 深拷贝对象,数组
   */
  Util.deepCopy = function (obj) {
    let result = typeof obj.splice === "function" ? [] : {};//判断数据类型
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          result[key] = Util.deepCopy(obj[key]);//如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
        } else {
          result[key] = obj[key];//如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
        }
      }
      return result;
    }
    return obj;
  };
  /**
   * 作者 李晨光
   * 为一个Vue的data新增一个新的属性,如果是数组, 则为每一项都新增一个新的属性
   */
  Common.addVueDataProperty = function ($vue, source, key, defaultValue) {
    if (source instanceof Array) {
      for (let idx = 0; idx < source.length; idx++) {
        let item = source[idx]
        $vue.$set(item, key, defaultValue)
      }
    } else {
      $vue.$set(source, key, defaultValue)
    }
  }

  /**
   * 作者 李晨光
   * 把json对象转成数组
   */
  Common.objTOArray = function (list) {
    let oList = [];
    for (let key in list) {
      oList.push(list[key]);
    }
    return oList;
  }

  /**
   * 作者 李晨光
   * 用后面对象去填充前面对象
   */
  Common.fullObj = function (first = {}, second = {}, reserve = []) {
    for (const key in first) {
      if (reserve.includes(key)) {
        continue;
      } else {
        first[key] = second[key] || '';
      }
    }
  }

  /**
   * 作者 李晨光
   * 获得毫秒数
   */
  Common.getTime = function (date) {
    return new Date(date).getTime()
  }
  /**
   * 作者 李晨光
   * 获得时间戳
   */
  Common.getDate = function () {
    return new Date()
  }

  /**
   * 作者 李晨光
   * 设置localStorage
   */
  Common.setLocalStorage = function (key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * 作者 李晨光
   * 获取localStorage
   */
  Common.getLocalStorage = function (key) {
    return localStorage.getItem(key);
  }

  /**
   * 作者 李晨光
   * 删除localStorage
   */
  Common.removeLocalStorage = function (key) {
    return localStorage.removeItem(key);
  }
  /**
   * 作者 李晨光
   * 设置sessionStorage
   */
  Common.setSessionStorage = function (key, value) {
    sessionStorage.setItem(key, value);
  }

  /**
   * 作者 李晨光
   * 获取sessionStorage
   */
  Common.getSessionStorage = function (key) {
    return sessionStorage.getItem(key);
  }

  /**
   * 作者 李晨光
   * 删除sessionStorage
   */
  Common.removeSessionStorage = function (key) {
    return sessionStorage.removeItem(key);
  }


  window.Common = Common
})(window)

export default {
  install: function (Vue) {
    Vue.Common
  }
}


