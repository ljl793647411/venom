<script>
const navList = [
        {
          url: '/home',
          name: '首页',
          icon: './img/home.png'
        },
        {
          url: '/monitor',
          name: '待乘实况',
          icon: './img/monitor.png'
        },
        {
          url: '/rest',
          name: '待乘记录',
          icon: './img/rest.png'
        },
        {
          url: '/inspectRecord',
          name: '待乘巡检',
          icon: './img/xj.png'
        },
        {
          url: '/leaveRecord',
          name: '请销假记录',
          icon: './img/qj.png'
        },
        {
          url: '/changeShifts',
          name: '交接班记录',
          icon: './img/jjb.png'
        },
        {
          url: '/restPlan',
          name: '待乘计划',
          icon: './img/rest-plan.png'
        },
        {
          url: '/trainPlan',
          name: '计划维护',
          icon: './img/train-plan.png'
        },
        // {
        //   url: '/abnormalRecord',
        //   name: '异常记录',
        //   icon: './img/yc.png'
        // },
        {
          url: '/driver',
          name: '司机信息',
          icon: './img/driver.png'
        },
        {
          url: '/updataIp',
          name: '待乘室管理',
          icon: './img/ip.png'
        },
        {
          url: '/user',
          name: '用户管理',
          icon: './img/user.png'
        },
      ]
const resSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '已响应'
  },
  {
    value: '2',
    label: '未响应'
  },
]
const outInTimeSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '未超时'
  },
  {
    value: '2',
    label: '已超时'
  },
]
const remindTypeSelectList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '人工叫班'
  },
  {
    value: '2',
    label: '自动叫班'
  }
]
const OfflineLateList = [
   {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '0%~30%'
  },
  {
    value: '2',
    label: '31%~60%'
  },
  {
    value: '3',
    label: '61%~100%'
  }
]
const notWearLateList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '0%~30%'
  },
  {
    value: '2',
    label: '31%~60%'
  },
  {
    value: '3',
    label: '61%~100%'
  }
]
const trainTypeList = [
  {
    value: '1',
    label: '机车-调休'
  },
  {
    value: '2',
    label: '机车-驻班'
  },
  {
    value: '3',
    label: '机车-继乘'
  },
  {
    value: '4',
    label: '动车-驻班'
  },
  {
    value: '5',
    label: '动车-候班'
  },
  {
    value: '6',
    label: '动车-间休'
  },
  {
    value: '7',
    label: '其他'
  }
]
const tranPlanMap = {
  '1': '机车-调休',
  '2': '机车-驻班',
  '3': '机车-继乘',
  '4': '动车-驻班',
  '5': '动车-候班',
  '6': '动车-间休',
  '7': '其他'
}
export default {
  navList,
  resSelectList,
  outInTimeSelectList,
  remindTypeSelectList,
  OfflineLateList,
  notWearLateList,
  trainTypeList,
  tranPlanMap
}
</script>
