define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    
], function(declare, on, domStyle, domClass, domConstruct, template, CustomUIWidget) {
    var widget = declare('HeadColumn', [CustomUIWidget], {    
        baseClass: 'HeadColumn',
        templateString: template,
        constructor: function(data) {
            this.data = data;
        },
        postCreate: function(){    
            this.inherited(arguments);
            
            var domNode = this.domNode;
            
            on(domNode, 'mouseover', function() {
                if(domNode.getAttribute('data-column') === '0') return;
                if(this.data.sortable) {
                    domClass.add(domNode, 'showIcon');
                    domClass.add(domNode, 'active');
                }
            }.bind(this));
            
            on(domNode, 'mouseleave', function() {
                if(domNode.getAttribute('data-column') === '0') return;
                if(this.data.sortable) {
                    domClass.remove(domNode, 'showIcon');
                    domClass.remove(domNode, 'active');
                }
            }.bind(this));
            
            on(domNode, 'click', function() {
                if(!this.data.sortable) return;
                if(this.data.sort === 'desc') {
                    domClass.replace(domNode, 'asc', 'desc');
                    this.data.sort = 'asc';
                }else {
                    domClass.replace(domNode, 'desc', 'asc');
                    this.data.sort = 'desc';
                }
            }.bind(this));
        },    
            
        startup: function() {    
            this.inherited(arguments);    
            this.createView();
        },
        
        createView: function() {
            var me = this;
            
            this.name.innerHTML = this.data.title;
            if(this.data.subTitle) {
                domConstruct.create('span', {'class': 'head-subname', innerHTML: this.data.subTitle}, this.domNode, 'last');
            }
            domStyle.set(this.domNode, 'width', this.data.width);
//            domStyle.set(this.domNode, 'flex', this.data.flexnum);
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
