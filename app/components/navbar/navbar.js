'use strict';

angular.module('oriApp.navbar', ['ngRoute'])

.controller('NavbarCtrl', ['$scope', '$location',
function($scope, $location) {
  console.log('Initializing navbar controller!');
  //$scope.has_filters = /^\/g\/.*/.test($location.url());

  $scope.has_filter = function() {
    return ($('#sidebar').length > 0);
  };

  $scope.toggle_sidebar = function() {
    if ($('#sidebar').hasClass('hidden-xs')) {
      $('#sidebar').removeClass('hidden-xs');
    } else {
      $('#sidebar').toggle();
    }
  };
}]);
