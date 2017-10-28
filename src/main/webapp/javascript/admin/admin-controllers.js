var myApp = angular.module("myModule", [ "ui.router", 'chart.js', 'ngAnimate',
        "ui.bootstrap", "ngMaterial", "ngMessages", "infinite-scroll" ]);

/*
 * myApp.config(function (ChartJsProvider) { // Configure all charts
 * ChartJsProvider.setOptions({ colors: ['#97BBCD', '#DCDCDC', '#F7464A',
 * '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] }); // Configure all doughnut
 * charts ChartJsProvider.setOptions('doughnut', { cutoutPercentage: 60 });
 * ChartJsProvider.setOptions('bubble', { tooltips: { enabled: false } }); });
 */

var dashboardController = function($scope, $rootScope, $uibModal, APIService) {
    $rootScope.home = true;
    $rootScope.pageTitle = "Dashboard | Nextrr";

    getVisits = function() {
        APIService
                .doApiCall({
                    "req_name" : "getVisits",
                    "params" : {}
                })
                .success(
                        function(data) {
                            data.result = data.result.reverse();
                            $scope.visits = data.result;

                            // Pagination logic for movies.
                            $scope.filteredTodos = []
                            $scope.currentPage = 1
                            $scope.numPerPage = 10
                            $scope.maxSize = 5;

                            $scope.numPages = function() {
                                return Math.ceil($scope.visits.length
                                        / $scope.numPerPage);
                            };
                            $scope
                                    .$watch(
                                            'currentPage + numPerPage',
                                            function() {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin
                                                        + $scope.numPerPage;
                                                $scope.filteredVisits = $scope.visits
                                                        .slice(begin, end);
                                            });
                        });
    }
    getVisits();

    // reference -- http://jtblin.github.io/angular-chart.js/
    $scope.colors = [ "rgba(159,204,0,0.5)", "rgba(250,109,33,0.7)",
            "rgba(154,154,154,0.5)" ];
    $scope.labels = [ "Green", "Orange", "Grey" ];
    $scope.data = [ 300, 500, 100 ];
    /*
     * $scope.labels = ["January", "February", "March", "April", "May", "June",
     * "July"]; $scope.series = ['Series A', 'Series B'];
     */
    $scope.data = [ [ 65, 59, 80, 81, 56, 55, 40 ],
            [ 28, 48, 40, 19, 86, 27, 90 ] ];
    $scope.onClick = function(points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [ {
        yAxisID : 'y-axis-1'
    }, {
        yAxisID : 'y-axis-2'
    } ];
    $scope.options = {
        scales : {
            yAxes : [ {
                id : 'y-axis-1',
                type : 'linear',
                display : true,
                position : 'left'
            }, {
                id : 'y-axis-2',
                type : 'linear',
                display : true,
                position : 'right'
            } ]
        }
    };

    $scope.donutColors = [ "rgba(0,3,255,0.9)", "rgba(0,3,158,0.9)",
            "rgba(232,135,0,0.9)", "rgba(255,0,0,0.9)", "rgba(85,196,0,0.9)" ];
    $scope.donutLabels = [ "Australia", "USA", "India", "England",
            "South Africa" ];
    $scope.donutData = [ 300, 500, 1000, 200, 150 ];

    $scope.modalParams = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
    $scope.limitLetters = '470';

    $scope.HBlabels = [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ];
    $scope.HBseries = [ 'Series A', 'Series B' ];

    $scope.HBdata = [ [ 65, 59, 80, 81, 56, 55, 40 ],
            [ 28, 48, 40, 19, 86, 27, 90 ] ];

    $scope.seeMore = function(content_length) {
        $scope.limitLetters = content_length;
    }

    $scope.open = function(_nothing) {
        var modalInstance = $uibModal.open({
            controller : "ModalInstanceCtrl",
            templateUrl : 'myModalContent.html',
            resolve : {
                nothing : function() {
                    return _nothing;
                }
            }
        });
    };

}

var navbarController = function($scope, $rootScope) {
    $rootScope.isNavCollapsed = true;
    $scope.isCollapsed = true;
    $scope.isCollapsedHorizontal = true;

    /* Menu-toggle */
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("active");
    });
}

