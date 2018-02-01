define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/fx',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',    
    'comlib/ui/CustomUIWidget',
    'app/services/ConsoleService',
    '../../../proxy/proxy',
    'dijit/form/DateTextBox',
    'dojo/date/locale',
    '../../../dist/vue.min'
    
], function(declare, on, fx, domStyle, domClass, domConstruct, template, CustomUIWidget, ConsoleService, proxy, DateTextBox, DateLocale, Vue) {    
    var widget = declare('', [CustomUIWidget], {    
        baseClass : 'ma-certificateNewAdd',    
        templateString : template,    
        postCreate : function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(this.saveBtn, 'click', function(evt) {
                this.formValidate();
                evt.stopPropagation();
            }.bind(this));
            
            on(this.goToAchivLevel, 'click', function() {
                this.destroy();
            }.bind(this));
            
            on(this.cancelBtn, 'click', function() {
                this.destroy();
            }.bind(this));
            
            on(this.drapCon, 'click', function() {
                
            }.bind(this));
            
            on(this.titleItem, 'input', function() {
                domClass.replace(this.titleItemIcon, 'ma-hidden');
            }.bind(this));
            
            on(this.titleItem, 'blur', function() {
                me.formInputValidate(this.value, me.titleItemIcon);
            });
            
            on(this.urlItem, 'input', function() {
                domClass.replace(this.urlItemIcon, 'mna-linkIcon');
            }.bind(this));
            
            on(this.urlItem, 'blur', function() {
                me.formInputValidate(this.value, me.urlItemIcon);
            });
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.createView();
        },
        
        createView: function() {
            var dateCon = domConstruct.create('div', {'class': 'mna-issueDate'}, this.issueDateCon, 'first');
            var dateItem = this.dateItem = new DateTextBox({
                id: 'mna_issueDate',
                value: new Date(),
                required: true
            }, dateCon);
            
            domStyle.set(dateItem._buttonNode, 'display', 'none');
            dateItem.domNode.querySelectorAll('.dijitInputInner')[0].disabled = true;
            
            on(dateItem.domNode, 'click', function() {
                this.dateItem.toggleDropDown();
            }.bind(this));
            
//            on(this.dateItem.domNode.querySelectorAll('.dijitInputInner')[0], 'blur', function() {
//                if(this.dateItem.validate()) {
//                    domClass.replace(this.dateItemIcon, 'icon-inactive_alert');
//                }else {
//                    domClass.replace(this.dateItemIcon, 'icon-suppress-deselected_graphic_Artboard-38');
//                }
//            }.bind(this));
        },
        
        formInputValidate: function(val, dom) {
            if(!val)return;
            domClass.replace(dom, 'icon-inactive_alert');
        },
        
        formValidate: function() {
            var flag = true;
            
            if(!this.titleItem.value) {
                domClass.replace(this.titleItemIcon, 'icon-suppress-deselected_graphic_Artboard-38');
                flag = false;
            }
            if(!this.urlItem.value) {
                domClass.replace(this.urlItemIcon, 'icon-suppress-deselected_graphic_Artboard-38');
                flag = false;
            }
            if(!this.dateItem.validate()) {
                domClass.replace(this.dateItemIcon, 'icon-suppress-deselected_graphic_Artboard-38');
                flag = false;
            }
            if(!flag) {
                this.showToolTip('Please make sure that title and url are not empty.');
                return;
            }
            this.saveNewCertificate();
        },
        
        saveNewCertificate: function() {
            var me = this;
            var title = me.titleItem.value;
            var url = me.urlItem.value;
            var issueDate = DateLocale.format(me.dateItem.value, {selector: 'date', datePattern: 'd MMM yyyy'});
            
            me.showLoading();
            
            setTimeout(function() {
                me.hideLoading();
                me.handleException('');
//                me.destroy();
            }, 2000);
        },
        
        handleException : function(msg) {
            var errorMsg1 = 'There is an error happened due to server could not understand this request.';
            var errorMsg2 = 'There is an error happened due to server could not understand this request, errorMassage : ' + msg;
            
            if(msg === 'ajaxFail') {
                this.showToolTip('Please check your network and try again.');
            }else {
                this.showToolTip(msg === '' ? errorMsg1 : errorMsg2);
            }
        },
        
        showToolTip : function(msg) {
            var btnRect = this.saveBtn.getBoundingClientRect();
            var srcTop = btnRect.top;
            var srcLeft = btnRect.left;
            var srcWidth = btnRect.width;
            var left = null;
            var top = null;
            
            this.toolTip = domConstruct.create('div',{
                'class' : 'mna-ExceptionTooltip',
                innerHTML : msg,
                style : {}
            }, document.body);
            
            this.addDocumentHandler();
            
            left = srcLeft - this.toolTip.getBoundingClientRect().width / 2 + srcWidth / 2;
            top = srcTop - this.toolTip.getBoundingClientRect().height - 10;
            
            this.toolTip.style.left = (left > 0 ? left : -left) + 20 + 'px';
            this.toolTip.style.top = top + 'px';
        },
        
        addDocumentHandler : function() {
            on.once(document, 'click', function(evt) {
                if(evt.button === 0) {
                    this.destroyToolTip();
                }
            }.bind(this));
        },
        
        destroyToolTip : function() {
            domConstruct.destroy(this.toolTip);
        },
        
        showLoading: function() {
            domClass.remove(this.shadowCon, 'ma-hidden');
        },
        
        hideLoading: function() {
            domClass.add(this.shadowCon, 'ma-hidden');
        },
        
        _onFocus : function() {    
            this.inherited(arguments);    
        },
        
        _onBlur : function() {    
            this.inherited(arguments);    
        }
    });    
        
    return widget;    
});    
