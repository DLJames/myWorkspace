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
    'comlib/ui/CustomUIWidget',
    'dijit/form/CheckBox',
    '../../proxy/proxy'
    
], function (declare, on, Evented, domAttr, domStyle, domClass, domConstruct, ConsoleService, template, CustomUIWidget, CheckBox, proxy) {
    var widget = declare('smartClientList', [CustomUIWidget, Evented], {    
        baseClass: 'smartClientList',    
        templateString: template,
        serialNumber: ConsoleService.getCurrentUser().getSerialNumber(),
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        constructor: function(data) {
            this.data = data;
            this._id = data._id;
            this.market = data.Market;
            this.sprint = data.Sprint;
            this.companyName = data.Company_Name;
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var domNode = this.domNode;
            this.domObj = {
                'Rank': this.rank.domNode,
                'Score': this.score.domNode,
                'SalesPlays': this.reasons.domNode,
                'Clients': this.goToClient360.domNode,
                'Segment': this.segment.domNode,
                'Industry': this.industry.domNode,
                'BU Upsell': this.buUpsell.domNode,
                'IBM Client': this.ibmClient.domNode,
                'Channel': this.channel.domNode,
                'Upsell Cycle': this.upsellCycle.domNode,
                'Tasks': this.scTask.domNode
            }
        },
        
        startup : function() {
            this.inherited(arguments);
            this.createView();
        },
        
        updateView: function() {
            
        },
        
        createView: function() {
            this.rank.innerHTML = this.data.Unique_Rank_per_Rep;
            this.score.innerHTML = this.data.Score;
            this.reasons.innerHTML = this.data.reasonForCall;
            if(this.data.reasonForCall > 0) {
                domClass.add(this.reasons, 'smartList-clickable');
            }
            this.goToClient360Btn.innerHTML = this.data.Company_Name;
            domAttr.set(this.goToClient360Btn, 'title', this.data.Company_Name);
            domAttr.set(this.goToClient360Btn, 'href', this.data.CSA_360_URL.split('/sales/console/')[1]);
            this.industry.innerHTML = this.data.Main_Industry_Description;
            domAttr.set(this.industry, 'title', this.data.Main_Industry_Description);
            if(this.data.task_client_relation) {
                this.disableOptBtn();
                this.showScTaskButton();
                this.setScBtnStatus(this.data.task_client_relation.status);
            }
        },
        
        showReasons: function() {
            this.emit('showReasons', this.data);
        },
        
        showScTaskDialog: function() {
            var me = this;
            var taskRelation = me.data.task_client_relation;
            var data = {
                params: {
                    _id: taskRelation ? taskRelation._id : '',
                    _rev: taskRelation ? taskRelation._rev :  '',
                    taskName: 'DDG_GTS_TSS_' + me.market + '_' + me.sprint + '_' + me.companyName,
                    status: taskRelation ? taskRelation.status : '',
                    outcome: taskRelation ? taskRelation.outcome : '',
                    description: taskRelation ? taskRelation.description : '',
                    task_id: taskRelation ? taskRelation.task_id : '',
                    client_id: taskRelation ? taskRelation.client_id : ''
                },
                smartClientItem: me
            };
            
            this.emit('showScTaskDialog', data);
        },
        
        addPendingTask: function(evt) {
            var data = {
                selected: evt.target.checked,
                _id: this._id,
                smartClientItem: this
            }
            
            this.emit('addPendingTask', data);
        },
        
        createScTask: function() {
            var me = this;
            var params = {
                    data: JSON.stringify({
//                        '_id': '',
//                        '_rev': '',
                        'task_name': 'DDG_GTS_TSS_' + me.market + '_' + me.sprint + '_' + me.companyName,
                        'status': 'Not Started',
                        'description': '',
                        'outcome': '',
                        'client_id': me.data.URN_IDM_COMP || '',
                        'employee_cnum': location.host === 'csa.dst.ibm.com' ? me.serialNumber : '057568613',
                    })
                };
            
            proxy.createTask(params).then(function(res) {
                if(res.errorCode) {
                    me.optBtn.set('checked', false);
                    me.emit('createTaskFail');
                    return;
                }
                me.disableOptBtn();
                me.showScTaskButton();
                me.data.task_client_relation = res.data;
                me.emit('createTaskSuccess');
            }, function() {
                me.optBtn.set('checked', false);
                me.emit('createTaskFail');
            });
        },
        
        disableOptBtn: function() {
            this.optBtn.set('checked', false);
            this.optBtn.set('disabled', true);
            domClass.add(this.optBtnCon, 'smartList-disabled');
        },
        
        setScBtnStatus: function(status) {
            if(status === 'Completed') {
                domClass.replace(this.scTaskBtn, 'icon-completed-task_graphic blue', 'icon-edit-task_graphic blue');
            }
        },
        
        updateTaskData: function(resData) {
            this.data.task_client_relation = resData;
            this.setScBtnStatus(resData.status);
        },
        
        showScTaskButton: function() {
            domClass.remove(this.scTaskBtn, 'smart-hidden');
        },
        
//        goToClient360: function() {
//            location.href = location.origin + this.data.CSA_360_URL.split('ibm.com')[1];
//        },
        
        loadContactModule: function() {
//            var obj = {sourceModule: 'myclients'};
//            
//            ConsoleService.loadLeftModule('contacts', obj);
//        	alert('go to contacts module')
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
