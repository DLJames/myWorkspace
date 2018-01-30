define([    
    'dojo/_base/declare',
    'dojo/Stateful',
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
    './widgets/CustomHeadColumn/CustomHeadColumn',
    './widgets/smartClientList/SmartClientList',
    './widgets/FilterDropdowndetail/FilterDropdowndetail',
    './widgets/PagingUtil/PagingUtil',
    './widgets/SCTaskDetail/scTaskDetail',
    './widgets/TaskConfirmDialog/TaskConfirmDialog',
    './widgets/MsgTooltip/MsgTooltip'
    
], function(declare, Stateful, on, fx, domAttr, domStyle, domClass, domConstruct, template, CustomUIWidget, IScrollView, ConsoleService, proxy, config, FilterUtil, HeadColumn, CustomHeadColumn, SmartClientList, FilterDropdowndetail, PagingUtil, scTaskDetail, TaskConfirmDialog, MsgTooltip) {
    var widget = declare('', [CustomUIWidget], {
        baseClass: 'smartClientContainer',    
        templateString: template,    
        serialNumber: ConsoleService.getCurrentUser().getSerialNumber(),
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        filterDataObj: {},
        specialFilterDetail: {},
        totalClientItemList: [],
        totalClientConList: [],
        pendingTaskArr: [],
        filterResultArray: [],
        defaultColumns: [],
        totalHeadItems: [],
        sortabledHeadItems: [],
        taskProxyTotalNum: 0,
        taskProxySuccessNum: 0,
        searchBtnVal: '',
        taskStatus: '',
        tasks: [],
        sortType: 'Unique_Rank_per_Rep',
        sortByDesc: false,
        clientsRequestDone: false,
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
            
            on(me.filterUtil, 'createFilterDetail', function(data) {
                me.filterDataObj = data;
                me.createFilterDetail(data);
            });
            
            on(me.errorBtn, 'click', function() {
                me.requestForClient();
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createTableHead();
//            this.createFilterUtil();
//            this.requestForFilter();
            this.requestForClient();
        },
        
        parentCalled: function(){
            var me = this;
            
            ConsoleService.logActivity('13193', 'D12');
            me._refreshFilterScroll();
            me._refreshFilterResultScroll();
            me._refreshClientBodyScroll();
        },
        
        createTableHead: function() {
            var me = this;
            var customHeadColumn;
            var headItems = JSON.parse(config).data.headerItems;
//            var _proxy = proxy.getCustomColumns(me.intranetID);
            
            headItems.forEach(function(item) {
                var headItem;
                
                headItem = new HeadColumn(item);
                me.columnCon.appendChild(headItem.domNode);
                headItem.startup();
                
                if(item.title === 'Select') {
                    me.selectAllColumn = headItem;
                }
                
                me.totalHeadItems.push(headItem);
                
                if(item.defaultColumn) {
                    me.defaultColumns.push(item.customKey);
                }
                
                on(headItem, 'selectAllAction', function(data) {
                    me.selectAllAction(data);
                });
                
                on(headItem, 'sortRequest', function(data) {
                    me.sortRequest(data);
                });
                
                on(headItem, 'changeActiveHeadItem', function(data) {
                    me.changeActiveHeadItem(data.activeItem);
                });
                if(item.sortable) {
                    me.sortabledHeadItems.push(headItem);
                }
            });
            
            customHeadColumn = me.customHeadColumn = new CustomHeadColumn();
            me.columnCon.appendChild(customHeadColumn.domNode);
            customHeadColumn.startup();
            
            on(customHeadColumn, 'changeColumns', function(data) {
                me.defaultColumns = data;
                me.changeHeadColumns(data);
                me.changeBodyColumns(data);
            });
            
//            _proxy.then(function(res) {
//                if(res.data) {
//                    var _newColumns = me.defaultColumns = ['Rank', 'Client', 'BU Upsell', 'Industry', 'Tasks'];
//                    
//                    me.customHeadColumn.updateView(_newColumns);
//                    me.changeHeadColumns(_newColumns);
//                    if(!me.clientsRequestDone) {
//                        return;
//                    }
//                    me.changeBodyColumns(_newColumns);
//                }
//            }, function() {
//                
//            });
        },
        
        selectAllAction: function(data) {
            var currentClientItemList = [];
            var _checked = data;
            
            currentClientItemList = this.getCurrentClientItem();
            currentClientItemList.forEach(function(clientItem) {
                clientItem.selectAllOptBtn(_checked);
            });
        },
        
        getSelectableItemNum: function() {
            var currentClientItemList = [];
            
            currentClientItemList = this.getCurrentClientItem();
            return currentClientItemList.filter(function(clientItem) {
                return !clientItem.getOptBtnDisable();
            }).length;
        },
        
        getCurrentClientItem: function() {
            var currentPageIdx;
            
            this.totalClientConList.forEach(function(item, idx) {
                if(!domClass.contains(item, 'smart-hidden')) {
                    currentPageIdx = idx;
                }
            });
            
            return this.totalClientItemList[currentPageIdx];
        },
        
        sortRequest: function(data) {
            this.sortType = data.sortType;
            if(data.sortByDesc === 'desc') {
                this.sortByDesc = true;
            }else {
                this.sortByDesc = false;
            }
            this.requestForClient();
        },
        
        changeActiveHeadItem: function(activeItem) {
            var me = this;
            
            me.sortabledHeadItems.forEach(function(item) {
                if(item.data.title !== activeItem.data.title) {
                    item.initMe();
                }
            });
        },
        
        changeHeadColumns: function(_newColumns) {
            this.totalHeadItems.forEach(function(item) {
                var _customKey = item.data.customKey;
                
                if(_customKey === 'Select' || _customKey === 'Client') {
                    return;
                }
                
                if(_newColumns.includes(_customKey)) {
                    domClass.remove(item.domNode, 'smart-hidden');
                }else {
                    domClass.add(item.domNode, 'smart-hidden');
                }
            });
        },
        
        changeBodyColumns: function(_newColumns) {
            var me = this;
            
            try {
                me.totalClientItemList.forEach(function(clientList) {
                    clientList.forEach(function(item) {
                        item.defaultColumns = me.defaultColumns;
                        item.updateView();
                    });
                });
            } catch (err) {
                // TODO: handle exception
                throw new Error(err);
            }
        },
        
//        createFilterUtil: function() {
//            var filterUtil = this.filterUtil = new FilterUtil();
//            
//            domConstruct.place(filterUtil.domNode, this.filterScrollView.scroll_con, 'first');
//            filterUtil.startup();
//            this._refreshFilterScroll();
//        },
        
//        requestForFilter : function() {
//            var me = this;
//            
//            proxy.getFilter(me.intranetID).then(function(res) {
//                if(res.data) {
//                    me.filterDataObj = res.data;
//                    me.createFilterDetail(res.data);
//                }
//            }, function() {
//                
//            });
//        },
        
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
                    'segment': me.segmentDropdown ? me.segmentDropdown.getSelectedItemsFinal() : [],
                    'buUpsell': me.buUpsellDropdown ? me.buUpsellDropdown.getSelectedItemsFinal() : [],
                    'ibmClient': me.ibmClientDropdown ? me.ibmClientDropdown.getSelectedItemsFinal() : [],
                    'channel': me.channelDropdown ? me.channelDropdown.getSelectedItemsFinal() : [],
                    'upsellCycle': me.upsellCycleDropdown ? me.upsellCycleDropdown.getSelectedItemsFinal() : [],
//                    'tasks': me.tasks || [],
                    'bookmark': bookmark || '',
                    'employee_cnum': location.host === 'csa.dst.ibm.com' ? me.serialNumber : '057568613',
                    'email': me.intranetID || '',
                    'task_status': me.taskStatus || '',
                    'sort': me.sortType || '',
                    'desc': me.sortByDesc
                })
            };
            
//            me.hideError();
            me.showLoader();
            proxy.bestClients(params).then(function(res) {
                var _data = res.data, _clients = [], _totalData = '', _newbookmark = '';
                
                me.clientsRequestDone = true;
                me.hideLoader();
                if(res.errorCode || !_data || !_data.docs) {
//                    me.showError();
                    me.clearPendingTask();
                    me.enableSelectAllBtn();
                    return;
                }
                try {
                    _clients = _data.docs;
                    _totalData = _data.total_rows;
                    _newbookmark = _data.bookmark;
                    me.clientNum.innerHTML = _totalData;
                    me.bookmark = _newbookmark;
                    me.createClientEntity(_clients, bookmark);
                    if(!bookmark) {
                        me.pagingUtil.createView(_totalData);
                    }
                } catch (e) {
                    // TODO: handle exception
                    console.log('####error happened in requestForClient====', e);
                }
            }, function() {
                me.hideLoader();
//                me.showError();
                me.clearPendingTask();
                me.enableSelectAllBtn();
            });
        },
        
        createFilterDetail: function(data) {
            this.cityDropdown = new FilterDropdowndetail(data.city, 'City', 'Location');
            this.marketDropdown = new FilterDropdowndetail(data.market, 'Market', 'Location');
            this.countryDropdown = new FilterDropdowndetail(data.country, 'Country', 'Location');
            this.salesplayDropdown = new FilterDropdowndetail(data.salesPlays, 'Sales Plays', 'Sales Plays');
            this.industryDropdown = new FilterDropdowndetail(data.industry, 'Industry', 'Industry');
            this.segmentDropdown = new FilterDropdowndetail(data.segment, 'Segment', 'Segment');
            this.buUpsellDropdown = new FilterDropdowndetail(data.buUpsell, 'BU Upsell', 'BU Upsell');
            this.ibmClientDropdown = new FilterDropdowndetail(data.ibmClient, 'IBM Client', 'IBM Client');
            this.channelDropdown = new FilterDropdowndetail(data.channel, 'Channel', 'Channel');
            this.upsellCycleDropdown = new FilterDropdowndetail(data.upsellCycle, 'Upsell Cycle', 'Upsell Cycle');
            
            this.filterDeatilScrollView.scroll_con.appendChild(this.cityDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.marketDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.countryDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.salesplayDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.industryDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.segmentDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.buUpsellDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.ibmClientDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.channelDropdown.domNode);
            this.filterDeatilScrollView.scroll_con.appendChild(this.upsellCycleDropdown.domNode);
            
            this.filterDetailList = {
                'City': this.cityDropdown,
                'Market': this.marketDropdown,
                'Country': this.countryDropdown,
                'Sales Plays': this.salesplayDropdown,
                'Industry': this.industryDropdown,
                'Segment': this.segmentDropdown,
                'BU Upsell': this.buUpsellDropdown,
                'IBM Client': this.ibmClientDropdown,
                'Channel': this.channelDropdown,
                'Upsell Cycle': this.upsellCycleDropdown
            };
            
            this.filterUtilEventBind();
            this.filterDetailEventBind();
        },
        
        createClientEntity: function(clients, bookmark) {
            var me = this;
            var smartClientListCon;
            var clientItemList = [];
            var defaultColumns = me.defaultColumns.slice();
            
            me.clearPendingTask();
            
            if(!bookmark) {
                me.totalClientItemList.length = 0;
                me.totalClientConList.length = 0;
                domConstruct.empty(me.bodyScrollView.scroll_con);
            }else {
                me.totalClientConList.forEach(function(item) {
                    domClass.add(item, 'smart-hidden');
                });
            }
            
            smartClientListCon = domConstruct.create('div', {'class': 'smart-smartClientListCon'}, me.bodyScrollView.scroll_con, 'last');
            
            if(!clients.length) {
                me.createNoClientsView(smartClientListCon);
            }
            
            clients.forEach(function(item) {
                var smartClientList = new SmartClientList(item, defaultColumns);
                
                on(smartClientList, 'enableSelectAllBtn', function() {
                    me.enableSelectAllBtn();
                });
                
                on(smartClientList, 'handlePendingTask', function(data) {
                    me.handlePendingTask(data);
                });
                
                on(smartClientList, 'selectAllToPendingTask', function(data) {
                    me.selectAllToPendingTask(data);
                });
                
                on(smartClientList, 'showScTaskDialog', function(data) {
                    me.showScTaskDialog(data);
                });
                
                on(smartClientList, 'showReasons', function(data) {
                    me.showReasons(data);
                });
                
                on(smartClientList, 'createTaskSuccess', function() {
                    me.createTaskSuccess();
                });
                
                on(smartClientList, 'createTaskFail', function() {
                    me.createTaskFail();
                });
                
                domConstruct.place(smartClientList.domNode, smartClientListCon, 'last');
                smartClientList.startup();
                clientItemList.push(smartClientList);
            });
            me.totalClientItemList.push(clientItemList);
            me.totalClientConList.push(smartClientListCon);
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
            var clientConIdx = data.pageNum - 1;
            var totalClientConList = me.totalClientConList;
            var clientCon = totalClientConList[clientConIdx];
            var clientItemList = me.totalClientItemList[clientConIdx];
            
            if(clientCon) {
                me.clearPendingTask();
                
                totalClientConList.forEach(function(item, idx) {
                    if(idx === clientConIdx) {
                        domClass.remove(item, 'smart-hidden');
                    }else {
                        domClass.add(item, 'smart-hidden');
                    }
                });
                
                clientItemList.forEach(function(clientItem) {
                    if(!clientItem.optBtn.get('disabled')) {
                        me.enableSelectAllBtn();
                    }
                });
                me._refreshClientBodyScroll();
                return;
            }
            
            if(data.type === 'next') {
                me.requestForClient(bookmark);
            }
            
//            if(data.type === 'prev') {
//                
//            }
        },
        
        handlePendingTask: function(data) {
            var _id = data._id;
            
            if(data.selected) {
                this.pendingTaskArr.push(data);
            }
            
            if(!data.selected) {
                this.pendingTaskArr = this.pendingTaskArr.filter(function(item) {
                    return item._id !== _id;
                });
            }
            
            if(this.getSelectableItemNum() === this.pendingTaskArr.length) {
                this.selectAllColumn.setSelectAllBtnCheck(true);
            }else {
                this.selectAllColumn.setSelectAllBtnCheck(false);
            }
            
            if(this.pendingTaskArr.length) {
                this.showCreateTaskBtn();
            }else {
                this.hideCreateTaskBtn();
            }
//            console.log('=====this.pendingTaskArr====', this.pendingTaskArr);
        },
        
        selectAllToPendingTask: function(data) {
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
            me.enableSelectAllBtn();
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
            this.disableSelectAllBtn();
            this.pendingTaskArr.forEach(function(item) {
                item.smartClientItem.setOptBtnStatus(false);
            });
            this.pendingTaskArr.length = 0;
            this.hideCreateTaskBtn();
        },
        
        enableSelectAllBtn: function() {
            this.selectAllColumn.setSelectAllBtnCheck(false);
            this.selectAllColumn.setSelectAllBtnDisable(false);
        },
        
        disableSelectAllBtn: function() {
            this.selectAllColumn.setSelectAllBtnCheck(false);
            this.selectAllColumn.setSelectAllBtnDisable(true);
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
            
//            on(me.filterUtil, 'refreshScroll', function(data) {
//                me._refreshFilterScroll();
//            });
            
            on(me.filterUtil, 'showFilterResult', function(data) {
                me.showFilterResult(data);
                me.requestForClient();
            });
        },
        
        filterDetailEventBind: function() {
            var me = this;
            
            for(var key in me.filterDetailList) {
                on(me.filterDetailList[key], 'showFilterDoneBtn', function(data) {
                    me.filterUtil.showFilterDoneBtn(data);
                });
            }
        },
        
        showFilterDetail: function(data) {
            for(var key in this.filterDetailList) {
                if(key === data.dataSource) {
                    this.filterDetailList[key]._filter(data.val);
                    domStyle.set(this.filterDetailList[key].domNode, 'display', 'block');
                }else {
                    domStyle.set(this.filterDetailList[key].domNode, 'display', 'none');
                }
            }
            domClass.remove(this.filterDetail, 'smart-hidden');
            this._refreshFilterDetailScroll();
        },
        
        hideFilterDetail: function() {
            domClass.add(this.filterDetail, 'smart-hidden');
        },
        
        filterResult4special: function(data) {
            var me = this;
            var val = data.value.split('##');
            
            me.specialFilterDetail[val[0]] = data.self;
            if(data.selected) {
                me.tasks.push(val[1]);
                me.filterResultArray.push(data.value);
            }else {
                me.tasks = me.tasks.filter(function(item) {
                    return item !== val[1];
                });
                me.filterResultArray = me.filterResultArray.filter(function(item) {
                    return item !== data.value;
                });
            }
        },
        
        filterResult4common: function(data) {
            var me = this;
            
            for(var key in me.filterDetailList) {
                var currentDropdown = me.filterDetailList[key];
                
                if(currentDropdown.filterType === data.filterType) {
                    currentDropdown.updateSelectedItem();
                    currentDropdown.selectedItemsFinal.forEach(function(item) {
                        if(!me.filterResultArray.includes(item)) {
                            me.filterResultArray.push(item);
                        }
                    });
                }
            }
        },
        
        showFilterResult: function(data) {
            var me = this;
            var clearAllBtn, _height = 0;
            
            domConstruct.empty(me.filterResultScrollView.scroll_con);
            domClass.add(me.clearAllBtn, 'smart-hidden');
            
            if(data.filterType === 'Tasks') {
                me.filterResult4special(data);
            }else {
                me.filterResult4common(data);
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
            var val = item.split('##')[1];
            var resultItem = evt.target.parentElement;
            var dataSource = resultItem.getAttribute('data-source');
            var _height = resultItem.offsetHeight;
            
            domConstruct.destroy(resultItem);
            if(dataSource === 'Tasks') {
                me.tasks = me.tasks.filter(function(taskItem) {
                    return val !== taskItem;
                });
                me.specialFilterDetail[dataSource].clearCurrentData(val);
            }else {
                me.filterDetailList[dataSource].clearCurrentData(item);
            }
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
            
            for(var key in me.filterDetailList) {
                me.filterDetailList[key].clearAllData();
            }
            
            for(var key in me.specialFilterDetail) {
                me.specialFilterDetail[key].clearAllData();
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
            this.selectedNum.innerHTML = '(' + this.pendingTaskArr.length + ' selected)';
            domClass.remove(this.createTaskBtn, 'smart-hidden');
        },
        
        hideCreateTaskBtn: function() {
            this.selectedNum.innerHTML = '';
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
//            this.filterScrollView.resize();
            this.filterUtil._refreshFilterScroll();
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
