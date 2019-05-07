<template>
  <div>
    <a-spin :spinning="spinning">
    <!-- <check-box></check-box> -->
      <div class="search-box">
        <search-com 
        :changeOnSelect="false"
        :bedNoShow="true"
        :dropDown="false"
        :trainNoShow="false"
        :defaultValue="['all', '']"
        @getBedNo="getBedNo"
        @getTrainNo="getTrainNo"
        @getLdNameOrRestCode="getLdNameOrRestCode"
        ></search-com>
        <div class="search-button">
          <a-button type="primary" @click="queryTab" title="">查询</a-button>
        </div>
      </div>
      <div class="bedBox">
        <a-tabs tabPosition="top" @prevClick="monitorTabCallback" @nextClick="monitorTabCallback" :activeKey="activeKey" @change="changeTab">
          <a-tab-pane v-for="(val, index) in onlineTabList" :tab="val.restName" :key="val.restCode" style="display: flex;">
            <div class="bed-view">
              <div class="screenBed">
                <div>
                  <b class="legend">全部铺位：</b>
                  <a-badge :count="val.idleCount + val.inUseCount" showZero @click="val.changeState = 0">
                    <a href="#" class="not-arrange-badge" :class="{'active-no-rest-badge': val.changeState === 0}"></a>
                  </a-badge>  
                  <b class="legend">空闲铺位：</b>
                  <a-badge :count="val.idleCount" showZero @click="val.changeState = 7">
                    <a href="#" class="not-arrange-badge" :class="{'active-no-rest-badge': val.changeState === 7}"></a>
                  </a-badge>  
                  <b class="legend">待乘中：</b>
                  <a-badge :count="val.inUseCount" showZero @click="val.changeState = 1">
                    <a href="#" class="arrange-badge" :class="{'active-arrange-badge': val.changeState === 1}"></a>
                  </a-badge>  
                  <b class="legend">叫班：</b>
                  <a-badge :count="val.remindCount" showZero @click="val.changeState = 2">
                    <a href="#" class="remind-badge" :class="{'active-remind-badge': val.changeState === 2}"></a>
                  </a-badge>
                  <!-- <b class="legend">睡眠：</b>
                  <a-badge :count="val.sleepCount" showZero @click="val.sleepState = !val.sleepState">
                    <a href="#" class="sleep-badge" :class="{'active-sleep-badge': val.sleepState}"></a>
                  </a-badge> -->
                  <b class="legend">请假：</b>
                  <a-badge class="legend-icon" :count="val.qjCount" showZero @click="val.changeState = 3">
                    <a href="#" class="icon-badge" :class="{'active-icon-badge': val.changeState === 3}">
                      <img src="../../public/img/qj-icon.png" alt="">
                    </a>
                  </a-badge>
                  <b class="legend">离手：</b>
                  <a-badge class="legend-icon" :count="val.notWearCount" showZero @click="val.changeState = 4">
                    <a href="#" class="icon-badge" :class="{'active-icon-badge': val.changeState === 4}">
                      <img src="../../public/img/hand.png" alt="">
                    </a>
                  </a-badge>
                  <b class="legend">离线：</b>
                  <a-badge class="legend-icon" :count="val.leaveCount" showZero @click="val.changeState = 5">
                    <a href="#" class="icon-badge" :class="{'active-icon-badge': val.changeState === 5}">
                      <img src="../../public/img/leave.png" alt="">
                    </a>
                  </a-badge>
                  <b class="legend">低电量：</b>
                  <a-badge class="legend-icon" :count="val.lowBatteryCount" showZero @click="val.changeState = 6">
                    <a href="#" class="icon-badge" :class="{'active-icon-badge': val.changeState === 6}">
                      <img src="../../public/img/lowBattery.png" alt="">
                    </a>
                  </a-badge>
                </div>
              </div>
              <div class="bedList">
                <div class="bed" 
                v-for="(val2, index) in val.resultList" :key="index + 'key'"
                :class="{'not-arrange-shadow': !val2.rest,'arrange-shadow': val2.rest, 'qj-shadow': val2.rest && val2.rest.qjState, 'remind-shadow': val2.rest && val2.rest.remindState, 'sleep-shadow': val2.rest && val2.rest.sleepState,}"
                v-show="(selectBed === val2.bedNo) || (val.changeState === 0) || (val.changeState === 7 && !val2.rest) || (val.changeState === 1 && val2.rest) || (val.changeState === 2 && val2.rest && val2.rest.remindState) || (val.changeState === 3 && val2.rest && val2.rest.qjState) || (val.changeState === 4 && val2.rest && val2.rest.wearState) || (val.changeState === 5 && val2.rest && val2.rest.leaveState) || (val.changeState === 6 && val2.rest && val2.rest.bettaryState)">
                  <div class="bed-no" :class="{'not-arrange-back': !val2.rest,'arrange-back': val2.rest,  'remind-back': val2.rest && val2.rest.remindState, 'sleep-back': val2.rest && val2.rest.sleepState,}">
                    <div v-text="val2.bedNo"></div>
                    <div class="bed-head-icon-box">
                      <div class="bed-head-icon" v-if="val2.rest && val2.rest.wearState === 1">
                        <img src="../../public/img/hand.png" alt="">
                      </div>
                      <div class="bed-head-icon" v-if="val2.rest && val2.rest.leaveState === 1">
                        <img src="../../public/img/leave.png" alt="">
                      </div>
                      <div class="bed-head-icon" v-if="val2.rest && val2.rest.bettaryState === 1">
                        <img src="../../public/img/lowBattery.png" alt="">
                      </div>
                    </div>
                  </div>
                  <div v-if="val2.rest" class="bed-details">
                    <div class="qj-rest-icon" v-show="val2.rest && val2.rest.qjState">
                      <img src="../../public/img/qj-icon.png" alt="">
                    </div>
                    <div class="bed-driver-name" v-text="val2.rest.driverName"></div>
                    <div class="bed-driver-name" v-text="val2.rest.trainNo"></div>
                    <div class="bed-driver-name">{{val2.rest.remindPlanedTime1 | formatTime1}}</div>
                  </div>
                  <div v-if="val2.rest" class="bed-ldname-details">
                    <div class="bed-driver-name" v-text="val2.rest.ldName"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="bed-table">
              <div>
                <div class="bed-table-header">
                  <div class="b-t-h-left">已叫班列表</div>
                </div>
                <a-table :columns="bedRestHeaderCol" :dataSource="val.callStatusList" :pagination="false" bordered>
                  <div slot="remindPlanedTime1" slot-scope="text">
                    <div>{{text | formatTime1}}</div>
                  </div>
                  <div slot="callStatus" slot-scope="text">
                    <div v-if="text === 0"></div>
                    <div v-if="text === 1">首次</div>
                    <div v-if="text === 2">二次</div>
                    <div v-if="text === 3">人工</div>
                  </div>
                </a-table>  
              </div>
            </div> -->
          </a-tab-pane>
        </a-tabs> 
      </div>
    </a-spin>
  </div>
