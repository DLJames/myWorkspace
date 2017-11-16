define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    '../../proxy/proxy'
    
], function (declare, on, domStyle, domClass, domConstruct, template, CustomUIWidget, proxy) {    
    var widget = declare('scTaskDetail', [CustomUIWidget], {    
        baseClass: 'scTaskDetail',    
        templateString: template,
        constructor: function(data) {
            this.data = data;
        },
        postCreate: function() {    
            this.inherited(arguments);    
            
            var domNode = this.domNode;
            
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        showStatusBody: function() {
            domClass.toggle(this.statusBody, 'smart-hidden');
        },
        
        showOutcomeBody: function() {
            domClass.toggle(this.outcomeBody, 'smart-hidden');
        },
        
        saveTask: function() {
            var me = this;
            
//            proxy.xxx()....
            this.destroy();
        },
        
        destroyMe: function() {
            this.destroy();
        },
        
        createView: function() {
        	
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
