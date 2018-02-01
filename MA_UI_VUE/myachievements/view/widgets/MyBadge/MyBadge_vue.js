define([
    'dojo/text!./config/response.json',
    'dojo/text!./template/template.html',
    'app/services/ConsoleService',
    '../PagingUtil/PagingUtil_vue'
    
], function(_json, template, ConsoleService, PagingUtil) {
    return {
        template: template,
        data: function() {
            return {
                statusIcon: 'loader',
                statusConShow: '',
                seeMoreConShow: 'ma-hidden',
                noDataConShow: 'ma-hidden',
                pagingUtilShow: 'ma-hidden',
                pagingParams: {
                    cardType: 'mybadge',
                    data: [],
                    currentPage: 1,
                    pageSize: 4,
                    totalNum: 0,
                    totalPage: 0
                }
            }
        },
        
        mounted: function() {
            this.sendRequest();
        },
        
        components: {
            'paging-util': PagingUtil
        },
        
        methods: {
            sendRequest: function() {
                var me = this;
                var res = JSON.parse(_json);
//                var arr = Array.apply(null, {length: 22});
                var arr = res.data;
                var intranetID = ConsoleService.getCurrentUser().getIntranetId();
                
                me.changeAjaxStatus('loader');
                setTimeout(function() {
                    me.changeAjaxStatus('');
                    
                    setTimeout(function() {
                        if(intranetID !== 'sbaonan@cn.ibm.com' && intranetID === 'sunjdl@cn.ibm.com') {
                            me.createNoBadgeView();
//                            me.parentView.resizeScroll();
                            return;
                        }
                        if(arr && arr.length) {
                            me.createMyBadgeView(arr);
                            me.showSeeMoreBtn();
//                            me.parentView.resizeScroll();
                        }else {
                            me.changeAjaxStatus('error');
                        }
                    }, 600);
                }, 3000);
            },
            
            createNoBadgeView: function() {
                this.noDataConShow = '';
            },
            
            createMyBadgeView: function(arr) {
                this.pagingParams.data = arr;
//                this.$set(this.pagingParams, 'data', arr);
                this.pagingParams.totalNum = arr.length;
                this.pagingParams.totalPage = Math.ceil(this.pagingParams.totalNum/this.pagingParams.pageSize);
                this.pagingUtilShow = '';
            },
            
            showMoreBadges: function() {
                alert('developing now');
            },
            
            showSeeMoreBtn: function() {
                this.seeMoreConShow = '';
            },
            
            changeAjaxStatus: function(statusType) {
                this.statusIcon = statusType;
                if(statusType) {
                    this.statusConShow = '';
                }else {
                    this.statusConShow = 'ma-hidden';
                }
            },
            
            reloadRequest: function() {
                if(this.statusIcon === 'loader') return;
                this.sendRequest();
            },
            
            resizeView: function() {
//                if(!this.pagingUtil) return;
//                this.pagingUtil.resizeSlide();
            }
        }
    }
});