// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope, $http, $state, Storage) {
// .run(function($ionicPlatform, $ionicConfigProvider, $rootScope, Storage) {
    // $ionicConfigProvider.views.swipeBackEnabled(true);
    $http.get('tour.json').then(function (resp) {
        $rootScope.tour = resp.data;
        if (Storage.get("tour")) {
            if (Storage.get("tour").version === $rootScope.tour.version) {} else {
                $state.go("tour");
            }
        } else {
            $state.go("tour");
        }
    });

    $rootScope.$on("$stateChangeSuccess",  function(event, to, toParams, from, fromParams) {
        // $rootScope.tab = to.data.no_tab;
    });

    $rootScope.rsslist = [{
        "id": 1,
        "img": "img/rss/jack003.png",
        "name": "jack003",
        "url": "http://www.jack003.com/feed.xml",
        "type": "manual"
    }];
    if (Storage.get("rsslist")) {
        $rootScope.rsslist = Storage.get("rsslist");
    }

    $http.get('add_rsslist.json').then(function (resp) {
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
                    "type": "manual"
                }];
            }
        } else {
            $rootScope.rsslist = [{
                "id": 1,
                "img": "img/rss/jack003.png",
                "name": "jack003",
                "url": "http://www.jack003.com/feed.xml",
                "type": "manual"
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

.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tour', {
        url: '/tour',
        templateUrl: 'templates/tour.html',
    })

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        // data: { "no_tab": false },
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'HomeCtrl',
            }
        }
    })

    .state('tab.detail', {
        url: '/detail?id',
        // data: { "no_tab": false },
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-detail.html',
                controller: 'DetailCtrl',
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
        // data: { "no_tab": false },
        views: {
            'tab-add': {
                templateUrl: 'templates/tab-add.html',
                controller: 'AddRssCtrl',
            }
        }
    })

    .state('tab.add_rsslist', {
        url: '/add_rsslist?category',
        // data: { "no_tab": false },
        views: {
            'tab-add': {
                templateUrl: 'templates/add-rsslist.html',
                controller: 'AddRsslistCtrl',
            }
        }
    })

    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

})

.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
   )};
  }]).controller('MyCtrl', function($scope) {
    var str = 'hello http://www.cnn.com';
    var urlRegEx = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    result = str.replace(urlRegEx, "<a ng-click=\"GotoLink('$1',\'_system\')\">$1</a>");
    $scope.GotoLink = function() { alert(); };
    $scope.name = result;
})

.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function($scope, $el) {
      $scope.$on("$ionicView.beforeEnter", function () {
        $rootScope.hideTabs = true;
      });
      $scope.$on("$ionicView.beforeLeave", function () {
        $rootScope.hideTabs = false;
      });
    }
  };
})

;
