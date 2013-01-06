(function($, _, Backbone, Raphael, Geometry){
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
            new ResultView({ el : this.$el, model : this.model });
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
            new ConstructionsPartsView({ el : parts, model : this.model });
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
                model.append(new Geometry.ConstructionStep({ object : new Geometry.Point() }));
            });
        }
    });

    var ConstructionsPartsView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = $("<div class='constructions'/>");
            container.appendTo(this.$el);
            new LineConstructionPartView({ el : container, model : this.model });
        }
    });

    var LineConstructionPartView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },
        
        render : function(){
            var container = $("<span class='line'>Line</span>");
            container.appendTo(this.$el);
            var model = this.model;
            container.click(function(){
                var points = model.firstPoints(2);
                model.append(new Geometry.ConstructionStep({ object : new Geometry.Line( points ) }));
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
        template : _.template("<div class='<%= type %>'/>"),

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
                this._container = $(this.template(this.model.object().toJSON()));
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
            this.descriptions = {
                "point" : CodeStepFreePointView,
                "line" : CodeStepLineView
            };
            this.render();
        },

        render : function(){
            var container = this.container();
            new (this.descriptions[this.model.object().get("type")])({ 
                model : this.model.object(),
                el : container
            });
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

    var CodeStepLineView = Backbone.View.extend({
        template : _.template("<span class='line'>l(<span class='reference-point'><%= P0 %></span>,<span class='reference-point'><%= P1 %></span>)</span>"),

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

    var ResultView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var container = this.container();
            new PlaneView({ model : this.model, el : container });
        },

        container : function(){
            if (this._container === undefined) {
                this._container = $("<div class='result' id='result'/>");
                this._container.appendTo(this.$el);
            }
            return this._container;
        }
    });

    var PlaneView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var paper = this.paper();
        },

        paper : function(){
            if (this._paper === undefined) {
                this._paper = new Raphael(this.$el.attr("id"), 640, 480);
            }
            return this._paper;
        }
    });

    Geometry.EnvironmentView = EnvironmentView;
})(jQuery, _, Backbone, Raphael, Geometry);
