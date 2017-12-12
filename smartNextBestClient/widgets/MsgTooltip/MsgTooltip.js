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
    var widget = declare('MsgTooltip', [CustomUIWidget, Evented], {    
        baseClass: 'MsgTooltip',
        templateString: template,
        constructor: function(data) {
            this.data = data;
        },
        postCreate: function() {
            this.inherited(arguments);
          
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            this.tooltipTitle.innerHTML = this.data.tooltipTitle;
            this.bodyContent.innerHTML = this.data.commonMsg;
            domClass.add(this.bodyContent, this.data.bodyClassName);
            this.scrollView.resize();
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
