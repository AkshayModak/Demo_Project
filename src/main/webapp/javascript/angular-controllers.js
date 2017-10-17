
var myApp = angular.module("myModule", ["ui.router",'ngAnimate', 'ngSanitize', "ui.bootstrap", "ngMaterial", "ngMessages", "infinite-scroll"]);

/*myApp.run(function($rootScope, $templateCache) {
	$rootScope.$on('$viewContentLoaded', function() {
		$templateCache.removeAll();
	});
});
*/


/*angular.element().bind('load', function() {
   $scope.loader=true;
});*/

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var homeController = function($scope, $rootScope) {
    $rootScope.home = true;
    $rootScope.pageTitle = "Home | Nextrr";
}

myApp.controller('navbarController', function ($scope) {
		if (window.innerWidth < 768) {
			$scope.isNavCollapsed = true;
		} else {
			$scope.isNavCollapsed = false;
		}
	  $scope.isCollapsed = true;
	  $scope.isCollapsedHorizontal = true;
});

function format_time(date_obj) {
	  // formats a javascript Date object into a 12h AM/PM time string
	  var hour = date_obj.getHours();
	  var minute = date_obj.getMinutes();
	  var amPM = (hour > 11) ? "pm" : "am";
	  if(hour > 12) {
	    hour -= 12;
	  } else if(hour == 0) {
	    hour = "12";
	  }
	  if(minute < 10) {
	    minute = "0" + minute;
	  }
	  return hour + ":" + minute + amPM;
}

/* http://stackoverflow.com/questions/14878761/bind-class-toggle-to-window-scroll-event */
myApp.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset < 50) {
                 scope.boolChangeClass = false;
             } else {
                 scope.boolChangeClass = true;
             }
            scope.$apply();
        });
    };
});

