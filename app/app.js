'use strict';

// Declare app level module which depends on views, and components
angular.module('oriApp', [
  'ngRoute',
  'oriApp.search',
  'oriApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/search'});
}]);
