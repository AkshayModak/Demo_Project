
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

myApp.controller('navbarController', function ($scope, $rootScope) {
    $rootScope.isNavCollapsed = true;
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
    $scope.playCricket = function(userEleven, computerPlayers, playingAgainst, tossPreference) {
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
                    $scope.tossMessage = playingAgainst + " has won the toss and elected to bat first";
                    $scope.wonBy = "computer";
                } else if ("computer-bowl" == data) {
                    $scope.tossPreference = true;
                    $scope.tossMessage = playingAgainst + " has won the toss and elected to bowl first";
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

    $scope.setPlayAgainst = function(_team, _teamName) {
        APIService.doApiCall({
            "req_name": "setPlayAgainst",
            "params": {"playAgainst": _team}
        }).success(function(data) {
            $scope.playingAgainst = _teamName;
            $scope.computerPlayers = data;
        });
    }

    $rootScope.pageTitle = "Fantasy Cricket | Nextrr";

    getCricketCountries();
    getFantasyCricketPlayers();
}

var cricketController = function($scope, APIService, ModalService, $http, $uibModal, $stateParams, $rootScope) {

	$scope.expanded = false;

    $scope.filterCricket = function(string) {
        $scope.filterString = "";
        if (string == '') {
            $scope.dropdown_index = -1;
        }
        $scope.filterString = string;
        $scope.selectedTeam = string;
    }

    $scope.showAllCricket = function() {
        if ($scope.released) {
            var today = new Date();
            today.setHours(0,0,0,0);
            cricketList = $scope.cricketList;
            for (i=0; i < cricketList.length; i++) {
                cricketList[i].displayCricket = "display-block";
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
                    cricketList[i].displayCricket = "display-block";
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
                    cricketList[i].displayCricket = "display-block";
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

var contactUsController = function($scope, APIService, $rootScope) {
	$scope.setMessage=function(contact){
        console.log(contact);
        if (contact !== null && contact !== '' && contact !== undefined) {
            APIService.doApiCall({
                "req_name": "setMessage",
                "params": {"email":contact.email,"message":contact.message}
            }).success(function(data) {
                console.log(data);
                if (data != null || data != "") {
                    if ('success' === data) {
                        $scope.alerts = [{ type: 'success', msg: 'Thank You for contacting Us. We will try to revert you back as soon as possible.' }];
                    } else {
                        $scope.alerts = [{ type: 'danger', msg: 'Email Address or Message missing.' }];
                    }
                }
                $scope.closeAlert = function(index) {
                    $scope.alerts.splice(index, 1);
                };
            });
            $scope.contact = [];
        }
    }

    $rootScope.pageTitle = "Contact Us | Nextrr";
}

myApp.controller("formula1Controller", formula1Controller);
myApp.controller("moviesController", moviesController);
myApp.controller("cricketController", cricketController);
myApp.controller("fantasyCricketController", fantasyCricketController);
myApp.controller("homeController", homeController);
myApp.controller("contactUsController", contactUsController);

myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	$stateProvider.state("home", {
		url: "/",
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
	}).state("disclaimer", {
		url: "/disclaimer",
		templateUrl: "final/disclaimer.html",
	}).state("credits", {
		url: "/credits",
		templateUrl: "final/credits.html",
	}).state("contact-us", {
		url: "/contact-us",
		templateUrl: "final/contact-us.html",
		controller: "contactUsController"
	}).state("otherwise", {
		url: "/otherwise",
		templateUrl: "final/compOne.html",
		controller: "homeController"
	});
});