angular.module('kamusiapp.homestore', [])

	.factory('HomeStore', ['$http', function($http) {

	window.localStorage.clear();

	function Pack(id, name) {
		this.id = id;
		this.name = name;
	}

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

	/*function getWordsList(packName) {
		return $http.get(apiUrl + '/' + packName + '/terms').then(function(response) {
			return response.data;
		});

		return promise.then(function(wordsListReceived) {
			return wordsListReceived;
			console.log(wordsListReceived)
		});
	}

	function getWordsList2(packName) {
		var wordsList = [];		
		if (packName === 'Parts of the Body') {
			wordsList.push(new WordsList('1','Head', 'Ceci est la definition de la tête', ''));
			wordsList.push(new WordsList('2','Hair', 'Ceci est la definition des cheveux', ''));
		} else if (packName === 'Pets') {
	    	wordsList.push(new WordsList('1','Dog', 'Ceci est la definition de chien', ''));
	    	wordsList.push(new WordsList('2','Cat', 'Ceci est la definition de chat', ''));
	    	wordsList.push(new WordsList('3','Horse', 'Ceci est la definition de cheveaux', ''));
	    	wordsList.push(new WordsList('4','Turtle', 'Ceci est la definition de tortue', ''));			
		}
		return wordsList;
	}*/

	  function Category(id, wordsList, enName, frName) {
	    this.id = id;
	    this.wordsList = wordsList;
	    this.enName = enName;
	    this.frName = frName;
	  }

	  function WordsList(id, name, def, translation) {
	    this.id = id;
	    this.name = name;
	    this.def = def;
	    this.translation = translation;
	  }

	return {

		getNewPacksList: function() {
	  		return $http.get(apiUrl + '/packs').then(function(response) {
	      		return response.data;
	      	});
		},

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
					activeList.push(new Category(untouchedList[i].id, wordsList, untouchedList[i].name, ''));
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
					//var wordsList = getWordsList2(newList[i].name);
					activeList.push(new Category(newList[i].id, wordsList, newList[i].name, ''));
				} else {
					untouchedList.push(new Pack(newList[i].id, newList[i].name));
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
					activeList.push(new Category(untouchedList[i].id, '[]', untouchedList[i].name, ''));
				} else {
					untouchedTemp.push(new Pack(untouchedList[i].id, untouchedList[i].name));
				}
			}
			untouchedList = untouchedTemp;
			saveActiveList();
			saveUntouchedList();
			return;
		},

		addToUntouched: function(id, name) {
			untouchedList.push(new Pack(id, name));
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
					tempNew.push(new Pack(newPacksList[i].id, newPacksList[i].name));
				}
			}

			newList = tempNew;
			saveNewList();
			return newList;
		}
	};

}]);

