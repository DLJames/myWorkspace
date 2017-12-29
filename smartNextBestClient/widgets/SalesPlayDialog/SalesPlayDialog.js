define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-attr',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'app/services/ConsoleService',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget'
    
], function (declare, on, Evented, domAttr, domStyle, domClass, domConstruct, ConsoleService, template, CustomUIWidget) {    
    var widget = declare('SalesPlayDialog', [CustomUIWidget, Evented], {    
        baseClass: 'SalesPlayDialog',
        templateString: template,
        constructor: function(data) {
            this.data = [
                {
                	'name': 'Identity Governance Mainframes 000',
                	'num':2,
                	'opt':null
                },
                {
                	'name': 'Identity Governance Mainframes 001',
                	'num':5,
                	'opt':null
                },
                {
                	'name': 'Identity Governance Mainframes 001',
                	'num':10,
                	'opt':null
                },
                {
                	'name': 'Identity Governance Mainframes 001',
                	'num':5,
                	'opt':null
                },
                {
                	'name': 'Identity Governance Mainframes 002',
                	'num':2,
                	'opt':null
                },
                {
                	'name': 'Identity Governance Mainframes 003',
                	'num':1,
                	'opt':null
                }
            ]
        },
        postCreate: function() {
            this.inherited(arguments);
          
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            this.spNum.innerHTML = 6;
            this.createSalesplayItem();
        },
        
        createSalesplayItem: function() {
            var me = this;
            
            me.data.forEach(function(item) {
                var itemCon, itemBar, progressBar, opptBtn;
                
                itemCon = domConstruct.create('div', {'class': 'smart-spColumnItem'}, me.scrollView.scroll_con, 'last');
                domConstruct.create('div', {'class': 'smart-spSalesplay', innerHTML: item.name}, itemCon, 'last');
                itemBar = domConstruct.create('div', {'class': 'smart-spConfidenceBar'}, itemCon, 'last');
                progressBar = domConstruct.create('div', {'class': 'smart-progress'}, itemBar, 'last');
                domConstruct.create('div', {style: {width: item.num / 10 * 100 + '%'}}, progressBar, 'last');
                opptBtn = domConstruct.create('div', {'class': 'smart-spOpptBtn icon-add-interaction'}, itemCon, 'last');
                
                on(opptBtn, 'click', function() {
                    alert('go to create oppt')
                });
            });
            me.scrollView.resize();
        },
        
        destroyMe: function() {
            this.destroy();
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
