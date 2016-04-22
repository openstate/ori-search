'use strict';

angular.module('oriApp.navbar', ['ngRoute'])

.controller('NavbarCtrl', ['$scope', '$location',
function($scope, $location) {
  console.log('Initializing navbar controller!');
  //$scope.has_filters = /^\/g\/.*/.test($location.url());

  $scope.has_filter = function() {
    return $('#sidebar').is(':visible');
  };
}]);
