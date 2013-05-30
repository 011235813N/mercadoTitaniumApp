//validar si quiere recibir notificaciones
/*
 var notGrales = Titanium.App.Properties.getString('notGral');
 if (notGrales == 'true') {
 var CloudPush = require('ti.cloudpush');
 var flagOpenTabs = true;
 CloudPush.debug = true;
 CloudPush.enabled = true;
 CloudPush.showTrayNotificationsWhenFocused = true;
 CloudPush.focusAppOnPush = false;

 var deviceToken;

 var Cloud = require('ti.cloud');
 Cloud.debug = true;

 CloudPush.retrieveDeviceToken({
 success : function deviceTokenSuccess(e) {
 //alert('Device Token: ' + e.deviceToken);
 deviceToken = e.deviceToken
 loginDefault();
 },
 error : function deviceTokenError(e) {
 //alert('Failed to register for push! ' + e.error);
 }
 });

 function loginDefault(e) {
 //Create a Default User in Cloud Console, and login
 Cloud.Users.login({
 login : 'ascjms',
 password : 'Zxcasdqwe123'
 }, function(e) {
 if (e.success) {
 //alert("login success");
 defaultSubscribe();
 } else {
 // alert('Error: ' + ((e.error && e.message) || JSON.stringify(e)));
 }

 });
 }

 function defaultSubscribe() {
 Cloud.PushNotifications.subscribe({
 channel : 'alert',
 device_token : deviceToken,
 type : 'android'
 }, function(e) {
 if (e.success) {
 //alert('Subscribed for Push Notification!');
 Titanium.App.Properties.setString('suscribed', '1');
 } else {
 //alert('Error:' + ((e.error && e.message) || JSON.stringify(e)));
 }
 });
 }

 CloudPush.addEventListener('callback', function(evt) {
 // alert(evt);
 // alert(evt.payload);
 });

 CloudPush.addEventListener('trayClickLaunchedApp', function(evt) {
 //Ti.API.info('Tray Click Launched App (app was not running)');

 // flagOpenTabs = false;
 //
 // var win = Ti.UI.createWindow({
 // backgroundColor : '#ddd'
 // });
 //
 // var wrapper = Ti.UI.createView({
 // width : '95%',
 // top : -2,
 // height : 250,
 // borderColor : '#aaa',
 // borderWidth : 2,
 // backgroundColor : '#fff'
 // });
 //
 // win.add(wrapper);
 // var wrapperShadow = Ti.UI.createView({
 // width : '95%',
 // height : 2,
 // backgroundColor : '#bbb',
 // top : 247
 // });
 // win.add(wrapperShadow);
 //
 // var closeBut = Ti.UI.createButton({
 // title : 'cerrar'
 // });
 // win.add(closeBut);
 // closeBut.addEventListener('click', function(e) {
 //
 // });
 //
 // win.open();

 });

 CloudPush.addEventListener('trayClickFocusedApp', function(evt) {
 //Ti.API.info('Tray Click Focused App (app was already running)');

 });
 } else {
 var CloudPush = require('ti.cloudpush');
 var flagOpenTabs = true;
 CloudPush.debug = true;
 CloudPush.enabled = true;
 CloudPush.showTrayNotificationsWhenFocused = true;
 CloudPush.focusAppOnPush = false;

 var deviceToken;

 var Cloud = require('ti.cloud');
 Cloud.debug = true;
 var suscribed = Titanium.App.Properties.getString('suscribed');

 if (suscribed == "1") {

 CloudPush.retrieveDeviceToken({
 success : function deviceTokenSuccess(e) {
 //alert('Device Token: ' + e.deviceToken);
 deviceToken = e.deviceToken
 loginDefault();
 },
 error : function deviceTokenError(e) {
 //alert('Failed to register for push! ' + e.error);
 }
 });

 function loginDefault(e) {
 //Create a Default User in Cloud Console, and login
 Cloud.Users.login({
 login : 'ascjms',
 password : 'Zxcasdqwe123'
 }, function(e) {
 if (e.success) {
 //alert("login success");
 defaultUnsubscribe();
 } else {
 // alert('Error: ' + ((e.error && e.message) || JSON.stringify(e)));
 }

 });
 }

 function defaultUnsubscribe() {
 Cloud.PushNotifications.unsubscribe({
 channel : 'alert',
 device_token : deviceToken,
 type : 'android'
 }, function(e) {
 if (e.success) {
 //alert('Subscribed for Push Notification!');
 Titanium.App.Properties.setString('suscribed', '0');
 } else {
 alert('Error:' + ((e.error && e.message) || JSON.stringify(e)));
 }
 });
 }

 }

 }*/

