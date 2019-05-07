<template>
  <div>
    <a-modal
      :visible="visible"
      :title='title'
      okText='确认'
      @cancel="cancel"
      @ok="ok"
    >
      <a-form :form="form">
        <a-form-item 
        v-bind="formItemLayout"
        label='机务段：'>
          <a-input
            v-decorator="[
              'ldName',
              {
                initialValue: ldVo.ldName,
                rules: [{ required: true, message: '用户名不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='站点名称：'
        >
          <a-input
            v-decorator="[
              'restName',
              {
                initialValue: ldVo.restName,
                rules: [{ required: true, message: '用户名不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='站点代码：'
        >
          <a-input
            v-decorator="[
              'restCode',
              {
                initialValue: ldVo.restCode,
                rules: [{ required: true, message: '用户名不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='站点IP：'
        >
          <a-input
            v-decorator="[
              'ip',
              {
                initialValue: ldVo.ip,
                rules: [{ required: true, message: '站点IP不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='端口：'
        >
          <a-input
            v-decorator="[
              'rport',
              {
                initialValue: ldVo.rport,
                rules: [{ required: true, message: '端口不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='叫班模式：'
        >
          <a-input
            v-decorator="[
              'mode',
              {
                initialValue: ldVo.mode,
                rules: [{ required: true, message: '叫班模式不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='联系电话：'>
          <a-input
            v-decorator="[
              'phone',
              {
                initialValue: ldVo.phone,
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
export default {
  data () {
    return {
      formItemLayout,
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this);
  },
  mounted () {
    this.$nextTick(() => {
    })
  },
  props: ['visible', 'ldVo', 'title'],
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$emit('ok')
    },
  }
}
</script>

<style>

</style>
