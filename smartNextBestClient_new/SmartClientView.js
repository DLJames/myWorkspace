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
    'dojo/text!./config/config.json',
    'dojo/text!./config/filterDetail.json'
    
], function(declare, on, fx, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, FilterUtil, HeadColumn, SmartClientList, FilterDropdowndetail, config, filterDetailJSON) {
    var widget = declare('', [CustomUIWidget], {    
        baseClass: 'smartClientContainer',    
        templateString: template,    
        filterResultArray: [],
        pageNum: 0,
        postCreate: function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.searchBtn, 'input', function() {
                me.getSearchDetail();
            });
            
            on(me.filterDetail, 'click', function(evt) {
                evt.stopPropagation();
            });
            
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
            this.createFilterUtil();
            this.requestForFilter();
            this.requestForClient();
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
        
        createFilterUtil: function() {
            var filterUtil = this.filterUtil = new FilterUtil();
            
            this.filterScrollView.scroll_con.appendChild(filterUtil.domNode);
            filterUtil.startup();
        },
        
        requestForFilter : function() {
            var me = this;
            var intranetID = ConsoleService.getCurrentUser().getIntranetId();
            var res = JSON.parse(filterDetailJSON).data;
            
//            var xxx = proxy.xxx();
            
            me.createFilterDetail(res);
        },
        
        requestForClient: function() {
            var me = this;
            var intranetID = ConsoleService.getCurrentUser().getIntranetId();
            var clients = JSON.parse(config).data.clients;
            var params = JSON.stringify({
                city: me.cityDropdown ? me.cityDropdown.selectedItems : [],
                region: me.regionDropdown ? me.regionDropdown.selectedItems : [],
                country: me.countryDropdown ? me.countryDropdown.selectedItems : [],
                salesPlays: me.salesplayDropdown ? me.salesplayDropdown.selectedItems : [],
                industry: me.industryDropdown ? me.industryDropdown.selectedItems : [],
                pageIndex: me.pageNum
            });
            
            console.log('filter====',params);
            
//          var yyy = proxy.yyy();
          
            me.showLoader();
            setTimeout(function() {
                me.hideLoader();
                me.clientNum.innerHTML = clients.length;
                me.createClientEntity(clients);
            }, 2000);
        },
        
        createFilterDetail: function(res) {
            this.cityDropdown = new FilterDropdowndetail(res.city, 'filterOpt', 'city');
            this.regionDropdown = new FilterDropdowndetail(res.region, 'filterOpt', 'region');
            this.countryDropdown = new FilterDropdowndetail(res.country, 'filterOpt', 'country');
            this.salesplayDropdown = new FilterDropdowndetail(res.salesPlays, 'filterOpt', 'salesPlays');
            this.industryDropdown = new FilterDropdowndetail(res.industry, 'filterOpt', 'industry');
            
            this.filterDeatilScrollView.scroll_con.appendChild(this.cityDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.regionDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.countryDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.salesplayDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.industryDropdown.domNode);
            
//            this.dropdownList = [
//               {filterType: 'city', obj: this.cityDropdown},
//               {filterType: 'state', obj: this.regionDropdown},
//               {filterType: 'country', obj: this.countryDropdown},
//               {filterType: 'salesplay', obj: this.salesplayDropdown},
//               {filterType: 'industry', obj: this.industryDropdown}
//           ];
            
            this.dropdownList = {
                'city': this.cityDropdown,
                'region': this.regionDropdown,
                'country': this.countryDropdown,
                'salesPlays': this.salesplayDropdown,
                'industry': this.industryDropdown
            };
            
            this.filterUtilEventBind();
            this.filterDetailEventBind();
        },
        
        createClientEntity: function(clients) {
            var me = this;
            
            clients.forEach(function(item) {
                var smartClientList;
                
                smartClientList = new SmartClientList(item);
                smartClientList.parentView = me;
                me.bodyScrollView.scroll_con.appendChild(smartClientList.domNode);
                smartClientList.startup();
            });
            
            me._refreshClientBodyScroll();
        },
        
        loadMore: function() {
        	
        }
        
        filterUtilEventBind: function() {
            var me = this;
            
            on(me.filterUtil, 'showFilterDetail', function(data) {
                if(data.show) {
                    me.showFilterDetail(data);
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
                me.requestForClient();
            });
        },
        
        filterDetailEventBind: function() {
            var me = this;
            
            for(var key in me.dropdownList) {
                on(me.dropdownList[key], 'customFilterResult', function(data) {
                    me.customFilterResult(data);
                });
            }
        },
        
        showFilterDetail: function(data) {
            for(var key in this.dropdownList) {
                if(key === data.filterType) {
                    this.dropdownList[key]._filter(data.val);
                    domStyle.set(this.dropdownList[key].domNode, 'display', 'block');
                }else {
                    domStyle.set(this.dropdownList[key].domNode, 'display', 'none');
                }
            }
            domClass.remove(this.filterDetail, 'smart-hidden');
            this._refreshFilterDetailScroll();
        },
        
        hideFilterDetail: function() {
            domClass.add(this.filterDetail, 'smart-hidden');
        },
        
        customFilterResult: function(data) {
            var _idx = this.filterResultArray.indexOf(data.val);
            
            if(data.customType === 'add' && _idx < 0) {
                this.filterResultArray.push(data.val);
                console.log('arr===', this.filterResultArray)
            }
            
            if(data.customType === 'remove' && _idx >= 0) {
                this.filterResultArray.splice(_idx, 1);
                console.log('arr===', this.filterResultArray)
            }
            
        },
        
        showFilterResult: function() {
            var me = this;
            var clearAllBtn, viewAllBtn;
            var filterTopFive = me.filterResultArray.slice(0, 5) || [];
            var filterRest = me.filterResultArray.slice(5) || [];
            
            domConstruct.empty(me.filterResult);
            domConstruct.empty(me.bodyScrollView.scroll_con);
            
            filterTopFive.forEach(function(item) {
                var resultItem, delBtn;
                var itemArr = item.split('-');
                
                resultItem = domConstruct.create('div', {'class': 'smart-filterResult-item', 'data-source': itemArr[0]}, me.filterResult, 'last');
                domConstruct.create('div', {'class': '', innerHTML: itemArr[1]}, resultItem, 'last');
                delBtn = domConstruct.create('div', {'class': 'icon-delete'}, resultItem, 'last');
                
                on(delBtn, 'click', function(evt) {
                    var dataSource = evt.target.parentElement.getAttribute('data-source');
                    var data = {'val': item, 'customType': 'remove'};
                    
                    domConstruct.destroy(evt.target.parentElement);
                    me.customFilterResult(data);
                    me.dropdownList[dataSource].clearData(data);
                    me._refreshFilterScroll();
                    setTimeout(function() {me.requestForClient();}, 0);
                });
            });
            
            clearAllBtn = domConstruct.create('div', {'class': 'smart-filterResult-item smart-clearAll icon-delete'}, me.filterResult, 'last');
            
            on(clearAllBtn, 'click', function(evt) {
                me.clearAllFilterResult();
                setTimeout(function() {me.requestForClient();}, 0);
            });
            
            if(filterRest.length) {
                viewAllBtn = domConstruct.create('div', {'class': 'smart-filterResult-item smart-viewAll', innerHTML: 'View all ...'}, me.filterResult, 'last');
                on(viewAllBtn, 'click', function(evt) {
                    
                });
//                me.filterRestDropdown = new FilterDropdowndetail(filterRest, 'filterRest');
//                me.filterDeatilScrollView.scroll_con.appendChild(me.cityDropdown.domNode);
            }
            
            me._refreshFilterScroll();
        },
        
        clearCurrentFilterResult: function() {
        	
        },
        
        clearAllFilterResult: function() {
            var me = this;
            
            domConstruct.empty(me.filterResult);
            me._refreshFilterScroll();
            me.filterResultArray.length = 0;
            
//            me.dropdownList.forEach(function(item) {
//                item.obj.clearAllData();
//            });
            
            for(var key in me.dropdownList) {
                me.dropdownList[key].clearAllData();
            }
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
        
        _refreshFilterDetailScroll: function() {
            this.filterDeatilScrollView.resize();
        },
        
        _refreshClientBodyScroll: function() {
            this.bodyScrollView.resize();
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
