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
        },

        updateFromCode : function(attributes) {
            this.set(attributes);
            this.trigger("updatedFromCode");
        }
    });

    var Line = Backbone.Model.extend({
        defaults : { type : "line", "P0" : "A", "P1" : "B" }
    });

    var Circle = Backbone.Model.extend({
        defaults : { type : "circle", "P0" : "A", "P1" : "B" }
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
                "line" : new NameGenerator("l"),
                "circle" : new NameGenerator("c")
            };
        },

        append: function(step){
            step.on("request:name", this.provideName, this);
            this.add(step);
        },

        provideName : function(type, callback){
            callback.call(null, this.generators[type].nextName());
        },

        lastPointsName : function(n){
            var result = {};
            var lastSteps = this.filter(function(step){ return step.object().get("type") === "point"; })
                .slice(-n);
            _.each(lastSteps, function(step, index){
                result["P" + index] = step.name();
            });
            return result;
        },

        lookUp : function(name){
            return this.find(function(step){ return step.name() === name; });
        }

    });

    Geometry.Point = Point;
    Geometry.Line = Line;
    Geometry.Circle = Circle;
    Geometry.ConstructionStep = ConstructionStep;
    Geometry.Construction = Construction;
})(_, Backbone, Geometry);
