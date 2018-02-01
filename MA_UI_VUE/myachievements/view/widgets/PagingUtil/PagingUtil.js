define([    
    'dojo/_base/declare',    
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-construct',
    'dojo/text!./template/template.html',    
    'comlib/ui/CustomUIWidget',
    '../MyBadgeItem/MyBadgeItem',
    '../MyCertificateItem/MyCertificateItem'
    
], function(declare, on, domStyle, domClass, domConstruct, template, CustomUIWidget, MyBadgeItem, MyCertificateItem) {    
    var widget = declare('', [CustomUIWidget], {    
        baseClass : 'pu-pagingUtilCon',    
        templateString : template,    
        constructor: function(cardType, data, currentPage, pageSize, totalNum, totalPage) {
            this.cardType = cardType;
            this.data = data;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalNum = totalNum;
            this.totalPage = totalPage;
        },
        postCreate : function() {    
            this.inherited(arguments);
            
        },
        
        startup : function() {    
            this.inherited(arguments);
            this.initView()
        },
        
        initView: function() {
            this.setSlideBodyWidth();
            this.addCardItems();
            if(this.totalPage > 1) {
                this.createDotView();
            }
        },
        
        setSlideBodyWidth: function() {
            var _w = this.totalPage * 100 + '%';
            
            domStyle.set(this.slideBody, 'width', _w);
        },
        
        addCardItems: function() {
            var me = this;
            var _i, _len, _newArr = [];
            var arr = me.data;
            var pageSize = me.pageSize;
            
            for(_i = 0, _len = arr.length; _i < _len; _i += pageSize) {
                _newArr.push(arr.slice(_i, _i + pageSize));
            }
            
            _newArr.forEach(function(item, idx) {
                var _len = _newArr.length;
                var slideItemCon = domConstruct.create('div', {
                    'class': 'slideItemCon',
                    style: {
                        width: 1 / me.totalPage * 100 + '%'
                    }
                }, me.slideBody, 'last');
                
                if(idx === _len - 1) {
                    domClass.add(slideItemCon, 'slideItemCon-end');
                }
                
                item.forEach(function(item2, i2) {
                    var data = {
                        name: 'IBM Agile Explorer ' + (idx+1) + '-' +i2,
                        issueDate: '25 Jan 2017',
                        url: 'https://www.youracclaim.com/org/ibm/badge/ibm-agile-explorer',
                        src: 'https://acclaim-production-app.s3.amazonaws.com/images/61e3edfb-3b5e-4340-92cc-d601d3b68286/AA-Badge-explorer-352.png'
                    }
                    var slideItem = null;
                    
                    slideItem = me.createSlideItem(data);
                    slideItemCon.appendChild(slideItem.domNode);
                });
                
            });
            
            domStyle.set(me.slideCon, 'height', me.slideBody.offsetHeight + 'px');
        },
        
        createSlideItem: function(data) {
            var slideItem = null;
            
            if(this.cardType === 'mybadge') {
                slideItem = new MyBadgeItem(data);
            }else {
                slideItem = new MyCertificateItem(data);
            }
            slideItem.startup();
            
            return slideItem;
        },
        
        createDotView: function() {
            var me = this;
            var _i, _len, _liArr = [];
            
            for(_i = 1, _len = this.totalPage; _i <= _len; _i++) {
                this.createDotItem(_i);
            }
            
            me.disableFrontBtns = true;
            me.disableEndBtns = false;
            
            on(this.goToFirstBtn, 'click', function() {
                if(me.disableFrontBtns) return;
                me.goToPage(1);
            });
            
            on(this.prevBtn, 'click', function() {
                if(me.disableFrontBtns) return;
                me.goToPage(me.currentPage - 1);
            });
            
            on(this.nextBtn, 'click', function() {
                if(me.disableEndBtns) return;
                me.goToPage(me.currentPage + 1);
            });
            
            on(this.goToLastBtn, 'click', function() {
                if(me.disableEndBtns) return;
                me.goToPage(me.totalPage);
            });
            
            domClass.remove(this.dotCon, 'ma-hidden');
        },
        
        createDotItem: function(pageNum) {
            var className = 'pu-dotItem';
            var dotItem = null;
            
            if(pageNum === this.currentPage) {
                className += ' active';
            }
            
            if(!this.dotItemArr) {
                this.dotItemArr = [];
            }
            
             dotItem = domConstruct.create('li', {
                'class': className,
                innerHTML: pageNum
            }, this.dotItemCon, 'last');
             
             on(dotItem, 'click', function() {
                 this.goToPage(pageNum);
             }.bind(this));
             
             this.dotItemArr.push(dotItem);
        },
        
        goToPage: function(pageNum) {
            var slideWidth = this.slideCon.offsetWidth;
            var _x = -slideWidth * (pageNum - 1); 
            
            domStyle.set(this.slideBody, 'transform', 'translate3d(' + _x + 'px, 0, 0)');
            this.changeCurrentPage(pageNum);
        },
        
        changeCurrentPage: function(pageNum) {
            this.currentPage = pageNum;
            
            this.dotItemArr.forEach(function(item, _i) {
                if(_i + 1 === pageNum) {
                    domClass.add(item, 'active');
                }else {
                    domClass.remove(item, 'active');
                }
            });
            
            if(this.currentPage === 1) {
                domClass.add(this.goToFirstBtn, 'pu-firstBtnDisabled');
                domClass.add(this.prevBtn, 'pu-prevBtnDisabled');
                this.disableFrontBtns = true;
            }else {
                domClass.remove(this.goToFirstBtn, 'pu-firstBtnDisabled');
                domClass.remove(this.prevBtn, 'pu-prevBtnDisabled');
                this.disableFrontBtns = false;
            }
            
            if(this.currentPage === this.totalPage) {
                domClass.add(this.goToLastBtn, 'pu-lastBtnDisabled');
                domClass.add(this.nextBtn, 'pu-nextBtnDisabled');
                this.disableEndBtns = true;
            }else {
                domClass.remove(this.goToLastBtn, 'pu-lastBtnDisabled');
                domClass.remove(this.nextBtn, 'pu-nextBtnDisabled');
                this.disableEndBtns = false;
            }
        },
        
        resizeSlide: function() {
            var slideWidth = this.slideCon.offsetWidth;
            var _x = -slideWidth * (this.currentPage - 1); 
            
            domStyle.set(this.slideBody, 'transform', 'translate3d(' + _x + 'px, 0, 0)');
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
