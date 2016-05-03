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
    views: {
      'menuContent':{
        templateUrl: 'templates/wordsList.html',
        controller: 'WordsListCtrl'
      }
    }
  });

  $stateProvider.state('app.wordTrans', {
    url: '/wordTrans/:categoryId/:wordId',
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

app.controller('HomeCtrl', ['$scope', 'HomeStore', '$state', '$http', function($scope, HomeStore, $state, $http) {
  
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

  $scope.update = function() {
    //$scope.newList = HomeStore.updateNewList();
    HomeStore.getNewPacksList().then(function(newPacksListReceived) {
      $scope.newList = HomeStore.updateNewList(newPacksListReceived);
    });

    $scope.untouchedList = HomeStore.getUntouchedList(); 
    $scope.activeList = HomeStore.getActiveList();

        
    $scope.disableNew = HomeStore.disableNew();
    $scope.disableUntouched = HomeStore.disableUntouched();
    $scope.disableActive = HomeStore.disableActive();

    $scope.disableCompleted = HomeStore.disableCompleted();
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
    HomeStore.saveUdpate();
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

app.controller('WordsListCtrl', ['$scope', '$state', 'ListStore', function($scope, $state, ListStore) {
  $scope.category = ListStore.getCategory($state.params.categoryId);
}]);

app.controller('WordTransCtrl', ['$scope', '$state', 'ListStore', '$ionicHistory', function($scope, $state, ListStore, $ionicHistory) {
  $scope.category = ListStore.getCategory($state.params.categoryId);
  $scope.word = angular.copy(ListStore.getWordToTrans($state.params.categoryId, $state.params.wordId));

  var categoryId = $scope.category.id;
  var nextWordId = parseInt($scope.word.id) + 1 + ''; 

  $scope.translate = function() {
    
    ListStore.add($scope.category.id, $scope.word);
    
    if ($scope.word.id != $scope.category.wordsList.length) {
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
 };

  $scope.later = function() {

    //ListStore.later($scope.category.id, $scope.word);

    if ($scope.word.id != $scope.category.wordsList.length) {
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
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
