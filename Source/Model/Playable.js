"use strict";
class Playable {
    constructor(player) {
        this.player = player;
    }
    updateForTimerTick(universe, world, place, entityPlayer) {
        var inputHelper = universe.inputHelper;
        if (inputHelper.isMouseClicked(null)) {
            inputHelper.isMouseClicked(false);
            var playerPos = entityPlayer.locatable().loc.pos;
            var camera = place.camera();
            playerPos.overwriteWith(inputHelper.mouseClickPos).divide(universe.display.scaleFactor()).add(camera.loc.pos).subtract(camera.viewSizeHalf).trimToRangeMax(place.size);
            universe.soundHelper.soundWithNamePlayAsEffect(universe, "Sound");
        }
        var placeDefn = place.defn(world);
        var actionsByName = placeDefn.actionsByName;
        var actionToInputsMappingsByInputName = placeDefn.actionToInputsMappingsByInputName;
        var actionsToPerform = inputHelper.actionsFromInput(actionsByName, actionToInputsMappingsByInputName);
        for (var i = 0; i < actionsToPerform.length; i++) {
            var action = actionsToPerform[i];
            action.perform(universe, world, place, entityPlayer);
        }
    }
    ;
}
