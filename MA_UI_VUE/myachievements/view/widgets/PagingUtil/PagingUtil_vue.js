define([
    'dojo/text!./template/template.html',
    '../MyBadgeItem/MyBadgeItem_vue',
    '../MyCertificateItem/MyCertificateItem_vue'
    
], function(template, MyBadgeItem, MyCertificateItem) {
    return {
        template: template,
        props: ['pagingParams'],
        data: function() {
            return {
                firstBtnDisabled: 'pu-firstBtnDisabled',
                prevBtnDisabled: 'pu-prevBtnDisabled',
                nextBtnDisabled: '',
                lastBtnDisabled: '',
                xTranslate: 0,
                currentPage: this.pagingParams.currentPage,
                slideConHeight: 0
            }
        },
        
        mounted: function() {
//            this.addCardItems();
//            if(this.totalPage > 1) {
//                this.createDotView();
//            }
//        	var hei = this.$el.querySelector('.pu-slideBody').offsetHeight;
//        	console.log('==mounted===',hei)
        },
        
        updated: function() {
            var hei = this.$el.querySelector('.pu-slideBody').offsetHeight;
            
            this.slideConHeight = hei;
//            this.$nextTick(function() {
//                this.slideConHeight = hei;
//                console.log('==update===',hei)
//            }.bind(this));
        },
        
        components: {
            'my-badgeItem': MyBadgeItem,
            'my-certificateItem': MyCertificateItem
        },
        
        computed: {
            cardCategory: function() {
                var _i, _len, _newArr = [];
                var arr = this.pagingParams.data;
                var pageSize = this.pagingParams.pageSize;
                
                for(_i = 0, _len = arr.length; _i < _len; _i += pageSize) {
                    _newArr.push(arr.slice(_i, _i + pageSize));
                }
                return _newArr;
            },
            
            slideConStyleObj: function() {
                return {
                    'height': this.slideConHeight + 'px'
                }
            },
            
            slideBodyStyleObj: function() {
                return {
                        'width': this.pagingParams.totalPage * 100 + '%',
                        'transform': 'translate3d(' + this.xTranslate + 'px, 0, 0)'
                };
            },
            
            slideItemConStyleObj: function() {
                return {
                    'width': 1 / this.pagingParams.totalPage * 100 + '%'
                }
            },
            
            hasDotCon: function() {
                return this.pagingParams.totalPage > 1;
            },
            
            totalPage: function() {
                return this.pagingParams.totalPage;
            }
        },
        
        methods: {
            goToPage: function(pageNum) {
                var slideWidth = this.getSlideConWidth();
//                
                this.xTranslate = -slideWidth * (pageNum - 1);
                this.changeCurrentPage(pageNum);
            },
            
            changeCurrentPage: function(pageNum) {
                this.currentPage = pageNum;
                
                if(this.currentPage === 1) {
                    this.firstBtnDisabled = 'pu-firstBtnDisabled';
                    this.prevBtnDisabled = 'pu-prevBtnDisabled';
                }else {
                    this.firstBtnDisabled = '';
                    this.prevBtnDisabled = '';
                }
                
                if(this.currentPage === this.totalPage) {
                    this.nextBtnDisabled = 'pu-nextBtnDisabled';
                    this.lastBtnDisabled = 'pu-lastBtnDisabled';
                }else {
                    this.nextBtnDisabled = '';
                    this.lastBtnDisabled = '';
                }
            },
            
            getSlideConWidth: function() {
                return this.$el.querySelector('.pu-slideCon').offsetWidth;
            }
        }
    }
});