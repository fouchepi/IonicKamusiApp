angular.module('kamusiapp.homestore', [])

	.factory('HomeStore', ['$http', 'ListStore', function($http, ListStore) {

	window.localStorage.clear();

	function Pack(id, name) {
		this.id = id;
		this.name = name;
	}

	var newPacksList = [];	
	newPacksList.push(new Pack('1', 'Parts of the Body'));
	newPacksList.push(new Pack('2', 'Pets'));	
	newPacksList.push(new Pack('3', 'Cars'));	
	newPacksList.push(new Pack('4', 'Foods'));	
	newPacksList.push(new Pack('5', 'Clothes'));		

	var oldPacksList = angular.fromJson(window.localStorage['oldPacksList'] || '[]'); 
	var newList = angular.fromJson(window.localStorage['newList'] || '[]');
	var untouchedList = angular.fromJson(window.localStorage['untouchedList'] || '[]');
	var completedList = angular.fromJson(window.localStorage['completedList'] || '[]');

	function saveOldPacksList() {
		window.localStorage['oldPacksList'] = angular.toJson(newPacksList);
	}

	function saveNewList() {
		window.localStorage['newList'] = angular.toJson(newList);
	}

	function saveUntouchedList() {
		window.localStorage['untouchedList'] = angular.toJson(untouchedList);
	}

	function saveCompletedList() {
		window.localStorage['completedList'] = angular.toJson(completedList);
	}

	var apiUrl = 'http://128.179.137.73:3000';

	function getNewPacksList() {
		var promise = $http.get(apiUrl + '/packs').then(function(response) {
			return response.data;
		});
		promise.then(function(newPacksListReceived) {
			newPacksList = newPacksListReceived;
		});
	}

	function getListWords(packName) {
		var promise = $http.get(apiUrl + '/' + packName + '/terms').then(function(response) {
			return response.data;
		});
		return promise.then(function(wordsList) {
			return wordsList;
		});
	}

	/*var testUrl = 'http://www.reddit.com/r/Android/new/.json';

	var stories = angular.fromJson(window.localStorage['lastAllPacks'] || '[]');

	function saveLastAllPacks() {
		window.localStorage['lastAllPacks'] = angular.toJson(stories);
	}

	function testRedditList() {
			$http.get(testUrl).then(function(response) {
				return response.data;
			}).then(function(response) {
    			angular.forEach(response.data.children, function(child) {
      			stories.push(child.data);
    			});
  			});

  			saveLastAllPacks();
  			var test = angular.fromJson(window.localStorage['lastAllPacks']);
  			console.log(test);
  			console.log(stories);
	}*/

	return {

		/*getStories: function() {
			testRedditList();
			return stories;
		},*/

		getNewPacksList: function() {
	  		return $http.get(apiUrl + '/packs').then(function(response) {
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
			return untouchedList;
		},

		getCompletedList: function() {
			return untouchedList;
		},

		disableActive: function() {
			if(ListStore.categoryList.length == 0) {
				return true;
			} else {
				return false;
			}
		},

		getActiveNumber: function() {
			return ListStore.categoryList.length;
		},

		disableNew: function() {
			if(newList.length == 0) {
				return true;
			} else {
				return false;
			}
		},

		disableUntouched: function() {
			if(untouchedList.length == 0) {
				return true;
			} else {
				return false;
			}
		},

		disableCompleted: function() {
			if(completedList.length == 0) {
				return true;
			} else {
				return false;
			}
		},

		/*When the user click on save on the new view, it adds to mainList of ListStore all the selected packs,
		and then download from the server each words of list for each selected packs.
		*/
		saveUdpate: function() {
			for(var i = 0; i < newList.length; i++) {
				if(newList[i].checked) {
					//var wordsList = getListWords(newList[i].name);
					ListStore.addCategory(newList[i].id, '[]', newList[i].name, '');
				} else {
					untouchedList.push(new Pack(newList[i].id, newList[i].name));
				}
			}
			saveUntouchedList();
			saveOldPacksList();
			return;
		},

		saveUdpateUntouched: function() {
			var lengthTemp = untouchedList.length;
			var untouchedTemp = [];
			for(var i = 0; i < lengthTemp; i++) {
				if(untouchedList[i].checked) {
					ListStore.addCategory(untouchedList[i].id, '[]', untouchedList[i].name, '');
				} else {
					untouchedTemp.push(new Pack(untouchedList[i].id, untouchedList[i].name))
				}
			}
			untouchedList = untouchedTemp;
			saveUntouchedList();
			return;
		},

		updateNewList: function() {
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

