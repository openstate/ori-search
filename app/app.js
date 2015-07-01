'use strict';

// Declare app level module which depends on views, and components
angular.module('oriApp', [
  'ngRoute',
  'oriApp.view1',
  'oriApp.view2',
  'oriApp.navbar',
  'oriApp.search',
  'oriApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/search'});
}]);
