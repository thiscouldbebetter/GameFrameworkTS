"use strict";
class PlaceMock extends PlaceBase {
    constructor() {
        super(PlaceMock.name, null, // defnName
        null, // parentName
        Coords.create(), // size
        [] // entities
        );
    }
    static create() {
        return new PlaceMock();
    }
}
