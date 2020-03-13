#文件目录说明
```vue

|-- components                        // 组件
|   |-- Pagination.vue                  // 分页器
|   |-- Title.vue                   	  // 页面内容区头部
|   |-- exception                       // error组件
|   |   |-- ExceptionPage.vue
|   |-- layouts                       // 布局组件
|   |   |-- BasicDrawer.vue             //左侧导航
|   |   |-- BasicToolbar.vue            //上栏菜单
|   |-- loading                       // loading加载组件
|   |   |-- Loading.vue
|   |   |-- index.js
|   |-- menu                          // menu组件
|   |   |-- NavMenu.vue
|   |   |-- SubMenu.vue                 //SubMenu导航组件（结合a-menu使用）
|   |   |-- UserMenu.vue                //用户中心组件
|   |   |-- BasicMenuSave.vue           //收藏菜单组件
|   |   |-- BasicMenuList.vue           //菜单列表组件
|   |-- themeColor                    // 全局更换主题组件
|   |   |-- defaultSettings.js
|   |   |-- settingConfig.js
|   |   |-- theme.scss
|   |   |-- ThemeColor.vue
|   |   |-- var.scss
|   |-- taskManagement                    // 项管家-任务管理组件
|   |   |--TaskClassify.vue                 //任务分类组件
|   |   |--TaskSelect.vue                   //选择项目组件
|   |   |--TaskFilter.vue                   //项目筛选组件
|   |   |--TableLists.vue                   //任务列表组件
|   |   |--
|   |   |--

```

#分页器组件
属性
````
名称         描述        参数类型       默认值
pageSize   每页条数      Number         10
current    当前页码      Number         1
total      数据总数      Number         10
````
用法
```vue

  <template>
    <Pagination
      :total="pagination.totalCount"
      :pageSize="pagination.pageSize"
      :current="pagination.pageNo"
      @onChange = "onChangePage"
      @onShowSizeChange="onShowSizeChangePage">
    </Pagination>
  </template>

  <script>
    import Pagination from '@/Pagination'
    export default {
      components: { Pagination },
      data() {
          return {
            pagination: {
              pageNo: 1,
              pageSize: 10,
              totalCount: 29
            },
          }
      },
      methods: {
        // 页数变化回调
        onChangePage (pageNo, pageSize) {
          this.pagination.pageNo = pageNo
          // 重新请求数据
        },
        // 每页条数变化回调
        onShowSizeChangePage (pageNo, pageSize) {
          this.pagination.pageSize = pageSize
          // 重新请求数据
        },
      }
    }
  </script>

```
#全局loading组件
用法
```vue
  <script>
    export default {
      methods: {
        load () {
          //loading显示
         this.$loading.show('loading')
         setTimeout(() => {
           //loading隐藏
           this.$loading.hide('loading')
         }, 5000)
        },
      }
    }
  </script>

```
