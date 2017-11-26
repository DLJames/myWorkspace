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
        isLoadMore: false,
        showCompletedTask: false,
        postCreate: function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.searchBtn, 'input', function() {
                me.checkInputVal();
            });
            
            on(me.searchIcon, 'click', function() {
                setTimeout(function() {me.requestForClient();}, 0);
                me.emptyInput();
            });
            
            on(me.inputTip, 'click', function() {
                me.emptyInput();
            });
            
            on(me.clearAllBtn, 'click', function(evt) {
                me.clearAllFilterResult(evt);
                setTimeout(function() {me.requestForClient();}, 0);
            });
            
            on(me.filterDetail, 'click', function(evt) {
                evt.stopPropagation();
            });
            
            on(me.completedBtn, 'click', function() {
                me.showCompletedTask();
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
            
//            this.filterScrollView.scroll_con.appendChild(filterUtil.domNode);
            domConstruct.place(filterUtil.domNode, this.filterScrollView.scroll_con, 'first');
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
                city: me.cityDropdown ? me.cityDropdown.getSelectedItemsFinal() : [],
                region: me.regionDropdown ? me.regionDropdown.getSelectedItemsFinal() : [],
                country: me.countryDropdown ? me.countryDropdown.getSelectedItemsFinal() : [],
                salesPlays: me.salesplayDropdown ? me.salesplayDropdown.getSelectedItemsFinal() : [],
                industry: me.industryDropdown ? me.industryDropdown.getSelectedItemsFinal() : [],
                bookmark: me.pageNum,
                showSelectTask: false,
                clientName: me.searchBtn.value
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
            this.cityDropdown = new FilterDropdowndetail(res.city, 'city', 'location');
            this.regionDropdown = new FilterDropdowndetail(res.region, 'region', 'location');
            this.countryDropdown = new FilterDropdowndetail(res.country, 'country', 'location');
            this.salesplayDropdown = new FilterDropdowndetail(res.salesPlays, 'salesPlays', 'salesPlays');
            this.industryDropdown = new FilterDropdowndetail(res.industry, 'industry', 'industry');
            
            this.filterDeatilScrollView.scroll_con.appendChild(this.cityDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.regionDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.countryDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.salesplayDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.industryDropdown.domNode);
            
            this.dropdownList = {
                'city': this.cityDropdown,
                'region': this.regionDropdown,
                'country': this.countryDropdown,
                'salesPlays': this.salesplayDropdown,
                'industry': this.industryDropdown
            };
            
            this.filterUtilEventBind();
//            this.filterDetailEventBind();
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
            
            on(me.filterUtil, 'showFilterResult', function(data) {
                me.showFilterResult(data);
                me.requestForClient();
            });
        },
        
//        filterDetailEventBind: function() {
//            var me = this;
//            
//            for(var key in me.dropdownList) {
//                on(me.dropdownList[key], 'customFilterResult', function(data) {
//                    me.customFilterResult(data);
//                });
//            }
//        },
        
        showFilterDetail: function(data) {
            for(var key in this.dropdownList) {
                if(key === data.dataSource) {
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
        
        showFilterResult: function(data) {
            var me = this;
            var clearAllBtn, _height = 0;
            
            domConstruct.empty(me.filterResultScrollView.scroll_con);
            domConstruct.empty(me.bodyScrollView.scroll_con);
            domClass.add(me.clearAllBtn, 'smart-hidden');
            
            for(var key in me.dropdownList) {
                var currentDropdown = me.dropdownList[key];
                if(currentDropdown.filterType === data.filterType) {
                    currentDropdown.updateSelectedItem();
                    
                    me.filterResultArray.forEach(function(item, idx) {
                        if(currentDropdown.selectedItemsFinal.indexOf(item) < 0 && item.split('##')[0] === key) {
                            me.filterResultArray.splic(idx, 1);
                        }
                    });
                    
                    currentDropdown.selectedItemsFinal.forEach(function(item) {
                        if(me.filterResultArray.indexOf(item) < 0) {
                            me.filterResultArray.push(item);
                        }
                    });
                }
            }
            
            me.filterResultArray.forEach(function(item, idx) {
                var resultItem, delBtn;
                var itemArr = item.split('##');
                
                resultItem = domConstruct.create('div', {'class': 'smart-filterResult-item', 'data-source': itemArr[0]}, me.filterResultScrollView.scroll_con, 'last');
                domConstruct.create('div', {'class': '', innerHTML: itemArr[1]}, resultItem, 'last');
                delBtn = domConstruct.create('div', {'class': 'icon-delete'}, resultItem, 'last');
                
                on(delBtn, 'click', function(evt) {
                    me.clearCurrentFilterResult(evt, item);
                    setTimeout(function() {me.requestForClient();}, 0);
                });
                
                if(idx < 5) {
                    _height += resultItem.offsetHeight;
                }
                domClass.remove(me.clearAllBtn, 'smart-hidden');
            });
            
            domStyle.set(me.filterResult, 'height', _height + 'px');
            me._refreshFilterResultScroll();
            me._refreshFilterScroll();
        },
        
        clearCurrentFilterResult: function(evt, item) {
            var me = this;
            var resultItem = evt.target.parentElement;
            var dataSource = resultItem.getAttribute('data-source');
            var data = {'val': item, 'selected': false};
            var _height = resultItem.offsetHeight;
            
            domConstruct.destroy(resultItem);
            me.dropdownList[dataSource].clearData(data);
            
            me.filterResultArray.splice(me.filterResultArray.indexOf(item), 1);
            
            if(me.filterResultArray.length < 5) {
                domStyle.set(me.filterResult, 'height', me.filterResult.offsetHeight - _height + 'px');
            }
            if(me.filterResultArray.length === 0) {
                domClass.add(me.clearAllBtn, 'smart-hidden');
            }
            me._refreshFilterResultScroll();
            me._refreshFilterScroll();
        },
        
        clearAllFilterResult: function() {
            var me = this;
            
            domClass.add(me.clearAllBtn, 'smart-hidden');
            domConstruct.empty(me.filterResultScrollView.scroll_con);
            domStyle.set(me.filterResult, 'height', '0px');
            me._refreshFilterScroll();
            me.filterResultArray.length = 0;
            
            for(var key in me.dropdownList) {
                me.dropdownList[key].clearAllData();
            }
        },
        
        showCompletedTask: function() {
            var me = this;
            
//            proxy.xxx()
        },
        
        createNoBadgeView: function() {
            domConstruct.create('div', {
                'class': 'mb-noBadgeCon',
                innerHTML: 'You don\'t have any clients available for now.'
            }, this.domNode, 'last');
        },
        
        createTask: function() {
        	
        },
        
        _refreshFilterScroll: function() {
            this.filterScrollView.resize();
        },
        
        _refreshFilterResultScroll: function() {
            this.filterResultScrollView.resize();
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
        
        checkInputVal: function() {
            if(this.searchBtn.value) {
                domClass.remove(this.inputTip, 'smart-hidden');
            }else {
                domClass.add(this.inputTip, 'smart-hidden');
            }
        },
        
        emptyInput: function() {
            this.searchBtn.value = '';
            domClass.add(this.inputTip, 'smart-hidden');
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
