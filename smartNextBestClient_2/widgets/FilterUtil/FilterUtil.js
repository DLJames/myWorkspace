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
        
        createView: function() {
            var me = this;
            me.data.forEach(function(item) {
                domConstruct.create('div', {
                    'class': 'smart-filterItem',
                    innerHTML: '<div class="smart-filterItemName">' + item.name + '</div><div class="icon-expand-graphic"></div>'
                }, me.scrollView.scroll_con, 'last');
                
                me._resize();
            });
            
            domConstruct.create('div', {'class': 'smart-completeTask'}, me.scrollView.scroll_con, 'last');
        },
        
        _resize: function() {
            this.scrollView.resize();
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
