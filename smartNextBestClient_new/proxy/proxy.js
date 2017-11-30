define([    
    'dojo/_base/declare',
    'dojo/request/xhr',
    'app/services/ConsoleService',
    'dojo/_base/lang',
    'dojo/Deferred',
    '../util/ExtendUtil'
    
], function(declare, xhr, ConsoleService, lang, Deferred, ExtendUtil) {
    var instance = null;
    var util = new ExtendUtil();
    var proxyRoot = ConsoleService.getConstants().proxyRoot;
    var widget = declare('bestClient_proxy', [], {
        
        bestClients: function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/best-clients'
                method: 'post',
            }, params);
            return xhr(proxyRoot + '/e2eProspecting/smart/best-clients', option);
        },
        
        getFilter: function() {
            var option = defaultOption();
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/filter'
                method: 'get',
            });
            return xhr(proxyRoot + '/e2eProspecting/smart/filter', option);
        },
        
        xxxx : function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url: proxyRoot + '/e2eProspecting/smart/filter'
            });
            xhr.get(option);
            return option.promise;
        },
        
        yyyy : function(params) {
            var option = defaultOption();
            
            option = util.extend(true, option, {
                url: proxyRoot + '/e2eProspecting/smart/filter'
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
