'use strict';

var defered_resolver = {
  perform: ['$route', 'ConstantsService', 'OptionsService', 'SearchService', '$q',
  function ($route, ConstantsService, OptionsService, SearchService, $q) {
    var defer = $q.defer();

    console.log('performing resolve for search page');
    ConstantsService.get_promise().then(function(data) {
      console.log('Getting to the first then of the search!');
      var municipality = $route.current.params.municipality;
      if (typeof(municipality) != 'undefined') {
        return ConstantsService.load_classifications_for_municipality(municipality);
      } else {
        return ConstantsService.load_classifications();
      }
    }).then(function (data) {
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

      var search_base_filters = {
        size: 0
      };

      var search_promise = $q.all([
        SearchService.search(query, page, options)
      ]);

      search_promise.then(function (result) {
        //console.log('Got data for ' + query + ' for page ' + page);
        //SearchService.set_results(result.data);
        console.log('Full search defered promise is finally done!');
        defer.resolve(result);
      }, function (error) {
        console.log('There was en error getting the data for ' + query);
        defer.resolve(error);
      });
    });

    return defer.promise;
  }]
};

angular.module('oriApp.search', ['ngRoute', 'chart.js', 'daterangepicker'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
  }).
  when('/options/:options', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
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
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
  }).
  when('/g/:municipality/options/:options', {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: defered_resolver
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

.filter("date_slider_as_string", function () {
  return function (val) {
    return new Date(val).toLocaleString();
  };
})

.filter("clear_highlight", function () {
  return function(val) {
    return val.replace('<em>', '').replace('</em>', '');
  };
})

.filter("add_ellipses", function () {
  return function(val) {
    return '&hellip;' + val + '&hellip;';
  };
})

.filter("highlight_in_full_string", function () {
  return function (val, highlight_for_field) {
    if (typeof(highlight_for_field) !== 'undefined') {
      var normalized_highlight = highlight_for_field.replace('<em>', '').replace('</em>', '');
      return val.replace(normalized_highlight, highlight_for_field);
    } else {
      return val;
    }
  };
})

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

.filter('unsafe', ['$sce', function($sce) {
  return $sce.trustAsHtml;
}])

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
      return '';
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
  var classifications = [];

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

  svc.base_search = function(options) {
    return ORIAPIService.simple_search(undefined, 1, options).then(function (result) {
      classifications = result.data.facets.classification.terms.map(function (t) { return t.term; });
    });
  };

  svc.get_classifications = function () {
    return classifications;
  };

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

      for (var idx in tmp_results) {
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
  $scope.sort = '_score';
  $scope.order = 'desc';

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
  $scope.classifications = ConstantsService.get_classifications();
  $scope.classifications_full = [];
  $scope.min_date = new Date(2006, 0, 1).valueOf();
  $scope.max_date = new Date().valueOf(); // FIXME: should be larger than this

  $scope.date = {
    startDate: $scope.min_date,
    endDate: $scope.max_date
  };

  $scope.dateOpts = {
    linkedCalendars: false,
    locale: {
      applyClass: 'btn-green',
      applyLabel: "Kiezen",
      fromLabel: "Van",
      //format: "YYYY-MM-DD",
      format: "D MMM YYYY",
      toLabel: "Tot",
      cancelLabel: 'Annuleren',
      customRangeLabel: 'Ander interval'
    },
    ranges: {
      'Afgelopen 7 Dagen': [moment().subtract(6, 'days'), moment()],
      'Afgelopen 30 Dagen': [moment().subtract(29, 'days'), moment()]
    },
    eventHandlers: {
      'apply.daterangepicker': function(ev, picker) {
        $scope.updateOptions();
      }
    }
  };

  $scope.ylabels = [];
  $scope.yseries = ['Documenten'];
  $scope.ydata = [[]];

  console.log('Initializing search controller : ' + $scope.query + ' : ' + $location.absUrl());
  console.dir(OptionsService.get_options());

  if ($scope.municipalities) {
    if (OptionsService.get_options() === undefined) {
      console.log('We should set default options now!');
      console.dir(ConstantsService.get_municipalities());
      OptionsService.set_default_options();
    }

    $scope.results = SearchService.get_results();
    $scope.meta = SearchService.get_meta();
    $scope.options = SearchService.get_options();
    $scope.single_mode = OptionsService.get_internal_option('single_mode');
    $scope.municipality = OptionsService.get_internal_option('municipality');
    $scope.busy = false;
    $scope.facets = SearchService.get_facets();
    console.log('get options before sort:');
    console.dir(OptionsService.get_options());
    $scope.sort = OptionsService.get_option('sort');
    $scope.order = OptionsService.get_option('order');

    console.log('classifications:');
    console.dir($scope.classifications);
    for (var classification in $scope.classifications) {
      $scope.classifications_full.push({
        term: $scope.classifications[classification],
        label: $scope.classifications[classification],
        active: ($.inArray($scope.classifications[classification], $scope.options.filters.classification.terms) >= 0),
        count: SearchService.get_facet_count_for_term('classification', $scope.classifications[classification])
      });
    }

    for (var doc_type in $scope.doc_types) {
      $scope.doc_types_full.push({
        term: doc_type,
        label: $scope.doc_types[doc_type],
        active: ($.inArray(doc_type, $scope.options.filters.types.terms) >= 0),
        count: SearchService.get_facet_count_for_term('types', doc_type)
      })
    }

    var start_date_range = OptionsService.get_filter('start_date');
    $scope.date = {
      startDate: Date.parse(start_date_range.from),
      endDate: Date.parse(start_date_range.to)
    };

    var year_facet = SearchService.get_facet('start_date').entries;
    console.log('start date facet entries:');
    console.dir(year_facet);
    console.log('start date interval' + OptionsService.get_facet_option('start_date', 'interval'));

    var date_formats = {
      day: 'D MMM YYYY',
      week: 'W / YYYY',
      month: 'MMM YYYY',
      year: 'YYYY'
    };
    var date_prefixes = {
      day: '',
      week: 'wk ',
      month: '',
      year: ''
    };
    var date_interval = OptionsService.get_facet_option('start_date', 'interval');

    $scope.ylabels = year_facet.map(function (i) { return date_prefixes[date_interval] + moment(i.time).format(date_formats[date_interval]); });
    $scope.ydata = [year_facet.map(function (i) {return i.count; })];
  }

  $scope.sidebar_visible = function() {
    return OptionsService.get_internal_option('sidebar_visible');
  };

  $scope.clear_highlight = function(val) {
    return val.replace('<em>', '').replace('</em>', '');
  };

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

  $scope.clear_period = function() {
    $scope.date = {
      startDate: $scope.min_date,
      endDate: $scope.max_date
    };
    $scope.updateOptions();
  };

  $scope.toggle_classifications = function() {
    console.log('Deselect all clicked!');
    for (var c in $scope.classifications_full) {
      $scope.classifications_full[c].active = !$scope.classifications_full[c].active;
    }
    $scope.updateOptions();
  };

  $scope.updateOptions = function () {
    console.log('Should update options now!');
    var collections = $scope.municipalities_full.filter(function (o) {
      return o.active; }).map(function (o) { return o.meta.collection; });
    var doc_types = $scope.doc_types_full.filter(function (o) {
      return o.active; }).map(function (o) { return o.term; });
    var classifications = $scope.classifications_full.filter(function (o) {
      return o.active; }).map(function (o) { return o.term; });
    console.log('Active collections:');
    console.dir(collections);
    console.log('Active types:');
    console.dir(doc_types);
    console.log('Active classifications:');
    console.dir(classifications);
    OptionsService.set_filter_terms('collection', collections);
    OptionsService.set_filter_terms('types', doc_types);
    OptionsService.set_filter_terms('classification', classifications);
    OptionsService.set_filter('start_date', {
      "from": new Date($scope.date.startDate).toISOString(),
      "to": new Date($scope.date.endDate).toISOString()
    });

    var date_diff = moment.duration($scope.date.endDate - $scope.date.startDate);
    console.log('date diff : ' + date_diff);

    var max_window = 15;
    if (date_diff < moment.duration(max_window, 'days')) {
      OptionsService.set_facet_option('start_date', 'interval', 'day');
    } else if (date_diff < moment.duration(max_window, 'weeks')) {
      OptionsService.set_facet_option('start_date', 'interval', 'week');
    } else if (date_diff < moment.duration(max_window, 'months')) {
      OptionsService.set_facet_option('start_date', 'interval', 'month');
    } else {
      OptionsService.set_facet_option('start_date', 'interval', 'year');
    }

    OptionsService.set_option('sort', $scope.sort);
    OptionsService.set_option('order', $scope.order);
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
      $.each($scope.classifications_full, function (idx, item) {
        item.count = SearchService.get_facet_count_for_term('classification', item.term);
      });

      var start_path = "";
      if (OptionsService.get_internal_option('single_mode')) {
        start_path = "g/" + OptionsService.get_internal_option('municipality') + "/";
      }

      if (SearchService.get_query() !== undefined) {
        $location.path(start_path + "search/" + SearchService.get_query() + "/options/" + OptionsService.get_options_b64());
      } else {
        $location.path(start_path + "options/" + OptionsService.get_options_b64());
      }
    });
  };

  $scope.filter_on_classification = function(ev) {
    console.log('A classification was clicked:');
    console.dir($(ev.target).text());
    var selected_classification = $(ev.target).text();
    $scope.classifications_full.forEach(function (c) {
      c.active = (c.term == selected_classification);
    });
    $scope.updateOptions();
  };
}]);
