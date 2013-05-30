exports.AddWindow = function(args) {
	var db = require('db');
	var osname = Ti.Platform.osname;
	var self = Ti.UI.createWindow({
		modal : true,
		title : 'Lista del Mercado',
		backgroundColor : '#F8F1E9',
		//layout:'vertical'
	});

	var scrollView = Titanium.UI.createScrollView({
		contentHeight : 'auto',
	});
	self.add(scrollView);

	var itemField = Ti.UI.createTextField({
		width : 300,
		height : 45,
		top : 20,
		hintText : 'Comprar',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_WORDS,
		//returnKeyType : Ti.UI.RETURNKEY_DONE
	});

	scrollView.add(itemField);

	var quantityField = Ti.UI.createTextField({
		width : 300,
		height : 45,
		top : 70,
		hintText : 'Cantidad',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD
	});

	var priceField = Ti.UI.createTextField({
		width : '300',
		height : '45',
		top : '165',
		hintText : 'Precio sin decimales',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		returnKeyType : Ti.UI.RETURNKEY_DONE,
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD
	});

	/*picker*/
	var picker = Titanium.UI.createPicker({
		height : 45,
		width : 300,
		top : 115,
		backgroundColor : '#DEC09E',
		color : 'black',
		borderColor : '#DAB58B',
		borderWidth : 2
	});
	var data = [];
	data[0] = Titanium.UI.createPickerRow({
		title : 'Unidades'
	});
	data[1] = Titanium.UI.createPickerRow({
		title : 'Lbs.'
	});
	data[2] = Titanium.UI.createPickerRow({
		title : 'Lts.'
	});
	data[3] = Titanium.UI.createPickerRow({
		title : 'Cajas'
	});
	data[4] = Titanium.UI.createPickerRow({
		title : 'Bolsas'
	});
	data[5] = Titanium.UI.createPickerRow({
		title : 'Pqt.'
	});
	data[6] = Titanium.UI.createPickerRow({
		title : 'Botellas'
	});
	picker.add(data);
	/*picker*/

	var addButton = Ti.UI.createButton({
		title : 'Agregar',
		width : '300',
		height : '40',
		top : '210',
		backgroundColor : '#DEC09E',
		color : 'black',
		borderColor : '#DAB58B',
		borderWidth : 2
	});

	if (args != null) {
		var todoItems = [];
		var oItem;
		var data = [];
		data[0] = 'Unidades';
		data[1] = 'Lbs.';
		data[2] = 'Lts.';
		data[3] = 'Cajas';
		data[4] = 'Bolsas';
		data[5] = 'Pqt.';
		data[6] = 'Botellas';

		todoItems = db.selectItemsById(args.fila);
		for (var i = 0; i < todoItems.length; ++i) {

			oItem = todoItems[i];

			itemField.setValue(oItem.item);
			quantityField.setValue(oItem.qty);
			for (var i = 0; i < data.length; ++i) {
				if (data[i] === oItem.units) {
					picker.setSelectedRow(0, i);
					break;
				}
			}
			priceField.setValue((oItem.price / oItem.qty)*100);

		}
		addButton.title = 'Modificame';
	}

	addButton.addEventListener('click', function() {

		if (args != null) {//update
			addTask(args.fila, itemField.value, quantityField.value, picker.getSelectedRow(0).title, priceField.value/100, self, 0);
		} else {//insert
			addTask(0, itemField.value, quantityField.value, picker.getSelectedRow(0).title, priceField.value/100, self, 1);
		}

	});

	var cancelButton = Ti.UI.createButton({
		title : 'Cancelar',
		width : 300,
		height : 40,
		top : 255,
		backgroundColor : '#DEC09E',
		color : 'black',
		borderColor : '#DAB58B',
		borderWidth : 2
	});
	cancelButton.addEventListener('click', function(e) {
		self.close();
	});

	//self.add(itemField);
	scrollView.add(quantityField);
	scrollView.add(priceField);

	scrollView.add(addButton);
	scrollView.add(cancelButton);
	if (osname === 'iphone' || osname === 'ipad') {
		self.add(my_combo);
		self.add(picker_view);
	} else {
		scrollView.add(picker);
	}

	return self;
};

var addTask = function(id, value, qty, unit, price, win, action) {
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
	if (action === 1) {
		require('db').addItem(value, qty, unit, price.toFixed(2));
	} else {
		require('db').updateItemById(id, value, qty, unit, price.toFixed(2));

	}
	Ti.App.fireEvent('app:updateTables');
	win.close();
};
