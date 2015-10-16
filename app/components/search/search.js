'use strict';

var defered_resolver = {
  perform: ['$route', 'ConstantsService', 'SearchService', '$q',
  function ($route, ConstantsService, SearchService, $q) {
    var defer = $q.defer();

    console.log('performing resolve for search page');
    ConstantsService.get_promise().then(function (data) {
      console.log('all constants data was retrieved!');
      var query = $route.current.params.query;
      var page = 1;
      var options = $route.current.params.options;
      SearchService.set_query(query);
      SearchService.set_page(page);
      console.log('requesting data for ' + query + ' for page ' + page);
      if (options) {
        console.log('-- with options:');
        console.dir(options);
      }
      SearchService.search(query, page).then(function (result) {
        //console.log('Got data for ' + query + ' for page ' + page);
        //SearchService.set_results(result.data);
        defer.resolve(result);
      }, function (error) {
        console.log('There was en error getting the data for ' + query);
        defer.resolve(error);
      });
    });

    return defer.promise;
  }]
};

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    redirectTo: '/search/een'
  }).
  when('/search/:query', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
  }).
  when('/search/:query/options/:options', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
  });
}])

.filter("first_word", function() {
  return function (val) {
    return val.split(/\s+/)[0];
  };
})

.filter("event_type", function () {
  var allowed = ["event", "meeting"];
  return function (val) {
    if (allowed.indexOf(val) >= 0) {
      return val;
    } else {
      return allowed[0];
    }
  };
})

.filter("from_iso8601", function () {
  return function (val) {
    if (val) {
      var info = val.split('T');
      return info[0] + ' ' + info[1];
    }
  };
})

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('format_date', function() {
  return function(val) {
    if (val) {
      var d = new Date(val);
      return d.toDateString() + ' ' + d.toTimeString();
    }
  };
})

.filter('municipality_img', ['ConstantsService', function(ConstantsService) {
  return function (val) {
    var muni = ConstantsService.get_municipality_by_collection(val.meta.collection)

    if (muni && muni['image']) {
      return muni['image'];
    } else if (val.classification) {
      var first_word = val.classification.toLowerCase().split(/\s+/)[0];
      return "images/" + first_word +  ".png";
    }
  };
}])

.filter('person_img', function() {
  return function (val) {
    if (val.image) {
      return val.image;
    } else  if (val.gender) {
      return "images/" + val.gender.toLowerCase() + ".svg";
    }
  };
})

.filter('facet_collection_count', ['SearchService', function (SearchService) {
  return function (val) {
    return SearchService.get_facet_count_for_term('collection', val);
  };
}])

.filter('facet_types_count', ['SearchService', function (SearchService) {
  return function (val) {
    return SearchService.get_facet_count_for_term('types', val);
  };
}])

.filter('doc_type_name', function () {
  var labels = {'persons': 'Personen', 'organizations': 'Organisaties', 'events': 'Activiteiten'};
  return function (val) {
    return labels[val];
  };
})
.factory("SearchService", ['ORIAPIService', function (ORIAPIService) {
  var svc = {};
  var results = {};
  var facets = {};
  var query;
  var page;

  svc.set_facets = function (f) {
    facets = f;
  };

  svc.get_facets = function() {
    return facets;
  };

  svc.get_facet = function (facet_name) {
    return facets[facet_name];
  };

  svc.get_facet_terms = function(facet_name) {
    var facet = svc.get_facet(facet_name);
    if (facet) {
      return facet.terms;
    }
  };

  svc.get_facet_count_for_term = function(facet_name, term_name) {
    var terms = svc.get_facet_terms(facet_name);
    for (var idx in terms) {
      if (terms[idx].term == term_name) {
        return terms[idx].count;
      }
    }
    return 0;
  };

  svc.set_page = function (p) {
    page = p;
  };

  svc.get_page = function() {
    return page;
  };

  svc.set_query = function(q) {
    query = q;
  };

  svc.get_query = function() {
    return query;
  };

  svc.set_results = function(data) {
    console.log('Setting results ..');
    console.dir(data);
    results = data;
  };

  svc.get_results = function() {
    return results;
  };

  svc.search = function(query, page) {
    svc.set_query(query);
    svc.set_page(page);
    console.log('Querying for ' + query + ' for page ' + page);
    return ORIAPIService.simple_search(query, page).then(function (data) {
      var i = 0;
      console.log('Got data! :');
      console.dir(data.data);

      var tmp_results = [];
      for (var tp in data.data) {
        if (tp != 'meta' && tp != 'facets') {
          for (var item in data.data[tp]) {
            var tmp_item = data.data[tp][item];
            tmp_results.push(tmp_item);
          }
        }
      }

      for (var idx in tmp_results.sort(function (a,b) {
        return a['meta']['_score'] - b['meta']['_score'];
      })) {
        var tmp_item = tmp_results[idx];
        var item_num = (page - 1) * 20;
        results[item_num + i] = tmp_item;
        i += 1;
      }

      facets = data.data.facets;
      console.log('Got facets:');
      console.dir(facets);
    });
  }

  svc.next_page = function() {
    return svc.search(query, ++page);
  }

  return svc;
}])

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'SearchService', 'ConstantsService',
function($scope, $location, ORIAPIService, SearchService, ConstantsService) {
  $scope.query = SearchService.get_query();
  $scope.municipalities = ConstantsService.get_municipalities();
  $scope.doc_types = ['persons', 'organizations', 'events'];
  $scope.results = {};
  $scope.meta = {took: 0, total: 0};
  $scope.busy = true;

  console.log('Initializing search controller : ' + $scope.query + ' : ' + $location.absUrl());
  if ($scope.query) {
    $scope.results = SearchService.get_results();
    $scope.busy = false;
  }

  $scope.search = function(query) {
    var qry = query || $scope.query || SearchService.get_query();

    console.log('should search for ' + qry + ' now!');

    var urlstring = 'search/' + qry + "";
  	$location.path(urlstring);
  };

  $scope.nextPage = function() {
    if ($scope.busy) { return; }

    $scope.busy = true;

    console.log('should load the next page now!');
    SearchService.next_page().then(function (data) {
      $scope.results = SearchService.get_results();

      if (data) {
        $scope.meta = data.data.meta;

        console.log('current results after data: ');
        console.dir($scope.results);
      }

      $scope.busy = false;
    });
  };
}]);
