<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <login v-if="$route.path === '/login'"></login>
      <div v-else>
        <header-com></header-com>
        <nav-com></nav-com>
        <router-view class="view"/>
      </div>
    </div>
  </a-locale-provider>
</template>
<script> 
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import headerCom from './components/header.vue'
import navCom from './components/nav.vue'
import login from './views/login.vue'
import cookie from '@/components/cookie'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      locale: zhCN,
    }
  },
  mounted () {
    this.$store.dispatch('getInitList')
  },
  components: {
    headerCom,
    navCom,
    login
  }
}
</script>
<style>
/* public style */
html body {
  height: 100%;
}
body,ul,ol,li,p,h1,h2,h3,h4,h5,h6,form,fieldset,table,td,img,div{margin:0;padding:0;border:0;} 
body{background:#fff;color:#333;font-size:12px;font-family:"微软雅黑";} 

ul,ol{list-style-type:none;} 
select,input,img,select{vertical-align:middle;} 
a{text-decoration:none !important;}
img {
  width: 100%;
  height: 100%;
}
.view {
  width: 100%;
  height: calc(100vh - 191px);
  padding: 20px
}
.search-box {
  width: 100%;
  height: auto;
  min-height: 60px;
  border: 1px solid #b4c8ed;
  background-color: #f0f4fa;
  border-radius: 5px;
  padding: 15px 10px 0;
  display: flex;
  flex-wrap: wrap;
}
.search-input {
  margin-right: 20px;
  margin-bottom: 15px;
}
.search-input label {
  display: inline-block;
  font-size: 14px;
  color: #000;
  line-height: 28px;
}
.search-input .input {
  display: inline-block;
  width: 150px;
  font-size: 12px;
  color: #000;
}
.search-input .dateInput {
  display: inline-block;
  width: 300px;
}
.search-button {
  margin-right: 20px;
}
.table {
  margin-top: 20px;
}

.tablePhoto {
  width: 68px;
  height: 50px;
  margin: 0 auto;
}
.bigPhoto {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 600px;
  height: 500px;
  padding: 30px;
  z-index: 1;
}
.bigPhoto img {
  width: 100%;
  height: 100%;
}
.cursor {
  cursor: pointer;
}
.font-color-red {
  color: red;
}
/* 文本换行样式 */
 .ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
}
.ellipsis1 {
  -webkit-line-clamp:1; 
}
.ellipsis2 {
  -webkit-line-clamp: 2;
}

/* antd样式 */
.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 5px 0 !important;
}
#app .ant-select-auto-complete.ant-select .ant-select-selection__rendered {
  line-height: 28px;
  height: 32px;
}
</style>
