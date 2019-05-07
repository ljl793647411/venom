<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box" style="padding-right: 14%;">
        <search-com 
          :changeOnSelect="false"
          :defaultValue="['all', '']"
          :dropDown="false"
          @getLdNameOrRestCode="getLdNameOrRestCode"
        ></search-com>
        <div class="search-input">
          <label for="">交班人工号：</label>
          <a-input class="input" v-model="changeVo.jjrNo"/>
        </div>
        <div class="search-input">
          <label for="">交班人姓名：</label>
          <a-input class="input" v-model="changeVo.jjr"/>
        </div>
        <div class="search-input">
          <label for="">接班人工号：</label>
          <a-input class="input" v-model="changeVo.jsrNo"/>
        </div>
        <div class="search-input">
          <label for="">接班人姓名：</label>
          <a-input class="input" v-model="changeVo.jsr"/>
        </div>
        <div class="search-input">
          <label for="">交接日期范围：</label>  
          <date-view class="dateInput" @getDateRange="getEnterDate" queryType="M"></date-view>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getChangeList('query')" title="">查询</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="resetVo" title="">重置</a-button>
        </div>
        <a-button type="primary" @click="exportExcel">导出</a-button>
        <a ref="exportDowload"></a>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="changeList" :pagination="false" bordered>
          <div slot="jjcontent" slot-scope="text, record" class="ellipsis-width ellipsis ellipsis1">
            <div v-text="text" :title="text"></div>
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
    title: '交班人',
    dataIndex: 'jjr',
    key: 'jjr',
    align: 'center'
  },
  {
    title: '交班人工号',
    dataIndex: 'jjrNo',
    key: 'jjrNo',
    align: 'center'
  },
  {
    title: '接班人',
    dataIndex: 'jsr',
    key: 'jsr',
    align: 'center'
  },
  {
    title: '接班人工号',
    dataIndex: 'jsrNo',
    key: 'jsrNo',
    align: 'center'
  },
  {
    title: '交班内容',
    dataIndex: 'jjcontent',
    key: 'jjcontent',
    scopedSlots: { customRender: 'jjcontent' },
    width: 200,
    align: 'center'
  },
  {
    title: '交接时间',
    dataIndex: 'jjTime',
    key: 'jjTime', 
    align: 'center'
  },
  {
    title: '终端总个数',
    dataIndex: 'total',
    key: 'total',
    align: 'center'
  },
  {
    title: '已使用个数',
    dataIndex: 'useNo',
    key: 'useNo',
    align: 'center'
  },
  {
    title: '剩余个数',
    dataIndex: 'remainNo',
    key: 'remainNo',
    align: 'center'
  },
  {
    title: '故障数',
    dataIndex: 'brokenNo',
    key: 'brokenNo',
    align: 'center'
  }]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      changeVo: {},
      changeList: [],
      columns,
      spinning: false
    }
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.getChangeList('init')
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
        url: '/api/handerover/export',
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
      this.changeVo.fromTime = rangeDate[0]
      this.changeVo.toTime = rangeDate[1]
    },
    getChangeList (state) {
      this.spinning = true
      if (state === 'init') {
        this.changeVo.ldName = ''
      }
      if (this.changeVo.jjr) {
        this.changeVo.jjr = this.changeVo.jjr.trim()
      }
      if (this.changeVo.jjrNo) {
        this.changeVo.jjrNo = this.changeVo.jjrNo.trim()
      }
			this.changeVo.pageNo = (state === 'init' || state === 'query') ? 1 : this.pageNo
			this.changeVo.pageSize = this.pageSize
      this.axios({
        method: 'post',
        url: '/api/handerover/record',
        data: this.changeVo,
        // params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.changeList = data.result.resultList
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/handerover/record失败', err)
      })
    },
    resetVo () {
      this.changeVo = {}
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getChangeList()
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.changeVo.ldName = ''
      this.changeVo.restCode = restCode
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
