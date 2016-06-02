(function() {

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('kamusiapp', ['ionic', 'kamusiapp.liststore', 'kamusiapp.homestore', 'kamusiapp.localdb', 'jett.ionic.filter.bar'])

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
    cache: false,
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

  $stateProvider.state('app.settings', {
    url: '/settings',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'
      }
    }
  });

  $stateProvider.state('app.infouser', {
    url: '/infouser',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'templates/infouser.html',
        controller: 'InfoUserCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/home');

});

app.controller('AppCtrl', ['$scope', 'HomeStore', function($scope, HomeStore) {
}]);

app.controller('HomeCtrl', ['$scope', 'HomeStore', '$state', '$http', '$ionicPopup', '$ionicLoading', function($scope, HomeStore, $state, $http, $ionicPopup, $ionicLoading) {
 
 //$scope.show();

    $scope.$on('$ionicView.enter', function(e) {
        HomeStore.getLanguages().then(function(languages){
          if(languages.length == 0) {
            HomeStore.initCurrentLanguages().then(function() {
              $state.go('app.settings');
            });
          } else {
            $scope.showLoading();
            HomeStore.getCurrentLanguage().then(function(language) {
              $scope.currentLanguage = language;
              $scope.update(language);
            });
          }
        });
    })

  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Error',
      content: 'No access to the server, please try to update later !'
    }).then(function(res) {
      console.log('Close Alert Box');
    });
  };

  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $scope.update = function(language) {


    HomeStore.getNewPacksListAndWordsList().then(function(newPacksListReceived) {
      HomeStore.getOldPacksList(language).then(function(oldPacksList) {
        var newList = HomeStore.updateNewList(oldPacksList, newPacksListReceived, language);
        $scope.newList = newList;
        //var pid = hid.slice(0,hid.lastIndexOf('.'));
      });        
      $scope.hideLoading();
    }).catch(function(err) {
      console.error(err);
      $scope.showAlert();
      HomeStore.getNewList(language).then(function(newList) {
        $scope.newList = newList;
      });      
      $scope.hideLoading();
    });  

    HomeStore.getUntouchedList(language).then(function(untouchedList) {
      $scope.untouchedList = untouchedList;
    });

    HomeStore.getActiveList(language).then(function(activeList) {
      $scope.activeList = activeList;
    });

    HomeStore.getCompletedList(language).then(function(completedList) {
      $scope.completedList = completedList;
    });
  }


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
   
  $scope.refresh = function() {
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.getNewList(currentLanguage).then(function(newList) {
        $scope.packsList = newList;
        console.log($scope.packsList);
      });      
    })
  }

  $scope.refresh();

  $scope.save = function() {

    /*angular.forEach($scope.packsList, function(child) {
      if(child.checked) {
        HomeStore.getWordsList(child.name).then(function(wordsList) {
          HomeStore.addToActiveWithWordsList(child.name, wordsList, child.translations, child.language, child.id);
        });
      } else {
        HomeStore.addToUntouched(child.name, '[]', child.translations, child.language, child.id);
      }
    });*/
    var activeList = [];
    var untouchedList = [];
    angular.forEach($scope.packsList, function(child) {
      if(child.checked) {
        activeList.push(HomeStore.addToListTemp(child));  
      } else {
        untouchedList.push(HomeStore.addToListTemp(child));
      }
    });

    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.getNewPacksList(currentLanguage).then(function(newPacksList) {
        HomeStore.addToOldPacksList(currentLanguage, newPacksList);
      })
      HomeStore.addToUntouched(currentLanguage, untouchedList);
      HomeStore.addToActive(currentLanguage, activeList).then(function() {
        $state.go('app.mainList');
      });
    });
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

app.controller('CompletedCtrl', ['$scope', 'HomeStore', function($scope, HomeStore) {
  $scope.completedList = HomeStore.getCompletedList();
}]);

app.controller('MainListCtrl', ['$http', '$scope', 'ListStore', 'HomeStore', function($http, $scope, ListStore, HomeStore) {
  $scope.mainList = HomeStore.getActiveList();

  $scope.remove = function(categoryId) {
    HomeStore.removePack(categoryId);
  };

  $scope.data = {
    showDelete: false
  };

}]);

app.controller('WordsListCtrl', ['$scope', '$state', 'ListStore', '$http', 'HomeStore',  function($scope, $state, ListStore, $http, HomeStore) {
  $scope.category = HomeStore.getPack($state.params.categoryId);

  $scope.save = function(wordId) {
    var currentWordIndex = HomeStore.getCurrentWordIndex($scope.category, wordId)
    return HomeStore.alreadyTranslate($scope.category, currentWordIndex);
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

    HomeStore.postTranslation($scope.category);
    $state.go('app.home');
    
  };
}]);

