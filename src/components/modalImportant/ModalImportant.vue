/**
* @Author: 路博欢
* @Date: 2019/8/1
* @Version: 1.0
* @Last Modified by: 路博欢
* @Last Modified time: 2019/8/1
**/
<comment>
    # 导入
</comment>
<template>
  <a-modal
    id="ModalImportant"
    centered
    v-model="visible"
    :width="600"
    title="导入文件"
    :destroyOnClose="true"
    :afterClose="handleClose"
    class="ModalImportant"
  >
    <div class="body">
      <a-form :form="form">
        <a-row :gutter="20">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-item label="文件导入" class="file-required">
              <a-upload
                :fileList="fileList"
                :remove="handleRemove"
                :beforeUpload="beforeUpload"
                @change="fileChange"
                accept=".mpp, .xls, .xlsx"
              >
                <a-button>选择文件</a-button>
                <span style="color:#c3c3c3">支持project（.mpp）文件、excel(.xls、.xlsx）文件</span>
              </a-upload>
              <!-- <p style="margin-top:10px"></p> -->
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="m-t-10">
            <a-form-item label>
              <div>
                <div class="text-div">
                  1.下载导入模板
                  <span
                    class="primary"
                    style="cursor:pointer"
                    @click="downLoadModel(resultModule.mpp)"
                  >《{{resultModule.name}}.mpp》</span>
                  <!-- <a style="color:#66b1ff;text-decoration:none" href="http://pan-cloud.oss-cn-beijing.aliyuncs.com/2019-06-20总进度计划导入模板.mpp" download="文件名.mpp">《总进度计划导入模板.mpp》</a> -->
                </div>
                <div class="text-div">
                  2.下载导入模板
                  <span
                    class="primary"
                    style="cursor:pointer"
                    @click="downLoadModel(resultModule.xls)"
                  >《{{resultModule.name}}.xls》</span>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div class="errorTable" v-if="showTable">
        <div class="table-table">
          <a-skeleton active :loading="table.loading" :paragraph="{rows: 5}">
            <a-table
              :locale="{emptyText: '暂无数据'}"
              :columns="table.columns"
              :pagination="false"
              :dataSource="table.data"
              size="middle"
              :scroll="{ y:550 }"
              rowKey="id"
            >
              <!-- 序号-->
              <template slot="order" slot-scope="text,record,index">{{index+1}}</template>
              <!-- 行-->
              <template slot="position" slot-scope="text,record">{{record.position}}</template>
              <!-- 原因-->
              <template slot="reason" slot-scope="text">{{text}}</template>
            </a-table>
          </a-skeleton>
        </div>
        <!-- <div class="table-pagination">
          <Pagination
            :total="pagination.totalCount"
            :pageSize="pagination.pageSize"
            :current="pagination.pageNo"
            @onChange="onChangePage"
            @onShowSizeChange="onShowSizeChangePage"
          ></Pagination>
        </div>-->
      </div>
    </div>
    <template slot="footer">
      <a-button key="back" @click="handleClose">取消</a-button>
      <a-button
        type="primary"
        @click="handleUpload"
        :disabled="fileList.length != 1"
        :loading="uploading"
      >{{uploading ? '上传中' : '开始上传' }}</a-button>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
import Pagination from "@/Pagination"; //分页组件
export default {
  name: "ModalImportant",
  components: {
    Pagination
  },
  props: ["upLoadType"], //upLoadType=1 施工区域；upLoadType=2 分部分项； upLoadType=3 项目分部分项
  data() {
    return {
      Util,
      api: {
        areaImportExcelApi: Util.wbsServer + "/web/wbs/area/import-excel", //施工区域导入excel
        areaImportProjectApi: Util.wbsServer + "/web/wbs/area/import-project", //施工区域导入project
        subImportExcelApi: Util.wbsServer + "/web/wbs/wbs/import-excel", //分部分项导入excel
        subImportProjectApi: Util.wbsServer + "/web/wbs/wbs/import-project", //分部分项导入project
        pImportExcelApi: Util.wbsServer + "/web/wbs/wbs-project/import-excel", //项目分部分项导入excel
        pImportProjectApi:
          Util.wbsServer + "/web/wbs/wbs-project/import-project" //项目分部分项导入project
      },
      uploading: false,
      hasNoFile: false,
      modalTitle: "",
      isSub: false,
      visible: false,
      fileList: [],
      showTable: false,
      currentRowData: null,
      form: this.$form.createForm(this),
      defaultForm: {},
      table: {
        loading: false,
        height: null,
        columns: [
          {
            title: "序号",
            dataIndex: "order",
            width: 50,
            scopedSlots: { customRender: "order" }
          },
          {
            title: "行",
            width: 50,
            dataIndex: "position",
            scopedSlots: { customRender: "position" }
          },
          {
            title: "失败原因",
            width: 150,
            dataIndex: "reason",
            scopedSlots: { customRender: "reason" }
          }
        ],
        data: []
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        totalCount: 0
      },
      areaMo: {
        name: "项目施工区段导入模板",
        mpp:
          "http://bim-gis-model.oss-cn-beijing.aliyuncs.com/template/%E9%A1%B9%E7%9B%AE%E6%96%BD%E5%B7%A5%E5%8C%BA%E6%AE%B5%E5%AF%BC%E5%85%A5%E6%91%B8%E6%9D%BF.mpp",
        xls:
          "http://bim-gis-model.oss-cn-beijing.aliyuncs.com/template/%E9%A1%B9%E7%9B%AE%E6%96%BD%E5%B7%A5%E5%8C%BA%E6%AE%B5%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls"
      },
      /*分部分项模板* */
      subItemTemplate: {
        name: "分部分项导入模板",
        mpp:
          "http://bim-gis-model.oss-cn-beijing.aliyuncs.com/template/%E5%88%86%E9%83%A8%E5%88%86%E9%A1%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.mpp",
        xls:
          "http://bim-gis-model.oss-cn-beijing.aliyuncs.com/template/%E5%88%86%E9%83%A8%E5%88%86%E9%A1%B9%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls"
      },
      resultModule: {
        name: "",
        mpp: "",
        xls: ""
      }
    };
  },
  computed: {
    ...mapState({
      curr_org: state => state.curr_org
    })
  },
  created() {
    if (this.upLoadType == 1) {
      this.resultModule = this.areaMo;
    } else if (this.upLoadType == 2) {
      this.resultModule = this.subItemTemplate;
    } else {
      this.resultModule = this.subItemTemplate;
    }
  },
  mounted() {},
  watch: {},
  methods: {
    /*重置模态框中的值*/
    async reset() {
      this.form.resetFields();
      await this.setForm();
      this.form.validateFields();
    },
    setForm() {
      let pName = "";
      if (this.isSub) {
        // let pData =  Util.getDataByProps(this.tableData,'id',this.currentRowData.pid);
        // if(JSON.stringify(pData) == "{}"){
        //   pName = this.curr_org.name
        // }else{
        //   pName = pData.name
        // }
        pName = this.currentRowData.name;
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          pName: pName
        });
      });
    },
    /*
     *@params  isSub:是否为添加子集
     *打开modal的事件*/
    handleOpen() {
      this.visible = true;
      this.fileList = [];
    },
    /*关闭modal后的回调事件*/
    handleClose() {
      this.visible = false;
    },
    fileChange(data) {},
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      // const formData = new FormData();
      // fileList.forEach(file => {
      //   formData.append("files[]", file);
      // });
      this.uploading = true;
      let file = fileList[0];
      let fileArr = fileList[0].name.split(".");
      let fileType = fileArr[fileArr.length - 1];
      let url = "";
      if (this.upLoadType == "1") {
        url =
          fileType == "mpp"
            ? this.api.areaImportProjectApi
            : this.api.areaImportExcelApi;
      } else if (this.upLoadType == "2") {
        url =
          fileType == "mpp"
            ? this.api.subImportProjectApi
            : this.api.subImportExcelApi;
      } else if (this.upLoadType == "3") {
        url =
          fileType == "mpp"
            ? this.api.pImportProjectApi
            : this.api.pImportExcelApi;
      }
      let params = {
        file: file
      };
      if (this.upLoadType == 1) {
        params.projectId = this.curr_org.id;
      } else if (this.upLoadType == 2) {
        params.wbsTypeId = this.$route.query.id;
      } else if (this.upLoadType == 3) {
        params.projectId = this.curr_org.id;
      }
      this.$uploadFileBusiness(url, params)
        .then(response => {
          this.uploading = false;
          Util.processRes(response, () => {
            //if (response.statusCode == 200) {
            this.$message.success("上传成功！");
            this.$emit("searchList", true);
            this.handleClose();
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.uploading = false;
          Util.processError(this, res);
        });
    },
    downLoadModel(url) {
      let a = document.createElement("a");
      a.setAttribute("href", url);
      a.click();
    },
    /** 搜索列表*/
    searchList(isInit) {
      this.table.loading = true;
      //console.log(this.searchParam)
      if (isInit) {
        this.pagination.pageNo = 1;
      }
      let params = {
        size: this.pagination.pageSize,
        current: this.pagination.pageNo
      };

      this.$post(this.api.errorListApi, params)
        .then(response => {
          this.table.loading = false;
          Util.processRes(response, () => {
            this.pagination.totalCount = Number(response.data.total);
            response.data.records && response.data.records.length > 0
              ? (this.table.data = response.data.records)
              : (this.table.data = []);
          });
          Util.processError(this, response);
        })
        .catch(res => {
          this.table.loading = false;
          Util.processError(this, res);
        });
    },
    // 页数变化回调
    onChangePage(pageNo, pageSize) {
      this.pagination.pageNo = pageNo;
      // 重新请求数据
      this.searchList(false);
    },
    // 每页条数变化回调
    onShowSizeChangePage(pageNo, pageSize) {
      this.pagination.pageNo = 1;
      this.pagination.pageSize = pageSize;
      // 重新请求数据
      this.searchList(false);
    }
  },
  destroyed() {}
};
</script>
<style lang="scss">
.ModalImportant {
  .ant-form-item {
    margin-bottom: 10px;
  }
  .text-div {
    line-height: 1.8;
    .primary {
      @include primary_color();
    }
  }
}
</style>
