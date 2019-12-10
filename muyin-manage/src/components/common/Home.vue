<template>
    <div class="wrapper">
        <v-head :total="total"></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
<!--            <v-tags></v-tags>-->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import bus from './bus';
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            total:0,
            websocketid:'',
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });

    },
    mounted(){
        this.getData();
    },
    sockets: {

        connect() {
            this.websocketid = this.$socket.id;
            console.log('链接服务器');
        },

        output(data,notime) {  //监听message事件，方法是后台定义和提供的
            console.log(data);
            this.$notify({
                title: '消息',
                message: data+" "+notime,
                position: 'bottom-right',
                duration: 0
            });

        }

    },
    methods:{
        // 获取消息数据
        getData() {
            this.$axios.post("/system-message/selectPageList?pageNum=1&pageSize=999",{status:0}).then(res => {
                if(res.code == 200) {
                    this.total = res.data.total;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
    }
};
</script>
<style scoped>
  .content{
    padding: 20px;
  }
</style>
