/**
* @Author: zmm
* @Date: 2019/8/9
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
    # 组件注释
    // 调用
    <taskSelect ref="taskSelect" :propsData="propsData"></taskSelect>
    // 显示组件
    this.$refs.taskSelect.openTaskSelect()
</comment>
<template>
    <div id="TaskSelect" v-if="taskShow">
        <div class="select" v-show="taskSelectShow">
            <div class="select_title_warp">
                <span class="select_title">{{title}}</span>
                <icon-font type="spm-icon-guanbi" class="close_btn" @click="closeTaskSelect"></icon-font>
            </div>
            <div class="search_warp">
                <a-input placeholder="查找项目" v-model="searchProjectName" ref="projectNameInput">
                    <a-icon slot="prefix" type="search" />
                    <a-icon v-if="searchProjectName" slot="suffix" type="close-circle" @click="emitEmpty" />
                </a-input>
            </div>
            <div class="add_btn_wrap" @click="createProjectAction">
                <icon-font type="spm-icon-hebingxingzhuang" class="add_btn"></icon-font>
                <span>新增项目</span>
            </div>
            <div class="default_project">
                <span class="project_title">默认项目</span>
                <span class="project_name" @click="selectProject(true,null)">
                        <p>{{defaultProjectName}}</p>
                        <icon-font type="spm-icon-xuanze" class="project_choose" v-if="defaultSelect"></icon-font>
                    </span>
            </div>
            <div class="project_list">
                <span class="project_title">项目列表</span>
                <div class="project_menu">
                    <span class="project_name" v-for="(item,index) in filterProjectList" :key="index" @click="selectProject(false,index)">
                            <p>{{item.name}}</p>
                            <icon-font type="spm-icon-xuanze" class="project_choose" v-if="!defaultSelect&&index === projectSelectIndex"></icon-font>
                        </span>
                </div>
            </div>
        </div>
        <div class="create" v-show="taskCreateShow">
            <div class="create_title_wrap">
                <icon-font type="spm-icon-xuanze" class="return_btn" @click="returnTaskSelect"></icon-font>
                <span class="create_title">创建项目</span>
                <icon-font type="spm-icon-guanbi" class="close_btn" @click="closeTaskSelect"></icon-font>
            </div>
            <div class="form">
                <a-form :form="form" @submit="handleSubmit">
                    <a-form-item class="submit_item">
                        <a-input v-decorator="['note',{rules: [{ required: true, message: '请输入项目名称!' }]}]" placeholder="项目名称(必填)"/>
                    </a-form-item>
                    <span class="submit_title">项目公开性</span>
                    <a-form-item class="submit_item">
                        <a-select v-decorator="['gender',{rules: [{ message: '请选择项目类型!' }]}]" placeholder="请选择项目类型" allowClear>
                            <a-select-option value="1">
                                企业项目
                            </a-select-option>
                            <a-select-option value="2">
                                私有项目
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item class="submit_btn">
                        <a-button type="primary" html-type="submit">
                            创建
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
        <div class="mask" v-show="taskMaskShow"></div>
    </div>
</template>

<script>
export default {
    name: "TaskSelect",
    components: {},
    props: ['propsData'],
    data() {
        return {
            taskShow: false,
            taskSelectShow: false,
            taskCreateShow: false,
            taskMaskShow: false,
            title: '金控项目',
            searchProjectName: '',
            defaultProjectName: 'XXXXXXXXXXXXXXXXX项目',
            defaultSelect: false,
            projectSelectIndex: null,
            projectList: [{
                    name: 'XXXXXXXXXXXXXXXXX项目',
                    id: 111
                },
                {
                    name: 'XXXX测试项目',
                    id: 222
                },
                {
                    name: '无二级群殴级',
                    id: 1333
                },
            ],
            form: this.$form.createForm(this),
        };
    },
    computed: {
        // 模糊搜索
        filterProjectList: function() {
            let key = this.searchProjectName
            let dataList = this.projectList
            this.defaultSelect = false
            this.projectSelectIndex = null
            return dataList.filter(function(item) {
                return item.name.toLowerCase().indexOf(key.toLowerCase()) != -1
            })
        }
    },
    created() {},
    mounted() {},
    watch: {},
    methods: {
        // 清空输入框
        emitEmpty() {
            this.$refs.projectNameInput.focus()
            this.searchProjectName = ''
            this.defaultSelect = false
            this.projectSelectIndex = null
        },
        // 选择项目
        selectProject(o, i) {
            this.defaultSelect = o
            if (o) {
                // 选择默认项目
                this.projectSelectIndex = null
            } else {
                // 选择新增项目
                this.projectSelectIndex = i
            }
        },
        // 打开新增项目
        createProjectAction() {
            this.form = this.$form.createForm(this)
            this.taskCreateShow = this.taskMaskShow = true
        },
        // 返回选择项目
        returnTaskSelect() {
            this.taskCreateShow = this.taskMaskShow = false
            this.taskShow = this.taskSelectShow = true
        },
        // 打开选择项目
        openTaskSelect() {
            console.log(this.propsData)
            this.taskMaskShow = this.taskCreateShow = false
            this.taskShow = this.taskSelectShow = true
        },
        // 关闭选择项目
        closeTaskSelect() {
            this.taskShow = false
        },
        // 表单提交
        handleSubmit (e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                }
            });
        },
    },
    destroyed() {}
};
</script>

<style lang="scss">
#TaskSelect {
    position: absolute;
    top:50px;
    left: 15px;
    width: 280px;
    height: 420px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    z-index: 10;
    .select {
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        height: 420px;
        z-index: 20;
        .select_title_warp {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 280px;
            height: 50px;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(238, 238, 238, 1);
            padding: 0 20px;
            .select_title {
                font-size: 18px;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
            }
            .close_btn {
                cursor: pointer;
                font-size: 22px;
            }
        }
        .search_warp {
            width: 240px;
            height: 30px;
            margin: 20px 20px 15px 20px;
            .anticon-close-circle {
                cursor: pointer;
                color: #ccc;
                transition: color 0.3s;
                font-size: 12px;
            }
            .anticon-close-circle:hover {
                color: #999;
            }
            .anticon-close-circle:active {
                color: #666;
            }
        }
        .add_btn_wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 240px;
            height: 34px;
            margin: 0 20px;
            background: rgba(234, 111, 70, .1);
            font-size: 14px;
            font-weight: 400;
            color: rgba(234, 111, 70, 1);
            cursor: pointer;
            .add_btn {
                margin-right: 6px;
            }
        }
        .default_project {
            display: flex;
            flex-direction: column;
            padding: 0 20px;
            box-sizing: border-box;
            margin-top: 20px;
            .project_name {
                display: flex;
                justify-content: space-between;
                width: 220px;
                margin-top: 10px;
                height: 20px;
                line-height: 20px;
                cursor: pointer;
                p {
                    width: 200px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .project_title {
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            font-weight: 400;
            color: rgba(156, 156, 156, 1);
        }
        .project_list {
            display: flex;
            flex-direction: column;
            height: 180px;
            padding: 0 20px;
            margin-top: 20px;
            box-sizing: border-box;
            overflow: hidden;
            .project_menu {
                width: 100%;
                height: 170px;
                margin-top: 10px;
                box-sizing: border-box;
                overflow-y: auto;
                cursor: pointer;
                .project_name {
                    display: flex;
                    justify-content: space-between;
                    width: 220px;
                    margin-bottom: 10px;
                    height: 20px;
                    line-height: 20px;
                    p {
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .project_menu::-webkit-scrollbar {
                display: none;
            }
        }
        .project_list:hover {
            .project_menu::-webkit-scrollbar {
                display: block;
            }
        }
        .project_choose {
            color: #ea6f46;
            font-size: 18px;
        }
    }
    .create {
        position: absolute;
        top: 0;
        left: 0;
        width: 280px;
        background: rgba(255, 255, 255, 1);
        z-index: 40;
        .create_title_wrap {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 280px;
            height: 50px;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(238, 238, 238, 1);
            padding: 0 20px;
            .create_title {
                font-size: 18px;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
            }
            .close_btn,
            .return_btn {
                cursor: pointer;
                font-size: 22px;
            }
        }
        .form {
            width: 240px;
            margin: 20px 20px 15px 20px;
            .submit_item{
                height: 50px;
                margin: 0;
            }
            .submit_btn{
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
            }
            .submit_title{
                display: flex;
                align-items: center;
                height: 30px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 1);
            }
        }
    }
    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        z-index: 30;
    }
}
</style>
