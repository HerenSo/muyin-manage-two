import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/theme-green/color.scss'; //主题
import "./assets/css/theme-green/theme-color.scss";   /*主题*/
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import request from './utils/request';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
Vue.prototype.$axios = axios;

// 生产环境
// Vue.prototype.baseUrl = 'http://120.79.56.120:8080';
Vue.prototype.baseUrl = 'https://wbysc.com.cn/wby';


// 消息
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
let information = JSON.parse(localStorage.getItem('user_information'))
let customerCode ="";
if(information){
    customerCode = information.customerCode || "";
}
Vue.use(new VueSocketIO({
    debug: true,
    // connection: SocketIO('http://120.79.56.120:8084?customerCode='+customerCode) //xxx填后台给的socket地址，
    connection: SocketIO('https://wbysc.com.cn:8084?customerCode='+customerCode) //xxx填后台给的socket地址，
}))

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 小红商`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

new Vue({
    router,
    i18n,
    render: h => h(App)
}).$mount('#app');