app.controller('WordTransCtrl', ['$scope', '$state', 'ListStore', '$ionicHistory', 'HomeStore', '$ionicPopup', '$rootScope', '$ionicPlatform', function($scope, $state, ListStore, $ionicHistory, HomeStore, $ionicPopup, $rootScope, $ionicPlatform) {

  $scope.category = HomeStore.getPack($state.params.categoryId);
  var categoryId = $scope.category.id;

  $scope.word = HomeStore.getWordToTrans($scope.category, $state.params.wordId);
  $scope.currentWordIndex = HomeStore.getCurrentWordIndex($scope.category, $scope.word.id);
  $scope.currentWordNumber = parseInt($scope.currentWordIndex) + 1 + '';

  var nextWordIndex = parseInt($scope.currentWordIndex) + 1 + ''; 

  $scope.catTest = angular.copy(HomeStore.getPack($state.params.categoryId));

  //$scope.translation = angular.copy(ListStore.getTranslation($scope.category, $scope.word.id));

  $scope.translate = function() {

    /*console.log($scope.translation);
    ListStore.addToTranslationList($scope.category, $scope.word.id, $scope.translation);
    console.log($scope.category);*/

    HomeStore.updatePack($scope.catTest);

    if (nextWordIndex < $scope.category.wordsList.length) {
      var nextWordId = HomeStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
 };

  $scope.later = function() {

    //ListStore.later($scope.category.id, $scope.word);

    if ($scope.word.id != $scope.category.wordsList.length) {
      var nextWordId = HomeStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
  };

  $scope.skip = function() {
    var currentWordIndexTemp = $scope.currentWordIndex;
    console.log($scope.category.wordsList[currentWordIndexTemp].term);
    if ($scope.word.id != $scope.category.wordsList.length && nextWordIndex < $scope.category.wordsList.length) {
      var nextWordId = HomeStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.home');
    }
    HomeStore.skipWordsList($scope.category, currentWordIndexTemp);
  };

  $scope.onSwipeRight = function() {
    if($scope.catTest.translations[$scope.currentWordIndex].translation == '') {
      $scope.later();
    } else {
      $scope.showConfirm();
    }   
  };

 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Save Translation',
     template: 'Are you sure you want to save the translation you start to write?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       $scope.translate();
     } else {
       console.log('You are not sure');
     }
   });
 };

 // run this function when either hard or soft back button is pressed
var doCustomBack = function() {
    console.log("custom BACK");
    $state.go('app.wordsList', {categoryId: categoryId});
};

// override soft back
// framework calls $rootScope.$ionicGoBack when soft back button is pressed
var oldSoftBack = $rootScope.$ionicGoBack;
$rootScope.$ionicGoBack = function() {
    doCustomBack();
};
var deregisterSoftBack = function() {
    $rootScope.$ionicGoBack = oldSoftBack;
};

// override hard back
// registerBackButtonAction() returns a function which can be used to deregister it
var deregisterHardBack = $ionicPlatform.registerBackButtonAction(
    doCustomBack, 101
);

// cancel custom back behaviour
$scope.$on('$destroy', function() {
    deregisterHardBack();
    deregisterSoftBack();
});

}]);

app.controller('SettingsCtrl', ['$scope', '$ionicModal', '$ionicFilterBar', 'HomeStore', '$state', function($scope, $ionicModal, $ionicFilterBar, HomeStore, $state) {

  var filterBarInstance;
  $scope.firstTime = false;

  HomeStore.getLanguagesSearch(function(list) {
    $scope.list = list;
  })

  HomeStore.getLanguages().then(function(languages) {
    $scope.languages = languages;

    if($scope.languages.length == 0) {
      $scope.firstTime = true;
    } else if($scope.languages.length == 1) {
      HomeStore.changeLanguage($scope.languages[0]);
      $scope.currentLanguage = $scope.languages[0].language
    }

    HomeStore.getCurrentLanguage().then(function(language) {
      $scope.currentLanguage = language;
    })

  })
    

  $scope.onClick = function(item) {  
    var alreadyIn = false;
    for(var i = 0; i < $scope.languages.length; i++) {
      if($scope.languages[i].language == item.name) {
        alreadyIn = true;
      }
    }

    if(!alreadyIn) {
      HomeStore.addToLanguages(item);
    }
    
    $state.go($state.current, {}, {reload: true});
    $scope.closeModal();
    filterBarInstance(); 
  }; 

  $scope.test = true;

  $scope.data = {
    name: HomeStore.getCurrentLanguage()
  };

  $scope.changeLanguage = function(item) {
    HomeStore.changeLanguage(item);
  };

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.list,
        update: function (filteredItems, filterText) {
          $scope.list = filteredItems;
          if (filterText) {
            console.log(filterText);
          }
        }
      });
    };

 $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.modal = modal;
  });    

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
  });

}]);

app.controller('InfoUserCtrl', ['$scope', 'ListStore', 'HomeStore', function($scope, ListStore, HomeStore) {
  $scope.countTranslations = HomeStore.getCountOfWordsTranslated();
  $scope.language = HomeStore.getLanguageUser();
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
