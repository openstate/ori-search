'use strict';

var defered_resolver = {
  perform: ['$route', 'ConstantsService', 'OptionsService', 'SearchService', '$q',
  function ($route, ConstantsService, OptionsService, SearchService, $q) {
    var defer = $q.defer();

    console.log('performing resolve for search page');
    ConstantsService.get_promise().then(function (data) {
      console.log('all constants data was retrieved!');
      var query = $route.current.params.query;
      var page = 1;
      var options = $route.current.params.options;
      var municipality = $route.current.params.municipality;
      SearchService.set_query(query);
      SearchService.set_page(page);
      console.log('requesting data for ' +municipality + ', for query: '+ query + ', for page: ' + page);
      if (options) {
        console.log('-- with encoded options:');
        console.dir(options);
        console.log('-- with decoded options:');
        OptionsService.set_options_b64(options);
      } else {
        console.log('-- initializing default options');
        OptionsService.set_default_options();
      }
      options = OptionsService.get_options();
      console.dir(options);

      if (typeof(municipality) != 'undefined') {
        OptionsService.set_internal_option('single_mode', true);
        OptionsService.set_internal_option('municipality', municipality);
        OptionsService.set_collection([municipality]);
      }

      SearchService.search(query, page, options).then(function (result) {
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
  }).
  when('/g/:municipality', {
    redirectTo: '/g/:municipality/search/een'
  }).
  when('/g/:municipality/search/:query', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
  }).
  when('/g/:municipality/search/:query/options/:options', {
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

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.filter('format_date', function() {
  return function(val) {
    if (val) {
      var tijd_datum = new Date(val);
      return tijd_datum.toLocaleString();
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

.filter('no_wsdl_link', function () {
  return function (val) {
    if (val == 'https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl') {
      return '#';
    } else {
      return val;
    }
  };
})

.filter('no_wsdl_no_external_link', function () {
  return function (val) {
    if (val == 'https://www.mijnbabs.nl/iBabsWCFService/Public.svc?singleWsdl') {
      return '';
    } else {
      return '<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>';
    }
  };
})

.factory("SearchService", ['ORIAPIService', 'ConstantsService', 'OptionsService',
function (ORIAPIService, ConstantsService, OptionsService) {
  var svc = {};
  var results = {};
  var facets = {};
  var query;
  var page;
  var options;
  var meta = {took: 0, total: 0};

  svc.set_meta = function(m) {
    meta = m;
  };

  svc.get_meta = function() {
    return meta;
  };

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

  svc.get_options = function() {
    return OptionsService.get_options();
  }

  svc.set_options = function(o) {
    OptionsService.set_options(o);
  }

  svc.search = function(query, page, options) {
    svc.set_query(query);
    svc.set_page(page);

    if (options !== undefined) {
      svc.set_options(options);
    } else {
      OptionsService.set_default_options();
    }
    options = svc.get_options();
    console.log('Querying for ' + query + ' for page ' + page + ' with options:');
    console.dir(options);
    return ORIAPIService.simple_search(query, page, options).then(function (data) {
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

      svc.set_meta(data.data.meta);
    });
  }

  svc.next_page = function() {
    return svc.search(svc.get_query(), ++page, svc.get_options());
  }

  svc.first_page = function() {
    svc.set_page(1);
    svc.set_results({});
    return svc.search(svc.get_query(), svc.get_page(), svc.get_options());
  };

  return svc;
}])

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'SearchService', 'ConstantsService', 'OptionsService',
function($scope, $location, ORIAPIService, SearchService, ConstantsService, OptionsService) {
  $scope.query = SearchService.get_query();
  $scope.municipalities = ConstantsService.get_municipalities();
  $scope.options = SearchService.get_options();
  $scope.years = ConstantsService.get_years();

  if ($scope.municipalities) {
    $scope.municipalities_full = $scope.municipalities.organizations.map(function (o) {
      o.active = ($.inArray(o.meta.collection, $scope.options.filters.collection.terms) >= 0);
      o.count = SearchService.get_facet_count_for_term('collection', o.meta.collection)
      return o;
    });
  } else {
    $scope.municipalities_full = [];
  }

  $scope.doc_types = ConstantsService.get_doc_types();
  $scope.doc_types_full = [];
  $scope.results = {};
  $scope.meta = SearchService.get_meta();
  $scope.busy = true;
  $scope.facets = [];
  $scope.years_full = [];
  $scope.date = {
    // FIXME: take from options object
    usermin: 2006,
    usermax: 2016
  };

  console.log('Initializing search controller : ' + $scope.query + ' : ' + $location.absUrl());
  if ($scope.query) {
    $scope.results = SearchService.get_results();
    $scope.meta = SearchService.get_meta();
    $scope.options = SearchService.get_options();
    $scope.single_mode = OptionsService.get_internal_option('single_mode');
    $scope.municipality = OptionsService.get_internal_option('municipality');
    $scope.busy = false;
    $scope.facets = SearchService.get_facets();

    for (var doc_type in $scope.doc_types) {
      $scope.doc_types_full.push({
        term: doc_type,
        label: $scope.doc_types[doc_type],
        active: ($.inArray(doc_type, $scope.options.filters.types.terms) >= 0),
        count: SearchService.get_facet_count_for_term('types', doc_type)
      })
    }

    console.log('facets:');
    console.dir($scope.facets);
    // FIXME: years is a range query
    $scope.years_full = $scope.years.map(function (y) {
      return {
        label: y,
        active: ($.inArray(y, $scope.options.filters.start_date.terms) >= 0),
        count: SearchService.get_facet_count_for_term('start_date', y.toString())
      };
    });

  }


  $scope.search = function(query) {
    var qry = query || $scope.query || SearchService.get_query();

    console.log('should search for ' + qry + ' now!');

    SearchService.set_page(1);
    SearchService.set_results({});
    $scope.results = {};

    var start_path = "";
    if (OptionsService.get_internal_option('single_mode')) {
      start_path = "g/" + OptionsService.get_internal_option('municipality') + "/";
    }

    var urlstring = start_path + 'search/' + qry + "";
  	$location.path(urlstring);
  };

  $scope.nextPage = function() {
    if ($scope.busy) { return; }

    $scope.busy = true;

    console.log('should load the next page now!');
    SearchService.next_page().then(function (data) {
      $scope.results = SearchService.get_results();

      if (data) {
        $scope.meta = SearchService.get_meta();
        console.log('current results after data: ');
        console.dir($scope.results);
      }

      $scope.busy = false;
    });

  };

  $scope.updateOptions = function () {
    console.log('Should update options now!');
    var collections = $scope.municipalities_full.filter(function (o) {
      return o.active; }).map(function (o) { return o.meta.collection; });
    var doc_types = $scope.doc_types_full.filter(function (o) {
      return o.active; }).map(function (o) { return o.term; });
    console.log('Active collections:');
    console.dir(collections);
    console.log('Active types:');
    console.dir(doc_types);
    OptionsService.set_filter_terms('collection', collections);
    OptionsService.set_filter_terms('types', doc_types);
    OptionsService.set_filter('start_date', {
      "from": $scope.date.usermin + "-01-01",
      "to": $scope.date.usermax + "-12-31"
    });
    console.log('Options after adjustment of filters:');
    console.dir(OptionsService.get_options());
    console.log('Should perform new search now!');
    SearchService.first_page().then(function (data) {
      console.log('Search service got some data!');
      $scope.results = SearchService.get_results();
      $scope.meta = SearchService.get_meta();
      console.dir($scope.results);
      $.each($scope.doc_types_full, function (idx, item) {
        item.count = SearchService.get_facet_count_for_term('types', item.term);
      });
      $.each($scope.municipalities_full, function (idx, item) {
        item.count = SearchService.get_facet_count_for_term('collection', item.meta.collection);
      });

      var start_path = "";
      if (OptionsService.get_internal_option('single_mode')) {
        start_path = "g/" + OptionsService.get_internal_option('municipality') + "/";
      }
      $location.path(start_path + "search/" + SearchService.get_query() + "/options/" + OptionsService.get_options_b64());
    });
  };
}]);
