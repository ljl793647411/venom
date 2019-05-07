<template>
  <div>
    <a-modal
      title="注册"
      v-model="visible"
      @ok="handleOk"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          注册
        </a-button>
      </template>
      <div class="register-content">
        <p class="register-input">
          <label for="username">请输入用户名：</label>
          <a-input id="username" class="input" v-model="username"></a-input>
        </p>
        <p class="register-input">
          <label for="password">请输入密码：</label>
          <a-input id="password" class="input" v-model="password1" type="text"></a-input>
        </p>
        <p class="register-input">
          <label for="password">再次输入密码：</label>
          <a-input id="password2" class="input" v-model="password2" type="text"></a-input>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: true,
      loading: false,
      registerVo: {},
      username: '',
      password1: '',
      password2: '',
    }
  },
  methods: {
    handleOk () {
      if (!this.username.replace(/\s*/g,"")) {
        this.$message.error('用户名不能为空')
        return
      } else {
        if (this.username.replace(/\s*/g,"").length > 16) {
          this.$message.error('用户名最大长度不能超过16个字符')
          return
        }
      }
      this.registerVo.username = this.username.replace(/\s*/g,"")
      if (!this.password1.replace(/\s*/g,"")) {
        this.$message.error('密码不能为空')
        return
      } else {
        if (this.password1.replace(/\s*/g,"").length > 16) {
          this.$message.error('密码最大长度不能超过16个字符')
          return
        }
      }
      if (this.password1 !== this.password2) {
        this.$message.error('两次密码输入不一致')
        return
      }
      this.registerVo.password = this.password1.replace(/\s*/g,"")  
      this.register()
    },
    register () {
      this.axios({
        method: 'post',
        data: this.registerVo,
        url: '/api/venom-account/register'
      }).then((res) => {
        let data = res.data
        if (data.type === 1) {
          this.$message.success('注册成功')
          this.$emit('closeRegisterBox', this.registerVo.username, this.registerVo.password)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log('请求/api/venom-account/register错误', err)
      })
    }
  }
}
</script>

<style>
  .register-input {
    font-size: 14px;
    margin-top: 20px;
  }
  .register-input label {
    width: 25%;
    display: inline-block;
    font-size: 14px;
    line-height: 32px;
    text-align: right;
    user-select: none;
    font-weight: bold;
  }
  .register-input .input {
    width: 50%;
  }
</style>
