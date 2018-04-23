E4801.home = function (params) {
    "use strict";

    var viewModel = {
        lat: ko.observable(40.749825),
        lng: ko.observable(-73.987963),
        directionsService: null,
        stepDisplay: null,
        markerArray: [],
        routeArray: [],

        markers: ko.observableArray([
               {
                   location: { lat: 40.7497066, lng: -73.9915582 },
                   tooltip: 'penn station, new york, ny'
               },
               {
                   location: { lat: 40.7293785, lng: -74.0052111 },
                   tooltip: '260 Broadway New York NY 10007'
               }
        ]),

        routes: ko.observableArray([
                {
                    locations: [
                         { lat: 40.7497066, lng: -73.99155828 },
                         { lat: 40.7293785, lng: -74.0052111 }
                    ]
                }
        ]),

        addressesStart: [
          { value: "penn station, new york, ny", name: "Penn Station" },
          { value: "grand central station, new york, ny", name: "Grand Central Station" },
          { value: "625 8th Avenue New York NY 10018", name: "Port Authority Bus Terminal" },
          { value: "staten island ferry terminal, new york, ny", name: "Staten Island Ferry Terminal" },
          { value: "101 E 125th Street, New York, NY", name: "Harlem - 125th St Station" }
        ],

        addressesEnd: [
            { value: "260 Broadway New York NY 10007", name: "City Hall" },
            { value: "W 49th St & 5th Ave, New York, NY 10020", name: "Rockefeller Center" },
            { value: "moma, New York, NY", name: "MOMA" },
            { value: "350 5th Ave, New York, NY, 10118", name: "Empire State Building" },
            { value: "253 West 125th Street, New York, NY", name: "Apollo Theatre" },
            { value: "1 Wall St, New York, NY", name: "Wall St" }
        ],

        mapReadyAction: function (s) {
            var map = s.component;

            viewModel.directionsService = new google.maps.DirectionsService();

            // Instantiate an info window to hold step text.
            viewModel.stepDisplay = new google.maps.InfoWindow();
        },

        calcRoute: function () {
            viewModel.markerArray = [];
            viewModel.routeArray = [];

            // Retrieve the start and end locations and create a DirectionsRequest using WALKING directions.
            var startPoint = $("#start").dxLookup("instance").option('value');
            var endPoint = $("#end").dxLookup("instance").option('value');

            var request = {
                origin: startPoint,
                destination: endPoint,
                travelMode: google.maps.TravelMode.WALKING
            };

            // Route the directions and pass the response to a function to create markers for each step.
            viewModel.directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var warnings = document.getElementById("warnings_panel");
                    warnings.innerHTML = "" + response.routes[0].warnings + "";
                    viewModel.showSteps(response);
                }
            });
        },

        showSteps: function (directionResult) {
            var LIMIT_ON_DIRECTION = 10;

            // For each step, place a marker and route. Also attach the marker to an array so we
            // can keep track of it and remove it when calculating new routes.
            var myRoute = directionResult.routes[0].legs[0];
            var routesCounter = 0;
           
            for (var i = 0; i < myRoute.steps.length; i++) {

                var marker = {
                    location: {
                        lat: myRoute.steps[i].start_point.lat(),
                        lng: myRoute.steps[i].start_point.lng()
                    },
                    tooltip: myRoute.steps[i].instructions
                };

                //check max waypoints per direction
                if (viewModel.routeArray[routesCounter] && viewModel.routeArray[routesCounter].locations.length >= LIMIT_ON_DIRECTION - 1) {
                    viewModel.routeArray[routesCounter].locations.push(marker.location);
                    routesCounter++;
                }

                if (!viewModel.routeArray[routesCounter]) {
                    viewModel.routeArray.push({
                        request: { travelMode: "WALKING" },
                        locations: []
                    });
                }

                viewModel.routeArray[routesCounter].locations.push(marker.location);
                viewModel.markerArray[i] = marker;

            };
            // re-draw markers 
           
            viewModel.markers(viewModel.markerArray);
            viewModel.routes(viewModel.routeArray);
        }
    };

    return viewModel;
};