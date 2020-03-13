/**
* @Author: lbh
* @Date: 2019/9/9
* @Version: 1.0
* @Last Modified by: lbh
* @Last Modified time: 2019/9/9
**/
<comment>
  # 组件注释
  选择应用
</comment>
<template>
  <div id="TransferModal">
    <a-modal
      class="TransferModal"
      centered
      title="选择应用"
      :width="800"
      :visible="visible"
      @cancel="closeModal"
    >
      <div class="modal-body">
        <a-skeleton active :loading="loading" :paragraph="{rows: 17}">
          <a-row :gutter="16">
            <!-- 左边 -->
            <a-col class="gutter-row" :span="11">
              <!-- 左边穿梭框 资源-->
              <div class="transfer-box">
                <div class="transfer-box-header">
                  <div class="flex justify-between">
                    <a-checkbox @change="sourceAllChange" :checked="source.checked">全选</a-checkbox>
                    <span>待选功能</span>
                  </div>
                </div>
                <div class="transfer-box-body">
                  <div class="body-search">
                    <!-- <a-input-search
                    style="width: 100%"
                    placeholder
                    v-model="source.value"
                    @change="searchSource"
                    />-->
                  </div>
                  <div class="body-list">
                    <!--v-if="source.treeData.length>0"是为了让默认展开全部生效 -->
                    <a-tree
                      checkable
                      v-if="source.treeData.length>0"
                      v-model="source.checkedKeys"
                      :treeData="source.treeData"
                      defaultExpandAll
                    />
                  </div>
                </div>
              </div>
            </a-col>
            <!-- 中间 -->
            <a-col class="gutter-row" :span="2">
              <div class="transfer-config flex align-center direction-column justify-center">
                <!-- 右移按钮 -->
                <a-button
                  type="primary"
                  icon="right"
                  shape="circle"
                  size="large"
                  class="m-b-20"
                  :disabled="disRight"
                  @click="gotoRight"
                />
                <!-- 左移按钮 -->
                <a-button
                  type="primary"
                  icon="left"
                  shape="circle"
                  size="large"
                  :disabled="disLeft"
                  @click="gotoLeft"
                />
              </div>
            </a-col>
            <!-- 右边 -->
            <a-col class="gutter-row" :span="11">
              <!-- 右边穿梭框 已选-->
              <div class="transfer-box">
                <div class="transfer-box-header">
                  <div class="flex justify-between">
                    <a-checkbox @change="targetAllChange" :checked="target.checked">全选</a-checkbox>
                    <span>已选功能({{target.total}})</span>
                  </div>
                </div>
                <div class="transfer-box-body">
                  <div class="body-search">
                    <!-- <a-input-search style="width: 100%" placeholder @change="searchTarget" /> -->
                  </div>
                  <div class="body-list">
                    <a-tree
                      checkable
                      v-model="target.checkedKeys"
                      :treeData="target.treeData"
                      :defaultExpandAll="target.defaultExpandAll"
                    />
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-skeleton>
      </div>
      <template slot="footer">
        <a-button @click="closeModal">取 消</a-button>
        <a-button
          style="margin-left: 10px"
          type="primary"
          @click="confirm"
          :disabled="this.target.treeData.length<=0"
        >确 认</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
