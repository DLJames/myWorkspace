define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/Evented',
    'dojo/text!./template/template.html',
    'comlib/ui/CustomUIWidget'
    
], function (declare, on, domStyle, domClass, domConstruct, Evented, template, CustomUIWidget) {
    var widget = declare('FilterUtilItem', [CustomUIWidget, Evented], {
        baseClass: 'FilterUtilItem',
        templateString: template,
        constructor: function(data) {
            this.dataSource = data.dataSource;
            this.filterType = data.filterType;
            this.filterItemName = data.filterItemName;
//            this.specialItems = ['Tasks', 'Sales Plays'];
            this.specialItems = ['Tasks'];
        },
        postCreate: function() {
            this.inherited(arguments);
            
            var me = this;
            
            on(me.itemHead, 'click', function(){
                me.showFilterItem();
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
            if(!this.specialItems.includes(this.filterType)) {
                this.createView();
            }
        },
        
        createView: function() {
            var me = this;
            
//            me.filterItemName.innerHTML = me.filterItemName;
            me.dataSource.forEach(function(item) {
                var itemBody, inputBtn;
                
                itemBody = domConstruct.create('div', {'class': 'smart-filterItemBody'}, me.domNode, 'last');
                inputBtn = domConstruct.create('input', {'class': 'smart-filter-input', 'placeholder': 'Enter ' + item}, itemBody, 'last');
                
                on(inputBtn, 'input', function(evt) {
                    me.showFilterDetail(evt, item);
                });
                
                on(inputBtn, 'click', function(evt) {
                    me.showFilterDetail(evt, item);
                    evt.stopPropagation();
                });
            });
            
            me.doneBtn = domConstruct.create('div', {'class': 'smart-filterItemBtn smart-btnDisable', innerHTML: 'Done'}, me.domNode, 'last');
            
            on(me.doneBtn, 'click', function() {
                if(domClass.contains(me.doneBtn, 'smart-btnDisable')) {
                    return;
                }
                
                me.clearInputVal();
                domClass.add(me.doneBtn, 'smart-btnDisable');
                me.emit('showFilterResult', {'filterType': me.filterType});
            })
        },
        
        showFilterItem: function() {
            domClass.toggle(this.domNode, 'bodyHide');
            this.emit('hideAllItem', this.filterType);
            this.emit('refreshScroll');
        },
        
        hideFilterItem: function() {
            domClass.add(this.domNode, 'bodyHide');
        },
        
        showFilterDoneBtn: function(data) {
            if(data.length) {
                domClass.remove(this.doneBtn, 'smart-btnDisable');
            }else {
                domClass.add(this.doneBtn, 'smart-btnDisable');
            }
        },
        
        showFilterDetail: function(evt, dataSource) {
            var val = evt.target.value.trim();
            var data = {
                'dataSource': dataSource,
                'val': val
            };
            
            this.emit('showFilterDetail', data);
        },
        
        clearInputVal: function() {
            this.domNode.querySelectorAll('.smart-filter-input').forEach(function(item) {
                item.value = '';
            });
        },
        
        createViewWithIcon: function(data) {
            var me = this;
            var itemBody;
            
            itemBody = domConstruct.create('div', {'class': 'smart-filterItemBody'}, me.domNode, 'last');
            if(!data || !data.length) {
                domConstruct.create('div', {'class': 'smart-filterIconItem', innerHTML: 'Not found'}, itemBody, 'last');
                return;
            }
            data.forEach(function(item) {
                var filterIconItem, itemSel;
                
                filterIconItem = domConstruct.create('div', {'class': 'smart-filterIconItem'}, itemBody, 'last');
                itemSel = domConstruct.create('div', {'class': 'smart-filterCheckbox icon-completed-idle'}, filterIconItem, 'last');
                domConstruct.create('div', {'class': 'smart-filterIconName', innerHTML: item.split('_').join(' ')}, filterIconItem, 'last');
                domConstruct.create('div', {'class': me.getFilterIconClass(item)}, filterIconItem, 'last');
                
                on(itemSel, 'click', function(evt) {
                    var _data = {
                            'filterType': me.filterType,
                            'value': me.filterType + '##' + item,
                            'self': me
                        };
                        
                    domClass.toggle(itemSel, 'selectMe');
                    _data.selected = domClass.contains(itemSel, 'selectMe');
                    me.emit('showFilterResult', _data);
                });
            });
        },
        
//        createTasksView: function(data) {
//            var me = this;
//            var itemBody;
//            
//            itemBody = domConstruct.create('div', {'class': 'smart-filterItemBody'}, me.domNode, 'last');
//            if(!data || !data.length) {
//                domConstruct.create('div', {'class': 'smart-filterTaskItem', innerHTML: 'Not found'}, itemBody, 'last');
//                return;
//            }
//            data.forEach(function(item) {
//                var taskStatusItem, itemSel;
//                
//                taskStatusItem = domConstruct.create('div', {'class': 'smart-filterTaskItem'}, itemBody, 'last');
//                itemSel = domConstruct.create('div', {'class': 'smart-statusCheckbox icon-completed-idle'}, taskStatusItem, 'last');
//                domConstruct.create('div', {'class': 'smart-filterTaskName', innerHTML: item}, taskStatusItem, 'last');
//                domConstruct.create('div', {'class': me.getStatusClass(item)}, taskStatusItem, 'last');
//                
//                on(itemSel, 'click', function(evt) {
//                    var _data = {
//                            'filterType': me.filterType,
//                            'value': me.filterType + '##' + item,
//                            'self': me
//                        };
//                        
//                    domClass.toggle(itemSel, 'selectMe');
//                    _data.selected = domClass.contains(itemSel, 'selectMe');
//                    me.emit('showFilterResult', _data);
//                });
//            });
//        },
        
        getFilterIconClass: function(status) {
            switch(status) {
                case 'Waxit': return 'smart-filterIcon icon-icon-number-1'
                    break;
                case 'SWMA': return 'smart-filterIcon icon-icon-number-2'
                    break;
                case 'IMS_Upsell': return 'smart-filterIcon icon-icon-number-3'
                    break;
                case 'Cloud_Upsell': return 'smart-filterIcon icon-icon-number-4'
                    break;
                case 'Networking_Upsell': return 'smart-filterIcon icon-icon-number-5'
                    break;
                case 'Linux_SW': return 'smart-filterIcon icon-icon-number-6'
                    break;
                case 'IMS_Whitespace': return 'smart-filterIcon icon-icon-number-7'
                    break;
                case 'IS_Whitespace': return 'smart-filterIcon icon-icon-number-8'
                    break;
                case 'Networking_Whitespace': return 'smart-filterIcon icon-icon-number-9'
                    break;
                case 'Cloud_Whitespace': return 'smart-filterIcon icon-icon-number-10'
                    break;
                case 'Not Started': return 'smart-filterIcon icon-icon-task-not-started'
                    break;
                case 'In Progress': return 'smart-filterIcon icon-icon-task-in-progress'
                    break;
                case 'Pending Input': return 'smart-filterIcon icon-icon-task-pending-input'
                    break;
                case 'Deferred': return 'smart-filterIcon icon-icon-task-deferred'
                    break;
                case 'Canceled': return 'smart-filterIcon icon-icon-task-cancelled'
                    break;
                case 'Completed': return 'smart-filterIcon icon-icon-task-completed'
                    break;
                default: return 'smart-filterIcon icon-icon-task-not-started'
                    break;
            }
        },
        
        clearCurrentData: function(item) {
            var _text = item.split('_').join(' ');
            this.domNode.querySelectorAll('.smart-filterIconItem').forEach(function(taskItem) {
                if(taskItem.children[1].innerHTML === _text) {
                    domClass.remove(taskItem.children[0], 'selectMe');
                }
            });
        },
        
        clearAllData: function() {
            this.domNode.querySelectorAll('.smart-filterIconItem').forEach(function(taskItem) {
                domClass.remove(taskItem.children[0], 'selectMe');
            });
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
