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
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl',
    resolve: {
      perform: ['$route', 'SearchService', '$q',
      function ($route, SearchService, $q) {
        // var defer = $q.defer();
        var query = $route.current.params.query;
        SearchService.set_query(query);
        // var page = $route.current.params.page;
        // SearchService.search(query, page).then(function (result) {
        //   console.log('Got data for ' + query);
        //   SearchService.set_results(result.data);
        //   defer.resolve(result);
        // }, function (error) {
        //   console.log('There was en error getting the data for ' + query);
        //   defer.resolve(error);
        // });
        // return defer.promise;
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

.factory("SearchService", ['ORIAPIService', function (ORIAPIService) {
  var svc = {};
  var results = {};
  var query;

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
    return ORIAPIService.simple_search(query);
  }

  return svc;
}])

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'SearchService',
function($scope, $location, ORIAPIService, SearchService) {
  $scope.query = SearchService.get_query();

  console.log('Initializing search controller : ' + $scope.query + ' : ' + $location.absUrl());
  if ($scope.query) {
    $scope.results = SearchService.get_results();
  }

  $scope.search = function(query) {
    var qry = query || $scope.query || SearchService.get_query();

    console.log('should search for ' + qry + ' now!');

    var urlstring = 'search/' + qry + "/page/1";
  	$location.path(urlstring);
  };

}]);