if (Ti.version < 1.8) {
	//alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else {
	//add a single variable to the global scope to which we may choose to
	//intentionally add items to
	var globals = {};

	//create a private scope to prevent further polluting the global object
	(function() {
		var AppTabGroup = require('ui/appTabGroup').AppTabGroup, ListWindow = require('ui/listWindow').ListWindow, AddWindow = require('ui/addWindow').AddWindow, preloadItems = require('ui/preloadItems').preloadItems;

		// Initialize local storage
		require('db').createDb();

		//create our global tab group
		globals.tabs = new AppTabGroup({
			title : 'Compras',
			icon : 'images/KS_nav_ui.png',
			top : 50,
			window : new ListWindow({
				title : 'Compras',
				backgroundColor : '#fff',
				navBarHidden : false,
				isDone : 0,
				activity : {
					onCreateOptionsMenu : function(e) {
						var menu = e.menu;
						var menuItem = menu.add({
							title : "Agregar"
						});
						//if (osname === 'android') {
						var menuShare = menu.add({
							title : "Compartir"
						});
						var menuCaja = menu.add({
							title : "Hacer Caja"
						});
						var menuPref = menu.add({
							title : "Preferencias"
						});
						menuPref.addEventListener("click", function(e) {
							Ti.UI.Android.openPreferences();
						});
						menuShare.addEventListener("click", function(e) {
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_SEND,
								type : "text/plain"
							});
							intent.putExtra(Ti.Android.EXTRA_SUBJECT, 'Lista de Compras - Mercado:');
							intent.putExtra(Ti.Android.EXTRA_TEXT, getTableData(0) + '\n \n' + 'Total a comprar: $' + getCaja());
							intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
							try {
								Ti.Android.currentActivity.startActivity(intent);
							} catch (ex) {
								Ti.UI.createNotification({
									message : 'No es posible compartir, no hay ninguna app instalada.'
								}).show();
							}
						});
						//}
						menuPref.setIcon("images/ic_menu_cog.png");
						menuItem.setIcon("images/ic_menu_add.png");
						menuShare.setIcon("images/ic_menu_comment.png");
						menuCaja.setIcon("images/ic_menu_credit.png");
						menuItem.addEventListener("click", function(e) {
							new AddWindow().open();
						});
						menuCaja.addEventListener("click", function(e) {

							var toast = Ti.UI.createNotification({
								message : "Monto $" + getCaja(),
								duration : Ti.UI.NOTIFICATION_DURATION_SHORT
							});
							toast.show();

						});

					}
				}
			})
		}, {
			title : 'Comprados',
			icon : 'images/KS_nav_views.png',
			window : new ListWindow({
				title : 'Comprados',
				backgroundColor : '#fff',
				navBarHidden : false,
				isDone : 1,
				isComprados : 1
			})
		}, {
			title : 'Alacena',
			icon : 'images/KS_nav_geo.png',
			window : new preloadItems({
				title : 'Alacena',
				backgroundColor : '#fff',
				navBarHidden : false
			})
		});

		Ti.App.appTabs = globals.tabs;

		globals.tabs.addEventListener('open', checkReminderToRate);
		globals.tabs.open();
	}
	)();
}
var getTableData = function(done) {
	var db = require('db');
	//var data = [];
	var row = '';
	var todoItems = db.selectItems(done);

	for (var i = 0; i < todoItems.length; i++) {
		row = createRow(row, todoItems[i]);
		//data.push(row);
	}
	return row;
};

function createRow(str, item) {
	var info = '';

	info = str + ' ' + item.item + '\t Cantidad:' + item.qty + ' ' + item.units + '\t $' + item.price + '\n';

	return info;

}

function getCaja() {
	var db = require('db');
	var todoItems = db.calcularCaja(0);
	item = todoItems[0];
	if (item.caja === null) {
		return 0.00;
	} else {
		return item.caja;
	}

}

function checkReminderToRate() {
	var now = new Date().getTime();
	var remindToRate = Ti.App.Properties.getString('RemindToRate');
	if (!remindToRate) {
		Ti.App.Properties.setString('RemindToRate', now);
	} else if (remindToRate < now) {
		var alertDialog = Titanium.UI.createAlertDialog({
			title : 'Por favor danos tu aprobación!',
			message : 'Tienes unos minutos para calificarnos?',
			buttonNames : ['¡Si!', 'Quizá después', 'No, Gracias'],
			cancel : 2
		});
		alertDialog.addEventListener('click', function(evt) {
			switch (evt.index) {
				case 0:
					Ti.App.Properties.setString('RemindToRate', Number.MAX_VALUE);
					// NOTE: replace this with your own iTunes link; also, this won't WON'T WORK IN THE SIMULATOR!
					if (Ti.Android) {
						Ti.Platform.openURL('https://play.google.com/store/apps/details?id=com.ernestoascencio.mercado');
					} else {
						Ti.Platform.openURL('https://itunes.apple.com/us/app/mercado/id577564660?l=es&mt=8');
					}
					break;
				case 1:
					// "Remind Me Later"? Ok, we'll remind them tomorrow when they launch the app.
					Ti.App.Properties.setString('RemindToRate', now + (1000 * 60 * 60 * 24));
					break;
				case 2:
					Ti.App.Properties.setString('RemindToRate', Number.MAX_VALUE);
					break;
			}
		});
		alertDialog.show();
	}
	//return 0;

}