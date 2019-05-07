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
          <a-input class="input" v-model="leaderVo.workNoLike"/>
        </div>
        <div class="search-input">
          <label for="">姓名：</label>
          <a-input class="input" v-model="leaderVo.nameLike"/>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getLeaderList('query')" title="">查询</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="driverList" :pagination="false" bordered>
          <div slot="fileName" slot-scope="text" class="tablePhoto">
            <img class="cursor" :src="`api2/image?type=driver&fileName=${text}`" @dblclick="bigPhoto(text)" alt="" title="双击查看大图">
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
    title: '站点名称',
    dataIndex: 'spotName',
    key: 'spotName',
    align: 'center'
  },{
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
    dataIndex: 'gbName',
    key: 'gbName',
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
    dataIndex: 'gblrsj',
    key: 'gblrsj',
    align: 'center'
  }]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 10,
      totalRecs: 200,
      leaderVo: {},
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
      this.getLeaderList('init')
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
    getLeaderList (state) {
      this.spinning = true
      if (state === 'init') {
        this.leaderVo.ldName = 'all'
      }
      if (this.leaderVo.workNoLike) {
        this.leaderVo.workNoLike = this.leaderVo.workNoLike.trim()
      }
      if (this.leaderVo.nameLike) {
        this.leaderVo.nameLike = this.leaderVo.nameLike.trim()
      }
			this.leaderVo.pageNo = (state === 'init' || state === 'query') ? 1 : this.pageNo
			this.leaderVo.pageSize = this.pageSize
      this.axios({
        method: 'post',
        url: '/api/venom-driver/list-by-page',
        data: this.leaderVo,
        // params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.driverList = data.result.resultList
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-driver/list-by-page失败', err)
      })
    },
    resetVo () {
      this.leaderVo = {}
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getLeaderList()
    },
    getOnlyLdName (value) {
      this.leaderVo.ldName = value
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
