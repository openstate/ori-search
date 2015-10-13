'use strict';

// Declare app level module which depends on views, and components
angular.module('oriApp', [
  'ngRoute',
  'oriApp.viernulvier',
  'oriApp.search',
  'oriApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {redirectTo: '/search'});
}]);
