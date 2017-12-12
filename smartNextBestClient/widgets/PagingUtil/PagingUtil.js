define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/Evented',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',    
    'comlib/ui/CustomUIWidget'
    
], function(declare, on, Evented, domStyle, domClass, domConstruct, template, CustomUIWidget) {    
    var widget = declare('', [CustomUIWidget, Evented], {    
        baseClass : 'smart-pagingUtilCon',    
        templateString : template,
        disablePrevBtn: true,
        disableNextBtn: true,
        constructor: function() {},
        postCreate : function() {    
            this.inherited(arguments);
            
            var me = this;
            
            on(me.prevBtn, 'click', function() {
                if(me.disablePrevBtn) return;
                me.goToPage('prev', -1);
            });
            
            on(me.nextBtn, 'click', function() {
                if(me.disableNextBtn) return;
                me.goToPage('next', 1);
            });
        },
        
        goToPage: function(type, num) {
            var pageNum = this.currentPage + num;
            var data = {
                'type': type,
                'pageNum': pageNum
            }
            
            this.changeCurrentPage(pageNum);
            this.currentPageNum.innerHTML = pageNum;
            this.emit('goToPage', data);
        },
        
        createView: function(totalData) {
            this.totalPage = Math.ceil(totalData / 200);
            
            if(this.totalPage > 0) {
                this.totalPageNum.innerHTML = this.totalPage;
                this.changeCurrentPage(1);
            }else {
                this.totalPageNum.innerHTML = 0;
                this.changeCurrentPage(0);
            }
        },
        
        changeCurrentPage: function(pageNum) {
            this.currentPage = pageNum;
            this.currentPageNum.innerHTML = pageNum;
            
            if(this.currentPage <= 1) {
                domClass.add(this.prevBtn, 'pu-prevBtnDisabled');
                this.disablePrevBtn = true;
            }else {
                domClass.remove(this.prevBtn, 'pu-prevBtnDisabled');
                this.disablePrevBtn = false;
            }
            
            if(this.currentPage >= this.totalPage) {
                domClass.add(this.nextBtn, 'pu-nextBtnDisabled');
                this.disableNextBtn = true;
            }else {
                domClass.remove(this.nextBtn, 'pu-nextBtnDisabled');
                this.disableNextBtn = false;
            }
        },
        
        startup : function() {    
            this.inherited(arguments);
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
