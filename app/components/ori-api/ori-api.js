angular.module('oriApp').factory("ORIAPIService", ['$http', function ($http) {
  var svc = {};
  var base_url = 'http://api.openraadsinformatie.nl/v0';

  svc.simple_search = function(q, p, o) {
    var offset;
    if (p) {
      offset = (p-1) * 20;
    } else {
      offset = 0;
    }

    var payload = {
      query: q,
      from: offset,
      size: 20,
      facets: {
        collection: {},
        types: {},
        start_date: {"interval": "year"}
      }
    };

    if (o !== undefined) {
      payload.filters = o.filters;
    }

    console.log('Performing api call for query ' + q + 'with offset ' + offset);
    console.log('--> payload:');
    console.dir(payload);

    return $http({
      url: base_url + "/search/events",
      method: "POST",
      data: payload
    });
  };

  svc.sources = function() {
    return $http({
      url: base_url + "/sources",
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

  svc.organizations = function(municipality_slug) {
    return $http({
      url: base_url + "/" + municipality_slug + "/organizations/search",
      method: "POST",
      data: {
        size: 100
      }
    });
  };

  svc.persons = function(municipality_slug) {
    return $http({
      url: base_url + "/" + municipality_slug + "/persons/search",
      method: "POST",
      data: {
        size: 100
      }
    });
  };
  return svc;
}]);
