/**
 * @Description: 全局公用方法
 * @author LiChenGuang
 * @date 2019/07/01
 * http://39.107.87.101:8087/#/loginByAdmin   运维端
 * http://39.107.87.101:8088/#/login   租户端
 */



(function (window) {
  let Util = {}
  // Util.baseUrl = 'http://39.106.209.183:10030'
  const debug = process.env.NODE_ENV !== 'production' // 开发环境中为true，否则为false

  // Util.baseUrl = debug ?  'http://39.106.209.183:8000/api' : 'http://39.107.87.101:8000/api'
  console.log(process.env)
  Util.baseUrl = process.env.API_ROOT

  Util.fileUploadServer = '/file-upload'

  // Util.portAdLogin = '20030'
  Util.adminServer = '/admin'

  // Util.portForOrg = '20020'
  // Util.portForDept = '20020'
  // Util.portUser = '20020'
  // Util.portRole = '20020'
  // Util.portApp = '20020'
  Util.orgServer = '/org'

  // Util.portTenant = '20010'
  Util.operationServer = '/operation'

  // Util.portSMS = '20040'
  Util.passportServer = '/passport'
  Util.imServer = '/im'

  // Util.portForWbs = '20111'
  Util.wbsServer = '/wbs'

  // Util.portBasicBusiness = '20080'
  // Util.portDict = '20080'
  Util.systemServer = '/system'


  Util.processError = function (vm, response) {
    if (response.statusCode == 200) {
      // vm.$message.success(response.statusMessage);
    } else {
      vm.$message.error(response.statusMessage);
    }
    return false
  }
  /**
   * 作者 李晨光
   * 日期 20190610
   * 处理所有的vue-axios的response 并判断是否成功
   * 2个回调函数, 处理成功和失败
   * @param response
   * @param sucessCallback 成功回调
   * @param failCallback  失败回调
   */
  Util.processRes = function (response, sucessCallback, failCallback) {
    if (response.statusCode == 200) {
      sucessCallback && sucessCallback(response)
    } else {
      failCallback && failCallback(response)
    }
  }

  Util.propsArrayToString = function (array) {
    let resultArray = []
    for (let i = 0; i < array.length; i++) {
      let current = array[i]
      resultArray.push(current.id + ':' + current.value)
    }
    return resultArray.join(',')
  }
  Util.deepCopyDelChildrenNull = function (arr) {
    let result = []
    arr.length && arr.forEach((item) => {
      let obj = {}
      if (item.children && item.children.length) {
        obj = item
        obj.children = Util.deepCopyDelChildrenNull(item.children)
      } else {
        for (let key in item) {
          if (key != 'children') {
            obj[key] = item[key]
          }
        }
      }
      result.push(obj)
    })
    return result
  };
  /**
   * 处理树结构数据
   */
  Util.dealData = function (tree, clickType) {
    let arr = []
    tree.length && tree.forEach((item) => {
      let obj = {}
      obj = Util.deepCopy(item)
      obj.pId = item.pid
      obj.value = item.id
      obj.label = item.name
      obj.key = item.id
      obj.enableEdit = false
      obj.title = item.name
      if (clickType) {
        item.type == 2 ? obj.disabled = true : obj.disabled = false
      }
      obj.scopedSlots = { icon: 'custom' }
      if (item.children && item.children.length) {
        obj.children = Util.dealData(item.children)
      }
      arr.push(obj)
    })
    return arr
  }
  /**
   * 处理树结构数据
   * 只有项目级才可以点击
   */
  Util.dealDataProjectTypeDisabled = function (tree) {
    let arr = []
    tree.length && tree.forEach((item) => {
      let obj = {}
      obj = Util.deepCopy(item)
      obj.pId = item.pid
      obj.value = item.id
      obj.label = item.name
      obj.key = item.id
      obj.enableEdit = false
      obj.title = item.name
      if (item.projectType && item.projectType == '401') {
        obj.disabled = false
      } else {
        obj.disabled = true
      }
      obj.scopedSlots = { icon: 'custom' }
      if (item.children && item.children.length) {
        obj.children = Util.dealDataProjectTypeDisabled(item.children)
      }
      arr.push(obj)
    })
    return arr
  }
  /**
   * 处理树结构数据 使 只有最后一级（没有children）可以点击
   *
   */
  Util.dealDataLastDisabled = function (tree, id = '') {
    let arr = []
    tree.length && tree.forEach((item, index) => {
      let obj = {}
      obj = Util.deepCopy(item)
      obj.pId = item.pid
      obj.value = item.id
      obj.label = item.name
      obj.key = item.id
      obj.title = item.name
      obj.index = index

      if (item.children && item.children.length) {
        obj.disabled = true
        obj.children = Util.dealDataLastDisabled(item.children, id)
      } else {
        obj.disabled = false;
        if (id && id == obj.key) {
          obj.disabled = true
        }
      }
      arr.push(obj)
    })
    return arr
  }
  /**
   * 处理树结构数据 使 
   * 特定的ids不可以点击
   *
   */
  Util.dealDataIdsDisabled = function (tree, ids) {
    let arr = []
    tree.length && tree.forEach((item, index) => {
      let obj = {}
      obj = Util.deepCopy(item)
      obj.pId = item.pid
      obj.value = item.id
      obj.label = item.name
      obj.key = item.id
      obj.title = item.name
      obj.index = index

      if (item.children && item.children.length) {
        obj.children = Util.dealDataIdsDisabled(item.children, ids)
      } else {
        ids.includes(item.id) ? obj.disabled = true : obj.disabled = false
      }
      arr.push(obj)
    })
    return arr
  }
  /**
   * 处理树结构数据 增加层级level
   * @param tree:树形结构的数据  level:树形结构的层级
   */
  Util.dealTreeData = function (tree, level) {
    let arr = []
    tree.length && tree.forEach((item, index) => {
      let obj = {}
      obj = Util.deepCopy(item)
      obj.pId = item.pid
      obj.value = item.id
      obj.label = item.name
      obj.key = item.id
      obj.title = item.name
      obj.level = level
      obj.index = index
      obj.enableEdit = false
      if (item.children && item.children.length) {
        obj.children = Util.dealTreeData(item.children, level + 1)
      }
      arr.push(obj)
    })
    return arr
  }
  /**
   * 路博欢
   * 获取树结构数据 特定的层级level
   * @param tree:树形结构的数据  level:特定层级以及特定层级一下层级
   */
  Util.getDesignTreeData = function (tree, level) {
    let arr = []
    tree.length && tree.forEach((item) => {
      let obj = {}
      obj = Util.deepCopy(item)
      if (obj.level >= level) {
        arr.push(obj)
      }
      if (item.children && item.children.length) {
        obj.children = Util.dealTreeData(item.children, level + 1)
      }
    })
    return arr
  }
  /**
   * 改变树级结构为普通数组对象类型
   */
  Util.initTree = function (tree) {
    let arr = []
    tree.length && tree.forEach((item) => {
      if (item.children && item.children.length) {
        arr.push(...Util.initTree(item.children));
        let a = Util.deepCopy(item)
        delete a.children;
        arr.push(a);
      } else {
        arr.push(item)
      }
    })
    return arr
  }
  Util.findParents = function (tree, item, isFirst) {
    let arr = [];
    if (isFirst) {
      arr.unshift({ index: item.index, id: item.id, name: item.name })
    }
    for (let i = tree.length; i--;) {
      if (item.pid == tree[i].id) {
        arr.unshift({ index: tree[i].index, id: tree[i].id })
        arr.unshift(...this.findParents(tree, tree[i], false))
      }
    }
    return arr;
  }
  /**获取树结构的所有id组成一维数组
   * @param level:获取层级为level的所有树结构的id
   * 不传参数时，获取所有层级的id
   */
  Util.getTreeAllId = function (tree, level) {
    let arr = [];
    tree.length && tree.forEach((item) => {
      if (level) {
        if (item.level == level) {
          arr.push(item.id)
        }
      } else {
        arr.push(item.id)
      }
      if (item.children && item.children.length) {
        arr.push(...Util.getTreeAllId(item.children, level));
      }
    })
    return arr;
  }
  /**
   * 通过props获取数据对象
   * @param data 数组对象（树形/普通数组对象）
   * @param prop
   * @param keyword
   * @returns {{}}
   */
  Util.getDataByProps = function (data, prop = 'id', keyword = '') {
    let result = {}
    data.length && data.forEach((item) => {
      if (item[prop] == keyword) {
        result = Util.deepCopy(item)
      }
      if (item.children && item.children.length) {
        Util.getDataByProps(item.children, prop, keyword)[prop] && (result = Util.getDataByProps(item.children, prop, keyword));
      }
    })
    return result
  }
  /**
   * 获取最外两层ID集合
   * @param data
   * @returns {Array}
   */
  Util.getIds = function (data) {
    let arr = []
    data.length && data.forEach((item) => {
      if (item.children && item.children.length) {
        arr.push(item.id)
        item.children.forEach((item) => {
          arr.push(item.id)
        })
      }
    })
    return arr
  }
  /**
   * 处理对象填充
   * @param obj
   * @param ids
   * @returns {*}
   */
  Util.delParams = function (obj = {}, ids = []) {
    let result = typeof obj.splice === "function" ? [] : {};
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          if (ids.includes(key)) {
            result[key] = Util.deepCopy(obj[key]);//如果对象的属性值为object的时候，递归调用deepClone,即在吧某个值对象复制一份到新的对象的对应值中。
          }
        } else {
          if (ids.includes(key)) {
            result[key] = obj[key];//如果对象的属性值不为object的时候，直接复制参数对象的每一个键值到新的对象对应的键值对中。
          }
        }
      }
      return result;
    }
    return obj;
  }

  /**
   *
   * 用后面对象去填充前面对象
   */
  Util.fullObj = function (first = {}, second = {}, reserve = []) {
    for (const key in first) {
      if (reserve.includes(key)) {
        continue;
      } else {
        first[key] = second[key] || '';
      }
    }
  }
  /**
   * 获取树结构数据最后一级数据
   */
  Util.getLastLevelData = function (tree) {
    let arr = []
    tree.length && tree.forEach((item) => {
      if (item.children && item.children.length) {
        arr.push(...Util.getLastLevelData(item.children))
      } else {
        if (!item.disabled) {
          arr.push(item)
        }
      }
    })
    return arr
  }
  /**
   * 全屏
   */
  Util.toggleFullScreen = function () {
    let doc = window.document
    let docEl = doc.documentElement
    let requestFullScreen =
      docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen
    let cancelFullScreen =
      doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl)
    } else {
      cancelFullScreen.call(doc)
    }
  }
  /**
   * 倒计时----秒
   * @param seconds 初始值
   * @param progressCallback  过程回调
   * @param finishCallback 完成回调
   */
  Util.countDown = function (seconds, progressCallback = () => {
  }, finishCallback = () => {
  }) {
    let timer = setInterval(() => {
      seconds--;
      progressCallback && progressCallback(seconds);
      if (seconds < 1) {
        clearInterval(timer);
        finishCallback && finishCallback();
      }
    }, 1000);
  }
  /**
   * * 作者 李晨光
   * 树结构查询
   * @param keyword  关键词
   * @param arr
   * @returns {Array}
   */
  Util.treeSearch = function (keyword = '', props = 'title', arr) {
    let _newarr = []
    arr.length && arr.forEach(element => {
      if (element.children && element.children.length) {
        let ab = Util.treeSearch(keyword, props, element.children)
        let obj = {
          ...element,
          children: ab
        }
        if (ab && ab.length) {
          _newarr.push(obj)
        } else {
          if (element[props].includes(keyword)) {
            _newarr.push({
              ...element,
              children: []
            })
          }
        }
      } else {
        if (element[props].includes(keyword)) {
          _newarr.push(element)
        }
      }
    })
    return _newarr
  };
  /**
   * * 作者 李晨光
   * 树结构(根据子节点 查询所有包括父节点的树结构)
   * @param ids  子节点集合
   * @param arr
   * @returns {Array}
   */
  Util.treeSearchByIds = function (ids = [], arr) {
    let _newarr = []
    arr.length && arr.forEach(element => {
      if (element.children && element.children.length) {
        let ab = Util.treeSearchByIds(ids, element.children)
        let obj = {
          ...element,
          children: ab
        }
        if (ab && ab.length) {
          _newarr.push(obj)
        } else {
          if (ids.includes(element.id)) {
            _newarr.push({
              ...element,
              children: []
            })
          }
        }
      } else {
        if (ids.includes(element.id)) {
          _newarr.push(element)
        }
      }
    })
    return _newarr
  };
  Util.getValueByKey = function (data = [], key = 'id', value = 'name', keyword) {
    let res = undefined
    data.length && data.forEach(item => {
      if (item[key] == keyword) {
        res = item[value]
      }
    })
    return res
  }

  //设置localStorage
  Util.setLocalStorage = function (key, value) {
    localStorage.setItem(key, value);
  }
  Util.getLocalStorage = function (key) {
    return localStorage.getItem(key);
  }
  Util.removeLocalStorage = function (key) {
    return localStorage.removeItem(key);
  }
  //设置localStorage
  Util.setSessionStorage = function (key, value) {
    sessionStorage.setItem(key, value);
  }
  Util.getSessionStorage = function (key) {
    return sessionStorage.getItem(key);
  }
  Util.removeSessionStorage = function (key) {
    return sessionStorage.removeItem(key);
  }
  /*
  根据文件名称判断文件类型
  * @param: fileName - 文件名称
  * @param: 数据返回 1) 无后缀匹配 - false
  * @param: 数据返回 2) 匹配图片 - image
  * @param: 数据返回 3) 匹配 txt - txt
  * @param: 数据返回 4) 匹配 excel - excel
  * @param: 数据返回 5) 匹配 word - word
  * @param: 数据返回 6) 匹配 pdf - pdf
  * @param: 数据返回 7) 匹配 ppt - ppt
  * @param: 数据返回 8) 匹配 视频 - video
  * @param: 数据返回 9) 匹配 音频 - radio
  * @param: 数据返回 10) 其他匹配项 - other
  */
  Util.getFileType = function (fileName) {
    // 后缀获取
    var suffix = '';
    // 获取类型结果
    var result = '';
    try {
      var flieArr = fileName.split('.');
      suffix = flieArr[flieArr.length - 1];
    } catch (err) {
      suffix = '';
    }
    // fileName无后缀返回 false
    if (!suffix) {
      result = false;
      return result;
    }
    // 图片格式
    var imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
    // 进行图片匹配
    result = imglist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'image';
      return result;
    }
    ;
    // 匹配txt
    var txtlist = ['txt'];
    result = txtlist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'txt';
      return result;
    }
    ;
    // 匹配 excel
    var excelist = ['xls', 'xlsx'];
    result = excelist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'excel';
      return result;
    }
    ;
    // 匹配 word
    var wordlist = ['doc', 'docx'];
    result = wordlist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'word';
      return result;
    }
    ;
    // 匹配 pdf
    var pdflist = ['pdf'];
    result = pdflist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'pdf';
      return result;
    }
    ;
    // 匹配 ppt
    var pptlist = ['ppt'];
    result = pptlist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'ppt';
      return result;
    }
    ;
    // 匹配 视频
    var videolist = ['mp4', 'm2v', 'mkv'];
    result = videolist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'video';
      return result;
    }
    ;
    // 匹配 音频
    var radiolist = ['mp3', 'wav', 'wmv'];
    result = radiolist.some(function (item) {
      return item == suffix;
    });
    if (result) {
      result = 'radio';
      return result;
    }
    // 其他 文件类型
    result = 'other';
    return result;
  }


  Util.Reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^0\.([0][1-9]$))|(^0\.[1-9][0-9]?)|(^0$)/   //费用可为0 0,0.1,0.01，10……
  Util.Reg2 = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^0\.([0][1-9]$))|(^0\.[1-9][0-9]?)/   //费用不能为0  0.1,0.01，10……
  Util.Reg3 = /(^[1-9]([0-9]+)?(\.[0][0]?)?$)|(^0\.0[0]?$)|(^0$)/  //正整数 + 0
  Util.Reg4 = /(^[1-9]([0-9]+)?(\.[0][0]?)?$)|(^0\.0[0]?$)/  //正整数
  Util.Reg5 = /(^[1-9]?$)|(^[1-9]\.[0-9]{1}?$)|(^0\.[1-9]{1}?$)/  //0.1-9.9
  Util.Reg6 = /(^[1-9]([0-9]+)?(\.[0][0]?)?$)|(^0\.0[0]?$)|(^0$)|(^\+?(\d*\.\d{1,4}))$/;  //保留小数点1~4位小数
  Util.Reg7 = /^[0-9A-Z]{18}$/;  //18位大写字母或数字
  Util.Reg9 = /^[0-9A-Za-z]+$/;  //18位大写字母或数字
  //Util.tel = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/ //手机号验证
  Util.tel = /^1[3456789]\d{9}$/ //手机号验证
  // Util.password = /^(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*_,./$\-=+])[a-z\d#@!~%^&*_,./$\-=+]{8,14}/i //8-16位数字、字母、特殊字符组合
  //Util.key = /(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*_.,/$-=+])[a-z\d#@!~%^&*_.,/$-=+]{8,14}/i //8-14位数字、字母、特殊字符组合
  Util.password = Util.key = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*,\-\./@_\+\=\(\)\~\`]+$)[\da-zA-Z!#$%^&*,\-\./@_\+\=\(\)\~\`]{8,14}$/i //8-14位(数字、字母)、(数字、字母·特殊字符)组合
  Util.age = /^([1-9]|[1-7][0-9]|80)$/ //年龄
  Util.Reg8 = /^([1-9]([0-9]+)?(\.[5][0]?)?$)|(^0\.5[0]?$)/ // 0.5 1.5
  Util.chinese = /^[\u4E00-\u9FA5]+$/ // 中文
  Util.Reg10 = /^(0|[1-9][0-9]*|-[1-9][0-9]*)$/  //正负整数 + 0
  Util.email = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/ // 邮箱正则表达式
  Util.adminName = /^[A-Za-z0-9\u4e00-\u9fa5]+/ // 管理员名称 请输入汉字、英文、数字或其组合
  // Util.adminAccount = /(?=.*[a-z])(?=.*\d)(?=.*[_])[a-z\d_]{6,18}$/i // 管理员账号 请输入6-18位字符，同时包含英文字母、数字、下划线
  Util.adminAccount = /^(?=.*_)(?=.*\d)(?=.*[a-zA-Z]).{6,18}$/ // 管理员账号 请输入6-18位字符，同时包含英文字母、数字、下划线
  Util.beginWidthAb = /^[a-zA-Z]+/ //以英文字母开头
  Util.iCard = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/   //身份证校验


  window.Util = Util
})(window)

export default {
  install: function (Vue) {
    Vue.Util
  }
}


