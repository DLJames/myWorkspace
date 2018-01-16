define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/Evented',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget'
    
], function (declare, on, domStyle, domClass, domConstruct, Evented, template, CustomUIWidget) {    
    var widget = declare('FilterUtilItem', [CustomUIWidget, Evented], {
        baseClass: 'FilterUtilItem',
        templateString: template,
        constructor: function(data) {
            this.dataSource = data.dataSource;
            this.filterType = data.filterType;
            this.filterItemName = data.filterItemName;
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
            on(me.itemHead, 'click', function(){
                me.showFilterItem();
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            var me = this;
            
//            me.filterItemName.innerHTML = me.filterName;
            me.dataSource.forEach(function(item) {
                var itemBody, inputBtn;
                
                itemBody = domConstruct.create('div', {'class': 'smart-filterItemBody'}, me.domNode, 'last');
                inputBtn = domConstruct.create('input', {'class': 'smart-filter-input', 'placeholder': 'Enter ' + item}, itemBody, 'last');
                
                on(inputBtn, 'input', function(evt) {
                    me.showFilterDetail(evt, item);
                });
                
                on(inputBtn, 'click', function(evt) {
                    me.showFilterDetail(evt, item);
                    evt.stopPropagation();
                });
            });
            
            me.doneBtn = domConstruct.create('div', {'class': 'smart-filterItemBtn smart-btnDisable', innerHTML: 'Done'}, me.domNode, 'last');
            
            on(me.doneBtn, 'click', function() {
                if(domClass.contains(me.doneBtn, 'smart-btnDisable')) {
                    return;
                }
                
                me.clearInputVal();
                domClass.add(me.doneBtn, 'smart-btnDisable');
                me.emit('showFilterResult', {'filterType': me.filterType});
            })
        },
        
        showFilterItem: function() {
            domClass.toggle(this.domNode, 'bodyHide');
            this.emit('hideAllItem', this.filterType);
            this.emit('refreshScroll');
        },
        
        hideFilterItem: function() {
            domClass.add(this.domNode, 'bodyHide');
        },
        
        showFilterDoneBtn: function(data) {
            if(data.length) {
                domClass.remove(this.doneBtn, 'smart-btnDisable');
            }else {
                domClass.add(this.doneBtn, 'smart-btnDisable');
            }
        },
        
        showFilterDetail: function(evt, dataSource) {
            var val = evt.target.value.trim();
            var data = {
                'dataSource': dataSource,
                'val': val
            };
            
            this.emit('showFilterDetail', data);
        },
        
        clearInputVal: function() {
            this.domNode.querySelectorAll('.smart-filter-input').forEach(function(item) {
                item.value = '';
            });
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
