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

  svc.get_municipality_by_name = function (name) {
    console.log('looking for mun iwth name' + name);
    for (var muni in municipalities.organizations) {
      console.log(muni);
      if (municipalities.organizations[muni].name.toLowerCase() == name.toLowerCase()) {
        console.log('found : ');
        console.dir(municipalities.organizations[muni]);
        return municipalities.organizations[muni];
      }
    }
  };

  svc.get_municipality_by_collection = function (name) {
    console.log('looking for mun iwth collection : ' + name);
    for (var muni in municipalities.organizations) {
      console.log(muni);
      if (municipalities.organizations[muni].meta.collection.toLowerCase() == name.toLowerCase()) {
        console.log('found : ');
        console.dir(municipalities.organizations[muni]);
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

  svc.init = function() {
    promise = $q.all([load_sources(), load_municipalities()]);
  };

  return svc;
}]);
