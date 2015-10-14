angular.module('oriApp').factory("ORIAPIService", ['$http', function ($http) {
  var svc = {};
  var base_url = 'http://api.openraadsinformatie.nl/v0';

  svc.simple_search = function(q) {
    return $http({
      url: base_url + "/search",
      method: "POST",
      data: {
        query: q,
        facets: {
          collection: {}
        }
      }
    });
  };

  svc.sources = function() {
    return $http({
      url: base_url + "/search",
      method: "GET"
    });
  };

  svc.municipalities = function() {
    return $http({
      url: base_url + "/search/organizations",
      method: "POST",
      data: {
        filters: {
          classification: {
            terms: ["municipality"]
          }
        }
      }
    });
  };

  return svc;
}]);
