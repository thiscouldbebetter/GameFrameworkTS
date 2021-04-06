"use strict";
class PlaceStub extends Place {
    constructor() {
        super(PlaceStub.name, PlaceStub.defnBuild().name, Coords.fromXY(400, 300), // size
        [] // places
        );
    }
    static defnBuild() {
        var actions = new Array();
        var mappings = new Array();
        var propertyNames = new Array();
        return PlaceDefn.from4(PlaceStub.name, actions, mappings, propertyNames);
    }
}
