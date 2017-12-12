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
    '../../proxy/proxy'
    
], function (declare, on, Evented, domAttr, domStyle, domClass, domConstruct, ConsoleService, template, CustomUIWidget, proxy) {    
    var widget = declare('scTaskDetail', [CustomUIWidget, Evented], {    
        baseClass: 'scTaskDetail',
        templateString: template,
        serialNumber: ConsoleService.getCurrentUser().getSerialNumber(),
        intranetID: ConsoleService.getCurrentUser().getIntranetId(),
        constructor: function(data) {
            this.data = data;
            this.formObj = {
                statusObj: ['Not Started', 'In Progress', 'Pending Input', 'Deferred', 'Canceled', 'Completed'],
                outcomeObj: ['1) Wrong Solution', '2) With Competition', '3) No Budget', '4) No Authority or Sign-Off', 
                             '5) No Need/No CRA', '6) Not at current time', '7) Opportunity already in system', '8) New Opportunity Created', 
                             '9) Nurturing for future engagement']
            };
        },
        postCreate: function() {    
            this.inherited(arguments);    
            
            var me = this;
            
            on(me.statusBody, 'mouseleave', function() {
                me.hideStatusBody();
            });
            
            on(me.outcomeBody, 'mouseleave', function() {
                me.hideOutcomeBody();
            });
            
            on(me.descriptionArea, 'keyup', function() {
                me.setDescriptionLimitNum();
            });
            
            on(me.descriptionArea, 'input', function() {
                me.setDescriptionLimitNum();
            });

            on(me.descriptionArea, 'keydown', function() {
                me.setDescriptionLimitNum();
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            var me = this;
            var _status = me.data.status.trim();
            var _outcome = me.data.outcome.trim();
            var _description = me.data.description.trim();
            
            me.currentStatus = _status || 'Not Started';
            if(me.formObj.outcomeObj.includes(_outcome)) {
                me.currentOutcome = _outcome;
                me.descriptionVal = _description;
            }else {
                me.currentOutcome = 'Select One';
                me.descriptionVal = _outcome ? _outcome.concat('\n').concat(_description) : _description;
            }
            
            me.taskTitle.value = me.data.taskName;
            me.statusHead.innerHTML = me.currentStatus;
            me.outcomeHead.innerHTML = me.currentOutcome;
            me.descriptionArea.value = me.descriptionVal;
            me.setDescriptionLimitNum()
            
            if(this.currentStatus === 'Completed') {
                domClass.add(me.statusHead, 'task-disableMe');
                domClass.add(me.outcomeHead, 'task-disableMe');
                domClass.add(me.descriptionArea, 'task-disableMe');
                domAttr.set(me.descriptionArea, 'readonly', 'readonly');
                domClass.add(me.saveBtn, 'smart-hidden');
                return;
            }
            
            on(me.statusHead, 'click', function(evt) {
                me.toggleStatusBody(evt);
            });
            
            on(me.outcomeHead, 'click', function(evt) {
                me.toggleOutcomeBody(evt);
            });
            
            me.formObj.statusObj.forEach(function(item) {
                var temp;
                
                if(item === me.currentStatus) {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item active', innerHTML: item}, me.statusScrollView.scroll_con, 'last');
                }else {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item', innerHTML: item}, me.statusScrollView.scroll_con, 'last');
                }
                
                temp.onclick = function() {
                    me.statusHead.innerHTML = item;
                    me.currentStatus = item;
                    me.statusScrollView.scroll_con.querySelectorAll('.task-dropdown-item').forEach(function(dropdowItem) {
                        if(dropdowItem.innerHTML === me.currentStatus) {
                            domClass.add(dropdowItem, 'active');
                        }else {
                            domClass.remove(dropdowItem, 'active');
                        }
                    });
                    me.hideStatusBody();
                }
            });
            
            me.formObj.outcomeObj.forEach(function(item) {
                var temp;
                
                if(item === me.currentOutcome) {
                    temp = domConstruct.create('div', {'class': 'task-dropdown-item active', innerHTML: item}, me.outcomeScrollView.scroll_con, 'last');
                }else {
                    temp =domConstruct.create('div', {'class': 'task-dropdown-item', innerHTML: item}, me.outcomeScrollView.scroll_con, 'last');
                }
                
                temp.onclick = function() {
                    me.outcomeHead.innerHTML = item;
                    me.currentOutcome = item;
                    me.outcomeScrollView.scroll_con.querySelectorAll('.task-dropdown-item').forEach(function(dropdowItem) {
                        if(dropdowItem.innerHTML === me.currentOutcome) {
                            domClass.add(dropdowItem, 'active');
                        }else {
                            domClass.remove(dropdowItem, 'active');
                        }
                    });
                    me.hideOutcomeBody();
                }
            });
        },
        
        toggleStatusBody: function(evt) {
            evt.stopPropagation();
            domClass.add(this.outcomeBody, 'smart-hidden');
            domClass.toggle(this.statusBody, 'smart-hidden');
            if(!domClass.contains(this.statusBody, 'smart-hidden')) {
                this._refreshStatusScroll();
            }
            on.once(document, 'click', function(evt) {
                if(evt.button === 0) {
                    this.hideStatusBody();
                }
            }.bind(this));
        },
        
        hideStatusBody: function() {
            domClass.add(this.statusBody, 'smart-hidden');
        },
        
        toggleOutcomeBody: function(evt) {
            evt.stopPropagation();
            domClass.add(this.statusBody, 'smart-hidden');
            domClass.toggle(this.outcomeBody, 'smart-hidden');
            if(!domClass.contains(this.outcomeBody, 'smart-hidden')) {
                this._refreshOutcomeScroll();
            }
            on.once(document, 'click', function(evt) {
                if(evt.button === 0) {
                    this.hideOutcomeBody();
                }
            }.bind(this));
        },
        
        hideOutcomeBody: function() {
            domClass.add(this.outcomeBody, 'smart-hidden');
        },
        
        saveTask: function(evt) {
            if(this.currentStatus === 'Completed' && this.currentOutcome === 'Select One') {
                this.showMsgTooltip(evt.target, 'formValidation');
                return;
            }
            
            if(this.currentStatus === 'Completed' && this.descriptionArea.value.trim() === '') {
                this.showMsgTooltip(evt.target, 'formValidation');
                return;
            }
            
            this.sendRequest(evt);
        },
        
        sendRequest: function(evt) {
            var me = this;
            var params = {
                    data: JSON.stringify({
                        '_id': me.data._id || '',
                        '_rev': me.data._rev || '',
                        'task_name': me.data.taskName,
                        'status': me.currentStatus || '',
                        'outcome': me.currentOutcome === 'Select One' ? '' : me.currentOutcome,
                        'description': me.descriptionArea.value || '',
                        'client_id': me.data.client_id || '',
                        'employee_cnum': location.host === 'csa.dst.ibm.com' ? me.serialNumber : '057568613',
                        'task_id': me.data.task_id || ''
                    })
            };
            
            ConsoleService.logActivity('13195', 'D12');
            
            me.showLoader();
            proxy.editTask(params).then(function(res) {
                var data = {
                    'bodyClassName': 'smart-tooltip-center',
                    'tooltipTitle': 'Error',
                    'commonMsg': '<div>It wasn’t possible to create/edit tasks in SalesConnect due to API restriction, please try it again later.</div>'
                };
                
                me.hideLoader();
                if(res.errorCode || !res.data) {
//                    me.showMsgTooltip(evt.target, 'ajaxError');
                    me.emit('showTooltipDialog', _data);
                    me.destroy();
                    return;
                }
                me.emit('updateTaskData', res.data);
                me.destroy();
            }, function() {
//                me.showMsgTooltip(evt.target, 'ajaxError');
                me.emit('showTooltipDialog', _data);
                me.destroy();
            });
        },
        
        setDescriptionLimitNum: function() {
            this.descriptionUsedNum.innerHTML = this.descriptionArea.value.length;
        },
        
        showLoader: function() {
            domClass.remove(this.shadowCon, 'smart-hidden');
        },
        
        hideLoader: function() {
            domClass.add(this.shadowCon, 'smart-hidden');
        },
        
        showMsgTooltip: function(target, type) {
//            var targetRect = target.getBoundingClientRect();
//            var _left = targetRect.left + 40;
//            var _top = targetRect.top + 45;
            var _msg;
            var msgObj = {
                'ajaxError': 'An error occur, please check your network and try again later.',
                'formValidation': 'Outcome and description should not be empty when status is completed.'
            }
            
            _msg = domConstruct.create('div', {
                'class': 'task-errorMsg',
                innerHTML: msgObj[type],
//                style: {
//                    'left': _left + 'px',
//                    top: _top + 'px'
//                }
                }, this.taskContainer, 'last');
            
            setTimeout(function() {
                domConstruct.destroy(_msg);
            }.bind(this), 3500);
        },
        
        _refreshStatusScroll: function() {
            this.statusScrollView.resize();
        },
        
        _refreshOutcomeScroll: function() {
            this.outcomeScrollView.resize();
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
