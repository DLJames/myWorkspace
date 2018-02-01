define([
    'dojo/text!./config/response.json',
    'dojo/text!./template/template.html',
    'app/services/ConsoleService',
    '../CertificateNewAdd/CertificateNewAdd_vue',
    '../PagingUtil/PagingUtil_vue'
    
], function(_json, template, ConsoleService, CertificateNewAdd, PagingUtil) {
    return {
        template: template,
        data: function() {
            return {
                statusIcon: 'loader',
                statusConShow: '',
                addNewConShow: 'ma-hidden',
                seeMoreConShow: 'ma-hidden',
                noDataConShow: 'ma-hidden',
                pagingUtilShow: 'ma-hidden',
                pagingParams: {
                    cardType: 'mycertificate',
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
//                var arr = Array.apply(null, {length: 10});
                var res = JSON.parse(_json);
                var arr = res.data;
                var intranetID = ConsoleService.getCurrentUser().getIntranetId();
                
                me.changeAjaxStatus('loader');
                setTimeout(function() {
                    me.changeAjaxStatus('');
                    
                    setTimeout(function() {
                        if(intranetID !== 'sbaonan@cn.ibm.com' && intranetID === 'sqliu@cn.ibm.com') {
                            me.createNoCertificateView();
//                            me.parentView.resizeScroll();
                            return;
                        }
                        if(arr && arr.length) {
                            me.createMyCertificateView(arr);
                            me.showAddNewBtn();
                            me.showSeeMoreBtn();
//                            me.parentView.resizeScroll();
                        }else {
                            me.changeAjaxStatus('error');
                        }
                    }, 600);
                }, 1500);
            },
            
            createNoCertificateView: function() {
                this.noDataConShow = '';
            },
            
            createMyCertificateView: function(arr) {
                this.pagingParams.data = arr;
                this.pagingParams.totalNum = arr.length;
                this.pagingParams.totalPage = Math.ceil(this.pagingParams.totalNum/this.pagingParams.pageSize);
                this.pagingUtilShow = '';
            },
            
            showMoreCertificates: function() {
                alert('developing now');
            },
            
            showSeeMoreBtn: function() {
                this.seeMoreConShow = '';
            },
            
            showAddNewBtn: function() {
                this.addNewConShow = '';
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
            },
            
            showNewCertificate: function() {
                var certificate = null;
                
//                certificate = new CertificateNewAdd();
                certificate = new WidgetUtil();
                this.parentView = this;
                this.parentView.domNode.appendChild(certificate.domNode);
                certificate.startup();
            }
        }
    }
});