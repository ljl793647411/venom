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
          <label for="">出发车次：</label>
          <a-input class="input" v-model="trainPlanRes.trainNo"/>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="gettrainPlanList('query')" title="">查询</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="addTrainPlan(1, '')" title="">新增</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="exportExcel">导出</a-button>
        </div>
        <a-upload
          name="file"
          action="/api/venom-train/plan/resolve"
          :before-upload="getFile"
          :showUploadList="false"
          @change="handleChange">
          <a-button type="primary">
            选择文件
          </a-button>
        </a-upload>
        <a ref="exportDowload"></a>
        <a class="download-a-class" href="/Excel/计划维护.xls" download="计划维护.xls" title="点击下载">excel模板下载</a>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="trainPlanList" :pagination="false" bordered>
          <div slot="waitDriveType" slot-scope="text">
            <div v-if="text === 1">机车调休</div>
            <div v-if="text === 2">机车驻班</div>
            <div v-if="text === 3">机车继乘</div>
            <div v-if="text === 4">动车驻班</div>
            <div v-if="text === 5">动车候班</div>
            <div v-if="text === 6">动车间休</div>
          </div>
          <div slot="update" slot-scope="text, record">
            <div class="update-box">
              <span @click="addTrainPlan(2, record)">修改信息
              </span>
              <span>
                <a-popconfirm title="确认删除吗?" @confirm="confirmDel(record.id)" okText="确认" cancelText="取消">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </div>
        </a-table>  
      </div>
      <div>
        <pagination :pageNo="pageNo" :pageSize="pageSize" :totalRecs="totalRecs" @changePage="changePage"></pagination>
      </div>
      <div v-if="addBoxShow">
        <add-train-plan
          ref="userbox"
          :visible="addBoxShow"
          :trainPlanVo="trainPlanVo"
          :title="title"
          :defaultValue="defaultValue"
          :addState="addState"
          @cancel="closeAddBox"
          @ok="submit"
        />
      </div>
    </a-spin>
    <div v-if="uploadShow">
      <upload-tp :uploadList="uploadList" @uploadSuccess="uploadSuccess"></upload-tp>
    </div>
  </div>
</template>
<script>
import uploadTp from '../components/uploadTp.vue'
import config from '../assets/config.vue'
import pagination from '../components/pagination.vue'
import cookie from '../components/cookie.vue'
import searchCom from '../components/searchCom.vue'
import addTrainPlan from '../components/addTrainPlan.vue'
import {mapState} from 'vuex'
const columns = [
  {
    title: '序号',
    dataIndex: 'rownum',
    key: 'rownum',
    align: 'center'
  },
  {
    title: '待乘室名称',
    dataIndex: 'restName',
    key: 'restName',
    align: 'center' 
  },
  {
    title: '待乘室代码',
    dataIndex: 'restCode',
    key: 'restCode',
    align: 'center' 
  },
  {
    title: '机务段',
    dataIndex: 'ldName',
    key: 'ldName',
    align: 'center' 
  },
  {
    title: '铺位号',
    dataIndex: 'bedNo',
    key: 'bedNo',
    align: 'center'
  },
  {
    title: '到达车次', 
    dataIndex: 'arrivalTrainNo',
    key: 'arrivalTrainNo',
    align: 'center'
  },
  {
    title: '到达时刻', 
    dataIndex: 'arrivalTrainDt',
    key: 'arrivalTrainDt',
    align: 'center'
  },
  {
    title: '到开间隔', 
    dataIndex: 'intervalTime',
    key: 'intervalTime',
    align: 'center'
  },
  {
    title: '出发车次', 
    dataIndex: 'trainNo',
    key: 'trainNo',
    align: 'center'
  },
  {
    title: '叫班时刻', 
    dataIndex: 'remindDt',
    key: 'remindDt',
    align: 'center'
  },
  {
    title: '开车时刻', 
    dataIndex: 'trainDt',
    key: 'trainDt',
    align: 'center'
  },
  {
    title: '待乘类型', 
    dataIndex: 'waitDriveType',
    key: 'waitDriveType',
    scopedSlots: { customRender: 'waitDriveType' },
    align: 'center'
  },
  {
    title: '餐券', 
    dataIndex: 'ticket1',
    key: 'ticket1',
    align: 'center'
  },
  {
    title: '操作', 
    key: 'update',
    scopedSlots: { customRender: 'update' },
    align: 'center',
    width: 250
  }]


