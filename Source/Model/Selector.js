"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selector {
            constructor(reticleDimension) {
                this.reticleDimension = reticleDimension;
                this.entitiesSelected = new Array();
                var visualReticle = new GameFramework.VisualGroup([
                    new GameFramework.VisualCircle(this.reticleDimension / 2, // radius
                    null, // colorFill
                    GameFramework.Color.Instances().White, // colorBorder
                    1 // borderWidth
                    ),
                    // todo - Crosshairs.
                ]);
                this.entityForReticle = new GameFramework.Entity("Reticle", [
                    GameFramework.Drawable.fromVisualAndIsVisible(visualReticle, false),
                    GameFramework.Locatable.create()
                ]);
            }
            static fromReticleDimension(reticleDimension) {
                return new Selector(reticleDimension);
            }
            static actionEntityAtMouseClickPosSelect() {
                return new GameFramework.Action("Recording Start/Stop", Selector.actionEntityAtMouseClickPosSelectPerform);
            }
            static actionEntityAtMouseClickPosSelectPerform(uwpe) {
                var selector = uwpe.entity.selector();
                selector.entityAtMouseClickPosSelect(uwpe);
            }
            entitiesDeselectAll() {
                this.entitiesSelected.length = 0;
            }
            entitySelect(entityToSelect) {
                this.entitiesSelected.push(entityToSelect);
            }
            entityAtMouseClickPosSelect(uwpe) {
                var universe = uwpe.universe;
                var place = uwpe.place;
                var inputHelper = universe.inputHelper;
                var mousePosRelativeToCameraView = inputHelper.mouseClickPos;
                var mousePosAbsolute = mousePosRelativeToCameraView.clone();
                var cameraEntity = place.camera();
                if (cameraEntity != null) {
                    var camera = cameraEntity.camera();
                    mousePosAbsolute.divide(universe.display.scaleFactor()).add(camera.loc.pos).subtract(camera.viewSizeHalf).clearZ();
                }
                var entitiesInPlace = place.entities;
                var range = this.reticleDimension / 2;
                var entityToSelect = entitiesInPlace.filter(x => {
                    var locatable = x.locatable();
                    var entityNotAlreadySelectedInRange = (this.entitiesSelected.indexOf(x) == -1
                        && locatable != null
                        && locatable.distanceFromPos(mousePosAbsolute) < range);
                    return entityNotAlreadySelectedInRange;
                }).sort((a, b) => a.locatable().distanceFromPos(mousePosAbsolute)
                    - b.locatable().distanceFromPos(mousePosAbsolute))[0];
                this.entitiesDeselectAll();
                if (entityToSelect != null) {
                    this.entitySelect(entityToSelect);
                }
                return entityToSelect;
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
                var labelSize = GameFramework.Coords.fromXY(size.x, fontHeightInPixels);
                var selectionAsContainer = new GameFramework.ControlContainer("visualPlayerSelection", pos, // pos
                size, [
                    new GameFramework.ControlLabel("labelSelected", GameFramework.Coords.fromXY(1, 0).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    "Selected:", fontHeightInPixels),
                    new GameFramework.ControlLabel("textEntitySelectedName", GameFramework.Coords.fromXY(1, 1.5).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCentered
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.entitiesSelected.length == 0
                        ? "-"
                        : c.entitiesSelected[0].name)), fontHeightInPixels)
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
