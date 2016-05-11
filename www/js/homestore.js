angular.module('kamusiapp.homestore', [])

	.factory('HomeStore', ['$http', function($http) {

	window.localStorage.clear();

	var newPacksList = angular.fromJson(window.localStorage['newPacksList'] || '[]');
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
	}

	var apiUrl = 'http://lsir-kamusi.epfl.ch:3000/mobile';

	  function Category(name, wordsList, translations, language, id) {
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

	  /*function WordsList(language, term, translation, id) {
	    this.language = language;
	    this.term = term;
	    this.translation = translation;
	    this.id = id;
	  }*/

	  /*function getWordsList(packName) {
	  	console.log(packName);
	  	var p = $http.get(apiUrl + '/' + packName + '/terms').then(function(response) {
	  		console.log(response.data);
	  		return response.data;
	  		
	  	});
	  	return p.then(function(wordsList) {
      		return wordsList;
    	});
	  }*/

	return {

		getNewPacksListAndWordsList: function() {
			return $http.get(apiUrl + '/packs/all').then(function(response) {
				return response.data;
			});
		},

		getNewPacksList: function() {
	  		return $http.get(apiUrl + '/packs').then(function(response) {
	      		return response.data;
	      	});
		},

		/*getWordsListTest: function() {
	  		return $http.get(apiUrl + '/Vegetables/terms').then(function(response) {
	  			console.log(response);
	      		return response.data;
	      	});
		},*/

		getWordsList: function(packName) {
			return $http.get(apiUrl + '/' + packName + '/terms').then(function(response) {
				return response.data;
			});
		},

		getUntouchedList: function() {
			return untouchedList;
		},

		getOldPacksList: function() {
			return untouchedList;
		},

		getNewList: function() {
			return newList;
		},

		getActiveList: function() {
			return activeList;
		},

		getCompletedList: function() {
			return activeList;
		},

		disableCompleted: function() {
			if(completedList.length == 0) {
				return true;
			} else {
				return false;
			}
		},

		removeUntouched: function(itemId) {
	    	for(var i = 0; i < untouchedList.length; i++) {
	    		if(untouchedList[i].id === itemId) {
	    			untouchedList.splice(i, 1);
	    		}
	    	}
	    	saveUntouchedList();
	    	return;
		},

		removeActive: function(activeId) {
	    	for(var i = 0; i < activeList.length; i++) {
	    		if(activeList[i].id === activeId) {
	    			activeList.splice(i, 1);
	    		}
	    	}
	    	saveActiveList();
	    	return;			
		},

		/*In the untouched list, when an user click on an item, we go to the list of words of the clicked item.
		Therefore we delete it from the untouched list and we add it to the active one
		We also have to get the list of words of the pack from the server*/
		goToWordsListFromUntouched: function(untouchedId) {
			for(var i = 0; i < untouchedList.length; i++) {
				if(untouchedList[i].id == untouchedId) {
					//var wordsList = getWordsList(newList[i].name);
					//var wordsList = getWordsList2(untouchedList[i].name);
					activeList.push(new Category(untouchedList[i].name, wordsList, untouchedList[i].translations, untouchedList[i].language, untouchedList[i].id));
					untouchedList.splice(i, 1);
				}
			}
			saveActiveList();
			saveUntouchedList();
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
			saveActiveList();
			saveUntouchedList();
			saveOldPacksList();
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
			saveActiveList();
			saveUntouchedList();
			return;
		},

		saveInLocalOldPacksList: function() {
			saveOldPacksList();
			return;
		},

		addToActiveWithWordsList: function(name, wordsList, translations, language, id) {
			activeList.push(new Category(name, wordsList, translations, language, id));
			saveActiveList();
			return;
		},

		addToUntouched: function(name, wordsList, translations, language, id) {
			untouchedList.push(new Category(name, wordsList, translations, language, id));
			saveUntouchedList();
			return;
		},

		updateNewList: function(newPacksListReceived) {
			newPacksList = newPacksListReceived;
			saveNewPacksList();
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
			saveNewList();
			return newList;
		}
	};

}]);

