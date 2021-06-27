"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selector {
            constructor(reticleDimension, entitySelect, entityDeselect) {
                this.reticleDimension = reticleDimension;
                this._entitySelect = entitySelect;
                this._entityDeselect = entityDeselect;
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
                return new Selector(reticleDimension, null, null);
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
            entityDeselect(uwpe) {
                var entityToDeselect = uwpe.entity2;
                GameFramework.ArrayHelper.remove(this.entitiesSelected, entityToDeselect);
                if (this._entityDeselect != null) {
                    this._entityDeselect(uwpe);
                }
                var selectable = entityToDeselect.selectable();
                if (selectable != null) {
                    selectable.deselect(uwpe);
                }
            }
            entitySelect(uwpe) {
                var entityToSelect = uwpe.entity2;
                this.entitiesSelected.push(entityToSelect);
                if (this._entitySelect != null) {
                    this._entitySelect(uwpe);
                }
                var selectable = entityToSelect.selectable();
                if (selectable != null) {
                    selectable.select(uwpe);
                }
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
                    uwpe.entity2 = entityToSelect;
                    this.entitySelect(uwpe);
                }
                return entityToSelect;
            }
            // Clonable.
            clone() {
                return new Selector(this.reticleDimension, this._entitySelect, this._entityDeselect);
            }
            overwriteWith(other) {
                this.reticleDimension = other.reticleDimension;
                this._entitySelect = other._entitySelect;
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
            initialize(uwpe) {
                var place = uwpe.place;
                place.entityToSpawnAdd(this.entityForReticle);
            }
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
