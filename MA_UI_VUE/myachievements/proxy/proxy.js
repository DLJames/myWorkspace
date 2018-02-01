define([    
    'dojo/_base/declare',
    'dojo/_base/xhr',
    'app/services/ConsoleService',
    'dojo/_base/lang',
    'dojo/Deferred',
    '../util/ExtendUtil'
    
], function(declare, xhr, ConsoleService, lang, Deferred, ExtendUtil) {
    var instance = null;
    var util = new ExtendUtil();
    var proxyRoot = ConsoleService.getConstants().proxyRoot;
    var widget = declare('MA_proxy', [], {
        getUserConsentValue : function(userId) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/getUserConsentValue?userId=' + userId
            });
            xhr.get(option);
            return option.promise;
        	
        	
//        	return new Promise(function(resolve, reject) {
//        		var obj = {
//        				url: proxyRoot + '/csa-mylearning/getUserConsentValue?userId=' + userId,
//        				preventCache : true,
//        	            headers : {
//        	                'Content-Type' : 'application/json'
//        	            },
//        	            handleAs : 'json',
//        	            load: function(res) {
//        	            	resolve(res);
//        	            },
//        	            error: function(err) {
//        	            	reject(err);
//        	            }
//        		}
//        		
//        		xhr.get(obj);
//        	});
        	
//        	var deffered = new Deferred();
//        	var obj = {
//        		url: proxyRoot + '/csa-mylearning/getUserConsentValue?userId=' + userId,
//        		preventCache: true,
//        		headers: {
//        			'Content-type': 'application/json'
//        		},
//        		handleAs: 'json',
//        		load: function(res) {
//        			deffered.resolve(res);
//        		},
//        		error: function(err) {
//        			deffered.reject(err);
//        		}
//        	}
//        	xhr.get(obj);
//        	return deffered.promise;
        },
        
        setUserConsentValue : function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/setUserConsentValue'
            }, params);
            xhr.post(option);
            return option.promise;
        },
        
        setWelcomePageValue : function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/setUserShowWelcome'
            }, params);
            xhr.post(option);
            return option.promise;
        },
        
        getUserThink40 : function(userId) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/getUserThink40?userId=' + userId
            });
            xhr.get(option);
            return option.promise;
        },
        
        getUserEducationTracking : function(userId) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/getUserEducationTracking?userId=' + userId
            });
            xhr.get(option);
            return option.promise;
        },
        
        getRequiredLearning : function(userId) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/getUserRequiredLearning?userId=' + userId
            });
            xhr.get(option);
            return option.promise;
        },
        
        getPersonalLearning : function(userId) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-mylearning/getUserPersonalLearning?userId=' + userId
            });
            xhr.get(option);
            return option.promise;
        },
        
        getBluePageInfo : function(intranetID) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : proxyRoot + '/csa-dpcoach/getBluePageByID?intranetId=' + intranetID
            });
            xhr.get(option);
            return option.promise;
        }
    });
    
    function defaultOption() {
        
        var deferred = new Deferred();
        
        return {
            preventCache : true,
            headers : {
                'Content-Type' : 'application/json'
            },
            handleAs : 'json',
            load : function(response) {
                deferred.resolve(response);
            },
            error : function(err) {
                deferred.reject(err);
            },
            promise : deferred.promise
        };
    }
    
    instance = new widget();
    
    return instance;
});
