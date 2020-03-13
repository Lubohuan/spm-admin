/**
* @Author: 李晨光
* @Date: 2019/7/3
* @Version: 1.0
* @Last Modified by: 李晨光
* @Last Modified time: 2019/7/3
**/
<comment>
    # 组件注释
</comment>
<template>
  <div class="container">
    <a-card class="m-20">
      <button @click="isActive = !isActive">展开/折叠</button>
      <collapse>
        <div v-show="isActive">
          <div style="border:1px solid #ddd;padding:10px;">
            <h2>欢迎大家品尝Pizza!</h2>
            <h5>这里有你非常喜欢的Pizza!</h5>
          </div>
        </div>
      </collapse>
    </a-card>
    <a-card class="m-20">
      <a-table :columns="columns" :dataSource="data" bordered :pagination="false">
        <a slot="action" slot-scope="text" href="javascript:;">action</a>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import collapse from "#/assets/js/collapse.js";
import Pagination from '@/Pagination';
export default {
  data() {
    return {
      isActive: true,
      columns: [
        {
          title: "Full Name",
          width: 100,
          dataIndex: "name",
          key: "name",
          fixed: "left"
        },
        {
          title: "Age",
          width: 100,
          dataIndex: "age",
          key: "age",
          fixed: "left"
        },
        { title: "Column 1", dataIndex: "address", key: "1", width: 150 },
        { title: "Column 2", dataIndex: "address", key: "2", width: 150 },
        { title: "Column 3", dataIndex: "address", key: "3", width: 150 },
        { title: "Column 4", dataIndex: "address", key: "4", width: 150 },
        { title: "Column 5", dataIndex: "address", key: "5", width: 150 },
        { title: "Column 6", dataIndex: "address", key: "6", width: 150 },
        { title: "Column 7", dataIndex: "address", key: "7", width: 150 },
        { title: "Column 8", dataIndex: "address", key: "8" },
        {
          title: "Action",
          key: "operation",
          fixed: "right",
          width: 100,
          scopedSlots: { customRender: "action" }
        }
      ],
      data: [
        {
          name: 'Edrward1',
          age: 32,
          address: 'London Park no1'
        },
        {
          name: 'Edrward2',
          age: 32,
          address: 'London Park no2'
        },
        {
          name: 'Edrward3',
          age: 32,
          address: 'London Park no3'
        },
      ]
    };
  },
  components: {
    collapse
  }
};
</script>
