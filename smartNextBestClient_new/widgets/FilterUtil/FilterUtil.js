define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    '../../proxy/proxy',
    'dijit/form/CheckBox'
    
], function (declare, on, domStyle, domClass, domConstruct, template, CustomUIWidget, proxy, CheckBox) {    
    var widget = declare('FilterUtil', [CustomUIWidget], {    
        baseClass: 'FilterUtil',    
        templateString: template,
        constructor: function(data) {
//            this.data = data;
        },
        postCreate: function() {    
            this.inherited(arguments);    
            
            var domNode = this.domNode;
            
            on(this.checkboxBtn, 'click', function() {
                this.showCompleteTask();
            }.bind(this));
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            var me = this;
            var filterItemHeads = me.domNode.querySelectorAll('.smart-filterItemHead');
            
            filterItemHeads.forEach(function(item){
                var lastSelectFilter = '';
                
                on(item, 'click', function(evt){
                    lastSelectFilter = this.parentElement.getAttribute('data-filter-type');
                    me.showFilterItem(lastSelectFilter);
                });
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
            
            me._resize();
        },
        
        showCompleteTask: function() {
            var me = this;
            
//            proxy.xxx()
        },
        
        _resize: function() {
            this.parentView._refreshFilterScroll();
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
