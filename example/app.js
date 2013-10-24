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

// TODO: write your module tests here
var vkontakte = require('ti.vkontakte');
Ti.API.info("module is => " + vkontakte);

vkontakte.appid = '1234567';
vkontakte.permissions = [vkontakte.PERMISSION.POST_WALL, vkontakte.PERMISSION.FRIENDS];
vkontakte.addEventListener('login', function(e) {
    if(e.success) {
        alert('user: ' + vk.user + ' and token: ' + vk.token);
    } else if(e.cancelled) {
        // user pressed cancel button
    } else {
        alert(e.error);
    }
});

vkontakte.authorize();
        
if (Ti.Platform.name == "android") {
	var proxy = vkontakte.createExample({
		message: "Creating an example Proxy",
		backgroundColor: "red",
		width: 100,
		height: 100,
		top: 100,
		left: 150
	});

	proxy.printMessage("Hello world!");
	proxy.message = "Hi world!.  It's me again.";
	proxy.printMessage("Hello world!");
	win.add(proxy);
}

