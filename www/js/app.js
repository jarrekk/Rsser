// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $http, $state, Storage) {
    $http.get('tour.json').then(function(resp) {
        $rootScope.tour = resp.data;
        if (Storage.get("tour")) {
            if (Storage.get("tour").version === $rootScope.tour.version) {} else {
                $state.go("tour");
            }
        } else {
            $state.go("tour");
        }
    });

    if (Storage.get('save_traffic')) {
        $rootScope.save_traffic = Storage.get('save_traffic');
    } else {
        $rootScope.save_traffic = false;
    }

    $rootScope.backButton = true;
    $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
        // $rootScope.tab = to.data.no_tab;
        if ($state.current.name === 'tab.home' || $state.current.name === 'tab.add' || $state.current.name === 'tab.config') {
            $rootScope.hideTabs = false;
            $rootScope.backButton = true;
        } else {
            $rootScope.hideTabs = true;
            $rootScope.backButton = false;
        }
    });
    $rootScope.rsslist = [{
        "id": 1,
        "img": "img/rss/jack003.png",
        "name": "jack003",
        "url": "http://www.jack003.com/feed.xml",
        "type": "blog"
    }];
    if (Storage.get("rsslist")) {
        $rootScope.rsslist = Storage.get("rsslist");
    }
    $http.get('add_rsslist.json').then(function(resp) {
        $rootScope.add_rsslist = resp.data;
        if (Storage.get("add_rsslist")) {
            if (Storage.get("add_rsslist").version === $rootScope.add_rsslist.version) {
                $rootScope.add_rsslist = Storage.get("add_rsslist");
            } else {
                $rootScope.rsslist = [{
                    "id": 1,
                    "img": "img/rss/jack003.png",
                    "name": "jack003",
                    "url": "http://www.jack003.com/feed.xml",
                    "type": "blog"
                }];
            }
        } else {
            $rootScope.rsslist = [{
                "id": 1,
                "img": "img/rss/jack003.png",
                "name": "jack003",
                "url": "http://www.jack003.com/feed.xml",
                "type": "blog"
            }];
        }
    });
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

.config(['$ionicConfigProvider', function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
}])

.config(function($stateProvider, $urlRouterProvider) {
    // $ionicConfigProvider.views.swipeBackEnabled(true);
    $stateProvider
        .state('tour', {
        url: '/tour',
        templateUrl: 'templates/tour.html',
    })
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })
    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl',
            }
        }
    })
    .state('tab.detail', {
        url: '/detail?id',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-detail.html',
                controller: 'DetailCtrl',
            }
        }
    })
    .state('tab.article', {
        url: '/article',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-article.html',
                controller: 'ArticleCtrl',
            }
        }
    })
    .state('tab.add', {
        url: '/add',
        views: {
            'tab-add': {
                templateUrl: 'templates/tab-add.html',
                controller: 'AddRssCtrl',
            }
        }
    })
    .state('tab.add_rsslist', {
        url: '/rsslist?category',
        views: {
            'tab-add': {
                templateUrl: 'templates/add-rsslist.html',
                controller: 'AddRsslistCtrl',
            }
        }
    })
    .state('tab.config', {
        url: '/config',
        views: {
            'tab-config': {
                templateUrl: 'templates/tab-config.html',
                controller: 'ConfigCtrl',
            }
        }
    })
    .state('tab.about', {
        url: '/about',
        views: {
            'tab-config': {
                templateUrl: 'templates/tab-about.html',
                // controller: 'ConfigCtrl',
            }
        }
    })
    ;
    $urlRouterProvider.otherwise('/tab/home');

})

.directive('compile', ['$compile', function($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]).controller('MyCtrl', function($scope) {
    var str = 'hello http://www.cnn.com';
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    result = str.replace(urlRegEx, "<a ng-click=\"GotoLink('$1',\'_system\')\">$1</a>");
    $scope.GotoLink = function() {
        alert();
    };
    $scope.name = result;
})

// .directive('hideTabs', function($rootScope) {
//   return {
//     restrict: 'A',
//     link: function($scope, $el) {
//       $scope.$on("$ionicView.beforeEnter", function () {
//         $rootScope.hideTabs = true;
//       });
//       $scope.$on("$ionicView.beforeLeave", function () {
//         $rootScope.hideTabs = false;
//       });
//     }
//   };
// })

;
