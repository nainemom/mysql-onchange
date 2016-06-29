var nmo	= require("../index.js").init({
	host: "localhost",
	user: "root",
	password: "",
	database: "vakil",
	interval: 5000
});
nmo.watch({
	table: "devices",
	uniqueField: "id"
}).onUpdate( function(row, oldRow){
	console.log( 'this row:', oldRow, 'updated to:', row );
}).onInsert( function(row){
	console.log( 'this row:', row, 'inserted.' );
}).onDelete( function(row){
	console.log( 'this row:', row, 'deleted.' );
});
