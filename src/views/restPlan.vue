<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box">
        <search-com 
          :changeOnSelect="false"
          :defaultValue="['all', '']"
          :dropDown="false"
          @getLdNameOrRestCode="getLdNameOrRestCode"
        ></search-com>
        <div class="search-input">
          <label for="">出发车次：</label>
          <a-input class="input" v-model="wdResVo.trainNo"/>
        </div>
        <div class="search-input">
          <label for="">姓名：</label>  
          <a-input class="input" v-model="wdResVo.driverName"/>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getWaitingDriveList('query')" title="">查询</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="resetVo" title="">重置</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="waitingDriveList" :pagination="false" bordered>
          <div slot="updateReason" slot-scope="text, record">
            <div v-html="text"></div>
          </div>
        </a-table>
      </div>
      <div>
        <pagination :pageNo="pageNo" :pageSize="pageSize" :totalRecs="totalRecs" @changePage="changePage"></pagination>
      </div>
    </a-spin>
  </div>
</template>
<script>
import pagination from '../components/pagination.vue'
import cookie from '../components/cookie.vue'
import searchCom from '../components/searchCom.vue'
import {mapState} from 'vuex'
const columns = [
  {
    title: '司机', 
    dataIndex: 'driverName',
    key: 'driverName',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center' 
  },
  {
    title: '修改原因',
    dataIndex: 'updateReason',
    key: 'updateReason',
    scopedSlots: { customRender: 'updateReason' },
    align: 'center',
    width: 400
  },
  {
    title: '叫班时间', 
    dataIndex: 'remindPlanedTime1',
    key: 'remindPlanedTime1',
    align: 'center'
  },
  {
    title: '出发车次', 
    dataIndex: 'trainNo',
    key: 'trainNo',
    align: 'center'
  },
  {
    title: '出发时间', 
    dataIndex: 'trainDt',
    key: 'trainDt',
    align: 'center'
  },
  {
    title: '入寓时间', 
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center'
  },
  {
    title: '铺位号', 
    dataIndex: 'bedNo',
    key: 'bedNo',
    align: 'center'
  },
  {
    title: '机务段名称', 
    dataIndex: 'ldName',
    key: 'ldName',
    align: 'center'
  },
  {
    title: '到达车次', 
    dataIndex: 'arrivalTrainNo',
    key: 'arrivalTrainNo',
    align: 'center'
  },
  {
    title: '到达时间', 
    dataIndex: 'arrivalTrainDt',
    key: 'arrivalTrainDt',
    align: 'center'
  },
  {
    title: '待乘类型', 
    dataIndex: 'waitDriveType',
    key: 'waitDriveType',
    align: 'center'
  },
  {
    title: '待乘室', 
    dataIndex: 'restName',
    key: 'restName',
    align: 'center'
  },
  ]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 20,
      totalRecs: 200,
      waitingDriveList: [],
      columns,
      spinning: false,
      addBoxShow: false,
      ldVo: {},
      wdResVo: {},
      addState: false,
      title: ''
    }
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.getWaitingDriveList('init')
    })
  },
  components: {
    pagination,
    searchCom
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    getWaitingDriveList (state) {
      this.spinning = true
      this.axios({
        method: 'post',
        data: this.wdResVo,
        url: '/api/venom-rest/getWaitingDriveList',
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.waitingDriveList = data.result.resultList
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-rest/getWaitingDriveList失败', err)
      })
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getWaitingDriveList()
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.wdResVo.restCode = restCode
    },
    userValidate (username) {
      let aa = cookie.getCookie(username)
      if (!aa) {
        this.$router.push({path: '/login'})
        return false
      }
      return true
    },
    resetVo () {
      this.wdResVo = {}
    },
  }
}
</script>
<style>
.update-box {
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  color: rgb(24, 144, 255);
}
.update-box span {
  cursor: pointer;
}
.ellipsis-width {
  width: 200px;
}
</style>
