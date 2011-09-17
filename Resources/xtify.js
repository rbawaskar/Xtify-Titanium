var Xtify = {
	baseurl:'http://api.xtify.com/1.2',
	appKey:'ENTER_YOUR_APP_KEY_HERE',
	deviceType:(Ti.Platform.name == 'iPhone OS')?'iPhone':'Android',
	getToken: function() {
		return Ti.Network.remoteDeviceUUID;
	},
	register: function(lambda, lambdaerror) {
		var method = 'PUT';
		var token = Xtify.getToken();
		var url = Xtify.baseurl+'/client/registration';
		var params = {"device-registration":{
			"timezone":"America/New_York",
			"deviceToken":token,
			"deviceId":Ti.Platform.id,
			"appKey":Xtify.appKey,
			"deviceType":Xtify.deviceType}
		};
		payload = (params) ? JSON.stringify(params) : '';
		Ti.API.info('sending registration with params '+payload);
		Xtify.helper(url, method, payload, function(data,status){
			Ti.API.log('completed registration: '+JSON.stringify(status));
			if (status == 200) {
				lambda({action:"updated",success:true});
			} else if (status == 201) {
				lambda({action:"created",success:true});
			} else {
				Ti.API.log('error registration: '+JSON.stringify(status));
			}
		},function(xhr,error) {
			Ti.API.log('xhr error registration: '+JSON.stringify(error));
		});
	},
	updateGeoLocation:function(lambda, lambdaerror){
		Ti.Geolocation.purpose = "GPS user coordinates";
		Ti.Geolocation.distanceFilter = 10; // set the granularity of the location event
		Ti.Geolocation.getCurrentPosition(function(e)	{
			if (e.error){
				// manage the error
				return;
			}
			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;
			var altitude = e.coords.altitude;
			var heading = e.coords.heading;
			var accuracy = e.coords.accuracy;
			var speed = e.coords.speed;
			var timestamp = e.coords.timestamp;
			var altitudeAccuracy = e.coords.altitudeAccuracy;

			var method = 'PUT';
			var loc_params = {"location":{
				"deviceToken":Xtify.getToken(),
				"appKey":Xtify.appKey,
				"deviceType":Xtify.deviceType,
				"lat":latitude,
				"lon":longitude,
				"alt":altitude,
				"accuracy":accuracy,
				"timestamp":timestamp
				}
			};
			var payload = (loc_params) ? JSON.stringify(loc_params): '';
			var url =  Xtify.baseurl+'/client/location';
			Xtify.helper(url, method, payload, function(data,status){
				alert(data);
				alert(status);
				if (status == 200) {
					lambda({status:status});
				} else {
					lambda({status: status});
				}
			},function(xhr,error) {
				lambda({success:false,xhr:xhr.status,error:error});
			});
		});	
	},
	helper: function(url, method, params, lambda, lambdaerror) {
		Ti.API.info(url, method, params, lambda, lambdaerror);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(60000);
		xhr.onerror = function(e) {
			lambdaerror(this,e);
		};
		xhr.onload = function() {
			var results = this.responseText;
			lambda(results, this.status);
		};
		// open the client
		xhr.open(method, url);
		xhr.setRequestHeader('Content-Type','application/json');
		// send the data
		xhr.send(params);
	}
};