var fantasyCricketController = function($scope, $rootScope, APIService, ModalService, $http, $uibModal, $stateParams) {
    getFantasyCricketPlayers = function() {
        $scope.showSpinner = true;
        APIService.doApiCall({
            "req_name": "getFantasyCricketPlayers",
            "params": {}
        }).success(function(data) {
            for (i = 0; i < data.size; i++) {
                data[i].pushed = "";
            }
            $scope.players = data;
        });
        $scope.showSpinner = false;
    }

    $scope.userEleven = [];
    $scope.userEleven.teamName = "Demo XI";

    $scope.rating = 0;
    $scope.ratingExceedAlert = false;
    $scope.disableBatmen = false;
    $scope.disableBowlers = false;
    $scope.disableWicketkeepers = false;
    $scope.disableAllRounders = false;

    var totalBatsmen = 0;
    var totalWicketkeepers = 0;
    var totalBowlers = 0;
    var totalAllRounders = 0;

    $scope.addToEleven = function(item) {
        if ("bowler" == item.role || "spinner" == item.role) {
            $scope.rating = $scope.rating + parseInt(item.bowlingRating);
            totalBowlers = totalBowlers + 1;
        } else if ("batsman" == item.role) {
            $scope.rating = $scope.rating + parseInt(item.rating);
            totalBatsmen = totalBatsmen + 1;
        } else if ("wicketkeeper" == item.role) {
            $scope.rating = $scope.rating + parseInt(item.rating);
            totalWicketkeepers = totalWicketkeepers + 1;
        } else if ("all-rounder-spinner" == item.role || "all-rounder-fast" == item.role) {
            $scope.rating = $scope.rating + parseInt(item.rating);
            totalAllRounders = totalAllRounders + 1;
        }

        if (totalBatsmen >= 5) {
             $scope.disableBatsmen = true;
        }
        if (totalBowlers >= 3) {
            $scope.disableBowlers = true;
        }
        if (totalWicketkeepers >= 1) {
            $scope.disableWicketkeepers = true;
        }
        if (totalAllRounders >= 2) {
            $scope.disableAllRounders = true;
        }
        
        console.log($scope.rating);
        if ($scope.rating <= 100) {
            item.pushed = true;
            $scope.userEleven.push(item);

            if ($scope.userEleven.length == 11) {
                $scope.showPlayBtn = true;
            }
            $scope.ratingExceedAlert = false;
        } else {
            $scope.ratingExceedAlert = true;
        }
    }

    $scope.removeFromEleven = function(item) {
        item.pushed = false;
        $scope.showPlayBtn = false;
        $scope.ratingExceedAlert = false;
        var index = $scope.userEleven.indexOf(item);
        $scope.userEleven.splice(index, 1);

        if ("bowler" == item.role || "spinner" == item.role) {
            $scope.rating = $scope.rating - parseInt(item.bowlingRating);
            totalBowlers = totalBowlers - 1;
        } else if ("batsman" == item.role) {
            $scope.rating = $scope.rating - parseInt(item.rating);
            totalBatsmen = totalBatsmen - 1;
        } else if ("wicketkeeper" == item.role) {
            $scope.rating = $scope.rating - parseInt(item.rating);
            totalWicketkeepers = totalWicketkeepers - 1;
        } else if ("all-rounder-spinner" == item.role || "all-rounder-fast" == item.role) {
            $scope.rating = $scope.rating - parseInt(item.rating);
            totalAllRounders = totalAllRounders - 1;
        }

        if (totalBatsmen < 5) {
             $scope.disableBatsmen = false;
        }
        if (totalBowlers < 3) {
            $scope.disableBowlers = false;
        }
        if (totalWicketkeepers < 1) {
            $scope.disableWicketkeepers = false;
        }
        if (totalAllRounders < 2) {
            $scope.disableAllRounders = false;
        }
    }

    $scope.showScoreboard = false;
    $scope.playCricket = function(userEleven, computerPlayers, tossPreference) {
        if (computerPlayers == undefined || computerPlayers.length < 11) {
            $scope.errorMessage = "Please select country to play against.";
            return;
        }
        if (userEleven.length == 11) {
            $scope.showSpinner = true;
            APIService.doApiCall({
                "req_name": "getFantasyCricketResult",
                "params": {"userEleven" : userEleven,"computerPlayers" : computerPlayers, "tossPreference" : tossPreference}
            }).success(function(data) {
                $scope.tossPreference = data[0];
                if ("user" == data) {
                    $scope.tossPreference = true;
                    $scope.tossMessage = userEleven.teamName + " Won the toss."
                    $scope.wonBy = "user";
                } else if ("computer-bat" == data) {
                    $scope.tossPreference = true;
                    $scope.tossMessage = "Computer has won the toss and elected to bat first";
                    $scope.wonBy = "computer";
                } else if ("computer-bowl" == data) {
                    $scope.tossPreference = true;
                    $scope.tossMessage = "Computer has won the toss and elected to bowl first";
                    $scope.wonBy = "computer";
                }
                $scope.team1 = data[1];
                $scope.team1Fow = data[2];
                $scope.team1BowlerDetails = data[3];
                $scope.team1Score = data[4];

                $scope.team2 = data[5];
                $scope.team2Fow = data[6];
                $scope.team2BowlerDetails = data[7];
                $scope.team2Score = data[8];
                
                $scope.showScoreboard = true;
            });
            $scope.showSpinner = false;
        } else {
            playersRequired = 11 - userEleven.length;
            $scope.errorMessage = "Need " + playersRequired +" more player(s) to play a match.";
        }
    }

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCountryAssoc",
            "params": {"sports_type_id": "CRICKET", "format": "GSON"}
        }).success(function(data) {
            $scope.teams = data;
        });
    }

    $scope.hideError = function() {
        $scope.errorMessage = false;
    }

    $scope.setPlayAgainst = function(_team) {
        APIService.doApiCall({
            "req_name": "setPlayAgainst",
            "params": {"playAgainst": _team}
        }).success(function(data) {
            $scope.computerPlayers = data;
        });
    }

    $rootScope.pageTitle = "Fantasy Cricket | Nextrr";

    getCricketCountries();
    getFantasyCricketPlayers();
}

