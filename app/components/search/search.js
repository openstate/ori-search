'use strict';

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    redirectTo: '/search/een/page/1'
  }).
  when('/search/:query', {
    redirectTo: '/search/:q/page/1'
  }).
  when('/search/:query/page/:page',  {
    templateUrl: 'components/search/search.html',
    controller: 'SearchCtrl',
    resolve: {
      perform: ['$route', 'ConstantsService', 'SearchService', '$q',
      function ($route, ConstantsService, SearchService, $q) {
        var defer = $q.defer();

        console.log('performing resolve for search page');
        ConstantsService.get_promise().then(function (data) {
          console.log('all constants data was retrieved!');
          var query = $route.current.params.query;
          var page = $route.current.params.page;
          SearchService.set_query(query);
          SearchService.set_page(page);
          console.log('requesting data for ' + query + ' for page ' + page);
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
    }
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
    } else {
      return "images/" + val.gender.toLowerCase() + ".svg";
    }
  };
})

.factory("SearchService", ['ORIAPIService', function (ORIAPIService) {
  var svc = {};
  var results = {};
  var query;
  var page;

  svc.set_page = function (p) {
    page = p;
  }

  svc.get_page = function() {
    return page;
  }

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
    return ORIAPIService.simple_search(query, page);
  }

  svc.next_page = function() {
    return svc.search(query, ++page);
  }

  return svc;
}])

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'SearchService',
function($scope, $location, ORIAPIService, SearchService) {
  $scope.query = SearchService.get_query();
  $scope.results = {};
  $scope.meta = {took: 0, total: 0};
  $scope.busy = true;

  console.log('Initializing search controller : ' + $scope.query + ' : ' + $location.absUrl());
  if ($scope.query) {
    //$scope.results = SearchService.get_results();
    $scope.busy = false;
  }

  $scope.search = function(query) {
    var qry = query || $scope.query || SearchService.get_query();

    console.log('should search for ' + qry + ' now!');

    var urlstring = 'search/' + qry + "/page/1";
  	$location.path(urlstring);
  };

  $scope.nextPage = function() {
    if ($scope.busy) { return; }

    $scope.busy = true;

    console.log('should load the next page now!');
    SearchService.next_page().then(function (data) {
      console.log('get next page data:');
      console.dir(data);
      console.log('current results :');
      console.dir($scope.results);
      $scope.meta = data.data.meta;

      for (var tp in data.data) {
        if (tp != 'meta') {
          for (var item in data.data[tp]) {
            var tmp_item = data.data[tp][item];
            $scope.results[tmp_item.id] = tmp_item;
          }
        }
      }

      console.log('current results after data: ');
      console.dir($scope.results);

      $scope.busy = false;
    });
  };
}]);
