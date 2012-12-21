(function(_, Backbone, Geometry){
    var ConstructionStep = Backbone.Model.extend({
        
    });

    var Construction = Backbone.Collection.extend({
        model: ConstructionStep,

        append: function(step){
            this.add(step);
        }
    });

    Geometry.ConstructionStep = ConstructionStep;
    Geometry.Construction = Construction;
})(_, Backbone, Geometry);