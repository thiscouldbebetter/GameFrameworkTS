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
            static fromVisualForNoDirectionAndVisualsForDirections(visualForNoDirection, visualsForDirections) {
                return new VisualDirectional(visualForNoDirection, visualsForDirections, null);
            }
            headingInTurnsGetForEntity(entity) {
                var returnValue = null;
                if (this._headingInTurnsGetForEntity == null) {
                    var loc = GameFramework.Locatable.of(entity).loc;
                    returnValue = loc.orientation.forward.headingInTurns();
                }
                else {
                    returnValue = this._headingInTurnsGetForEntity(entity);
                }
                return returnValue;
            }
            // Visual.
            initialize(uwpe) {
                this.visualForNoDirection.initialize(uwpe);
                this.visualsForDirections.forEach(x => x.initialize(uwpe));
            }
            initializeIsComplete(uwpe) {
                var childrenAreAllInitialized = this.visualForNoDirection.initializeIsComplete(uwpe)
                    && this.visualsForDirections.some(x => x.initializeIsComplete(uwpe) == false) == false;
                return childrenAreAllInitialized;
            }
            draw(uwpe, display) {
                var entity = uwpe.entity;
                var headingInTurns = this.headingInTurnsGetForEntity(entity);
                var visualForHeading;
                if (headingInTurns == null) {
                    visualForHeading = this.visualForNoDirection;
                }
                else {
                    var direction = GameFramework.NumberHelper.wrapToRangeMinMax(Math.round(headingInTurns * this.numberOfDirections), 0, this.numberOfDirections);
                    visualForHeading = this.visualsForDirections[direction];
                }
                visualForHeading.draw(uwpe, display);
            }
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
