#文件目录说明
```vue

|-- directive                        // 指令
|   |-- loading                   	  // loading指令
|   |   |-- loading.directive.js      
|   |   |-- loading.scss              
|   |-- waves                         // 点击水波纹指令
|   |   |-- waves.directive.js         
|   |   |-- waves.scss                 

```

#点击水波纹效果指令
#属性
````
名称      描述          参数类型                                默认值
type   水波纹效果类型    String{hit(点击点),center(中心点)}    hit(点击点)
color  水波纹效果颜色    String                              rgba(0, 0, 0, 0.15)
````

```vue

<template>
  基础用法
  <a-button class="m-l-10" v-waves>
   <icon-font type="spm-icon-cloud-download"></icon-font>
   导 入
  </a-button>
  
  改变颜色
  
  <a-button class="m-l-10" v-waves = "{ color : '#f99'}">
   <icon-font type="spm-icon-cloud-download"></icon-font>
   导 入
  </a-button>
  
  改变类型
  
  <a-button class="m-l-10" v-waves = "{ type : 'center'}">
   <icon-font type="spm-icon-cloud-download"></icon-font>
   导 入
  </a-button>
  
  改变类型颜色
    
  <a-button class="m-l-10" v-waves = "{ type : 'center', color : '#f99'}">
   <icon-font type="spm-icon-cloud-download"></icon-font>
   导 入
  </a-button>
</template>

```

#loading效果指令


```vue
#基础用法
<template>
  <div v-myloading = 'loading'></div>
</template>

export default {
  data() {
      return {
        loading:true
      }
  }
}
```
