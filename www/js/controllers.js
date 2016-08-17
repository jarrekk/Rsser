angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services', 'ngSanitize'])

.controller('TourCtrl', function($scope, $timeout) {
    $scope.slideChanged = function(index) {
        console.log(index);
        switch(index) {
            case 0:
                jQuery("#0-up, #0-down, #0-img").removeAttr('class').attr('class', '');
                jQuery("#0-up, #0-down, #0-img").addClass('animated');
                jQuery("#0-up").addClass('fadeInUp');
                jQuery("#0-down").addClass('fadeInDown');
                jQuery("#0-img").addClass('rotateIn');
                $timeout(function() {
                    $('#1-up, #1-down, #1-img').removeAttr('class').attr('class', '');
                }, 500);
                console.log('I am on slide 0');
                break;
            case 1:
                $('#1-up, #1-down, #1-img').removeAttr('class').attr('class', '');
                $('#1-up, #1-down, #1-img').addClass('animated');
                $('#1-up').addClass('fadeInUp');
                $('#1-down').addClass('fadeInDown');
                $('#1-img').addClass('rotateIn');
                $timeout(function() {
                    jQuery("#0-up, #0-down, #0-img").removeAttr('class').attr('class', '');
                    $('#2-up').removeAttr('class').attr('class', '');
                }, 500);
                console.log('I am on slide 1');
                break;
            case 2:
                $('#2-up').removeAttr('class').attr('class', '');
                $('#2-up').addClass('animated');
                $('#2-up').addClass('fadeInUp');
                $timeout(function() {
                    $('#1-up, #1-down, #1-img').removeAttr('class').attr('class', '');
                }, 500);
                console.log('I am on slide 2');
                break;
        }
    };
})

.controller('MainCtrl', function($scope, $rootScope, $state, $ionicHistory, Storage) {
    $scope.goHome = function(version) {
        $state.go("tab.home");
        Storage.set("tour", {
            "version": version
        });
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

    // $ionicModal.fromTemplateUrl('templates/article-addition.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.article_modal = modal;
    // });

    // $scope.close_article_modal = function() {
    //     $scope.article_modal.hide();
    // };

    // $scope.article_addition = function(rss) {
    //     // $ionicListDelegate.closeOptionButtons();
    //     $scope.article_modal.show();
    // };

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
            destructiveText: '删除',
            cancelText: '取消',
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
    // $scope.showban = function() {
    // navigator.wapsAd.showban();
    // };
    $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
    });
    $scope.rss = rssUtils.findById($rootScope.rsslist, $stateParams.id);
    var url = "http://rss2json.com/api.json?callback=JSON_CALLBACK&rss_url=" + $scope.rss.url;

    function get_articles(url) {
        $.ajax({
            type: "get",
            timeout: 20000,
            cache: true,
            ifModified: true,
            // async: false,
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
                    template: '获取文章失败，请检查rss地址或稍后再试',
                    duration: 1500
                });
            }
        });
    }
    get_articles(url);

    $scope.doRefresh = function(rss) {
        var url = "http://rss2json.com/api.json?callback=JSON_CALLBACK&rss_url=" + $scope.rss.url;
        $.ajax({
            type: "get",
            timeout: 20000,
            cache: false,
            // async: false,
            url: url,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "flightHandler",
            success: function(json) {
                $ionicLoading.hide();
                $scope.articles = json.items;
                $scope.$broadcast('scroll.refreshComplete');
                // console.log(json);
            },
            error: function() {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $ionicLoading.show({
                    template: '获取文章失败，请检查rss地址或稍后再试',
                    duration: 1500
                });
            }
        });
    };

    $scope.broadcast_article = function(article) {
        if ($rootScope.settings["save_traffic"]) {
            var content = article.content.replace(/<img[^>]*>/g, '').replace(/href="([^"]*)"/g, 'ng-click="openinbrowser(\'$1\')"');
        } else {
            var content = article.content.replace(/<img/g, '$& style="width: auto;height: auto;max-width:100%;"').replace(/href="([^"]*)"/g, 'ng-click="openinbrowser(\'$1\')"');
        }
        if ($rootScope.settings["night"]) {
            var content = content.replace(/<p[^>]*>/g, '<p$1 ng-class="{true: \'light\', false: \'\'}[settings.night]">').replace(/<h(.) [^>]*>/g, '<h$1 $2 ng-class="{true: \'light\', false: \'\'}[settings.night]">');
        }
        // console.log(content);
        $rootScope.the_article = {
            // "description": article.description.replace(/<img/g, '$& width="100%"').replace(/(href="[^"]*")/g, ''),
            "content": content,
            "title": article.title,
            "link": article.link,
            "pubDate": article.pubDate.replace(/ \+.*/, '')
        };
    };

    $scope.favourite = function() {

    }
})

