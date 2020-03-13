/**
* @Author: 李晨光
* @Date: 2019/7/12
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/12
**/
<comment>
  # 组件注释
</comment>
<template>
  <div id="BaseComponents">
    <Title class="m-b-20" title="基础组件">
      <div slot="handle" class="flex">
        <a-button v-waves>返 回</a-button>
      </div>
    </Title>
    <a-row class="m-20">
      
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
         <a-button type="primary" v-waves>主要按钮</a-button>
        <a-card>
          <div class="" style="min-height: 600px;height: auto;">

            <a-form :form="form">
              <a-row :gutter="20">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-button type="primary" v-waves>主要按钮</a-button>
                  <a-form-item
                    label="按钮"
                  >
                    <a-button type="primary" >主要按钮</a-button>
                    <a-button class="m-l-10">次要按钮</a-button>
                    <a-button class="m-l-10" type="dashed">虚线按钮</a-button>
                    <a-button class="m-l-10" type="danger">危险按钮</a-button>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="输入框"
                  >
                    <a-input v-decorator="[
                    'name',
                    {rules: [{ required: true, message: 'Please input your note!', validateTrigger: 'blur'}]}
                    ]" placeholder="请输入内容"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="数字输入框"
                  >
                    <a-input-number
                      :defaultValue="1000"
                      :formatter="value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                      :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="滑动输入条"
                  >
                    <a-slider :defaultValue="30"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="下拉选择-单选"
                  >
                    <a-select defaultValue="lucy">
                      <a-select-option value="jack">Jack</a-select-option>
                      <a-select-option value="lucy">Lucy</a-select-option>
                      <a-select-option value="disabled" disabled>Disabled</a-select-option>
                      <a-select-option value="Yiminghe">yiminghe</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="Radio"
                  >
                    <a-radio-group :options="['男', '女']" defaultValue="男"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="下拉选择-多选"
                  >
                    <a-select
                      mode="multiple"
                      placeholder="Please select"
                      :defaultValue="['a1', 'b2']"
                    >
                      <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                        {{(i + 9).toString(36) + i}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="switch切换"
                  >
                    <a-switch defaultChecked/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="日期选择"
                  >
                    <a-date-picker
                      style="width:100%"
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="日期范围"
                  >
                    <a-range-picker
                      :ranges="{
                  '今天': [moment(), moment()],
                  '本月': [moment().startOf('month'),
                   moment().endOf('month')],
                   '本周': [moment().startOf('week'), moment().endOf('week')]
                }"/>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="树选择-单选"
                  >
                    <a-tree-select
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="treeData"
                      placeholder='Please select'
                      treeDefaultExpandAll
                      v-model="value"
                      @change="onChange"
                    >
                      <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
                        Child Node1 {{value}}
                      </span>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="树选择-多选"
                  >
                    <a-tree-select
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="treeData"
                      placeholder='Please select'
                      treeDefaultExpandAll
                      multiple
                      @change="onChange2"
                      v-model="value2"
                    >
                      <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
                        Child Node1 {{value}}
                      </span>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="文件上传"
                  >
                    <a-upload-dragger style="min-height: 200px" name="file" :multiple="true"
                                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                      <p class="ant-upload-drag-icon">
                        <icon-font type="spm-icon-folder-open"/>
                      </p>
                      <p class="ant-upload-hint">该区域没有上传平面图 请从“
                      <p class="ant-upload-text">责任区域平面图</p>”处上传</p>
                    </a-upload-dragger>
                  </a-form-item>

                </a-col>
                <a-divider orientation="right">form</a-divider>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
                  <a-form-item
                    label="弹窗"
                  >
                  </a-form-item>
                  <a-button type="primary" @click="showModal" v-waves>弹 窗</a-button>

                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      centered
      v-model="visible"
      title="详情"
      :width="780">
      <template slot="footer">
        <a-button @click="handleCancel">取 消</a-button>
        <a-button type="primary" :loading="loading" @click="handleOk">
          确 定
        </a-button>
      </template>
      <template slot="header">
        <a-button key="back" @click="handleCancel">Return</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          Submit
        </a-button>
      </template>
      <a-form :form="form">
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import Title from '@/Title'
  import moment from 'moment';

  export default {
    name: 'BaseComponents',
    components: {
      Title
    },
    props: {},
    data() {
      return {
        form: this.$form.createForm(this),
        value: undefined,
        value2: undefined,
        treeData: [{
          title: 'Node1',
          value: '0-0',
          key: '0-0',
          children: [{
            value: '0-0-1',
            key: '0-0-1',
            scopedSlots: { // custom title
              title: 'title',
            },
          }, {
            title: 'Child Node2',
            value: '0-0-2',
            key: '0-0-2',
          }],
        }, {
          title: 'Node2',
          value: '0-1',
          key: '0-1',
        }],
        loading: false,
        visible: false
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    watch: {},
    methods: {
      moment,
      onChange(value) {
        console.log(value)
        this.value = value
      },
      onChange2(value) {
        console.log(value)
        this.value2 = value
      },
      showModal() {
        this.visible = true;
      },
      handleOk(e) {
        this.loading = true;
        setTimeout(() => {
          this.visible = false;
          this.loading = false;
        }, 3000);
      },
      handleCancel(e) {
        this.visible = false;
      },
    },
    destroyed() {
    }
  }
</script>

<style lang="scss">
</style>
