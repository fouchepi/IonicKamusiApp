(function() {

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('kamusiapp', ['ionic', 'kamusiapp.liststore', 'kamusiapp.homestore'])

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  $ionicConfigProvider.navBar.alignTitle('center');

  $stateProvider.state('app', {
    url:'/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  });

  $stateProvider.state('app.home', {
    url: '/home',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  });

  $stateProvider.state('app.new', {
    url: '/new',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/new.html',
        controller: 'NewCtrl'
      }
    }
  });

  $stateProvider.state('app.mainList', {
    url: '/mainList',  
    views: {
      'menuContent':{
        templateUrl: 'templates/mainList.html',
        controller: 'MainListCtrl'
      }
    } 
  });

  $stateProvider.state('app.untouched', {
    url: '/untouched',
    cache: false, 
    views: {
      'menuContent':{
        templateUrl: 'templates/untouched.html',
        controller: 'UntouchedCtrl'
      }
    } 
  });

  $stateProvider.state('app.completed', {
    url: '/completed',  
    views: {
      'menuContent':{
        templateUrl: 'templates/completed.html',
        controller: 'CompletedCtrl'
      }
    } 
  });

  $stateProvider.state('app.wordsList', {
    url: '/wordsList/:categoryId',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'templates/wordsList.html',
        controller: 'WordsListCtrl'
      }
    }
  });

  $stateProvider.state('app.wordTrans', {
    url: '/wordTrans/:categoryId/:wordId',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'templates/wordTrans.html',
        controller: 'WordTransCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/home');

});

app.controller('AppCtrl', ['$scope', function($scope) {
}]);

app.controller('HomeCtrl', ['$scope', 'HomeStore', '$state', '$http', '$ionicPopup', function($scope, HomeStore, $state, $http, $ionicPopup) {
  
  //only this line works with homestore
  //$scope.stories = HomeStore.getStories();

  //$scope.stories = [];

  /*$http.get('http://www.reddit.com/r/Android/new/.json')
    .success(function(response) {
      angular.forEach(response.data.children, function(child) {
        $scope.stories.push(child.data);
      });
    });*/


  /*HomeStore.testRedditList().then(function(response) {
    angular.forEach(response.data.children, function(child) {
      $scope.stories.push(child.data);
      console.log($scope.stories);
    });
  });*/
  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Error',
      content: 'No access to the server, please try to update later !'
    }).then(function(res) {
      console.log('Close Alert Box');
    });
  };

  $scope.update = function() {
    HomeStore.getNewPacksList().then(function(newPacksListReceived) {
      $scope.newList = HomeStore.updateNewList(newPacksListReceived);
    }).catch(function(err) {
      console.error(err);
      $scope.showAlert();
      $scope.newList = HomeStore.getNewList(); 
    });

    $scope.untouchedList = HomeStore.getUntouchedList(); 
    $scope.activeList = HomeStore.getActiveList();

    $scope.disableCompleted = HomeStore.disableCompleted();

    //console.log(HomeStore.getNewPacksList());
    //console.log(HomeStore.getWordsListTest());
  }

  $scope.update();

  $scope.new = function() {
    $state.go('app.new');
  }

  $scope.active = function() {
    $state.go('app.mainList');
  }

  $scope.untouched = function() {
    $state.go('app.untouched');
  }

  $scope.completed = function() {
    $state.go('app.completed');
  }

}]);

app.controller('NewCtrl', ['$http', '$state', '$scope', 'HomeStore', function($http, $state, $scope, HomeStore) {

  $scope.packsList = HomeStore.getNewList();
  
  $scope.refresh = function() {
    $scope.packsList = HomeStore.updateNewList();
  }

  $scope.save = function() {

    angular.forEach($scope.packsList, function(child) {
      if(child.checked) {
        HomeStore.getWordsList(child.name).then(function(wordsList) {
          HomeStore.addToActiveWithWordsList(child.name, wordsList, child.translations, child.language, child.id);
        });
      } else {
        HomeStore.addToUntouched(child.name, '[]', child.translations, child.language, child.id);
      }
    });
    HomeStore.saveInLocalOldPacksList();
    $state.go('app.mainList');
  };

}]);

