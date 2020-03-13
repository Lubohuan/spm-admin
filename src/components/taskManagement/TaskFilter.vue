/**
* @Author: zmm
* @Date: 2019/8/12
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/16
**/
<comment>
    # 组件注释
    // 调用
    <taskFilter ref="taskFilter" />
    // 显示组件
    this.$refs.taskFilter.openTaskFilter()
</comment>
<template>
    <div id="TaskFilter" v-if="taskShow">
        <div class="filter">
            <div class="filter_title_warp">
                <span class="filter_title">筛选</span>
                <icon-font type="spm-icon-guanbi" class="close_btn" @click="closeTaskFilter"></icon-font>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">展示方式</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.showType" @change="showTypeChange">
                        <a-select-option v-for="(item,index) in showType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">排序</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.sortType" @change="sortChange">
                        <a-select-option v-for="(item,index) in sortType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="second_menu">筛选</div>
            <div class="filter_item">
                <span class="filter_item_title">创建人</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.createType" @change="createChange">
                        <a-select-option v-for="(item,index) in createType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">负责人</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.inChargeType" @change="inChargeChange">
                        <a-select-option v-for="(item,index) in inChargeType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">执行人</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.executingType" @change="executingChange">
                        <a-select-option v-for="(item,index) in executingType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">抄送人</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.ccType" @change="ccChange">
                        <a-select-option v-for="(item,index) in ccType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item">
                <span class="filter_item_title">时间节点</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.timeType" @change="timeChange">
                        <a-select-option v-for="(item,index) in timeType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="filter_item" v-if="completeShow">
                <span class="filter_item_title">是否完成</span>
                <div class="filter_item_content">
                    <a-select v-model="filterOption.completeType" @change="completeChange">
                        <a-select-option v-for="(item,index) in completeType" :key="index" :value="item.value">{{item.label}}</a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="reset_btn">
                <icon-font type="spm-icon-shouqicopy" class="reset" @click="resetFilter"></icon-font>
                <span class="action" @click="resetFilter">重置</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "TaskFilter",
    components: {},
    props: [],
    data() {
        return {
            taskShow: false,
            form: this.$form.createForm(this),
            completeShow:true,
            filterOption:{
                showType:null,
                sortType:null,
                createType:null,
                inChargeType:null,
                executingType:null,
                ccType:null,
                timeType:null,
                completeType:null
            },
            showType:[
                {
                    value:1,
                    label:'看板视图'
                },{
                    value:2,
                    label:'列表视图'
                }
            ],
            sortType:[
                {
                    value:1,
                    label:'按创建时间最早'
                },{
                    value:2,
                    label:'按创建时间最晚'
                }
                ,{
                    value:3,
                    label:'按开始时间最早'
                }
                ,{
                    value:4,
                    label:'按开始时间最晚'
                }
                ,{
                    value:5,
                    label:'按截止时间最早'
                },{
                    value:6,
                    label:'按截止时间最晚'
                },{
                    value:7,
                    label:'按优先级'
                }
            ],
            createType:[
                {
                    value:1,
                    label:'全部'
                }
            ],
            inChargeType:[
                {
                    value:1,
                    label:'全部'
                }
            ],
            executingType:[
                {
                    value:1,
                    label:'全部'
                }
            ],
            ccType:[
                {
                    value:1,
                    label:'全部'
                }
            ],
            timeType:[
                {
                    value:1,
                    label:'今日'
                },{
                    value:2,
                    label:'本周'
                },{
                    value:3,
                    label:'本月'
                },{
                    value:4,
                    label:'全部'
                }
            ],
            completeType:[
                {
                    value:1,
                    label:'全部'
                },{
                    value:2,
                    label:'已完成'
                },{
                    value:3,
                    label:'未完成'
                }
            ]
        };
    },
    computed: {},
    created() {},
    mounted() {
        this.filterOption = {
            showType:1,
            sortType:1,
            createType:1,
            inChargeType:1,
            executingType:1,
            ccType:1,
            timeType:1,
            completeType:1
        }
    },
    watch: {},
    methods: {
        // 打开筛选
        openTaskFilter(type) {
            // 1 所有任务
            // 2 今日任务
            // 3 未完成任务
            // 4 已完成任务
            // 5 已逾期任务
            // 6 逾期已完成任务
            // 7 我创建的任务
            // 8 我负责的任务
            // 9 抄送我的任务

            // 点击全局筛选中的“未完成的任务”、“已完成的任务”、“逾期已完成的任务”右上方的筛选中不显示“是否完成”筛选项
            // 点击全局筛选中的“我创建的任务”右上方的筛选创建人选项中只有本人的姓名选项无其他选项
            // 点击全局筛选中的“我负责的任务”右上方的筛选负责人选项中只有本人的姓名选项无其他选项
            // 点击全局筛选中的“抄送我的任务”右上方的筛选抄送人选项中只有本人的姓名选项无其他选项
            // 点击全局筛选的任意筛选项，该筛选项呈选中状态，同时任务以列表的形式展示，列表表头：
            //      任务总数：该筛选条件下的任务总数（共xx个任务），对应的列表中显示该任务的负责人名字头像、任务标签与任务标题（标题的字数限制以UI给到的为准）
            //      时间：该筛选条件下的任务的开始时间-结束时间（年月日时分-年月日时分）
            //      从属关系：该筛选条件下的任务所属项目所属任务分类所属任务分组
            this.completeShow = true
            if(type === 3 || type === 4 || type === 6){
                this.completeShow = false
            }else if(type === 7){
                // 点击全局筛选中的“我创建的任务”右上方的筛选创建人选项中只有本人的姓名选项无其他选项
            }else if(type === 8){
                // 点击全局筛选中的“我负责的任务”右上方的筛选负责人选项中只有本人的姓名选项无其他选项
            }else if(type === 9){
                // 点击全局筛选中的“抄送我的任务”右上方的筛选抄送人选项中只有本人的姓名选项无其他选项
            }
            this.taskShow = true
        },
        // 关闭选择项目
        closeTaskFilter() {
            this.taskShow = false
            this.$emit('closeTaskFilterAction')
        },
        // 展示方式筛选
        showTypeChange(e){
            this.filterOption.showType = e
            this.submitRequest()
        },
        // 排序方式筛选
        sortChange(e){
            this.filterOption.sortType = e
            this.submitRequest()
        },
        // 创建人式筛选
        createChange(e){
            this.filterOption.createType = e
            this.submitRequest()
        },
        // 负责人方式筛选
        inChargeChange(e){
            this.filterOption.inChargeType = e
            this.submitRequest()
        },
        // 执行人方式筛选
        executingChange(e){
            this.filterOption.executingType = e
            this.submitRequest()
        },
        // 抄送人方式筛选
        ccChange(e){
            this.filterOption.ccType = e
            this.submitRequest()
        },
        // 时间方式筛选
        timeChange(e){
            this.filterOption.timeType = e
            this.submitRequest()
        },
        // 完成方式筛选
        completeChange(e){
            this.filterOption.completeType = e
            this.submitRequest()
        },
        // 重置筛选
        resetFilter(){
            this.filterOption = {
                showType:1,
                sortType:1,
                createType:1,
                inChargeType:1,
                executingType:1,
                ccType:1,
                timeType:1,
                completeType:1
            }
            this.submitRequest()
        },
        // 确定筛选 发送请求
        submitRequest(){
            this.$emit('taskFilter',this.filterOption)
        }
    },
    destroyed() {}
};
</script>