var editFantasyCricketController = function($scope, APIService, $http, $uibModal, $stateParams) {

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCricketCountries",
            "params": {}
        }).success(function(data) {
            $scope.countries = data;
        });
    }

    $scope.createFantasyRecord = function(playerDetails) {
        APIService.doApiCall({
            "req_name": "setFantasyCricketRecord",
            "params": {"firstName": playerDetails.firstName, "lastName": playerDetails.lastName, "battingRating": playerDetails.rating,
                 "bowlingRating": playerDetails.bowlingRating, "role": playerDetails.role, "countryGeoId": playerDetails.countryGeoId, "battingPosition": playerDetails.battingPosition}
        }).success(function(data) {
            if ("success" == data) {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Created Successfully.' }];
                $scope.getFantasyRecords();
            }
        });
    }

    $scope.getFantasyRecords = function() {
        APIService.doApiCall({
            "req_name": "getFantasyCricketPlayers",
            "params": {}
        }).success(function(data) {
            $scope.fantasyCricket = data;
        });
    }

    $scope.updateFantasyCricket = function(playerDetails) {
        APIService.doApiCall({
            "req_name": "updateFantasyCricket",
            "params": {"fantasyCricketId": playerDetails.fantasy_cricket_id,"firstName": playerDetails.firstName, "lastName": playerDetails.lastName, "battingRating": playerDetails.rating,
                 "bowlingRating": playerDetails.bowlingRating, "role": playerDetails.role, "countryGeoId": playerDetails.countryGeoId, "battingPosition": playerDetails.battingPosition}
        }).success(function(data) {
            if ("success" == data) {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
                $scope.getFantasyRecords();
            }
        });
    }

    $scope.removeFantasyRecords = function(fantasyCricketId) {
        APIService.doApiCall({
            "req_name": "removeFantasyCricketRecord",
            "params": {"fantasyCricketId": fantasyCricketId}
        }).success(function(data) {
        	$scope.getFantasyRecords();
        });
    }

    getCricketCountries();
    $scope.getFantasyRecords();
    
    $scope.fantasyCricket = [];

    $scope.addNew = function(){
        $scope.fantasyCricket.push({addBtn: true});
    };
}

var cricketController = function($scope, APIService, ModalService, $http, $uibModal, $stateParams, $rootScope) {

	$scope.expanded = false;

    $scope.filterCricket = function(string) {
        $scope.filterString = "";
        if (string == '') {
            $scope.dropdown_index = -1;
        }
        $scope.filterString = string;
    }

    $scope.showAllCricket = function() {
        if ($scope.released) {
            var today = new Date();
            today.setHours(0,0,0,0);
            cricketList = $scope.cricketList;
            for (i=0; i < cricketList.length; i++) {
                cricketList[i].displayCricket = "table-row-block";
            }
            $scope.cricketList = cricketList;
            getCricketLeagues(false);
        } else {
            var today = new Date();
            today.setHours(0,0,0,0);
            cricketList = $scope.cricketList;
            for (i=0; i < cricketList.length; i++) {
                var matchDate = new Date(cricketList[i].match_date);
                if (matchDate < today) {
                    cricketList[i].displayCricket = "display-none";
                } else {
                    cricketList[i].displayCricket = "table-row-block";
                }
            }
            $scope.cricketList = cricketList;
            data = $scope.cricketLeagues;
            for (i = 0; i < data.length; i++) {
                if (data[i].sports_leagues != undefined) {
                    for (j = 0; j < data[i].sports_leagues.length; j++) {
                        leagueDate = new Date(data[i].sports_leagues[j].to_date);
                        if (leagueDate < today) {
                            data[i].sports_leagues.splice(j, 1);
                        }
                    }
                }
                if (!(data[i].sports_leagues).length > 0) {
                    data.splice(i, 1);
                }
            }
        }
    }
    $scope.cricketList = [];

    getIntlCricketToDisplay = function() {
        APIService.doApiCall({
            "req_name": "getIntlCricketToDisplay",
            "params": {}
        }).success(function(data) {
            cricketList = data.result;
            var colors = ['#1a237e', '#880e4f', '#4a148c', '#004d40', '#6d4c41', '#455a64'];
            var today = new Date();
            today.setHours(0,0,0,0);
            for (i=0; i < cricketList.length; i++) {
                var randomColor = getRandomInt(0, 4);
                cricketList[i].barColor = colors[randomColor];
                matchDate = new Date(cricketList[i].match_date);
                if (matchDate < today) {
                    cricketList[i].displayCricket = "display-none";
                } else {
                    cricketList[i].displayCricket = "table-row-block";
                }
            }
            $scope.cricketList = cricketList;
        });
    }
    getIntlCricketToDisplay();

    getCricketLeagues = function(_recent) {
        APIService.doApiCall({
            "req_name": "getCricketLeagues",
            "params": {}
        }).success(function(data) {
            if (_recent) {
                today = new Date();
                today.setHours(0,0,0,0);
                for (i = 0; i < data.length; i++) {
                    if (data[i].sports_leagues != undefined) {
                        for (j = 0; j < data[i].sports_leagues.length; j++) {
                            leagueDate = new Date(data[i].sports_leagues[j].to_date);
                            if (leagueDate < today) {
                                data[i].sports_leagues.splice(j, 1);
                            }
                        }
                    }
                    if ((data[i].sports_leagues).length == 0) {
                        data.splice(i, 1);
                    }
                }
            }
            $scope.cricketLeagues = data;
        });
    }

    $scope.expandDropdown = function(expanded, index) {
        if (index == $scope.dropdown_index) {
            $scope.expanded = !expanded;
            $scope.dropdown_index = -1;
        } else {
            $scope.expanded = !expanded;
            $scope.dropdown_index = index;
        }
    }

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCountryAssoc",
            "params": {"sports_type_id": "CRICKET", "format": "GSON"}
        }).success(function(data) {
            $scope.teams = data;
        });
    }

    getCricketCountries();
    getCricketLeagues(true);

    $rootScope.pageTitle = "Cricket | Nextrr";
}