app.controller('UntouchedCtrl', ['$scope', '$state', 'HomeStore', function($scope, $state, HomeStore) {
  $scope.untouchedList = HomeStore.getUntouchedList();

  $scope.goToWordsListFromUntouched = function(untouchedId) {
    HomeStore.goToWordsListFromUntouched(untouchedId);
    $state.go('app.wordsList', {categoryId: untouchedId})
  };

  $scope.save = function() {
    HomeStore.saveUdpateUntouched();
    $state.go('app.mainList');
  };

  $scope.remove = function(itemId) {
    HomeStore.removeUntouched(itemId);
  };

  $scope.data = {
    showDelete: false
  };
  
}]);

app.controller('CompletedCtrl', ['$scope', function($scope) {
}]);

app.controller('MainListCtrl', ['$http', '$scope', 'ListStore', 'HomeStore', function($http, $scope, ListStore, HomeStore) {
  $scope.mainList = ListStore.categoryList();

  $scope.remove = function(categoryId) {
    ListStore.removeCategory(categoryId);
  };

  $scope.data = {
    showDelete: false
  };

}]);

app.controller('WordsListCtrl', ['$scope', '$state', 'ListStore', '$http', function($scope, $state, ListStore, $http) {
  $scope.category = ListStore.getCategory($state.params.categoryId);
  ListStore.addAllEmptyTranslations($scope.category, 'français');
  console.log($scope.category.translations);

  $scope.save = function(wordId) {
    var currentWordIndex = ListStore.getCurrentWordIndex($scope.category, wordId)
    return ListStore.alreadyTranslate($scope.category, currentWordIndex);
  };

  $scope.postTranslation = function() {
    //var translations = angular.toJson($scope.category.translations);
    //console.log($scope.category.translations);

    /*var test = ListStore.getTranslation2();

    var url = 'http://lsir-kamusi.epfl.ch:3000/mobile/translate/json';
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    $http.post(url, {translations: test}).then(function(response) {
      console.log(response);
    }).catch(function(err) {
      console.error(err.data);
    });*/

    ListStore.postTranslation($scope.category);
    
  };
}]);

app.controller('WordTransCtrl', ['$scope', '$state', 'ListStore', '$ionicHistory', function($scope, $state, ListStore, $ionicHistory) {

  $scope.category = ListStore.getCategory($state.params.categoryId);
  var categoryId = $scope.category.id;

  $scope.word = ListStore.getWordToTrans($scope.category, $state.params.wordId);
  $scope.currentWordIndex = ListStore.getCurrentWordIndex($scope.category, $scope.word.id);
  $scope.currentWordNumber = parseInt($scope.currentWordIndex) + 1 + '';

  var nextWordIndex = parseInt($scope.currentWordIndex) + 1 + ''; 

  $scope.catTest = angular.copy(ListStore.getCategory($state.params.categoryId));

  //$scope.translation = angular.copy(ListStore.getTranslation($scope.category, $scope.word.id));

  $scope.translate = function() {

    /*console.log($scope.translation);
    ListStore.addToTranslationList($scope.category, $scope.word.id, $scope.translation);
    console.log($scope.category);*/

    ListStore.updateCategory($scope.catTest);

    if (nextWordIndex < $scope.category.wordsList.length) {
      var nextWordId = ListStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
 };

  $scope.later = function() {

    //ListStore.later($scope.category.id, $scope.word);

    if ($scope.word.id != $scope.category.wordsList.length) {
      var nextWordId = ListStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
  };

  $scope.skip = function() {
    var currentWordIndexTemp = $scope.currentWordIndex;
    console.log($scope.category.wordsList[currentWordIndexTemp].term);
    if ($scope.word.id != $scope.category.wordsList.length) {
      var nextWordId = ListStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
    ListStore.skipWordsList($scope.category, currentWordIndexTemp);
  };

}]);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

}());
