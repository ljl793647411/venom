<template>
  <div>
    <a-select :defaultValue="provinceData[0]" style="width: 120px" @change="handleProvinceChange">
      <a-select-option v-for="province in provinceData" :key="province">{{province}}</a-select-option>
    </a-select>
    <a-select mode="multiple" v-model="secondCity" style="width: 120px" @change="handleChange">
      <a-select-option v-for="city in cities" :key="city">{{city}}</a-select-option>
    </a-select>
  </div>
</template>

<script>
const provinceData = ['Zhejiang', 'Jiangsu'];
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
};
export default {
  data() {
    return {
      provinceData,
      cityData,
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
    }
  },
  methods: {
    handleProvinceChange(value) {
      this.cities = cityData[value]
      this.secondCity = cityData[value][0]
    },
    handleChange (value) {
      console.log(value);
    }
  }
}
</script>

<style>

</style>
