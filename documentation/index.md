# vkontakte Module

## Description

The ti.vkontakte module lets you use API of russian social network VKontakte.

## Accessing the vkontakte Module

To access this module from JavaScript, you would do the following:

	var vkontakte = require("ti.vkontakte");

The vkontakte variable is a reference to the Module object.	

## Reference

### Constants ###

There are some constants which are used for set application permissions:

	vkontakte.PERMISSION.NOTIFICATION
	vkontakte.PERMISSION.FRIENDS
	vkontakte.PERMISSION.PHOTOS
	vkontakte.PERMISSION.AUDIO
	vkontakte.PERMISSION.VIDEO
	vkontakte.PERMISSION.OFFERS
	vkontakte.PERMISSION.QUESTIONS
	vkontakte.PERMISSION.WIKI
	vkontakte.PERMISSION.WRITE_APPLINK
	vkontakte.PERMISSION.WRITE_WALLAPPLINK
	vkontakte.PERMISSION.STATUS
	vkontakte.PERMISSION.NOTES
	vkontakte.PERMISSION.MESSAGES
	vkontakte.PERMISSION.POST_WALL
	vkontakte.PERMISSION.ADVERTIZE
	vkontakte.PERMISSION.DOCUMENTS
	vkontakte.PERMISSION.GROUPS
	vkontakte.PERMISSION.ANSWERS
	vkontakte.PERMISSION.STATISTICS

The complete documentation about VKontakte permissions you can find there:
[http://vk.com/dev/permissions](http://vk.com/dev/permissions)

### Properties ###

	vkontakte.appid

The identifier of your application. Example: `vkontakte.appid = "12345"`

	vkontakte.permissions

The permissions list for your application. Example: `vkontakte.permissions = [vkontakte.PERMISSION.POST_WALL, vkontakte.PERMISSION.FRIENDS]`

### Functions ###

	vkontakte.fireEvent(eventName, eventContent)

The fireEvent method works as in other Titanium objects.

	vkontakte.addEventListener(eventName, callback)

The addEventListener method works as in other Titanium objects.

	vkontakte.removeEventListener(eventName, callback)

The removeEventListener method work ad in other Titanium objects.

	vkontakte.authorize()

This method performs user login and ask for permissions you want. If user already logged in this method doesn't show login window but immediately fires 'login' event.

	vkontakte.makeAPICall(method, params)

Call VKontakte API with parameters. You will get answer as 'result' event. Example: `vkontakte.makeAPICall('wall.post', {message: 'Test post'});`
The full list of API calls and parameters you can find this: [http://vk.com/dev/methods](http://vk.com/dev/methods)

### Events ###

	login

Login event fired when you call authorize method. The event always has success field (bool), sometimes has error field (string) and cancelled field (bool).

	error

Error event fired when some unexpected situation happened. The event always has success field (false) and error field (string).

	result

Result event fired when server returns an answer for your API call. The events fields depends on the API method.

## Usage

Below you can see the complete usage example:

`
	var vkontakte = require('ti.vkontakte');
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
`

## Author

Copyright (c) 2013 Vasiliy Makarov
<drmoriarty.0@gmail.com>

## License


