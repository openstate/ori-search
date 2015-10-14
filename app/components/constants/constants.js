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

  svc.get_promise = function() {
    return promise;
  }

  svc.get_sources = function() {
    return sources;
  }

  var load_sources = function() {
    return ORIAPIService.sources().then(function (data) {
      console.log('Got api sources data ...');
      sources = data.data;
    });
  };

  svc.get_municipalities = function() {
    return municipalities;
  };

  var load_municipalities = function() {
    return ORIAPIService.municipalities().then(function (data) {
      console.log('Got municipalities data:');
      console.dir(data);
      municipalities = data.data;
    });
  };

  svc.init = function() {
    promise = $q.all([load_sources(), load_municipalities()]);
  };

  return svc;
}]);
