// This is a test harness for your module
// You should do something interesting in this harness 
// to test out the module and to provide instructions 
// to users on how to use it by example.


// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var label = Ti.UI.createLabel();
win.add(label);
win.open();

var vkontakte = require('ti.vkontakte');
Ti.API.info("module is => " + vkontakte);

vkontakte.appid = '1234567';
vkontakte.permissions = [vkontakte.PERMISSION.POST_WALL, vkontakte.PERMISSION.FRIENDS];
vkontakte.addEventListener('login', function(e) {
    if(e.success) {
        alert('user: ' + vk.user + ' and token: ' + vk.token);
        vk.makeAPICall('wall.post', {
            message: 'This is a test post to my VKontakte wall.'
        });
    } else if(e.cancelled) {
        // user pressed cancel button
	alert('User pressed cancel button');
    } else {
        alert(e.error);
    }
});

vkontakte.addEventListener('error', function(e) {
    alert(e.error);
});

vk.addEventListener('result', function(e) {
    if(e.result.hasOwnProperty('post_id')) {
        Ti.API.info('New post id: '+e.result.post_id);
	alert('New message id: '+e.result.post_id);
    }
});

vkontakte.authorize();
        

