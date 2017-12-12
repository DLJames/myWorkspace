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
    var widget = declare('TaskConfirmDialog', [CustomUIWidget, Evented], {    
        baseClass: 'TaskConfirmDialog',
        templateString: template,
        constructor: function(clientNames) {
            this.clientNames = clientNames;
        },
        postCreate: function() {
            this.inherited(arguments);
            
            this.clientNames.forEach(function(item) {
                this.createView(item);
            }.bind(this));
        },
        
        startup : function() {    
            this.inherited(arguments);
        },
        
        createView: function(item) {
            this.clientNum.innerHTML = this.clientNames.length;
            domConstruct.create('div', {
                'class': 'tcd-clientName',
                'title': item.smartClientItem.data.Company_Name,
                innerHTML: '- ' + item.smartClientItem.data.Company_Name
            }, this.scrollView.scroll_con, 'last');
            this.scrollView.resize();
        },
        
        createScTask: function() {
            this.destroyMe();
            this.emit('createScTask');
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
