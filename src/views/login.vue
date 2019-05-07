
<template>
  <div id="login-box">
    <div class="login-content">
      <h1 class="login-title">待乘数据汇总系统</h1>
      <div class="login-content-bottom">
        <p class="login-input">
          <label for="username">用户名：</label>
          <a-input id="username" class="input" v-model="username"></a-input>
        </p>
        <p class="login-input">
          <label for="password">密码：</label>
          <a-input id="password" class="input" v-model="password" :type="passwordType"></a-input>
          <a-icon type="eye" class="password-eyes cursor" v-if="passwordType === 'password'" @click="changeEyes(1)"/>
          <a-icon type="eye-invisible" class="password-eyes cursor" v-if="passwordType === 'text'" @click="changeEyes(0)"/>
        </p>
        <p class="login-input" style="height: 32px;"> 
          <span class="error" v-text="errorMsg" v-show="errorMsg"></span>
        </p>
        <p class="login-input">
          <a-button type="primary" class="button" @click="login">登录</a-button>
          <!-- <span class="register cursor" @click="openRegisterBox">点击注册</span> -->
        </p>
      </div>
    </div>
    <div v-if="registerShow">
      <register @closeRegisterBox="closeRegisterBox"></register>
    </div>
  </div>
</template>
<script>
import cookie from '../components/cookie'
import register from '../components/register'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      loginVo: {},
      passwordType: 'password',
      errorMsg: '',
      username: '',
      password: '',
      errorTime: 0,
      registerShow: false
    }
  },
  computed: {

  },
  components: {
    register
  },
  mounted () {
    this.$nextTick(() => {
      document.onkeydown = (evt) => {
        let key
        if (window.event) { // IE/Chrome/Opera(新版本)
          key = evt.keyCode
        } else if (evt.which) { // Netscape/Firefox/Opera/Chrome/IE（新版本）
          key = evt.which
        }
        if (this.$route.path === '/login') {
          if (key === 13) {
            this.login()
          }
        } 
      }
    })
  },
  methods: {
    openRegisterBox () {
      this.registerShow = true
    },
    closeRegisterBox (username, password) {
      this.registerShow = false
      // this.loginSuccess(username, password)
    },
    changeEyes (num) {
      if (num === 1) {
        this.passwordType = 'text'
      } else if (num === 0) {
        this.passwordType = 'password'
      }
    },
    login () {
      if (!this.username.replace(/\s*/g,"")) {
        this.errorMsgFun('用户名不能为空')
        return
      } else {
        this.loginVo.username = this.username.replace(/\s*/g,"")
      }
      if (!this.password.replace(/\s*/g,"")) {
        this.errorMsgFun('密码不能为空')
        return
      } else {
        this.loginVo.password = this.password.replace(/\s*/g,"")
      }
      // this.loginSuccess(this.loginVo.username, this.loginVo.password)
      this.axios({
        method: 'post',
        data: this.loginVo,
        url: '/api/venom-account/login'
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$message.success('登录成功')
          this.loginSuccess(this.loginVo.username, this.loginVo.password)
          this.$store.dispatch('getInitList')
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log('请求/api/venom-account/login错误', err)
      })
    },
    loginSuccess (username, password) {
      cookie.setCookie('venomUsername', username, 0)
      this.$router.push({path: '/'})
    },
    errorMsgFun (msg) {
      clearTimeout(this.errorTime)
      this.errorMsg = msg
      this.errorTime = setTimeout(() => {
        this.errorMsg = ''
      }, 3000)
    } 
  }
}
</script>
<style>
  #login-box {
    width: 100vw;
    height: 100vh;
    background-image: url('../../public/img/bj.jpg');
    background-repeat: no-repeat;
    position: relative;
  }
  .login-content {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .login-content-bottom {
    width: 80%;
    height: 70%;
    padding: 20px;
    margin: 0 auto;
    margin-top: 50px;
  }
  .login-title {
    font-size: 40px;
    color: rgb(4, 32, 84);
    font-weight: bold;
    font-family: '微软雅黑';
    text-align: center;
    letter-spacing: 5px;
    user-select: none;
  }
  .login-input {
    margin: 30px auto;
    position: relative;
  }
  .login-input label {
    width: 20%;
    display: inline-block;
    font-size: 18px;
    color: #000;
    line-height: 32px;
    text-align: right;
    user-select: none;
  }
  .login-input .input {
    width: 70%;
  }
  .login-input:nth-last-child(1) {
    margin-top: 50px;
  }
  .login-input .button {
    width: 200px;
    margin-left: 75px;
  }
  .password-eyes {
    position: absolute;
    top: 13px;
    right: 45px;
  }
  .error {
    color: red;
    font-size: 14px;
    float: right; 
  }
  .register {
    color: rgb(49, 49, 49);
    font-size: 14px;
    margin-left: 15px;
  }
  .register:hover {
    color: #0501ff;
  }
</style>
