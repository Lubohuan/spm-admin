# spm-admin

#### 介绍
spm项管家主平台

#### 软件架构
软件架构: vue + ant-design-vue
```javascript
项目结构

|-- build                            // 项目构建(webpack)相关代码
|   |-- build.js                     // 生产环境构建代码
|   |-- check-version.js             // 检查node、npm等版本
|   |-- utils.js                     // 构建工具相关
|   |-- vue-loader.conf.js           // webpack loader配置
|   |-- webpack.base.conf.js         // webpack基础配置
|   |-- webpack.dev.conf.js          // webpack开发环境配置,构建开发本地服务器
|   |-- webpack.prod.conf.js         // webpack生产环境配置
|-- config                           // 项目开发环境配置
|   |-- dev.env.js                   // 开发环境变量
|   |-- index.js                     // 项目一些配置变量
|   |-- prod.env.js                  // 生产环境变量
|-- src                              // 源码目录
|   |-- assets                   	 // 静态文件
|   |   |-- css                   	 // 静态文件css
|   |   |-- js                   	 // 静态文件js
|   |   |-- image                  	 // 静态文件image
|   |   |-- font                   	 // 静态文件font
|   |-- components                   // vue公共组件
|   |-- views                   	 // vue页面
|   |-- vuex                   	 	 // vuex
|   |-- router                       // vue的路由管理
|   |-- App.vue                      // 页面入口文件
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|-- static                           // 静态文件，比如一些图片，json数据等
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 定义代码格式
|-- .gitignore                       // git上传需要忽略的文件格式
|-- .postcsssrc                      // postcss配置文件
|-- README.md                        // 项目说明
|-- index.html                       // 入口页面
|-- package.json                     // 项目基本信息,包依赖信息等

```

#### 安装教程

## Build Setup
``` bash
# install dependencies 建议使用yarn安装
npm install -g yarn

yarn (install)

# serve with hot reload at localhost:8080
yarn run dev

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report

#这里是npm与yarn区别 
https://newsn.net/say/yarn-vs-npm.html
```

#### 使用说明
```vue

页面布局请使用 Skeleton 加载占位图，保证页面数据加载等待的时候的布局完整性
具体使用  https://vue.ant.design/components/skeleton-cn/

1. ant-design-vue框架地址https://vue.ant.design/docs/vue/introduce-cn/
2. ant-design-pro-vue https://gitee.com/sendya/ant-design-pro-vue
3. 轮播组件vue-awesome-swiper（基于swiper） https://segmentfault.com/a/1190000014609379，其中属性方法与swiper一致
  
      <swiper :options="swiperOption">
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
        <swiper-slide><img src="static/images/jay.jpg"></swiper-slide>
      </swiper>
      <!--以下看需要新增-->
      <div class="swiper-scrollbar"></div> //滚动条
      <div class="swiper-button-next"></div> //下一项
      <div class="swiper-button-prev"></div> //上一项
      <div class="swiper-pagination"></div> //标页码
      /*组件方式引用*/
      <script>
          import 'swiper/dist/css/swiper.css'////这里注意具体看使用的版本是否需要引入样式，以及具体位置。
          import { swiper, swiperSlide } from 'vue-awesome-swiper'
          export default {
            components: {
              swiper,
              swiperSlide
            },
            data(){
              return{
                swiperOption: {//swiper3
                autoplay: 3000,
                speed: 1000,
                }
              }
            }
          }
      </script>
      
4. 二维码生成qrcode https://www.npmjs.com/package/qrcode

   <canvas id="canvas"></canvas>
   
   <script>
      import QRCode from 'qrcode'
      export default {
         created() {
          QRCode.toDataURL('I am a pony!')
            .then(url => {
              console.log(url)
            })
            .catch(err => {
              console.error(err)
            })
         }      
      }
   
   </script>
  
   ```
#### git
```javascript
1. 项目分主分支master（生产环境）与dev分支（测试环境）
2. 开发者需要自己新建分支，分支名为开发者名字拼音
3. 测试环境
   将自己的开发分支合并到dev分支发布
4. 生产环境
   将dev分支合并到master分支发布
```
