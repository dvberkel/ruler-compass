(function(_, Backbone, Geometry){
    var ConstructionStep = Backbone.Model.extend({
        name : function(aName){
            if (aName) {
                this.set("name", aName);
            }
            return aName || this.get("name");
        }
        
    });

    var Construction = Backbone.Collection.extend({
        model: ConstructionStep,

        append: function(step){
            if (!step.has("name")) {
                step.name("P" + this.size());
            }
            this.add(step);
        }
    });

    Geometry.ConstructionStep = ConstructionStep;
    Geometry.Construction = Construction;
})(_, Backbone, Geometry);
