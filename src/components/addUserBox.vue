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
        label='姓名：'
        >
          <a-input
            :read-only="addState"
            v-decorator="[
              'username',
              {
                initialValue: userVo.username,
                rules: [{ required: true, message: '用户名不能为空!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='工号：'
        >
          <a-input
            :read-only="addState"
            v-decorator="[
              'workNo',
              {
                initialValue: userVo.workNo,
                rules: [{ required: true, message: '用户名不能为空!' },
                {max: 7, message: '用户工号为7位数字!'},
                {min: 7, message: '用户工号为7位数字!'}
                ],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
        v-bind="formItemLayout"
        :label="addState ? '请输入新密码：' : '请输入密码：'"
        >
          <a-input
            type="password"
            v-decorator="[
              'password',
              {
                initialValue: userVo.password,
                rules: [{
                  required: true, message: '密码不能为空!',
                }, {
                  validator: validateToNextPassword,
                },
                {max: 16, message: '密码长度最大不超过16位字符!'},
                ],
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          v-bind="formItemLayout"
          label="再次输入密码："
        >
          <a-input
            type="password"
            v-decorator="[
              'password2',
              {
                rules: [{
                  required: true, message: '密码不能为空!',
                }, {
                  validator: compareToFirstPassword,
                }],
              }
            ]"
            @blur="handleConfirmBlur"
          />
        </a-form-item>
        <a-form-item 
        v-bind="formItemLayout"
        label='备注：'>
          <a-input
            type='textarea'
            v-decorator="[
              'note',
              {
                initialValue: userVo.note,
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
  props: ['visible', 'userVo', 'title', 'addState'],
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    ok () {
      this.$emit('ok')
    },
    handleConfirmBlur (e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('请确认两次密码输入一致!');
      } else {
        callback();
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      callback();
    },
  }
}
</script>

<style>

</style>
