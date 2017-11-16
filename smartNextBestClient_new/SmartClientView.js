define([    
    'dojo/_base/declare',
    'dojo/on',
    'dojo/fx',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'comlib/ui/IScrollView',
    'app/services/ConsoleService',
    './proxy/proxy',
    './widgets/FilterUtil/FilterUtil',
    './widgets/HeadColumn/HeadColumn',
    './widgets/smartClientList/SmartClientList',
    'dojo/text!./config/config.json'
    
], function(declare, on, fx, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, FilterUtil, HeadColumn, SmartClientList, config) {
    var widget = declare('', [CustomUIWidget], {    
        baseClass : 'smartClientContainer',    
        templateString : template,    
        postCreate : function() {    
            this.inherited(arguments);
            
            on(this.searchBtn, 'input', function() {
                this.getFilterDetail();
            }.bind(this));
//            
//            on(this.errorBtn, 'click', function() {
//                this.hideError();
//                setTimeout(function() {
//                    this.sendRequest();
//                }.bind(this), 500);
//            }.bind(this));
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createTableHead();
            this.sendRequest();
        },
        
        createTableHead: function() {
            var me = this;
            var headItems = JSON.parse(config).data.headerItems;
            
            headItems.forEach(function(item, idx) {
                var headItem = new HeadColumn(item);
                headItem.parentView = me;
                headItem.domNode.setAttribute('data-column', idx);
                me.columnCon.appendChild(headItem.domNode);
                headItem.startup();
            });
            
        },
        
        sendRequest : function() {
            var me = this;
            var intranetID = ConsoleService.getCurrentUser().getIntranetId();
            var clients = JSON.parse(config).data.clients;
            
            me.clientNum.innerHTML = clients.length;
            me.createFilterItem();
            me.createClientBody(clients);
        },
        
        createFilterItem: function() {
            var me = this;
            
            var filterUtil = new FilterUtil();
            
            filterUtil.parentView = this;
            me.filterScrollView.scroll_con.appendChild(filterUtil.domNode);
            filterUtil.startup();
        },
        
        createClientBody: function(clients) {
            var me = this;
            
            me.showLoader();
            
            setTimeout(function() {
            	me.hideLoader();
            	clients.forEach(function(client) {
                    var smartClientList = new SmartClientList(client);
                    
                    smartClientList.parentView = me;
                    me.scrollView.scroll_con.appendChild(smartClientList.domNode);
                    smartClientList.startup();
                });
            	me.scrollView.resize();
            }, 2000);
            
        },
        
        createNoBadgeView: function() {
            domConstruct.create('div', {
                'class': 'mb-noBadgeCon',
                innerHTML: 'You don\'t have any clients available for now.'
            }, this.domNode, 'last');
        },
        
        getFilterDetail: function() {
        	
        },
        
        createTask: function() {
        	
        },
        
        _refreshFilterScroll: function() {
            this.filterScrollView.resize();
        },
        
        showCreateTaskBtn: function() {
            domClass.remove(this.createTaskBtn, 'smart-hidden');
        },
        
        hideCreateTaskBtn: function() {
            domClass.add(this.createTaskBtn, 'smart-hidden');
        },
        
        showLoader : function() {
            domClass.remove(this.loaderContainer, 'smart-hidden');
        },
        
        hideLoader : function() {
            domClass.add(this.loaderContainer, 'smart-hidden');
        },
        
        showError : function() {
            domClass.remove(this.errorContainer, 'smart-hidden');
        },
        
        hideError : function() {
            domClass.remove(this.errorContainer, 'smart-hidden');
        },
        
        _onFocus : function() {    
            this.inherited(arguments);    
        },
        
        _onBlur : function() {    
            this.inherited(arguments);    
        }
    });    
        
    return widget;    
});    
