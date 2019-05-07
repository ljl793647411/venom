<template>
  <div>
    <div class="search-com" v-if="dropDown">
      <div class="search-input"><label for="">机务段：</label>
        <a-select
          :allowClear="true"
          showSearch
          optionFilterProp="children"
          style="width: 150px"
          @change="dropDownFunc"
          :filterOption="filterOption">
        <a-select-option v-for="val in driverLdNameList" :value="val.value" :key="val.value">{{val.label}}</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="search-com" v-if="!dropDown">
      <div class="search-input">
        <label v-if="labelShow" for="">待乘室：</label>
        <a-cascader :options="options" :defaultValue="defaultValue" @change="ldNameOnChange" @popupVisibleChange="restRoomShowChange" :changeOnSelect="changeOnSelect" style="width: 235px" placeholder="请选择机务段及待乘室" :allowClear="false"/>
      </div>
      <div class="search-input" v-if="trainNoShow && restRoomShow && restCode">
        <label for="">车次号：</label>
        <a-auto-complete
          :allowClear="true"
          :dataSource="trianNoDataSource"
          style="width: 150px"
          @select="trainNoOnSelect"
          @focus="trainNoFocus"
          @search="trainNoHandleSearch"
        />
      </div>
      <div class="search-input" v-if="bedNoShow && restRoomShow && restCode">
        <label for="">铺位号：</label>
        <a-auto-complete
          :allowClear="true"
          :dataSource="bedNoDataSource"
          style="width: 150px"
          @select="bedNoOnSelect"
          @search="bedNoHandleSearch" 
          @focus="bedNoFocus"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  data () {
    return {
      ldName: '',
      restCode: '',
      trainNo: '',
      bedNo: '',
      restRoomShow: false,
      bedNoList: [],
      trainNoList: [],
      trianNoDataSource: [],
      bedNoDataSource: [],
      labelShow: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (typeof this.labelShowRes == 'boolean' && !this.labelShowRes) {
        this.labelShow = this.labelShowRes
      }
    })
  },
  props: ['changeOnSelect', 'bedNoShow', 'trainNoShow', 'dropDown', 'defaultValue', 'labelShowRes'],
  computed: {
    ...mapState(['options', 'driverLdNameList'])
  },
  methods: {
    trainNoFocus () {
      // console.log('清空DataSource')
      this.trianNoDataSource = []
    },
    trainNoHandleSearch(value) {
      this.trianNoDataSource = []
      // console.log('value', value)
      for (let i in this.trainNoList) {
        if (this.trainNoList[i].trainNo.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          this.trianNoDataSource.push(this.trainNoList[i].trainNo)
        }
      }
      this.$emit('getTrainNo', value)
    },
    trainNoOnSelect(value) {
      this.$emit('getTrainNo', value)
    },
    bedNoFocus () {
      // console.log('清空DataSource')
      this.bedNoDataSource = []
    },
    bedNoHandleSearch(value) {
      this.bedNoDataSource = []
      // console.log('开始筛选')
      // console.log('value2', value)
      for (let i in this.bedNoList) {
        if (this.bedNoList[i].bedNo.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          this.bedNoDataSource.push(this.bedNoList[i].bedNo)
        }
      }
      this.$emit('getBedNo', value)
    },
    bedNoOnSelect(value) {
      this.$emit('getBedNo', value)
    },
    dropDownFunc (value) {
      this.$emit('getOnlyLdName', value)
    },
    ldNameOnChange (value) {
      if (value && value.length === 1) {
        this.ldName = value[0]
        this.restCode = ''
        this.bedNoList = []
        this.trainNoList = []
        this.$emit('getLdNameOrRestCode', this.ldName, '')
      } else if (value && value.length === 2) {
        this.ldName = value[0]
        this.restCode = value[1]
        this.$emit('getLdNameOrRestCode', this.ldName, this.restCode)
        for (let i in this.options) {
          if (this.options[i].value === this.ldName) {
            for (let j in this.options[i].children) {
              if (this.options[i].children[j].value === this.restCode) {
                this.bedNoList = this.options[i].children[j].resultList.bedList
                this.trainNoList = this.options[i].children[j].resultList.trainList
              }
            }
          }
        }
      }
    },
    restRoomShowChange (value) {
      if (value) {
        this.restRoomShow = false
      } else {
        this.restRoomShow = true
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style>
  .search-com {
    display: flex;
  }
</style>
