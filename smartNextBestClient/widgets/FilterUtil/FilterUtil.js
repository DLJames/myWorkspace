define([    
    'dojo/_base/declare',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/Evented',
    '../../proxy/proxy',
    'app/services/ConsoleService',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'dojo/text!./config/config.json',
    '../FilterUtilItem/FilterUtilItem'
    
], function (declare, on, domStyle, domClass, domConstruct, Evented, proxy, ConsoleService, template, CustomUIWidget, config, FilterUtilItem) {
    var widget = declare('FilterUtil', [CustomUIWidget, Evented], {
        baseClass: 'FilterUtil',
        templateString: template,
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        constructor: function() {
            this.filterItems = JSON.parse(config).data;
            this.filterUtilItemObj = {};
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createDefaultView();
            this.requestForFilter();
        },
        
        createDefaultView: function() {
            var me = this;
            
            me.filterItems.forEach(function(item) {
                me.createView(item);
            });
        },
        
        requestForFilter : function() {
            var me = this;
            
            proxy.getFilter(me.intranetID).then(function(res) {
                var _data = res.data;
                
                if(_data) {
                    me.createSpecialFilterDetail(_data);
                    me.emit('createFilterDetail', _data);
                }
            }, function() {
                me.createNoDataView();
            });
        },
        
        createView: function(item) {
            var filterUtilItem;
            var me = this;
            
            filterUtilItem = new FilterUtilItem(item);
            me.filterScrollView.scroll_con.appendChild(filterUtilItem.domNode);
            filterUtilItem.startup();
            
            me.filterUtilItemObj[item.filterType] = filterUtilItem;
            
            on(filterUtilItem, 'hideAllItem', function(filterType) {
                me.hideAllItem(filterType);
            });
            
            on(filterUtilItem, 'showFilterDetail', function(data) {
                me.emit('showFilterDetail', data);
            });
            
            on(filterUtilItem, 'showFilterResult', function(data) {
                me.emit('showFilterResult', data);
            });
            
            on(filterUtilItem, 'refreshScroll', function() {
//                me.emit('refreshScroll');
                me._refreshFilterScroll();
            });
            
            me._refreshFilterScroll();
        },
        
        hideAllItem: function(filterType) {
            for(var key in this.filterUtilItemObj) {
                if(key !== filterType) {
                    this.filterUtilItemObj[key].hideFilterItem();
                }
            }
        },
        
        createSpecialFilterDetail: function(data) {
            var _taskData = data['tasks'] || ["Not Start", "In Progress", "Completed"]
            
            this.filterUtilItemObj['Tasks'].createTasksView(_taskData);
        },
        
        showFilterDoneBtn: function(data) {
            this.filterUtilItemObj[data.filterType].showFilterDoneBtn(data);
        },
        
        _refreshFilterScroll: function() {
            this.filterScrollView.resize();
        },
        
        createNoDataView: function() {
            domConstruct.empty(this.domNode);
            domConstruct.create('div',{'class': 'smart-noFilterView', 'innerHTML': 'No data available'}, this.domNode, 'last');
        },
        
        _onFocus: function() {    
            this.inherited(arguments);
        },    
        
        _onBlur: function() {    
           this.inherited(arguments);
        }    
    });    
        
    return widget;    
});    
