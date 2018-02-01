define([
    'dojo/_base/declare',
    'dojo/text!./template/template.html',
    'dijit/layout/ContentPane',
    'system/view/ModelView',
    'system/data/Model',
    'dijit/_WidgetsInTemplateMixin',
    '../proxy/proxy',
    '../dist/vue.min',
    './MyAchievementsView_vue',
    'comlib/ui/IScrollView',
    'app/services/ConsoleService',
], 
    function(declare, htmlTemp, ContentPane, ModelView, Model, _WidgetsMixin, proxy, Vue, MyAchievementVue, IScrollView, ConsoleService) {
        // start of declare function	
        var View = null;
        
        View = declare(
                [ContentPane, ModelView, _WidgetsMixin],
            {
                id : 'myachievements_vue_id',
                tabActionHandles : [],
                loadModels : function() {
                    this.addModel('myachievements_vue', Model.getCachedModel('myachievements_vue/MyAchievementsModule', 'myachievements_vue_id'));
                },
                initView : function() {
                    this.loadCachedTemplate(htmlTemp);
                    this.addStyleSheet('myachievements_vue', 'style');
                },
                initEventsMapping : function() {
                    return;
                },
                modifyView : function() {
                    return;
                },
                
                initVue: function() {
                    this.vueModule = new Vue(MyAchievementVue);
                    this.vueModule.$props.dojoView = this;
                    this.vueModule.$mount(this.domNode);
                    
                    this.resizeScroll();
                },
                
                resize : function(data) {
//                    if(!this._w) {
//                        this._w = data.w;
//                    }
//                    
//                    if(this._w !== data.w) {
//                        this._w = data.w;
//                        this.myBadge.resizeView();
//                        this.MyCertificate.resizeView();
//                    }
                    
//                    this.scrollView.resize();
                },
                
                resizeScroll: function() {
//                    this.scrollView.resize();
                }
            }
        );
        return View;
    }
);
