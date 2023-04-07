DxSample.Index = function (params) {


    function ViewModel() {
        var viewModel = this;

        var directionsService;
        var stepDisplay;
        var markerArray = [];
        var routeArray = [];

        viewModel.viewShown = function () {
            // Instantiate a directions service.
            var map = $('#view-port #map').dxMap('instance');
            map._initMap().done(function () {
                directionsService = new google.maps.DirectionsService();

                // Instantiate an info window to hold step text.
                stepDisplay = new google.maps.InfoWindow();
            });
        }

        //function calcRoute() {
        viewModel.calcRoute = function () {
            markerArray = [];
            routeArray = [];

            // Retrieve the start and end locations and create a DirectionsRequest using WALKING directions.
            var startPoint = $("#start").dxLookup("instance").option('value');
            var endPoint = $("#end").dxLookup("instance").option('value');

            var request = {
                origin: startPoint,
                destination: endPoint,
                travelMode: google.maps.TravelMode.WALKING
            };

            // Route the directions and pass the response to a function to create markers for each step.
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    var warnings = document.getElementById("warnings_panel");
                    warnings.innerHTML = "" + response.routes[0].warnings + "";
                    viewModel.showSteps(response);
                }
            });
        }

        viewModel.showSteps = function (directionResult) {
            var LIMIT_ON_DIRECTION = 8;

            // For each step, place a marker and route. Also attach the marker to an array so we
            // can keep track of it and remove it when calculating new routes.
            var myRoute = directionResult.routes[0].legs[0];
            var routesCounter = 0;

            for (var i = 0; i < myRoute.steps.length; i++) {

                var marker = {
                    location: {
                        lat: myRoute.steps[i].start_point.hb,
                        lng: myRoute.steps[i].start_point.ib
                    },
                    tooltip: myRoute.steps[i].instructions
                };

                //check max waypoints per direction
                if (routeArray[routesCounter] && routeArray[routesCounter].locations.length >= LIMIT_ON_DIRECTION - 1) {
                    routeArray[routesCounter].locations.push(marker.location);
                    routesCounter++;
                }

                if (!routeArray[routesCounter]) {
                    routeArray.push({
                        request: { travelMode: "WALKING" },
                        locations: []
                    });
                }

                routeArray[routesCounter].locations.push(marker.location);
                markerArray[i] = marker;

            };
            // re-draw markers 
            viewModel.mapOptions.markers(markerArray);
            // re-draw routes 
            viewModel.mapOptions.routes(routeArray);
        }

        viewModel.addressesStart = [
           { value: "penn station, new york, ny", name: "Penn Station" },
           { value: "grand central station, new york, ny", name: "Grand Central Station" },
           { value: "625 8th Avenue New York NY 10018", name: "Port Authority Bus Terminal" },
           { value: "staten island ferry terminal, new york, ny", name: "Staten Island Ferry Terminal" },
           { value: "101 E 125th Street, New York, NY", name: "Harlem - 125th St Station" }
        ];

        viewModel.addressesEnd = [
            { value: "260 Broadway New York NY 10007", name: "City Hall" },
            { value: "W 49th St & 5th Ave, New York, NY 10020", name: "Rockefeller Center" },
            { value: "moma, New York, NY", name: "MOMA" },
            { value: "350 5th Ave, New York, NY, 10118", name: "Empire State Building" },
            { value: "253 West 125th Street, New York, NY", name: "Apollo Theatre" },
            { value: "1 Wall St, New York, NY", name: "Wall St" }
        ];

        viewModel.lookupStartOptions = {
            dataSource: viewModel.addressesStart,
            displayExpr: 'name',
            valueExpr: 'value',
            value: 'penn station, new york, ny'
        };

        viewModel.lookupEndOptions = {
            dataSource: viewModel.addressesEnd,
            displayExpr: 'name',
            valueExpr: 'value',
            value: '260 Broadway New York NY 10007',
            valueChangeAction: viewModel.calcRoute
        };

        viewModel.mapOptions = {
            markers: ko.observableArray([
               {
                   location: { lat: 40.7497066, lng: -73.99155819999998 },
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
                         { lat: 40.7497066, lng: -73.99155819999998 },
                         { lat: 40.7293785, lng: -74.0052111 }
                    ]
                }
            ]),
            width: '100%',
            height: '100%',
        };
    }

    return new ViewModel();
};

