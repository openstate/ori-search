angular.module('oriApp').factory("ORIAPIService", ['$http', function ($http) {
  var svc = {};
  var base_url = 'http://api.openraadsinformatie.nl/v0';
  //var base_url = 'http://localhost:5000/v0';

  svc.base_url = base_url;

  svc.simple_search = function(q, p, o) {
    var offset;
    if (p) {
      offset = (p-1) * 20;
    } else {
      offset = 0;
    }

    var payload = {
      //query: q,
      from: offset,
      size: 20,
      facets: {
        collection: {},
        types: {},
        start_date: {"interval": "year"},
        classification: {"size": 100}
      },
      sort: 'start_date',
      order: 'desc'
    };

    if (q !== undefined) {
      payload.query = q;
    }

    if (o !== undefined) {
      payload.filters = o.filters;
      if (o.facets !== undefined) {
        $.extend(payload.facets, o.facets);
      }
      if (o.sort !== undefined) {
        payload.sort = o.sort;
      }
      if (o.order !== undefined) {
        payload.order = o.order;
      }
    }

    console.log('Performing api call for query ' + q + 'with offset ' + offset);
    console.log('--> payload:');
    console.dir(payload);

    return $http({
      url: base_url + "/search",
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

  svc.governing_bodies = function(classifications, q) {
    payload = {
      url: base_url + "/search/organizations",
      method: "POST",
      data: {
        filters: {
          classification: {
            terms: classifications
          }
        },
        "sort": "meta.source_id",
        "order": "asc",
        "size": 500
      }
    }

    if (typeof(q) !== 'undefined') {
      payload['data']['query'] = q;
    }
    return $http(payload);
  };

  svc.organizations = function(slug) {
    return $http({
      url: base_url + "/" + slug + "/organizations/search",
      method: "POST",
      data: {
        size: 100
      }
    });
  };

  svc.persons = function(slug) {
    return $http({
      url: base_url + "/" + slug + "/persons/search",
      method: "POST",
      data: {
        size: 100
      }
    });
  };
  return svc;
}]);
