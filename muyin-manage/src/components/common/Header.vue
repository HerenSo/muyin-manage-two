<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
              <!--                 消息中心-->
              <div class="btn-bell">
                <el-tooltip effect="dark" :content="total>0?`有${total}条未读消息`:`消息中心`" placement="bottom" >
                  <router-link to="/tabs">
                    <i class="el-icon-bell"></i>
                  </router-link>
                </el-tooltip>
                <span class="btn-bell-badge" v-if="total"></span>
              </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="logoicon" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item  command="changepassword">修改密码</el-dropdown-item>
                        <el-dropdown-item  command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!--弹窗-->
        <el-dialog title="修改密码" :visible.sync="editVisible" width="420px" :before-close="closeHandle">
            <el-form :model="forget" :rules="rulesForget" ref="loginphone" label-width="0px" class="login_form">
                <el-form-item prop="userPhone">
                    <el-input v-model="forget.userPhone" placeholder="手机号码" size="large" prefix-icon="el-icon-mobile-phone">
                    </el-input>
                </el-form-item>
                <el-form-item prop="vercode">
                    <el-input
                            type="password"
                            placeholder="验证码"
                            v-model="forget.vercode"
                            prefix-icon="el-icon-lx-lock"
                            size="large"
                            class="width260"
                    >
                    </el-input>
                    <el-button size="large" class="ml-5 getcode" @click="getcode" >{{ytext}}</el-button>
                </el-form-item>
                <el-form-item prop="newPassword">
                    <el-input v-model="forget.newPassword " placeholder="新密码" size="large" prefix-icon="el-icon-lx-lock">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitHandle">确 定</el-button>
            </span>
        </el-dialog>
      <audio  id="audio_news" style="opacity: 0">
        <source src="../../assets/mp3/news.mp3" type="audio/mpeg">
        <source src="../../assets/mp3/news.wav" type="audio/wav">
        Your browser does not support the audio tag.
      </audio>
      <audio id="audio_order" style="opacity: 0">
        <source src="../../assets/mp3/order.mp3" type="audio/mpeg">
        <source src="../../assets/mp3/order.wav" type="audio/wav">
        Your browser does not support the audio tag.
      </audio>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: '未登录',
            message: 2,
            userlogo:require('../../assets/img/img.jpg'),
            ytext:"获取验证码",
            forget:{},
            rulesPhone: {
                phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
            rulesForget: {
                userPhone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                vercode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
                newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
            },
            editVisible:false,
            resetSend:true,
            activeName:"first",
            phone:{},
            websocketid:'',
            info:[],
            total:0
        };
    },
    // props:["total"],
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        },
        logoicon() {
            let logoicon = JSON.parse(localStorage.getItem('user_information'));
            return logoicon.headiconUrl ? logoicon.headiconUrl : this.userlogo;
        }
    },
    sockets: {

        connect() {
            this.websocketid = this.$socket.id;
            console.log('链接服务器');
        },
        reconnect(){
            this.$socket.emit('connect', 1)
            console.log('重新链接服务器');
        },
        disconnect(){
            console.log('断开链接服务器，重新链接服务器');
            this.$socket.emit('connect', 1)
        },

        event_notice(data) {  //监听message事件，方法是后台定义和提供的
            // console.log("您有新的消息通知，请及时处理！")
            this. getData();
            bus.$emit('message', 1);
            this.$notify({
                title: '消息',
                message: "您有新的消息通知，请及时处理！",
                position: 'bottom-right',
                duration: 9500
            });
            let audio = document.getElementById("audio_news");
            audio.play();
        },

        event_new_order(data) {  //监听message事件，方法是后台定义和提供的
            // console.log("您有新的订单，请及时处理！")
            this. getData();
            bus.$emit('message', 1);
            this.$notify({
                title: '提醒',
                message: "您有新的订单，请及时处理！",
                position: 'bottom-right',
                duration: 9500
            });
            let audio = document.getElementById("audio_order");
            audio.play();

        }
    },
    methods: {
        // 获取消息数据
        getData() {
            this.$axios.post("/system-message/selectPageList?pageNum=1&pageSize=999",{status:0}).then(res => {
                if(res.code == 200) {
                    this.total = res.data.pages;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        // 获取数据
        getMessage() {
            // this.$set(this.query,"queryStartTime",this.queryTime[0]);
            // this.$set(this.query,"queryEndTime",this.queryTime[1]);
            this.$axios.post("/system-message/selectCurrentUnreadMessage").then(res => {
                if(res.code == 200) {
                    this.info = res.data;
                    if(this.info.length > 0){
                        this.info.map(item => {
                            this.$notify({
                                title: '消息',
                                message: "",
                                position: 'bottom-right',
                                duration: 0
                            });
                        })
                    }
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                this.$axios.get('/logout').then((res) => {
                    this.$router.push('/login');
                    localStorage.removeItem('ms_username');
                    localStorage.removeItem('user_information');
                })
            }else if(command == "changepassword"){
                this.editVisible = true;
                this.ytext ="获取验证码";
                this.resetSend = true;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        getcode(){
            if(this.resetSend){
                this.resetSend = false;
                let second = 60;
                let phone = this.phone.username;
                if(this.forget.userPhone){
                    phone = this.forget.userPhone
                }
                this.$axios.post("/api/sendMessage/sendLoginPhoneVerCode?phone="+phone,{}).then(res => {
                    if(res.code == 200) {
                        this.$message.success('发送验证码成功');
                        let i = setInterval(e =>{
                            second--;
                            this.ytext = second+"秒后重新发送";
                            if(second == 0){
                                clearInterval(i);
                                this.ytext ="获取验证码";
                                this.resetSend = true;
                            }
                        },1000)
                    }else{
                        this.$message.error(res.msg);
                        this.resetSend = true;
                    }
                })
            }

        },
        submitHandle(){
            this.$axios.post("/user/resetPwd?newPassword="+this.forget.newPassword+"&userPhone="+this.forget.userPhone+"&vercode="+this.forget.vercode,{}).then(res => {
                if (res.code == 200) {
                    this.$message.success("修改密码成功！");
                    this.editVisible = false;
                    this.getData();
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        closeHandle(){
            this.editVisible = false;
            this.forget = {};
        }
    },
    created() {
        // let i = setInterval(e =>{
        //     this.getMessage();
        //     this.getData();
        // },10000);
        this.getData();
        this.$socket.emit('connect', 1)

        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style lang="scss" scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    /*color: #fff;*/
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
    /*color: $color-theme;*/
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
    width: 60px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
.collapse-btn:hover{
  color: #fff;
}
</style>
