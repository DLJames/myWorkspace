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
    './widgets/headColumn/HeadColumn',
    './widgets/smartClientList/SmartClientList',
    'dojo/text!./config/config.json'
    
], function(declare, on, fx, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, HeadColumn, SmartClientList, config) {
    var widget = declare('', [CustomUIWidget], {    
        baseClass : 'smartClientContainer',    
        templateString : template,    
        postCreate : function() {    
            this.inherited(arguments);
//            this.setViewStyleIsNone();
            
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
                me.tableHead.appendChild(headItem.domNode);
                headItem.startup();
            });
            
        },
        
        sendRequest : function() {
            var me = this;
            var intranetID = ConsoleService.getCurrentUser().getIntranetId();
            var clients = JSON.parse(config).data.clients;
            
            
//            me.showLoader();
//            setTimeout(function() {
//                me.hideLoader();
//                
//                setTimeout(function() {
//                	if(intranetID !== 'sbaonan@cn.ibm.com' && intranetID === 'sunjdl@cn.ibm.com') {
//                		me.createNoBadgeView();
//                		me.parentView.resizeScroll();
//                		return;
//                	}
//                	if(arr && arr.length) {
//                		me.createMyBadgeView(arr);
//                		setTimeout(function() {
//                			me.showSeeMoreBtn();
//                		}, 500);
//                		me.parentView.resizeScroll();
//                	}else {
//                		me.showError();
//                	}
//                }, 600);
//            }, 2000);
            
            var filterData = [
                {
                    name: 'Location',
                    des: ''
                },{
                    name: 'Sales plays',
                    des: ''
                }, {
                    name: 'Industry',
                    des: ''
                }
            ];
            
            me.clientNum.innerHTML = clients.length;
            me.createFilterItem(filterData);
            me.createBody(clients);
        },
        
        
        createFilterItem: function(data) {
            var me = this;
            
            data.forEach(function(item) {
                domConstruct.create('div', {
                    'class': 'smart-filterItem',
                    innerHTML: '<div class="smart-filterItemName">' + item.name + '</div><div class="icon-expand-graphic"></div>'
                }, me.filterItemCon, 'last');
                
                
            });
        },
        
        createBody: function(clients) {
            var me = this;
            clients.forEach(function(client) {
                var smartClientList = new SmartClientList(client);
                
                smartClientList.parentView = me;
                me.scrollView.scroll_con.appendChild(smartClientList.domNode);
                smartClientList.startup();
            });
            this.scrollView.resize();
        },
        
        createNoBadgeView: function() {
            domConstruct.create('div', {
                'class': 'mb-noBadgeCon',
                innerHTML: 'You don\'t have any clients available for now.'
            }, this.domNode, 'last');
        },
        
        getFilterDetail: function() {
        	
        },
        
        
        
        
        
        
        
        showSeeMoreBtn : function() {
            fx.wipeIn({node : this.seeMore, duration : 500}).play();
        },
        
        showLoader : function() {
            fx.wipeIn({node : this.loaderContainer, duration : 500}).play();
        },
        
        hideLoader : function() {
            fx.wipeOut({node : this.loaderContainer, duration : 500}).play();
        },
        
        showError : function() {
            fx.wipeIn({node : this.errorContainer, duration : 500}).play();
        },
        
        hideError : function() {
            fx.wipeOut({node : this.errorContainer, duration : 500}).play();
        },
        
        setViewStyleIsNone : function() {
            domStyle.set(this.errorContainer, 'display', 'none');
            domStyle.set(this.loaderContainer, 'display', 'none');
            domStyle.set(this.seeMore, 'display', 'none');
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
