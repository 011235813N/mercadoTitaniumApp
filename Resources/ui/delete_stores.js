exports.stores = function(args) {

	var win = Titanium.UI.createWindow(args);
	var mapHolder = Ti.UI.createView({
		top : 0,
		height : 150,
		width : 'auto',
		backgroundImage : '../images/backmap.png',
		backgroundRepeat : true
	});
	win.add(mapHolder);

	var mapview = Titanium.Map.createView({
		top : 0,
		height : 140,
		width : 'auto',
		mapType : Titanium.Map.STANDARD_TYPE,
		//animate : true,
		// region : {
		// latitude : 13.7024,
		// longitude : -89.2224,
		// latitudeDelta : 0.005,
		// longitudeDelta : 0.005
		// },
		regionFit : true,
		userLocation : true,
		visible : true,
		borderWidth : 1,
		borderColor : '#A1A1A1',

	});
	mapHolder.add(mapview);

	var table = Ti.UI.createTableView({
		top : 150,
		backgroundColor : '#F8F1E9'

	});

	Ti.App.addEventListener('OpenStores', function(e) {
		// Common app code
		if (Titanium.Geolocation.locationServicesEnabled === false) {
			Titanium.UI.createAlertDialog({
				title : 'Mercado',
				message : 'Parece ser que tus servicios de geolocalización estan inactivos, activa tu GPS'
			}).show();
		} else {
			Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
			Titanium.Geolocation.purpose = "Mercado";
			Titanium.Geolocation.distanceFilter = 100;

			Titanium.Geolocation.getCurrentPosition(function(e) {
				if (!e.success || e.error) {
					//alert('Error ' + JSON.stringify(e.error + '>' + translateErrorCode(e.code)));
					return;
				} else {
					var longitude = e.coords.longitude;
					var latitude = e.coords.latitude;
					var altitude = e.coords.altitude;
					var heading = e.coords.heading;
					var accuracy = e.coords.accuracy;
					var speed = e.coords.speed;
					var timestamp = e.coords.timestamp;
					var altitudeAccuracy = e.coords.altitudeAccuracy;
					var annotationArray = [];

					var newRegion = {
						latitude : latitude,
						longitude : longitude,
						latitudeDelta : 0.01,
						longitudeDelta : 0.01,
						animate : true
					};
					mapview.setLocation(newRegion);
					mapview.regionFit = true;

					try {
						var url = "http://descubracentroamerica.com/dandovia/mercado.php?lt=" + latitude + "&lg=" + longitude;
						var tableData = [];
						var json, mercados, mercado, i, row, nameLabel;
						xhr = Ti.Network.createHTTPClient({
							onload : function() {
								try {
									json = JSON.parse(this.responseText);
									table.setData([]);
									if (json.mercados.length < 1) {
										var row = Ti.UI.createTableViewRow({
											height : '70',
											backgroundColor : '#F8F1E9'
										});
										nameLabel = Ti.UI.createLabel({
											text : 'No hay ningun mercado en 1Km.',
											font : {
												fontSize : 16,
												fontWeight : 'bold'
											},
											left : 5,
											right : 5
										});
										row.add(nameLabel);
										tableData.push(row);

										table.data = tableData;

									} else {
										table.setData([]);
										for ( i = 0; i < json.mercados.length; i++) {
											var rowAll = Ti.UI.createTableViewRow({
												height : '70',
												backgroundColor : '#F8F1E9'
											});

											// rowAll.add(rowView);
											mercado = json.mercados[i];

											nameLabel = Ti.UI.createLabel({
												text : mercado.mercado,
												font : {
													fontSize : 16,
													fontWeight : 'bold'
												},
												left : 5,
												right : 5,
												top : 3
											});
											var adress = Ti.UI.createLabel({
												text : mercado.address,
												textAlign : 'left',
												color : '#444',
												font : {
													fontSize : 12
												},
												height : 'auto',
												width : 'auto',
												left : 5,
												bottom : 3
											});

											var annotation = Titanium.Map.createAnnotation({
												latitude : mercado.lat,
												longitude : mercado.lng,
												animate : true,
												title : mercado.empresa,
												image : '../images/mercado.png',
												subtitle : mercado.address,
												//rightButton : Titanium.UI.iPhone.SystemButton.DISCLOSURE,
											});

											// annotationArray.push();
											mapview.addAnnotation(annotation);
											rowAll.add(nameLabel);
											rowAll.add(adress);
											tableData.push(rowAll);
										}
										table.setData([]);
										table.data = tableData;
									}
								} catch(ex) {
									var toast = Ti.UI.createNotification({
										message : 'No he podido recuperar los supermercados mas cercanos, intentalo en otro momento.',
										duration : Ti.UI.NOTIFICATION_DURATION_LONG
									});
									toast.show();
								}

							},
							onerror : function(e) {
								// alert("STATUS: " + this.status);
								// alert("TEXT:   " + this.responseText);
								// alert("ERROR:  " + e.error);
								var toast = Ti.UI.createNotification({
									message : "Ooooops, algo anda mal y no pude recuperar la info, lo intentare de nuevo.",
									duration : Ti.UI.NOTIFICATION_DURATION_LONG
								});
								toast.show();
							},
							timeout : 500
						});
					} catch(ex) {
						var toast = Ti.UI.createNotification({
							message : "Ooooops, algo anda mal y no pude recuperar la info, lo intentare de nuevo.",
							duration : Ti.UI.NOTIFICATION_DURATION_LONG
						});
						toast.show();

					}
					xhr.open("GET", url);
					xhr.send();
				}
			});

		}

	});
	win.add(mapview);
	win.add(table);
	return win;
}
function translateErrorCode(code) {
	if (code == null) {
		return null;
	}
	switch (code) {
		case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
			return "Location unknown";
		case Ti.Geolocation.ERROR_DENIED:
			return "Access denied";
		case Ti.Geolocation.ERROR_NETWORK:
			return "Network error";
		case Ti.Geolocation.ERROR_HEADING_FAILURE:
			return "Failure to detect heading";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
			return "Region monitoring access denied";
		case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
			return "Region monitoring access failure";
		case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
			return "Region monitoring setup delayed";
	}
}

