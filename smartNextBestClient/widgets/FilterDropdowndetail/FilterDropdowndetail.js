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
        constructor: function(data, dataSource, filterType) {
            this.data = data;
            this.dataSource = dataSource;
            this.filterType = filterType;
            this.itemConArr = [];
            this.selectedItems = [];
            this.selectedItemsFinal = [];
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
            me._createView();
            
            me.itemNone = domConstruct.create('div', {
                'class': 'smart-filterDetailItemNone smart-hidden', 
                innerHTML: 'Not found'
            }, me.domNode, 'last');
        },
        
        _createView: function(item) {
            var me = this;
            
            me.data.forEach(function(item) {
                var itemCon, itemSel;
                var data = {'val': me.dataSource + '##' + item, 'selected': false};
                
                itemCon = domConstruct.create('div', {'class': 'smart-filterDetailItemCon', 'dataid': data.val}, me.domNode, 'last');
                itemSel = domConstruct.create('div', {'class': 'icon-completed-idle'}, itemCon, 'last');
                domConstruct.create('div', {'class': 'smart-filterItemName', innerHTML: item.split('_').join(' ')}, itemCon, 'last');
                
                on(itemCon, 'click', function(evt) {
                    domClass.toggle(itemSel, 'selectMe');
                    data.selected = domClass.contains(itemSel, 'selectMe');
                    me._addSelectedItem(data);
                });
                
                me.itemConArr.push(itemCon);
            });
            
        },
        
        _addSelectedItem: function(data) {
            var val = data.val;
            var _idx = this.selectedItems.indexOf(val);
            var _obj = {
                'length': 0,
                'filterType': this.filterType
            }
            
            if(data.selected && _idx < 0) {
                this.selectedItems.push(val);
//                console.log(this.dataSource,': arr2===', this.selectedItems)
            }
            
            if(!data.selected && _idx >= 0) {
                this.selectedItems.splice(_idx, 1);
//                console.log(this.dataSource,': arr2===', this.selectedItems)
            }
            
            _obj.length = this.selectedItems.length;
            this.emit('showFilterDoneBtn', _obj);
        },
        
        updateSelectedItem: function() {
            this.selectedItems.forEach(function(item) {
                if(!this.selectedItemsFinal.includes(item)) {
                    this.selectedItemsFinal.push(item);
                }
            }.bind(this));
            
            this.selectedItems.length = 0;
            
            this.itemConArr.forEach(function(item) {
                domClass.remove(item.children[0], 'selectMe');
            });
        },
        
        getSelectedItemsFinal: function() {
            var regx = this.dataSource + '##';
            
            return this.selectedItemsFinal.map(function(item) {
                return item.replace(regx, '');
            });
        },
        
        clearCurrentData: function(item) {
            var _idx = this.selectedItemsFinal.indexOf(item);
            
            if(_idx >= 0) this.selectedItemsFinal.splice(_idx, 1);
        },
        
        clearAllData: function() {
            this.selectedItemsFinal.length = 0;
        },
        
        _filter: function(val) {
            var _val = val.toLowerCase();
            var _num = 0;
            
            this.itemConArr.forEach(function(item) {
                var _text = item.getAttribute('dataid').toLowerCase().split('##')[1];
                
                if(_val && !_text.includes(_val)) {
                    domStyle.set(item, 'display', 'none');
                    _num ++;
                }else {
                    domStyle.set(item, 'display', 'flex');
                }
            });
            
            if(_num === this.itemConArr.length) {
                domClass.remove(this.itemNone, 'smart-hidden');
            }else {
                domClass.add(this.itemNone, 'smart-hidden');
            }
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
