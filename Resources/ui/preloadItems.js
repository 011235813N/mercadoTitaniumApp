exports.preloadItems = function(args) {

	var win = Titanium.UI.createWindow(args);
	// create table view data object
	var data = [];

	data[0] = Ti.UI.createTableViewRow({
		title : 'Pollo',
		id : '100'
	});
	data[1] = Ti.UI.createTableViewRow({
		title : 'Carne',
		id : '101'
	});
	data[2] = Ti.UI.createTableViewRow({
		title : 'Cerveza',
		id : '102'
	});
	data[3] = Ti.UI.createTableViewRow({
		title : 'Café',
		id : '103'
	});
	data[4] = Ti.UI.createTableViewRow({
		title : 'Pasta',
		id : '103'
	});
	data[5] = Ti.UI.createTableViewRow({
		title : 'Leche',
		id : '103'
	});
	data[6] = Ti.UI.createTableViewRow({
		title : 'Verduras',
		id : '103'
	});

	var search = Titanium.UI.createSearchBar({
		showCancel : false,
		hintText : 'Busca un producto',
		height:50
	});
	search.addEventListener('change', function(e) {
		e.value // search string as user types
	});
	search.addEventListener('return', function(e) {
		search.blur();
	});
	search.addEventListener('cancel', function(e) {
		search.blur();
	});

	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data,
		search : search

	});

	//Titanium.App.Properties.setInt('row','');

	// create table view event listener
	tableview.addEventListener('click', function(e) {
		// event data
		var index = e.index;
		var section = e.section;
		var row = e.row;
		var rowdata = e.rowData;

		var prop = rowdata.id;

		win.close();
	});

	// add table view to the window
	win.add(tableview);
	return win;
}