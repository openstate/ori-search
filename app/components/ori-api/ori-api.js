angular.module('oriApp').factory("ORIAPIService", ['$http', function ($http) {
  var svc = {};
  var base_url = 'http://api.openraadsinformatie.nl/v0';

  svc.simple_search = function(q, p) {
    var offset;
    if (p) {
      offset = (p-1) * 20;
    } else {
      offset = 0;
    }

    return $http({
      url: base_url + "/search",
      method: "POST",
      data: {
        query: q,
        from: offset,
        size: 20,
        facets: {
          collection: {},
          types: {}
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
