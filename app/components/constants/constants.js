'use strict';

angular.module('oriApp.constants', ['ngRoute'])

.run(['ConstantsService', '$location', '$rootScope', function (ConstantsService, $location, $rootScope) {
  console.log('now in the run block of the constants module!');
  $rootScope.title = 'Blah';
  ConstantsService.init();
}])

.factory("ConstantsService", ['ORIAPIService', '$q',  function (ORIAPIService, $q) {
  var svc = {};
  var promise;
  var sources;
  var municipalities;
  var classifications = [];
  var doc_types = {
    'events': 'Activiteiten',
    'motions': 'Moties',
    'vote_events': 'Stemmingen'
  };
  var governing_body_types = {
    "Municipality": 'Gemeente',
    "Province": 'Provincie'
  };

  var hostname = window.location.hostname;
  var branding = {
      'zoek.openraadsinformatie.nl': {
        'name': 'Open Raadsinformatie',
        'byline': 'Zoeken in stukken van de raad',
        'logo': 'logo.svg',
        'governing_body_types': ['Municipality']
      },
      'zoek.openstateninformatie.nl': {
        'name': 'Open Staten Informatie',
        'byline': 'Zoeken in stukken van de provincie',
        'logo': 'logo.svg',
        'governing_body_types': ['Province']
      },
      'localhost': {
        'name': 'Open Blah Informatie',
        'byline': 'Zoeken in stukken van de blah',
        'logo': 'logo.svg',
        'governing_body_types': ['Province']
      },
  };

  var start_year = 2006;

  svc.get_branding = function() {
    return branding[hostname];
  }

  svc.get_years = function() {
    var years = [];
    var current_date = new Date();
    for(var i = start_year; i<= current_date.getFullYear(); i++) {
      years.push(i);
    }
    return years;
  };

  svc.get_promise = function() {
    return promise;
  };

  svc.get_doc_types = function() {
    return doc_types;
  };

  svc.get_doc_types_as_keys = function() {
    return Object.keys(doc_types);
  };

  svc.get_sources = function() {
    return sources;
  };

  svc.get_classifications = function() {
    return classifications;
  };

  var load_sources = function() {
    return ORIAPIService.sources().then(function (data) {
      console.log('Got api sources data ...');
      console.log(data);
      sources = data.data;
    });
  };

  svc.get_municipalities = function() {
    return municipalities;
  };

  svc.get_branded_governing_bodies = function() {
    var gb_types = svc.get_branding()['governing_body_types'];
    return svc.get_municipalities().organizations.filter(function (m) {
      return (gb_types.indexOf(m.classification) >= 0);
    });
  }
  svc.get_governing_body_types = function() {
    return governing_body_types;
  };

  svc.get_municipality_by_collection = function (name) {
    for (var muni in municipalities.organizations) {
      if (municipalities.organizations[muni].meta.collection.toLowerCase() == name.toLowerCase()) {
        return municipalities.organizations[muni];
      }
    }
  };

  var load_governing_bodies = function() {
    return ORIAPIService.governing_bodies(Object.keys(governing_body_types)).then(function (data) {
      console.log('Got municipalities data:');
      console.dir(data);
      municipalities = data.data;
    });
  };

  svc.load_classifications = function() {
    console.log('loading classifications!');
    var search_options = {
      filters: {
        types: {terms: svc.get_doc_types_as_keys()}
      },
      size: 0
    };
    return ORIAPIService.simple_search(undefined, 1, search_options).then(function (result) {
      console.log('doing base search to get all terms for facets!');
      console.dir(result);
      classifications = result.data.facets.classification.buckets.map(function (t) { return t.key; });
    });
  };

  svc.load_classifications_for_municipality = function(municipality) {
    console.log('loading classifications for ' + municipality + ' !');
    var search_options = {
      filters: {
        collection:{terms: [municipality]},
        types: {terms: svc.get_doc_types_as_keys()}
      },
      size: 0
    };
    return ORIAPIService.simple_search(undefined, 1, search_options).then(function (result) {
      console.log('doing base search to get all terms for facets!');
      console.dir(result);
      classifications = result.data.facets.classification.buckets.map(function (t) { return t.key; });
    });
  };

  svc.init = function() {
    promise = $q.all([load_sources(), load_governing_bodies()]);
  };

  return svc;
}])

.controller('ConstantsCtrl', ['$scope', '$location', 'ConstantsService',
function($scope, $location, ConstantsService) {
    console.log('In the constants controller!');
  $scope.municipalities = ConstantsService.get_municipalities();
  console.dir($scope.municipalities);
  $scope.sources = ConstantsService.get_sources();
}]);
