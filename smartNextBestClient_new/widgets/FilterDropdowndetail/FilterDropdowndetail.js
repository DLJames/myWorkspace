define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'dijit/form/CheckBox'
    
], function (declare, on, Evented, domStyle, domClass, domConstruct, template, CustomUIWidget, CheckBox) {    
    var widget = declare('FilterDropdownDetail', [CustomUIWidget, Evented], {    
        baseClass: 'FilterDropdownDetail',    
        templateString: template,
        constructor: function(data) {
            this.data = data;
            this.itemCons = [];
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
            me.data.forEach(function(item) {
                me.createView(item);
            });
        },
        
        createView: function(item) {
            var itemCon, itemSel;
            var data = {'val': item};
            
            itemCon = domConstruct.create('div', {'class': 'smart-filterDetailItemCon', 'dataid': item}, this.domNode, 'last');
            itemSel = domConstruct.create('div', {'class': 'icon-completed-idle'}, itemCon, 'last');
            domConstruct.create('div', {'class': 'smart-filterItemName', innerHTML: item}, itemCon, 'last');
            
            on(itemCon, 'click', function(evt) {
                domClass.toggle(itemSel, 'selectMe');
                data.customType = domClass.contains(itemSel, 'selectMe') ? 'add' : 'remove';
                this.emit('customFilterResult', data);
            }.bind(this));
            
            this.itemCons.push(itemCon);
        },
        
        _filter: function(val) {
            var _val = val.toLowerCase();
            
            this.itemCons.forEach(function(item) {
                var _text = item.getAttribute('dataid').toLowerCase();
                
                if(!_text.includes(_val)) {
                    domStyle.set(item, 'display', 'none');
                }else {
                    domStyle.set(item, 'display', 'flex');
                }
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
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
