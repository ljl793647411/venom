<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box rest-search-box">
        <search-com 
          :changeOnSelect="false"
          :bedNoShow="chartType"
          :trainNoShow="chartType"
          :dropDown="false"
          :defaultValue="['all', '']"
          @getBedNo="getBedNo"
          @getTrainNo="getTrainNo"
          @getLdNameOrRestCode="getLdNameOrRestCode"
          @getLdName="getLdName"
        ></search-com>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">工号：</label>
          <a-input class="input" v-model="restVo.workNo"/>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">姓名：</label>
          <a-input class="input" v-model="restVo.nameLike"/>
        </div>
        <div class="search-input">
          <label for="">入住日期范围：</label>  
          <date-view class="dateInput" @getDateRange="getEnterDate" queryType="W"></date-view>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">出发超时：</label>
          <a-select style="width: 150px" @change="overInTimeChange" :value="overInTimeSelected">
            <a-select-option v-for="val in outInTimeSelectList" :value="val.value" :key="val.label">{{val.label}}</a-select-option>
          </a-select>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">司机响应：</label>
          <a-select style="width: 150px" @change="responseChange" :value="responseSelected">
            <a-select-option v-for="val in resSelectList" :value="val.value" :key="val.label">{{val.label}}</a-select-option>
          </a-select>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">叫班方式：</label>
          <a-select style="width: 150px" @change="remindTypeChange" :value="remindTypeSelected">
            <a-select-option v-for="val in remindTypeSelectList" :value="val.value" :key="val.label">{{val.label}}</a-select-option>
          </a-select>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">离线率范围：</label>
          <a-select style="width: 150px" @change="offlineChange" :value="absentTimeRate">
            <a-select-option v-for="val in OfflineLateList" :value="val.value" :key="val.label">{{val.label}}</a-select-option>
          </a-select>
        </div>
        <div class="search-input" v-show="defaultView === '历史详情'">
          <label for="">离手率范围：</label>
          <a-select style="width: 150px" @change="notwearChange" :value="notWearingTimeRate">
            <a-select-option v-for="val in notWearLateList" :value="val.value" :key="val.label">{{val.label}}</a-select-option>
          </a-select>
        </div>
        <div class="rest-button-box">
          <div class="search-button">
            <a-button type="primary" @click="getRestList('query')" title="">查询</a-button>
          </div>
          <a-button type="primary" @click="exportExcel" v-show="defaultView == '历史详情'">导出</a-button>
          <a ref="exportDowload"></a>
        </div>
        <div class="change-view">
          <a-radio-group buttonStyle="solid" @change="changeView" :value="defaultView">
            <a-radio-button value="历史详情">历史详情</a-radio-button>
            <a-radio-button value="图表汇总">图表汇总</a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div v-if="defaultView === '历史详情'">
        <div class="table">
          <a-table :columns="columns" :dataSource="restList" :pagination="false" bordered>
            <div slot="photoIn" slot-scope="text" class="">
              <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" alt="" @dblclick="bigPhoto(text)" v-if="text" title="双击查看大图"> -->
              <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
            </div>
            <div slot="photoOut" slot-scope="text" class="">
              <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" alt="" @dblclick="bigPhoto(text)" v-if="text" title="双击查看大图"> -->
              <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
            </div>
            <div slot="restTime" slot-scope="text, record">
              <div :class="{'font-color-red': record.showRedColor}">{{text}}</div>
            </div>
            <div slot="endOperateType" slot-scope="text">
              <div v-if="text == 11">自助办理</div>
              <div v-if="text == 12">人工办理</div>
            </div>
            <div slot="remindType" slot-scope="text">
              <div v-if="text == 1">人工</div>
              <div v-if="text == 2">自动</div>
            </div>
            <div slot="setoutResponse" slot-scope="text">
              <div v-if="text == 1">已响应</div>
              <div v-if="text == 2">未响应</div>
            </div>
            <div slot="setoutIntime" slot-scope="text">
              <div v-if="text == 1">未超时</div>
              <div v-if="text == 2">已超时</div>
            </div>
            <div slot="notWearingTimeRate" slot-scope="text">
              <div v-text="`${text}%`"></div>
            </div>
            <div slot="absentTimeRate" slot-scope="text">
              <div v-text="`${text}%`"></div>
            </div>
          </a-table>
        </div>
        <div>
          <pagination :pageNo="pageNo" :pageSize="pageSize" :totalRecs="totalRecs" @changePage="changePage"></pagination>
        </div>
      </div>
      <div v-show="defaultView == '图表汇总'" class="out-chart-box">
        <b class="pie-chart-title" v-text="`总出勤人数： ${attendanceCount}人`"></b>
        <div class="chart-box">
          <div id="pie1" :option="pie1"></div>
          <div id="pie2" :option="pie2"></div>
          <div id="pie3" :option="pie3"></div>
        </div>
        <div class="chart-box"> 
          <div id="columns1" :option="columns1"></div>
          <div id="columns2" :option="columns2"></div>
        </div>
      </div>
      <div v-if="photoShow" class="bigPhoto">
        <a-card>
          <img :src="'/api2/image?type=driver&fileName=' + pictureURL">
          <a-button @click="closePicture()" style="float: right">关 闭</a-button>
        </a-card>
      </div>
    </a-spin>
  </div>
