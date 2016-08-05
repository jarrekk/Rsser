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

.factory('rssUtils', function () {
    return {
        findByName: function findByName(a, name) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].name == name) return a[i];
            }
            return null;
        },
        deletebyName: function deletebyName(a, name) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].name == name) {
                    a.splice(i, 1);
                    return a;
                }
            }
            return null;
        },
        editbyName: function editbyName(a, name, obj) {
            for (var i = 0; i < a.length; i++){
                if (a[i].name == name) {
                    a[i] = obj;
                    return a;
                }
            }
            return null;
        }
    };
})

.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

;
