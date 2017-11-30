define([    
    'dojo/_base/declare',
    'dojo/on',
    'dojo/fx',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'comlib/ui/IScrollView',
    'app/services/ConsoleService',
    './proxy/proxy',
    'dojo/text!./config/config.json',
    './widgets/FilterUtil/FilterUtil',
    './widgets/HeadColumn/HeadColumn',
    './widgets/smartClientList/SmartClientList',
    './widgets/FilterDropdowndetail/FilterDropdowndetail',
    './widgets/PagingUtil/PagingUtil'
    
], function(declare, on, fx, domAttr, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, config, FilterUtil, HeadColumn, SmartClientList, FilterDropdowndetail, PagingUtil) {
    var widget = declare('', [CustomUIWidget], {    
        baseClass: 'smartClientContainer',    
        templateString: template,    
        serialNumber: ConsoleService.getCurrentUser().getSerialNumber(),
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        totalClientList: [],
        pendingTaskArr: [],
        createdTaskArr: [],
        filterResultArray: [],
        pageNum: 0,
        completedTaskFlag: false,
        postCreate: function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.searchBtn, 'input', function() {
                me.checkSearchVal();
            });
            
            on(me.searchBtn, 'blur', function() {
                me.emptyInput();
            });
            
            on(me.searchIcon, 'click', function() {
                me.searchBtn.value = domAttr.get(me.searchIcon, 'data-searchMsg');
                me.requestForClient();
                domAttr.set(me.searchIcon, 'data-searchMsg', '');
                me.emptyInput();
            });
            
            on(me.inputTip, 'click', function() {
                me.emptyInput();
            });
            
            on(me.clearAllBtn, 'click', function(evt) {
                me.clearAllFilterResult(evt);
                me.requestForClient();
            });
            
            on(me.filterDetail, 'click', function(evt) {
                evt.stopPropagation();
            });
            
            on(me.completedBtn, 'click', function() {
                me.showCompletedTask();
            });
            
            on(me.errorBtn, 'click', function() {
                me.requestForClient();
            });
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
            
            domConstruct.place(filterUtil.domNode, this.filterScrollView.scroll_con, 'first');
            filterUtil.startup();
        },
        
        requestForFilter : function() {
            var me = this;
            
            proxy.getFilter().then(function(res) {
                if(res.data) {
                    me.createFilterDetail(res.data);
                }
            }, function() {
                
            });
        },
        
        requestForClient: function(bookmark) {
            var me = this;
            var params = {
                data: JSON.stringify({
                    'clientName': me.searchBtn ? me.searchBtn.value : '',
                    'market': me.marketDropdown ? me.marketDropdown.getSelectedItemsFinal() : [],
                    'city': me.cityDropdown ? me.cityDropdown.getSelectedItemsFinal() : [],
                    'country': me.countryDropdown ? me.countryDropdown.getSelectedItemsFinal() : [],
                    'salesPlays': me.salesplayDropdown ? me.salesplayDropdown.getSelectedItemsFinal() : [],
                    'industry': me.industryDropdown ? me.industryDropdown.getSelectedItemsFinal() : [],
                    'bookmark': bookmark || '',
                    'employee_cnum': '057568613',//me.serialNumber || '',
                    'email': me.intranetID || '',
                    'task_status': me.taskStatus || ''
                })
            };
            
            console.log('filter====',params);
            
            if(!bookmark) {
                me.totalClientList.length = 0;
            }
            
            if(me._proxy && !me._proxy.isFulfilled()) {
                me._proxy.cancel();
            }
            
            me.hideError();
            me.showLoader();
            me._proxy = proxy.bestClients(params);
            me._proxy.then(function(res) {
                var data = res.data, clients, totalData, _bookmark;
                
                me.hideLoader();
                if(res.errorCode || !data || !data.docs) {
                    me.showError();
                    return;
                }
                clients = data.docs;
                totalData = data.total_rows;
                _bookmark = data.bookmark;
                me.clientNum.innerHTML = totalData;
                me.bookmark = _bookmark;
                me.createClientEntity(clients, bookmark);
                if(!bookmark) {
                    me.createPagingView(totalData);
                }
            }, function() {
                me.hideLoader();
                me.showError();
            });
        },
        
        createFilterDetail: function(data) {
            this.cityDropdown = new FilterDropdowndetail(data.city, 'city', 'location');
            this.marketDropdown = new FilterDropdowndetail(data.market, 'market', 'location');
            this.countryDropdown = new FilterDropdowndetail(data.country, 'country', 'location');
            this.salesplayDropdown = new FilterDropdowndetail(data.salesPlays, 'salesPlays', 'salesPlays');
            this.industryDropdown = new FilterDropdowndetail(data.industry, 'industry', 'industry');
            
            this.filterDeatilScrollView.scroll_con.appendChild(this.cityDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.marketDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.countryDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.salesplayDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.industryDropdown.domNode);
            
            this.dropdownList = {
                'city': this.cityDropdown,
                'market': this.marketDropdown,
                'country': this.countryDropdown,
                'salesPlays': this.salesplayDropdown,
                'industry': this.industryDropdown
            };
            
            this.filterUtilEventBind();
//            this.filterDetailEventBind();
        },
        
        createClientEntity: function(clients, bookmark) {
            var me = this;
            var smartClientListCon;
            
            if(!bookmark) {
                domConstruct.empty(me.bodyScrollView.scroll_con);
            }else {
                me.totalClientList.forEach(function(item) {
                    domClass.add(item, 'smart-hidden');
                });
            }
            
            smartClientListCon = domConstruct.create('div', {
                'class': 'smart-smartClientListCon', 
                'data-bookmark': bookmark
            }, me.bodyScrollView.scroll_con, 'last');
            
            if(!clients.length) {
                me.createNoClientsView(smartClientListCon);
            }
            
            clients.forEach(function(item) {
                var smartClientList;
                
                smartClientList = new SmartClientList(item);
                smartClientList.parentView = me;
                domConstruct.place(smartClientList.domNode, smartClientListCon, 'last');
                smartClientList.startup();
                
                on(smartClientList, 'addPendingTask', function(data) {
                    me.addPendingTask(data);
                });
                
                on(smartClientList, 'showScTaskDialog', function(data) {
                    me.showScTaskDialog(data);
                });
                
                on(smartClientList, 'clearPendingTask', function() {
                    me.clearPendingTask();
                });
                
                on(smartClientList, 'hideCreateTaskBtn', function() {
                    me.hideCreateTaskBtn();
                });
            });
            me.totalClientList.push(smartClientListCon);
            
            me.totalClientList.forEach(function(item, idx) {
                if(idx === me.totalClientList.length - 1) {
                    domClass.remove(item, 'smart-hidden');
                    me.pagingUtil.changeCurrentPage(me.totalClientList.length);
                }else {
                    domClass.add(item, 'smart-hidden');
                }
            });
            
            me._refreshClientBodyScroll();
        },
        
        createPagingView: function(totalData) {
            var me = this;
            
            me.pagingUtil.createView(totalData);
            on(me.pagingUtil, 'goToPage', function(data) {
                me.goToPage(data);
            });
        },
        
        disablePagingView: function() {
            me.pagingUtil.disableView();
        },
        
        goToPage: function(data) {
            var me = this;
            var bookmark = me.bookmark;
            var pageNum = data.pageNum;
            var totalClientList = me.totalClientList;
            var clientList = totalClientList[pageNum - 1];
            
            if(clientList) {
                totalClientList.forEach(function(item) {
                    domClass.add(item, 'smart-hidden');
                });
                
                domClass.remove(clientList, 'smart-hidden');
                me._refreshClientBodyScroll();
                return;
            }
            
            if(data.type === 'next') {
                me.requestForClient(bookmark);
            }
        },
        
        addPendingTask: function(data) {
            var clicentIdentify = data.clicentIdentify;
            
            if(data.selected) {
                this.pendingTaskArr.push(data);
            }
            
            if(!data.selected) {
                this.pendingTaskArr = this.pendingTaskArr.filter(function(item) {
                    return item.clicentIdentify !== clicentIdentify;
                });
            }
            
            this.checkPendingTaskArr();
            
            console.log('=====this.pendingTaskArr====', this.pendingTaskArr);
        },
        
        checkPendingTaskArr: function() {
            if(this.pendingTaskArr.length) {
                this.showCreateTaskBtn();
            }else {
                this.hideCreateTaskBtn();
            }
        },
        
        createScTask: function() {
            var me = this;
            
            me.showLoader();
            me.pendingTaskArr.forEach(function(item) {
                item.clientEntity.createScTask();
            });
            me.hideLoader();
        },
        
        clearPendingTask: function() {
            var me = this;
            
            me.pendingTaskArr.forEach(function(item) {
                me.createdTaskArr.push(item);
            });
            me.pendingTaskArr.length = 0;
            me.hideCreateTaskBtn();
        },
        
        showScTaskDialog: function(data) {
            var me = this;
            var scTask;
            
            scTask = new scTaskDetail(data);
//            on(scTask, 'ss', function() {
//                
//            });
            this.domNode.appendChild(scTask.domNode);
            scTask.startup();
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
                    me.requestForClient();
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
        
        createNoClientsView: function(parentNode) {
            domConstruct.create('div', {
                'class': 'smart-noClientsCon',
                innerHTML: 'You don\'t have any clients available for now.'
            }, parentNode, 'last');
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
        
        hideCreateTaskBtn: function() {
            domClass.add(this.createTaskBtn, 'smart-hidden');
        },
        
        checkSearchVal: function() {
            var val = this.searchBtn.value;
            
            if(val) {
                domClass.remove(this.inputTip, 'smart-hidden');
            }else {
                domClass.add(this.inputTip, 'smart-hidden');
            }
            
            domAttr.set(this.searchIcon, 'data-searchMsg', val);
        },
        
        emptyInput: function() {
            this.searchBtn.value = '';
            domClass.add(this.inputTip, 'smart-hidden');
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
            domClass.add(this.errorContainer, 'smart-hidden');
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
