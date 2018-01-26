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
        constructor: function(data, defaultColumns) {
            this.data = data;
            this._id = data._id;
            this.market = data.Market;
            this.sprint = data.Sprint;
            this.companyName = data.Company_Name;
            this.defaultColumns = defaultColumns;
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var domNode = this.domNode;
            this.customDomObj = {
                'Rank': this.rank,
                'Score': this.score,
                'Sales plays': this.reasons,
                'Segment': this.segment,
                'Industry': this.industry,
                'BU Upsell': this.buUpsell,
                'IBM Client': this.ibmClient,
                'Channel': this.channel,
                'Upsell Cycle': this.upsellCycle,
                'Tasks': this.scTask
            }
        },
        
        startup : function() {
            this.inherited(arguments);
            this.createView();
        },
        
        updateView: function() {
            for(var key in this.customDomObj) {
                if(this.defaultColumns.includes(key)) {
                    domClass.remove(this.customDomObj[key], 'smart-hidden');
                }else {
                    domClass.add(this.customDomObj[key], 'smart-hidden');
                }
            }
        },
        
        createView: function() {
            this.rank.innerHTML = this.data.Unique_Rank_per_Rep;
            this.score.innerHTML = this.data.Score;
            this.goToClient360Btn.innerHTML = this.data.Company_Name;
            domAttr.set(this.goToClient360Btn, 'title', this.data.Company_Name);
            domAttr.set(this.goToClient360Btn, 'href', this.data.CSA_360_URL.split('/sales/console/')[1]);
            this.reasons.innerHTML = this.data.reasonForCall;
            if(this.data.reasonForCall > 0) {
                domClass.add(this.reasons, 'smartList-clickable');
            }
            this.industry.innerHTML = this.data.Main_Industry_Description;
            domAttr.set(this.industry, 'title', this.data.Main_Industry_Description);
            if(this.data.task_client_relation) {
                this.setOptBtnDisable();
                this.showScTaskButton();
                this.setScBtnStatus(this.data.task_client_relation.status);
            }else {
                this.emit('enableSelectAllBtn');
            }
            this.segment.innerHTML = this.data.Sector_ISU;
            this.buUpsell.innerHTML = this.data.TSS_Land_or_Expand;
            this.ibmClient.innerHTML = this.data.IBM_Client_Flg;
            this.channel.innerHTML = this.data.TSS_Channel;
            this.upsellCycle.innerHTML = this.data.Upsell_Cycle;
            if(!this.defaultColumns.length) return;
            this.updateView();
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
        
        selectAllOptBtn: function(flag) {
            if(!this.optBtn.get('disabled')) {
                this.setOptBtnStatus(flag);
                this.selectAllToPendingTask(flag);
            }
        },
        
        selectAllToPendingTask: function(flag) {
            var data = {
                selected: flag,
                _id: this._id,
                smartClientItem: this
            }
            
            this.emit('selectAllToPendingTask', data);
        },
        
        handlePendingTask: function() {
            var data = {
                selected: this.optBtn.checked,//evt.target.checked,
                _id: this._id,
                smartClientItem: this
            }
            
            this.emit('handlePendingTask', data);
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
                    me.emit('createTaskFail');
                    return;
                }
                me.setOptBtnDisable();
                me.showScTaskButton();
                me.data.task_client_relation = res.data;
                me.emit('createTaskSuccess');
            }, function() {
                me.emit('createTaskFail');
            });
        },
        
        getOptBtnStatus: function(flag) {
            return this.optBtn.get('checked');
        },
        
        setOptBtnStatus: function(flag) {
            this.optBtn.set('checked', flag);
        },
        
        getOptBtnDisable: function() {
            return this.optBtn.get('disabled');
        },
        
        setOptBtnDisable: function() {
            this.optBtn.set('disabled', true);
            domClass.add(this.optBtnCon, 'smartList-disabled');
        },
        
        setScBtnStatus: function(status) {
            switch (status) {
                case 'Not Started': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-notstart-task_graphic')
                    break;
                case 'In Progress': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-progress-task_graphic')
                    break;
                case 'Pending Input': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-pending-task_graphic')
                    break;
                case 'Deferred': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-deferred-task_graphic')
                    break;
                case 'Canceled': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-canceld-task_graphic')
                    break;
                case 'Completed': domClass.replace(this.scTaskBtn, 'smart-scTask-btn icon-completed-task_graphic')
                    break;
                default: 
                    break;
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
