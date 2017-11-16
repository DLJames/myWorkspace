define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    '../scTaskDetail/scTaskDetail'
    
], function (declare, on, domStyle, domClass, domConstruct, template, CustomUIWidget, scTaskDetail) {    
    var widget = declare('smartClientList', [CustomUIWidget], {    
        baseClass: 'smartClientList',    
        templateString: template,
        showTask: false,
        constructor: function(data) {
            this.data = data;
        },
        dataset: {},
        postCreate: function() {    
            this.inherited(arguments);    
            
            var domNode = this.domNode;
            
            Object.assign(this.dataset, this.data);
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        showTask: function() {
            var scTask = new scTaskDetail();
            
            this.parentView.domNode.appendChild(scTask.domNode);
            scTask.startup();
        },
        
        goToClient360: function() {
            alert('go to client360')
        },
        
        showScTaskButton: function(evt) {
            
        },
        
        createView: function() {
        	/*
        	 * "score": "5",
            "reasons": "5",
            "rank": "1",
            "clientTitle": "Cardiff Univercity",
            "industry": "Government, State/Provincial/Local",
            "contacts": {},
            "scTask": 0,
            "option": 0
            */
            if(this.dataset.scTask) {
                domClass.remove(this.scTaskBtn, 'smart-hidden');
            }
            this.rank.innerHTML = this.dataset.rank;
            this.score.innerHTML = this.dataset.score;
            this.reasons.innerHTML = this.dataset.reasons;
            this.client.innerHTML = this.dataset.clientTitle;
            this.industry.innerHTML = this.dataset.industry;
//            this.contacts.innerHTML = '';
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
