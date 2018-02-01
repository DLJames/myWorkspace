define([    
    'dojo/_base/declare',    
    'dojo/text!./config/info.json',    
    './view/MyAchievementsView',    
    'system/module/Module',    
    'dojo/dom-construct',
    'app/services/ConsoleService'
    
],     
    function(declare, info, MyAchievementsView, _Module, domConstruct, ConsoleService) {
        var Module = declare([_Module], {
            pfields : _Module,    
            proxy : {    
                reader : {    
                    isCache : true,    
                    cachedData : info    
                }
            },
            noCache : false,
            
            preSettings : function() {
                this.moduleViewType = MyAchievementsView;
            },    
            
            activate : function(parameter) {
                this.inherited(arguments);
                this.setModuleTitle();
            },
            
            afterViewLoad : function() {
                var me =this;
                this.inherited(arguments);
//                view enter...
                this.showMark().then(function() {
//                    me.moduleView.sendRequest();
                    me.hideMark();
                    me.moduleView.initVue();
                });
            },
            
            setModuleTitle : function() {
                ConsoleService.setHeaderTitle('My Achievements [VUE]');
            },
            
            onReloadModule : function() {
                return;
            },    
            onUnloadModule : function() {
                return;
            },    
            onDestroy : function() {
                return;
            }
            
        });     
        return Module;
    }    
);    
