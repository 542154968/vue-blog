import Vue from 'vue'
import Router from 'vue-router'
// import header from '../components/header/header'
// import carousel from '../components/carousel/carousel'
// import list from '../components/list/list'
// import index from '../components/index/index'
// import detail from '../components/detail/detail'
// import write from '../components/write/write'
// import board from '../components/msgBoard/board'
// import aboutMe from '../components/aboutMe/about'
// import eg from '../components/eg/eg'
// import music from '../components/eg/music'
// import book from '../components/eg/book'

const list = r => require.ensure([], () => r(require('../components/list/list')), 'list');
const header = r => require.ensure([], () => r(require('../components/header/header')), 'header');
const carousel = r => require.ensure([], () => r(require('../components/carousel/carousel')), 'carousel');
const detail = r => require.ensure([], () => r(require('../components/detail/detail')), 'detail');
const index = r => require.ensure([], () => r(require('../components/index/index')), 'index');
const write = r => require.ensure([], () => r(require('../components/write/write')), 'write');
const board = r => require.ensure([], () => r(require('../components/msgBoard/board')), 'board');
const aboutMe = r => require.ensure([], () => r(require('../components/aboutMe/about')), 'aboutMe');
const eg = r => require.ensure([], () => r(require('../components/eg/eg')), 'eg');
const music = r => require.ensure([], () => r(require('../components/eg/music')), 'music');
const book = r => require.ensure([], () => r(require('../components/eg/book')), 'book');

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/index',
        },
        {
            path: '/index',
            component: (resolve) => {
                require(['../components/index/index'], resolve)
            },
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/list/blog',
            component: list,
            name: 'blog'
        },
        {
            path: '/list/share',
            component: list,
            name: 'share'
        },
        {
            path: '/list/blog/detail',
            component: detail
        },
        {
            path: '/list/share/detail',
            component: detail
        },
        {
            path: '/write',
            component: write
        },
        {
            path: '/board',
            component: board
        },
        {
            path: '/aboutMe',
            component: aboutMe
        },
        {
            path: '/eg',
            component: eg,
            name: 'eg',
            children: [{
                path: 'music',
                component: music
                },
                {
                path: 'book',
                component: book
                }
            ]
        }

    ]
});

const defaultRouterArr = ['/list/share']
router.beforeEach((to, from, next) => {
    if (defaultRouterArr.indexOf(to.path) >= 0) {
        next()
    } else {
        next()
    }
})

export default router
