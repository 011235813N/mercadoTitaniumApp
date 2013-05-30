exports.menuListWindow = function(args) {

	var self = Ti.UI.createWindow({
		//modal : true,
		title : 'Opciones lista',
		backgroundColor : '#F8F1E9',
		height : 200,
		width : 200,
		//borderRadius : 10,
		borderColor : '#9C672A',
		borderWidth : 2
	});
	
	var AddWindow = require('ui/addWindow').AddWindow;
	var db = require('db');

	var data = [{
		title : "Editar"
	}, {
		title : "Eliminar"
	}, {
		title : "Comprado"
	}, {
		title : "Cancelar"
	}];

	var tableview = Ti.UI.createTableView({
		data : data,
		height : 200
	});

	tableview.addEventListener('click', function(e) {
		if (e.index === 0) {
			new AddWindow({
				fila : args.fila
			}).open();
			self.close();

		}
		if (e.index === 1) {
			db.deleteItem(args.fila);
			Ti.App.fireEvent('app:updateTables');

			self.close();
		}
		if (e.index === 2) {
			// db.updateItem(args.fila, 1);
			// Ti.App.fireEvent('app:updateTables');
			// self.close();

			db.deleteItem(args.fila);
			Ti.App.fireEvent('app:updateTables');

			self.close();
		}
		if (e.index === 3) {//close
			self.close();
		}
	});

	self.add(tableview);

	return self;

}