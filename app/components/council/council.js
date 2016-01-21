'use strict';

var defered_council_resolver = {
  perform: ['$route', 'CouncilService',
  function($route, CouncilService) {
    return CouncilService.load_information($route.current.params.municipality)
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

.factory("CouncilService", ['$q', 'ORIAPIService',
function ($q, ORIAPIService) {
  var svc = {};
  var organizations = [];
  var persons = []
  var classifications = ['Party', 'committee'];

  svc.load_information = function(municipality_slug) {
    return $q.all([svc.load_organizations(municipality_slug), svc.load_persons(municipality_slug)]);
  };

  svc.load_organizations = function(municipality_slug) {
    // FIXME: set internal data when promise is fulfilled
    return ORIAPIService.organizations(municipality_slug).then(function (data) {
      console.log('Got organization data for ' + municipality_slug);
      organizations = data.data;
      console.dir(data);
    });
  };

  svc.load_persons = function(municipality_slug) {
    // FIXME: set internal data when promise is fulfilled
    return ORIAPIService.persons(municipality_slug).then(function (data) {
      console.log('Got person data for ' + municipality_slug);
      persons = data.data;
      console.dir(data);
    });
  };

  svc.get_persons = function() {
    return persons;
  };

  svc.get_organizations = function() {
    return organizations;
  };

  svc.get_classifications = function() {
    return classifications;
  };

  return svc;
}])

.controller('CouncilCtrl', ['$scope', '$location', 'ORIAPIService', 'CouncilService',
function($scope, $location, ORIAPIService, CouncilService) {
  $scope.organizations = CouncilService.get_organizations();
  $scope.persons = CouncilService.get_persons();
  $scope.classifications = CouncilService.get_classifications();

  $scope.all_classifications = function() {
    return $scope.classifications;
  };

  $scope.organizations_by_classification = function(classification) {
    var results  = $scope.organizations.organizations.filter(function (item) { return (item.classification == classification); });
    return results;
  };

  $scope.persons_by_organization = function(organization) {
    var results = $scope.persons.persons.filter(function (person) {
      var memberships = person.memberships.map(function (m) { return m.organization_id; });
      //console.log(organization.id + ' <-> ' + memberships);
      return ( memberships.indexOf(organization.id) >= 0 );
    });
    console.log('searching for persons belonging to ' + organization.id);
    console.dir(results);
    return results;
  };

  console.log('Council Controller init!');
}]);
