angular.module('oriApp').factory("ResultsService", [function () {
  var svc = {};
  var results = {};

  svc.set_results = function(data) {
    console.log('Setting results ..');
    results = data;
  };

  svc.get_results = function() {
    return results;
  };

  return svc;
}]);
