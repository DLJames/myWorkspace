define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget'
    
], function(declare, on, Evented, domStyle, domClass, domConstruct, template, CustomUIWidget) {
    var widget = declare('CustomHeadColumn', [CustomUIWidget, Evented], {    
        baseClass: 'CustomHeadColumn',
        templateString: template,
        constructor: function(data) {
            this.data = data;
            this.maxSelNum = 6;
            this.itemCons = [];
            this.lockedColumns = ['Client'];
            this.selectedColumns = ['Rank', 'Score', 'Client', 'Sales plays', 'Industry', 'Tasks'];
            this.totalColumns = ['Rank', 'Score', 'Client', 'Sales plays', 'Segment', 'Industry', 'BU Upsell', 'IBM Client', 'Channel', 'Upsell Cycle', 'Tasks']
        },
        postCreate: function(){
            this.inherited(arguments);
            
            var me = this;
            
            on(me.customIcon, 'click', function(evt) {
                me.showCustomDialog();
                evt.stopPropagation();
            });
            
            on(me.customBody, 'click', function(evt) {
                evt.stopPropagation();
            });
            
            on(me.customButton, 'click', function() {
                me.saveCustomize();
            });
        },    
            
        startup: function() {    
            this.inherited(arguments);    
            this.createView();
        },
        
        updateView: function(data) {
            this.selectedColumns = data;
            this.createView();
        },
        
        createView: function() {
            var me = this;
            
            domConstruct.empty(me.customColumnsList);
            me.totalColumns.forEach(function(item) {
                var itemCon, itemLocked = '', itemChecked = '';
                
                if(me.lockedColumns.includes(item)) {
                    itemLocked = ' item-locked';
                }
                
                if(me.selectedColumns.includes(item)) {
                    itemChecked = ' item-checked';
                }
                
                itemCon = domConstruct.create('div', {'class': 'custom-list-item' + itemChecked + itemLocked}, me.customColumnsList, 'last');
                domConstruct.create('div', {'class': 'select-button icon-completed-selected'}, itemCon, 'last');
                domConstruct.create('div', {'class': 'select-button-text', innerHTML: item}, itemCon, 'last');
                
                on(itemCon, 'click', function() {
                    me.handleItemSelected(item, itemCon);
                });
            });
        },
        
        handleItemSelected: function(item, dom) {
            var idx;
            
            if(this.lockedColumns.includes(item)) return;
            
            idx = this.selectedColumns.indexOf(item);
            if(idx < 0) {
                if(this.selectedColumns.length >= this.maxSelNum) {
                    this.showWarningMessage();
                    return;
                }
                this.selectedColumns.push(item);
            }else {
                this.selectedColumns.splice(idx, 1);
            }
            domClass.toggle(dom, 'item-checked');
        },
        
        showCustomDialog: function() {
            domClass.toggle(this.customBody, 'custom-body-show');
            
            on.once(document, 'click', function() {
                domClass.remove(this.customBody, 'custom-body-show');
            }.bind(this));
        },
        
        saveCustomize: function() {
            var me = this;
            
            domClass.remove(me.customBody, 'custom-body-show');
            this.emit('changeColumns', me.selectedColumns);
//            proxy.saveCustomize()
        },
        
        showWarningMessage: function() {
            var warningDialog;
            
            warningDialog = domConstruct.create('div', {'class': 'custom-warning-dialog'}, document.body, 'last');
            domConstruct.create('div', {'class': 'body-alert-icon icon-information-idle'}, warningDialog, 'last');
            domConstruct.create('div', {
                'class': 'body-alert-message', 
                innerHTML: 'Try choosing less columns to display so that it is easier to view the data on your device.'
            }, warningDialog, 'last');
            
            setTimeout(function() {
                domConstruct.destroy(warningDialog);
            }, 2800);
        },
        
        _onFocus: function() {    
            this.inherited(arguments);    
        },    
        _onBlur: function() {    
           this.inherited(arguments);    
         },
    });    
        
    return widget;    
});    
