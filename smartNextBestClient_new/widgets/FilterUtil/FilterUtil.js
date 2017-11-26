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
            
//            on(me.checkboxBtn, 'click', function() {
//                me.showCompleteTask();
//            });
            
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
                var dataSource = item.getAttribute('data-source');
                
                on(item, 'input', function(evt) {
                    me.controlFilterDetailView(evt, dataSource);
                });
                
                on(item, 'click', function(evt) {
                    me.controlFilterDetailView(evt, dataSource);
                    evt.stopPropagation();
                });
            });
            
            filterButtons.forEach(function(item) {
                on(item, 'click', function(evt) {
                    var _parentElement = evt.target.parentElement;
                    var _data = {
                        'filterType': _parentElement.getAttribute('data-filter-type')
                    };
                    var _inputArr = _parentElement.querySelectorAll('.smart-filter-input');
                    
                    _inputArr.forEach(function(item) {
                        item.value = '';
                    });
                    
                    me.emit('showFilterResult', _data);
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
        
        controlFilterDetailView: function(evt, dataSource) {
            var val = evt.target.value.trim();
            var data = {
                'show': val ? true : false,
                'dataSource': dataSource,
                'val': val
            };
            
            this.emit('showFilterDetail', data);
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
