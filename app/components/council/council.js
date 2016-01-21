'use strict';

var defered_council_resolver = {
  perform: ['$route', 'CouncilService',
  function($route, CouncilService) {
    return CouncilService.load_organizations($route.current.params.municipality)
  }]
};

angular.module('oriApp.council', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/c/:municipality', {
    templateUrl: 'components/council/council.html',
    controller: 'CouncilCtrl',
    resolve: defered_council_resolver
  });
}])

.factory("CouncilService", ['ORIAPIService',
function (ORIAPIService) {
  var svc = {};
  var organizations = [];

  svc.load_organizations = function(municipality_slug) {
    // FIXME: set internal data when promise is fulfilled
    return ORIAPIService.organizations(municipality_slug).then(function (data) {
      console.log('Got organization data for ' + municipality_slug);
      organizations = data;
      console.dir(data);
    });
  };

  svc.get_organizations = function() {
    return organizations;
  };

  return svc;
}])

.controller('CouncilCtrl', ['$scope', '$location', 'ORIAPIService', 'CouncilService',
function($scope, $location, ORIAPIService, CouncilService) {
  $scope.organizations = CouncilService.get_organizations();
  console.log('Council Controller init!');
}]);
