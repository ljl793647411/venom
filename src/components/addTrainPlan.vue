<template>
  <div>
    <a-modal
      :visible="visible"
      wrapClassName="train-plan-class"
      :title='title'
      okText='确认'
      @cancel="cancel"
      @ok="ok"
    >
      <a-form :form="form">
        <a-form-item 
        v-bind="formItemLayout"
        label='待乘室名称：'
        >
          <search-com 
            :changeOnSelect="false"
            :dropDown="false"
            :labelShowRes="false"
            :defaultValue="defaultValue"
            @getLdNameOrRestCode="getLdNameOrRestCode"
          ></search-com>
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='待乘室代码：'
        >
          <a-input
            :readOnly="true"
            v-decorator="[
              'restCode',
              {
                initialValue: trainPlanVo.restCode,
                rules: [{ required: true, message: '待乘室代码不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='机务段：'
        >
          <a-input
            v-decorator="[
              'ldName',
              {
                initialValue: trainPlanVo.ldName,
                rules: [{ required: true, message: '机务段不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='铺位号：'
        >
          <a-input
            v-decorator="[
              'bedNo', 
              {
                initialValue: trainPlanVo.bedNo,
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='车次号：'
        >
          <a-input
            v-decorator="[
              'trainNo', 
              {
                initialValue: trainPlanVo.trainNo,
                rules: [{ required: true, message: '车次号不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
            v-bind="formItemLayout"
            label="待乘类型："
            >
            <a-select
              v-decorator="[
                'waitDriveType',
                {
                  initialValue: tranPlanMap[trainPlanVo.waitDriveType],
                  rules: [{ required: true, message: '请选择待乘类型!' }],
                }
              ]"
            >
              <a-select-option v-for="item in trainTypeList" :value="item.value" :key="item.value + 'key'">
                {{item.label}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='开车时刻：'
        >
          <a-time-picker
            v-decorator="[
              'trainDt', 
              {
                initialValue: trainPlanVo.trainDt,
              }
            ]"
            format="HH:mm"
            style="width: 100%;"
            />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='到达车次：'
        >
          <a-input
            v-decorator="[
              'arrivalTrainNo', 
              {
                initialValue: trainPlanVo.arrivalTrainNo,
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='到达时间：'
        >
          <a-time-picker
            v-decorator="[
              'arrivalTrainDt', 
              {
                initialValue: trainPlanVo.arrivalTrainDt,
              }
            ]"
            format="HH:mm"
            style="width: 100%;"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='到开间隔：'
        >
          <a-input
            v-decorator="[
              'intervalTime', 
              {
                initialValue: trainPlanVo.intervalTime,
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='叫班时刻：'
        >
         <a-time-picker
            v-decorator="[
              'remindDt', 
              {
                initialValue: trainPlanVo.remindDt,
              }
            ]"
            format="HH:mm"
            style="width: 100%;"
          />
        </a-form-item>
         <a-form-item 
        v-bind="formItemLayout"
        label='餐券：'
        >
          <a-input
            v-decorator="[
              'ticket1', 
              {
                initialValue: trainPlanVo.ticket1,
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};
import config from '../assets/config.vue'
import searchCom from '../components/searchCom.vue'

export default {
  data () {
    return {
      formItemLayout,
      trainTypeList: config.trainTypeList,
      tranPlanMap: config.tranPlanMap
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  components: {
    searchCom
  },
  props: ['visible', 'trainPlanVo', 'title', 'addState', 'defaultValue'],
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$emit('ok')
    },
    getLdNameOrRestCode (restName, restCode) {
      this.form.setFieldsValue({
        restName:  restName,
        restCode:  restCode
      })
    },
  }
}
</script>

<style>
  .train-plan-class input {
  }
</style>
