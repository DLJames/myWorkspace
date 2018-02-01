define([
    'dojo/text!./template/template.html'
    
], function(template) {
    return {
        template: template,
        props: ['attr'],
        data: function() {
            return {
                styleObj: {
//                    '': 'url("'+ this.attr.src + '")'
                }
            }
        },
        
        methods: {
        
        }
    }
});