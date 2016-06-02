angular.module('kamusiapp.homestore', ['ngCordova'])

	.factory('HomeStore', ['$http', '$cordovaSQLite', '$ionicPlatform', '$q',  'LocalDB', function($http, $cordovaSQLite, $ionicPlatform, $q, LocalDB) {

	//window.localStorage.clear();

	/*var newPacksList = angular.fromJson(window.localStorage['newPacksList'] || '[]');
	var oldPacksList = angular.fromJson(window.localStorage['oldPacksList'] || '[]'); 
	var newList = angular.fromJson(window.localStorage['newList'] || '[]');
	var activeList = angular.fromJson(window.localStorage['activeList'] || '[]');	
	var untouchedList = angular.fromJson(window.localStorage['untouchedList'] || '[]');
	var completedList = angular.fromJson(window.localStorage['completedList'] || '[]');

	function saveNewPacksList() {
		window.localStorage['newPacksList'] = angular.toJson(newPacksList);
	}

	function saveOldPacksList() {
		window.localStorage['oldPacksList'] = angular.toJson(newPacksList);
	}

	function saveNewList() {
		window.localStorage['newList'] = angular.toJson(newList);
	}

	function saveActiveList() {
		window.localStorage['activeList'] = angular.toJson(activeList);
	}

	function saveUntouchedList() {
		window.localStorage['untouchedList'] = angular.toJson(untouchedList);
	}

	function saveCompletedList() {
		window.localStorage['completedList'] = angular.toJson(completedList);
	}*/

	var apiUrl = 'http://lsir-kamusi.epfl.ch:3000/mobile';

	  function Category(name, wordsList, translations, language, id) {
	    this.name = name;
	    this.wordsList = wordsList;
	    this.translations = translations;
	    this.language = language;
	    this.id = id;
	  }

	  function Category2(cawl_H_ID, has_parent, name, wordsList, translations, language, id) {
	  	this.cawl_H_ID = cawl_H_ID;
	  	this.has_parent = has_parent;
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

	  function WordsList(language, term, id) {
	    this.language = language;
	    this.term = term;
	    this.id = id;
	  }

	  function Translation(termId, dstLanguage, translation) {
	  	this.termId = termId;
	  	this.dstLanguage = dstLanguage;
	  	this.translation = translation;
	  }



	function addToComplete(pack) {
		if(pack.wordsList.length == 0) {

			completedList.push(new Category(pack.name, [], [], pack.language, pack.id));
			//updateElemInTable('completedList', selectedLanguage, completedList);
			//saveCompletedList();

			var activeListTemp = [];
			for(var i = 0; i < activeList.length; i++) {
				if(activeList[i].id != pack.id) {
					activeListTemp.push(new Category(activeList[i].name, activeList[i].wordsList, activeList[i].translations, activeList[i].language, activeList[i].id));
				}
			}
			activeList = activeListTemp;
			console.log(activeList);
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//saveActiveList();
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
	}	
		
		var languagesSelect = [];
  		var selectedLanguage = '';
		
		var newPacksList = [];
		var oldPacksList = [];
		var newList = [];
		var activeList = [];
		var untouchedList = [];
		var completedList = [];
		var countOfWordsTranslated = [];*/

		function getCurrentLanguage() {
			var parameters = [1];
			return LocalDB.query('SELECT language FROM currentLanguage where id = ?', parameters).then(function(result) {
				if(result.rows.length > 0) {
					return LocalDB.getById(result);
				}				
			});
		}

		function getAllLanguages() {
			return LocalDB.query('SELECT * FROM languages').then(function(result) {
				return LocalDB.getAll(result);
			});
		}

		function getElem(name, language) {
			var parameters = [language];
			return LocalDB.query('SELECT elem FROM ' + name + ' where language = ?', parameters).then(function(result) {
				if(result.rows.length > 0) {
					return LocalDB.getByLanguage(result);
				}
			});
		}

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

		function initTable(language) {
			insertElem('newPacksList', language);
			insertElem('oldPacksList', language);
			insertElem('newList', language);
			insertElem('activeList', language);
			insertElem('untouchedList', language);
			insertElem('completedList', language);
			insertElem('countOfWordsTranslated', language);		
		}

		/*var languagesSelect = (getAllLanguage() || []);
  		var selectedLanguage = (getCurrentLanguage() || '');
		
		var newPacksList = (getElem2('newPacksList', selectedLanguage) || []);
		var oldPacksList = (getElem2('oldPacksList', selectedLanguage) || []);
		var newList = (getElem2('newList', selectedLanguage) || []);
		var activeList = (getElem2('activeList', selectedLanguage) || []);
		var untouchedList = (getElem2('untouchedList', selectedLanguage) || []);
		var completedList = (getElem2('completedList', selectedLanguage) || []);
		var countOfWordsTranslated = (getElem2('countOfWordsTranslated', selectedLanguage) || []);*/

	//*********************** Language **************************

	function Language(name, code) {
	  	this.name = name;
	  	this.code = code;
	}	

	//var languagesSearch = [];
	/*languagesSearch.push(new Language('Albanian', 'alb'));
  	languagesSearch.push(new Language('French', 'fre'));
  	languagesSearch.push(new Language('German', 'ger'));
  	languagesSearch.push(new Language('Greek', 'gre'));
  	languagesSearch.push(new Language('Italian', 'ita'));
  	languagesSearch.push(new Language('Polish', 'pol'));  	  	 	
  	languagesSearch.push(new Language('Russian', 'rus'));
  	languagesSearch.push(new Language('Spanish', 'spa'));
  	languagesSearch.push(new Language('Swedish', 'swe'));*/

	//*********************** RETURN ****************************

	return {

		/*getAllElemForLanguage: function(language) {
			return $q.all([
				getElem('newPacksList', language, newPacksList),
				getElem('oldPacksList', language, oldPacksList),
				getElem('newList', language, newList),
				getElem('activeList', language, activeList),
				getElem('untouchedList', language, untouchedList),
				getElem('completedList', language, completedList),
				getElem('countOfWordsTranslated', language, countOfWordsTranslated)
				]);
		},*/


		/*getCurrentLanguageTest: function(callback) {
			$ionicPlatform.ready(function () {
				var temp = '';
				$cordovaSQLite.execute(db, 'SELECT language FROM currentLanguage where id = ?', [1]).then(function(results) {
					if(results.rows.length > 0) {
						temp = results.rows.item(0).language;
						callback(temp);
					}
				}, function (err) {
		            console.error(err);
		        });
		    });		
		},*/


		getLanguages: function() {
			return getAllLanguages();

			/*$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, 'SELECT * FROM languages').then(function(results) {
					var temp = false;
					if(results.rows.length > 0) {
						temp = false;
					} else {
						temp = true;
					}
					callback(temp);
				}, function(err) {
				       console.error(err);
				    });
			});*/
		},

		initCurrentLanguages: function() {
			return insertCurrentLanguage('', '');
		},


		addToLanguages: function(item) {
			insertLanguages(item.name, item.code);
			initTable(item.name);
		},

		changeLanguage: function(item) {
			updateCurrentLanguage(item.language, item.code);
		},

		modifiedActiveList: function(list) {
			activeList = list;
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//saveActiveList();
		},

		getNewPacksListAndWordsList: function() {
			return $http.get(apiUrl + '/packs/eng/all').then(function(response) {
				return response.data;
			});
		},

		getCurrentLanguage: function() {
			return getCurrentLanguage();
		},

		getLanguagesSearch: function(callback) {
		  	$http.get('json/languages.json').success(function (data) {
				callback(data);
		    });
		},		

		/*getNewPacksList: function() {
	  		return $http.get(apiUrl + '/packs').then(function(response) {
	      		return response.data;
	      	});
		},*/

		getNewPacksList: function(language) {
			return getElem('newPacksList', language, newPacksList);
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

		removeUntouched: function(itemId) {
	    	for(var i = 0; i < untouchedList.length; i++) {
	    		if(untouchedList[i].id === itemId) {
	    			untouchedList.splice(i, 1);
	    		}
	    	}
	    	//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
	    	//saveUntouchedList();
	    	return;
		},

		removeActive: function(activeId) {
	    	for(var i = 0; i < activeList.length; i++) {
	    		if(activeList[i].id === activeId) {
	    			activeList.splice(i, 1);
	    		}
	    	}
	    	//updateElemInTable('activeList', selectedLanguage, activeList);
	    	//saveActiveList();
	    	return;			
		},

		/*In the untouched list, when an user click on an item, we go to the list of words of the clicked item.
		Therefore we delete it from the untouched list and we add it to the active one*/
		goToWordsListFromUntouched: function(untouchedId) {
			for(var i = 0; i < untouchedList.length; i++) {
				if(untouchedList[i].id == untouchedId) {
					//var wordsList = getWordsList(newList[i].name);
					//var wordsList = getWordsList2(untouchedList[i].name);
					activeList.push(new Category(untouchedList[i].name, untouchedList[i].wordsList, untouchedList[i].translations, untouchedList[i].language, untouchedList[i].id));
					untouchedList.splice(i, 1);
				}
			}
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
			//saveActiveList();
			//saveUntouchedList();
			return;			
		},

		/*When the user click on save on the new view, it adds to activeList all the selected packs,
		and then download from the server each words of list for each selected packs.
		*/
		saveUdpate: function() {
			for(var i = 0; i < newList.length; i++) {
				if(newList[i].checked) {
					//var wordsList = getPromise(newList[i].name);
					//var wordsList = getWordsList(newList[i].name);
					activeList.push(new Category(newList[i].name, wordsList, newList[i].translations, newList[i].language, newList[i].id));
				} else {
					untouchedList.push(new Category(newList[i].name, '[]', newList[i].translations, newList[i].language, newList[i].id));
				}
			}
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
			//updateElemInTable('oldPacksList', selectedLanguage, newPacksList);
			//saveActiveList();
			//saveUntouchedList();
			//saveOldPacksList();
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
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
			//saveActiveList();
			//saveUntouchedList();
			return;
		},

		addToOldPacksList: function(language, oldPacksList) {
			return updateElem('oldPacksList', language, oldPacksList);
			//updateElemInTable('oldPacksList', selectedLanguage, newPacksList);
			//saveOldPacksList();
			
		},

		addToActiveWithWordsList: function(name, wordsList, translations, language, id) {
			activeList.push(new Category(name, wordsList, translations, language, id));
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//saveActiveList();
			return;
		},

		addToActive: function(language, activeList) {
			return updateElem('activeList', language, activeList);
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//saveActiveList();	
		},

		addToUntouched: function(language, untouchedList) {
			return updateElem('untouchedList', language, untouchedList);
			//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
			//saveUntouchedList();
		},

		addToListTemp: function(child) {
			var category = new Category2(child.cawl_H_ID, child.has_parrent, child.name, child.wordsList, child.translations, child.language, child.id);
			return category;
		},

		addToComplete: function(name, language, id) {
			completedList.push(new Category(name, [], [], language, id));
			//updateElemInTable('completedList', selectedLanguage, completedList);
			//saveCompletedList();
			return;
		},

		updateNewList: function(oldPacksListReceived, newPacksListReceived, language) {
			newPacksList = newPacksListReceived;
			updateElem('newPacksList', language, newPacksList);
			//saveNewPacksList();
			var tempNew = [];

				var tempOld = oldPacksListReceived;

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
						tempNew.push(new Category2(newPacksList[i].p.cawl_H_ID, false, newPacksList[i].p.name, newPacksList[i].wordlist, [], newPacksList[i].p.language, newPacksList[i].p.id));
						//tempNew.push(new Category(newPacksList[i].name, [], [], newPacksList[i].language, newPacksList[i].id));
					}
				}

				for(var i = 0; i < tempNew.length; i++) {
					var packTemp = tempNew[i];
			    	for(var j = 0; j < packTemp.wordsList.length; j++) {
			    		packTemp.translations.push(new Translation(packTemp.wordsList[j].id, 'français', ''));
			    	}
			    	tempNew[i] = packTemp;
			    }

				console.log(tempNew);
			    updateElem('newList', language, tempNew);
			    
			    return tempNew;
				//saveNewList();
		},

		/*updateNewList2: function(newPacksListReceived) {
			newPacksList = newPacksListReceived;
			updateElemInTable('newPacksList', selectedLanguage, newPacksList);
			//saveNewPacksList();
			var tempNew = [];
			var tempOld = angular.fromJson(window.localStorage['oldPacksList'] || '[]');

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
					tempNew.push(new Category(newPacksList[i].name, [], [], newPacksList[i].language, newPacksList[i].id));
				}
			}

			newList = tempNew;
			updateElemInTable('newList', selectedLanguage, newList);
			//saveNewList();
			return newList;
		},*/

		//******************** TEST INTEGRATION LISTSTORE **********************************

		getCountOfWordsTranslated: function() {
			return countOfWordsTranslated;
		},

		getLanguageUser: function() {
			return selectedLanguage;
		},

		postTranslation: function(pack) {
			//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.defaults.headers.post["Content-Type"] = "application/json";
			var wordsListTemp = [];
			var translationsTemp = [];
			var translationsToSend = [];

			for(var i = 0; i< pack.translations.length; i++) {
				if(pack.translations[i].translation == '') {
					wordsListTemp.push(new WordsList(pack.wordsList[i].language, pack.wordsList[i].term, pack.wordsList[i].id));
					translationsTemp.push(new Translation(pack.translations[i].termId, pack.translations[i].dstLanguage, pack.translations[i].translation));	
				} else {
					translationsToSend.push(new Translation(pack.translations[i].termId, pack.translations[i].dstLanguage, pack.translations[i].translation));
				}
			}

			for(var i = 0; i < activeList.length; i++) {
				if(activeList[i].id == pack.id) {
					activeList[i].translations = translationsTemp;
					activeList[i].wordsList = wordsListTemp;
				}
			}
			//updateElemInTable('activeList', selectedLanguage, activeList);
			//saveActiveList();

			countOfWordsTranslated = countOfWordsTranslated + translationsToSend.length;
			//updateElemInTable('countOfWordsTranslated', selectedLanguage, countOfWordsTranslated);
			//saveCount();

		    $http.post(apiUrl + "/translate/json", {translations: translationsToSend}).then(function(response) {
		      console.log(response);
		    }).catch(function(err) {
		      console.error(err.data);
		    });

		    console.log(translationsToSend);
		    addToComplete(pack);

			return;
		},

		//ex getCategory 
	    getPack: function(packId) {
	      for (var i = 0; i < activeList.length; i++) {
	        if(activeList[i].id == packId) {
	          return activeList[i];
	        }
	      }
	      return undefined;
	    },


	    getWordToTrans: function(pack, wordId) {
	      for (var i = 0; i < pack.wordsList.length; i++) {
	        if(pack.wordsList[i].id == wordId) {
	          return pack.wordsList[i];
	        }
	      }
	      return undefined;      
	    },

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

	    /*getTranslation: function(category, wordId) {
	    	for(var i = 0; i < category.translations.length; i++) {
	    		if(category.translations[i].termId == wordId) {
	    			return category.translations[i].translation;
	    		}
	    	}
	    },

	    addToTranslationList: function(category, wordId, translation) {
	    	for(var i = 0; i < category.translations.length; i++) {
	    		if(category.translations[i].termId == wordId) {
	    			category.translations[i].translation = translation;
	    		}
	    	}
	    	persist();
	    	return;	
	    },*/

	    //ex updateCategory
	    updatePack: function(pack) {
	    	for(var i = 0; activeList.length; i++) {
	    		if(activeList[i].id == pack.id) {
	    			activeList[i] = pack;
	    			return;
	    		}
	    	}
	    	//updateElemInTable('activeList', selectedLanguage, activeList);
	    	//saveActiveList();
	    },

	    skipWordsList: function(pack, index) {
	    	for(var i = 0; i < activeList.length; i++) {
	    		if(activeList[i].id == pack.id) {
	    			activeList[i].wordsList.splice(index, 1);
	    			activeList[i].translations.splice(index, 1);
	    		}
	    	}
	    	//updateElemInTable('activeList', selectedLanguage, activeList);
	    	//saveActiveList();
	    	addToComplete(pack);
	    },

	    alreadyTranslate: function(pack, index) {
	    	if(pack.translations[index].translation != '') {
	    		return true;
	    	}
	    },

	    //ex removeCategory
	    removePack: function(packId) {
	    	for(var i = 0; i < activeList.length; i++) {
	    		if(activeList[i].id == packId) {
	    			untouchedList.push(new Category(activeList[i].name, activeList[i].wordsList, activeList[i].translations, activeList[i].language, activeList[i].id));
	    			activeList.splice(i, 1);
	    			//updateElemInTable('activeList', selectedLanguage, activeList);
	    			//saveActiveList();
	    			return;
	    		}
	    	}
	    	//updateElemInTable('untouchedList', selectedLanguage, untouchedList);
	    	//saveUntouchedList();
	    }

	};

}]);

