myApp.factory('APIService', ['$http', function($http) {

	var path = location.pathname;
	var appName = path.split('/')[1];
    return {
        doApiCall: function(obj){
            var xhr = $http({
                url: 'http://' + location.host + "/" + appName +'/admin/rest/AdminService/' + obj.req_name,
                method: 'POST',
                timeout: obj.timeout,
                params: obj.params,
                headers: {'Content-Type': 'multipart/form-data'}
            });

            return xhr;
        },
        doJsonApiCall: function(obj){

            var xhr = $http({
                url: obj.req_name,
                method: 'POST',
                timeout: obj.timeout,
                data: obj.params
            });

            return xhr;
        }
    };
}]);