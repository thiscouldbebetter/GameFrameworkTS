"use strict";
class Idleable {
    updateForTimerTick(universe, world, place, entityPlayer) {
        var playerLoc = entityPlayer.locatable().loc;
        playerLoc.orientation.forwardSet(Coords.Instances().Zeroes);
    }
    ;
}
