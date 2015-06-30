'use strict';

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'view2/view2.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl', [function() {

}]);
