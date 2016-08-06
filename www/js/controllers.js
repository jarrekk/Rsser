angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services', 'ngSanitize'])

.controller('DashCtrl', function($scope, $rootScope, $ionicModal, $timeout, $cordovaToast, $ionicListDelegate, Storage, rssUtils) {
    $scope.add_rssData = {};
    $scope.edit_rssData = {};

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
        latest_id = $rootScope.rsslist[$rootScope.rsslist.length - 1].id;
        $scope.add_rssData.id = latest_id + 1;
        $rootScope.rsslist.push($scope.add_rssData);
        Storage.set("rsslist", $rootScope.rsslist);
        // console.log($rootScope.rsslist);
        $cordovaToast.show('Rss add success!', 'short', 'center');
        $timeout(function () {
            $scope.closeAddrss();
            $scope.add_rssData = {};
        }, 1000);
    };

    $scope.edit_rssData = {};

    $ionicModal.fromTemplateUrl('templates/edit-rss.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.edit_rss_modal = modal;
    });

    $scope.closeEditrss = function() {
        $scope.edit_rss_modal.hide();
    };

    $scope.edit_rss = function(rss) {
        $ionicListDelegate.closeOptionButtons();
        $scope.edit_rssData = rss;
        $scope.edit_rss_modal.show();
    };

    $scope.doEditrss = function() {
        rssUtils.editbyId($rootScope.rsslist, $scope.edit_rssData.id, $scope.edit_rssData);
        Storage.set("rsslist", $rootScope.rsslist);
        // console.log($rootScope.rsslist);
        $cordovaToast.show('Rss add success!', 'short', 'center');
        $timeout(function () {
            $scope.closeEditrss();
            $scope.edit_rssData = {};
        }, 1000);
    };

    $scope.delete_rss = function(rss) {
        $rootScope.rsslist = rssUtils.deletebyId($rootScope.rsslist, rss.id);
        Storage.set("rsslist", $rootScope.rsslist);
        $cordovaToast.show('Rss delete success!', 'short', 'center');
    };
})

.controller('DetailCtrl', function($scope, $rootScope, $ionicScrollDelegate, $stateParams, $ionicLoading, $ionicModal, Storage, rssUtils) {
    $ionicLoading.show();
    $scope.rss = rssUtils.findById($rootScope.rsslist, $stateParams.id);
    $.ajax({
        url: $scope.rss.url,
        // cache: false,
        dataType: 'xml',
        success: function(response) {
            $ionicLoading.hide();
            json = $.xml2json(response);
            $scope.articles = json["#document"]["rss"]["channel"]["item"];
            // console.log($scope.articles);
        },
        error: function(response) {
            $ionicLoading.hide();
            $ionicLoading.show({
              template: 'Failed to get rss! Please check the rss address.',
              duration: 3000
            });
        }
    });
    $scope.doRefresh = function(rss) {
        $.ajax({
            url: rss.url,
            // cache: false,
            dataType: 'xml',
            success: function(response) {
                json = $.xml2json(response);
                $scope.articles = json["#document"]["rss"]["channel"]["item"];
                $scope.$broadcast('scroll.refreshComplete');
            },
            error: function(response) {
                $ionicLoading.show({
                  template: 'Failed to get rss! Please check the rss address.',
                  duration: 3000
                });
                $scope.$broadcast('scroll.refreshComplete');
            }
        });
    };
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
            "title": article.title,
            "link": article.link,
            "pubDate": article.pubDate
        };
        // console.log($scope.the_article.description);
        $scope.article_modal.show();
        $ionicScrollDelegate.scrollTop();
    };

})
