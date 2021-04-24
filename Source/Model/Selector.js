"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selector extends GameFramework.EntityProperty {
            constructor() {
                super();
                this.entitiesSelected = new Array();
                var visualReticle = new GameFramework.VisualRectangle(new GameFramework.Coords(20, 20, 0), null, // colorFill
                GameFramework.Color.byName("White"), true // isCentered
                );
                this.entityForReticle = new GameFramework.Entity("Reticle", [
                    new GameFramework.Locatable(null),
                    new GameFramework.Drawable(visualReticle, false), // isVisible
                    // new DrawableCamera()
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
                    new GameFramework.ControlLabel("labelSelected", new GameFramework.Coords(1, 0, 0).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    "Selected:", fontHeightInPixels),
                    new GameFramework.ControlLabel("textEntitySelectedName", new GameFramework.Coords(1, 1.5, 0).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    new GameFramework.DataBinding(this, (c) => (c.entitiesSelected.length == 0 ? "-" : c.entitiesSelected[0].name), null), fontHeightInPixels)
                ], null, null);
                var controlSelection = new GameFramework.ControlContainerTransparent(selectionAsContainer);
                this._control = controlSelection;
                return this._control;
            }
            // EntityProperty.
            updateForTimerTick(u, w, p, entitySelector) {
                var entitySelected = this.entitiesSelected[0];
                var isEntitySelected = (entitySelected != null);
                this._control._isVisible = isEntitySelected;
                if (isEntitySelected) {
                    var reticleLoc = this.entityForReticle.locatable().loc;
                    reticleLoc.overwriteWith(entitySelected.locatable().loc);
                    reticleLoc.pos.z--;
                    this.entityForReticle.drawable().updateForTimerTick(u, w, p, this.entityForReticle);
                }
            }
        }
        GameFramework.Selector = Selector;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