export default {
  name: "TransferModal",
  components: {},
  props: {
    sysType: {
      // 当前登录的系统的类型
      type: String,
      default: "platform"
    },
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    isVisible: {
      // modal状态  显示隐藏
      type: Boolean,
      default: false
    }
  },
  model: {
    // v-model
    prop: "selected",
    event: "change"
  },
  data() {
    return {
      api: {
        getTreeDataApiAll: Util.orgServer + "/web/resource/get-role-resource", // 获取菜单应用(平台)
        getTreeDataApi: Util.orgServer + "/web/resource/tree" // 获取菜单应用（租户）
      },
      dataUrl: "",
      initTreeData: [], //树结构处理为普通数组对象的
      initTreeDataAll: [], //树结构处理为普通数组对象的
      leftResult: [], //左边选中的
      rightResult: [], //右边选中的
      source: {
        //左边树结构相关属性
        indeterminate: false,
        checked: false, //全选状态
        defaultExpandAll: true,
        checkedKeys: [], //复选框选中项
        selectedKeys: [], //一个没用的东西
        //firstLevelKeys:[],
        allData: [],
        allDataStore: [],
        treeData: [], //树形结构的数据
        treeDataStore: [] //树形结构的数据
      },
      target: {
        //右边树结构相关属性
        indeterminate: false,
        checked: false, //全选状态
        efaultExpandAll: true,
        checkedKeys: [], //复选框选中项
        selectedKeys: [], //一个没用的东西
        //firstLevelKeys:[],
        allData: [],
        treeData: [], //树形结构的数据
        total: 0
      },
      disRight: true,
      disLeft: true,
      loading: false,
      visible: false,
      orgTree: [], // 组织树数据
      tableData: {
        list: []
      },
      columns: [
        {
          // 列表头部配置表
          title: "部门编号",
          dataIndex: "num",
          width: 80
        },
        {
          title: "部门名称",
          dataIndex: "name",
          width: 200
        }
      ],
      checks: [] // 选择结果
    };
  },
  computed: {},
  created() {
    //this.getTreeData();
  },
  mounted() {},
  watch: {
    isVisible: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    "source.checkedKeys": {
      handler(val) {
        this.checkSource(val);
      },
      immediate: true,
      deep: true
    },
    "target.checkedKeys": {
      handler(val) {
        this.checkTarget(val);
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    //初始化组件数据
    reset() {
      this.dataUrl = this.api.getTreeDataApiAll;
      // if (this.sysType == "platform") {
      //   this.dataUrl = this.api.getTreeDataApiAll;
      // } else {
      //   this.dataUrl = this.api.getTreeDataApi;
      // }
      this.initTreeData = []; //树结构处理为普通数组对象的
      this.initTreeDataAll = []; //树结构处理为普通数组对象的
      this.leftResult = []; //左边选中的
      this.rightResult = []; //右边选中的
      (this.source = {
        //左边树结构相关属性
        indeterminate: false,
        checked: false, //全选状态
        defaultExpandAll: true,
        checkedKeys: [], //复选框选中项
        selectedKeys: [], //一个没用的东西
        //firstLevelKeys:[],
        allData: [],
        allDataStore: [],
        treeData: [], //树形结构的数据
        treeDataStore: [] //树形结构的数据
      }),
        (this.target = {
          //右边树结构相关属性
          indeterminate: false,
          checked: false, //全选状态
          efaultExpandAll: true,
          checkedKeys: [], //复选框选中项
          selectedKeys: [], //一个没用的东西
          //firstLevelKeys:[],
          allData: [],
          treeData: [], //树形结构的数据
          total: 0
        }),
        (this.disRight = true);
      this.disLeft = true;
    },
    //初始化请求数据
    initSub(feedBackAxios, props) {
      this.reset();
      //requestLists[0]:获取原始树结构的请求
      //requestLists[1]:获取需要回显的第三级菜单的请求

      let requestLists = [this.$get(this.dataUrl), feedBackAxios];
      this.feedbackTreeData(requestLists, props);
    },
    getTreeData() {
      this.loading = true;
      this.$get(this.dataUrl)
        .then(response => {
          this.loading = false;
          Util.processRes(
            response,
            () => {
              if (response.data && response.data.length) {
                this.source.allData = Util.dealTreeData(response.data, 1);
                this.source.treeData = this.source.allData;
                this.initTreeData = Util.initTree(this.source.treeData);
              }
            },
            () => {}
          );
          Util.processError(this, response);
        })
        .catch(res => {
          console.log(res);
          this.loading = false;
          Util.processError(this, res);
        });
    },
    //回显数据
    feedbackTreeData(requestLists, props) {
      this.loading = true;
      this.$getAll(requestLists)
        .then(response => {
          this.loading = false;
          let lData = response[0];
          let rData = response[1];
          //处理第一个请求的数据（完整树结构）
          if (lData.data && lData.data.length > 0) {
            this.source.allData = Util.dealTreeData(lData.data, 1);
            this.source.treeData = this.source.allData;
            this.initTreeData = Util.initTree(this.source.treeData);
          }
          //处理第二个请求的数据（已授权的三级菜单 ids的数组）
          if (rData.data && rData.data.length > 0) {
            let ids = [];
            rData.data.forEach(item => {
              ids.push(item[props]);
            });
            this.checkSource(ids, true);
          }
        })
        .catch(res => {
          console.log(res);
          this.loading = false;
          Util.processError(this, res);
        });
    },
    /**
     * tree搜索
     */
    searchSource: debounce(function(val) {
      this.source.value = val.target.value;
      this.handleSearchSource(val.target.value);
    }, 900),
    // 搜索
    handleSearchSource(val) {
      this.source.treeData = val
        ? Util.treeSearch(val, this.source.allData)
        : this.source.allData;
      this.source.treeData = Util.dealTreeData(this.source.treeData, 1);
    },
    searchTarget: debounce(function(val) {
      this.target.value = val.target.value;
      this.handleSearchTarget(val.target.value);
    }, 500),
    handleSearchTarget(val) {
      this.target.treeData = val
        ? Util.treeSearch(val, this.target.allData)
        : this.target.allData;
    },
    /**处理原始数据，根据原始数据与当前已授权的菜单，得出左边菜单的树形数据 */
    afterPost(basicData, checkedData) {},
    /**左边资源全选change事件 */
    sourceAllChange(e) {
      this.source.checked = !this.source.checked;
      if (this.source.checked) {
        this.source.checkedKeys = JSON.parse(
          JSON.stringify(Util.getTreeAllId(this.source.treeData, 3))
        );
      } else {
        this.source.checkedKeys = [];
      }
    },
    /**右边 全选change事件 */
    targetAllChange(e) {
      this.target.checked = !this.target.checked;
      if (this.target.checked) {
        this.target.checkedKeys = JSON.parse(
          JSON.stringify(Util.getTreeAllId(this.target.treeData, 3))
        );
      } else {
        this.target.checkedKeys = [];
      }
    },

    /**左边 选择事件 */
    checkSource(val, needGoNext) {
      if (val.length > 0) {
        /*第0步  获取所有level为3的数据 */
        let allLastLevelData = Util.getTreeAllId(this.source.treeData, 3);
        /**第一步：通过id获取所有属性 */
        let arrayObj = [];
        val.forEach(item => {
          arrayObj.push(Util.getDataByProps(this.source.treeData, "id", item));
        });
        /*第二步：得到选中的level为3的菜单 */
        let result = [];
        arrayObj.forEach(v => {
          if (v.level == 3) {
            result.push(v);
          }
        });
        /*判断右移按钮是否能点击， */
        if (result.length > 0) {
          this.disRight = false;
          this.leftResult = Util.deepCopy(result);
          if (result.length == allLastLevelData.length) {
            this.source.checked = true;
          } else {
            this.source.checked = false;
          }
        } else {
          this.disRight = true;
          this.leftResult = [];
          this.source.checked = false;
        }
        if (needGoNext) {
          this.gotoRight();
        }
      } else {
        this.disRight = true;
        this.leftResult = [];
        this.source.checked = false;
      }
    },
    // /**右边  选择事件 */
    checkTarget(val) {
      if (val.length > 0) {
        this.disLeft = false;
        let result = [];
        val.forEach(item => {
          result.push(Util.getDataByProps(this.target.treeData, "id", item));
        });
        this.rightResult = Util.deepCopy(result);
        if (this.rightResult.length == 0) {
          this.target.checked = false;
        } else if (this.rightResult.length == this.target.treeData.length) {
          this.target.checked = true;
        }
      } else {
        this.disLeft = true;
        this.target.checked = false;
      }
    },
    //保存未删除之前的数据
    /*laterFunc() {
      var p = new Promise((resolve, reject)=> {
        //做一些异步操作
         this.source.treeDataStore = Util.deepCopy(this.source.treeData);
         this.source.allDataStore = Util.deepCopy(this.source.allData);
        //保存结构
        //this.initTreeData = Util.initTree(this.source.treeData); //保存结构
        //this.initTreeDataAll = Util.initTree(this.source.allData); //保存结构
      });
      return p;
    },*/
    /**右移
     * 删除左边soure.treeData中选中的数据
     * 把选中的数据放入右边
     */
    gotoRight() {
      /*第一步：给右边属性结构新增左边选中项,并改变右边的total*/
      this.target.treeData = [...this.target.treeData, ...this.leftResult];
      this.target.allData = this.target.treeData;
      this.target.total = this.target.treeData.length;
      /*第二步：删除左边选中的数据 */
      this.afterGoRight(this.source.treeData);
      //this.afterGoRight(this.source.allData);
      /*第三步：左边选中项清空*/
      this.source.checkedKeys = [];
      this.source.checked = false;
    },
    afterGoRight(treeData) {
      //delArray 二维数组格式  左边树形结构需要删除的数据的index
      //delArray=[[{"index":0,"id":"783655ff45ba428eb912c6c11b599f88"},{"index":1,"id":"a08ea155df4549c8b0c1c6524ae03500"},{"index":0,"id":"783655ff45ba428eb912c6c11b599111","name":"秘钥激活111"}]]
      let delArray = [];
      let initTreeData = Util.initTree(this.initTreeData);
      //遍历左边选中项，填充delArray
      this.leftResult.forEach((item, index) => {
        delArray.push(Util.findParents(initTreeData, item, true));
      });
      //从左边树形结构删除应用菜单
      delArray.forEach(item => {
        let lastLevelData =
          treeData[item[0].index].children[item[1].index].children;
        var i = lastLevelData.findIndex(lastLevelItem => {
          return lastLevelItem.id == item[2].id;
        });
        lastLevelData.splice(i, 1);
      });
    },
    /**左移
     * 删除右边target.treeData中选中的数据
     * 把选中的数据放入左边
     */
    gotoLeft() {
      this.afterGoLeft();
      //this.afterGoLeft(this.initTreeDataAll,this.source.allData,this.target.allData)
      /**第4步：右边选中项清空 */
      this.target.checkedKeys = [];
      this.target.checked = false;
      this.target.total = this.target.treeData.length;
    },
    afterGoLeft() {
      let delArray = [];
      //遍历左边选中项，填充delArray
      let initTreeData = Util.initTree(this.initTreeData);
      this.rightResult.forEach((item, index) => {
        delArray.push(Util.findParents(initTreeData, item, true));
      });
      /*第2步：删除右边数据 求差集*/
      this.target.treeData = [...this.target.treeData].filter(x =>
        [...this.rightResult].every(y => y.id !== x.id)
      );
      /*第3步：把右边删除的数据放回左边*/
      delArray.forEach(item => {
        let lastLevelData = this.source.treeData[item[0].index].children[
          item[1].index
        ].children;
        let i = initTreeData.filter(initItem => {
          return initItem.id == item[2].id;
        });
        lastLevelData.push(i[0]);
      });
    },
    /**
     * 确认
     */
    getDeleArray() {},
    confirm() {
      this.$emit("change", this.target.treeData);
      this.closeModal();
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.visible = !this.visible;
      this.$emit("closed", false);
    }
  },
  destroyed() {}
};
</script>

<style lang="scss">
.TransferModal .transfer-config {
  height: 594px;
}
.TransferModal .transfer-box {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 2px;

  .transfer-box-header {
    border-bottom: 1px solid #e8e8e8;
    padding: 10px 20px;
  }
  .transfer-box-body {
    .body-search {
      padding: 20px 20px;
      padding-bottom: 3px;
    }
    .body-list {
      padding: 10px 20px;
      height: 500px;
      overflow-y: auto;
    }
  }
}
</style>