<style lang="scss">
#TaskFilter {
    position: absolute;
    top:50px;
    right: 15px;
    width: 280px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    z-index: 10;
    .filter {
        width: 280px;
        box-sizing: border-box;
        .filter_title_warp {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 280px;
            height: 50px;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(238, 238, 238, 1);
            padding: 0 20px;
            .filter_title {
                font-size: 18px;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
            }
            .close_btn {
                cursor: pointer;
                font-size: 22px;
            }
        }
        .filter_item{
            padding: 0 20px;
            margin-top: 20px;
            .filter_item_title{
                display: block;
                font-size:14px;
                font-weight:400;
                color:rgba(48,48,48,1);
            }
            .filter_item_content{
                width: 240px;
                height: 30px;
                margin-top: 10px;
                .ant-select{
                    width: 100%;
                }
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
        }
        .second_menu{
            font-size:14px;
            padding: 20px 0 0 20px;
            box-sizing: border-box;
            font-weight:400;
            color:rgba(234,111,70,1);
        }
        .reset_btn{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding-left: 20px;
            margin: 20px 0;
            font-size:14px;
            font-weight:400;
            color:rgba(234,111,70,1);  
            .reset{
                font-size: 25px;
                cursor: pointer;
            }
            .action{
                cursor: pointer;
            }
        }
    }
}
</style>
