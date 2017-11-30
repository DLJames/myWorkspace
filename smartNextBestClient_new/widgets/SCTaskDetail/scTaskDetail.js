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
            this.formObj = {
                    statusObj: ['Not Started', 'In Progress', 'Pending Input', 'Deferred', 'Canceled', 'Completed'],
                    outcomeObj: ['Wrong Solution', 'With Competition', 'No Budget', 'No Authority or Sign-Off', 'No Need/No CRA', 'Not at current time', 
                                 'Opportunity already in system', 'New Opportunity Created', 'Nurturing for future engagement']
                }
        },
        postCreate: function() {    
            this.inherited(arguments);    
            
            var domNode = this.domNode;
            
            on(this.statusBody, 'mouseleave', function() {
                this.hideStatusBody()
            }.bind(this));
            
            on(this.outcomeBody, 'mouseleave', function() {
                this.hideOutcomeBody();
            }.bind(this));
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            var me = this;
            
            me.taskTitle.value = me.data.title;
            me.statusHead.innerHTML = me.data.status;
            me.outcomeHead.innerHTML = me.data.outcome;
            me.description.value = me.data.outcome + '\n' +me.data.description.substr(me.data.outcome.length).trim();
            
            me.formObj.statusObj.forEach(function(item) {
                var temp;
                
                if(item === me.data.status) {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item active', innerHTML: item}, me.statusBody, 'last');
                }else {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item', innerHTML: item}, me.statusBody, 'last');
                }
                
                temp.onclick = function() {
                    me.statusHead.innerHTML = item;
                    me.hideStatusBody();
                }
            });
            
            me.formObj.outcomeObj.forEach(function(item) {
                var temp;
                
                if(item === me.data.outcome) {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item active', innerHTML: item}, me.outcomeBody, 'last');
                }else {
                    temp =domConstruct.create('div', {'class': 'task-dropdown-item', innerHTML: item}, me.outcomeBody, 'last');
                }
                
                temp.onclick = function() {
                    me.outcomeHead.innerHTML = item;
                    me.hideOutcomeBody();
                }
            });
            
        },
        
        toggleStatusBody: function() {
            domClass.toggle(this.statusBody, 'smart-hidden');
        },
        
        hideStatusBody: function() {
            domClass.add(this.statusBody, 'smart-hidden');
        },
        
        toggleOutcomeBody: function() {
            domClass.toggle(this.outcomeBody, 'smart-hidden');
        },
        
        hideOutcomeBody: function() {
            domClass.add(this.outcomeBody, 'smart-hidden');
        },
        
        saveTask: function(evt) {
            var me = this;
            
//            proxy.xxx()....
            me.showLoader();
            setTimeout(function() {
                me.hideLoader();
//                me.showError(evt.target);
                me.destroy();
            }, 2000);
        },
        
        showLoader: function() {
            domClass.remove(this.shadowCon, 'smart-hidden');
        },
        
        hideLoader: function() {
            domClass.add(this.shadowCon, 'smart-hidden');
        },
        
        showError: function(target) {
//            var targetRect = target.getBoundingClientRect();
//            var _left = targetRect.left + 40;
//            var _top = targetRect.top + 45;
            var errorMsg;
            
            errorMsg = domConstruct.create('div', {
                'class': 'task-errorMsg',
                innerHTML: 'An error occur, please check your network and try again later.',
//                style: {
//                    'left': _left + 'px',
//                    top: _top + 'px'
//                }
                }, this.taskContainer, 'last');
            
            setTimeout(function() {
                domConstruct.destroy(errorMsg);
            }.bind(this), 3500);
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