export default {
  data () {
    return {
      pageNo: 1,
      pageSize: 20,
      totalRecs: 200,
      trainPlanList: [],
      columns,
      spinning: false,
      addBoxShow: false,
      trainPlanVo: {},
      trainPlanRes: {},
      addState: false,
      title: '',
      uploadShow: false,
      tranPlanMap: config.tranPlanMap,
      uploadList: [],
      defaultValue: []
    }
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
      this.gettrainPlanList('init')
    })
  },
  components: {
    pagination,
    addTrainPlan,   
    searchCom,
    uploadTp
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    handleChange(info) {    //导入文件，
      this.spinning = true
      if (info.file.status === 'done') {
        this.uploadState(info.file.response, info.file)   // 导入文件成功之后调用reolve
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`);
      }
    },
    exportExcel () {   // 导出
      let self = this
      this.axios({
        method: 'get',
        url: '/api/venom-train/plan/export',
        params: ''
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          self.$refs.exportDowload.href = '/api2/file?type=trainPlan&fileName=' + data.result.fileName
          self.$refs.exportDowload.download = '/api2/file?type=trainPlan&fileName=' + data.result.fileName
          self.$refs.exportDowload.click()
          this.$message.success('导出成功')
        }else {
          this.$message.error('导出失败' + data.msg)
        }
      }).catch((error) => {
        console.log('导出计划维护失败，', error)
      })
    },
    getFile (file) {   // 在上传之前判断文件是否为xls
      let fileName = file.name.split('.')[1]
      let isXLSX = (fileName === 'xls') || (fileName === 'xlsx')
      if (!isXLSX) {
        this.$message.error('上传的文件只能是 xlsx或xls 格式!');
        this.$store.commit('loadingChangeFalse')
      }
      return isXLSX
    },
    uploadState (response, file) { // 解析成功并且给list赋值，同是打开modal，
      if (response.type === 1) {
        this.spinning = false
        this.uploadShow = true
        this.uploadList = response.result
        let i = 1
        this.uploadList.map((item) => {
          item.rownum = i++
        })
        console.log(this.uploadList)
      } else {
        this.spinning = false
        this.$msg({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: response.msg,
          duration: 5000,
          showClose: true
        })
      }
    },
    uploadSuccess () {  //  上传后台成功，关闭modal并且刷新列表
      this.uploadShow = false
      this.gettrainPlanList()
    },
    addTrainPlan (state, val) {   // 新增修改同时赋值
      this.addBoxShow = true
      let yearObj = this.moment().format('YYYY-MM-DD')
      if (state === 2) {
        this.trainPlanVo = JSON.parse(JSON.stringify(val))
        this.defaultValue = [this.trainPlanVo.ldNameRest, this.trainPlanVo.restCode]
        console.log(this.defaultValue)
        this.title = '修改信息'
        if (this.trainPlanVo.trainDt) {
          this.trainPlanVo.trainDt = this.moment(`${yearObj} ${this.trainPlanVo.trainDt}:00`)
        }
        if (this.trainPlanVo.remindDt) {
          this.trainPlanVo.remindDt = this.moment(`${yearObj} ${this.trainPlanVo.remindDt}:00`)
        }
        if (this.trainPlanVo.arrivalTrainDt) {
          this.trainPlanVo.arrivalTrainDt = this.moment(`${yearObj} ${this.trainPlanVo.arrivalTrainDt}:00`)
        }
        this.addState = true
      } else if (state === 1) {
        this.title = '新增'
        this.addState = false
      }
    },
    submit () {   //   提交新增修改的信息
      const form = this.$refs.userbox.form;
      let self = this
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('表单信息: ', values)
        let url
        if (self.addState) {
          url = '/api/venom-train/plan/update'
          values.id = self.trainPlanVo.id
        } else {
          url = '/api/venom-train/plan/save'
        }
        if (values.trainDt) {
          values.trainDt = values['trainDt'].format('HH:mm')
        }
        if (values.remindDt) {
          values.remindDt = values['remindDt'].format('HH:mm')
        }
        if (values.arrivalTrainDt) {
          values.arrivalTrainDt = values['arrivalTrainDt'].format('HH:mm')
        }
        if (this.tranPlanMap[self.trainPlanVo.waitDriveType] == values.waitDriveType) {
          values.waitDriveType = self.trainPlanVo.waitDriveType
        }
        this.axios({
          method: 'post',
          url: url,
          data: values,
        }).then(res => {
          self.spinning = false
          let data = res.data
          if (data.type === 1) {
            let okMsg = self.addState ? '修改成功' : '新增成功'
            this.$message.success(okMsg)
            this.gettrainPlanList('init')
            form.resetFields();
            self.trainPlanVo = {}
            self.addBoxShow = false;
            self.addState = false
          } else {
            let cancelMsg = self.addState ? '修改失败' : '新增失败'
            this.$message.error(cancelMsg)
            console.log(data.msg)
          }
        }).catch(err => {
          self.spinning = false
          console.log(`请求${url}失败`, err)
        })
      });
    },
    closeAddBox () {  //关闭新增修改modal并重置数据
      const form = this.$refs.userbox.form;
      form.resetFields();
      this.trainPlanVo = {}
      this.defaultValue = []
      this.addBoxShow = false
      this.addState = false
    },
    confirmDel (id) {  // 删除方法
      this.axios({
        method: 'post',
        url: '/api/venom-train/plan/delete',
        data: {
          'id': id
        }
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.$message.success('删除成功')
          this.gettrainPlanList('init')
        } else {
          this.$message.error('删除失败')
          console.log(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-train/plan/delete失败', err)
      })
    },
    gettrainPlanList (state) {  //查询获取信息列表 
      this.spinning = true
      this.axios({
        method: 'post',
        data: this.trainPlanRes,
        url: '/api/venom-train/plan/findByPage',
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.trainPlanList = data.result.resultList
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-train/plan/findByPage失败', err)
      })
    },
    changePage (pageNo, pageSize) {   //切换页面
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.gettrainPlanList()
    },
    userValidate (username) {   //验证是否登录
      let aa = cookie.getCookie(username)
      if (!aa) {
        this.$router.push({path: '/login'})
        return false
      }
      return true
    },
    getLdNameOrRestCode (ldName, restCode) {   // 筛选条件，restCode
      this.trainPlanRes.restCode = restCode
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
.download-a-class {
  color: rgb(64, 158, 255);
  font-size: 14px;
  line-height: 30px;
  margin-left: 20px;
}

</style>
