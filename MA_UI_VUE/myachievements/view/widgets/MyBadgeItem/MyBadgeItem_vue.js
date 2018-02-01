define([
    'dojo/text!./template/template.html'
    
], function(template) {
    return {
        template: template,
        props: ['attr'],
        data: function() {
            return {
                
            }
        },
        
        computed: {
            styleObj: function() {
                return {'backgroundImage': 'url("'+ this.attr.src + '")'};
            }
        },
        
        methods: {
            openCclaimPage: function() {
                window.open(this.attr.url);
            }
        }
    }
});