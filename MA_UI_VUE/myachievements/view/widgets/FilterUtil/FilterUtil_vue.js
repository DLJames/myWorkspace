define([
    'dojo/text!./template/template.html',
    'dijit/form/CheckBox'
    
], function(template, CheckBox) {
    return {
        template: template,
        data: function() {
            return {
                filterBtnText: 'SHOW FILTERS',
                filterBtnShow: 'fu-showBtn',
                filterBodyHide: 'ma-hidden',
                showFilter: false,
                filterOptArr: [],
                sortOptArr: []
            }
        },
        methods: {
            filterShowOpt: function() {
                if(!this.showFilter) {
                    this.showFilter = true;
                    this.changeParentDisplay('Horizontal');
                    this.filterBodyHide = '';
                    this.filterBtnShow = '';
                    this.filterBtnText = 'HIDE FILTERS';
                }else {
                    this.showFilter = false;
                    this.changeParentDisplay('Vertical');
                    this.filterBodyHide = 'ma-hidden';
                    this.filterBtnShow = 'fu-showBtn';
                    this.filterBtnText = 'SHOW FILTERS';
                }
                
                this.resizeParentView();
            },
            
            changeParentDisplay: function(displayType) {
                this.$emit('changebodydisplay', displayType);//emit 触发的event名称必须小写 changebodydisplay
            },
            
            resizeParentView: function() {
                this.$emit('resizeview');
            },
            
            clearAllOptions: function() {
                var checkboxArr = document.querySelectorAll('input');
                
                checkboxArr.forEach(function(item) {
                    item.checked = false;
                });
                
                this.filterOptArr.length = 0;
                this.sortOptArr.length = 0;
            },
            
        }
    }
});