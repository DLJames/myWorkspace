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
        
        ajax1 : function() {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : ''
            });
            xhr.get(option);
            return option.promise;
        	
        	
//        	return new Promise(function(resolve, reject) {
//        		var obj = {
//        				url: '',
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
//        		url: '',
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
        
        ajax2 : function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url : ''
            }, params);
            xhr.post(option);
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
