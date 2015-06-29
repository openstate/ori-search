'use strict';

angular.module('oriApp.navbar', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/navbar', {
    templateUrl: 'view1/view1.html',
    controller: 'NavbarCtrl'
  });
}])

.controller('NavbarCtrl', [function() {

}]);
