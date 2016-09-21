/*
First service that we have used in the app script, it is no longer used in the app
*/
angular.module('kamusiapp.liststore', [])

	.factory('ListStore', ['$http', 'HomeStore', function($http, HomeStore) {

	//window.localStorage.clear();

	  /*var mainList = [
	      new Category('1', [], 'Parts of the Body', 'Parties du Corps'),
	      new Category('2', [], 'Pets', 'Animaux de Compagnies')
	    ];*/

	    /*mainList[0].wordsList.push(new WordsList('1','Head', 'Ceci est la definition de la tête', ''));
	    mainList[0].wordsList.push(new WordsList('2','Hair', 'Ceci est la definition des cheveux', ''));

	    mainList[1].wordsList.push(new WordsList('1','Dog', 'Ceci est la definition de chien', ''));
	    mainList[1].wordsList.push(new WordsList('2','Cat', 'Ceci est la definition de chat', ''));
	    mainList[1].wordsList.push(new WordsList('3','Horse', 'Ceci est la definition de cheveaux', ''));
	    mainList[1].wordsList.push(new WordsList('4','Turtle', 'Ceci est la definition de tortue', ''));*/

	  /*function Category(id, wordsList, enName, frName) {
	    this.id = id;
	    this.wordsList = wordsList;
	    this.enName = enName;
	    this.frName = frName;
	  }*/

	  var countOfWordsTranslated = angular.fromJson(window.localStorage['countOfWordsTranslated'] || 0);

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

	  var testPost = [];
	  testPost.push(new Translation(207474, 'french', 'boucher'));
	  testPost.push(new Translation(207471, 'french', 'fermier'));
	  testPost.push(new Translation(207468, 'french', 'juge'));

	var mainList = angular.fromJson(window.localStorage['mainList'] || '[]');	  

	function persist() {
		window.localStorage['mainList'] = angular.toJson(mainList);
	}

	function saveCount() {
		window.localStorage['countOfWordsTranslated'] = angular.toJson(countOfWordsTranslated);
	}

	function addToComplete(category) {
		if(category.wordsList.length == 0) {
			HomeStore.addToComplete(category.name, category.language, category.id);
			var mainListTemp = [];
			for(var i = 0; i < mainList.length; i++) {
				if(mainList[i].id != category.id) {
					mainListTemp.push(new Category(mainList[i].name, mainList[i].wordsList, mainList[i].translations, mainList[i].language, mainList[i].id));
				}
			}
			mainList = mainListTemp;
			HomeStore.modifiedActiveList(mainList);
			persist();
		}
	}

	var apiUrl = 'http://lsir-kamusi.epfl.ch:3000/mobile';

	return {

		getCountOfWordsTranslated: function() {
			return countOfWordsTranslated;
		},

		getLanguageUser: function() {
			return 'français';
		},

		postTranslation: function(category) {
			//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.defaults.headers.post["Content-Type"] = "application/json";
			var wordsListTemp = [];
			var translationsTemp = [];
			var translationsToSend = [];

			for(var i = 0; i< category.translations.length; i++) {
				if(category.translations[i].translation == '') {
					wordsListTemp.push(new WordsList(category.wordsList[i].language, category.wordsList[i].term, category.wordsList[i].id));
					translationsTemp.push(new Translation(category.translations[i].termId, category.translations[i].dstLanguage, category.translations[i].translation));	
				} else {
					translationsToSend.push(new Translation(category.translations[i].termId, category.translations[i].dstLanguage, category.translations[i].translation));
				}
			}

			for(var i = 0; i < mainList.length; i++) {
				if(mainList[i].id == category.id) {
					mainList[i].translations = translationsTemp;
					mainList[i].wordsList = wordsListTemp;
				}
			}
			persist();

			countOfWordsTranslated = countOfWordsTranslated + translationsToSend.length;
			saveCount();

		    $http.post(apiUrl + "/translate/json", {translations: translationsToSend}).then(function(response) {
		      console.log(response);
		    }).catch(function(err) {
		      console.error(err.data);
		    });

		    console.log(translationsToSend);

			return;
		},

		getTranslation2: function() {
			return testPost;
		},

	    categoryList: function() {
	    	if(mainList.length == 0) {
	    		mainList = HomeStore.getActiveList();
	    		persist();
	    	}	
	      return mainList;
	    },

	    getCategory: function(categoryId) {
	      for (var i = 0; i < mainList.length; i++) {
	        if(mainList[i].id == categoryId) {
	          return mainList[i];
	        }
	      }
	      return undefined;
	    },

	    getWordToTrans: function(category, wordId) {
	      for (var i = 0; i < category.wordsList.length; i++) {
	        if(category.wordsList[i].id == wordId) {
	          return category.wordsList[i];
	        }
	      }
	      return undefined;      
	    },

	    getCurrentWordIndex: function(category, wordId) {
		  for (var i = 0; i < category.wordsList.length; i++) {
	        if(category.wordsList[i].id == wordId) {
	          return i;
	        }
	      }
	      return undefined;      
	    },

	    nextWordId: function(category, nextWordIndex) {
	    	return category.wordsList[nextWordIndex].id;
	    },

	    getTranslation: function(category, wordId) {
	    	for(var i = 0; i < category.translations.length; i++) {
	    		if(category.translations[i].termId == wordId) {
	    			return category.translations[i].translation;
	    		}
	    	}
	    },

	    addToTranslationList: function(category, wordId, translation) {
	    	/*var alreadyIn = false;
	    	var test = '[]'*/
	    	for(var i = 0; i < category.translations.length; i++) {
	    		if(category.translations[i].termId == wordId) {
	    			//alreadyIn = true;
	    			category.translations[i].translation = translation;
	    		}
	    	}
	    	persist();
	    	return;
	    	/*if(!alreadyIn) {
	    		category.translations.push(new Translation(wordId, 'français', translation));
	    		persist();
	    		return;
	    	}*/  	
	    },

	    /*
	    */
	    updateCategory: function(category) {
	    	for(var i = 0; mainList.length; i++) {
	    		if(mainList[i].id == category.id) {
	    			mainList[i] = category;
	    			return;
	    		}
	    	}
	    },

	    skipWordsList: function(category, index) {
	    	for(var i = 0; i < mainList.length; i++) {
	    		if(mainList[i].id == category.id) {
	    			mainList[i].wordsList.splice(index, 1);
	    			mainList[i].translations.splice(index, 1);
	    		}
	    	}
	    	persist();
	    	addToComplete(category);
	    },

	    alreadyTranslate: function(category, index) {
	    	if(category.translations[index].translation != '') {
	    		return true;
	    	}
	    },

	    /*add: function(categoryId, word) {
	      for (var i = 0; i < mainList[categoryId - 1].wordsList.length; i++) {
	        if(mainList[categoryId - 1].wordsList[i].id == word.id) {
	          mainList[categoryId - 1].wordsList[i] = word;
	          persist();
	          return;
	        }
	      }      
	    },*/

	    /*testDoublon: function(id) {
	    	for(var i = 0; i < mainList.length; i++) {
	    		if(mainList[i].id == id) {
	    			return true;
	    		}
	    	}
	    },*/

	    /*addCategory: function(id, array, enName, frName) {
			    mainList.push(new Category(id, array, enName, frName));
			    persist();
			    return;
	    },*/

	    removeCategory: function(categoryId) {
	    	for(var i = 0; i < mainList.length; i++) {
	    		if(mainList[i].id == categoryId) {
	    			HomeStore.addToUntouched(mainList[i].name, mainList[i].wordsList, mainList[i].language, mainList[i].id);
	    			mainList.splice(i, 1);
	    			HomeStore.removeActive(categoryId);
	    			persist();
	    			return;
	    		}
	    	}
	    }

	};

	}]);
