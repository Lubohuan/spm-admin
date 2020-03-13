import Vue from 'vue'
import Router from 'vue-router'
// import Main from '@/layouts/DefaultLayout'
import Main from '#/views/BasicLayout'
import IframeRouter from '#/views/IframeRouter'
import Login from '#/views/Login'

export const publicRoute = [
  { path: "*", component: () => import(/* webpackChunkName: "errors-404" */ "#/views/error/404.vue") },
  {
    path: "/404",
    name: "404",
    meta: { title: "Not Found" },
    component: () => import(/* webpackChunkName: "errors-404" */ "#/views/error/404.vue")
  },
  {
    path: "/500",
    name: "500",
    meta: { title: "Server Error" },
    component: () => import(/* webpackChunkName: "errors-500" */ "#/views/error/500.vue")
  },
  {
    path: "/403",
    name: "403",
    meta: { title: "Server Error" },
    component: () => import(/* webpackChunkName: "errors-403" */ "#/views/error/403.vue")
  }
]
export const protectedRoute = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/loginByAdmin',
    name: 'LoginByAdmin',
    component: () => import(/* webpackChunkName: "管理员登录" */ "#/views/LoginByAdmin")
  },
  {
    path: '/forgotPwd',
    name: 'ForgotPwd',
    component: () => import(/* webpackChunkName: "忘记密码" */ "#/views/ForgotPwd")
  },
  {
    path: '/main',
    name: 'Main',
    component: Main,
    children: [
      {
        path: '/main/home',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ "#/views/home/Home.vue")
      },
      {
        path: '/changePwd',
        name: 'ChangePwd',
        component: () => import(/* webpackChunkName: "修改密码" */ "#/views/ChangePwd")
      },
      {
        path: '/userInfo',
        name: 'UserInfo',
        component: () => import(/* webpackChunkName: "个人信息" */ "#/views/UserInfo"),
        meta: {
          name: '个人信息'
        }
      },
      {
        path: '/main/app',
        name: 'App',
        component: IframeRouter
      },
      {
        path: '/main/test',
        name: 'Test',
        component: () => import(/* webpackChunkName: "test" */ "#/views/test/Test.vue"),
        children: [
          {
            path: '/main/test/lichenguang',
            name: 'LiChenGuang',
            component: () => import(/* webpackChunkName: "lichenguang" */ "#/views/test/lichenguang/LiChenGuang"),
            children: [
              {
                path: '/main/test/lichenguang/tableTemplate',
                name: 'TableTemplate',
                component: () => import(/* webpackChunkName: "lichenguang" */ "#/views/test/lichenguang/TableTemplate")
              },
              {
                path: '/main/test/lichenguang/baseComponents',
                name: 'BaseComponents',
                component: () => import(/* webpackChunkName: "lichenguang" */ "#/views/test/lichenguang/BaseComponents")
              }
            ]
          },
          {
            path: '/main/test/huling',
            name: 'HuLing',
            component: () => import(/* webpackChunkName: "huling" */ "#/views/test/huling/HuLing")
          },
          {
            path: '/main/test/hejingchun',
            name: 'HeJingChun',
            component: () => import(/* webpackChunkName: "hejingchun" */ "#/views/test/hejingchun/HeJingChun")
          },
          {
            path: '/main/test/lanwenliang',
            name: 'LanWenLiang',
            component: () => import(/* webpackChunkName: "lanwenliang" */ "#/views/test/lanwenliang/LanWenLiang")
          },
          {
            path: '/main/test/liupan',
            name: 'LiuPan',
            component: () => import(/* webpackChunkName: "liupan" */ "#/views/test/liupan/LiuPan")
          },
          {
            path: '/main/test/liuyiwei',
            name: 'LiuYiWei',
            component: () => import(/* webpackChunkName: "liuyiwei" */ "#/views/test/liuyiwei/LiuYiWei")
          },
          {
            path: '/main/test/lubohuan',
            name: 'LuBoHuan',
            component: () => import(/* webpackChunkName: "lubohuan" */ "#/views/test/lubohuan/LuBoHuan")
          },
          {
            path: '/main/test/zhangmeng',
            name: 'ZhangMeng',
            component: () => import(/* webpackChunkName: "zhangmeng" */ "#/views/test/zhangmeng/ZhangMeng")
          },
        ]
      },
      {
        path: '/main/projectHousekeeper',
        name: 'ProjectHousekeeper',
        component: () => import(/* webpackChunkName: 项目管家*/ "#/views/projectHousekeeper/ProjectHousekeeper"),
        children: [
          {
            path: '/main/projectHousekeeper/taskManagement',
            name: 'TaskManagement',
            component: () => import(/* webpackChunkName: "任务管理" */ "#/views/projectHousekeeper/taskManagement/TaskManagement")
          },
          {
            path: '/main/projectHousekeeper/telBook',
            name: 'TelBook',
            component: () => import(/* webpackChunkName: "通讯录" */ "#/views/projectHousekeeper/telBook/TelBook")
          }
        ]
      },
      {
        path: '/main/tenant',
        name: 'Tenant',
        component: () => import(/* webpackChunkName: "租户中心" */ "#/views/tenant/Index"),
        children: [
          {
            path: '/main/tenant/tenantManage',
            name: 'TenantManage',
            component: () => import(/* webpackChunkName: "租户管理" */ "#/views/tenant/tenantManage/TenantManage"),
            meta: {
              name: '租户管理'
            },
          },
          {
            path: '/main/tenant/tenantSuperAdmin',
            name: 'TenantSuperAdmin',
            component: () => import(/* webpackChunkName: "租户超管管理" */ "#/views/tenant/tenantSuperAdmin/TenantSuperAdmin"),
            meta: {
              name: '租户超管管理'
            },
          },
          {
            path: '/main/tenant/tenantConfig',
            name: 'TenantConfig',
            component: () => import(/* webpackChunkName: "租户超管管理" */ "#/views/tenant/tenantConfig/TenantConfig"),
            meta: {
              name: '租户配置管理'
            },
          },
          {
            path: '/main/tenant/tenantAppLicense',
            name: 'TenantAppLicense',
            component: () => import(/* webpackChunkName: "租户应用授权" */ "#/views/tenant/tenantAppLicense/TenantAppLicense"),
            meta: {
              name: '租户应用授权'
            },
          }
        ]
      },
      {
        path: '/main/organization',
        name: 'Organization',
        component: () => import(/* webpackChunkName: "组织中心" */ "#/views/organization/Index"),
        children: [
          {
            path: '/main/organization/baseOrg',
            name: 'BaseOrg',
            component: () => import(/* webpackChunkName: "基础组织" */ "#/views/organization/baseOrg/BaseOrg"),
            meta: {
              name: '基础组织'
            },
          },
          {
            path: '/main/organization/projectOrg',
            name: 'ProjectOrg',
            component: () => import(/* webpackChunkName: "项目部" */ "#/views/organization/projectOrg/ProjectOrg"),
            meta: {
              name: '项目部'
            },
          },
          {
            path: '/main/organization/department',
            name: 'Department',
            component: () => import(/* webpackChunkName: "部门管理" */ "#/views/organization/department/Department"),
            meta: {
              name: '部门管理'
            },
          },
          {
            path: '/main/organization/postDict',
            name: 'PostDict',
            component: () => import(/* webpackChunkName: "岗位词典管理" */ "#/views/organization/postDict/PostDict"),
            meta: {
              name: '岗位字典管理'
            },
          },
          {
            path: '/main/organization/post',
            name: 'Post',
            component: () => import(/* webpackChunkName: "岗位管理" */ "#/views/organization/post/Post"),
            meta: {
              name: '岗位管理'
            },
          }
        ]
      },
      {
        path: '/main/user',
        name: 'User',
        component: () => import(/* webpackChunkName: "用户中心" */ "#/views/user/Index"),
        children: [
          {
            path: '/main/user/accountManage',
            name: 'AccountManage',
            component: () => import(/* webpackChunkName: "账户管理" */ "#/views/user/accountManage/AccountManage"),
            meta: {
              name: '账户管理'
            },
          },
          {
            path: '/main/user/userManage',
            name: 'UserManage',
            component: () => import(/* webpackChunkName: "人员管理" */ "#/views/user/userManage/UserManage"),
            meta: {
              name: '人员管理'
            },
          }
        ]
      },
      {
        path: '/main/appKey',
        name: 'AppKey',
        component: () => import(/* webpackChunkName: "产品密钥管理" */ "#/views/appKey/AppKeyManage.vue"),
        meta: {
          name: '产品秘钥管理'
        },
      },
      {
        path: '/main/role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "角色中心" */ "#/views/tenant/Index"),
        children: [
          {
            path: '/main/role/roleManage',
            name: 'RoleManage',
            component: () => import(/* webpackChunkName: "角色管理" */ "#/views/role/roleManage/RoleManage"),
            meta: {
              name: '角色管理'
            },
          },
          {
            path: '/main/role/roleAppLicense',
            name: 'RoleAppLicense',
            component: () => import(/* webpackChunkName: "角色授权" */ "#/views/role/roleAppLicense/RoleAppLicense"),
            meta: {
              name: '角色授权'
            },
          },
          {
            path: '/main/role/appLicenseScope',
            name: 'AppLicenseScope',
            component: () => import(/* webpackChunkName: "管理员授权范围限定" */ "#/views/role/appLicenseScope/AppLicenseScope"),
            meta: {
              name: '管理员授权范围限定'
            },
          },
        ]
      },
      {
        path: '/main/participateInConstruction',
        name: 'ParticipateInConstruction',
        component: () => import(/* webpackChunkName: "参建单位" */ "#/views/participateInConstruction/Index"),
        children: [
          {
            path: '/main/participateInConstruction/particInConstrManage',
            name: 'ParticInConstrManage',
            component: () => import(/* webpackChunkName: "项目参建单位" */ "#/views/participateInConstruction/particInConstrManage/ParticInConstrManage"),
            meta: {
              name: '项目参建单位'
            },
          },
          {
            path: '/main/participateInConstruction/personManage',
            name: 'PersonManage',
            component: () => import(/* webpackChunkName: "参建单位人员管理" */ "#/views/participateInConstruction/person/PersonManage"),
            meta: {
              name: '参建单位人员管理'
            },
          },
          {
            path: '/main/participateInConstruction/record',
            name: 'Record',
            component: () => import(/* webpackChunkName: "参建单位" */ "#/views/participateInConstruction/record/Record"),
            meta: {
              name: '参建单位'
            },
          }

        ]
      },
      {
        path: '/main/basicBusinessConfig',
        name: 'BasicBusinessConfig',
        component: () => import(/* webpackChunkName: "基础业务配置" */ "#/views/basicBusinessConfig/Index"),
        children: [
          {
            path: '/main/basicBusinessConfig/generalFileDefinition',
            name: 'GeneralFileDefinition',
            component: () => import(/* webpackChunkName: "业务档案模型" */ "#/views/basicBusinessConfig/generalFileDefinition/GeneralFileDefinition"),
            meta: {
              name: '业务档案模型',
              keepAlive: true //此组件需要被缓存
            },
            children: [

            ]
          },
          {
            path: '/main/basicBusinessConfig/listCommon',
            name: 'ListCommon',
            component: () => import(/* webpackChunkName: "数据字典定义-普通列表" */ "#/views/basicBusinessConfig/listCommon/ListCommon"),
            meta: {
              name: '数据字典定义-普通列表'
            },
          },
          {
            path: '/main/basicBusinessConfig/listTree',
            name: 'ListTree',
            component: () => import(/* webpackChunkName: "数据字典定义-树形列表" */ "#/views/basicBusinessConfig/listTree/ListTree"),
            meta: {
              name: '数据字典定义-树形列表'
            },
          },
        ]
      },
      {
        path: '/main/platformOperationManage',
        name: 'PlatformOperationManage',
        component: () => import(/* webpackChunkName: "平台运营管理" */ "#/views/platformOperationManage/Index"),
        children: [
          {
            path: '/main/platformOperationManage/systemAdmin',
            name: 'SystemAdmin',
            component: () => import(/* webpackChunkName: "系统管理员" */ "#/views/platformOperationManage/systemAdmin/SystemAdmin"),
            meta: {
              name: '系统管理员'
            },
          },
        ]
      },
      {
        path: '/main/integration',
        name: 'Integration',
        component: () => import(/* webpackChunkName: "集成中心" */ "#/views/integration/Index"),
        children: [
          {
            path: '/main/integration/appIntegrate',
            name: 'AppIntegrate',
            component: () => import(/* webpackChunkName: "应用集成" */ "#/views/integration/appIntegrate/Index"),
            meta: {
              name: '应用集成'
            },
            children: [
              {
                path: '/main/integration/appIntegrate/appRegistry',
                name: 'AppRegistry',
                component: () => import(/* webpackChunkName: "应用注册" */ "#/views/integration/appIntegrate/AppRegistry"),
                meta: {
                  name: '应用注册',
                  keepAlive: true
                },
              },
              {
                path: '/main/integration/appIntegrate/appRegistry/maintain',
                name: 'Maintain',
                component: () => import(/* webpackChunkName: "维护应用" */ "#/views/integration/appIntegrate/MaintainApp"),
                meta: {
                  name: '维护应用'
                },
              },
            ]
          }
        ]
      },
      {
        path: '/main/projectFile',
        name: 'ProjectFile',
        component: () => import(/* webpackChunkName: "集成中心" */ "#/views/projectFile/Index"),
        children: [
          {
            path: '/main/projectFile',
            component: () => import(/* webpackChunkName: 项目档案--列表*/ "#/views/projectFile/ProjectFile"),
            meta: {
              name: '项目档案',
              keepAlive: true //此组件需要被缓存
            }
          },
          {
            path: '/main/projectFile/addProject',
            name: 'AddProject',
            component: () => import(/* webpackChunkName: 新增项目*/ "#/views/projectFile/AddProject"),
            meta: {
              name: '新增项目'
            }
          },
          {
            path: '/main/projectFile/editProject',
            name: 'editProject',
            component: () => import(/* webpackChunkName: 编辑项目*/ "#/views/projectFile/AddProject"),
            meta: {
              name: '编辑项目'
            }
          },
          {
            path: '/main/projectFile/detailProject',
            name: 'detailProject',
            component: () => import(/* webpackChunkName: 项目详情*/ "#/views/projectFile/AddProject"),
            meta: {
              name: '项目详情'
            }
          },
        ]

      },
      {
        path: '/main/projectWBS',
        name: 'projectWBS',
        component: () => import(/* webpackChunkName: "主页" */ "#/views/projectWBS/Index"),
        children: [
          {
            path: '/main/projectWBS/projectConstructionSection',
            name: 'ProjectConstructionSection',
            component: () => import(/* webpackChunkName: 项目施工区段*/ "#/views/projectWBS/projectConstructionSection/ProjectConstructionSection"),
            meta: {
              name: '项目施工区段',
            }
          },
          {
            path: '/main/projectWBS/subItemTemplate',
            name: 'SubItemTemplate',
            component: () => import(/* webpackChunkName: 分部分项模板*/ "#/views/projectWBS/subItemTemplate/SubItemTemplate"),
            meta: {
              name: '分部分项模板',
              keepAlive: true, //
            }
          },
          {
            path: '/main/projectWBS/subItemTemplate/detail',
            name: 'SubItemTemplateDetail',
            component: () => import(/* webpackChunkName: 分部分项模板编辑*/ "#/views/projectWBS/subItemTemplate/SubItemTempDetail"),
            meta: {
              name: '分部分项模板内容',
            }
          },

          {
            path: '/main/projectWBS/projectSubItem',
            name: 'ProjectSubItem',
            component: () => import(/* webpackChunkName: 项目分部分项*/ "#/views/projectWBS/projectSubItem/ProjectSubItem"),
            meta: {
              name: '项目分部分项',
              keepAlive: false //
            }
          },
          {
            path: '/main/projectWBS/projectWBS',
            name: 'ProjectWBS',
            component: () => import(/* webpackChunkName: 项目wbs*/ "#/views/projectWBS/projectWBS/ProjectWBS"),
            meta: {
              name: '项目WBS',
              keepAlive: false //
            }
          }
        ]
      },
      {
        path: '/main/warningCenter',
        name: 'warningCenter',
        component: () => import(/* webpackChunkName: "主页" */ "#/views/warningCenter/Index"),
        children: [
          {
            path: '/main/warningCenter/warningSettings',
            name: 'WarningSettings',
            component: () => import(/* webpackChunkName: 预警设置*/ "#/views/warningCenter/warningSettings/WarningSettings"),
            meta: {
              name: '预警任务设置',
              keepAlive: true //
            }
          },
          {
            path: '/main/warningCenter/warningLogs',
            name: 'WarningLogs',
            component: () => import(/* webpackChunkName: 预警日志*/ "#/views/warningCenter/warningLogs/WarningLogs"),
            meta: {
              name: '预警日志',
            }
          },
          {
            path: '/main/warningCenter/warningOfMine',
            name: 'WarningOfMine',
            component: () => import(/* webpackChunkName: 我的预警*/ "#/views/warningCenter/warningOfMine/WarningOfMine"),
            meta: {
              name: '我的预警',
              keepAlive: true //
            }
          },
          {
            path: '/main/warningCenter/warningReminderRecord',
            name: 'WarningReminderRecord',
            component: () => import(/* webpackChunkName: 我的预警*/ "#/views/warningCenter/warningReminderRecord/WarningReminderRecord"),
            meta: {
              name: '催办记录',
            }
          },
          {
            path: '/main/warningCenter/warningLedger',
            name: 'WarningLedger',
            component: () => import(/* webpackChunkName: 预警台账*/ "#/views/warningCenter/warningLedger/WarningLedger"),
            meta: {
              name: '预警台账',
              keepAlive: true //
            }
          },
        ]
      },
    ]
  }
]


