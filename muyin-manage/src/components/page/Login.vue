<template>
    <div class="login-wrap">
      <div class="header">
        <div class="logo"><img src="../../assets/img/logo_ico.png" height="70" />万博园管理平台</div>
      </div>
<!--        <div class="login_info">-->
<!--          <div><i>1</i><span>母婴一站式供应链</span></div>-->
<!--          <div><i>2</i><span>行业最大储备配货中心</span></div>-->
<!--          <div><i>3</i><span>批发式会员制门店</span></div>-->
<!--          <div><i>4</i><span>直击产业供应链</span></div>-->
<!--          <div><i>5</i><span>一体化营销管理体系</span></div>-->
<!--        </div>-->
        <div class="ms-login">
            <div class="ms-title"><img src="../../assets/img/login_bg02.png" />万博园管理平台</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username" size="large" prefix-icon="el-icon-lx-people">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                        prefix-icon="el-icon-lx-lock"
                        size="large"
                    >
                    </el-input>
                </el-form-item>
                <el-row type="flex" justify="space-between" class="pb-20">
                  <el-col :span="3"><el-checkbox v-model="rememberPassword">记住密码</el-checkbox></el-col>
                  <el-col :span="5" class="forgetPassword"><router-link to="/" >忘记密码</router-link></el-col>
                </el-row>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
      <div class="footer">
        <div class="text-center">Copyright  2019-2020 Aize Technology. All Rights Reserved. 艾泽科技 版权所有</div>
      </div>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            param: {
                username: '',
                password: '',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            rememberPassword:true
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    this.$set(this.param, 'dataType', 'form');
                    this.$axios.post("/login",this.param).then(res => {
                        console.log(res)
                        if(res.code == 200) {
                            this.getClassEnums();
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.username);
                            localStorage.setItem('user_information', JSON.stringify(res.data));
                            this.$router.push('/');
                        }else{
                            this.$message.error(res.msg);
                        }
                    })

                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getClassEnums(){
            this.$axios.post("/api/user/selectClassEnums").then(res => {
                if (res.code == 200) {
                    localStorage.setItem('ClassEnums', JSON.stringify(res.data));
                }else{
                    this.$message.error(res.msg);
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped>
  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
    /*background: #74cae2;*/
    background: $color-header;
    border-bottom: 1px solid $color-one;
  }
  .footer{
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #999;
    background: $color-footer;
    text-align: center;
  }
  .header .logo{
    float: left;
    width:350px;
    line-height: 70px;
    display: flex;
    padding: 0 20px;
    img{
      padding-right: 20px;
    }
  }
  .login-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      @include login-bg;
  }
  .ms-title{
    width:100%;
    padding: 3px 0;
    line-height: 50px;
    text-align: center;
    font-size:18px;
    color: $color-theme;
    border-bottom: 1px solid #ddd;
  }
  .ms-title img{
    width: 90px;
    height: 90px;
    margin-top: -50px;
    margin-left: -110px;
    margin-right: 10px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .ms-login {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 450px;
      margin: -190px 0 0 -520px;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: -2px 4px 8px #666;
      /*overflow: hidden;*/
  }
  .ms-content {
      padding: 30px 30px;
  }
  .login-btn {
      text-align: center;
  }
  .login-btn button {
      width: 100%;
      height: 36px;
      margin-bottom: 10px;
  }
  .login-tips {
      font-size: 12px;
      line-height: 30px;
      color: #fff;
  }
  @keyframes loginA
  {
    0% {margin-left: 0}
    50% {margin-left: 60px}
    100% {margin-left: 0px}
  }
  .login_info{
    position: fixed;
    right: 50%;
    margin-right: -500px;
    width: 400px;
    top: 35%;
    div{
      width: 340px;
      height: 16px;
      margin-bottom:40px;
      margin-left: 0;
      border-radius: 12px;
      border:1px solid #ededed;
      background: rgba(255,255,255,0.8);
      span{
        text-shadow: -5px 5px 5px $color-login-shadow;
        font-size: 28px;
        font-style: oblique;
        font-weight: bold;
        color: $color-theme;
        display: inline-block;
        margin-top: -30px;
        margin-left: 20px;
        vertical-align: 10px;
      }
      i{
        display: inline-block;
        margin-top: -30px;
        vertical-align: 4px;
        width: 36px;
        height: 36px;
        line-height: 36px;
        background: $color-theme;
        color: #fff;
        text-align: center;
        border-radius: 50%;
        font-size: 21px;
      }
      &:nth-child(1){animation: loginA 3s linear 0s infinite;}
      &:nth-child(2){animation: loginA 3s linear .5s infinite;}
      &:nth-child(3){animation: loginA 3s linear 1s infinite;}
      &:nth-child(4){animation: loginA 3s linear 1.5s infinite;}
      &:nth-child(5){animation: loginA 3s linear 2s infinite;}
    }

  }

  .forgetPassword{
    a{
      font-size: 14px;
      color: $color-theme;
    }
  }
</style>