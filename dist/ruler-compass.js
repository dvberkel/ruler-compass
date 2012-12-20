/*! ruler-compass - v0.0.0 - 2012-12-20
 * https://github.com/dvberkel/ruler-compass
 * Copyright (c) 2012 Daan van Berkel; Licensed MIT
 */

Geometry = {
    "version" : "0.0.0"
};

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