</template>
<script>
import cookie from '../components/cookie.vue'
import {mapState} from 'vuex'
import searchCom from '../components/searchCom.vue'
import checkBox from '../components/checkBox.vue'
let bedRestHeaderCol = [
  {
    title: '机务段',
    dataIndex: 'ldName',
    key: 'ldName',
    align: 'center'
  },{
    title: '司机',
    dataIndex: 'driverName',
    key: 'driverName',
    align: 'center'
  },{
    title: '车次',
    dataIndex: 'trainNo',
    key: 'trainNo',
    align: 'center'
  },{
    title: '叫班',
    dataIndex: 'remindPlanedTime1',
    key: 'remindPlanedTime1',
    scopedSlots: { customRender: 'remindPlanedTime1' },
    align: 'center'
  },{
    title: '床号',
    dataIndex: 'bedNo',
    key: 'bedNo',
    align: 'center'
  },{
    title: '应答',
    dataIndex: 'callStatus',
    key: 'callStatus',
    scopedSlots: { customRender: 'callStatus' },
    align: 'center'
  },
]
export default {
  data () {
    return {
      onLineRestVo: {},
      onlineRestList: [],
      onlineTabList: [],
      spinning: false,
      activeKey: '',
      bedRestHeaderCol,
      remindRestList: [],
      selectBed: ''
    }
  }, 
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.getOnlineRestList('init')
    })
  },
  computed: {
    ...mapState(['username'])
  },
  components: {
    searchCom,
    checkBox
  },
  methods: {
    monitorTabCallback () {
    },
    changeTab (active) {
      this.selectBed = ''
      console.log('active', active)
      this.activeKey = active
      this.getOnlineRestList('query')
    },
    queryTab () {
      this.selectBed = ''
      if (this.onLineRestVo.restCode) {
        this.activeKey = this.onLineRestVo.restCode
        if (this.onLineRestVo.bedNo) {
          this.selectBed = this.onLineRestVo.bedNo
          console.log('this.selectBed',this.selectBed)
        }
      }
      this.getOnlineRestList('query')
    },
    getOnlineRestList (state) {
      this.spinning = true
      this.axios({
        method: 'post',
        url: '/api/venom-rest/on-line',
        // data: this.onLineRestVo,
        data: {}, 
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.onlineTabList = data.result
          if (state === 'init') {
            this.activeKey = this.onlineTabList[0].restCode
          }
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-driver/list-by-page失败', err)
      })
    },
    getBedNo (bedNo) {
      this.onLineRestVo.bedNo = bedNo
    },
    getTrainNo (trainNo) {
      this.onLineRestVo.trainNo = trainNo
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.onLineRestVo.ldName = ldName
      this.onLineRestVo.restCode = restCode
      this.onLineRestVo.trainNo = ''
      this.onLineRestVo.bedNo = ''
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
  .bedBox {
    width: 100%;
    margin-top: 20px;
  }
  .bed-view {
    width: 78%;
    padding: 10px;
  }
  .bed-table {
    width: 21%;
    margin-top: 25px;
  }
  .bedList {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
  }
  .bed {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    /* background-image: url('../../public/img/hours.png'); */
    /* background-size: 100% 100%; */
    /* background-repeat: no-repeat; */
    margin: 10px;
    position: relative;
    padding: 0 10px;
  }
  .not-arrange-shadow {
    box-shadow: 0 0 10px #00000055;
  }
  .arrange-shadow {
    box-shadow: 0 0 10px #00b8ff;
  }
  .remind-shadow {
    box-shadow: 0 0 10px #67c23a;
  }
  .sleep-shadow {
    box-shadow: 0 0 10px #de44ec;
  }
  .not-arrange-back {
    background: #00000055;
  }
  .arrange-back {
    background: #00b8ff;
  }
  .remind-back {
    background: #67c23a;
  }
  .sleep-back {
    background: #de44ec;
  }
  .bed .bed-no {
    font-size: 14px;
    color: #fff;
    font-weight: bold;
    line-height: 30px;
    width: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    justify-content: space-between;
  }
  .bedBox .not-arrange-badge {
    display: block;
    width: 30px;
    height: 25px;
    box-shadow: 0 0 5px #00000055;
    border-radius: 5px;
  }
  .bedBox .arrange-badge {
    display: block;
    width: 30px;
    height: 25px;
    box-shadow: 0 0 5px #00b8ff;
    border-radius: 5px;
  }
  .active-arrange-badge {
    background: #00b8ff;
  }
  .active-no-rest-badge {
    background: #00000055;
  }
  .bedBox .remind-badge {
    display: block;
    width: 30px;
    height: 25px;
    box-shadow: 0 0 5px #67c23a;
    border-radius: 5px;
  }
  .active-remind-badge {
    background: #67c23a;
  }
  .bedBox .sleep-badge {
    display: block;
    width: 30px;
    height: 25px;
    box-shadow: 0 0 5px #de44ec;
    border-radius: 5px;
  }
  .active-sleep-badge {
    background: #de44ec;
  }
  .bedBox .icon-badge {
    display: block;
    width: 25px;
    height: 25px;
  }
  .bedBox img {
    width: 100%;
    height: 100%;
  }
  .active-icon-badge {
    transform: scale(1.1, 1.1);
    box-shadow: 1px 1px 5px #ccc;
    border-radius: 5px;
  }
  .bed-ldname-details {
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #00b8ff;
    width: 100%;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
  }
  .bed-details {
    margin-top: 30px;
    position: relative;
  }
  .screenBed {
    padding-left: 20px;
  }
  .screenBed .ant-badge {
    margin-right: 40px;
  }
  .screenBed .legend-icon {
    position: relative;
    top: -8px;
  }
  .legend {
    font-size: 16px;
    line-height: 30px;
  }
  .bed-head-icon-box {
    display: flex;
    justify-content: space-around;
    width: 50%;
  }
  .bed-head-icon {
    width: 12px;
    height: 12px;
  }
  .bed-head-icon img {
    width: 100%;
    height: 100%;
  }
  .bed-table-header {
    width: 100%;
    /* background: skyblue; */
  }
  .b-t-h-left {
    width: 150px;
    height: 0;
    border-bottom: 40px solid #187ca5;
    border-right: 40px solid #fff;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    text-align: center;
  }
  .qj-rest-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
  }
  .qj-rest-icon img {
    width: 100%;
    height: 100%;
  }
</style>
