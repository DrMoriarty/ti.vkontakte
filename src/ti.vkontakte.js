// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

makeVK(exports);

function makeVK(vk) 
{

    // properties
    vk.appid = '';
    vk.permissions = [];

    // constants
    vk.PERMISSION = {
        NOTIFICATION: {code: 1},
        FRIENDS: {code: 2},
        PHOTOS: {code: 4},
        AUDIO: {code: 8},
        VIDEO: {code: 16},
        OFFERS: {code: 32},
        QUESTIONS: {code: 64},
        WIKI: {code: 128},
        WRITE_APPLINK: {code: 256},
        WRITE_WALLAPPLINK: {code: 512},
        STATUS: {code: 1024},
        NOTES: {code: 2048},
        MESSAGES: {code: 4096},
        POST_WALL: {code: 8192},
        ADVERTIZE: {code: 32768},
        DOCUMENTS: {code: 131072},
        GROUPS: {code: 262144},
        ANSWERS: {code: 524288},
        STATISTICS: {code: 1048576}
    };

    // functions
    vk.fireEvent = function(name, event) {
        Ti.App.fireEvent('vkontakte_'+name, event);
    };
    
    vk.addEventListener = function(name, callback) {
        Ti.App.addEventListener('vkontakte_'+name, callback);
    };
    
    vk.removeEventListener = function(name, callback) {
        Ti.App.removeEventListener('vkontakte_'+name, callback);
    };
    
    vk.makeAPICall = function(method, params) {
        var client = Ti.Network.createHTTPClient({
            onload: function(e) {
                var res = JSON.parse(client.responseText);
                if(res.hasOwnProperty('error')) {
                    vk.fireEvent('error', {success: false, error: res.error.error_msg});
                } else if (res.hasOwnProperty('response')) {
                    vk.fireEvent('result', {success: true, result: res.response});
                } else {
                    vk.fireEvent('result', {success: true, result: res});
                }
            },
            onerror: function(e) {
                vk.fireEvent('error', {success: false, error: e.error});
            },
            timeout: 5000
        });
        if(!params) params = {};
        var url = "https://api.vk.com/method/{0}?".format(method);
        for(var pname in params) {
            if(params.hasOwnProperty(pname)) {
                url = "{0}{1}={2}&".format(url, pname, params[pname]);
            }
        }
        url = "{0}access_token={1}".format(url, vk.token);
        client.open("GET", url);
        client.send();
    };
    
    vk.authorize = function() {
        if(!vk.appid || vk.appid.length <= 0) {
            vk.fireEvent('login', {success: false, error: 'Set an application ID before using this method!'});
            return;
        }
        var psum = 0;
        for (var i = vk.permissions.length - 1; i >= 0; i--){
            var p = vk.permissions[i];
            psum += p.code;
        };
        if(psum <= 0) {
            vk.fireEvent('login', {success: false, error: 'Set the permissions before using this method!'});
            return;
        }
        var url = "https://oauth.vk.com/authorize?client_id="+vk.appid+"&scope="+psum+"&redirect_uri=https://oauth.vk.com/blank.html&display=mobile&response_type=token";
        var webView = Ti.UI.createWebView({
            url: url,
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            bottom: 0,
            top: 0,
            backgroundColor: 'transparent'
        });
        var wnd = Ti.UI.createWindow();
        wnd.add(webView);
        webView.addEventListener('load', function(e) {
            var arr = e.url.split('#');
            if(arr[0] === 'https://oauth.vk.com/blank.html') {
                var arr2 = arr[1].split('&');
                var token = null;
                var expires = null;
                var user = null;
                for (var i = 0; i<arr2.length; i++) {
                    var str = arr2[i];
                    if(str.search('access_token') >= 0) {
                        token = str.split('=')[1];
                    } else if(str.search('expires_in') >= 0) {
                        expires = str.split('=')[1];
                    } else if(str.search('user_id') >= 0) {
                        user = str.split('=')[1];
                    }
                }
                //alert('user '+user+' token '+token);
                if(user && token) {
                    vk.user = user;
                    vk.token = token;
                    vk.authorized = true;
                    vk.fireEvent('login', {success: true});
                } else if(!user && !token) {
                    vk.fireEvent('login', {success: false, error: 'User canceled login dialog', cancelled: true});
                } else {
                    vk.fireEvent('login', {success: false, error: 'Unknown error!'});
                }
                wnd.close();
            }
        });
        webView.addEventListener('error', function(e) {
            if(!e.success) {
                var msg = 'Error: {0} with number: {1}'.format(e.error, e.code);
                vk.fireEvent('login', {success: false, error: msg});
                wnd.close();
            }
        });
        wnd.open();
    };
    return vk;
}

//module.exports = MakeVK;
