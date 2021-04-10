"use strict";
class PlaceStub extends Place {
    constructor() {
        super(PlaceStub.name, PlaceStub.defnBuild().name, Coords.fromXY(400, 300), // size
        // entities
        [
            new UserInputListener()
        ]);
    }
    static defnBuild() {
        var actionShowMenu = Action.Instances().ShowMenuSettings;
        var actions = [
            actionShowMenu
        ];
        var actionToInputsMappings = [
            ActionToInputsMapping.fromActionAndInputName(actionShowMenu.name, Input.Names().Escape)
        ];
        var entityPropertyNamesToProcess = [
        // todo
        ];
        return PlaceDefn.from4(PlaceStub.name, actions, actionToInputsMappings, entityPropertyNamesToProcess);
    }
}
