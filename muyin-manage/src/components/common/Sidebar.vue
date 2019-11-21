<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#fff"
            text-color="#ffba4a"
            active-text-color="#eb5505"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-pie-chart',
                    index: '1',
                    title: '统计',
                    subs: [
                        {
                            index: 'analyze/user',
                            title: '用户分析'
                        },
                        {
                            index: 'table',
                            title: '订单分析'
                        },
                        ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: '2',
                    title: '管理',
                    subs: [
                        {
                            index: '/member/index',
                            title: '用户管理'
                        },
                        {
                            index: '/coupon/index',
                            title: '优惠券管理'
                        },
                        {
                            index: '/commodity/index',
                            title: '商品管理'
                        },
                        {
                            index: '/commodity/category',
                            title: '商品分类管理'
                        },
                        {
                            index: '/order/index',
                            title: '订单管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-shop',
                    index: '3',
                    title: '经销商管理',
                    subs: [
                        {
                            index: '/customer/index',
                            title: '经销商'
                        },
                        // {
                        //     index: 'charts',
                        //     title: '活动管理'
                        // },
                    ]
                },
                {
                    icon: 'el-icon-lx-settings',
                    index: '4',
                    title: '设置',
                    subs: [
                        {
                            // index: 'icon',
                            index: '/information/index',
                            title: '平台信息'
                        },
                        {
                            index: '/role/index',
                            title: '角色管理'
                        },
                        {
                            index: '/userAuth/index',
                            title: '账户权限'
                        },
                        {
                            index: '/menu/index',
                            title: '菜单管理'
                        },
                        {
                            index: '/article/index',
                            title: '文章管理'
                        },
                        {
                            index: '/banner/index',
                            title: '轮播图管理'
                        },
                    ]
                },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     index: 'table',
                //     title: '基础表格'
                // },
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '3',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '3-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: 'charts',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     index: '7',
                //     title: '错误处理',
                //     subs: [
                //         {
                //             index: 'permission',
                //             title: '权限测试'
                //         },
                //         {
                //             index: '404',
                //             title: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style lang="scss">
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
.el-menu-item,.el-submenu__title{
  background-color: #fff !important;
  color: #606266 !important;
}
.el-menu-item:hover,.el-submenu__title:hover{
  background-color: $color-sys-three !important;
}
.el-submenu__title i,.el-menu-item i{
  color: #606266;
}
.el-submenu__title.is-active i,.el-menu-item.is-active i,.el-menu-item.is-active{
  color: $color-sys !important;
  /*background-color: $color-sys-three !important;*/
}
</style>
