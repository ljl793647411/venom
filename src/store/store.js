import vuex from 'vuex'
import axios from 'axios'
// import moment from 'moment'

export default () => {
  return new vuex.Store({
    state: {
      options: [],
      driverLdNameList: [],
      username: ''
    },
    getters: {

    },
    mutations: {
      setInitList (state, data) {
        let obj = {}
        obj.value = 'all'
        obj.label = '全部'
        obj.children = []
        state.options = data
        state.options.unshift(obj)
      },
      setdriverLdNameList (state, data) {
        let obj1 = {}
        obj1.value = 'all'
        obj1.label = '全部'
        state.driverLdNameList = data
        state.driverLdNameList.unshift(obj1)
      },
      setUserName (state, name) {
        state.username = name  
      }
    },
    actions: {
      getInitList (store) {   //  获取组织架构\
        axios({
          method: 'get',
          url: '/api/venom-train/list-drop-down',
        }).then((res) => {
          let data = res.data
          if (data.type === 1) {
            store.commit('setInitList', data.result.list)
            store.commit('setdriverLdNameList', data.result.driverLdNames)
          }
        }).catch((err) => { 
          console.log('请求/api/venom-train/list-drop-down连接失败', err)
        })
      }
    }
  })
}