var editCricketController = function($scope, APIService, $http, $uibModal, $stateParams) {

	addNewSeries = false;
	$scope.addNewSeries = addNewSeries;

	getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCricketCountries",
            "params": {}
        }).success(function(data) {
            $scope.teams = data;
        });
    }

    getCricketSeries = function() {
        APIService.doApiCall({
            "req_name": "getAllRawCricketLeagues",
            "params": {}
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
                "req_name": "addRemoveSportsLeague",
                "params": {"sports_league_id" : cricketLeague.series_id, "sports_type_id" : "CRICKET"}
            }).success(function(data) {
                getCricketSeries();
                $scope.deleteCricketLeague = false;
            });
        } else {
            APIService.doApiCall({
                "req_name": "addRemoveSportsLeague",
                "params": {"series_name" : cricketLeague.series, "series_location": cricketLeague.series_location, "sports_type_id" : "CRICKET",
                    "series_from_date" : cricketLeague.series_from_date, "series_to_date" : cricketLeague.series_to_date, "country_with" : cricketLeague.country_with}
            }).success(function(data) {
                getCricketSeries();
                $scope.cricketLeague = "";
            });
        }
    }

    updateCricketSeries = function() {
        APIService.doApiCall({
            "req_name": "updateCricketSeries",
            "params": {}
        }).success(function(data) {
            $scope.seriesList = data.result;
        });
    }

    removeCricketSeries = function() {
        APIService.doApiCall({
            "req_name": "removeCricketSeries",
            "params": {}
        }).success(function(data) {
            $scope.seriesList = data.result;
        });
    }

    getCricketMatchTypes = function() {
        APIService.doApiCall({
            "req_name": "getCricketMatchTypes",
            "params": {}
        }).success(function(data) {
            $scope.matchTypes = data.result;
        });
    }

    getCricketMatchTypes();
    getCricketCountries();

    getIntlCricket = function() {
        APIService.doApiCall({
            "req_name": "getIntlCricket",
            "params": {}
        }).success(function(data) {
            for (i = 0; i < data.result.length; i++) {
                data.result[i].match_from_date = new Date(data.result[i].match_from_date);
                data.result[i].match_to_date = new Date(data.result[i].match_to_date);
                data.result[i].time = new Date(data.result[i].time);
            }
            $scope.cricketList = data.result;
        });
    }

    $scope.createCricket=function(cricket){
        APIService.doApiCall({
            "req_name": "setCricket",
            "params": {"teamOneId":cricket.team_one_geoId,"teamTwoId":cricket.team_two_geoId, "stadium": cricket.stadium, "city":cricket.city, "matchNumber": cricket.match_number,
                "country": cricket.country_geoId, "matchType": cricket.sports_child_type_id, "fromDate": cricket.match_from_date, "toDate": cricket.match_to_date, "time": cricket.time,
                "sports_league" : cricket.series_id}
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Created Successfully.' }];
            } else {
                $scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
            }
            getIntlCricket();
        });
    }

    $scope.updateCricket=function(cricket, $scope){
        if ("Invalid Date" == cricket.match_to_date) {
            cricket.match_to_date = "N/A";
        }
        APIService.doApiCall({
            "req_name": "updateCricket",
            "params": {"cricketId": cricket.cricket_id, "teamOneId":cricket.team_one_geoId,"teamTwoId":cricket.team_two_geoId, "stadium": cricket.stadium, "city":cricket.city, "matchNumber": cricket.match_number,
                "country": cricket.country_geoId, "matchType": cricket.sports_child_type_id, "fromDate": cricket.match_from_date, "toDate": cricket.match_to_date, "time": cricket.time,
                "sports_league" : cricket.series_id}
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
            } else {
                $scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
            }
            getIntlCricket();
        });
    }

    $scope.removeCricket = function(cricket) {
        if (cricket.isDelete) {
            APIService.doApiCall({
                "req_name": "removeCricket",
                "params": {"cricketId": cricket.cricket_id}
            }).success(function(data) {
                if (data != null || data != "") {
                    $scope.alerts = [{ type: 'success', msg: 'Nice! Record Deleted Successfully.' }];
                } else {
                    $scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
                }
                getIntlCricket();
            });
        } else {
            $scope.alerts = [{ type: 'danger', msg: 'No Row Selected' }];
        }
    }

    getIntlCricket();

    $scope.addNew = function(){
        $scope.cricketList.push({addBtn: true});
    };
}

