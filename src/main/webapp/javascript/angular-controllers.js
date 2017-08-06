
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

myApp.controller('navbarController', function ($scope) {
	  $scope.isNavCollapsed = false;
	  $scope.isCollapsed = false;
	  $scope.isCollapsedHorizontal = false;
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

var cricketController = function($scope, APIService, ModalService, $http, $uibModal, $stateParams) {
    /*$scope.selectedTeam = $stateParams.teamId;*/
    $scope.expanded = false;

    $scope.filterCricket = function(string) {
        $scope.filterString = string;
    }

    $scope.expandDropdown = function(expanded, index) {
        $scope.expanded = !expanded;
        $scope.dropdown_index = index;
    }

    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCountryAssoc",
            "params": {"sports_type_id": "CRICKET"}
        }).success(function(data) {
            $scope.teams = data;
        });
    }

    getIntlCricket = function() {
        APIService.doApiCall({
            "req_name": "getIntlCricketToDisplay",
            "params": {}
        }).success(function(data) {
            $scope.cricketList = data.result;
        });
    }
    getCricketCountries();
    getIntlCricket();
}

var editCricketController = function($scope, APIService, $http, $uibModal, $stateParams) {
    getCricketCountries = function() {
        APIService.doApiCall({
            "req_name": "getCricketCountries",
            "params": {}
        }).success(function(data) {
            $scope.teams = data;
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
            }
            $scope.cricketList = data.result;
        });
    }

    $scope.createCricket=function(cricket){
        APIService.doApiCall({
            "req_name": "setCricket",
            "params": {"teamOneId":cricket.team_one_geoId,"teamTwoId":cricket.team_two_geoId, "stadium": cricket.stadium, "city":cricket.city, "matchNumber": cricket.match_number,
                "country": cricket.country_geoId, "matchType": cricket.sports_child_type_id, "fromDate": cricket.match_from_date, "toDate": cricket.match_to_date, "time": cricket.time}
        }).success(function(data) {
            if (data != null || data != "") {
                $scope.alerts = [{ type: 'success', msg: 'Nice! Record Created Successfully.' }];
            } else {
                $scope.alerts = [{ type: 'warning', msg: 'Oops! There seems to be some error.' }];
            }
            getIntlCricket();
        });
    }

    $scope.updateCricket=function(cricket){
        if ("Invalid Date" == cricket.match_to_date) {
            cricket.match_to_date = "N/A";
        }
        APIService.doApiCall({
            "req_name": "updateCricket",
            "params": {"cricketId": cricket.cricket_id, "teamOneId":cricket.team_one_geoId,"teamTwoId":cricket.team_two_geoId, "stadium": cricket.stadium, "city":cricket.city, "matchNumber": cricket.match_number,
                "country": cricket.country_geoId, "matchType": cricket.sports_child_type_id, "fromDate": cricket.match_from_date, "toDate": cricket.match_to_date, "time": cricket.time}
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

var moviesController = function($scope, APIService, ModalService, $http, $uibModal, $stateParams) {
	
	var movieType = $stateParams.movieType;
	if ("hollywood" === movieType) {
		$scope.selectedType = 0;
	} else {
		$scope.selectedType = 1;
	}
	
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

var formula1Controller = function($scope, APIService, $http) {

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
        	data[i].mainRace.date = raceDate + " " + monthNames[mainRaceDate.getMonth()];
        	if (raceDate < currentDate) {
        		data[i].isFinished = true;
        	}
        }
        $scope.formula1 = data;
    });
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
                "city":f1.city, "imagePath": f1.imagePath}
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
            "params": {"time":f1.time,"date":f1.date, "raceType": f1.type, "name":f1.name, "country": f1.country, "city":f1.city, "formula1Id": f1.id, "imagePath": f1.imagePath}
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

myApp.config(function($stateProvider, $urlRouterProvider) {
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
	}).state("otherwise", {
		url: "/otherwise",
		templateUrl: "templates/home.html",
		controller: "homeController"
	});
	
	$urlRouterProvider
			.when("/movies", "/movies/hollywood")
		    .otherwise("/home");
});