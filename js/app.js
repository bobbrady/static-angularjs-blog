/**
 * Main AngularJS Web Application
 */
var app = angular.module('bradyThinkApp', [
	'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		// Home
		.when("/", {
			templateUrl: "partials/home.html",
			controller: "HomeCtrl"
		})
		// Pages
		.when("/about", {
			templateUrl: "partials/about.html",
			controller: "AboutCtrl"
		})
		.when("/:category", {
			templateUrl: function(parameters) {
				return 'partials/' + parameters.category + '.html';
			},
			controller: "CategoryCtrl"
		})
		// else 404
		.otherwise("/404", {
			templateUrl: "partials/404.html",
			controller: "PageCtrl"
		});
	$locationProvider.html5Mode(true);
}]);

app.controller('HomeCtrl', ['$scope', '$http', 'MetaData', function($scope, $http, MetaData) {
	MetaData.setTitle('BradyThink');
	MetaData.setDescription('BradyThink Blog Home Description');
	$http.get('data/posts.json').success(function(data) {
		$scope.posts = data;
	});
}]);

app.controller('AboutCtrl', ['$scope', 'MetaData', function($scope, MetaData) {
	MetaData.setTitle('About');
	MetaData.setDescription('BradyThink Blog About Description');
}]);

app.controller('CategoryCtrl', ['$sce', '$scope', '$routeParams', '$http', 'MetaData',
	function($sce, $scope, $routeParams, $http, MetaData) {
		$http.get('data/' + $routeParams.category + '.json').success(function(data) {
			MetaData.setTitle(data.title);
			MetaData.setDescription(data.description);
		});
		$http.get('data/' + $routeParams.category + '.html').success(function(data) {
			$scope.foo = $sce.trustAsHtml(data);
		});
	}
]);

app.controller('MetaController', ['$scope', 'MetaData', function($scope, MetaData) {
	$scope.MetaData = MetaData;
}]);

app.service('MetaData', function() {
	var title = 'BradyThink';
	var description = 'BradyThink Blog';
	return {
		title: function() {
			return title;
		},
		setTitle: function(newTitle) {
			title = newTitle;
		},
		description: function() {
			return description;
		},
		setDescription: function(newDescription) {
			description = newDescription;
		}
	};
});