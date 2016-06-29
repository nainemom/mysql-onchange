# nai-mysql-onchange
_A nodejs module that check mysql table for changes by checking rows_

# Install
```bash
npm install https://github.com/nainemom/nai-mysql-onchange.git
```
```js
// existing connection
var nmo	= require("nai-mysql-onchange").init({
	connection: db
});
// or new one
var nmo	= require("nai-mysql-onchange").init({
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb"
});
```
# Watching table
```js
nmo.watch({
	table: "devices",
	uniqueField: "id",
	interval: 5000
}).onUpdate( function(row, oldRow){
	// hooray! oldRow was changed to row!
}).onInsert( function(row){
	// yeahh! the row was inserted!
}).onDelete( function(row){
	// nooo! row was deleted. :(
});
```
