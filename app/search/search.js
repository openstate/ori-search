'use strict';

angular.module('oriApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    redirectTo: '/search/een/page/1'
  }).
  when('/search/:q', {
    redirectTo: '/search/:q/page/1'
  }).
  when('/search/:q/page/:page',  {
    templateUrl: 'search/search.html',
    controller: 'SearchCtrl',
    resolve: {
      perform: ['$route', 'ORIAPIService', 'SearchService', '$q',
      function ($route, ORIAPIService, SearchService, $q) {
        var defer = $q.defer();
        var query = $route.current.params.q;
        var page = $route.current.params.page;
        SearchService.set_query(query);
        ORIAPIService.simple_search(query).then(function (result) {
          console.log('Got data for ' + query);
          SearchService.set_results(result.data);
          defer.resolve(result);
        }, function (error) {
          console.log('There was en error getting the data for ' + query);
          defer.resolve(error);
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

.factory("SearchService", [function () {
  var svc = {};
  var results = {};
  var query = null;

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

  return svc;
}])

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'SearchService',
function($scope, $location, ORIAPIService, SearchService) {
  $scope.query = SearchService.get_query();
  $scope.results = SearchService.get_results();

  $scope.search = function() {
    console.log('should search for ' + $scope.query + ' now!');

    var urlstring = 'search/' + $scope.query + "/page/1";
  	$location.path(urlstring);
  };

}]);