</template>
<script>
import pagination from '../components/pagination.vue'
import config from '../assets/config.vue'
import cookie from '../components/cookie.vue'
const columns = [
  {
    title: '待乘室',
    dataIndex: 'restName',
    key: 'restName',
    align: 'center',
    width: 60
    
  },
  {
    title: '车次号',
    dataIndex: 'trainNo',
    key: 'trainNo',
    align: 'center',
    width: 70
  },
  {
    title: '铺位号',
    dataIndex: 'bedNo',
    key: 'bedNo',
    align: 'center',
    width: 70
  },
  {
    title: '机务段',
    dataIndex: 'ldName',
    key: 'ldName',
    align: 'center',
    width: 60
  },
  {
    title: '工号',
    dataIndex: 'driWorkNo',
    key: 'driWorkNo',
    align: 'center',
    width: 70
  },
  {
    title: '姓名',
    dataIndex: 'driverName',
    key: 'driverName',
    align: 'center',
    width: 50
  },
  {
    title: '入住时间',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center',
    width: 75
  },
  {
    title: '入住照片',
    dataIndex: 'photoIn',
    key: 'photoIn',
    scopedSlots: { customRender: 'photoIn' },
    align: 'center',
    width: 60
  },
  {
    title: '开行时间',
    dataIndex: 'trainDt',
    key: 'trainDt',
    align: 'center',
    width: 75
  },
  {
    title: '计划叫班',
    dataIndex: 'remindPlanedTime1',
    key: 'remindPlanedTime1',
    align: 'center',
    width: 75
  },
  {
    title: '首次响应',
    dataIndex: 'remindRealTime1',
    key: 'remindRealTime1',
    align: 'center',
    width: 75
  },
  {
    title: '二次响应',
    dataIndex: 'remindRealTime2',
    key: 'remindRealTime2',
    align: 'center',
    width: 75
  },
  {
    title: '人工叫班',
    dataIndex: 'adminRemindTime',
    key: 'adminRemindTime',
    align: 'center',
    width: 75
  },
  {
    title: '离寓时间',
    dataIndex: 'endRealTime',
    key: 'endRealTime',
    align: 'center',
    width: 75
  },
  {
    title: '离寓照片',
    dataIndex: 'photoOut',
    key: 'photoOut',
    scopedSlots: { customRender: 'photoOut' },
    align: 'center',
    width: 60
  },
  {
    title: '休息时间',
    dataIndex: 'restTime',
    key: 'restTime',
    scopedSlots: { customRender: 'restTime' },
    align: 'center',
    width: 60
  },
  {
    title: '睡眠时间',
    children: [{
      title: '深度',
      dataIndex: 'deepSleepTimeSum',
      align: 'center',
      key: 'deepSleepTimeSum',
      width: 50,
    }, {
      title: '浅度',
      dataIndex: 'shallowSleepTimeSum',
      align: 'center',
      key: 'shallowSleepTimeSum',
      width: 50,
    }, {
      title: '时长',
      dataIndex: 'sleepSeconds',
      align: 'center',
      key: 'sleepSeconds',
      width: 50,
    }]
  },
  {
    title: '心率',
    children: [{
      title: '最大',
      dataIndex: 'heartRateMax',
      align: 'center',
      key: 'heartRateMax',
      width: 30,
    }, {
      title: '最小',
      dataIndex: 'heartRateMin',
      align: 'center',
      key: 'heartRateMin',
      width: 30,
    }, {
      title: '平均',
      dataIndex: 'heartAverage',
      align: 'center',
      key: 'heartAverage',
      width: 30,
    }]
  },
  {
    title: '步数',
    dataIndex: 'step',
    key: 'step',
    align: 'center',
    width: 50
  },
  {
    title: '离手',
    children: [{
      title: '时长',
      dataIndex: 'notWearingTimeSum',
      align: 'center',
      key: 'notWearingTimeSum',
      width: 40,
    },{
      title: '离手率',
      dataIndex: 'notWearingTimeRate',
      scopedSlots: { customRender: 'notWearingTimeRate'},
      align: 'center',
      key: 'notWearingTimeRate',
      width: 50,
    }, {
      title: '次数',
      dataIndex: 'notWearingTimes',
      align: 'center',
      key: 'notWearingTimes',
      width: 30,
    }]
  },
  {
    title: '离线',
    children: [{
      title: '时长',
      dataIndex: 'absentTimeSum',
      align: 'center',
      key: 'absentTimeSum',
      width: 40,
    },{
      title: '离线率',
      dataIndex: 'absentTimeRate',
      scopedSlots: { customRender: 'absentTimeRate' },
      align: 'center',
      key: 'absentTimeRate',
      width: 50,
    }, {
      title: '次数',
      dataIndex: 'absentTimes',
      align: 'center',
      key: 'absentTimes',
      width: 30,
    }]
  },
  {
    title: '超时',
    dataIndex: 'setoutIntime',
    key: 'setoutIntime',
    scopedSlots: { customRender: 'setoutIntime' },
    align: 'center',
    width: 50
  },
  {
    title: '响应',
    dataIndex: 'setoutResponse',
    key: 'setoutResponse',
    scopedSlots: { customRender: 'setoutResponse' },
    align: 'center',
    width: 50
  },  
  {
    title: '叫班方式',
    dataIndex: 'remindType',
    key: 'remindType',
    scopedSlots: { customRender: 'remindType' },
    align: 'center',
    width: 60
  },
  {
    title: '离寓方式',
    dataIndex: 'endOperateType',
    key: 'endOperateType',
    scopedSlots: { customRender: 'endOperateType' },
    align: 'center',
    width: 60
  },
  {
    title: '餐券',
    dataIndex: 'ticket1',
    key: 'ticket1',
    align: 'center',
    width: 40
  }]
 
