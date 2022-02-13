"use strict";
class PlaceStub extends Place {
    constructor() {
        super(PlaceStub.name, PlaceStub.defnBuild().name, null, // parentName
        Coords.fromXY(400, 300), // size
        // entities
        [
            new UserInputListener()
        ]);
    }
    static defnBuild() {
        var actionDisplayRecorderStartStop = DisplayRecorder.actionStartStop();
        var actionShowMenu = Action.Instances().ShowMenuSettings;
        var actions = [
            actionDisplayRecorderStartStop,
            actionShowMenu
        ];
        var inputNames = Input.Names();
        var actionToInputsMappings = [
            new ActionToInputsMapping(actionDisplayRecorderStartStop.name, ["~"], true // inactivate
            ),
            ActionToInputsMapping.fromActionNameAndInputName(actionShowMenu.name, inputNames.Escape)
        ];
        var entityPropertyNamesToProcess = [
            Actor.name,
            Collidable.name,
            Constrainable.name,
            Locatable.name
        ];
        return PlaceDefn.from5(PlaceStub.name, "Music_Music", // soundForMusicName
        actions, actionToInputsMappings, entityPropertyNamesToProcess);
    }
}
