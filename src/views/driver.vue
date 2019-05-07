<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box">
        <search-com 
          :changeOnSelect="true"
          :dropDown="true"
          :bedNoShow="false"
          :trainNoShow="false"
          @getOnlyLdName="getOnlyLdName">
        </search-com>
        <div class="search-input">
          <label for="">工号：</label>
          <a-input class="input" v-model="driverVo.workNoLike"/>
        </div>
        <div class="search-input">
          <label for="">司机：</label>
          <a-input class="input" v-model="driverVo.nameLike"/>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getDriverList('query')" title="">查询</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="driverList" :pagination="false" bordered>
          <div slot="fileName" slot-scope="text" class="">
            <!-- <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" @dblclick="bigPhoto(text)" alt="" title="双击查看大图"> -->
            <a v-if="text" href="#" @click="bigPhoto(text)" title="双击查看大图">查看</a>
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
import {mapState} from 'vuex'
const columns = [{
    title: '机务段',
    dataIndex: 'ldName',
    key: 'ldName',
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
    title: '照片',
    dataIndex: 'fileName',
    key: 'fileName',
    scopedSlots: { customRender: 'fileName' },
    align: 'center'
  },
  {
    title: '注册时间',
    dataIndex: 'createdDt',
    key: 'createdDt',
    align: 'center'
  }]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      driverVo: {},
      driverList: [],
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
      this.getDriverList('init')
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
    getDriverList (state) {
      this.spinning = true
      if (state === 'init') {
        this.driverVo.ldName = 'all'
      }
      if (this.driverVo.workNoLike) {
        this.driverVo.workNoLike = this.driverVo.workNoLike.trim()
      }
      if (this.driverVo.nameLike) {
        this.driverVo.nameLike = this.driverVo.nameLike.trim()
      }
      this.axios({
        method: 'post',
        url: '/api/venom-driver/list-by-page',
        data: this.driverVo,
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.driverList = data.result.resultList
        } else {
          this.$message.error('查询失败')
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-driver/list-by-page失败', err)
      })
    },
    resetVo () {
      this.driverVo = {}
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getDriverList()
    },
    getOnlyLdName (value) {
      this.driverVo.ldName = value
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
</style>
