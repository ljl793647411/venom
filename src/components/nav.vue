<template>
  <div id="nav">
    <div class="nav-box">
      <div v-for="nav in navList" @click="getNavTitle(nav.name)" :key="nav.name">
        <router-link :to="nav.url" :class="{'select-active': nav.name == navTitle}">
          <div class="nav-icon">
            <img :src="nav.icon" alt="">
          </div>
          <div class="nav-name" v-text="nav.name"></div>
        </router-link>
      </div>
    </div>
    <div class="outline"></div>
    <div class="nav-title" v-text="navTitle"></div>
  </div>
</template>

<script>
import config from '../assets/config.vue'

export default {
  data () {
    return {
      navList: config.navList,
      navTitle: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.navTitle = this.$route.name
    })
  },
  component: {
    config
  },
  methods: {
    getNavTitle (name) {
      this.navTitle = name
    }
  }
}
</script>

<style>
  #nav {
    width: 100%;
    height: 100px;
    background-image: linear-gradient(to top, #39496a, #4a5f89);
    background-color: #39496a;
    margin-bottom: 30px;
  }
  .nav-box {
    overflow: hidden;
  }
  .nav-box a {
    display: block;
    float: left;
    width: 130px;
    height: 100px;
    box-sizing: border-box;
    border-right: 1px solid #1b2f54;
    border-left: 1px solid #576b8f;
  }
  .nav-box a:hover {
    background-color: #5b75a8;
    text-decoration:none;
  }
  .nav-box .nav-icon {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    margin-top: 10px;
  }
  .nav-box .nav-name {
    line-height: 30px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-top: 10px;
  }
  .outline {
    width: 100%;
    height: 5px;
    background: rgb(24, 146, 253);
  }
  .select-active {
    background-color: #5b75a8;
    text-decoration:none;
  }
  .nav-title {
    width: 100%;
    height: 25px;
    background: rgb(214, 214, 214);
    line-height: 25px;
    font-size: 12px;
    padding-left: 20px;
    box-sizing: border-box;
  }
</style>
