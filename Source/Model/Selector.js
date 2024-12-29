"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Selector {
            constructor(cursorDimension, entitySelect, entityDeselect) {
                this.cursorDimension = cursorDimension;
                this._entitySelect = entitySelect;
                this._entityDeselect = entityDeselect;
                this.entitiesSelected = new Array();
                var cursorRadius = this.cursorDimension / 2;
                var visualCursor = new GameFramework.VisualGroup([
                    new GameFramework.VisualCircle(cursorRadius, // radius
                    null, // colorFill
                    GameFramework.Color.Instances().White, // colorBorder
                    1 // borderWidth
                    ),
                    GameFramework.VisualCrosshairs.fromRadiiOuterAndInner(cursorRadius, cursorRadius / 2)
                ]);
                this.entityForCursor = new GameFramework.Entity("Cursor", [
                    GameFramework.Drawable.fromVisualAndIsVisible(visualCursor, false),
                    GameFramework.Locatable.create()
                ]);
                var visualHalo = visualCursor;
                this.entityForHalo = new GameFramework.Entity("Halo", [
                    GameFramework.Drawable.fromVisualAndIsVisible(visualHalo, false),
                    GameFramework.Locatable.create()
                ]);
            }
            static default() {
                return new Selector(20, null, null);
            }
            static fromCursorDimension(cursorDimension) {
                return new Selector(cursorDimension, null, null);
            }
            static of(entity) {
                return entity.propertyByName(Selector.name);
            }
            static actionEntityAtMouseClickPosSelect() {
                return new GameFramework.Action("Recording Start/Stop", Selector.actionEntityAtMouseClickPosSelectPerform);
            }
            static actionEntityAtMouseClickPosSelectPerform(uwpe) {
                var selector = Selector.of(uwpe.entity);
                selector.entityAtMouseClickPosSelect(uwpe);
            }
            entitiesDeselectAll(uwpe) {
                this.entitiesSelected.forEach((x) => this.entityDeselect(uwpe.entity2Set(x)));
            }
            entityDeselect(uwpe) {
                var entityToDeselect = uwpe.entity2;
                GameFramework.ArrayHelper.remove(this.entitiesSelected, entityToDeselect);
                if (this._entityDeselect != null) {
                    this._entityDeselect(uwpe);
                }
                var selectable = GameFramework.Selectable.of(entityToDeselect);
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
                var selectable = GameFramework.Selectable.of(entityToSelect);
                if (selectable != null) {
                    selectable.select(uwpe);
                }
            }
            entityAtMouseClickPosSelect(uwpe) {
                var place = uwpe.place;
                var mousePosAbsolute = this.mouseClickPosAbsoluteGet(uwpe);
                var entitiesInPlace = place.entitiesAll();
                var range = this.cursorDimension / 2;
                var entityToSelect = entitiesInPlace.filter((x) => {
                    var locatable = GameFramework.Locatable.of(x);
                    var entityNotAlreadySelectedInRange = (x != this.entityForCursor
                        && this.entitiesSelected.indexOf(x) == -1
                        && locatable != null
                        && locatable.distanceFromPos(mousePosAbsolute) < range);
                    return entityNotAlreadySelectedInRange;
                }).sort((a, b) => GameFramework.Locatable.of(a).distanceFromPos(mousePosAbsolute)
                    - GameFramework.Locatable.of(b).distanceFromPos(mousePosAbsolute))[0];
                this.entitiesDeselectAll(uwpe);
                if (entityToSelect != null) {
                    uwpe.entity2Set(entityToSelect);
                    this.entitySelect(uwpe);
                }
                return entityToSelect;
            }
            mouseClickPosAbsoluteGet(uwpe) {
                return this.mousePosConvertToAbsolute(uwpe, uwpe.universe.inputHelper.mouseClickPos);
            }
            mouseMovePosAbsoluteGet(uwpe) {
                return this.mousePosConvertToAbsolute(uwpe, uwpe.universe.inputHelper.mouseMovePos);
            }
            mousePosConvertToAbsolute(uwpe, mousePosRelativeToCameraView) {
                var mousePosAbsolute = mousePosRelativeToCameraView.clone();
                var place = uwpe.place;
                var cameraEntity = GameFramework.Camera.entityFromPlace(place);
                if (cameraEntity != null) {
                    var camera = GameFramework.Camera.of(cameraEntity);
                    mousePosAbsolute.divide(uwpe.universe.display.scaleFactor()).add(camera.loc.pos).subtract(camera.viewSizeHalf).clearZ();
                }
                return mousePosAbsolute;
            }
            // Clonable.
            clone() {
                return new Selector(this.cursorDimension, this._entitySelect, this._entityDeselect);
            }
            overwriteWith(other) {
                this.cursorDimension = other.cursorDimension;
                this._entitySelect = other._entitySelect;
                return this;
            }
            // Equatable
            equals(other) { return false; } // todo
            // Controllable.
            toControl(size, pos) {
                var fontHeightInPixels = 12;
                var font = GameFramework.FontNameAndHeight.fromHeightInPixels(fontHeightInPixels);
                var margin = fontHeightInPixels / 2;
                var labelSize = GameFramework.Coords.fromXY(size.x, fontHeightInPixels);
                var selectionAsContainer = new GameFramework.ControlContainer("visualPlayerSelection", pos, size, [
                    new GameFramework.ControlLabel("labelSelected", GameFramework.Coords.fromXY(1, 0).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContext("Selected:"), font),
                    new GameFramework.ControlLabel("textEntitySelectedName", GameFramework.Coords.fromXY(1, 1.5).multiplyScalar(margin), // pos
                    labelSize, false, // isTextCenteredHorizontally
                    false, // isTextCenteredVertically
                    GameFramework.DataBinding.fromContextAndGet(this, (c) => (c.entitiesSelected.length == 0
                        ? "-"
                        : c.entitiesSelected[0].name)), font)
                ], null, null);
                var controlSelection = new GameFramework.ControlContainerTransparent(selectionAsContainer);
                this._control = controlSelection;
                return this._control;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) {
                var place = uwpe.place;
                place.entityToSpawnAdd(this.entityForCursor);
            }
            propertyName() { return Selector.name; }
            updateForTimerTick(uwpe) {
                var cursorPos = GameFramework.Locatable.of(this.entityForCursor).loc.pos;
                var mousePosAbsolute = this.mouseMovePosAbsoluteGet(uwpe);
                cursorPos.overwriteWith(mousePosAbsolute);
                var entitySelected = this.entitiesSelected[0];
                var isEntitySelected = (entitySelected != null);
                if (isEntitySelected) {
                    var haloLoc = GameFramework.Locatable.of(this.entityForHalo).loc;
                    var entitySelectedLoc = GameFramework.Locatable.of(entitySelected).loc;
                    haloLoc.overwriteWith(entitySelectedLoc);
                    haloLoc.pos.z--;
                    var uwpeHalo = uwpe.clone().entitySet(this.entityForHalo);
                    GameFramework.Drawable.of(this.entityForHalo).updateForTimerTick(uwpeHalo);
                }
                if (this._control != null) {
                    this._control._isVisible = isEntitySelected;
                }
            }
        }
        GameFramework.Selector = Selector;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
