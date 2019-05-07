<template>
  <div class="page-class">
    <a-pagination 
    showSizeChanger 
    showQuickJumper 
    :showTotal="total => `总计 ${total} 条`"
    :pageSizeOptions="pageSizeOptions"
    @showSizeChange="onShowSizeChange" 
    :defaultCurrent="1" 
    :pageSize.sync="pageSize"
    :total="totalRecs" 
    v-model="current"
    @change="onChange"/>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        pageSizeOptions: ['10','20','30','40','50'],
        current: 1
      }
    },
    props: ['pageNo', 'pageSize', 'totalRecs'],
    mounted () {
      this.$nextTick(() => {
        this.current = this.pageNo
      })
    },
    watch: {
      'pageNo': function (val) {
        this.current = val
      }
    },
    methods: {
      onShowSizeChange(pageNo, pageSize) {
        this.current = 1
        this.$emit('changePage', 1, pageSize)
      },
      onChange (pageNo, pageSize) {
        this.$emit('changePage', pageNo, pageSize)
      }
    }
  }
</script>
<style>
.page-class {
  margin-top: 20px;
}

</style>