var editMoviesController = function($scope, APIService, $http, $mdConstant) {

    var getMoviesToEdit = function() {
        APIService
                .doApiCall({
                    "req_name" : "getMoviesToEdit",
                    "params" : {},
                })
                .success(
                        function(data) {
                            if (data != undefined && data != null) {
                                for (i = 0; i < data.movieList.length; i++) {
                                    data.movieList[i].releaseDate = new Date(
                                            data.movieList[i].releaseDate);
                                }
                            }

                            $scope.movieTypes = data.movieTypes.result;
                            $scope.movies = data.movieList;

                            // Pagination logic for movies.
                            $scope.filteredTodos = []
                            $scope.currentPage = 1
                            $scope.numPerPage = 10
                            $scope.maxSize = 5;

                            $scope.numPages = function() {
                                return Math.ceil($scope.movies.length
                                        / $scope.numPerPage);
                            };
                            $scope
                                    .$watch(
                                            'currentPage + numPerPage',
                                            function() {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin
                                                        + $scope.numPerPage;
                                                $scope.filteredMovies = $scope.movies
                                                        .slice(begin, end);
                                            });
                        });
    }
    getMoviesToEdit();

    $scope.setMovie = function(movie) {
        APIService.doApiCall({
            "req_name" : "setMovie",
            "params" : {
                "movieName" : movie.movieName,
                "releaseDate" : movie.releaseDate,
                "cast" : movie.cast,
                "trailer" : movie.trailer,
                "movieType" : movie.movieType
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Created Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            getMoviesToEdit();
        });
    }

    $scope.removeMovie = function(movie) {
        if (movie.isDelete) {
            APIService.doApiCall({
                "req_name" : "removeMovie",
                "params" : {
                    "movieId" : movie.movieId
                }
            }).success(function(data) {
                if (data != null || data != "") {
                    $scope.alerts = [ {
                        type : 'success',
                        msg : 'Nice! Record Removed Successfully.'
                    } ];
                } else {
                    $scope.alerts = [ {
                        type : 'warning',
                        msg : 'Oops! There seems to be some error.'
                    } ];
                }
                getMoviesToEdit();
            });
        } else {
            $scope.alerts = [ {
                type : 'danger',
                msg : 'No Row Selected'
            } ];
        }
    }

    $scope.closeAlert = function() {
        $scope.alerts = "";
    }

    $scope.seperatorKeys = [ $mdConstant.KEY_CODE.ENTER,
            $mdConstant.KEY_CODE.COMMA ];
    $scope.addMultipleChips = function(chip, model, index) {
        var seperatedString = angular.copy(chip);
        seperatedString = seperatedString.toString();
        var chipsArray = seperatedString.split(', ');
        console.log(chipsArray);
        angular.forEach(chipsArray, function(chipToAdd) {
            /* $scope[model][index].cast.push(chipToAdd); */
            $scope[model][index - 1].cast.push(chipToAdd);
        });
        return null;
    };

    $scope.updateMovie = function(movie) {
        APIService.doApiCall({
            "req_name" : "updateMovie",
            "params" : {
                "movieName" : movie.movieName,
                "releaseDate" : movie.releaseDate,
                "cast" : movie.cast,
                "trailer" : movie.trailer,
                "movieId" : movie.movieId,
                "movieType" : movie.movieType
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Updated Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            getMoviesToEdit();
        });
    }

    $scope.openDatePicker = function($event, f1) {
        $event.preventDefault();
        $event.stopPropagation();
        f1.opened = true;
    };

    $scope.dateOptions = {
        formatYear : 'yy',
        startingDay : 1, // shows which day of the week to pre-select on
                            // opening the datepicker
    };

    $scope.format = 'dd/MMMM/yyyy';

    // Time picker
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;

    $scope.addNew = function() {
        $scope.movies.push({
            addBtn : true,
            cast : []
        });
    };
}

var editCricketController = function($scope, APIService, $http, $uibModal,
        $stateParams) {

    addNewSeries = false;
    $scope.addNewSeries = addNewSeries;

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name" : "getCricketCountries",
            "params" : {}
        }).success(function(data) {
            $scope.teams = data;
        });
    }

    getCricketSeries = function() {
        APIService.doApiCall({
            "req_name" : "getAllRawCricketLeagues",
            "params" : {}
        }).success(function(data) {
            $scope.seriesList = data.result;
        });
    }
    getCricketSeries();

    $scope.addCricketSeries = function() {
        addNewSeries = !addNewSeries;
        $scope.addNewSeries = addNewSeries;
    }

    $scope.deleteCricketLeague = false;

    $scope.addRemoveCricketLeague = function(cricketLeague, isDelete) {
        if (isDelete) {
            APIService.doApiCall({
                "req_name" : "addRemoveSportsLeague",
                "params" : {
                    "sports_league_id" : cricketLeague.series_id,
                    "sports_type_id" : "CRICKET"
                }
            }).success(function(data) {
                getCricketSeries();
                $scope.deleteCricketLeague = false;
            });
        } else {
            APIService.doApiCall({
                "req_name" : "addRemoveSportsLeague",
                "params" : {
                    "series_name" : cricketLeague.series,
                    "series_location" : cricketLeague.series_location,
                    "sports_type_id" : "CRICKET",
                    "series_from_date" : cricketLeague.series_from_date,
                    "series_to_date" : cricketLeague.series_to_date,
                    "country_with" : cricketLeague.country_with
                }
            }).success(function(data) {
                getCricketSeries();
                $scope.cricketLeague = "";
            });
        }
    }

    updateCricketSeries = function() {
        APIService.doApiCall({
            "req_name" : "updateCricketSeries",
            "params" : {}
        }).success(function(data) {
            $scope.seriesList = data.result;
        });
    }

    removeCricketSeries = function() {
        APIService.doApiCall({
            "req_name" : "removeCricketSeries",
            "params" : {}
        }).success(function(data) {
            $scope.seriesList = data.result;
        });
    }

    getCricketMatchTypes = function() {
        APIService.doApiCall({
            "req_name" : "getCricketMatchTypes",
            "params" : {}
        }).success(function(data) {
            $scope.matchTypes = data.result;
        });
    }

    getCricketMatchTypes();
    getCricketCountries();

    getIntlCricket = function() {
        APIService
                .doApiCall({
                    "req_name" : "getIntlCricket",
                    "params" : {}
                })
                .success(
                        function(data) {
                            for (i = 0; i < data.result.length; i++) {
                                data.result[i].match_from_date = new Date(
                                        data.result[i].match_from_date);
                                data.result[i].match_to_date = new Date(
                                        data.result[i].match_to_date);
                                data.result[i].time = new Date(
                                        data.result[i].time);
                            }
                            $scope.cricketList = data.result;

                            // Pagination Code for Cricket
                            $scope.filteredTodos = []
                            $scope.currentPage = 1
                            $scope.numPerPage = 10
                            $scope.maxSize = 5;

                            $scope.numPages = function() {
                                return Math.ceil($scope.cricketList.length
                                        / $scope.numPerPage);
                            };
                            $scope
                                    .$watch(
                                            'currentPage + numPerPage',
                                            function() {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin
                                                        + $scope.numPerPage;
                                                $scope.filteredCricketList = $scope.cricketList
                                                        .slice(begin, end);
                                            });
                        });
    }
    getIntlCricket();

    $scope.createCricket = function(cricket) {
        APIService.doApiCall({
            "req_name" : "setCricket",
            "params" : {
                "teamOneId" : cricket.team_one_geoId,
                "teamTwoId" : cricket.team_two_geoId,
                "stadium" : cricket.stadium,
                "city" : cricket.city,
                "matchNumber" : cricket.match_number,
                "country" : cricket.country_geoId,
                "matchType" : cricket.sports_child_type_id,
                "fromDate" : cricket.match_from_date,
                "toDate" : cricket.match_to_date,
                "time" : cricket.time,
                "sports_league" : cricket.series_id
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Created Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            getIntlCricket();
        });
    }

    $scope.updateCricket = function(cricket, $scope) {
        if ("Invalid Date" == cricket.match_to_date) {
            cricket.match_to_date = "N/A";
        }
        APIService.doApiCall({
            "req_name" : "updateCricket",
            "params" : {
                "cricketId" : cricket.cricket_id,
                "teamOneId" : cricket.team_one_geoId,
                "teamTwoId" : cricket.team_two_geoId,
                "stadium" : cricket.stadium,
                "city" : cricket.city,
                "matchNumber" : cricket.match_number,
                "country" : cricket.country_geoId,
                "matchType" : cricket.sports_child_type_id,
                "fromDate" : cricket.match_from_date,
                "toDate" : cricket.match_to_date,
                "time" : cricket.time,
                "sports_league" : cricket.series_id
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Updated Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            getIntlCricket();
        });
    }

    $scope.removeCricket = function(cricket) {
        if (cricket.isDelete) {
            APIService.doApiCall({
                "req_name" : "removeCricket",
                "params" : {
                    "cricketId" : cricket.cricket_id
                }
            }).success(function(data) {
                if (data != null || data != "") {
                    $scope.alerts = [ {
                        type : 'success',
                        msg : 'Nice! Record Deleted Successfully.'
                    } ];
                } else {
                    $scope.alerts = [ {
                        type : 'warning',
                        msg : 'Oops! There seems to be some error.'
                    } ];
                }
                getIntlCricket();
            });
        } else {
            $scope.alerts = [ {
                type : 'danger',
                msg : 'No Row Selected'
            } ];
        }
    }

    $scope.addNew = function() {
        $scope.cricketList.push({
            addBtn : true
        });
    };
}

var editF1Controller = function($scope, $http, APIService, $filter) {

    $scope.myVal = 'submit';
    $scope.coll = {};

    var getFormula1ToEdit = function() {
        APIService
                .doApiCall({
                    "req_name" : "getFormula1ToEdit",
                    "params" : {},
                })
                .success(
                        function(data) {
                            for (i = 0; i < data.formula1List.length; i++) {
                                data.formula1List[i].result.date = new Date(
                                        data.formula1List[i].result.date);
                                data.formula1List[i].result.image = "";
                            }
                            $scope.formula1 = data.formula1List;
                            $scope.raceTypes = data.raceTypes;

                            // Code for pagination on Create Formula 1 Screen
                            $scope.filteredTodos = []
                            $scope.currentPage = 1
                            $scope.numPerPage = 10
                            $scope.maxSize = 5;

                            $scope.numPages = function() {
                                return Math.ceil($scope.formula1.length
                                        / $scope.numPerPage);
                            };
                            $scope
                                    .$watch(
                                            'currentPage + numPerPage',
                                            function() {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin
                                                        + $scope.numPerPage;
                                                $scope.filteredformula1 = $scope.formula1
                                                        .slice(begin, end);
                                            });
                        });
    }

    getFormula1ToEdit();

    $scope.practice = function(f1) {
        APIService.doApiCall({
            "req_name" : "updateF1Practice",
            "params" : {
                "time" : f1.time,
                "date" : f1.date,
                "raceType" : f1.type,
                "formulaOneId" : f1.id,
                "formulaOnePracticeId" : f1.practiceId,
                "name" : f1.name,
                "country" : f1.country,
                "city" : f1.city,
                "imagePath" : f1.imagePath,
                "circuitGuide" : f1.circuitGuide
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Updated Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        });
    }

    $scope.createF1 = function(f1) {
        APIService.doApiCall({
            "req_name" : "setF1Schedule",
            "params" : {
                "time" : f1.time,
                "date" : f1.date,
                "raceType" : f1.type,
                "name" : f1.name,
                "country" : f1.country,
                "city" : f1.city,
                "formula1Id" : f1.id,
                "imagePath" : f1.imagePath,
                "circuitGuide" : f1.circuitGuide
            }
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Updated Successfully.'
                } ];
            } else {
                $scope.alerts = [ {
                    type : 'warning',
                    msg : 'Oops! There seems to be some error.'
                } ];
            }
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
            $scope.formula1.addBtn = false;
            getFormula1ToEdit();
        });
    }

    $scope.removeF1 = function(f1) {
        if (f1.isDelete) {
            APIService.doApiCall({
                "req_name" : "removeF1Schedule",
                "params" : {
                    "raceType" : f1.type,
                    "formula1Id" : f1.id,
                    "formula1PracticeId" : f1.practiceId
                }
            }).success(function(data) {
                if (data != null || data != "") {
                    $scope.alerts = [ {
                        type : 'success',
                        msg : 'Nice! Record Updated Successfully.'
                    } ];
                } else {
                    $scope.alerts = [ {
                        type : 'warning',
                        msg : 'Oops! There seems to be some error.'
                    } ];
                }
                $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                };
                var newDataList = [];
                angular.forEach($scope.formula1, function(v) {
                    if (!v.result.isDelete) {
                        newDataList.push(v);
                    }
                });
                $scope.formula1 = newDataList;

                getFormula1ToEdit();
            });
        } else {
            $scope.alerts = [ {
                type : 'danger',
                msg : 'No Row Selected'
            } ];
        }
    }

    // Disable weekend selection
    $scope.openDatePicker = function($event, f1) {
        $event.preventDefault();
        $event.stopPropagation();
        f1.opened = true;
    };

    $scope.dateOptions = {
        formatYear : 'yy',
        startingDay : 1, //shows which day of the week to pre-select on opening the datepicker
        maxDate : new Date(2018, 5, 22),
        minDate : new Date(2017, 00, 01),
    };

    $scope.format = 'dd/MMMM/yyyy';

    //Time picker
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    $scope.addNew = function() {
        $scope.formula1.push({
            addBtn : true
        });
    };
}

