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
        <div class="search-button">
          <a-button type="primary" @click="getldList('query')" title="">查询</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="addUser(1, '')" title="">添加站点</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="ldList" :pagination="false" bordered>
          <div slot="update" slot-scope="text, record">
            <div class="update-box">
              <span @click="addUser(2, record)">修改信息
              </span>
              <span>
                <a-popconfirm title="确认删除吗?" @confirm="confirmDel(record.sid)" okText="确认" cancelText="取消">
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
      <add-ip-box
        ref="userbox"
        :visible="addBoxShow"
        :ldVo="ldVo"
        :title="title"
        @cancel="closeAddBox"
        @ok="submit"
      />
    </a-spin>
  </div>
</template>
<script>
import pagination from '../components/pagination.vue'
import cookie from '../components/cookie.vue'
import addIpBox from '../components/addIpBox.vue'
import searchCom from '../components/searchCom.vue'
import {mapState} from 'vuex'
const columns = [
  {
    title: '序号', 
    dataIndex: 'rownum',
    key: 'rownum',
    align: 'center'
  }, 
  {
    title: '机务段', 
    dataIndex: 'ldName',
    key: 'ldName',
    align: 'center'
  },
  {
    title: '站点名称',
    dataIndex: 'restName',
    key: 'restName',
    align: 'center' 
  },
  {
    title: '站点代码',
    dataIndex: 'restCode',
    key: 'restCode',
    align: 'center' 
  },
  {
    title: '站点ip', 
    dataIndex: 'ip',
    key: 'ip',
    align: 'center'
  },
  {
    title: '端口', 
    dataIndex: 'rport',
    key: 'rport',
    align: 'center'
  },
  {
    title: '叫班模式', 
    dataIndex: 'mode',
    key: 'mode',
    align: 'center'
  },
  {
    title: '联系电话', 
    dataIndex: 'phone',
    key: 'phone',
    align: 'center'
  },
  {
    title: '创建时间', 
    dataIndex: 'createdDt',
    key: 'createdDt',
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
      pageSize: 10,
      totalRecs: 200,
      ldList: [],
      columns,
      spinning: false,
      addBoxShow: false,
      ldVo: {},
      ldResVo: {},
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
      this.getldList('init')
    })
  },
  components: {
    pagination,
    addIpBox,
    searchCom
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    addUser (state, val) {
      this.addBoxShow = true
      if (state === 2) {
        this.ldVo = val
        this.addState = true
        this.title = '修改信息'
      } else if (state === 1) {
        this.title = '添加站点'
        this.addState = false
      }
    },
    submit () {
      const form = this.$refs.userbox.form;
      let self = this
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('表单信息: ', values)
        let url
        if (self.addState) {
          url = '/api/site/update'
          values.sid = self.ldVo.sid
        } else {
          url = '/api/site/add'
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
            this.getldList('init')
            form.resetFields();
            self.ldVo = {}
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
    closeAddBox () {
      const form = this.$refs.userbox.form;
      form.resetFields();
      this.ldVo = {}
      this.addBoxShow = false
      this.addState = false
    },
    confirmDel (sid) {
      this.axios({
        method: 'post',
        url: '/api/site/delete',
        data: {
          'sid': sid
        }
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.$message.success('删除成功')
          this.getldList('init')
        } else {
          this.$message.error('删除失败')
          console.log(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/site/delete失败', err)
      })
    },
    getldList (state) {
      this.spinning = true
      this.axios({
        method: 'post',
        data: this.ldResVo,
        url: '/api/site/findByPage',
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.ldList = data.result.resultList
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/site/findByPage失败', err)
      })
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getldList()
    },
    getLdNameOrRestCode (ldName, restCode) {
      this.ldResVo.ldName = ''
      this.ldResVo.restCode = restCode
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
.update-box {
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  color: rgb(24, 144, 255);
}
.update-box span {
  cursor: pointer;
}
</style>
