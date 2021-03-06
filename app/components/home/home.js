'use strict';

var defered_home_resolver = {
  perform: ['$route', 'ConstantsService', 'OptionsService', 'SearchService', '$q',
  function ($route, ConstantsService, OptionsService, SearchService, $q) {
    var defer = $q.defer();

    console.log('performing resolve for home page');
    ConstantsService.get_promise().then(function (data) {
      console.log('all constants data was retrieved!');
      defer.resolve(null);
    });

    return defer.promise;
  }]
};

angular.module('oriApp.home', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'components/home/home.html',
    controller: 'HomeCtrl',
    resolve: defered_home_resolver
  }).
  when('/list', {
    templateUrl: 'components/home/list.html',
    controller: 'HomeCtrl',
    resolve: defered_home_resolver
  });
}])

.controller('HomeCtrl', ['$scope', '$location', 'ORIAPIService', 'ConstantsService', 'OptionsService', 'SearchService',
function($scope, $location, ORIAPIService, ConstantsService, OptionsService, SearchService) {
  console.log('Initializing home controller!');
  var _chunk = function(arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  }

  $scope.branding = ConstantsService.get_branding();
  $scope.municipalities = ConstantsService.get_municipalities();
  $scope.filtered_municipalities = $scope.municipalities.organizations.filter(function (m) {
    return ($scope.branding.governing_body_types.indexOf(m.classification) >= 0);
  });
  $scope.chunked_municipalities = _chunk($scope.filtered_municipalities, 3);
  $scope.show_all = ($scope.filtered_municipalities.length < 20);
  console.dir($scope.municipalities);
  OptionsService.set_internal_option('single_mode', false);
  OptionsService.set_internal_option('municipality', undefined);
  SearchService.set_query("");

  $scope.ToggleShowAll = function (f) {
    if (f) {
      $scope.show_all = false;
    } else {
      $scope.show_all = true;
    }
  };

  $scope.ShouldShowAll = function() {
    return $scope.show_all;
  };
}]);
