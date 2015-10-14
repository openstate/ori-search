'use strict';

angular.module('oriApp.viernulvier', ['ngRoute']).

controller('vierNulVierCtrl', ['$scope', '$location',
		function ($scope, $location) {
			// QueryService.clearQuery();
			// QueryService.clearFilterOptions();
			$scope.usedPage = false;

			var path = 	$location.path().split("/");
			var pageLoc = path.indexOf('page');

			if(pageLoc > -1){
				$scope.usedPage = true;
				path.splice(pageLoc, 2);
				$scope.newUrl = '#' + path.join('/');
			}
}]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise(
    {
      templateUrl: 'components/viernulvier/viernulvier.html',
      controller: 'vierNulVierCtrl'
    }
  );
}]);