var editFantasyCricketController = function($scope, APIService, $http,
        $uibModal, $stateParams) {

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name" : "getCricketCountries",
            "params" : {}
        }).success(function(data) {
            $scope.countries = data;
        });
    }

    $scope.createFantasyRecord = function(playerDetails) {
        APIService.doApiCall({
            "req_name" : "setFantasyCricketRecord",
            "params" : {
                "firstName" : playerDetails.firstName,
                "lastName" : playerDetails.lastName,
                "battingRating" : playerDetails.rating,
                "bowlingRating" : playerDetails.bowlingRating,
                "role" : playerDetails.role,
                "countryGeoId" : playerDetails.countryGeoId,
                "battingPosition" : playerDetails.battingPosition
            }
        }).success(function(data) {
            if ("success" == data) {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Created Successfully.'
                } ];
                $scope.getFantasyRecords();
            }
        });
    }

    $scope.getFantasyRecords = function() {
        APIService
                .doApiCall({
                    "req_name" : "getFantasyCricketPlayers",
                    "params" : {}
                })
                .success(
                        function(data) {
                            $scope.fantasyCricket = data;

                            //Pagination Logic for fantasy Cricket.
                            $scope.filteredTodos = []
                            $scope.currentPage = 1
                            $scope.numPerPage = 10
                            $scope.maxSize = 5;

                            $scope.numPages = function() {
                                return Math.ceil($scope.fantasyCricket.length
                                        / $scope.numPerPage);
                            };
                            $scope
                                    .$watch(
                                            'currentPage + numPerPage',
                                            function() {
                                                var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin
                                                        + $scope.numPerPage;
                                                $scope.filteredFantasyCricket = $scope.fantasyCricket
                                                        .slice(begin, end);
                                            });
                        });
    }

    $scope.updateFantasyCricket = function(playerDetails) {
        APIService.doApiCall({
            "req_name" : "updateFantasyCricket",
            "params" : {
                "fantasyCricketId" : playerDetails.fantasy_cricket_id,
                "firstName" : playerDetails.firstName,
                "lastName" : playerDetails.lastName,
                "battingRating" : playerDetails.rating,
                "bowlingRating" : playerDetails.bowlingRating,
                "role" : playerDetails.role,
                "countryGeoId" : playerDetails.countryGeoId,
                "battingPosition" : playerDetails.battingPosition
            }
        }).success(function(data) {
            if ("success" == data) {
                $scope.alerts = [ {
                    type : 'success',
                    msg : 'Nice! Record Updated Successfully.'
                } ];
                $scope.getFantasyRecords();
            }
        });
    }

    $scope.removeFantasyRecords = function(fantasyCricketId) {
        APIService.doApiCall({
            "req_name" : "removeFantasyCricketRecord",
            "params" : {
                "fantasyCricketId" : fantasyCricketId
            }
        }).success(function(data) {
            $scope.getFantasyRecords();
        });
    }

    getCricketCountries();
    $scope.getFantasyRecords();

    $scope.fantasyCricket = [];

    $scope.addNew = function() {
        $scope.fantasyCricket.push({
            addBtn : true
        });
    };
}

