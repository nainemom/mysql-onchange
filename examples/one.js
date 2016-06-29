var mysql	= require('mysql');
var db		= mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "vakil"
});
db.connect( function(){
	var nmo	= require("../index.js").init({
		connection: db
	});
	nmo.watch({
		table: "devices",
		uniqueField: "id",
		interval: 5000
	}).onUpdate( function(row, oldRow){
		console.log( 'this row:', oldRow, 'updated to:', row );
	}).onInsert( function(row){
		console.log( 'this row:', row, 'inserted.' );
	}).onDelete( function(row){
		console.log( 'this row:', row, 'deleted.' );
	});
});