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

                it("should create a result point", function(){
                    $(".parts .free .point").click();

                    expect($(".result .point").size()).toBe(1);
                });
            });
        });

        describe("Constructions", function(){
            it("should hold 'line'", function(){
                expect($(".parts .constructions .line")).toExist();
            });

            it("should hold 'circle'", function(){
                expect($(".parts .constructions .circle")).toExist();
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

            describe("circle", function(){
                beforeEach(function(){
                    _.each(_.range(2), function(){
                        $(".parts .free .point").click();
                    });
                });
                
                it("should be designated with 'Circle'", function(){
                    expect($(".parts .constructions .circle").text()).toBe("Circle");
                });

                it("should create a code circle", function(){
                    $(".parts .constructions .circle").click();

                    expect($(".code > .circle").size()).toBe(1);
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

        describe("line", function(){
            beforeEach(function(){
                _.each(_.range(2), function(){
                    $(".parts .free .point").click();
                });
                $(".parts .constructions .line").click();
            });
            
            it("should hold 'names'", function(){
                expect($(".code .line .names")).toExist();
            });
            
            it("should hold 'description'", function(){
                expect($(".code .line .description")).toExist();
            });

            describe("Names", function(){
                it("should contain a single name", function(){        
                    expect($(".code .line .names .name")).toExist();
                });

                describe("name", function(){
                    it("should be designated with 'l0'", function(){        
                        expect($(".code .line .names .name").text()).toBe("l0");
                    });
                });
            });

            describe("Description", function(){
                it("should be designated with 'l(P0,P1)'", function(){        
                    expect($(".code .line .description").text()).toBe("l(P0,P1)");
                });
            });
        });

        describe("circle", function(){
            beforeEach(function(){
                _.each(_.range(2), function(){
                    $(".parts .free .point").click();
                });
                $(".parts .constructions .circle").click();
            });
            
            it("should hold 'names'", function(){
                expect($(".code .circle .names")).toExist();
            });
            
            it("should hold 'description'", function(){
                expect($(".code .circle .description")).toExist();
            });

            describe("Names", function(){
                it("should contain a single name", function(){        
                    expect($(".code .circle .names .name")).toExist();
                });

                describe("name", function(){
                    it("should be designated with 'c0'", function(){        
                        expect($(".code .circle .names .name").text()).toBe("c0");
                    });
                });
            });

            describe("Description", function(){
                it("should be designated with 'P0P1'", function(){        
                    expect($(".code .circle .description").text()).toBe("P0P1");
                });
            });
        });
    });

    describe("Result", function(){
        it("should create an svg element", function(){
            expect($(".result svg")).toExist();
        });
        
        describe("point", function(){
            beforeEach(function(){
                $(".parts .free .point").click();
            });

            it("should create a circle", function(){
                expect($(".result svg circle.point")).toExist();
            });
        });
        
        describe("line", function(){
            beforeEach(function(){
                _.each(_.range(2), function(){
                    $(".parts .free .point").click();
                });
                $(".parts .constructions .line").click();
            });

            it("should create a path", function(){
                expect($(".result svg path.line")).toExist();
            });
        });
        
        describe("circle", function(){
            beforeEach(function(){
                _.each(_.range(2), function(){
                    $(".parts .free .point").click();
                });
                $(".parts .constructions .circle").click();
            });

            it("should create a circle", function(){
                expect($(".result svg circle.circle")).toExist();
            });
        });
    });
});
