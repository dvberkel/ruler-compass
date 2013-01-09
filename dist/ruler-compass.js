/*! ruler-compass - v0.0.0 - 2013-01-09
 * https://github.com/dvberkel/ruler-compass
 * Copyright (c) 2013 Daan van Berkel; Licensed MIT
 */

Geometry = {
    "version" : "0.0.0"
};

(function(_, Backbone, Geometry){
    var NameGenerator = function(prefix){
        var count = 0;

        this.nextName = function(){
            return prefix + count++;
        };
    };

    var Point = Backbone.Model.extend({
        defaults : { type : "point", x : 0, y : 0 },

        updateFromResult : function(attributes) {
            this.set(attributes);
            this.trigger("updatedFromResult");
        }
    });

    var Line = Backbone.Model.extend({
        defaults : { type : "line", "P0" : "A", "P1" : "B" }
    });

    var ConstructionStep = Backbone.Model.extend({
        name : function(aName){
            if (aName) {
                this.set("name", aName);
            }
            if (!this.has("name")) {
                var self = this;
                this.trigger("request:name", self.object().get("type"), function(aName){
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
        },

        object : function() {
            return this.get("object");
        }
    });

    var Construction = Backbone.Collection.extend({
        model: ConstructionStep,

        initialize : function(){
            this.generators = {
                "point" : new NameGenerator("P"),
                "line" : new NameGenerator("l")
            };
        },

        append: function(step){
            step.on("request:name", this.provideName, this);
            this.add(step);
        },

        provideName : function(type, callback){
            callback.call(null, this.generators[type].nextName());
        },

        firstPoints : function(n) {
            var result = {}, count = 0;
            this.filter(function(step){ return step.object().get("type") === "point"; })
                .reduce(function(memo, step){ memo["P" + count++] = step.name(); return memo; }, result);
            return result;
        }

    });

    Geometry.Point = Point;
    Geometry.Line = Line;
    Geometry.ConstructionStep = ConstructionStep;
    Geometry.Construction = Construction;
})(_, Backbone, Geometry);

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
        template : _.template("<span class='free-point'>(<span class='coordinate x'><%= x %></span>,<span class='coordinate y'><%= y %></span>)</span>"),

        initialize : function(){
            this.render();
            this.model.on("updatedFromResult", this.render, this);
        },

        render : function(){
            var container = this.container();
            container.find(".x").text(this.model.get("x"));
            container.find(".y").text(this.model.get("y"));
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
            this.model.on("add", function(step){
                var paper = this.paper();
                new ResultStepView({ model : step, paper : paper });
            }, this);

            this.render();
        },

        render : function(){
            var paper = this.paper();
            new CoordinateSystem({ model : this.model, paper : paper });
        },

        paper : function(){
            if (this._paper === undefined) {
                this._paper = new Raphael(this.$el.attr("id"), 640, 480);
                this._paper.setViewBox(-640/2, -480/2, 640, 480);
            }
            return this._paper;
        }
    });

    var CoordinateSystem = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var paper = this.paper();

            paper.path("M-320,0L640,0").attr({ stroke: "black" });
            paper.path("M0,-240L0,480").attr({ stroke: "black" });
        },

        paper : function(){
            return this.options.paper;
        }
    });

    var ResultStepView = Backbone.View.extend({
        initialize : function(){
            this.render();
        },

        render : function(){
            var point = this.point();
            var object = this.model.object();
            point.attr({cx : object.get("x"), cy: object.get("y")});
        },

        point : function(){
            if (this._point === undefined) {
                var paper = this.paper();
                this._point = paper.circle(0, 0, 3).attr({
                    stroke: "black",
                    fill: "black"
                });
                this._point.node.setAttribute("class", "point");
                this._point.drag(function(dx, dy){
                    var cx = this.ox + dx;
                    var cy = this.oy + dy;
                    this.model.object().updateFromResult({ "x": cx, "y": cy });
                    this.point().attr({ "cx": cx, "cy": cy });
                }, function(x, y){
                    var point = this.point();
                    this.ox = point.attr("cx");
                    this.oy = point.attr("cy");
                }, function(){}, this, this, this);
            }
            return this._point;
        },

        paper : function(){
            return this.options.paper;
        }
    });

    Geometry.EnvironmentView = EnvironmentView;
})(jQuery, _, Backbone, Raphael, Geometry);
 
