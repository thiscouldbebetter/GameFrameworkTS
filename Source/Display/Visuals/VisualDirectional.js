"use strict";
class VisualDirectional {
    constructor(visualForNoDirection, visualsForDirections) {
        this.visualForNoDirection = visualForNoDirection;
        this.visualsForDirections = visualsForDirections;
        this.numberOfDirections = this.visualsForDirections.length;
    }
    draw(universe, world, place, entity, display) {
        var loc = entity.locatable().loc;
        var headingInTurns = loc.orientation.headingInTurns();
        var visualForHeading;
        if (headingInTurns == null) {
            visualForHeading = this.visualForNoDirection;
        }
        else {
            var direction = NumberHelper.wrapToRangeMinMax(Math.round(headingInTurns * this.numberOfDirections), 0, this.numberOfDirections);
            visualForHeading = this.visualsForDirections[direction];
        }
        visualForHeading.draw(universe, world, place, entity, display);
    }
    ;
    // Clonable.
    clone() {
        return this; // todo
    }
    overwriteWith(other) {
        return this; // todo
    }
    // Transformable.
    transform(transformToApply) {
        return this; // todo
    }
}
