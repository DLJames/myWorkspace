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
                    me.showFilterDetail(evt, dataSource);
                });
                
                on(item, 'click', function(evt) {
                    me.showFilterDetail(evt, dataSource);
                    evt.stopPropagation();
                });
            });
            
            filterButtons.forEach(function(item) {
                on(item, 'click', function(evt) {
                    var _parentElement, _data, _inputArr;
                    
                    if(evt.target.className.indexOf('smart-btnDisable') >= 0) {
                        return;
                    }
                    
                    _parentElement = evt.target.parentElement;
                    _data = {
                        'filterType': _parentElement.getAttribute('data-filter-type')
                    };
                    _inputArr = _parentElement.querySelectorAll('.smart-filter-input');
                    
                    _inputArr.forEach(function(item) {
                        item.value = '';
                    });
                    
                    domClass.add(item, 'smart-btnDisable');
                    me.emit('showFilterResult', _data);
                })
            });
        },
        
        showFilterDoneBtn: function(data) {
            var me = this;
            
            me.domNode.querySelectorAll('.smart-filterItemBtn').forEach(function(item) {
                if(item.getAttribute('data-filter-type') === data.filterType && data.length) {
                    domClass.remove(item, 'smart-btnDisable');
                }
                
                if(item.getAttribute('data-filter-type') === data.filterType && !data.length) {
                    domClass.add(item, 'smart-btnDisable');
                }
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
        
        showFilterDetail: function(evt, dataSource) {
            var val = evt.target.value.trim();
            var data = {
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
