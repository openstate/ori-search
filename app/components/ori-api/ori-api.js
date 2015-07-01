angular.module('oriApp').factory("ORIAPIService", ['$http', function ($http) {
  var svc = {};
  var base_url = 'http://localhost:5000/v0';

  svc.simple_search = function(q) {
    return $http.get(base_url + "/search?query=" + q);
  };

  return svc;
}]);
