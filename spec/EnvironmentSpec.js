describe("Ruler Compass Enviroment", function(){
    beforeEach(function(){
	loadFixtures("viewport.html");
    });

    it("should provide various parts", function(){
	new Geometry.EnvironmentView({ el : $("#viewport") });

	expect($(".parts")).toExist();
	expect($(".code")).toExist();
	expect($(".result")).toExist();
    });
});
