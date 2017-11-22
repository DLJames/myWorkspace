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
    './widgets/FilterDropdowndetail/FilterDropdowndetail',
    'dojo/text!./config/config.json'
    
], function(declare, on, fx, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, FilterUtil, HeadColumn, SmartClientList, FilterDropdowndetail, config) {
    var widget = declare('', [CustomUIWidget], {    
        baseClass: 'smartClientContainer',    
        templateString: template,    
        postCreate: function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.searchBtn, 'input', function() {
                me.getSearchDetail();
            });
            
            on(me.filterDetail, 'click', function(evt) {
                evt.stopPropagation();
            });
//            
//            on(me.errorBtn, 'click', function() {
//                me.hideError();
//                setTimeout(function() {
//                    me.sendRequest();
//                }, 500);
//            });
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
            me.createFilterDetail();
            me.createClientBody(clients);
        },
        
        createFilterItem: function() {
            var filterUtil = this.filterUtil = new FilterUtil();
            
            filterUtil.parentView = this;
            this.filterScrollView.scroll_con.appendChild(filterUtil.domNode);
            this.filterEventBind();
            filterUtil.startup();
        },
        
        filterEventBind: function() {
            var me = this;
            
            on(me.filterUtil, 'showFilterDetail', function(data) {
                if(data.show) {
                    me.showFilterDetail(data.filterType, data.val);
                }else {
                    me.hideFilterDetail();
                }
                
                on.once(document, 'click', function(evt) {
                    if(evt.button === 0) {
                        me.hideFilterDetail();
                    }
                });
            });
            
            on(me.filterUtil, 'refreshScroll', function(data) {
                me._refreshFilterScroll();
            });
            
            on(me.filterUtil, 'showFilterResult', function() {
                me.showFilterResult();
            });
            
        },
        
        createFilterDetail: function() {
            var me = this;
            var city = ['PARIS', 'Stabio', 'Linz', 'OOSTRUM', 'KEMPELE', 'Memmingen', 'Bielefeld'];
            var state = ['France', 'DACH', 'BeNeLux', 'Nordic', 'UKI', 'CEE', 'Italy', 'SPGI'];
            var country = ['France', 'Switzerland', 'Austria', 'Netherlands', 'Germany', 'United Kingdom','Italy','Finland','Spain','Switzerland','Denmark','Czech Republic','Finland','Netherlands','Poland','Sweden','Austria','Finland'];
            var salesplay = ['SMARTSP-Power_SCO', 'SMARTSP-Tivoli_Refresh', 'SMARTSP-Spectrum_Anniversary', 'SMARTSP-MSP/CSP'];
            var industry = ['Computer Service', 'Printing & Publishing', 'DP Education', 'Consumer Products', 'Consumer Products', 'Wholesale Distribution & Services', 'Life Sciences', 'Wholesale Distribution & Services'];
            
            me.cityDropdown = new FilterDropdowndetail(city);
            me.stateDropdown = new FilterDropdowndetail(state);
            me.countryDropdown = new FilterDropdowndetail(country);
            me.salesplayDropdown = new FilterDropdowndetail(salesplay);
            me.industryDropdown = new FilterDropdowndetail(industry);
            
            me.filterDeatilScrollView.scroll_con.appendChild(me.cityDropdown.domNode);
            me.filterDeatilScrollView.scroll_con.appendChild(me.stateDropdown.domNode);
            me.filterDeatilScrollView.scroll_con.appendChild(me.countryDropdown.domNode);
            me.filterDeatilScrollView.scroll_con.appendChild(me.salesplayDropdown.domNode);
            me.filterDeatilScrollView.scroll_con.appendChild(me.industryDropdown.domNode);
            
            me.dropdownList = [
               {filterType: 'city', obj: me.cityDropdown},
               {filterType: 'state', obj: me.stateDropdown},
               {filterType: 'country', obj: me.countryDropdown},
               {filterType: 'salesplay', obj: me.salesplayDropdown},
               {filterType: 'industry', obj: me.industryDropdown}
           ]
            
            me.filterDetailEventBind();
        },
        
        filterDetailEventBind: function() {
            var me = this;
            
            me.dropdownList.forEach(function(item) {
                on(item.obj, 'customFilterResult', function(data) {
                    me.customFilterResult(data);
                });
            });
        },
        
        customFilterResult: function(data) {
            if(!this.filterResultArray) {
                this.filterResultArray = [];
            }
            
            if(!this.filterResultArray.length) {
                this.filterResultArray.push(data.val);
                return;
            }
            var _idx = this.filterResultArray.indexOf(data.val)
            
            if(data.customType === 'add' && _idx< 0) {
                this.filterResultArray.push(data.val);
                console.log('arr===', this.filterResultArray)
                return;
            }
            
            if(data.customType === 'remove' && _idx >= 0) {
                this.filterResultArray.splice(_idx, 1);
                console.log('arr===', this.filterResultArray)
                return;
            }
            
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
        
        showFilterDetail: function(filterType, val) {
            this.dropdownList.forEach(function(item) {
                if(item.filterType === filterType) {
                    item.obj._filter(val);
                    domStyle.set(item.obj.domNode, 'display', 'block');
                }else {
                    domStyle.set(item.obj.domNode, 'display', 'none');
                }
            });
            domClass.remove(this.filterDetail, 'smart-hidden');
            this._refreshFilterDetailScroll();
        },
        
        hideFilterDetail: function() {
            domClass.add(this.filterDetail, 'smart-hidden');
        },
        
        showFilterResult: function() {
            var me = this;
            var clearAllBtn;
            
            domConstruct.empty(me.filterResult);
            
            me.filterResultArray.forEach(function(item) {
                var resultItem, delBtn;
                
                resultItem = domConstruct.create('div', {'class': 'smart-filterResult-item'}, me.filterResult, 'last');
                domConstruct.create('div', {'class': '', innerHTML: item}, resultItem, 'last');
                delBtn = domConstruct.create('div', {'class': 'icon-delete'}, resultItem, 'last');
                
                on(delBtn, 'click', function(evt) {
                    domConstruct.destroy(evt.target.parentElement);
                    me.customFilterResult(data);
                });
            });
            
//            clearAllBtn = domConstruct.create('div', {'class': 'smart-filterResult-item smart-clearAll icon-delete'}, me.filterResult, 'last');
//            
//            on(clearAllBtn, 'click', function(evt) {
//                domConstruct.empty(me.filterResult);
//            });
        },
        
        _refreshFilterScroll: function() {
            this.filterScrollView.resize();
        },
        
        _refreshFilterDetailScroll: function() {
            this.filterDeatilScrollView.resize();
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
