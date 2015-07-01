angular.module('oriApp').factory("ResultsService", [function () {
  var svc = {};
  var results = {};
  var query = null;

  svc.set_query = function(q) {
    query = q;
  };

  svc.get_query = function() {
    return query;
  };

  svc.set_results = function(data) {
    console.log('Setting results ..');
    results = data;
  };

  svc.get_results = function() {
    return results;
  };

  return svc;
}]);
