/**
* @Author: zmm
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: zmm
* @Last Modified time: 2019/8/9
**/
<comment>
    # 组件注释
</comment>
<template>
	<div id="ZhangMeng">
		<a-button type="primary" @click="openTask">打开选择项目</a-button>
		<a-button type="primary" @click="openFilter">打开筛选</a-button>

		<taskSelect ref="taskSelect" :propsData="propsData"></taskSelect>
		<taskFilter ref="taskFilter" />
	</div>
</template>

<script>
import taskSelect from '@/taskManagement/TaskSelect'
import taskFilter from '@/taskManagement/TaskFilter'
export default {
	name: "ZhangMeng",
	components: {
		taskSelect,
		taskFilter
	},
	props: {},
	data() {
		return {
			propsData:10,
		};
	},
	computed: {},
	created() {},
	mounted() {},
	watch: {},
	methods: {
		openTask() {
			this.$refs.taskSelect.openTaskSelect()
		},
		openFilter(){
			this.$refs.taskFilter.openTaskFilter()
		}
	},
	destroyed() {}
};
</script>

<style lang="scss">

</style>
