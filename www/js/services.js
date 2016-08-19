angular.module('starter.services', ['ngCordova'])

.factory('Storage', function() {
    return {
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {
            return window.JSON.parse(window.localStorage.getItem(key));
        },
        remove: function(key) {
            return window.localStorage.removeItem(key);
        }
    };
})

.factory('rssUtils', function() {
    return {
        findById: function findById(a, id) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == id) return a[i];
            }
            return null;
        },
        deletebyId: function deletebyId(a, id) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == id) {
                    a.splice(i, 1);
                    return a;
                }
            }
            return null;
        },
        editbyId: function editbyId(a, id, obj) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].id == id) {
                    a[i] = obj;
                    return a;
                }
            }
            return null;
        }
    };
})

;
