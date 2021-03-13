"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class VisualDirectional {
            constructor(visualForNoDirection, visualsForDirections, headingInTurnsGetForEntity) {
                this.visualForNoDirection = visualForNoDirection;
                this.visualsForDirections = visualsForDirections;
                this._headingInTurnsGetForEntity = headingInTurnsGetForEntity;
                this.numberOfDirections = this.visualsForDirections.length;
            }
            headingInTurnsGetForEntity(entity) {
                var returnValue = null;
                if (this._headingInTurnsGetForEntity == null) {
                    var loc = entity.locatable().loc;
                    returnValue = loc.orientation.forward.headingInTurns();
                }
                else {
                    returnValue = this._headingInTurnsGetForEntity(entity);
                }
                return returnValue;
            }
            // Visual.
            draw(universe, world, place, entity, display) {
                var headingInTurns = this.headingInTurnsGetForEntity(entity);
                var visualForHeading;
                if (headingInTurns == null) {
                    visualForHeading = this.visualForNoDirection;
                }
                else {
                    var direction = GameFramework.NumberHelper.wrapToRangeMinMax(Math.round(headingInTurns * this.numberOfDirections), 0, this.numberOfDirections);
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
        GameFramework.VisualDirectional = VisualDirectional;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
