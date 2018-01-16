define([    
    'dojo/_base/declare',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/Evented',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    '../FilterUtilItem/FilterUtilItem'
    
], function (declare, on, domStyle, domClass, domConstruct, Evented, template, CustomUIWidget, FilterUtilItem) {
    var widget = declare('FilterUtil', [CustomUIWidget, Evented], {
        baseClass: 'FilterUtil',
        templateString: template,
        constructor: function(data) {
            this.data = [
                         {'dataSource': ['City', 'Market', 'Country'], 'filterType': 'Location', 'filterItemName': 'Location'},
                         {'dataSource': ['SalesPlays'], 'filterType': 'SalesPlays', 'filterItemName': 'Sales plays'},
                         {'dataSource': ['Industry'], 'filterType': 'Industry', 'filterItemName': 'Industry'},
                         {'dataSource': ['Segment'], 'filterType': 'Segment', 'filterItemName': 'Segment'},
                         {'dataSource': ['BU Upsell'], 'filterType': 'BU Upsell', 'filterItemName': 'BU Upsell'},
                         {'dataSource': ['IBM Client'], 'filterType': 'IBM Client', 'filterItemName': 'IBM Client'},
                         {'dataSource': ['Channel'], 'filterType': 'Channel', 'filterItemName': 'Channel'},
                         {'dataSource': ['Upsell Cycle'], 'filterType': 'Upsell Cycle', 'filterItemName': 'Upsell Cycle'}
                         ];
            this.filterUtilItemObj = {};
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.data.forEach(function(item) {
                this.createView(item);
            }.bind(this));
        },
        
        createView: function(item) {
            var filterUtilItem;
            var me = this;
            
            filterUtilItem = new FilterUtilItem(item);
            me.domNode.appendChild(filterUtilItem.domNode);
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
                me.emit('refreshScroll');
            });
        },
        
        hideAllItem: function(filterType) {
            for(var key in this.filterUtilItemObj) {
                if(key !== filterType) {
                    this.filterUtilItemObj[key].hideFilterItem();
                }
            }
        },
        
        showFilterDoneBtn: function(data) {
            this.filterUtilItemObj[data.filterType].showFilterDoneBtn(data);
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
