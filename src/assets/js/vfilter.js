/**
 * @Description: 全局过滤器
 * @author LiChenGuang
 * @date 2019/07/01
 */
const vfilter = {
  dateServer: function (value) {
    return value.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
  },
  /**
   * 作者 李晨光
   * 金钱格式化
   * @param number  要格式化的参数
   * @param places  保留几位小数
   * @param symbol  金额单位
   * @param thousand 千位分隔符号
   * @param decimal 小数点
   * @returns {string}
   */
  formatMoney: function (number, places, symbol, thousand, decimal) {
    number = number || 0
    places = !isNaN(places = Math.abs(places)) ? places : 2
    symbol = symbol !== undefined ? symbol : "¥"
    thousand = thousand || ","
    decimal = decimal || "."
    let negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (j = i.length) > 3 ? j % 3 : 0
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "")
  },
  /**
   * 获取日期
   * @param AddDayCount -1 昨天 0 今天 1 明天 2 后天
   * @param symbol
   * @returns {string}
   * @constructor
   */
  GetDateStr: function (AddDayCount, symbol = '-') {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1;//获取当前月份的日期
    if (m < 10) {
      m = '0' + m
    }
    var d = dd.getDate();
    if (d < 10) {
      d = '0' + d
    }
    return y + symbol + m + symbol + d;
  },
  /**
   * 作者 李晨光
   * 日期格式化
   * @param date 日期
   * @param fmt 格式化 eg: 'yyyy-MM-dd'
   * @returns {*}
   */
  formatDate: function (obj, fmt) {
    const o = {
      'M+': obj.getMonth() + 1,//获取月份
      'd+': obj.getDate(),//获取日
      'h+': obj.getHours(),//获取小时
      'm+': obj.getMinutes(),//获取分钟
      's+': obj.getSeconds(),//获取秒钟
      'q+': Math.floor((obj.getMonth() + 3) / 3),//获取季度
      'S': obj.getMilliseconds()//获取毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  },
  /**
   * 作者 李晨光
   * 毫秒数时间格式化
   * @param str 毫秒数
   * @param fmt 格式化 eg: 'yyyy-MM-dd'
   * @returns {*}
   */
  formatTime: function (time, fmt) {
    let obj;
    if(typeof time == 'string' || typeof time == 'number') {
      if(typeof time == 'string') {
        obj = new Date(Number(time));
      }else{
        obj = new Date(time);
      }
    }else{
      return time
    }
    // 格式化日期
    const o = {
      'M+': obj.getMonth() + 1,//获取月份
      'd+': obj.getDate(),//获取日
      'h+': obj.getHours(),//获取小时
      'm+': obj.getMinutes(),//获取分钟
      's+': obj.getSeconds(),//获取秒钟
      'q+': Math.floor((obj.getMonth() + 3) / 3),//获取季度
      'S': obj.getMilliseconds()//获取毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  },
  formateTel: function (tel) {
    if (Number(tel) && String(tel).length === 11) {
      var mobile = String(tel)

      var reg = /^(\d{3})\d{4}(\d{4})$/

      return mobile.replace(reg, '$1****$2')

    } else {
      return tel
    }
  }
}

export default {vfilter}
