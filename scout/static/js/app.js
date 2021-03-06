(function () {

	'use strict';

	scout.app = angular.module('scout', ['ui.map'])
		.run(function () {
			console.log('Scout application module running...');
		}).config(function ($interpolateProvider){
			$interpolateProvider.startSymbol('[[').endSymbol(']]');
		}).controller('MapCtrl', ['$scope', function($scope) {

			var geocoder = new google.maps.Geocoder(),
				bounds = new google.maps.LatLngBounds();

			$scope.myMarkers = [];

			$scope.mapOptions = {
				center: new google.maps.LatLng(54.5104237, -2.6434287),
				mapTypeControl: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			$scope.openMarkerInfo = function(marker) {
				$scope.currentMarker = marker;
				$scope.currentMarkerLat = marker.getPosition().lat();
				$scope.currentMarkerLng = marker.getPosition().lng();
				$scope.myInfoWindow.open($scope.myMap, marker);
			};

			$scope.onMapIdle = function () {
				if ($scope.myMarkers.length === 0) {
					// load each of the existing markers
					angular.forEach(scout.markers, function (marker) {
						var icon = new google.maps.MarkerImage("https://maps.google.com/mapfiles/ms/icons/" + marker.marker_colour + ".png");
						if (marker.address) {
							geocoder.geocode({'address': marker.address}, function (results, status) {
								if (status == google.maps.GeocoderStatus.OK) {
									var gmarker = new google.maps.Marker({
										map: $scope.myMap,
										position: results[0].geometry.location,
										icon: icon,
										name: marker.name,
										url: '/properties/edit/' + marker.id + '/'
									});
									$scope.myMarkers.push(gmarker);
									bounds.extend(gmarker.position);
									$scope.myMap.fitBounds(bounds);
								} else {
									console.log("Geocode was not successful for the following reason: " + status);
								}
							});
						} else if (marker.lat && marker.long) {
							var gmarker = new google.maps.Marker({
								map: $scope.myMap,
								position: new google.maps.LatLng(marker.lat, marker.long),
								icon: icon,
								name: marker.name,
								url: '/markers/edit/' + marker.id + '/'
							});
							$scope.myMarkers.push(gmarker);
							bounds.extend(gmarker.position);
							$scope.myMap.fitBounds(bounds);
						}
					})
				}
			}

		}]);

	window.onGoogleReady = function () {
		angular.bootstrap(document.body, ['scout']);
	};

}());