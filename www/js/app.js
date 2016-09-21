(function() {

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('kamusiapp', ['ionic', 'kamusiapp.liststore', 'kamusiapp.homestore', 'kamusiapp.localdb', 'jett.ionic.filter.bar'])

/*Configuration of the app
we define the different state of the application, and the controller that defined each view*/
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

  $stateProvider.state('app.sideList', {
    url: '/sideList/:cawlId',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'templates/sideList.html',
        controller: 'SideListCtrl'
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

//the controller of the Home view
app.controller('HomeCtrl', ['$scope', 'HomeStore', '$state', '$http', '$ionicPopup', '$ionicLoading', function($scope, HomeStore, $state, $http, $ionicPopup, $ionicLoading) {

    /*when we are on this view we verify if it is the first time that we start the app
    If it is the first time we go the the settings view, in order to ask the user for a first destination language
    Otherwise we get from the phone all the lists we need from the mobile database, and we look if there are new packages*/
    $scope.$on('$ionicView.enter', function(e) {
        HomeStore.getLanguages().then(function(languages){
          if(languages.length == 0) {
            HomeStore.initCurrentLanguages().then(function() {
              $state.go('app.settings');
            });
          } else {
            $scope.showLoading();
            HomeStore.getCurrentLanguage().then(function(language) {
              HomeStore.getCodeCurrentLanguage().then(function(code) {
                $scope.codeCurrentLanguage = code;
                $scope.currentLanguage = language;
                $scope.update(language, code);                
              });
            });
          }
        });
    })

  //Open a popup in order to alert the user that there is no access to the Kamusi server
  $scope.showAlert = function() {
    $ionicPopup.alert({
      title: 'Error',
      content: 'No access to the server, please try to update later !'
    }).then(function(res) {
      console.log('Close Alert Box');
    });
  };

  //Open a loading bar when the new words are downloaded from the server
  $scope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="lines"></ion-spinner>'
    });
  };

  //Stop the loading bar
  $scope.hideLoading = function(){
    $ionicLoading.hide();
  };

  //called when we need to update all the lists
  $scope.update = function(language, code) {

    /*call the different function of the homestore service in order to get the list of new words (and its length).
    All the function are explains in the homestore service*/
    HomeStore.getNewPacksListAndWordsList().then(function(newPacksListReceived) {
      HomeStore.getOldPacksList(language).then(function(oldPacksList) {
        var newList = HomeStore.updateNewList(oldPacksList, newPacksListReceived, language, code);
        $scope.newList = newList;
        $scope.newListLength = length($scope.newList);
      });        
      $scope.hideLoading();
    }).catch(function(err) {
      console.error(err);
      $scope.showAlert();
      //if we can't reach the server we used the most recent list
      HomeStore.getNewList(language).then(function(newList) {
        $scope.newList = newList;
        $scope.newListLength = length($scope.newList);
      });      
      $scope.hideLoading();
    });  

    //***call the function of homestore in order to get all the lists and their length***

    HomeStore.getUntouchedList(language).then(function(untouchedList) {
      $scope.untouchedList = untouchedList;
      $scope.untouchedListLength = length($scope.untouchedList);
    });

    HomeStore.getActiveList(language).then(function(activeList) {
      $scope.activeList = activeList;
      $scope.activeListLength = length($scope.activeList);
    });

    HomeStore.getCompletedList(language).then(function(completedList) {
      $scope.completedList = completedList;
    });
  }

  /*function that can count the number of main parrents packages*/
  function length(list) {
    var count = 0;
    angular.forEach(list, function(child) {
      if(!child.has_parrent) {
        count++;
      }
    });
    return count;
  }

//**** the function we call when a button is pressed in order to go in the proper view. Call in the home html file. ****

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

//the controller of the new list view (when we press the new button)
app.controller('NewCtrl', ['$http', '$state', '$scope', 'HomeStore', function($http, $state, $scope, HomeStore) {
   
  $scope.refresh = function() {
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.getNewList(currentLanguage).then(function(newList) {
        $scope.packsList = newList;
      });      
    })
  }

  $scope.refresh();

  /*Called when we press the save button (see the new html file).
  Distribute the parents packages in activeList and untouchedList according to what the user has checked*/
  $scope.save = function() {

    var activeList = [];
    var untouchedList = [];

    angular.forEach($scope.packsList, function(child) {
      if(child.checked) {
        activeList.push(child);
      } else {
        /*As we got all the packages in the same way but we show only the parents, we are sure that all the children are not checked.
        However we don't want to add them to the untouched list.*/
        if(!child.has_parrent) {
          untouchedList.push(child);
        }
      }
    });

    //used to add to the activeList and the untouchedList, the children of the parents we have added previously (according to the call_H_ID we got from the server)
    function fillList(packsList, list) {
      var listTemp = [];
      angular.forEach(list, function(listChild) {
        var temp = 0;
        var indexTemp = 0;
        listTemp.push(listChild);
        angular.forEach(packsList, function(packsListChild) {
          temp = packsListChild.cawl_H_ID.indexOf('.');
          if(temp != -1) {
            indexTemp = packsListChild.cawl_H_ID.slice(0, temp);
            if(listChild.cawl_H_ID == indexTemp) {
              listTemp.push(packsListChild);
            }
          }
        })
      })
      return listTemp;
    }

    activeList = fillList($scope.packsList, activeList);
    untouchedList = fillList($scope.packsList, untouchedList);

    //saved all the list in the local database (according to the language the user is working with at this moment) and the app go to the list of the parents the user has checked
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

//Controller of the untouched view (when we press the untouched button in the home view)
app.controller('UntouchedCtrl', ['$scope', '$state', 'HomeStore', function($scope, $state, HomeStore) {

  var activeList = [];

  //we get the untouchedlist and the activelist from the local database (according to the language the user is working with at this moment)
  HomeStore.getCurrentLanguage().then(function(currentLanguage)  {
    HomeStore.getUntouchedList(currentLanguage).then(function(untouchedList) {
      $scope.untouchedList = untouchedList;
    HomeStore.getActiveList(currentLanguage).then(function(activeListR) {
      activeList = activeListR;
    });
    })
  })

  //When the user select a package from this list we add it in the activeList and we go directly there in order to work on it.
  $scope.goToWordsListFromUntouched = function(cawl_H_ID) {
    var untouchedListTemp = [];
    var activeListTemp = activeList;

    //it is the same as previsouly in order to add the selected package but its children too (with the cawl_H_ID)
    angular.forEach($scope.untouchedList, function(child, index) {
      var temp = child.cawl_H_ID.indexOf('.');
      if(temp != -1) {
        var indexTemp = child.cawl_H_ID.slice(0, temp);
        if(indexTemp == cawl_H_ID) {
          activeListTemp.push(child);
        } else {
          untouchedListTemp.push(child);
        }
      } else if(child.cawl_H_ID == cawl_H_ID) {
        activeListTemp.push(child);
      } else {
        untouchedListTemp.push(child);
      }
    });

    //Then we save in the local database the untouchedList and the activeList
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToUntouched(currentLanguage, untouchedListTemp);
      $scope.untouchedList = untouchedListTemp;
      HomeStore.addToActive(currentLanguage, activeListTemp); 
      $state.go('app.sideList', {cawlId: cawl_H_ID});           
    });
  };

  //when we press the red garbage can icon on a package (we decide to delete this package and all its children)
  $scope.remove = function(cawl_H_ID) {
    var untouchedListTemp = [];

    angular.forEach($scope.untouchedList, function(child) {
      var temp = child.cawl_H_ID.indexOf('.');
      if(temp != -1) {
        var indexTemp = child.cawl_H_ID.slice(0, temp);
        if(indexTemp != cawl_H_ID) {
          untouchedListTemp.push(child);
        }
      } else if(child.cawl_H_ID != cawl_H_ID) {
        untouchedListTemp.push(child);
      }
    })

    console.log(untouchedListTemp);

    //Then we save the untouchedList in the local database
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToUntouched(currentLanguage, untouchedListTemp);
      $scope.untouchedList = untouchedListTemp;
    });

  };

  $scope.data = {
    showDelete: false
  };
  
}]);

app.controller('CompletedCtrl', ['$scope', 'HomeStore', function($scope, HomeStore) {
  $scope.completedList = HomeStore.getCompletedList();
}]);

//Controller of the activeList view. When we press the active button in the home view.
app.controller('MainListCtrl', ['$http', '$scope', 'ListStore', 'HomeStore', '$rootScope', '$ionicPlatform', '$state', function($http, $scope, ListStore, HomeStore, $rootScope, $ionicPlatform, $state) {

  var untouchedList = [];

  //we get from the local database the activeList we have to show (only the parents / ng-if in the mainList html file)
  HomeStore.getCurrentLanguage().then(function(currentLanguage) {
    HomeStore.getActiveList(currentLanguage).then(function(activeList) {
      $scope.mainList = activeList;
    });
    HomeStore.getUntouchedList(currentLanguage).then(function(untouchedListR) {
      untouchedList = untouchedListR;
    }); 
  })

  //when we press the hide icon on the package band. We save it and its children in the untouchedList
  $scope.remove = function(cawl_H_ID) {
    var activeListTemp = [];
    var untouchedListTemp = untouchedList;

    angular.forEach($scope.mainList, function(child, index) {
      var temp = child.cawl_H_ID.indexOf('.');
      if(temp != -1) {
        var indexTemp = child.cawl_H_ID.slice(0, temp);
        if(indexTemp == cawl_H_ID) {
          untouchedListTemp.push(child);
        } else {
          activeListTemp.push(child);
        }
      } else if(child.cawl_H_ID == cawl_H_ID) {
        untouchedListTemp.push(child);
      } else {
        activeListTemp.push(child);
      }
    });

    //Then we save the untouchedList to the local database
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToActive(currentLanguage, activeListTemp);
      $scope.mainList = activeListTemp;
      HomeStore.addToUntouched(currentLanguage, untouchedListTemp);
    });
  };

 // run this function when either hard or soft back button is pressed
  var doCustomBack = function() {
      console.log("custom BACK mainList");
      $state.go('app.home');
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
  /*$scope.$on('$destroy', function() {
      console.log('in destroy');
      deregisterHardBack();
      deregisterSoftBack();
  });*/

}]);

//Controller of the child view (used every time we select a child package that has also children)
app.controller('SideListCtrl', ['$scope', '$state', 'HomeStore', '$rootScope', '$ionicPlatform', function($scope, $state, HomeStore, $rootScope, $ionicPlatform) {

  var cawlId = $state.params.cawlId;
  var catIndex = 0;
  var length = cawlId.length + 1;
  var sideListTemp = [];

  HomeStore.getCurrentLanguage().then(function(currentLanguage) {
    HomeStore.getActiveList(currentLanguage).then(function(activeList) {

      angular.forEach(activeList, function(child) {
        var cawlIdTest = cawlId + '.';
        if((child.cawl_H_ID.lastIndexOf(cawlIdTest, 0) === 0) || child.cawl_H_ID == cawlId) {
          var endTemp = child.cawl_H_ID.substring(length, child.cawl_H_ID.length);
          var index = endTemp.indexOf('.');
          if(index == -1) {
            if(((child.cawl_H_ID == cawlId) && (child.wordsList.length != 0)) || (child.cawl_H_ID != cawlId))  {
              catIndex = child.id;
              sideListTemp.push(child);
            }  
          }
        }
      })

      if(sideListTemp.length == 1) {
        var categoryId = sideListTemp[0].id;
        $state.go('app.wordsList', {categoryId: categoryId});
      } else {
        $scope.sideList = sideListTemp;
      }
    })
  })

  $scope.changeList = function(cawlIdR) {
    if(cawlIdR != cawlId) {
      $state.go('app.sideList', {cawlId: cawlIdR});
    } else {
      $state.go('app.wordsList', {categoryId: catIndex});
    }   
  }

  // run this function when either hard or soft back button is pressed
  var doCustomBack = function() {
      console.log("custom BACK sideList");

      console.log(cawlId);
      var index = cawlId.lastIndexOf('.');
      if(index != -1) {
        var cawlIdFinal = cawlId.slice(0, index);
        $state.go('app.sideList', {cawlId: cawlIdFinal});        
      } else {
        $state.go('app.mainList');
      }
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
  /*$scope.$on('$destroy', function() {
      deregisterHardBack();
      deregisterSoftBack();
  });*/

}]);

//When we finaly arrive to a child that doesn't have children we can access to its list of words that we want to translate
app.controller('WordsListCtrl', ['$scope', '$state', 'ListStore', '$http', 'HomeStore', '$rootScope', '$ionicPlatform',  function($scope, $state, ListStore, $http, HomeStore, $rootScope, $ionicPlatform) {

  var categoryId = $state.params.categoryId;
  var cawlId = '';
  var activeListTemp = [];

  HomeStore.getCurrentLanguage().then(function(currentLanguage) {
    HomeStore.getActiveList(currentLanguage).then(function(activeList) {
      activeListTemp = activeList;
      angular.forEach(activeList, function(child, index) {
        if(child.id == categoryId) {
          $scope.category = child;
          cawlId = child.cawl_H_ID;
          $scope.categoryTemp = angular.copy(child);
        }
      })
    })
  });

  //In order to see if the user has already translate this word (a check icon appears - in the wordsList html file)
  $scope.save = function(wordId) {
    var currentWordIndex = HomeStore.getCurrentWordIndex($scope.category, wordId)
    return HomeStore.alreadyTranslate($scope.category, currentWordIndex);
  };

  /*When users are sure of their translation they can post them to the Kamusi server.
  Then we delete them from the app in order that they can't send them twice*/
  $scope.postTranslation = function() {
    var wordsListTemp = [];
    var translationsTemp = [];
    var translationsToSend = [];

    console.log($scope.category);

    angular.forEach($scope.category.translations, function(child, index) {
      console.log(child);
      if(child.translation == '') {
        wordsListTemp.push($scope.category.wordsList[index]);
        translationsTemp.push(child);
      } else {
        translationsToSend.push(child);
      }
    })

    for(var i = 0; i <activeListTemp.length; i++) {
      if(activeListTemp[i].id == $scope.categoryTemp.id) {
        console.log(activeListTemp[i]);
        activeListTemp[i].translations = translationsTemp;
        activeListTemp[i].wordsList = wordsListTemp;
      }      
    }

    console.log(wordsListTemp);      
    console.log(translationsTemp);      
    console.log(translationsToSend);
    console.log(activeListTemp);

    //We increase the number of words the users have transalted since they used the app. And we save this count in the local database
    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToActive(currentLanguage, activeListTemp);
      HomeStore.getCountOfWordsTranslated(currentLanguage).then(function(count) {
        var newCount = count + translationsToSend.length;
        HomeStore.addToCount(currentLanguage, newCount);
      })
    })

    HomeStore.postTranslation2(translationsToSend);
    //$state.go('app.home');
    
  };

   // run this function when either hard or soft back button is pressed
  var doCustomBack = function() {
      console.log("custom BACK wordsList");
      
      console.log(cawlId);
      var index = cawlId.lastIndexOf('.');
      if(index != -1) {
        var cawlIdFinal = cawlId.slice(0, index);
        $state.go('app.sideList', {cawlId: cawlIdFinal});        
      } else {
        $state.go('app.mainList');
      }
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
  /*$scope.$on('$destroy', function() {
      deregisterHardBack();
      deregisterSoftBack();
  });*/

}]);

//The controller of the translation view (when we have selected a word to translate in the list)
app.controller('WordTransCtrl', ['$scope', '$state', '$ionicHistory', 'HomeStore', '$ionicPopup', '$rootScope', '$ionicPlatform', function($scope, $state, $ionicHistory, HomeStore, $ionicPopup, $rootScope, $ionicPlatform) {

  var categoryId = $state.params.categoryId;
  var activeListTemp = [];
  var nextWordIndex = 0;
  var previousWordIndex = 0;

  //we get the word we want to translate and its index in order to know the next and the previous ones
  HomeStore.getCurrentLanguage().then(function(currentLanguage) {
    HomeStore.getActiveList(currentLanguage).then(function(activeList) {
      activeListTemp = activeList
      angular.forEach(activeList, function(child) {
        if(child.id == categoryId) {
          $scope.category = child;
          console.log($scope.category);
          $scope.word = HomeStore.getWordToTrans($scope.category, $state.params.wordId);
          $scope.currentWordIndex = HomeStore.getCurrentWordIndex($scope.category, $scope.word.id);
          $scope.currentWordNumber = parseInt($scope.currentWordIndex) + 1 + '';

          nextWordIndex = parseInt($scope.currentWordIndex) + 1 + '';
          previousWordIndex = parseInt($scope.currentWordIndex) - 1 + '';

          $scope.catTest = angular.copy(child);

        }
      })
    })
  });

  /*$scope.category = HomeStore.getPack($state.params.categoryId);
  var categoryId = $scope.category.id;
  $scope.word = HomeStore.getWordToTrans($scope.category, $state.params.wordId);
  $scope.currentWordIndex = HomeStore.getCurrentWordIndex($scope.category, $scope.word.id);
  $scope.currentWordNumber = parseInt($scope.currentWordIndex) + 1 + '';

  var nextWordIndex = parseInt($scope.currentWordIndex) + 1 + ''; 

  $scope.catTest = angular.copy(HomeStore.getPack($state.params.categoryId));*/

  //called when we press the green button, the transaltion is saved
  $scope.translate = function() {

    for(var i = 0; i<activeListTemp.length; i++) {
      if(activeListTemp[i].id == $scope.catTest.id) {
        activeListTemp[i] = $scope.catTest;
      }
    }

    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToActive(currentLanguage, activeListTemp).then(function() {

        /*if (nextWordIndex < $scope.category.wordsList.length) {
          var nextWordId = HomeStore.nextWordId($scope.category, nextWordIndex);
          $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
        } else {
          $state.go('app.wordsList', {categoryId: categoryId});
        }*/
        $scope.later();

      })
    })
 };

  $scope.translateGoBack = function() {

    for(var i = 0; i<activeListTemp.length; i++) {
      if(activeListTemp[i].id == $scope.catTest.id) {
        activeListTemp[i] = $scope.catTest;
      }
    }

    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToActive(currentLanguage, activeListTemp).then(function() {

        /*if(previousWordIndex < 0) {
          $state.go('app.wordsList', {categoryId: categoryId});
        } else {
          var previousWordId = HomeStore.nextWordId($scope.category, previousWordIndex);
          $state.go('app.wordTrans', {categoryId: categoryId, wordId: previousWordId});
        }*/
        $scope.laterGoBack();

      })
    })    

  };

  //Called when we press the orange button. We keep a word to translate for later.
  $scope.later = function() {
    if (nextWordIndex < $scope.category.wordsList.length) {
      var nextWordId = HomeStore.nextWordId($scope.category, nextWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
    } else {
      $state.go('app.wordsList', {categoryId: categoryId});
    }
  };

  $scope.laterGoBack = function() {
    if(previousWordIndex < 0) {
      $state.go('app.wordsList', {categoryId: categoryId});
    } else {
      var previousWordId = HomeStore.nextWordId($scope.category, previousWordIndex);
      $state.go('app.wordTrans', {categoryId: categoryId, wordId: previousWordId});
    }
  };

  //When we definitly don't know a word we press the red button and the word is deleted.
  $scope.skip = function() {
    var currentWordIndexTemp = $scope.currentWordIndex;
    console.log($scope.category.wordsList[currentWordIndexTemp].term);

    for(var i = 0; i<activeListTemp.length; i++){
      if(activeListTemp[i].id == $scope.category.id) {
        activeListTemp[i].wordsList.splice(currentWordIndexTemp, 1);
        activeListTemp[i].translations.splice(currentWordIndexTemp, 1);
      }
    }

    HomeStore.getCurrentLanguage().then(function(currentLanguage) {
      HomeStore.addToActive(currentLanguage, activeListTemp).then(function() {

        if ($scope.word.id != $scope.category.wordsList.length && nextWordIndex < $scope.category.wordsList.length) {
          var nextWordId = HomeStore.nextWordId($scope.category, currentWordIndexTemp);
          $state.go('app.wordTrans', {categoryId: categoryId, wordId: nextWordId});
        } else {
          $state.go('app.wordsList', {categoryId: categoryId});
        }
        HomeStore.skipWordsList($scope.category);
      })
    })
    
  };

  //Called when we swipe right. Then we save the translation but we ask confirmation first
  $scope.onSwipeRight = function() {
    if($scope.catTest.translations[$scope.currentWordIndex].translation == '') {
      $scope.later();
    } else {
      $scope.showConfirm(true);
    }   
  };

  //Called when we swipe left. We keep the word for later
  $scope.onSwipeLeft = function() {
    if($scope.catTest.translations[$scope.currentWordIndex].translation == '') {
      $scope.laterGoBack();
    } else {
      $scope.showConfirm(false);
    }
  };

 $scope.showConfirm = function(OnRight) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Save',
     template: '<p align="center">' + $scope.catTest.translations[$scope.currentWordIndex].translation + '</p>'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
       if(OnRight) {
        $scope.translate();
      } else {
        $scope.translateGoBack();
      }       
     } else {
       console.log('You are not sure');
     }
   });
 };

   // run this function when either hard or soft back button is pressed
  var doCustomBack = function() {
      console.log("custom BACK wordsTrans");
      $state.go('app.wordsList', {categoryId: $state.params.categoryId});
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
  /*$scope.$on('$destroy', function() {
      deregisterHardBack();
      deregisterSoftBack();
  });*/

  //Code from Sina, shortcut he creates in order to know the type of the word (get from the server)
  $scope.pos = function(p) { 
    if (p=='n') {return 'noun'; 
    } else if (p=='a') { return 'adjective'; 
    } else if (p=='v') { return 'verb'; 
    } else if (p=='r') { return 'adverb'; 
    } else if (p=='nn') { return 'noun'; 
    } else if (p=='aj') { return 'adjective'; 
    } else if (p=='av') { return 'adverb'; 
    } else if (p=='vb') { return 'verb'; 
    } else if (p=='cj') { return 'conjucation'; 
    } else if (p=='ij') { return 'interjection'; 
    } else if (p=='ig') { return 'interrogative'; 
    } else if (p=='pr') { return 'pronoun'; 
    } else if (p=='pp') { return 'preposition'; 
    }else {return p;};
  };

}]);

//COntroller of the setting view. The language selection.
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
    HomeStore.changeLanguage(item).then(function() {
      $state.go('app.home');
    });
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
  HomeStore.getCurrentLanguage().then(function(currentLanguage) {
    $scope.language = currentLanguage;
    HomeStore.getCountOfWordsTranslated(currentLanguage).then(function(count) {
      console.log(count);
      if(count.length == 0) {
        $scope.countTranslations = 0;       
      } else {
        $scope.countTranslations = count;
      }     
    })
  })
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
