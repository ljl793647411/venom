<template>
  <div id="home">
    
  </div>
</template>

<script>
import cookie from '../components/cookie.vue'
import {mapState} from 'vuex'
export default {
  computed: {
    ...mapState(['username'])
  },
  mounted () {
    this.$store.commit('setUserName', cookie.getCookie())
    this.$nextTick(() => {
      if (!this.userValidate(this.username)) {
        return
      }
    })
  },
  methods: {
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
#home {
  background-image: url('../../public/img/bj.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
}


</style>
