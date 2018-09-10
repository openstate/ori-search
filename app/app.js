'use strict';

moment.locale('nl');

// Declare app level module which depends on views, and components
angular.module('oriApp', [
  'ngRoute',
  'ngTouch',
  'matchMedia',
  'infinite-scroll',
  'ui-rangeSlider',
  'chart.js',
  'daterangepicker',
  'angularSpinner',
  'oriApp.branding',
  'oriApp.constants',
  'oriApp.options',
  'oriApp.viernulvier',
  'oriApp.search',
  'oriApp.navbar',
  'oriApp.council',
  'oriApp.home',
  'oriApp.version'
]).

run(['ConstantsService', '$location', '$rootScope', function (ConstantsService, $location, $rootScope) {
  console.log('now in the run block of the main app module!');
  //$rootScope.title = 'Blah';

  $rootScope.$on( '$routeChangeSuccess', function( event, current, previous ){
    //console.log( current.$$route.title );
    console.log('got root scope change event, now updating title!');
    $rootScope.branding = ConstantsService.get_branding();
  });
}]).

config(['$routeProvider', function($routeProvider) {
//  $routeProvider.when('/', {redirectTo: '/search'});
}]);
