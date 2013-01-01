/*! ruler-compass - v0.0.0 - 2013-01-01
 * https://github.com/dvberkel/ruler-compass
 * Copyright (c) 2013 Daan van Berkel; Licensed MIT
 */

Geometry = {
    "version" : "0.0.0"
};

(function(_, Backbone, Geometry){
    var Point = Backbone.Model.extend({
        defaults : { x : 0, y : 0 }
    });

    var ConstructionStep = Backbone.Model.extend({
        name : function(aName){
            if (aName) {
                this.set("name", aName);
            }
            if (!this.has("name")) {
                var self = this;
                this.trigger("request:name", function(aName){
                    self.name(aName);
                });
            }
            return aName || this.get("name");
        },

        point : function() {
            if (!this.has("point")) {
                this.set("point", new Point());
            }
            return this.get("point");
        }        
    });

    var Construction = Backbone.Collection.extend({
        model: ConstructionStep,

        append: function(step){
            step.on("request:name", this.provideName, this);
            this.add(step);
        },

        provideName : function(callback){
            callback.call(null, "P" + (this.size() - 1));
        }

    });

    Geometry.ConstructionStep = ConstructionStep;
    Geometry.Construction = Construction;
})(_, Backbone, Geometry);

(function($, _, Backbone, Geometry){
    var EnvironmentView = Backbone.View.extend({
        initialize : function(){
            if (! this.model) {
                this.model = new Geometry.Construction();
            }
            this.render();
        },

        render : function(){
            new PartsView({ el : this.$el, model : this.model });
            new CodeView({ el : this.$el, model : this.model });
            $("<div class='result'/>").appendTo(this.$el);
        }
    });

    var PartsView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var parts = $("<div class='parts'/>");
            parts.appendTo(this.$el);
            new FreePartsView({ el : parts, model : this.model });
        }
    });

    var FreePartsView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = $("<div class='free'/>");
            container.appendTo(this.$el);
            new PointPartView({ el : container, model : this.model });
        }
    });

    var PointPartView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },
        
        render : function(){
            var container = $("<span class='point'>Point</span>");
            container.appendTo(this.$el);
            var model = this.model;
            container.click(function(){
                model.append(new Geometry.ConstructionStep({}));
            });
        }
    });

    var CodeView = Backbone.View.extend({
        initialize : function(){
            this.model.on("add", function(step){
                var container = this.container();
                new CodeStepView({ el: container, model : step });
            }, this);
            this.render();
        },

        render : function(){
            var container = this.container();
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<div class='code'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var CodeStepView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function() {
            var container = this.container();
            new CodeStepNamesView({ el : container, model : this.model });
            new CodeStepDescriptionView({ el : container, model : this.model });
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<div class='point'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var CodeStepNamesView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = this.container();
            new CodeStepNameView({ el : container, model : this.model });
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<span class='names'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var CodeStepNameView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = this.container();
            container.empty().text(this.model.name());
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<span class='name'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var CodeStepDescriptionView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = this.container();
            new CodeStepFreePointView({ model : this.model.point(), el : container });
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<span class='description'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var CodeStepFreePointView = Backbone.View.extend({
        template : _.template("<span class='free-point'>(<span class='coordinate'><%= x %></span>,<span class='coordinate'><%= y %></span>)</span>"),

        initialize : function(){
            this.render();
        },

        render : function(){
            var container = this.container();
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $(this.template(this.model.toJSON()));
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    Geometry.EnvironmentView = EnvironmentView;
})(jQuery, _, Backbone, Geometry);
