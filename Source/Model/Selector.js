"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selector {
            constructor() {
                this.entitiesSelected = new Array();
                var visualReticle = new GameFramework.VisualRectangle(GameFramework.Coords.fromXY(20, 20), null, // colorFill
                GameFramework.Color.byName("White"), true // isCentered
                );
                this.entityForReticle = new GameFramework.Entity("Reticle", [
                    GameFramework.Locatable.create(),
                    new GameFramework.Drawable(visualReticle, false), // isVisible
                ]);
            }
            entitiesDeselectAll() {
                this.entitiesSelected.length = 0;
            }
            entitySelect(entityToSelect) {
                this.entitiesSelected.push(entityToSelect);
            }
            // Clonable.
            clone() {
                return this;
            }
            overwriteWith(other) {
                return this;
            }
            // Controllable.
            toControl(size, pos) {
                var fontHeightInPixels = 12;
                var margin = fontHeightInPixels / 2;
                var labelSize = new GameFramework.Coords(size.x, fontHeightInPixels, 0);
                var selectionAsContainer = new GameFramework.ControlContainer("visualPlayerSelection", pos, // pos
                size, [
                    new GameFramework.ControlLabel("labelSelected", GameFramework.Coords.fromXY(1, 0).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    "Selected:", fontHeightInPixels),
                    new GameFramework.ControlLabel("textEntitySelectedName", GameFramework.Coords.fromXY(1, 1.5).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.entitiesSelected.length == 0 ? "-" : c.entitiesSelected[0].name)), fontHeightInPixels)
                ], null, null);
                var controlSelection = new GameFramework.ControlContainerTransparent(selectionAsContainer);
                this._control = controlSelection;
                return this._control;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) {
                var entitySelected = this.entitiesSelected[0];
                var isEntitySelected = (entitySelected != null);
                this._control._isVisible = isEntitySelected;
                if (isEntitySelected) {
                    var reticleLoc = this.entityForReticle.locatable().loc;
                    reticleLoc.overwriteWith(entitySelected.locatable().loc);
                    reticleLoc.pos.z--;
                    var uwpeReticle = uwpe.clone().entitySet(this.entityForReticle);
                    this.entityForReticle.drawable().updateForTimerTick(uwpeReticle);
                }
            }
        }
        GameFramework.Selector = Selector;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
