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
            var _url = proxyRoot + '/e2eProspecting/smart/best-clients';
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/best-clients',
                method: 'post'
            }, params);
            return xhr(_url, option);
        },
        
        getFilter: function(intranetID) {
            var option = defaultOption();
            var _url = proxyRoot + '/e2eProspecting/smart/filter?email=' + intranetID;
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/filter',
                method: 'get'
            });
            return xhr(_url, option);
        },
        
        createTask : function(params) {
            var option = defaultOption();
            var _url = proxyRoot + '/e2eProspecting/smart/tasks';
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/tasks',
                method: 'post'
            }, params);
            return xhr(_url, option);
        },
        
        editTask : function(params) {
            var option = defaultOption();
            var _url = proxyRoot + '/e2eProspecting/smart/tasks';
            
            option = util.extend(true, option, {
//                url: proxyRoot + '/e2eProspecting/smart/tasks',
                method: 'put'
            }, params);
            return xhr(_url, option);
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
