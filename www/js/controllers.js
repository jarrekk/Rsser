angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services', 'ngSanitize'])

.controller('DashCtrl', function($scope, $ionicModal, Storage) {
    // $ionicModal.fromTemplateUrl('templates/rss-detail.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.rss_modal = modal;
    // });

    // $scope.closeRss = function() {
    //     $scope.rss_modal.hide();
    // };

    // $scope.rss_detail = function() {
    //     $scope.rss_modal.show();
    // };

})

.controller('DetailCtrl', function($scope, $rootScope, $ionicScrollDelegate, $stateParams, $ionicLoading, $ionicModal, Storage, rssUtils) {
    $ionicLoading.show();
    $scope.rss = rssUtils.findByName($rootScope.rsslist, $stateParams.name);
    $.ajax({
        url: $scope.rss.url,
        // url: "http://news.qq.com/newsgn/rss_newsgn.xml",
        dataType: 'xml',
        success: function(response) {
            $ionicLoading.hide();
            json = $.xml2json(response);
            // console.log(json["#document"]["rss"]["channel"]["item"]);
            $scope.articles = json["#document"]["rss"]["channel"]["item"];
        }
    });
    $ionicModal.fromTemplateUrl('templates/article.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.article_modal = modal;
    });
    $scope.closeArticle = function() {
        $scope.article_modal.hide();
    };
    $scope.goToArticle = function(article) {
        // $scope.the_article = article;
        $scope.the_article = {
            "description": article.description.replace(/<img/g, '$& width="100%"'),
            "title": article.title
        };
        // console.log($scope.the_article.description);
        $scope.article_modal.show();
        $ionicScrollDelegate.scrollTop();
    };

})


.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicModal, $timeout, Chats, Storage) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $rootScope, $ionicModal, $timeout , $cordovaToast, Storage) {
    $scope.add_rssData = {};

    $ionicModal.fromTemplateUrl('templates/add-rss.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.add_rss_modal = modal;
    });

    $scope.closeAddrss = function() {
        $scope.add_rss_modal.hide();
    };

    $scope.add_rss = function() {
        $scope.add_rss_modal.show();
    };
    $scope.doAddrss = function() {
        // console.log('Doing add', $scope.add_rssData);
        // for (var i = 0; i < $rootScope.rsslist.length; i++) {
        //     var index = $rootScope.rsslist[i].url('http');
        //     if (index !== 0) {
        //         $cordovaToast.show('Url is invalid.', 'long', 'center');
        //         i = $rootScope.rsslist.length + 1;
        //     }
        //     if ($rootScope.rsslist[i].name == $scope.add_rssData.name) {
        //         console.log('in1');
        //         $cordovaToast.show('This rss is already in list.', 'long', 'center');
        //         i = $rootScope.rsslist.length + 1;
        //     }
        //     if ($rootScope.rsslist[i].url == $scope.add_rssData.url) {
        //         console.log('in2');
        //         $cordovaToast.show('This rss is already in list.', 'long', 'center');
        //         i = $rootScope.rsslist.length + 1;
        //     }
        // }
        // if (i == $rootScope.rsslist.length) {
            $rootScope.rsslist.push($scope.add_rssData);
            Storage.set("rsslist", $rootScope.rsslist);
            console.log($rootScope.rsslist);
            $cordovaToast.show('Rss add success!', 'long', 'center');
            $timeout(function () {
                $scope.closeAddrss();
            }, 1000);
        // }
    };

    // $scope.settings = {
    //     enableFriends: true
    // };
});
