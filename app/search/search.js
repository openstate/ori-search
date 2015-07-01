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
      perform: ['$route', 'ORIAPIService', 'ResultsService', '$q',
      function ($route, ORIAPIService, ResultsService, $q) {
        var defer = $q.defer();
        var query = $route.current.params.q;
        var page = $route.current.params.page;
        ResultsService.set_query(query);
        ORIAPIService.simple_search(query).then(function (result) {
          console.log('Got data for ' + query);
          ResultsService.set_results(result.data);
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
    if (val in allowed) {
      return val
    } else {
      return allowed[0];
    }
  };
})

.controller('SearchCtrl', ['$scope', '$location', 'ORIAPIService', 'ResultsService',
function($scope, $location, ORIAPIService, ResultsService) {
  $scope.query = ResultsService.get_query();
  $scope.results = ResultsService.get_results();

  $scope.search = function() {
    console.log('should search for ' + $scope.query + ' now!');

    var urlstring = 'search/' + $scope.query + "/page/1";
  	$location.path(urlstring);
  };

}]);
