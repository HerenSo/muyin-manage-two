import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/home/index'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/home/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/home/index.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: '/analyze/user',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/analyze/user.vue'),
                    meta: { title: '用户分析' }
                },
                {
                    path: '/analyze/order',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/analyze/order.vue'),
                    meta: { title: '订单分析' }
                },
                {
                    path: '/waterSubsidiary/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/waterSubsidiary/index.vue'),
                    meta: { title: '流水明细' }
                },
                {
                    path: '/member/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/member/index.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/coupon/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/coupon/index.vue'),
                    meta: { title: '优惠券管理' }
                },
                {
                    path: '/commodity/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/commodity/index.vue'),
                    meta: { title: '商品管理' }
                },
                {
                    path: '/consignment/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/consignment/index.vue'),
                    meta: { title: '寄卖商品' }
                },
                {
                    path: '/commodity/category',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/commodity/category.vue'),
                    meta: { title: '商品分类管理' }
                },
                {
                    path: '/order/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/order/index.vue'),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/aftersalesService/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/aftersalesService/index.vue'),
                    meta: { title: '售后服务' }
                },
                {
                    path: '/withdrawalRecord/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/withdrawalRecord/index.vue'),
                    meta: { title: '提现管理' }
                },
                {
                    path: '/customer/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/customer/index.vue'),
                    meta: { title: '经销商' }
                },
                {
                    path: '/information/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/information/index.vue'),
                    meta: { title: '平台信息' }
                },
                {
                    path: '/basicsSetting/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/basicsSetting/index.vue'),
                    meta: { title: '基础设置' }
                },
                {
                    path: '/integralSetting/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/integralSetting/index.vue'),
                    meta: { title: '积分设置' }
                },
                {
                    path: '/role/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/role/index.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/role/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/role/index.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/userAuth/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/userAuth/index.vue'),
                    meta: { title: '账户权限' }
                },
                {
                    path: '/menu/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/menu/index.vue'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/article/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/article/index.vue'),
                    meta: { title: '文章管理' }
                },
                {
                    path: '/banner/index',
                    component: () => import(/* webpackChunkName: "analyze-user" */ '../components/page/banner/index.vue'),
                    meta: { title: '轮播图管理' }
                },
                // {
                //     path: '/dashboard',
                //     component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                //     meta: { title: '系统首页' }
                // },
                // {
                //     path: '/icon',
                //     component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                //     meta: { title: '自定义图标' }
                // },
                // {
                //     path: '/table',
                //     component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                //     meta: { title: '基础表格' }
                // },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: '消息中心' }
                },
                // {
                //     path: '/form',
                //     component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                //     meta: { title: '基本表单' }
                // },
                // {
                //     // 富文本编辑器组件
                //     path: '/editor',
                //     component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                //     meta: { title: '富文本编辑器' }
                // },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                //     meta: { title: 'markdown编辑器' }
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                //     meta: { title: '文件上传' }
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                //     meta: { title: '拖拽弹框' }
                // },
                // {
                //     // 国际化组件
                //     path: '/i18n',
                //     component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                //     meta: { title: '国际化' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                //     meta: { title: '权限测试', permission: true }
                // },
                // {
                //     path: '/404',
                //     component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                //     meta: { title: '404' }
                // },
                // {
                //     path: '/403',
                //     component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                //     meta: { title: '403' }
                // },
                // {
                //     path: '/donate',
                //     component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                //     meta: { title: '支持作者' }
                // }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