.controller('ArticleCtrl', function($scope, $cordovaInAppBrowser, $ionicPopup, $ionicModal, $ionicLoading) {
    $scope.openinbrowser = function(url) {
        $cordovaInAppBrowser.open(url, '_system');
    };

    $ionicModal.fromTemplateUrl('templates/article-addition.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.article_modal = modal;
    });

    $scope.close_article_modal = function() {
        $scope.article_modal.hide();
    };

    $scope.article_addition = function(rss) {
        // $ionicListDelegate.closeOptionButtons();
        $scope.article_modal.show();
    };

    $scope.share = function(article, scene) {
        Wechat.isInstalled(function(installed) {
            var link = article.link;
            var title = article.title;
            if (scene == 'session') {
                the_scene = Wechat.Scene.SESSION;
            } else if (scene == 'favourite') {
                the_scene = Wechat.Scene.FAVORITE;
            } else {
                the_scene = Wechat.Scene.TIMELINE;
            }
            console.log(installed);
            if (installed) {
                Wechat.share({
                    message: {
                        title: title,
                        description: link,
                        mediaTagName: "Rsser",
                        thumb: "https://mmbiz.qlogo.cn/mmbiz/ibyYtkPq9m4o8Hyt9XrIPbiciauPQuZQLPjoHX12ohfV9ZEWPh5XciaZyficsCV8GCjdPTqgia9tVvd01RjbtgiaZBOXQ/0?wx_fmt=png",
                        media: {
                            type: Wechat.Type.WEBPAGE, // webpage
                            webpageUrl: link // webpage
                        }
                    },
                    // text: title + "-" + link + "-" + "Shared from Rsser",
                    scene: the_scene // share to Timeline
                }, function() {
                    $ionicLoading.show({
                        template: '分享成功!',
                        duration: 1500
                    });
                }, function(reason) {
                    $ionicLoading.show({
                        template: reason,
                        duration: 1500
                    });
                });
            } else {
                $ionicLoading.show({
                    template: "未安装微信!",
                    duration: 1500
                });
            }
        });
    };
})

.controller('AddRsslistCtrl', function($scope, $rootScope, $ionicScrollDelegate, $ionicActionSheet, $state, $stateParams, $ionicLoading, $timeout, Storage, rssUtils) {
    $scope.category = $stateParams.category;
    $scope.the_rsslist = $rootScope.add_rsslist[$stateParams.category];

    var add_to_list = function(rss) {
        var type = rss.type;
        $rootScope.add_rsslist[type] = rssUtils.deletebyId($rootScope.add_rsslist[type], rss.id);
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
            buttons: [{
                text: '添加'
            }, ],
            titleText: rss.name,
            cancelText: '取消',
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

.controller('AddRssCtrl', function($scope, $rootScope, $ionicModal, $timeout, $ionicLoading, $ionicActionSheet, Storage) {
    $scope.add_rssData = {};
    $ionicModal.fromTemplateUrl('templates/add-rss.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.add_rss_modal = modal;
    });

    $scope.closeAddrss = function() {
        $scope.add_rssData = {};
        $scope.add_rss_modal.hide();
    };

    $scope.add_rss = function() {
        $scope.add_rss_modal.show();
    };

    $scope.scan_qr = function scan() {
        console.log('scan');
        cordova.plugins.barcodeScanner.scan(
            function(result) {
                if (!result.cancelled) {
                    if (result.format == "QR_CODE") {
                        console.log(result, 'result');
                        $scope.add_rssData.url = result.text;
                        $ionicLoading.show({
                            template: "扫描成功!",
                            duration: 1000
                        });
                    }
                }
            },
            function(error) {
                console.log("扫描失败: " + error);
                $ionicLoading.show({
                    template: "扫描失败: " + error,
                    duration: 1000
                });
            }
        );
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
        $timeout(function() {
            $scope.closeAddrss();
            $scope.add_rssData = {};
        }, 500);
    };

    $scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '添加'
            }, ],
            titleText: $scope.add_rssData.name,
            cancelText: '取消',
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

.controller('ConfigCtrl', function($scope, $rootScope, $http, $ionicLoading, Storage) {
    $scope.clearcache = function() {
        $rootScope.rsslist = [];
        $http.get('add_rsslist.json').then(function(resp) {
            $rootScope.add_rsslist = resp.data;
        });
        Storage.remove('rsslist');
        Storage.remove('add_rsslist');
        $ionicLoading.show({
            template: '清除缓存配置成功!',
            duration: 1000
        });
    };
    $scope.$watch('settings.save_traffic', function() {
        Storage.set("settings", $rootScope.settings);
    });
    $scope.$watch('settings.night', function() {
        Storage.set("settings", $rootScope.settings);
    });
})

.controller('AboutCtrl', function($scope, $rootScope, $ionicActionSheet, $timeout, $ionicLoading) {
    var share = function(scene) {
        Wechat.isInstalled(function(installed) {
            if (scene == 'session') {
                the_scene = Wechat.Scene.SESSION;
            } else {
                the_scene = Wechat.Scene.TIMELINE;
            }
            console.log(installed);
            if (installed) {
                Wechat.share({
                    message: {
                        title: "苹果应用Rsser",
                        description: "Rss订阅器，自由的阅读新闻。",
                        mediaTagName: "Rsser",
                        thumb: "https://mmbiz.qlogo.cn/mmbiz/ibyYtkPq9m4o8Hyt9XrIPbiciauPQuZQLPjoHX12ohfV9ZEWPh5XciaZyficsCV8GCjdPTqgia9tVvd01RjbtgiaZBOXQ/0?wx_fmt=png",
                        media: {
                            type: Wechat.Type.WEBPAGE, // webpage
                            webpageUrl: "http://www.jack003.com" // webpage
                        }
                    },
                    // text: title + "-" + link + "-" + "Shared from Rsser",
                    scene: the_scene // share to Timeline
                }, function() {
                    $ionicLoading.show({
                        template: '感谢您的分享!',
                        duration: 1500
                    });
                }, function(reason) {
                    $ionicLoading.show({
                        template: reason,
                        duration: 1500
                    });
                });
            } else {
                $ionicLoading.show({
                    template: "未安装微信!",
                    duration: 1500
                });
            }
        });
    };
    $scope.show = function() {
        var hideSheet = $ionicActionSheet.show({
            buttons: [{
                text: '微信好友'
            }, {
                text: '微信朋友圈'
            }],
            titleText: "分享Rsser",
            cancelText: '取消',
            cancel: function() {
                // add cancel code..
            },
            buttonClicked: function(index) {
                if (index === 0) {
                    share('session');
                } else if (index === 1) {
                    share();
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
