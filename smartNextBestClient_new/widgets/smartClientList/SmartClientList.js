define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'app/services/ConsoleService',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget',
    'dijit/form/CheckBox',
    '../scTaskDetail/scTaskDetail'
    
], function (declare, on, Evented, domStyle, domClass, domConstruct, ConsoleService, template, CustomUIWidget, CheckBox, scTaskDetail) {
    var widget = declare('smartClientList', [CustomUIWidget, Evented], {    
        baseClass: 'smartClientList',    
        templateString: template,
        constructor: function(data) {
            this.data = data;
            this.clicentIdentify = data._id;
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
            this.rank.innerHTML = this.data.Unique_Rank_per_Rep;
            this.score.innerHTML = this.data.Score;
            this.reasons.innerHTML = this.data.reasonForCall;
            this.client.innerHTML = this.data.Company_Name;
            this.industry.innerHTML = this.data.Main_Industry_Description;
            if(this.data.task_status) {
                this.disableOptBtn();
                this.showScTaskButton();
            }
        },
        
        showScTaskDialog: function() {
            var data = {
                title: 'DDG_GTS_TSS_France_Q2_LISI_AEROSP',
                status: 'Awaiting Input',
                outcome: 'Opportunity already in system',
                description: 'Opportunity already in system nothing ....'
            };
            
            this.emit('showScTaskDialog', data);
        },
        
        addPendingTask: function(evt) {
            var data = {
                'selected': evt.target.checked,
                'clicentIdentify': this.clicentIdentify,
                'clientEntity': this
            }
            
            this.emit('addPendingTask', data);
        },
        
        createScTask: function() {
            this.disableOptBtn();
            this.showScTaskButton();
            this.emit('hideCreateTaskBtn');
        },
        
        disableOptBtn: function() {
            this.optBtn.set('checked', false);
            this.optBtn.set('disabled', true);
            domClass.add(this.optBtnCon, 'smartList-disabled');
        },
        
        showScTaskButton: function() {
            domClass.remove(this.scTaskBtn, 'smart-hidden');
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
        
        _onFocus: function() {    
            this.inherited(arguments);
        },    
        
        _onBlur: function() {    
           this.inherited(arguments);
        }    
    });    
        
    return widget;    
});    