myApp.controller('ModalInstanceCtrl', function($scope, $uibModalInstance,
        nothing, $sce) {
    $scope.close = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.trustSrc = function(trailer) {
        return $sce.trustAsResourceUrl(trailer);
    }
    $scope.nothing = nothing;
});

/* ------- Controller Entries ------- */
myApp.controller("navbarController", navbarController);
myApp.controller("dashboardController", dashboardController);
myApp.controller("editMoviesController", editMoviesController);
myApp.controller("editCricketController", editCricketController);
myApp.controller("editF1Controller", editF1Controller);
myApp.controller("editFantasyCricketController", editFantasyCricketController);

/* ----- Routing ----- */
myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state("home", {
        url : "/",
        templateUrl : "dashboard.html",
        controller : "dashboardController"
    }).state("movies", {
        url : "/movies",
        templateUrl : "moviesInsert.html",
        controller : "editMoviesController"
    }).state("cricket", {
        url : "/cricket",
        templateUrl : "cricketInsert.html",
        controller : "editCricketController"
    }).state("formula-one", {
        url : "/f1",
        templateUrl : "F1Insert.html",
        controller : "editF1Controller"
    }).state("fantasy-cricket", {
        url : "/fantasy-cricket",
        templateUrl : "fantasyCricketInsert.html",
        controller : "editFantasyCricketController"
    }).state("otherwise", {
        url : "/otherwise",
        templateUrl : "dashboard.html",
        controller : "dashboardController"
    });
});