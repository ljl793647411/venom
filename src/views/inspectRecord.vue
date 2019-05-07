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
          <label for="">工号：</label>
          <a-input class="input" v-model="inspectVo.workNo"/>
        </div>
        <div class="search-input">
          <label for="">姓名：</label>
          <a-input class="input" v-model="inspectVo.name"/>
        </div>
        <div class="search-input">
          <label for="">巡检日期范围：</label>  
          <date-view class="dateInput" @getDateRange="getEnterDate" queryType="M"></date-view>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getInspectList('query')" title="">查询</a-button>
        </div>
        <a-button type="primary" @click="exportExcel">导出</a-button>
        <a ref="exportDowload"></a>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="inspectList" :pagination="false" bordered>
          <div slot="fileName" slot-scope="text" class="">
            <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" @dblclick="bigPhoto(text)" alt="" title="双击查看大图"> -->
            <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
          </div>
          <div slot="checkMeasure" slot-scope="text, record" class="ellipsis-width ellipsis ellipsis1">
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
    title: '职位',
    dataIndex: 'gbjb',
    key: 'gbjb',
    align: 'center'
  },
  {
    title: '巡检时间',
    dataIndex: 'checkTime',
    key: 'checkTime',
    align: 'center'
  },
  {
    title: '登记方式',
    dataIndex: 'checkmanner',
    key: 'checkmanner',
    align: 'center'
  },
  {
    title: '照片',
    dataIndex: 'fileName',
    key: 'fileName',
    scopedSlots: { customRender: 'fileName' },
    align: 'center'
  },
  {
    title: '巡检情况',
    dataIndex: 'checkContent',
    key: 'checkContent',
    align: 'center'
  },
  {
    title: '措施',
    dataIndex: 'checkMeasure',
    key: 'checkMeasure',
    scopedSlots: { customRender: 'checkMeasure' },
    align: 'center',
    width: 200
  },]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      inspectVo: {},
      inspectList: [],
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
      this.getInspectList('init')
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
        url: '/api/cadre/export',
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
      this.inspectVo.fromTime = rangeDate[0]
      this.inspectVo.toTime = rangeDate[1]
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
    getInspectList (state) {
      this.spinning = true
      if (state === 'init') {
        this.inspectVo.ldName = ''
      }
      if (this.inspectVo.workNo) {
        this.inspectVo.workNo = this.inspectVo.workNo.trim()
      }
      if (this.inspectVo.name) {
        this.inspectVo.name = this.inspectVo.name.trim()
      }
			this.inspectVo.pageNo = (state === 'init' || state === 'query') ? 1 : this.pageNo
			this.inspectVo.pageSize = this.pageSize
      this.axios({
        method: 'post',
        url: '/api/cadre/check',
        data: this.inspectVo,
        // params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.inspectList = data.result.resultList
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/cadre/check失败', err)
      })
    },
    resetVo () {
      this.inspectVo = {}
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getInspectList()
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.inspectVo.ldName = ''
      this.inspectVo.restCode = restCode
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
