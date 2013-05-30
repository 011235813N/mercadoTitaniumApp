exports.ListWindow = function(args) {

	var isDone = args.isDone;
	var isComprados = args.isComprados;

	var AddWindow = require('ui/addWindow').AddWindow;
	var AddWindow = require('ui/addWindow').AddWindow;
	var self = Ti.UI.createWindow(args);
	var fastAdd = Ti.UI.createView({
		top : 0,
		layout : 'horizontal',
		height : 60,
		backgroundImage : '../images/backrow.png',
		backgroundRepeat : true
	});
	var itemField = Ti.UI.createTextField({
		width : 200,
		height : 45,
		top : 3,
		left : 3,
		hintText : 'Comprar',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_WORDS
	});
	var addButton = Ti.UI.createButton({
		title : 'Agregar',
		width : '100',
		height : '40',
		top : '3',
		left : 10,
		backgroundColor : '#DEC09E',
		color : 'black',
		borderColor : '#DAB58B',
		borderWidth : 2
	});
	addButton.addEventListener('click', function(e) {
		addTask(itemField.value, 1, 'Unidades', 0.0, self);

		itemField.setValue('');
	});
	fastAdd.add(itemField);
	fastAdd.add(addButton);
	if (isComprados !== 1) {
		self.add(fastAdd);
		var tableview = Ti.UI.createTableView({
			top : 60
		});
	} else {
		self.remove(fastAdd);
		var tableview = Ti.UI.createTableView({
			top : 0
		});

	}

	tableview.backgroundColor = '#F8F1E9';
	tableview.setData(getTableData(isDone));
	self.add(tableview);

	tableview.addEventListener('click', function(e) {

		var idR = e.rowData;
		var db = require('db');
		if (isComprados !== 1) {
			var optionsDialogOpts = {
				options : ['Editar', 'Comprar', 'Eliminar', 'Cancelar'],
				title : idR.title
			};
		} else {
			var optionsDialogOpts = {
				options : ['Volver a comprar', 'Eliminar', 'Cancelar'],
				title : idR.title
			};
		}

		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		dialog.show();

		dialog.addEventListener('click', function(e) {
			if (isComprados !== 1) {
				if (e.index == '0') {
					new AddWindow({
						fila : idR.id
					}).open();
				} else if (e.index == '1') {
					db.updateItem(idR.id, 1);
					Ti.App.fireEvent('app:updateTables');
				} else if (e.index == '2') {
					db.deleteItem(idR.id);
					Ti.App.fireEvent('app:updateTables');
				} else if (e.index == '3') {
					//not implemented
				}
			} else {
				if (e.index == '0') {
					db.updateItem(idR.id, 0);
					Ti.App.fireEvent('app:updateTables');
				} else if (e.index == '1') {
					db.deleteItem(idR.id);
					Ti.App.fireEvent('app:updateTables');
				} else if (e.index == '2') {
					//not implemented
				}
			}

		});

	});

	Ti.App.addEventListener('app:updateTables', function() {
		tableview.setData(getTableData(isDone));
	});

	return self;
};

var getTableData = function(done) {
	var db = require('db');
	var data = [];
	var row = null;
	var todoItems = db.selectItems(done);

	//	if (todoItems.length < 1) {
	//alert('Parece que aun no has agregado nada a la lista');
	//}

	for (var i = 0; i < todoItems.length; i++) {

		//createRow(todoItems[i]);

		row = createRow(todoItems[i]);
		data.push(row);
	}
	return data;
};
function createRow(item) {
	var tablerow = Ti.UI.createTableViewRow({
		id : item.id,
		title : item.item,
		height : 70,
	});

	var titleview = Ti.UI.createLabel({
		text : item.item,
		color : '#000',
		height : 70,
		font : {
			fontSize : 16,
			fontWeight : 'bold'
		},
		left : 5,
		right : 5
	});

	var qtyview = Ti.UI.createLabel({
		text : 'Cantidad: ' + item.qty + ' ' + item.units,
		textAlign : 'left',
		color : '#444',
		font : {
			fontSize : 12
		},
		height : 'auto',
		width : 150,
		left : 5,
		bottom : 3
	});

	var priceView = Ti.UI.createLabel({
		text : 'Costo ($): ' + item.price.toFixed(2),
		textAlign : 'left',
		color : '#444',
		font : {
			fontSize : 12
		},
		height : 'auto',
		width : 150,
		left : 170,
		bottom : 3
	});

	tablerow.add(qtyview);
	tablerow.add(priceView);
	tablerow.add(titleview);

	return tablerow;
};
var addTask = function(value, qty, unit, price, win) {
	if (price === '') {
		price = 0.00;
	}
	if (qty === '') {
		qty = 1;
	}
	if (value === '') {
		var toast = Ti.UI.createNotification({
			message : "Debes de agregar algo a la lista",
			duration : Ti.UI.NOTIFICATION_DURATION_SHORT
		});
		toast.show();
		return;
	}

	price = qty * price;

	require('db').addItem(value, qty, unit, price.toFixed(2));
	Ti.App.fireEvent('app:updateTables');
};
