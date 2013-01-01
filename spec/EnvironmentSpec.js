describe("Ruler Compass Enviroment", function(){
    var environmentView;

    beforeEach(function(){
        loadFixtures("viewport.html");
    });

    beforeEach(function(){
        environmentView = new Geometry.EnvironmentView({ el : $("#viewport") });
    });

    it("should provide various parts", function(){
        expect($(".parts")).toExist();
        expect($(".code")).toExist();
        expect($(".result")).toExist();
    });

    describe("Parts", function(){
        it("should provide 'Free' Objects", function(){
            expect($(".parts .free")).toExist();
        });

        it("should provide 'Constructions'", function(){
            expect($(".parts .constructions")).toExist();
        });

        describe("Free", function(){
            it("should hold 'point'", function(){
                expect($(".parts .free .point")).toExist();
            });

            describe("point", function(){
                it("should be designated with 'Point'", function(){
                    expect($(".parts .free .point").text()).toBe("Point");
                });

                it("should create a code point", function(){
                    $(".parts .free .point").click();

                    expect($(".code > .point").size()).toBe(1);
                });
            });
        });

        describe("Constructions", function(){
            it("should hold 'line'", function(){
                expect($(".parts .constructions .line")).toExist();
            });

            describe("line", function(){
                beforeEach(function(){
                    _.each(_.range(2), function(){
                        $(".parts .free .point").click();
                    });
                });
                
                it("should be designated with 'Line'", function(){
                    expect($(".parts .constructions .line").text()).toBe("Line");
                });

                it("should create a code line", function(){
                    $(".parts .constructions .line").click();

                    expect($(".code > .line").size()).toBe(1);
                });
            });
        });
    });


    describe("Code", function(){
        describe("point", function(){
            beforeEach(function(){
                $(".parts .free .point").click();
            });
            
            it("should hold 'names'", function(){
                expect($(".code .point .names")).toExist();
            });
            
            it("should hold 'description'", function(){
                expect($(".code .point .description")).toExist();
            });

            describe("Names", function(){
                it("should contain a single name", function(){        
                    expect($(".code .point .names .name")).toExist();
                });

                describe("name", function(){
                    it("should be designated with 'P0'", function(){        
                        expect($(".code .point .names .name").text()).toBe("P0");
                    });
                });
            });

            describe("Description", function(){
                it("should be designated with '(0,0)'", function(){        
                    expect($(".code .point .description").text()).toBe("(0,0)");
                });
            });
        });
    });
});