var moviesController = function($scope, APIService, ModalService, $http, $uibModal, $stateParams, $rootScope) {
	
	var movieType = $stateParams.movieType;
	if ("hollywood" === movieType) {
		$scope.selectedType = 0;
	} else {
		$scope.selectedType = 1;
	}
	
	var getMovies = function() {
        APIService.doApiCall({
            "req_name": "getMovies",
            "params": {movieType: movieType},
        }).success(function(data) {
        	var colors = ['#1a237e', '#880e4f', '#4a148c', '#004d40', '#6d4c41', '#455a64'];
			data.sort(function(a, b) {
				// Turn your strings into dates, and then subtract them
				// to get a value that is either negative, positive, or
				// zero.
				return new Date(a.releaseDate) - new Date(b.releaseDate);
			});
        	for (i = 0; i < data.length; i++) {
                var randomColor = getRandomInt(0, 4);
				data[i].movieColor = colors[randomColor];
            	var today = new Date();
            	today.setHours(0,0,0,0);
            	var releaseDate = new Date(data[i].releaseDate);
            	if (releaseDate < today) {
            		data[i].displayMovie = "none";
            	}
            }
            $scope.movies = data;
        });
    }

    if ("hollywood" === movieType) {
    	getMovies();
	} else {
		getMovies();
	}
	
    /* reference -- http://jsfiddle.net/8s9ss/4/ */
    $scope.open = function (_movie) {
        var modalInstance = $uibModal.open({
          controller: "ModalInstanceCtrl",
          templateUrl: 'myModalContent.html',
            resolve: {
                movie: function()
                {
                    return _movie;
                }
            }
        });
    };

	$scope.showAllMovies = function(movies) {
		var today = new Date();
		today.setHours(0,0,0,0);
		if ($scope.released) {
			for (i = 0; i < movies.length; i++) {
				movies[i].displayMovie = "block";
			}
		} else {
			for (i = 0; i < movies.length; i++) {
				var releaseDate = new Date(movies[i].releaseDate);
				if (releaseDate < today) {
					movies[i].displayMovie = "none";
				}
			}
		}
	}

    $rootScope.pageTitle = "Movies | Nextrr";
};

