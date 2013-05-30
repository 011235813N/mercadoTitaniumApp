var DATABASE_NAME = 'imercado';

exports.createDb = function() {
	//version 1
	var version = Titanium.App.Properties.getString('version');

	if (version != '1') {
		Titanium.App.Properties.setString('version', '1');
		var dbOLD = Ti.Database.install('mercado.sqlite', DATABASE_NAME);
		dbOLD.remove();
		Ti.Database.install('mercado.sqlite', DATABASE_NAME);

		//exports.addItem('Agrega un item desde el menu', 1, 1, 0);

	} else {

	}
};

exports.selectItems = function(_done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select ROWID, * from mercado where done = ?', _done);
	while (rows.isValidRow()) {
		retData.push({
			item : rows.fieldByName('item'),
			qty : rows.fieldByName('qty'),
			units : rows.fieldByName('units'),
			price : rows.fieldByName('price'),
			id : rows.fieldByName('ROWID')
		});
		rows.next();
	}
	db.close();
	return retData;
};

exports.selectItemsById = function(_id) {
	var retDataById = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select ROWID, * from mercado where ROWID = ?', _id);
	while (rows.isValidRow()) {
		retDataById.push({
			item : rows.fieldByName('item'),
			qty : rows.fieldByName('qty'),
			units : rows.fieldByName('units'),
			price : rows.fieldByName('price'),
			id : rows.fieldByName('ROWID')
		});
		rows.next();
	}
	db.close();
	return retDataById;
};

exports.calcularCaja = function(_done) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('select sum(price) caja from mercado where done = ?', _done);
	while (rows.isValidRow()) {
		retData.push({
			caja : rows.fieldByName('caja')
		});
		rows.next();
	}
	db.close();
	return retData;
};

exports.updateItem = function(_id, _done) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update mercado set done = ? where ROWID = ?', _done, _id);
	var rows = mydb.execute('select * from mercado where done = ?', _done);
	mydb.close();
	return rows;
};

exports.updateItemById = function(_id, _item, _qty, _units, _price) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('update mercado set item = ?, qty = ?, units = ?, price = ?  where ROWID = ?', _item, _qty, _units, _price, _id);
	//var rows = mydb.execute('select * from mercado where done = ?', _done);
	mydb.close();
	return 0;
};
exports.addItem = function(_item, _qty, _units, _price) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('insert into mercado (item, qty,done, units, price) values (?,?,?,?,?)', _item, _qty, 0, _units, _price);
	mydb.close();
};

exports.deleteItem = function(_id) {
	var mydb = Ti.Database.open(DATABASE_NAME);
	mydb.execute('delete from mercado where ROWID = ?', _id);
	mydb.close();
};
