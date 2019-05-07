<template>
  <div>
    <a-range-picker @change="dateOnChange" :disabledDate="disabledDate" :defaultValue="defaultDate"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dateInit: []
    }
  },
  computed: {
    defaultDate: function () {
      if (this.queryType === 'M') {
        return [this.moment().subtract(29,'d'), this.moment()]
      } else  if (this.queryType === 'W') {
        return [this.moment().subtract(6,'d'), this.moment()]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let from, momentFrom
      if (this.queryType === 'M') {
        from = this.moment().subtract(29,'d').format('YYYY-MM-DD')
        momentFrom = this.moment().subtract(29,'d')
      } else if (this.queryType === 'W') {
        from = this.moment().subtract(6,'d').format('YYYY-MM-DD')
        momentFrom = this.moment().subtract(6,'d')
      }
      let momentTo = this.moment()
      let to = this.moment().format('YYYY-MM-DD')
      this.dateInit = [from, to]
      this.dateOnChange([momentFrom, momentTo], this.dateInit)
    })
  },
  props: ['queryType'],
  methods: {
    dateOnChange(date, dateString) {
      let sevenDayMs = 30*24*60*60*1000
      let fromMs = this.moment(date[0]).valueOf()
      let toMs = this.moment(date[1]).valueOf()
      if (this.queryType === 'W') {
        if (toMs - fromMs > sevenDayMs) {
          this.$message.error('日期范围最大选择一个月')
          return
        }
      }
      this.$emit('getDateRange', dateString)
    },
    disabledDate(current) {
      return current && current > this.moment().endOf('day');
    }
  }
}
</script>

<style>

</style>