import dateView from '../components/dateView.vue'
import searchCom from '../components/searchCom.vue'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      restVo: {},
      restList: [],
      columns,
      spinning: false,
      defaultView: '历史详情',
      attendanceCount: 0,
      chartType: true,
      photoShow: false,
      resSelectList: config.resSelectList,
      outInTimeSelectList: config.outInTimeSelectList,
      remindTypeSelectList: config.remindTypeSelectList,
      OfflineLateList: config.OfflineLateList,
      notWearLateList: config.notWearLateList,
      responseSelected: '',
      overInTimeSelected: '',
      remindTypeSelected: '',
      absentTimeRate: '',
      notWearingTimeRate: '',
      pictureURL: '',
      pie1: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '司机响应率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            },
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        credits: {
          enabled: false
        },
        colors: ['#1e38fb','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      }, 
      pie2: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '出发及时率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            }
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        colors: ['#64d641','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      },
      pie3: {
        chart: {
          type: 'pie',
        },
        title: {
          text: '人工叫班率'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b>',
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            showInLegend: false,
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              formatter: function() {
                //this 为当前的点（扇区）对象，可以通过  console.log(this) 来查看详细信息
                return '<span class="pie-plot-class"> '+ this.point.name +'：' + this.y + '%</span>';
              }
            }
          },
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            point: {
              events: {
                click: this.changeDetail
              }
            }
          }
        },
        colors: ['#f9f565','#ccc'],
        series: [{
          type: 'pie',
          size: '80%',
          name: '占比',
          data: []
        }]
      },
      columns1: {
        chart: {
          type: 'column'
        },
        title: {
          text: '离线率占比图'
        },
        xAxis: {
          type: 'category',
          categories: ['0%~30%','31%~60%','61%~100%'],
        },
        yAxis: {
          title: {
            text: '人数'
          }
        },
        plotOptions: {
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            events: {
              click: this.changeDetail
            }
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: '离线人数',
          data: [
          ],
          dataLabels: {
            enabled: true,
          },
          tooltip: {
            pointFormat: '离线人数： <b>{point.y}人</b>'
          },
          colorByPoint: true
        }]
      },
      columns2: {
        chart: {
          type: 'column' // varwide 依赖 varwide.js
        },
        title: {
          text: '离手率占比图'
        },
        xAxis: {
          type: 'category',
          categories: ['0%~30%','31%~60%','61%~100%'],
          title: {
            text: '* 柱子宽度与 离手人数 成正比'
          }
        },
        yAxis: {
          title: {
            text: '人数'
          }
        },
        plotOptions: {
          series: {
            allowPointSelect: true,  // 设置点击事件
            cursor: 'pointer', // 设置click events attached to the series
            events: {
              click: this.changeDetail
            }
          }
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: '离手人数',
          data: [
          ],
          dataLabels: {
            enabled: true,
          },
          tooltip: {
            pointFormat: '离手人数： <b>{point.y}人</b>'
          },
          colorByPoint: true
        }]
      },
    }
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.getRestList('init')
    })
  },
  computed: {
    ...mapState(['username'])
  },
  components: { 
    config,
    pagination,
    dateView,
    searchCom,
  },
  methods: {
    changeDetail (e) {
      console.log('e是什么', e)
      if (e.point.name === '未响应率') {
        this.responseSelected = '2'
        this.restVo.setoutResponse = this.responseSelected
      } else if (e.point.name === '司机响应率') {
        this.responseSelected = '1'
        this.restVo.setoutResponse = this.responseSelected
      } else if (e.point.name === '出发超时率') {
        this.overInTimeSelected = '2'
        this.restVo.setoutIntime = this.overInTimeSelected
      } else if (e.point.name === '出发及时率') {
        this.overInTimeSelected = '1'
        this.restVo.setoutIntime = this.overInTimeSelected
      } else if (e.point.name === '人工叫班率') {
        this.remindTypeSelected = '1'
        this.restVo.remindType = this.remindTypeSelected
      } else if (e.point.name === '自动叫班率') {
        this.remindTypeSelected = '2'
        this.restVo.remindType = this.remindTypeSelected
      } else if (e.point.series.name === '离线人数') {
        if (e.point.category === '0%~30%') {
          this.absentTimeRate = '1'
          this.restVo.absentTimeRate = this.absentTimeRate
        } else if (e.point.category === '31%~60%') {
          this.absentTimeRate = '2'
          this.restVo.absentTimeRate = this.absentTimeRate
        }  else if (e.point.category === '61%~100%') {
          this.absentTimeRate = '3'
          this.restVo.absentTimeRate = this.absentTimeRate
        } 
      } else if (e.point.series.name === '离手人数') {
        if (e.point.category === '0%~30%') {
          this.notWearingTimeRate = '1'
          this.restVo.notWearingTimeRate = this.notWearingTimeRate
        } else if (e.point.category === '31%~60%') {
          this.notWearingTimeRate = '2'
          this.restVo.notWearingTimeRate = this.notWearingTimeRate
        }  else if (e.point.category === '61%~100%') {
          this.notWearingTimeRate = '3'
          this.restVo.notWearingTimeRate = this.notWearingTimeRate
        } 
      }
      this.chartType = true
      this.defaultView = '历史详情'
      console.log('default', this.defaultView)
      this.getRestList('query')
    },
    responseChange (value) {
      // console.log('响应率value', value)
      this.responseSelected = value
      this.restVo.setoutResponse = value
    },
    overInTimeChange (value) {
      // console.log('及时率value', value)
      this.overInTimeSelected = value
      this.restVo.setoutIntime = value
    },
    remindTypeChange (value) {
      this.remindTypeSelected = value
      this.restVo.remindType = value
    },
    offlineChange (value) {
      this.absentTimeRate = value
      this.restVo.absentTimeRate = value
    },
    notwearChange (value) {
      this.notWearingTimeRate = value
      this.restVo.notWearingTimeRate = value
    },
    exportExcel () {
      this.spinning = true
      let self = this
      this.axios({
        method: 'get',
        url: '/api/venom-rest/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.spinning = false
          self.$refs.exportDowload.href = 'api2/file?type=rest&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = 'api2/file?type=rest&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.spinning = false
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        this.spinning = false
        console.log('导出计划维护失败，', error)
      })
    },
    closePicture() {
      this.photoShow = false
      this.pictureURL = ""
    },
    bigPhoto(pictureURL) {
      if (!pictureURL) {
        return
      }
      this.photoShow = true
      this.pictureURL = pictureURL
    },
    getEnterDate (rangeDate) {
      this.restVo.enterFromTime = rangeDate[0]
      this.restVo.enterToTime = rangeDate[1]
    },
    getRestList (state) {
      this.spinning = true
      if (state === 'init') {
        this.restVo.ldName = 'all'
      }
      if (this.restVo.workNo) {
        this.restVo.workNo = this.restVo.workNo.trim()
      }
      if (this.restVo.nameLike) {
        this.restVo.nameLike = this.restVo.nameLike.trim()
      }
      if (!this.restVo.enterFromTime || !this.restVo.enterToTime) {
        this.$message.error('请选择入住日期范围')
        this.spinning = false
        return
      }
      this.axios({
        method: 'post',
        url: '/api/venom-rest/detail',
        data: this.restVo,
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
				timeout: 60000
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.page.pageNo
          this.pageSize = data.result.page.pageSize
          this.totalRecs = data.result.page.totalRecs
          this.restList = data.result.page.resultList
          this.attendanceCount = data.result.servedDriverNum
          this.getPieData(data.result.responseRate, 1)
          this.getPieData(data.result.inTimeRate, 2)
          this.getPieData(data.result.remindTypeRate, 3)
          this.getPieData(data.result.absentTimeValue, 4)
          this.getPieData(data.result.notWearingTimeValue, 5)
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('/api/venom-rest/detail失败', err)
      })
    },
    getPieData (val, type) {
      if (typeof(val) === 'string') {
        let num = parseInt(val.split('%')[0])
        let num2 = 100 - num
        if (type === 1) {
          this.pie1.series[0].data = [
            ['司机响应率', num],
            ['未响应率', num2]
          ]
          this.Highcharts.chart('pie1', this.pie1)
        } else if (type === 2) {
          this.pie2.series[0].data = [
            ['出发及时率', num],
            ['出发超时率', num2]
          ]
          this.Highcharts.chart('pie2', this.pie2)
        } else if (type === 3) {
          this.pie3.series[0].data = [
            ['人工叫班率', num],
            ['自动叫班率', num2]
          ]
          this.Highcharts.chart('pie3', this.pie3)
        } 
      } else if (typeof(val) === 'object') {
        if (type === 4) {
          this.columns1.series[0].data = val
          this.Highcharts.chart('columns1', this.columns1)
        } else if (type === 5) {
          this.columns2.series[0].data = val
          this.Highcharts.chart('columns2', this.columns2)
        }
      }
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getRestList()
    },
    getBedNo (bedNo) {
      this.restVo.bedNo = bedNo
    },
    getTrainNo (trainNo) {
      this.restVo.trainNo = trainNo
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.restVo.ldName = ''
      this.restVo.restCode = restCode
      this.restVo.trainNo = ''
      this.restVo.bedNo = ''
    },
    getLdName (ldName) {
      this.restVo.ldName = ldName
      this.restVo.restCode = ''
      this.restVo.trainNo = ''
      this.restVo.bedNo = ''
    },
    changeView (e) {
      this.defaultView = e.target.value
      if (this.defaultView === '图表汇总') {
        this.defalutResValue()
        this.chartType = false
      } else if (this.defaultView === '历史详情') {
        this.chartType = true
      }
    },
    defalutResValue () {
      if (this.restVo.workNo) {
        this.restVo.workNo = ''
      }
      if (this.restVo.bedNo) {
        this.restVo.bedNo = ''
      }
      if (this.restVo.nameLike) {
        this.restVo.nameLike = ''
      }
      if (this.restVo.trainNo) {
        this.restVo.trainNo = ''
      }
      if (this.restVo.setoutResponse) {
        this.restVo.setoutResponse = ''
        this.responseSelected = ''
      }
      if (this.restVo.setoutIntime) {
        this.restVo.setoutIntime = ''
        this.overInTimeSelected = ''
      }
      if (this.restVo.remindType) {
        this.restVo.remindType = ''
        this.remindTypeSelected = ''
      }
      if (this.restVo.absentTimeRate) {
        this.restVo.absentTimeRate = ''
        this.absentTimeRate = ''
      }
      if (this.restVo.notWearingTimeRate) {
        this.restVo.notWearingTimeRate = ''
        this.notWearingTimeRate = ''
      }
    },
    userValidate (username) {
      let aa = cookie.getCookie(username)
      if (!aa) {
        this.$router.push({path: '/login'})
        return false
      }
      return true
    },
  }
}
</script>
<style>
  .search-box.rest-search-box {
    padding-right: 100px;
    padding-left: 250px;
  }
  .change-view {
    position: absolute;
    top: 16px;
    left: 40px;
  }
  .rest-button-box {
    display: flex;
    position: absolute;
    top: 16px;
    right: 40px;
  }
  .positon-search-class {
    position: relative;
    top: 46px;
    right: 40px;
  }
  .out-chart-box {
    padding-top: 20px;
  }
  .chart-box {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    padding-top: 20px;
  }
  .pie-chart-title {
    font-size: 20px;
    margin-left: 20px;
  }
  .pie-plot-class {
    font-size: 14px;
  }
</style>
