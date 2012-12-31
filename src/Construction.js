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
