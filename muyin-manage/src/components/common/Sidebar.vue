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
            <template v-for="(item,index) in items">
                <template v-if="item.subMenus.length>0">
                    <el-submenu :index="item.url" :key="index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.subMenus">
<!--                            <el-submenu-->
<!--                                v-if="subItem.subMenus.length>0"-->
<!--                                :index="subItem.url"-->
<!--                                :key="subItem.url"-->
<!--                            >-->
<!--                                <template slot="title">{{ subItem.name }}</template>-->
<!--                                <el-menu-item-->
<!--                                    v-for="(threeItem,i) in subItem.subMenus"-->
<!--                                    :key="i"-->
<!--                                    :index="threeItem.url"-->
<!--                                >{{ threeItem.name }}</el-menu-item>-->
<!--                            </el-submenu>-->
                            <el-menu-item
                                :index="subItem.url"
                                :key="subItem.url"
                            >{{ subItem.name }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="index" :key="index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.name }}</span>
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
                    url: '1',
                    name: '统计',
                    subMenus: [
                        {
                            url: '/analyze/order',
                            name: '订单分析'
                        },
                        {
                            url: '/waterSubsidiary/index',
                            name: '流水明细'
                        },
                        ]
                },
                {
                    icon: 'el-icon-lx-cascades',
                    url: '2',
                    name: '管理',
                    subMenus: [
                        {
                            url: '/member/index',
                            name: '用户管理'
                        },
                        {
                            url: '/coupon/index',
                            name: '优惠券管理'
                        },
                        {
                            url: '/commodity/index',
                            name: '商品管理'
                        },
                        {
                            url: '/commodity/category',
                            name: '商品分类管理'
                        },
                        {
                            url: '/order/index',
                            name: '订单管理'
                        },
                        {
                            url: '/aftersalesService/index',
                            name: '售后服务'
                        },
                        {
                            url: '/article/index',
                            name: '文章管理'
                        },
                        {
                            url: '/banner/index',
                            name: '轮播图管理'
                        },
                    ]
                },
                {
                    icon: 'el-icon-lx-shop',
                    url: '3',
                    name: '经销商管理',
                    subMenus: [
                        {
                            url: '/customer/index',
                            name: '经销商'
                        },
                        // {
                        //     index: 'charts',
                        //     name: '活动管理'
                        // },
                    ]
                },
                {
                    icon: 'el-icon-lx-settings',
                    url: '4',
                    name: '设置',
                    subMenus: [
                        {
                            // index: 'icon',
                            url: '/information/index',
                            name: '平台信息'
                        },
                        {
                            url: '/role/index',
                            name: '角色管理'
                        },
                        {
                            url: '/userAuth/index',
                            name: '账户权限'
                        },
                        {
                            url: '/menu/index',
                            name: '菜单管理'
                        },
                        {
                            url: '/basicsSetting/index',
                            name: '基础设置'
                        },
                        {
                            url: '/integralSetting/index',
                            name: '积分设置'
                        },
                    ]
                },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     url: 'table',
                //     name: '基础表格'
                // },
                // {
                //     icon: 'el-icon-lx-copy',
                //     url: 'tabs',
                //     name: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     url: '3',
                //     name: '表单相关',
                //     subMenus: [
                //         {
                //             url: 'form',
                //             name: '基本表单'
                //         },
                //         {
                //             url: '3-2',
                //             name: '三级菜单',
                //             subMenus: [
                //                 {
                //                     url: 'editor',
                //                     name: '富文本编辑器'
                //                 },
                //                 {
                //                     url: 'markdown',
                //                     name: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             url: 'upload',
                //             name: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     url: 'icon',
                //     name: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     url: 'charts',
                //     name: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     url: '6',
                //     name: '拖拽组件',
                //     subMenus: [
                //         {
                //             url: 'drag',
                //             name: '拖拽列表'
                //         },
                //         {
                //             url: 'dialog',
                //             name: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     url: 'i18n',
                //     name: '国际化功能'
                // },
                // {
                //     icon: 'el-icon-lx-warn',
                //     url: '7',
                //     name: '错误处理',
                //     subMenus: [
                //         {
                //             url: 'permission',
                //             name: '权限测试'
                //         },
                //         {
                //             url: '404',
                //             name: '404页面'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     url: '/donate',
                //     name: '支持作者'
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
        let authorities = JSON.parse(localStorage.getItem("user_information"));
        this.items = authorities.menus;
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
