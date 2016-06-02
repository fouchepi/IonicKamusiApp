angular.module('kamusiapp.localdb', ['ngCordova'])

.factory('LocalDB', ['$http', '$cordovaSQLite', '$ionicPlatform', '$q', function($http, $cordovaSQLite, $ionicPlatform, $q) {

	var db = null;
	var dbName = "kamusiLocal.db";

	function useWebSql() {
		db = window.openDatabase(dbName, "1.0", "Kamusi database", 200000);
		console.info('Using webSql');		
	}

	function useSqLite() {
		db = $cordovaSQLite.openDB({name: dbName, iosDatabaseLocation: 'default'});
		console.info('Using SQLITE');
	}

	var queryCreate = 'CREATE TABLE IF NOT EXISTS ';

	function initDatabase() {
		$cordovaSQLite.execute(db, queryCreate + 'languages (id integer primary key, language text, code text)')
		.then(function(res) {
		}, onErrorQuery);
	}

	function initElemForLanguage(name) {
		$cordovaSQLite.execute(db,  queryCreate + name + ' (id integer primary key, language text, elem text)')
		.then(function(res) {
		}, onErrorQuery);
	}

	function initCurrentLanguage() {
		$cordovaSQLite.execute(db, queryCreate + 'currentLanguage (id integer primary key, language text, code text)')
		.then(function(res) {
		}, onErrorQuery);
	}	

    function onErrorQuery(err){
      console.error(err);
    }

	$ionicPlatform.ready(function() {
		if(window.cordova){
			useSqLite();
		 } else {
			useWebSql();
		}
		initDatabase();
		initElemForLanguage('newPacksList');
		initElemForLanguage('oldPacksList');
		initElemForLanguage('activeList');
		initElemForLanguage('newList');
		initElemForLanguage('untouchedList');
		initElemForLanguage('completedList');
		initElemForLanguage('countOfWordsTranslated');
		initCurrentLanguage();
	})


	return {

		query: function(query, parameters) {
			parameters = parameters || [];
			var q = $q.defer();

			$ionicPlatform.ready(function() {
				$cordovaSQLite.execute(db, query, parameters).then(function(result) {
					q.resolve(result);
				}, function(error) {
					console.warn(error);
					q.reject(error);
				});
			});
			return q.promise;
		},

		getAll: function(result) {
			var output = [];

			for(var i = 0; i <result.rows.length; i++) {
				output.push(result.rows.item(i));
			}

			return output;
		},

		getById: function(result) {
			var output = null;
			output = angular.copy(result.rows.item(0).language);
			return output;
		},

		getByLanguage: function(result) {
			var output = null;
			output = angular.fromJson(result.rows.item(0).elem);
			return output;
		},

		initializeCurrentLanguage: function(language, code) {
			return $cordovaSQLite.execute(db, 'INSERT INTO currentLanguage (language, code) VALUES(?, ?)', 
				[language, code]);
		},

		updateCurrentLanguage: function(language, code) {
			return $cordovaSQLite.execute(db, 'UPDATE currentLanguage set language = ?, code = ? where id = ?', 
				[language, code, 1]);	
		},

		getCurrentLanguage: function(callback) {
			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, 'SELECT language FROM currentLanguage where id = ?', [1]).then(function(results) {
					var temp = '';
					if(results.rows.length > 0) {
						temp = results.rows.item(0).language;
					}
					callback(temp);
				}, function (err) {
		            console.error(err);
		        });
		    });		
		},

		insertLanguage: function(language, code) {
			return $cordovaSQLite.execute(db, 'INSERT INTO languages (language, code) VALUES(?, ?)', 
				[language, code]);
		},

		getAllLanguage: function(callback) {
			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, 'SELECT * FROM languages').then(function(results) {
					var data = [];
					if(results.rows.length > 0) {
						for (var i = 0; i < results.rows.length; i++) {
							data.push(results.rows.item(i));
						}
					}
					callback(data);
				}, function(err) {
				       console.error(err);
				    });
			});
		},

		insertTable: function(name, language) {
			return $cordovaSQLite.execute(db, 'INSERT INTO ' + name + ' (language, elem) VALUES(?, ?)', 
				[language, '[]']);
		},

		updateElemInTable: function(name, language, elem) {
			return $cordovaSQLite.execute(db, 'UPDATE ' + name + ' set elem = ? where language = ?', 
				[angular.toJson(elem), language]);
		},

		getElem: function(name, language, elem, callback) {
			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, 'SELECT elem FROM ' + name + ' where language = ?', [language]).then(function(results) {
					var elem = [];
					if(results.rows.length > 0) {
						elem = angular.fromJson(results.rows.item(0).elem);
					}
					callback(elem);
				}, function (err) {
		            console.error(err);
		        });
		    });
		}	

	};

}]);