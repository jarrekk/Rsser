angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services', 'ngSanitize'])

.controller('MainCtrl', function($scope, $state) {

})

.controller('HomeCtrl', function($scope, $rootScope, $ionicModal, $timeout, $cordovaToast, $ionicListDelegate, Storage, rssUtils) {
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
        if (rss.type) {
            var type = rss.type;
            if ($rootScope.add_rsslist[type].length > 0) {
                latest_id = $rootScope.add_rsslist[type][$rootScope.add_rsslist[type].length - 1].id;
            } else {
                latest_id = 0;
            }
            rss.id = latest_id + 1;
            $rootScope.add_rsslist[type].push(rss);
        }
        Storage.set("rsslist", $rootScope.rsslist);
        Storage.set("add_rsslist", $rootScope.add_rsslist);
        // console.log($rootScope.add_rsslist);
        $cordovaToast.show('Rss delete success!', 'short', 'center');
    };
})

.controller('DetailCtrl', function($scope, $rootScope, $compile, $ionicScrollDelegate, $stateParams, $ionicLoading, $ionicModal, $cordovaInAppBrowser, Storage, rssUtils) {
    $ionicLoading.show({template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'});
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
              duration: 1500
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
                  duration: 1500
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
        var description = article.description.replace(/<img/g, '$& width="100%"').replace(/href="([^"]*)"/g, 'ng-click="openinbrowser(\'$1\')"');
        $scope.the_article = {
            // "description": article.description.replace(/<img/g, '$& width="100%"').replace(/(href="[^"]*")/g, ''),
            "description": description,
            "title": article.title,
            "link": article.link,
            "pubDate": article.pubDate.replace(/ \+.*/, '')
        };
        console.log($scope.the_article.description);
        $scope.article_modal.show();
        $ionicScrollDelegate.scrollTop();
    };
    $scope.openinbrowser = function(url)
    {
        $cordovaInAppBrowser.open(url, '_system');
    };
})

.controller('AddRsslistCtrl', function($scope, $rootScope, $ionicScrollDelegate, $state, $stateParams, $ionicLoading, $timeout, $cordovaToast, Storage, rssUtils) {
    $scope.category = $stateParams.category;
    $scope.the_rsslist = $rootScope.add_rsslist[$stateParams.category];
    $scope.add_to_list = function(rss) {
        var type = rss.type;
        $rootScope.add_rsslist[type] =  rssUtils.deletebyId($rootScope.add_rsslist[type], rss.id);
        console.log($rootScope.add_rsslist);
        Storage.set("add_rsslist", $rootScope.add_rsslist);
        if ($rootScope.rsslist.length > 0) {
            latest_id = $rootScope.rsslist[$rootScope.rsslist.length - 1].id;
        } else {
            latest_id = 0;
        }
        rss.id = latest_id + 1;
        $rootScope.rsslist.push(rss);
        Storage.set("rsslist", $rootScope.rsslist);
        $cordovaToast.show('Rss add success!', 'short', 'center');
    };

})

.controller('AddRssCtrl', function($scope, $rootScope, $ionicModal, $timeout, $cordovaToast, Storage) {
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
        if ($rootScope.rsslist.length > 0) {
            latest_id = $rootScope.rsslist[$rootScope.rsslist.length - 1].id;
        } else {
            latest_id = 0;
        }
        $scope.add_rssData.name = $scope.add_rssData.name + '_manual';
        $scope.add_rssData.id = latest_id + 1;
        $scope.add_rssData.img = "img/rss/rss.png";
        $rootScope.rsslist.push($scope.add_rssData);
        Storage.set("rsslist", $rootScope.rsslist);
        $cordovaToast.show('Rss add success!', 'short', 'center');
        $timeout(function () {
            $scope.closeAddrss();
            $scope.add_rssData = {};
        }, 500);
    };

})

;
