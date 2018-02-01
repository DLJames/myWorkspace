define([
    './widgets/FilterUtil/FilterUtil_vue',
    './widgets/MyBadge/MyBadge_vue',
    './widgets/MyCertificate/MyCertificate_vue'
    
], function(FilterUtil, MyBadge, MyCertificate) {
    return {
        data: {
            bodyConHorizontal: ''
        },
        
        props: ['dojoView'],
        
        components: {
            'filterUtil': FilterUtil,
            'myBadge': MyBadge,
            'myCertificate': MyCertificate
        },
        
        methods: {
            changeBodyDisplay: function(displayType) {
                if(displayType === 'Horizontal') {
                    this.bodyConHorizontal = 'ma-horizontal';
                }else {
                    this.bodyConHorizontal = '';
                }
            },
            
            resizeView: function() {
                this.dojoView.resizeScroll();
//                this.dojoView.myBadge.resizeView();
//                this.dojoView.MyCertificate.resizeView();
                
            }
        }
    }
});