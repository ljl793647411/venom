<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box">
        <search-com 
          :changeOnSelect="false"
          :dropDown="false"
          :defaultValue="['all', '']"
          @getLdNameOrRestCode="getLdNameOrRestCode"
        ></search-com>
        <div class="search-input">
          <label for="">工号：</label>
          <a-input class="input" v-model="leaveVo.workNo"/>
        </div>
        <div class="search-input">
          <label for="">司机：</label>
          <a-input class="input" v-model="leaveVo.name"/>
        </div>
        <div class="search-input">
          <label for="">入住日期范围：</label>  
          <date-view class="dateInput" @getDateRange="getEnterDate" queryType="M"></date-view>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getLeaveList('query')" title="">查询</a-button>
        </div>
        <a-button type="primary" @click="exportExcel">导出</a-button>
        <a ref="exportDowload"></a>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="leaveList" :pagination="false" bordered>
          <div slot="photoQj" slot-scope="text" class="">
            <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" @dblclick="bigPhoto(text)" alt="" title="双击查看大图"> -->
            <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
          </div>
          <div slot="photoXj" slot-scope="text" class="">
            <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" @dblclick="bigPhoto(text)" alt="" title="双击查看大图"> -->
            <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
          </div>
          <div slot="reason" slot-scope="text, record" class="ellipsis-width ellipsis ellipsis1">
            <div v-text="text" :title="text"></div>
          </div>
        </a-table>  
      </div>
      <div>
        <pagination :pageNo="pageNo" :pageSize="pageSize" :totalRecs="totalRecs" @changePage="changePage"></pagination>
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
import searchCom from '../components/searchCom.vue'
import cookie from '../components/cookie.vue'
import dateView from '../components/dateView.vue'
import {mapState} from 'vuex'
const columns = [{
    title: '待乘室',
    dataIndex: 'address',
    key: 'address',
    align: 'center'
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    key: 'workNo',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '请假人照片',
    dataIndex: 'photoQj',
    key: 'photoQj',
    scopedSlots: { customRender: 'photoQj' },
    align: 'center'
  },
  {
    title: '请假时间',
    dataIndex: 'lyTime',
    key: 'lyTime',
    align: 'center'
  },
  {
    title: '预计销假时间',
    dataIndex: 'yjfhTime',
    key: 'yjfhTime',
    align: 'center'
  },
  {
    title: '销假时间',
    dataIndex: 'hyTime',
    key: 'hyTime',
    align: 'center'
  },
  {
    title: '销假人照片',
    dataIndex: 'photoXj',
    key: 'photoXj',
    scopedSlots: { customRender: 'photoXj' },
    align: 'center'
  },
  {
    title: '请假事由',
    dataIndex: 'reason',
    key: 'reason',
    scopedSlots: { customRender: 'reason' },
    align: 'center'
  },
  {
    title: '请假方式',
    dataIndex: 'way',
    key: 'way',
    align: 'center'
  },
  {
    title: '请假值班员',
    dataIndex: 'qjOperator',
    key: 'qjOperator',
    align: 'center'
  },
  {
    title: '销假值班员',
    dataIndex: 'xjOperator',
    key: 'xjOperator',
    align: 'center'
  }]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      leaveVo: {},
      leaveList: [],
      columns,
      photoShow: false,
      pictureURL: '',
      spinning: false
    }
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.getLeaveList('init')
    })
  },
  components: {
    pagination,
    dateView,
    searchCom
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    exportExcel () {
      this.spinning = true
      let self = this
      this.axios({
        method: 'get',
        url: '/api/holiday/export',
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
    getEnterDate (rangeDate) {
      this.leaveVo.fromTime = rangeDate[0]
      this.leaveVo.toTime = rangeDate[1]
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
    getLeaveList (state) {
      this.spinning = true
      if (state === 'init') {
        this.leaveVo.ldName = ''
      }
      if (this.leaveVo.workNo) {
        this.leaveVo.workNo = this.leaveVo.workNo.trim()
      }
      if (this.leaveVo.name) {
        this.leaveVo.name = this.leaveVo.name.trim()
      }
			this.leaveVo.pageNo = (state === 'init' || state === 'query') ? 1 : this.pageNo
			this.leaveVo.pageSize = this.pageSize
      this.axios({
        method: 'post',
        url: '/api/holiday/record',
        data: this.leaveVo,
        // params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.leaveList = data.result.resultList
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/holiday/record失败', err)
      })
    },
    resetVo () {
      this.leaveVo = {}
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getLeaveList()
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.leaveVo.ldName = ''
      this.leaveVo.restCode = restCode
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
.ellipsis-width {
  width: 200px;
}
</style>
