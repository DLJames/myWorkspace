define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/Evented',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    '../../proxy/proxy',
    'dijit/form/CheckBox'
    
], function (declare, on, domStyle, domClass, domConstruct, Evented, template, CustomUIWidget, proxy, CheckBox) {    
    var widget = declare('FilterUtil', [CustomUIWidget, Evented], {
        baseClass: 'FilterUtil',
        templateString: template,
        constructor: function(data) {
//            this.data = data;
        },
        postCreate: function() {    
            this.inherited(arguments);    
            
            var me = this;
            
            on(me.checkboxBtn, 'click', function() {
                me.showCompleteTask();
            });
            
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
        	this._bindEvent();
        },
        
        _bindEvent: function() {
            var me = this;
            var filterItemHeads = me.domNode.querySelectorAll('.smart-filterItemHead');
            var filterInputs = me.domNode.querySelectorAll('.smart-filter-input');
            var filterButtons = me.domNode.querySelectorAll('.smart-filterItemBtn');
            
            filterItemHeads.forEach(function(item){
                var lastSelectFilter = '';
                
                on(item, 'click', function(evt){
                    lastSelectFilter = this.parentElement.getAttribute('data-filter-type');
                    me.showFilterItem(lastSelectFilter);
                });
            });
            
            filterInputs.forEach(function(item) {
                var filterType = item.getAttribute('filterType');
                
                on(item, 'input', function(evt) {
                    me.controlFilterDetailView(evt, filterType);
                });
                
                on(item, 'click', function(evt) {
                    me.controlFilterDetailView(evt, filterType);
                    evt.stopPropagation();
                });
            });
            
            filterButtons.forEach(function(item) {
                on(item, 'click', function() {
                    me.emit('showFilterResult');
                })
            });
        },
        
        showFilterItem: function(lastSelectFilter) {
            var me = this;
            var filterItems = [];
            
            if(me.lastSelectFilter === lastSelectFilter){
                me.lastSelectFilter = '';
            }else{
                me.lastSelectFilter = lastSelectFilter;
            }
            
            filterItems = me.domNode.querySelectorAll('.smart-filterItem');
            filterItems.forEach(function(item){
                if(me.lastSelectFilter === item.getAttribute('data-filter-type')){
                    domClass.remove(item, 'bodyHide');
                }else{
                    domClass.add(item, 'bodyHide');
                }
            });
            
            me.emit('refreshScroll');
        },
        
        controlFilterDetailView: function(evt, filterType) {
            var val = evt.target.value.trim();
            var data = {
                'show': val ? true : false,
                'filterType': filterType,
                'val': val
            };
            
            this.emit('showFilterDetail', data);
        },
        
        showCompleteTask: function() {
            var me = this;
            
//            proxy.xxx()
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
