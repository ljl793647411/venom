<template>
  <div>
    <a-spin :spinning="spinning">
      <div class="search-box">
        <div class="search-input">
          <label for="">工号：</label>
          <a-input class="input" v-model="userRes.workNo"/>
        </div>
        <div class="search-input">
          <label for="">姓名：</label>
          <a-input class="input" v-model="userRes.username"/>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="getUserList('query')" title="">查询</a-button>
        </div>
        <div class="search-button">
          <a-button type="primary" @click="addUser(1, '')" title="">添加用户</a-button>
        </div>
      </div>
      <div class="table">
        <a-table :columns="columns" :dataSource="userList" :pagination="false" bordered>
          <div slot="update" slot-scope="text, record">
            <div class="update-box">
              <span @click="addUser(2, record)">修改信息
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
      <add-user-box
        ref="userbox"
        :visible="addBoxShow"
        :userVo="userVo"
        :title="title"
        :addState="addState"
        @cancel="closeAddBox"
        @ok="submit"
      />
    </a-spin>
  </div>
</template>
<script>
import pagination from '../components/pagination.vue'
import cookie from '../components/cookie.vue'
import addUserBox from '../components/addUserBox.vue'
import {mapState} from 'vuex'
const columns = [{
    title: '序号',
    dataIndex: 'rownum',
    key: 'rownum',
    align: 'center'
  },
  {
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
    align: 'center' 
  },
  {
    title: '工号',
    dataIndex: 'workNo',
    key: 'workNo',
    align: 'center'
  },
  {
    title: '创建时间', 
    dataIndex: 'regtime',
    key: 'regtime',
    align: 'center'
  },
  {
    title: '备注', 
    dataIndex: 'note',
    key: 'note',
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
      userList: [],
      columns,
      spinning: false,
      addBoxShow: false,
      userVo: {},
      userRes: {},
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
      this.getUserList('init')
    })
  },
  components: {
    pagination,
    addUserBox
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    addUser (state, val) {
      this.addBoxShow = true
      if (state === 2) {
        this.userVo = val
        this.addState = true
        this.title = '修改信息'
      } else if (state === 1) {
        this.title = '添加用户'
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
          url = '/api/venom-account/update'
          values.id = self.userVo.id
        } else {
          url = '/api/venom-account/register'
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
            this.getUserList('init')
            form.resetFields();
            self.userVo = {}
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
      this.userVo = {}
      this.addBoxShow = false
      this.addState = false
    },
    confirmDel (id) {
      this.axios({
        method: 'post',
        url: '/api/venom-account/delete',
        data: {
          'id': id
        }
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.$message.success('删除成功')
          this.getUserList('init')
        } else {
          this.$message.error('删除失败')
          console.log(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-account/delete失败', err)
      })
    },
    getUserList (state) {
      this.spinning = true
      this.axios({
        method: 'post',
        data: this.userRes,
        url: '/api/venom-account/findByPage',
        params: {'pageNo': (state === 'init' || state === 'query') ? 1 : this.pageNo, 'pageSize': this.pageSize},
      }).then(res => {
        this.spinning = false
        let data = res.data
        if (data.type === 1) {
          this.pageNo = data.result.pageNo
          this.pageSize = data.result.pageSize
          this.totalRecs = data.result.totalRecs
          this.userList = data.result.resultList
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.spinning = false
        console.log('请求/api/venom-account/findByPage失败', err)
      })
    },
    changePage (pageNo, pageSize) {
      this.pageNo = pageNo
      this.pageSize = pageSize
      this.getUserList()
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
