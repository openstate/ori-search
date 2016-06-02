'use strict';

var defered_council_resolver = {
  perform: ['$route', 'CouncilService', 'OptionsService',
  function($route, CouncilService, OptionsService) {
    var municipality = $route.current.params.municipality;
    if (typeof(municipality) != 'undefined') {
      OptionsService.set_internal_option('single_mode', true);
      OptionsService.set_internal_option('municipality', municipality);
    }

    return CouncilService.load_information(municipality);
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

.filter('person_img', function() {
  return function (val) {
    if (typeof(val.image) !== 'undefined') {
      return val.image;
    } else  if (typeof(val.gender) !== 'undefined') {
      return "images/" + val.gender.toLowerCase() + ".svg";
    } else {
      return "images/male.svg";
    }
  };
})

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.factory("CouncilService", ['$q', 'ORIAPIService',
function ($q, ORIAPIService) {
  var svc = {};
  var organizations = [];
  var persons = [];
  var classifications = ['Party', 'committee'];

  svc.load_information = function(municipality_slug) {
    return $q.all([svc.load_organizations(municipality_slug), svc.load_persons(municipality_slug)]);
  };

  svc.load_organizations = function(municipality_slug) {
    // FIXME: set internal data when promise is fulfilled
    console.log('Start getting organixations');
    return ORIAPIService.organizations(municipality_slug).then(function (data) {
      console.log('Got organization data for ' + municipality_slug);
      organizations = data.data.organizations;
      console.dir(data);
    });
  };

  svc.load_persons = function(municipality_slug) {
    console.log('Start getting persons');
    // FIXME: set internal data when promise is fulfilled
    return ORIAPIService.persons(municipality_slug).then(function (data) {
      console.log('Got person data for ' + municipality_slug);
      persons = data.data.persons;
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

.controller('CouncilCtrl', ['$scope', '$location', 'ORIAPIService', 'CouncilService', 'OptionsService',
function($scope, $location, ORIAPIService, CouncilService,OptionsService) {
  $scope.organizations = CouncilService.get_organizations();
  $scope.persons = CouncilService.get_persons();
  $scope.classifications = CouncilService.get_classifications();
  $scope.municipality = OptionsService.get_internal_option('municipality');

  $scope.all_classifications = function() {
    return $scope.classifications;
  };

  $scope.organizations_by_classification = function(classification) {
    var results  = $scope.organizations.filter(function (item) { return (item.classification == classification); });
    return results;
  };

  $scope.persons_by_organization = function(organization) {
    if (typeof(organization.id) == 'undefined') {
      return [];
    }
    var results = $scope.persons.filter(function (person) {
      if (typeof(person.memberships) == 'undefined') {
        return false;
      }
      if (person.memberships.length <= 0) {
        return false;
      }
      var memberships = person.memberships.map(function (m) { return m.organization_id; });
      //console.log(organization.id + ' <-> ' + memberships);
      return ( memberships.indexOf(organization.id) >= 0 );
    });
    //console.dir(results);
    return results;
  };

  console.log('Council Controller init!');
}]);
