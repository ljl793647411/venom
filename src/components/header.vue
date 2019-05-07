<template>
  <div id="header">
    <div class="name-class">
      <div class="icon-header">
        <img src="/img/logo.png" alt="">
      </div>
      <span class="header-separator">|</span>
      <span class="header-name">待乘数据汇总系统</span>
    </div>
    <div class="login-messge-box"> 
      欢迎
      <span v-text="username"></span>
      <span class="">|</span>
      <span v-text="" @click="logout" class="cursor" style="color: #1890ff">注销</span>
    </div>
  </div>
</template>

<script>
import cookie from '../components/cookie.vue'
import {mapState} from 'vuex'
import config from '../assets/config.vue'
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapState(['username'])
  },
  methods: {
    logout () {
      this.$router.push({path: '/login'})
      cookie.delCookie(this.username)
    }
  }
}
</script> 

<style>
  #header {
    width: 100%;
    height: 60px;
    background-image: linear-gradient(to top, #39496a, #4a5f89);
    background-color: #39496a;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #39496a;
  }
  .name-class {
    color: #fff;
    font-size: 20px;
    font-family: microsoft yahei;
    line-height: 60px;
    float: left;
    letter-spacing: 4px;
    user-select: none;
  }
  .icon-header {
    width: 50px;
    height: 50px;
    display: inline-block;
    margin-right: 20px;
  }
  .icon-header img {
    width: 100%;
    height: 100%;
  }
  .header-name {
    margin-left: 20px;
  }
  .header-separator {
    font-size: 26px;
    line-height: 30px;
  }
  .login-messge-box {
    width: 15%;
    float: right;
    line-height: 60px;
    font-size: 16px;
    color: #fff;
    user-select: none;
  }
  .login-messge-box span{
    margin-right: 10px;
  }
</style>
