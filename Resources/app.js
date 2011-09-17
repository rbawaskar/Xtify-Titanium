Titanium.UI.setBackgroundColor('#000');
var win = Titanium.UI.createWindow({
	title:'Xtify-Titanium',
	backgroundColor:'#fff'
});

Ti.include('./xtify.js');

var register = Ti.UI.createButton({
	title: 'register',
	top: 60,
	left: 130,
	width: 120,
	height: 25
});

register.addEventListener('click', function() {
	Ti.Network.registerForPushNotifications({
		types: [
		Ti.Network.NOTIFICATION_TYPE_BADGE,
		Ti.Network.NOTIFICATION_TYPE_ALERT,
		Ti.Network.NOTIFICATION_TYPE_SOUND
		],
		success:function(e) {
			var deviceToken = e.deviceToken;
			Ti.API.info('successfully registered for apple device token with '+e.deviceToken);
			Xtify.register(function(data) {
				Ti.API.debug("register Xtify success: " + JSON.stringify(data));
			}, function(errorregistration) {
				Ti.API.warn("Couldn't register for Xtify");
			});
			//update geolocation for Xtify 
			Xtify.updateGeoLocation(function(data) {
				Ti.API.debug("updateGeoLocation success: " + JSON.stringify(data));
			}, function(errorgeolocation) {
				Ti.API.warn("Couldn't register for Urban Airship");
			});

		},
		error:function(e) {
			Ti.API.warn("push notifications disabled: "+e);
		},
		callback:function(e) {
			var a = Ti.UI.createAlertDialog({
				title:'New Message',
				message:e.data.alert
			});
			a.show();
		}
	});
});
win.add(register);

win.open();