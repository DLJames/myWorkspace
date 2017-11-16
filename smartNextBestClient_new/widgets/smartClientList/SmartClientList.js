define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'app/services/ConsoleService',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'dijit/form/CheckBox',
    '../scTaskDetail/scTaskDetail'
    
], function (declare, on, domStyle, domClass, domConstruct, ConsoleService, template, CustomUIWidget, CheckBox, scTaskDetail) {
    var widget = declare('smartClientList', [CustomUIWidget], {    
        baseClass: 'smartClientList',    
        templateString: template,
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
        
        sendTaskRequest: function() {
            this.parentView.showCreateTaskBtn();
        },
        
        showTask: function() {
            var data = {
                title: 'DDG_GTS_TSS_France_Q2_LISI_AEROSP',
                status: 'Awaiting Input',
                outcome: 'Opportunity already in system',
                description: 'Opportunity already in system nothing ....'
            };
            var scTask;
            
            scTask = new scTaskDetail(data);
            
            this.parentView.domNode.appendChild(scTask.domNode);
            scTask.startup();
        },
        
        goToClient360: function() {
            alert('go to client360 module')
        },
        
        loadContactModule: function() {
//            var obj = {sourceModule: 'myclients'};
//            
//            ConsoleService.loadLeftModule('contacts', obj);
        	alert('go to contacts module')
        },
        
        showScTaskButton: function(evt) {
            
        },
        
        createView: function() {
        	/*
        	 * 
        	"hasTask": true,
        	"score": "5",
            "reasons": "5",
            "rank": "1",
            "clientTitle": "Cardiff Univercity",
            "industry": "Government, State/Provincial/Local",
            "contacts": {},
            "scTask": 0
            */
            if(this.dataset.hasTask) {
                this.optBtn.set('checked', true);
            }
            this.rank.innerHTML = this.dataset.rank;
            this.score.innerHTML = this.dataset.score;
            this.reasons.innerHTML = this.dataset.reasons;
            this.client.innerHTML = this.dataset.clientTitle;
            this.industry.innerHTML = this.dataset.industry;
//            this.contacts.innerHTML = '';
            if(this.dataset.hasTask) {
                domClass.remove(this.scTaskBtn, 'smart-hidden');
            }
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
