import Vue from 'vue'
import axios from 'axios';
import {Message} from 'element-ui';
import router from '../router'

// const service = axios.create({
//     // process.env.NODE_ENV === 'development' 来判断是否开发环境
//     baseURL: 'http://47.102.150.252:8082',
//     timeout: 5000
// })

axios.defaults.withCredentials = true;
// 生产环境
axios.defaults.baseURL = 'http://120.79.56.120:8080' ;
// axios.defaults.baseURL = 'https://www.geeso.cn/';
axios.interceptors.request.use( config => {
    config.transformRequest = [function (data) {
        if(Array.isArray(data) || Object.prototype.toString.apply(data) ==='[object Object]') {
            if (encodeURIComponent(data['dataType']) == "multipart") {
                // console.log('multipart')
                config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8';
                delete data['dataType'];
                let formData = new FormData();
                for (let it in data) {
                    if (data[it] != 'null') {
                        formData.append(it, data[it]);
                    }
                }
                return formData
            }if (encodeURIComponent(data['dataType']) == "vueCropper") {
                // console.log('multipart')
                config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8';
                delete data['dataType'];
                return data.formData
            }else if (encodeURIComponent(data['dataType']) == "form") {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
                delete data['dataType'];
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }else{
                config.headers['Content-Type'] = 'application/json;charset=UTF-8';
                return JSON.stringify(data)
            }

        }
    }]
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

axios.interceptors.response.use(response => {
    if(response.status === 200){
        // console.log("response",response.data)
        if(response.data.code == 10){
            // Message.error("登录超时！请重新登录");
            router.push("/login")
        }else if(response.data.code == 11){
            // Message.error("呀！你已被挤下线");
            router.push("/login")
        }else{
            // Message.error(response.data.msg);
        }
        return response.data;
    }else{
        Promise.reject();
    }
}, error => {
    // console.log(error);
    return Promise.reject();
})

export default axios;