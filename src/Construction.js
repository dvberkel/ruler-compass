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
