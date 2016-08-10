angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services', 'ngSanitize'])

.controller('MainCtrl', function($scope, $rootScope, $state, $ionicHistory, Storage) {
    $scope.goHome = function(version) {
        $state.go("tab.home");
        Storage.set("tour", {"version": version});
    };

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };

    $scope.data = {
        "showReorder": false
    };
    $scope.showReorder = function() {
        $scope.data.showReorder = !$scope.data.showReorder;
    };
})

.controller('HomeCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicActionSheet, $ionicListDelegate, Storage, rssUtils) {
    $scope.moveItem = function(rss, fromIndex, toIndex) {
        $rootScope.rsslist.splice(fromIndex, 1);
        $rootScope.rsslist.splice(toIndex, 0, rss);
        Storage.set("rsslist", $rootScope.rsslist);
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
        $timeout(function () {
            $scope.closeEditrss();
            $scope.edit_rssData = {};
        }, 1000);
    };

    var delete_rss = function(rss) {
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
    };

    $scope.show = function(rss) {
        var hideSheet = $ionicActionSheet.show({
            titleText: rss.name,
            destructiveText: 'Delete',
            cancelText: 'Cancel',
            destructiveButtonClicked: function() {
                delete_rss(rss);
                hideSheet();
            }
        });
        $timeout(function() {
            hideSheet();
        }, 3500);
    };
})

.controller('DetailCtrl', function($scope, $rootScope, $compile, $ionicScrollDelegate, $stateParams, $http, $ionicLoading, $ionicModal, $cordovaInAppBrowser, Storage, rssUtils) {
    $ionicLoading.show({template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'});
    $scope.rss = rssUtils.findById($rootScope.rsslist, $stateParams.id);
    var url = "http://rss2json.com/api.json?callback=JSON_CALLBACK&rss_url=" + $scope.rss.url;
    function get_articles(url) {
        $.ajax({
            type: "get",
            async: false,
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "flightHandler",
            success: function(json) {
                $ionicLoading.hide();
                $scope.articles = json.items;
                // console.log(json);
            },
            error: function() {
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: 'Failed to get rss! Please check the rss address.',
                  duration: 1500
                });
            }
        });
    }
    get_articles(url);

    $scope.doRefresh = function(rss) {
        var url = "http://rss2json.com/api.json?callback=JSON_CALLBACK&rss_url=" + $scope.rss.url;
        get_articles(url);
        $scope.$broadcast('scroll.refreshComplete');
    };

    // $.ajax({
    //     url: $scope.rss.url,
    //     // cache: false,
    //     dataType: 'xml',
    //     success: function(response) {
    //         $ionicLoading.hide();
    //         json = $.xml2json(response);
    //         $scope.articles = json["#document"]["rss"]["channel"]["item"];
    //         // console.log($scope.articles);
    //     },
    //     error: function(response) {
    //         $ionicLoading.hide();
    //         $ionicLoading.show({
    //           template: 'Failed to get rss! Please check the rss address.',
    //           duration: 1500
    //         });
    //     }
    // });

    // $ionicModal.fromTemplateUrl('templates/article.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.article_modal = modal;
    // });
    // $scope.closeArticle = function() {
    //     $scope.article_modal.hide();
    // };
    // $scope.goToArticle = function(article) {
    //     var content = article.content.replace(/<img/g, '$& width="100%"').replace(/href="([^"]*)"/g, 'ng-click="openinbrowser(\'$1\')"');
    //     $scope.the_article = {
    //         // "description": article.description.replace(/<img/g, '$& width="100%"').replace(/(href="[^"]*")/g, ''),
    //         "content": content,
    //         "title": article.title,
    //         "link": article.link,
    //         "pubDate": article.pubDate.replace(/ \+.*/, '')
    //     };
    //     // console.log($scope.the_article.description);
    //     $scope.article_modal.show();
    //     $ionicScrollDelegate.scrollTop();
    // };

    $scope.broadcast_article = function(article) {
        var content = article.content.replace(/<img/g, '$& width="100%"').replace(/href="([^"]*)"/g, 'ng-click="openinbrowser(\'$1\')"');
        $rootScope.the_article = {
            // "description": article.description.replace(/<img/g, '$& width="100%"').replace(/(href="[^"]*")/g, ''),
            "content": content,
            "title": article.title,
            "link": article.link,
            "pubDate": article.pubDate.replace(/ \+.*/, '')
        };
    };
})

.controller('ArticleCtrl', function($scope, $cordovaInAppBrowser) {
    $scope.openinbrowser = function(url)
    {
        $cordovaInAppBrowser.open(url, '_system');
    };
})

.controller('AddRsslistCtrl', function($scope, $rootScope, $ionicScrollDelegate, $ionicActionSheet, $state, $stateParams, $ionicLoading, $timeout, Storage, rssUtils) {
    $scope.category = $stateParams.category;
    $scope.the_rsslist = $rootScope.add_rsslist[$stateParams.category];

    var add_to_list = function(rss) {
        var type = rss.type;
        $rootScope.add_rsslist[type] =  rssUtils.deletebyId($rootScope.add_rsslist[type], rss.id);
        // console.log($rootScope.add_rsslist);
        Storage.set("add_rsslist", $rootScope.add_rsslist);
        if ($rootScope.rsslist.length > 0) {
            latest_id = $rootScope.rsslist[$rootScope.rsslist.length - 1].id;
        } else {
            latest_id = 0;
        }
        rss.id = latest_id + 1;
        $rootScope.rsslist.push(rss);
        Storage.set("rsslist", $rootScope.rsslist);
    };

    $scope.show = function(rss) {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>Add</b>'},
            ],
            titleText: rss.name,
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                if (index === 0) {
                    add_to_list(rss);
                }
                return true;
            }
        });
        $timeout(function() {
            hideSheet();
        }, 3500);
    };
})

.controller('AddRssCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicActionSheet, Storage) {
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
    var doAddrss = function() {
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
        $timeout(function () {
            $scope.closeAddrss();
            $scope.add_rssData = {};
        }, 500);
    };

    $scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<b>Add</b>'},
            ],
            titleText: $scope.add_rssData.name,
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                if (index === 0) {
                    doAddrss();
                }
                return true;
            }
        });
        $timeout(function() {
            hideSheet();
        }, 3500);
    };

})

;
