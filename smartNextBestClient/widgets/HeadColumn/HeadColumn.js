define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    
], function(declare, on, Evented, domStyle, domClass, domConstruct, template, CustomUIWidget) {
    var widget = declare('HeadColumn', [CustomUIWidget, Evented], {    
        baseClass: 'HeadColumn',
        templateString: template,
        constructor: function(data) {
            this.data = data;
        },
        postCreate: function(){    
            this.inherited(arguments);
            
            var domNode = this.domNode;
            
            on(domNode, 'mouseover', function() {
                if(domClass.contains(this.domNode, 'active')) return;
                if(this.data.sortable) {
                    domClass.add(domNode, 'showIcon');
                }
            }.bind(this));
            
            on(domNode, 'mouseleave', function() {
                if(domClass.contains(this.domNode, 'active')) return;
                if(this.data.sortable) {
                    domClass.remove(domNode, 'showIcon');
                }
            }.bind(this));
            
            on(domNode, 'click', function() {
                if(!this.data.sortable) return;
                this.sortAction();
            }.bind(this));
        },    
            
        startup: function() {    
            this.inherited(arguments);    
            this.createView();
        },
        
        createView: function() {
            if(this.data.initShow !== 'default') {
                domClass.add(this.domNode, 'smart-hidden');
            }
            this.name.innerHTML = this.data.title;
            if(this.data.actived) {
                domClass.add(this.domNode, 'showIcon active');
            }
            domStyle.set(this.domNode, 'flex', this.data.flexnum);
//            domStyle.set(this.domNode, 'width', this.data.width);
        },
        
        sortAction: function() {
            if(!this.data.actived) {
                this.data.actived = true;
                domClass.add(this.domNode, 'showIcon active');
                this.changeActiveHeadItem();
                this.sortRequest();
                return;
            }
            
            if(this.data.sortBy === 'desc') {
                domClass.replace(this.domNode, 'asc', 'desc');
                this.data.sortBy = 'asc';
            }else {
                domClass.replace(this.domNode, 'desc', 'asc');
                this.data.sortBy = 'desc';
            }
            this.sortRequest();
        },
        
        changeActiveHeadItem: function() {
            var data = {
                activeItem: this
            }
            this.emit('changeActiveHeadItem', data);
        },
        
        sortRequest: function() {
            var data = {
                sortType: this.data.key,
                sortByDesc: this.data.sortBy
            }
            this.emit('sortRequest', data);
        },
        
        initMe: function() {
            this.data.actived = false;
            domClass.replace(this.domNode, 'HeadColumn commonColumn sortable asc');
            this.data.sortBy = 'asc';
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
