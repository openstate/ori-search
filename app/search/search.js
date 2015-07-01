'use strict';

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl'
  }).
  when('/search/:q', {
    redirectTo: '/search/:q/page/1'
  }).
  when('/query/:q/page/:page',  {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', ['$scope', 'ORIAPIService', function($scope, ORIAPIService) {
  $scope.query = "";
  $scope.results = {};

  $scope.search = function() {
    console.log('should search for ' + $scope.query + ' now!');

    ORIAPIService.simple_search($scope.query).then(function (result) {
      console.log('Got data for ' + $scope.query);
      //console.dir(result);
      $scope.results = result.data;
    }, function (error) {
      console.log('There was en error getting the data for ' + $scope.query);
    });
  };

}]);
