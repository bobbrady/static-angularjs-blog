/**
 * Main AngularJS Web Application
 */
var app = angular.module('bradyThinkApp', [
	'ngRoute', 'ui.bootstrap'
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
				return 'partials/category.html';
			},
			controller: "CategoryCtrl"
		})
		.when("/:category/:slug", {
			templateUrl: function(parameters) {
				return 'partials/post.html';
			},
			controller: "PostCtrl"
		})
		// else 404
		.otherwise("/404", {
			templateUrl: "partials/404.html",
			controller: "PageCtrl"
		});
	$locationProvider.html5Mode(true);
}]);

app.filter('offset', function() {
	return function(input, start) {
		if (!input || !input.length) {
			return;
		}
		start = +start; //parse to int
		return input.slice(start);
	};
});

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

app.controller('CategoryCtrl', ['$sce', '$scope', '$routeParams', '$http', 'MetaData', '$filter',
	function($sce, $scope, $routeParams, $http, MetaData, $filter) {
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;
		$scope.maxSize = 5;

		$http.get('data/' + $routeParams.category + '/category.json').success(function(data) {
			MetaData.setTitle(data.metaTitle);
			MetaData.setDescription(data.metaDescription);
			$scope.category = data;
		});

		$http.get('data/' + $routeParams.category + '/posts.json').success(function(data) {
			$scope.posts = data;
			$scope.totalItems = $scope.posts.length;
		});
	}
]);

app.controller('PostCtrl', ['$sce', '$scope', '$routeParams', '$http', 'MetaData',
	function($sce, $scope, $routeParams, $http, MetaData) {
		$http.get('data/' + $routeParams.category + '/posts.json').success(function(data) {
			data.some(function(post) {
				if (post.slug === $routeParams.slug) {
					MetaData.setTitle(post.metaTitle);
					MetaData.setDescription(post.metaDescription);
					$scope.post = post;
					return true;
				}
			});
		});
		$http.get('data/' + $routeParams.category + '/' + $routeParams.slug + '.html').success(function(data) {
			$scope.content = $sce.trustAsHtml(data);
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