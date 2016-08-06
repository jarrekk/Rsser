// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, Storage) {
// .run(function($ionicPlatform, $ionicConfigProvider, $rootScope, Storage) {
    // $ionicConfigProvider.views.swipeBackEnabled(true);
    $rootScope.add_rsslist = {
        "news": [{
            "img": "img/rss/ifeng.png",
            "name": "凤凰新闻-综合资讯",
            "url": "http://news.ifeng.com/rss/index.xml"
        }],
        "tech": [{
            "img": "img/rss/cnbeta.png",
            "name": "cnBeta",
            "url": "http://rss.cnbeta.com/rss"
        }],
        "article": [{
            "img": "img/rss/zhihu-select.png",
            "name": "知乎精选",
            "url": "http://zhihu.com/rss"
        },{
            "img": "img/rss/Tencent-cdc.png",
            "name": "腾讯CDC",
            "url": "http://cdc.tencent.com/feed/"
        },{
            "img": "img/rss/hanhan.png",
            "name": "韩寒Blog",
            "url": "http://blog.sina.com.cn/rss/twocold.xml"
        }]
    };
    $rootScope.rsslist = [{
        "id": 1,
        "img": "img/rss/jack003.png",
        "name": "jack003",
        "url": "http://www.jack003.com/feed.xml"
    }];
    // Storage.set('rsslist', $rootScope.rsslist);
    if (Storage.get("rsslist")) {
        $rootScope.rsslist = Storage.get("rsslist");
        // console.log($rootScope.rsslist);
    }

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.detail', {
        url: '/detail?id',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-detail.html',
                controller: 'DetailCtrl'
            }
        }
    })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.add', {
        url: '/add',
        views: {
            'tab-add': {
                templateUrl: 'templates/tab-add.html',
            }
        }
    })

    .state('tab.add_rsslist', {
        url: '/add_rsslist?category',
        views: {
            'tab-add': {
                templateUrl: 'templates/add-rsslist.html',
                controller: 'AddRsslistCtrl'
            }
        }
    })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

});
