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
        constructor: function(data, contentType, dataSource) {
            this.data = data;
            this.contentType = contentType;
            this.dataSource = dataSource;
            this.itemCons = [];
            this.selectedItems = [];
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
            me.data.forEach(function(item) {
                if(me.contentType === 'filterOpt') {
                    me.createOptView(item);
                }else {
                    me.createRestView(item);
                }
            });
        },
        
        createOptView: function(item) {
            var itemCon, itemSel;
            var data = {'val': this.dataSource + '-' + item};
            
            itemCon = domConstruct.create('div', {'class': 'smart-filterDetailItemCon', 'dataid': item}, this.domNode, 'last');
            itemSel = domConstruct.create('div', {'class': 'icon-completed-idle'}, itemCon, 'last');
            domConstruct.create('div', {'class': 'smart-filterItemName', innerHTML: item}, itemCon, 'last');
            
            on(itemCon, 'click', function(evt) {
                domClass.toggle(itemSel, 'selectMe');
                data.customType = domClass.contains(itemSel, 'selectMe') ? 'add' : 'remove';
                this._customDataArr(data);
                this.emit('customFilterResult', data);
            }.bind(this));
            
            this.itemCons.push(itemCon);
        },
        
        createRestView: function() {
        
        },
        
        clearData: function(data) {
            var val = data.val.split('-')[1];
            var _idx = this.selectedItems.indexOf(val);
            
            this.selectedItems.splice(_idx, 1);
            
            this.itemCons.forEach(function(item) {
                var _text = item.getAttribute('dataid');
                
                if(_text === val) {
                    domClass.remove(item.children[0], 'selectMe');
                }
            });
        },
        
        clearAllData: function() {
            var me = this;
            var items = me.domNode.querySelectorAll('.smart-filterDetailItemCon');
            
            me.selectedItems.length = 0;
            items.forEach(function(item) {
                domClass.remove(item.children[0], 'selectMe');
            });
        },
        
        _customDataArr: function(data) {
            var val = data.val.split('-')[1];
            var _idx = this.selectedItems.indexOf(val);
            
            if(data.customType === 'add' && _idx < 0) {
                this.selectedItems.push(val);
                console.log('arr2===', this.selectedItems)
            }
            
            if(data.customType === 'remove' && _idx >= 0) {
                this.selectedItems.splice(_idx, 1);
                console.log('arr2===', this.selectedItems)
            }
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
