angular.module('kamusiapp.homestore', ['ngCordova'])

	.factory('HomeStore', ['$http', '$cordovaSQLite', '$ionicPlatform', '$q',  'LocalDB', function($http, $cordovaSQLite, $ionicPlatform, $q, LocalDB) {

	/*The url of the kamusi server, we get all the packages this server
	There is a documentation if you go to this address: http://lsir-kamusi.epfl.ch:3000, select the mobile tab*/
	var apiUrl = 'http://lsir-kamusi.epfl.ch:3000/mobile';

	  function Category(name, wordsList, translations, language, id) {
	    this.name = name;
	    this.wordsList = wordsList;
	    this.translations = translations;
	    this.language = language;
	    this.id = id;
	  }

	  function Category2(cawl_H_ID, has_parrent, name, wordsList, translations, language, id) {
	  	this.cawl_H_ID = cawl_H_ID;
	  	this.has_parrent = has_parrent;
	    this.name = name;
	    this.wordsList = wordsList;
	    this.translations = translations;
	    this.language = language;
	    this.id = id;
	  }

	  function Translation(termId, dstLanguage, translation) {
	  	this.termId = termId;
	  	this.dstLanguage = dstLanguage;
	  	this.translation = translation;
	  }

	  //*******************************TEST INTEGRATION LISTSTORE*************************************  


	function addToComplete(pack) {
		if(pack.wordsList.length == 0) {

			completedList.push(new Category(pack.name, [], [], pack.language, pack.id));

			var activeListTemp = [];
			for(var i = 0; i < activeList.length; i++) {
				if(activeList[i].id != pack.id) {
					activeListTemp.push(new Category(activeList[i].name, activeList[i].wordsList, activeList[i].translations, activeList[i].language, activeList[i].id));
				}
			}
			activeList = activeListTemp;
			console.log(activeList);
		}
	}

	//**********************Test SqlLite WebSql ***************************
	/*var db = null;
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

	function initializeCurrentLanguage(language, code) {
		$cordovaSQLite.execute(db, 'INSERT INTO currentLanguage (language, code) VALUES(?, ?)', 
			[language, code]).then(function(res){
				console.log('success insert into currentLanguage DB');
			}), function (err) {
	            console.error(err);
	        };
	}

	function updateCurrentLanguage(language, code) {
		$cordovaSQLite.execute(db, 'UPDATE currentLanguage set language = ?, code = ? where id = ?', 
			[language, code, 1]).then(function(res){
				console.log('success update currentLanguage DB');
			}), function (err) {
	            console.error(err);
	        };		
	}

	function getCurrentLanguage() {
		$ionicPlatform.ready(function () {
			var temp = '';
			$cordovaSQLite.execute(db, 'SELECT language FROM currentLanguage where id = ?', [1]).then(function(results) {
				if(results.rows.length > 0) {
					temp = results.rows.item(0).language;

					//newPacksList = (getElem2('newPacksList', temp) || []);
					//oldPacksList = (getElem2('oldPacksList', temp) || []);
					//newList = (getElem2('newList', temp) || []);
					//activeList = (getElem2('activeList', temp) || []);
					//untouchedList = (getElem2('untouchedList', temp) || []);
					//completedList = (getElem2('completedList', temp) || []);
					//countOfWordsTranslated = (getElem2('countOfWordsTranslated', temp) || []);
					return temp;
				}
			}, function (err) {
	            console.error(err);
	        });
	    });		
	}


	function insertLanguage(language, code) {
		var alreadyIn = false;
		for(var i = 0; i < languagesSelect.length; i++) {
			if(languagesSelect[i].language == language) {
				alreadyIn = true;
			}
		}
		if(!alreadyIn) {
			$cordovaSQLite.execute(db, 'INSERT INTO languages (language, code) VALUES(?, ?)', 
				[language, code]).then(function(res){
				console.log('success insert into languages DB');
			}), function (err) {
	            console.error(err);
	        };
		}
	}

	function addToLanguages(item) {
		var alreadyIn = false;
		for(var i = 0; i < languagesSelect.length; i++) {
			if(languagesSelect[i].name == item.name) {
				alreadyIn = true;
			}
		}
		if(!alreadyIn) {
			languagesSelect.push(item);
			initTable(item.name);
		}			
	}

	function getAllLanguage() {
		$ionicPlatform.ready(function () {
			$cordovaSQLite.execute(db, 'SELECT * FROM languages').then(function(results) {
				var data = [];
				if(results.rows.length > 0) {
					for (var i = 0; i < results.rows.length; i++) {
						data.push(results.rows.item(i));
					}
					return data;
				}
			}, function(err) {
			       console.error(err);
			    });
		});
	}	

	function insertTable(name, language) {
		$cordovaSQLite.execute(db, 'INSERT INTO ' + name + ' (language, elem) VALUES(?, ?)', 
			[language, '[]']).then(function(res){
				console.log('success insert into ' + name + ' DB');
			}), function (err) {
	            console.error(err);
	        };
	}

	function updateElemInTable(name, language, elem) {
		$cordovaSQLite.execute(db, 'UPDATE ' + name + ' set elem = ? where language = ?', 
			[angular.toJson(elem), language]).then(function(res){
				console.log('success update ' + name +' DB');
			}), function (err) {
	            console.error(err);
	        };
	}

	function getElem(name, language, elem) {
		return $ionicPlatform.ready(function () {
			return $cordovaSQLite.execute(db, 'SELECT elem FROM ' + name + ' where language = ?', [language]).then(function(results) {
				if(results.rows.length > 0) {
					//console.log(name + ': ' + angular.fromJson(results.rows.item(0).elem).length);
					elem = angular.fromJson(results.rows.item(0).elem);
					return elem;
				}
			}, function (err) {
	            console.error(err);
	        });
	    });
	}

	function getElem2(name, language) {
		$ionicPlatform.ready(function () {
			console.log('iiiiin')
			console.log(language);
			$cordovaSQLite.execute(db, 'SELECT elem FROM ' + name + ' where language = ?', [language]).then(function(results) {
				if(results.rows.length > 0) {
					return angular.fromJson(results.rows.item(0).elem);
				}
			}, function (err) {
	            console.error(err);
	        });
	    });
	}*/

		//Select the current language from the local database
		function getCurrentLanguage() {
			var parameters = [1];
			return LocalDB.query('SELECT language FROM currentLanguage where id = ?', parameters).then(function(result) {
				if(result.rows.length > 0) {
					return LocalDB.getById(result).language;
				}				
			});
		}

		//select the code of the current language from the local database
		function getCodeCurrentLanguage() {
			var parameters = [1];
			return LocalDB.query('SELECT code FROM currentLanguage where id = ?', parameters).then(function(result) {
				if(result.rows.length > 0) {
					return LocalDB.getById(result).code;
				}
			});
		}

		//get all the languages the user has added from the settings view
		function getAllLanguages() {
			return LocalDB.query('SELECT * FROM languages').then(function(result) {
				return LocalDB.getAll(result);
			});
		}

		//get all the different list needed from there corresponding tables
		function getElem(name, language) {
			var parameters = [language];
			return LocalDB.query('SELECT elem FROM ' + name + ' where language = ?', parameters).then(function(result) {
				if(result.rows.length > 0) {
					return LocalDB.getByLanguage(result);
				}
			});
		}

		//All the different function that allow to update and initialize the tables in the local database

		function updateCurrentLanguage(language, code) {
			var parameters = [language, code, 1];
			return LocalDB.query('UPDATE currentLanguage set language = ?, code = ? where id = ?', parameters);
		}

		function updateElem(name, language, elem) {
			var parameters = [angular.toJson(elem), language];
			return LocalDB.query('UPDATE ' + name + ' set elem = ? where language = ?', parameters);
		}

		function insertCurrentLanguage(language, code) {
			var parameters = [language, code];
			return LocalDB.query('INSERT INTO currentLanguage (language, code) VALUES(?, ?)', parameters);
		}

		function insertLanguages(language, code) {
			var parameters = [language, code];
			return LocalDB.query('INSERT INTO languages (language, code) VALUES(?, ?)', parameters);
		}

		function insertElem(name, language) {
			var parameters = [language, '[]'];
			return LocalDB.query('INSERT INTO ' + name + ' (language, elem) VALUES(?, ?)', parameters);
		}

		//we initialize the different tables with the added languages pass in argument

		function initTable(language) {
			insertElem('newPacksList', language);
			insertElem('oldPacksList', language);
			insertElem('newList', language);
			insertElem('activeList', language);
			insertElem('untouchedList', language);
			insertElem('completedList', language);
			insertElem('countOfWordsTranslated', language);		
		}

	/*********************** RETURN ***************************
	All the function that can return something from the factory.
	These function are called in the app.js file, in the different controllers that need these functions.
	*/

	return {

		//get the languages the user has already added to the database
		getLanguages: function() {
			return getAllLanguages();
		},

		//initialize the talbe for the current language
		initCurrentLanguages: function() {
			return insertCurrentLanguage('', '');
		},

		//add a new language in the languages table in the database
		addToLanguages: function(item) {
			insertLanguages(item.name, item.code);
			initTable(item.name);
		},

		//change the current language in the database
		changeLanguage: function(item) {
			return updateCurrentLanguage(item.language, item.code);
		},

		/*get all the packages for the english source language !
		go to: http://lsir-kamusi.epfl.ch:3000, in order to see all the different requests
		the $ttp.get function return an angular promise*/
		getNewPacksListAndWordsList: function() {
			return $http.get(apiUrl + '/packs/eng/all').then(function(response) {
				return response.data;
			});
		},

		//get the current language from the database
		getCurrentLanguage: function() {
			return getCurrentLanguage();
		},

		//get the code of the current language from the database
		getCodeCurrentLanguage: function() {
			return getCodeCurrentLanguage();
		},

		//get the +/-8000 languages that the user can add in order to translate in these languages
		getLanguagesSearch: function(callback) {
		  	$http.get('json/languages.json').success(function (data) {
				callback(data);
		    });
		},

		//*****************Get the different list for the language the user is in the middle of translate********************	

		getNewPacksList: function(language) {
			return getElem('newPacksList', language);
		},

		getUntouchedList: function(language) {
			return getElem('untouchedList', language);
		},

		getOldPacksList: function(language) {
			return getElem('oldPacksList', language);
		},

		getNewList: function(language) {
			return getElem('newList', language);
		},

		getActiveList: function(language) {
			return getElem('activeList', language);
		},

		getCompletedList: function(language) {
			return getElem('completedList', language);
		},

		/*Remove from untouched list*/
		removeUntouched: function(itemId) {
	    	for(var i = 0; i < untouchedList.length; i++) {
	    		if(untouchedList[i].id === itemId) {
	    			untouchedList.splice(i, 1);
	    		}
	    	}
	    	return;
		},

		/*Remove from active list*/
		removeActive: function(activeId) {
	    	for(var i = 0; i < activeList.length; i++) {
	    		if(activeList[i].id === activeId) {
	    			activeList.splice(i, 1);
	    		}
	    	}
	    	return;			
		},

		/*In the untouched list, when an user click on an item, we go to the list of words of the clicked item.
		Therefore we delete it from the untouched list and we add it to the active one*/
		goToWordsListFromUntouched: function(untouchedId) {
			for(var i = 0; i < untouchedList.length; i++) {
				if(untouchedList[i].id == untouchedId) {
					activeList.push(new Category(untouchedList[i].name, untouchedList[i].wordsList, untouchedList[i].translations, untouchedList[i].language, untouchedList[i].id));
					untouchedList.splice(i, 1);
				}
			}
			return;			
		},

		/*When the user click on save on the new view, it adds to activeList all the selected packs,
		and then download from the server each words of list for each selected packs.
		*/
		saveUdpate: function() {
			for(var i = 0; i < newList.length; i++) {
				if(newList[i].checked) {
					activeList.push(new Category(newList[i].name, wordsList, newList[i].translations, newList[i].language, newList[i].id));
				} else {
					untouchedList.push(new Category(newList[i].name, '[]', newList[i].translations, newList[i].language, newList[i].id));
				}
			}
			return;
		},

		saveUdpateUntouched: function() {
			var lengthTemp = untouchedList.length;
			var untouchedTemp = [];
			for(var i = 0; i < lengthTemp; i++) {
				if(untouchedList[i].checked) {
					activeList.push(new Category(newList[i].name, '[]', newList[i].translations, newList[i].language, newList[i].id));
				} else {
					untouchedTemp.push(new Category(untouchedList[i].name, '[]', untouchedList[i].translations, untouchedList[i].language, untouchedList[i].id));
				}
			}
			untouchedList = untouchedTemp;
			return;
		},

		//Update the oldPacksList table in the local database
		addToOldPacksList: function(language, oldPacksList) {
			return updateElem('oldPacksList', language, oldPacksList);	
		},

		//Update the activeList table in the local database
		addToActive: function(language, activeList) {
			return updateElem('activeList', language, activeList);
		},

		//Update the untouchedList in the local database
		addToUntouched: function(language, untouchedList) {
			return updateElem('untouchedList', language, untouchedList);
		},

		//Function called when we are in the Home view and we want to get new packages
		updateNewList: function(oldPacksListReceived, newPacksListReceived, language, code) {
			newPacksList = newPacksListReceived;
			updateElem('newPacksList', language, newPacksList);
			var tempNew = [];

				var tempOld = oldPacksListReceived;

				/*this loop compare the new packages we get from the server with the old list we have received the last time.
				If we have already received a package we are not going to show it.
				This function will be probably changed if we will have another way to know if a package is new, or if a term has been added in a package.
				*/
				for (var i = 0; i < newPacksList.length; i++) {
					var notActive = true;
					for (var j = 0; j < tempOld.length; j++) {
						if (newPacksList[i].id == tempOld[j].id) {
							notActive = (notActive && false);
						} else {
							notActive = (notActive && true);
						}
					}
					if(notActive) {			
						tempNew.push(new Category2(newPacksList[i].p.cawl_H_ID, newPacksList[i].p.has_parrent, newPacksList[i].p.name, newPacksList[i].wordlist, [], newPacksList[i].p.language, newPacksList[i].p.id));
					}
				}

				for(var i = 0; i < tempNew.length; i++) {
					var packTemp = tempNew[i];
			    	for(var j = 0; j < packTemp.wordsList.length; j++) {
			    		packTemp.translations.push(new Translation(packTemp.wordsList[j].id, code, ''));
			    	}
			    	tempNew[i] = packTemp;
			    }

			    //when we know the new list we can update it in the database.
			    updateElem('newList', language, tempNew);
			    
			    //we return this new List, in order to get the number of new packages we have got and to show it in the home view.
			    return tempNew;
		},

		//******************** TEST INTEGRATION LISTSTORE **********************************

		getCountOfWordsTranslated: function(language) {
			return getElem('countOfWordsTranslated', language);
		},

		addToCount: function(language, countOfWordsTranslated) {
			return updateElem('countOfWordsTranslated', language, countOfWordsTranslated)
		},

		//when the user decide to send to the server his/her translation we call this function.
		postTranslation2: function(translationsToSend) {
			$http.defaults.headers.post["Content-Type"] = "application/json";

		    $http.post(apiUrl + "/translate/json", {translations: translationsToSend}).then(function(response) {
		      console.log(response);
		    }).catch(function(err) {
		      console.error(err.data);
		    });
		},

	    getPack: function(packId) {
	      for (var i = 0; i < activeList.length; i++) {
	        if(activeList[i].id == packId) {
	          return activeList[i];
	        }
	      }
	      return undefined;
	    },

	    //with a package and the id of a word, we return the word to translate
	    getWordToTrans: function(pack, wordId) {
	      for (var i = 0; i < pack.wordsList.length; i++) {
	        if(pack.wordsList[i].id == wordId) {
	          return pack.wordsList[i];
	        }
	      }
	      return undefined;      
	    },

	    //with a package and the id of a word, we return the index of this word
	    getCurrentWordIndex: function(pack, wordId) {
		  for (var i = 0; i < pack.wordsList.length; i++) {
	        if(pack.wordsList[i].id == wordId) {
	          return i;
	        }
	      }
	      return undefined;      
	    },

	    nextWordId: function(pack, nextWordIndex) {
	    	return pack.wordsList[nextWordIndex].id;
	    },

	    skipWordsList: function(pack, index) {
	    	addToComplete(pack);
	    },

	    alreadyTranslate: function(pack, index) {
	    	if(pack.translations[index].translation != '') {
	    		return true;
	    	}
	    },

	};

}]);