var editMoviesController = function($scope, APIService, $http) {
	
	var getMoviesToEdit = function() {
        APIService.doApiCall({
            "req_name": "getMoviesToEdit",
            "params": {},
        }).success(function(data) {
        	if (data != undefined && data != null) {
        		for (i = 0; i < data.movieList.length; i++) {
                	data.movieList[i].releaseDate = new Date(data.movieList[i].releaseDate);
                }
        	}
        	
        	$scope.movieTypes = data.movieTypes.result;
            $scope.movies = data.movieList;
        });
    }
    getMoviesToEdit();
    
    $scope.setMovie=function(movie){
        APIService.doApiCall({
            "req_name": "setMovie",
            "params": {"movieName":movie.movieName,"releaseDate":movie.releaseDate, "cast": movie.cast, "trailer":movie.trailer, "movieType": movie.movieType}
        }).success(function(data) {
        	if (data != null || data != "") {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Created Successfully.' }];
        	} else {
        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
        	}
        	getMoviesToEdit();
        });
    }
    
    $scope.removeMovie = function(movie) {
    	if (movie.isDelete) {
	    	APIService.doApiCall({
	            "req_name": "removeMovie",
	            "params": {"movieId": movie.movieId}
	        }).success(function(data) {
	        	if (data != null || data != "") {
	                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Removed Successfully.' }];
	        	} else {
	        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
	        	}
	            getMoviesToEdit();
	        });
    	} else {
    		$scope.alerts = [{ type: 'danger', msg: 'No Row Selected' }];
    	}
    }
    
    $scope.updateMovie=function(movie){
        APIService.doApiCall({
            "req_name": "updateMovie",
            "params": {"movieName":movie.movieName,"releaseDate":movie.releaseDate, "cast": movie.cast, "trailer":movie.trailer, "movieId": movie.movieId, "movieType": movie.movieType}
        }).success(function(data) {
        	if (data != null || data != "") {
            	$scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
        	} else {
        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
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
        formatYear: 'yy',
        startingDay: 1,                 //shows which day of the week to pre-select on opening the datepicker
      };

      $scope.format = 'dd/MMMM/yyyy';
      
      //Time picker
      $scope.hstep = 1;
      $scope.mstep = 15;
      $scope.ismeridian = true;

      $scope.addNew = function(){
          $scope.movies.push({
              addBtn: true,
              cast: []
          });
      };
}

myApp.controller("editMoviesController", editMoviesController);

myApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, movie, $sce) {
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.trustSrc = function(trailer) {
        return $sce.trustAsResourceUrl(trailer);
    }
	$scope.movie = movie;
});

var formula1Controller = function($scope, APIService, $http, $sce, $rootScope) {

    APIService.doApiCall({
        "req_name": "getFormula1Schedule",
        "params": {},
    }).success(function(data) {
    	for (i = 0; i < data.length; i++) {
    		var monthNames = ["January", "February", "March", "April", "May", "June",
    			  "July", "August", "September", "October", "November", "December"
    			];
        	data[i].expanded = false;
        	var mainRaceDate = new Date(data[i].mainRace.date);
        	if (data[i].FIRSTPRACTICE != null || data[i].FIRSTPRACTICE != undefined) {
        		var firstPracticeDate = new Date(data[i].FIRSTPRACTICE.date);
        		data[i].FIRSTPRACTICE.date = firstPracticeDate.getDate() + " " + monthNames[firstPracticeDate.getMonth()];
        	}
        	var raceDate = mainRaceDate.getDate();
        	var currentDate = new Date().getDate();
            data[i].sortTime = mainRaceDate.getTime();
        	data[i].mainRace.date = raceDate + " " + monthNames[mainRaceDate.getMonth()];
            if (mainRaceDate.getTime() < new Date().getTime()) {
                data[i].isFinished = true;
                $scope.nextEvent = data[i + 1];
                $scope.nextEvent.mainRace.circuitGuide = "https://www.youtube.com/embed/" + data[i + 1].mainRace.circuitGuide;
                console.log($scope.nextEvent.circuitGuide);
                $scope.trustCircuitGuide = function(circuitGuide) {
                    return $sce.trustAsResourceUrl(circuitGuide);
                }
            }
        }
        $scope.formula1 = data;
    });

    $rootScope.pageTitle = "Formula 1 Schedule | Nextrr";
}

myApp.controller("isrcorders", function($scope, $http, APIService, $filter) {

    $scope.myVal='submit';
    $scope.coll={};
    
    var getFormula1ToEdit = function() {
        APIService.doApiCall({
            "req_name": "getFormula1ToEdit",
            "params": {},
        }).success(function(data) {
            for (i = 0; i < data.formula1List.length; i++) {
            	data.formula1List[i].result.date = new Date(data.formula1List[i].result.date);
            	data.formula1List[i].result.image = "";
            }
            $scope.formula1 = data.formula1List;
            $scope.raceTypes = data.raceTypes;
        });
    }
    
    getFormula1ToEdit();
    
    $scope.practice=function(f1){
        APIService.doApiCall({
            "req_name": "updateF1Practice",
            "params": {"time":f1.time,"date":f1.date, "raceType": f1.type,
            	"formulaOneId":f1.id, "formulaOnePracticeId":f1.practiceId, "name":f1.name, "country": f1.country,
                "city":f1.city, "imagePath": f1.imagePath, "circuitGuide": f1.circuitGuide}
        }).success(function(data) {
        	if (data != null || data != "") {
            	$scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
        	} else {
        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
        	}
            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };
        });
    }
    
    $scope.createF1=function(f1){
        APIService.doApiCall({
            "req_name": "setF1Schedule",
            "params": {"time":f1.time,"date":f1.date, "raceType": f1.type, "name":f1.name, "country": f1.country, "city":f1.city, "formula1Id": f1.id, "imagePath": f1.imagePath, "circuitGuide": f1.circuitGuide}
        }).success(function(data) {
        	if (data != null || data != "") {
            	$scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
        	} else {
        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
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
	            "req_name": "removeF1Schedule",
	            "params": {"raceType": f1.type, "formula1Id": f1.id, "formula1PracticeId": f1.practiceId}
	        }).success(function(data) {
	        	if (data != null || data != "") {
	            	$scope.alerts = [{ type: 'success', msg: 'Nice! Record Updated Successfully.' }];
	        	} else {
	        		$scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
	        	}
	            $scope.closeAlert = function(index) {
	                $scope.alerts.splice(index, 1);
	            };
	            var newDataList=[];
	            angular.forEach($scope.formula1,function(v){
	                if(!v.result.isDelete){
	                    newDataList.push(v);
	                }
	            });
	            $scope.formula1= newDataList;
	            
	            getFormula1ToEdit();
	        });
    	} else {
    		$scope.alerts = [{ type: 'danger', msg: 'No Row Selected' }];
    	}
    }
    
    // Disable weekend selection
    
    $scope.openDatePicker = function($event, f1) {
      $event.preventDefault();
      $event.stopPropagation();
      f1.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,                 //shows which day of the week to pre-select on opening the datepicker
      maxDate: new Date(2018, 5, 22),
      minDate: new Date(2017, 00, 01),
    };
    

    $scope.format = 'dd/MMMM/yyyy';
    
    //Time picker
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = true;
    
    $scope.addNew = function(){
        $scope.formula1.push({
            addBtn: true
        });
    };
});


