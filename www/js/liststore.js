angular.module('kamusiapp.liststore', [])

	.factory('ListStore', ['$http', function($http) {

	  var mainList = [
	      //new Category('1', [], 'Parts of the Body', 'Parties du Corps'),
	      //new Category('2', [], 'Pets', 'Animaux de Compagnies')
	    ];

	    /*mainList[0].wordsList.push(new WordsList('1','Head', 'Ceci est la definition de la tête', ''));
	    mainList[0].wordsList.push(new WordsList('2','Hair', 'Ceci est la definition des cheveux', ''));

	    mainList[1].wordsList.push(new WordsList('1','Dog', 'Ceci est la definition de chien', ''));
	    mainList[1].wordsList.push(new WordsList('2','Cat', 'Ceci est la definition de chat', ''));
	    mainList[1].wordsList.push(new WordsList('3','Horse', 'Ceci est la definition de cheveaux', ''));
	    mainList[1].wordsList.push(new WordsList('4','Turtle', 'Ceci est la definition de tortue', ''));*/

	  function Category(id, wordsList, enName, frName) {
	    this.id = id;
	    this.wordsList = wordsList;
	    this.enName = enName;
	    this.frName = frName;
	  }

	  //
	  function WordsList(id, name, def, translation) {
	    this.id = id;
	    this.name = name;
	    this.def = def;
	    this.translation = translation;
	  }

		//var mainList = angular.fromJson(window.localStorage['mainList'] || '[]');	  

	  function persist() {
	  	window.localStorage['mainList'] = angular.toJson(mainList);
	  }

	  return {

	  	testRedditList: function() {
	  		return redditList;
	  	},

	    categoryList: function() {
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

	    getWordToTrans: function(categoryId, wordId) {
	      for (var i = 0; i < mainList[categoryId - 1].wordsList.length; i++) {
	        if(mainList[categoryId - 1].wordsList[i].id == wordId) {
	          return mainList[categoryId - 1].wordsList[i];
	        }
	      }
	      return undefined;      
	    },

	    add: function(categoryId, word) {
	      for (var i = 0; i < mainList[categoryId - 1].wordsList.length; i++) {
	        if(mainList[categoryId - 1].wordsList[i].id == word.id) {
	          mainList[categoryId - 1].wordsList[i] = word;
	          persist();
	          return;
	        }
	      }      
	    },

	    testDoublon: function(id) {
	    	for(var i = 0; i < mainList.length; i++) {
	    		if(mainList[i].id == id) {
	    			return true;
	    		}
	    	}
	    },

	    addCategory: function(id, array, enName, frName) {
			    mainList.push(new Category(id, array, enName, frName));
			    persist();
			    return;
	    },

	    removeCategory: function(categoryId) {
	    	for(var i = 0; i < mainList.length; i++) {
	    		if(mainList[i].id == categoryId) {
	    			mainList.splice(i, 1);
	    			persist();
	    			return;
	    		}
	    	}
	    }

	  };

	}]);
