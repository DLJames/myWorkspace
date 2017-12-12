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
    './widgets/PagingUtil/PagingUtil',
    './widgets/SCTaskDetail/scTaskDetail',
    './widgets/TaskConfirmDialog/TaskConfirmDialog',
    './widgets/MsgTooltip/MsgTooltip'
    
], function(declare, on, fx, domAttr, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, config, FilterUtil, HeadColumn, SmartClientList, FilterDropdowndetail, PagingUtil, scTaskDetail, TaskConfirmDialog, MsgTooltip) {
    var widget = declare('', [CustomUIWidget], {
        baseClass: 'smartClientContainer',    
        templateString: template,    
        serialNumber: ConsoleService.getCurrentUser().getSerialNumber(),
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        filterDataObj: {},
        totalClientEntityList: [],
        totalClientList: [],
        pendingTaskArr: [],
        createdTaskArr: [],
        filterResultArray: [],
        sortabledHeadItems: [],
        taskProxyTotalNum: 0,
        taskProxySuccessNum: 0,
        searchBtnVal: '',
        taskStatus: '',
        sortType: 'Unique_Rank_per_Rep',
        sortByDesc: false,
        postCreate: function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.searchBtn, 'input', function() {
                me.checkSearchVal();
            });
            
            on(me.searchBtn, 'keyup', function(evt) {
                if(evt.key === "Enter" || evt.keyCode === 13) {
                    me.filterBySearchBtnVal();
                }
            });
            
            on(me.searchIcon, 'click', function() {
                me.filterBySearchBtnVal();
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
            
//            on(me.completedBtn, 'click', function(evt) {
//                me.showCompletedTask(evt);
//            });
            
            on(me.pagingUtil, 'goToPage', function(data) {
                me.showLoader();
                setTimeout(function() {
                    me.hideLoader();
                    me.goToPage(data);
                }, 1000);
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
        
        parentCalled: function(){
            var me = this;
            
            ConsoleService.logActivity('13193', 'D12');
            me._refreshFilterResultScroll();
            me._refreshClientBodyScroll();
        },
        
        createTableHead: function() {
            var me = this;
            var headItems = JSON.parse(config).data.headerItems;
            
            headItems.forEach(function(item) {
                var headItem;
                
                headItem = new HeadColumn(item);
                me.columnCon.appendChild(headItem.domNode);
                headItem.startup();
                
                on(headItem, 'sortRequest', function(data) {
                    me.sortType = data.sortType;
                    if(data.sortByDesc === 'desc') {
                        me.sortByDesc = true;
                    }else {
                        me.sortByDesc = false;
                    }
                    me.requestForClient();
                });
                
                on(headItem, 'changeActiveHeadItem', function(data) {
                    me.changeActiveHeadItem(data.activeItem);
                });
                if(item.sortable) {
                    me.sortabledHeadItems.push(headItem);
                }
            });
        },
        
        changeActiveHeadItem: function(activeItem) {
            var me = this;
            
            me.sortabledHeadItems.forEach(function(item) {
                if(item.data.title !== activeItem.data.title) {
                    item.initMe();
                }
            });
        },
        
        createFilterUtil: function() {
            var filterUtil = this.filterUtil = new FilterUtil();
            
            domConstruct.place(filterUtil.domNode, this.filterScrollView.scroll_con, 'first');
            filterUtil.startup();
        },
        
        requestForFilter : function() {
            var me = this;
            
            proxy.getFilter(me.intranetID).then(function(res) {
                if(res.data) {
                    me.filterDataObj = res.data;
                    me.createFilterDetail(res.data);
                }
            }, function() {
                
            });
        },
        
        requestForClient: function(bookmark) {
            var me = this;
            var params = {
                data: JSON.stringify({
                    'clientName': me.searchBtnVal || '',
                    'market': me.marketDropdown ? me.marketDropdown.getSelectedItemsFinal() : [],
                    'city': me.cityDropdown ? me.cityDropdown.getSelectedItemsFinal() : [],
                    'country': me.countryDropdown ? me.countryDropdown.getSelectedItemsFinal() : [],
                    'salesPlays': me.salesplayDropdown ? me.salesplayDropdown.getSelectedItemsFinal() : [],
                    'industry': me.industryDropdown ? me.industryDropdown.getSelectedItemsFinal() : [],
                    'bookmark': bookmark || '',
                    'employee_cnum': location.host === 'csa.dst.ibm.com' ? me.serialNumber : '057568613',
                    'email': me.intranetID || '',
                    'task_status': me.taskStatus || '',
                    'sort': me.sortType || '',
                    'desc': me.sortByDesc
                })
            };
            
//            console.log('filter====',params);
            
            if(!bookmark) {
                me.totalClientList.length = 0;
            }
            
            me.clearPendingTask();
            
//            me.hideError();
            me.showLoader();
            proxy.bestClients(params).then(function(res) {
                var data = res.data, clients = [], totalData = '', _bookmark = '';
                
                me.hideLoader();
                if(res.errorCode || !data || !data.docs) {
//                    me.showError();
                    return;
                }
                try {
                    clients = data.docs;
                    totalData = data.total_rows;
                    _bookmark = data.bookmark;
                    me.clientNum.innerHTML = totalData;
                    me.bookmark = _bookmark;
                    me.createClientEntity(clients, bookmark);
                    if(!bookmark) {
                        me.pagingUtil.createView(totalData);
                    }
                } catch (e) {
                    // TODO: handle exception
                    console.log('error====', e);
                }
            }, function() {
                me.hideLoader();
//                me.showError();
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
            this.filterDetailEventBind();
        },
        
        createClientEntity: function(clients, bookmark) {
            var me = this;
            var smartClientListCon;
            var clientList = [];
            
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
                
//                on(smartClientList, 'clearPendingTask', function() {
//                    me.clearPendingTask();
//                });
                
//                on(smartClientList, 'hideCreateTaskBtn', function() {
//                    me.hideCreateTaskBtn();
//                });
                
                on(smartClientList, 'showReasons', function(data) {
                    me.showReasons(data);
                });
                
                on(smartClientList, 'createTaskSuccess', function() {
                    me.createTaskSuccess();
                });
                
                on(smartClientList, 'createTaskFail', function() {
                    me.createTaskFail();
                });
                
                
                
                clientList.push(smartClientList);
            });
            me.totalClientEntityList.push(clientList);
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
        
        showReasons: function(data) {
            var me = this;
            var _data = {'bodyClassName': 'smart-tooltip-left', 'tooltipTitle': 'Reasons for call', 'commonMsg': ''};
            var salesPlaysArr = me.filterDataObj.salesPlays || [];
            
            if(!salesPlaysArr.length) {
                _data.commonMsg += '<div>- no sales plays found</div>';
            }
            
            salesPlaysArr.forEach(function(item) {
                if(data[item] > 0) {
                    _data.commonMsg += '<div class="smart-tooltip-left">- ' + item + '</div>';
                }
            });
            me.showTooltipDialog(_data);
        },
        
        goToPage: function(data) {
            var me = this;
            var bookmark = me.bookmark;
            var pageNum = data.pageNum;
            var totalClientList = me.totalClientList;
            var clientList = totalClientList[pageNum - 1];
            var clientEntityList = me.totalClientEntityList[pageNum - 1];
            
            me.pendingTaskArr.forEach(function(item) {
                item.smartClientItem.optBtn.set('checked', false);
            });
            
            me.clearPendingTask();
            
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
            var _id = data._id;
            
            if(data.selected) {
                this.pendingTaskArr.push(data);
            }
            
            if(!data.selected) {
                this.pendingTaskArr = this.pendingTaskArr.filter(function(item) {
                    return item._id !== _id;
                });
            }
            
            if(this.pendingTaskArr.length) {
                this.showCreateTaskBtn();
            }else {
                this.hideCreateTaskBtn();
            }
            
//            console.log('=====this.pendingTaskArr====', this.pendingTaskArr);
        },
        
        showConfirmDialog: function() {
            var me = this;
            var taskConfirmDialog;
            var clientNames= me.pendingTaskArr;
            
            taskConfirmDialog = new TaskConfirmDialog(clientNames);
            on(taskConfirmDialog, 'createScTask', function() {
                me.createScTask();
            });
            document.querySelector('.myclients_container').appendChild(taskConfirmDialog.domNode);
            taskConfirmDialog.startup();
        },
        
        createScTask: function() {
            var me = this;
            
            ConsoleService.logActivity('13194', 'D12');
            me.showLoader();
            me.pendingTaskArr.forEach(function(item) {
                item.smartClientItem.createScTask();
            });
        },
        
        createTaskSuccess: function() {
            this.taskProxyTotalNum ++;
            this.taskProxySuccessNum ++;
            if(this.pendingTaskArr.length === this.taskProxyTotalNum) {
                this.createTaskFinish();
            }
        },
        
        createTaskFail: function() {
            this.taskProxyTotalNum ++;
            if(this.pendingTaskArr.length === this.taskProxyTotalNum) {
                this.createTaskFinish();
            }
        },
        
        createTaskFinish: function() {
            var me = this;
            var data = {'bodyClassName': 'smart-tooltip-center'};
            var taskProxyTotalNum = me.taskProxyTotalNum;
            var taskProxySuccessNum = me.taskProxySuccessNum;
            
            me.hideLoader();
            me.clearPendingTask();
            if(taskProxySuccessNum === taskProxyTotalNum) {
                data.tooltipTitle = 'Success';
                data.commonMsg = '<div>' + taskProxyTotalNum + ' new tasks have been created in SalesConnect.</div>';
            }else if(taskProxySuccessNum === 0) {
                data.tooltipTitle = 'Error';
                data.commonMsg = '<div>It wasn’t possible to create/edit tasks in SalesConnect due to API restriction, please try it again later.</div>';
            }else {
                data.tooltipTitle = 'Partially completed';
                data.commonMsg = '<div>' + taskProxySuccessNum + ' of ' + taskProxyTotalNum + ' tasks have been created in SalesConnect. Not all the tasks have been created due to SalesConnect API limitation, please try it again soon.</div>';
            }
            
            me.taskProxyTotalNum = 0;
            me.taskProxySuccessNum = 0;
            me.showTooltipDialog(data);
        },
        
        clearPendingTask: function() {
            var me = this;
            
//            me.pendingTaskArr.forEach(function(item) {
//                me.createdTaskArr.push(item);
//            });
            me.pendingTaskArr.length = 0;
            me.hideCreateTaskBtn();
        },
        
        showScTaskDialog: function(data) {
            var me = this;
            var scTask;
            
            scTask = new scTaskDetail(data.params);
            
            on(scTask, 'updateTaskData', function(resData) {
                data.smartClientItem.updateTaskData(resData);
            });
            
            on(scTask, 'showTooltipDialog', function(_data) {
                me.showTooltipDialog(_data);
            });
            document.querySelector('.myclients_container').appendChild(scTask.domNode);
            scTask.startup();
        },
        
        filterUtilEventBind: function() {
            var me = this;
            
            on(me.filterUtil, 'showFilterDetail', function(data) {
                me.showFilterDetail(data);
                
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
        
        filterDetailEventBind: function() {
            var me = this;
            
            for(var key in me.dropdownList) {
                on(me.dropdownList[key], 'showFilterDoneBtn', function(data) {
                    me.filterUtil.showFilterDoneBtn(data);
                });
            }
        },
        
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
                    currentDropdown.selectedItemsFinal.forEach(function(item) {
                        if(!me.filterResultArray.includes(item)) {
                            me.filterResultArray.push(item);
                        }
                    });
                }
            }
            
            me.filterResultArray.forEach(function(item, idx) {
                var resultItem, delBtn;
                var itemArr = item.split('##');
                
                resultItem = domConstruct.create('div', {'class': 'smart-filterResult-item', 'data-source': itemArr[0]}, me.filterResultScrollView.scroll_con, 'last');
                domConstruct.create('div', {'class': '', innerHTML: itemArr[1].split('_').join(' ')}, resultItem, 'last');
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
            var _height = resultItem.offsetHeight;
            
            domConstruct.destroy(resultItem);
            me.dropdownList[dataSource].clearCurrentData(item);
            
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
        
//        showCompletedTask: function(evt) {
//            this.taskStatus = evt.target.checked ? 'Completed' : '';
//            this.requestForClient();
//        },
        
        createNoClientsView: function(parentNode) {
            domConstruct.create('div', {
                'class': 'smart-noClientsCon',
                innerHTML: 'You don\'t have any clients available for now.'
            }, parentNode, 'last');
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
        
        filterBySearchBtnVal: function() {
            var arr = ['+', '-', '&', '|', '!', '(', ,')', '{', '}', '[', ']', '^', '"', '~', '*', '?', ':', '\\', '/'];
            
            this.searchBtnVal = this.searchBtn.value.trim().split('').filter(function(item) {
                return arr.indexOf(item) < 0;
            }).join('');
            
//            this.searchBtnVal = this.searchBtn.value;
            this.requestForClient();
        },
        
        emptyInput: function() {
            this.searchBtn.value = '';
            this.searchBtnVal = '';
            domClass.add(this.inputTip, 'smart-hidden');
            this.requestForClient();
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
        
        hideError: function() {
            domClass.add(this.errorContainer, 'smart-hidden');
        },
        
        showTooltipDialog: function(data) {
            var msgTooltip;
            
            msgTooltip = new MsgTooltip(data);
            document.querySelector('.myclients_container').appendChild(msgTooltip.domNode);
            msgTooltip.startup();
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
            this.bodyScrollView._scrollToPosition(0);
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
