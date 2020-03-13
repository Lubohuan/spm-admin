/**
 * Created by pc on 2018/6/19.
 */
const state = {
  color: '#E1673A',//主题色
  token: '',
  login_msg:{},//登录信息
  route:'',//当前路由
  open_keys:[],//当前菜单展开项
  curr_tenant: {//当前租户
    name:'未知'
  },
  curr_org: {//当前组织
    name:'未知'
  },
  loading_finish: false,
  collections: [], // 收藏
  citys: [], // 省市数据
  resources: [], // 导航资源
  dicts: [], // 字典
}
export default state
