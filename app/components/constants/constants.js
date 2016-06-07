'use strict';

angular.module('oriApp.constants', ['ngRoute'])

.run(['ConstantsService', function (ConstantsService) {
  console.log('now in the run block of the constants module!');
  ConstantsService.init();
}])

.factory("ConstantsService", ['ORIAPIService', '$q',  function (ORIAPIService, $q) {
  var svc = {};
  var promise;
  var sources;
  var municipalities;
  var classifications = [];
  var doc_types = {
    'events': 'Activiteiten'
  };
  var start_year = 2006;

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

  svc.get_municipality_by_name = function (name) {
    for (var muni in municipalities.organizations) {
      if (municipalities.organizations[muni].name.toLowerCase() == name.toLowerCase()) {
        return municipalities.organizations[muni];
      }
    }
  };

  svc.get_municipality_by_collection = function (name) {
    for (var muni in municipalities.organizations) {
      if (municipalities.organizations[muni].meta.collection.toLowerCase() == name.toLowerCase()) {
        return municipalities.organizations[muni];
      }
    }
  };

  var load_municipalities = function() {
    return ORIAPIService.municipalities().then(function (data) {
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
      classifications = result.data.facets.classification.terms.map(function (t) { return t.term; });
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
      classifications = result.data.facets.classification.terms.map(function (t) { return t.term; });
    });
  };

  svc.init = function() {
    promise = $q.all([load_sources(), load_municipalities()]);
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
