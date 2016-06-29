var _		= require('underscore');
var mysql	= require('mysql');
var self = this;

self._connection = new Object();
self._initConfig = new Object();
self.init = function( initConfig, callback ){
	self._initConfig = initConfig;
	callback = typeof callback == 'function'? callback: new Function();
	if( typeof initConfig.connection == 'undefined' ){
		self._connection = mysql.createConnection({
			host: self._initConfig.host || "localhost",
			user: self._initConfig.user || "root",
			password: self._initConfig.password || "",
			database: self._initConfig.database || ""
		});
		self._connection.connect(function(err) {
			if( err ){
				callback(true, err);
			}
			else{
				callback(false, true);
			}
		});
	}
	else{
		self._connection = self._initConfig.connection;
		callback(false, true);
	}
	return self;
}

self.watch = function(watchConfig){
	var _watch = this;
	_watch._interval = watchConfig.interval || ( self._initConfig.interval || 5000 ); 
	_watch._uniqueField = watchConfig.uniqueField || ( self._initConfig.uniqueField || 'id' ); 
	_watch._onInserts = new Array();
	_watch.onInsert = function(){
		if( typeof arguments[0] == 'function' ){
			_watch._onInserts.push( arguments[0] );
		}
		else{
			for( var i = 0; i < _watch._onInserts.length; i++ ){
				_watch._onInserts[i](arguments[0]);
			}
		}
		return _watch;
	}
	_watch._onDeletes = new Array();
	_watch.onDelete = function(){
		if( typeof arguments[0] == 'function' ){
			_watch._onDeletes.push( arguments[0] );
		}
		else{
			for( var i = 0; i < _watch._onDeletes.length; i++ ){
				_watch._onDeletes[i](arguments[0]);
			}
		}
		return _watch;
	}
	_watch._onUpdates = new Array();
	_watch.onUpdate = function(arg){
		if( typeof arguments[0] == 'function' ){
			_watch._onUpdates.push( arguments[0] );
		}
		else{
			for( var i = 0; i < _watch._onUpdates.length; i++ ){
				_watch._onUpdates[i](arguments[0], arguments[1]);
			}
		}
		return _watch;
	}

	var firstRun = true;
	var lastData = new Array();
	function query(){
		self._connection.query("SELECT * FROM `" + watchConfig.table + "`;", function(err, result) {
			if( err ){
				throw err;
			}
			else{
				if( !firstRun ){
					var i, diff, opts;
					// for inserts, updates
					for( i = 0; i < result.length; i++ ){
						opts = new Object();
						opts[ _watch._uniqueField ] = result[i][ _watch._uniqueField ];
						diff = _.where(lastData, opts);
						if( diff.length == 0 ){
							_watch.onInsert( result[i] );
						}
						else if ( diff.length == 1 ) {
							if( _.isEqual(result[i], diff[0]) == false ){
								_watch.onUpdate( result[i], diff[0] );
							}
						}
					}
					// for deletes
					for( i = 0; i < lastData.length; i++ ){
						opts = new Object();
						opts[ _watch._uniqueField ] = lastData[i][ _watch._uniqueField ];
						diff = _.where(result, opts);
						if( diff.length == 0 ){
							_watch.onDelete( lastData[i] );
						}
					}
				}
				lastData = result;
				firstRun = false;
				setTimeout( function(){
					query();
				}, _watch._interval);
			}
		});
	}		
	query();
	return _watch;
}
