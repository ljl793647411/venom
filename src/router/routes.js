// import Home from '../views/home.vue'
// import Driver from '../views/driver.vue'
// import Rest from '../views/rest.vue'
// import Monitor from '../views/monitor.vue'
// import Login from '../views/login.vue'
// import InspectRecord from '../views/inspectRecord.vue'
// import LeaveRecord from '../views/leaveRecord.vue'
// import ChangeShifts from '../views/changeShifts.vue'
// import AbnormalRecord from '../views/abnormalRecord.vue'
// import Leader from '../views/leader.vue'
// import UpdataIp from '../views/updataIp.vue'
// import User from '../views/user.vue'
// import TrainPlan from '../views/trainPlan.vue'
// import RestPlan from '../views/restPlan.vue'


export default [
  {
    path: '/',
    redirect: '/home',
    component: resolve => require(['../views/home.vue'], resolve)
  },
  {
    path: '/login',
    name: '登录页', 
    component: resolve => require(['../views/login.vue'], resolve)
  },
  {
    path: '/home',
    name: '首页',
    component: resolve => require(['../views/home.vue'], resolve)
  },
  {
    path: '/monitor',
    name: '待乘实况',
    component: resolve => require(['../views/monitor.vue'], resolve)
  },
  {
    path: '/driver',
    name: '司机信息',
    component: resolve => require(['../views/driver.vue'], resolve)
  },
  {
    path: '/rest',
    name: '待乘记录',
    component: resolve => require(['../views/rest.vue'], resolve)
  },
  {
    path: '/inspectRecord',
    name: '待乘巡检',
    component: resolve => require(['../views/inspectRecord.vue'], resolve)
  },
  {
    path: '/leaveRecord',
    name: '请销假记录',
    component: resolve => require(['../views/leaveRecord.vue'], resolve)
  },
  {
    path: '/changeShifts',
    name: '交接班',
    component: resolve => require(['../views/changeShifts.vue'], resolve)
  },
  {
    path: '/abnormalRecord',
    name: '异常记录',
    component: resolve => require(['../views/rest.vue'], resolve)
  },
  {
    path: '/leader',
    name: '干部管理',
    component: resolve => require(['../views/abnormalRecord.vue'], resolve)
  },
  {
    path: '/updataIp',
    name: '站点编辑',
    component: resolve => require(['../views/updataIp.vue'], resolve)
  },
  {
    path: '/user',
    name: '用户管理',
    component: resolve => require(['../views/user.vue'], resolve)
  },
  {
    path: '/restPlan',
    name: '待乘计划',
    component: resolve => require(['../views/restPlan.vue'], resolve)
  },
  {
    path: '/trainPlan',
    name: '计划维护',
    component: resolve => require(['../views/trainPlan.vue'], resolve)
  }
]