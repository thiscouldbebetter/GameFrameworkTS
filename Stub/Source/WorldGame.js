"use strict";
class WorldGame extends World {
    constructor() {
        super("GameStub", DateTime.now(), WorldGame.defnBuild(), [new PlaceStub()]);
    }
    static defnBuild() {
        return new WorldDefn([
            [
                ActivityDefn.Instances().HandleUserInput
            ],
            [
                PlaceStub.defnBuild()
            ]
        ]);
    }
    toControl() {
        return new ControlNone();
    }
}
