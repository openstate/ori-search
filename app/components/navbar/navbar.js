'use strict';

angular.module('oriApp.navbar', ['ngRoute'])

.controller('NavbarCtrl', ['$scope', '$location', 'OptionsService',
function($scope, $location, OptionsService) {
  console.log('Initializing navbar controller!');
  //$scope.has_filters = /^\/g\/.*/.test($location.url());

  $scope.has_filter = function() {
    return ($('#sidebar').length > 0);
  };

  $scope.toggle_sidebar = function() {
    OptionsService.set_internal_option(
      'sidebar_visible', !OptionsService.get_internal_option('sidebar_visible'));
  };
}]);