myApp.controller("formula1Controller", formula1Controller);
myApp.controller("moviesController", moviesController);
myApp.controller("cricketController", cricketController);
myApp.controller("editCricketController", editCricketController);
myApp.controller("fantasyCricketController", fantasyCricketController);
myApp.controller("editFantasyCricketController", editFantasyCricketController);
myApp.controller("homeController", homeController);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider.state("home", {
		url: "/home",
		templateUrl: "final/CompOne.html",
	}).state("formula1", {
		url: "/formula1",
		templateUrl: "final/f1.html",
		controller: "formula1Controller"
	}).state("movies", {
		url: "/movies/:movieType",
		templateUrl: "final/movies.html",
		controller: "moviesController"
	}).state("gallery", {
		url: "/gallery/:movieId",
		templateUrl: "templates/gallery.html",
		controller: "galleryController"
	}).state("cricket", {
		url: "/cricket/:teamId",
		templateUrl: "final/cricket.html",
		controller: "cricketController"
	}).state("fantasy-cricket", {
		url: "/fantasy-Cricket",
		templateUrl: "final/FantasyCricket.html",
		controller: "fantasyCricketController"
	}).state("otherwise", {
		url: "/otherwise",
		templateUrl: "templates/home.html",
		controller: "homeController"
	});
});