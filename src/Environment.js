(function($, _, Backbone, Geometry){
    var EnvironmentView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            $("<div class='parts'/>").appendTo(this.$el);
            $("<div class='code'/>").appendTo(this.$el);
            $("<div class='result'/>").appendTo(this.$el);
        }
    });

    Geometry.EnvironmentView = EnvironmentView;
})(jQuery, _, Backbone, Geometry);
