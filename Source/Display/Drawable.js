"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Drawable extends GameFramework.EntityPropertyBase {
            constructor(visual, renderingOrder, hidden, sizeInWrappedInstances) {
                super();
                this.visual = visual;
                this.renderingOrder = renderingOrder || 0;
                this.hidden = hidden || false;
                this.sizeInWrappedInstances = sizeInWrappedInstances || GameFramework.Coords.ones();
                this._entityPosToRestore = GameFramework.Coords.create();
                this._sizeInWrappedInstancesHalfRoundedDown = GameFramework.Coords.create();
                this._wrapOffsetInPixels = GameFramework.Coords.create();
                this._wrapOffsetInWraps = GameFramework.Coords.create();
            }
            static default() {
                // For rapid prototyping.
                return Drawable.fromVisual(GameFramework.VisualRectangle.default());
            }
            static entitiesFromPlace(place) {
                return place.entitiesByPropertyName(Drawable.name);
            }
            static fromVisual(visual) {
                return new Drawable(visual, null, null, null);
            }
            static fromVisualAndHidden(visual, hidden) {
                return new Drawable(visual, null, hidden, null);
            }
            static fromVisualAndRenderingOrder(visual, renderingOrder) {
                return new Drawable(visual, renderingOrder, null, null);
            }
            static of(entity) {
                return entity.propertyByName(Drawable.name);
            }
            draw(uwpe) {
                if (this.visible()) {
                    var sizeInWraps = this.sizeInWrappedInstances;
                    if (sizeInWraps == null) {
                        this.visual.draw(uwpe, uwpe.universe.display);
                    }
                    else {
                        var sizeInWrapsHalfRoundedDown = this.sizeInWrappedInstancesHalfRoundedDown();
                        var place = uwpe.place;
                        var wrapSizeInPixels = place.size();
                        var entity = uwpe.entity;
                        var entityPos = GameFramework.Locatable.of(entity).loc.pos;
                        var wrapOffsetInWraps = this._wrapOffsetInWraps;
                        var wrapOffsetInPixels = this._wrapOffsetInPixels;
                        for (var z = 0; z < sizeInWraps.z; z++) {
                            wrapOffsetInWraps.z =
                                z - sizeInWrapsHalfRoundedDown.z;
                            for (var y = 0; y < sizeInWraps.y; y++) {
                                wrapOffsetInWraps.y =
                                    y - sizeInWrapsHalfRoundedDown.y;
                                for (var x = 0; x < sizeInWraps.x; x++) {
                                    wrapOffsetInWraps.x =
                                        x - sizeInWrapsHalfRoundedDown.x;
                                    this._entityPosToRestore.overwriteWith(entityPos);
                                    wrapOffsetInPixels
                                        .overwriteWith(wrapOffsetInWraps)
                                        .multiply(wrapSizeInPixels);
                                    entityPos.add(wrapOffsetInPixels);
                                    this.visual.draw(uwpe, uwpe.universe.display);
                                    entityPos.overwriteWith(this._entityPosToRestore);
                                }
                            }
                        }
                    }
                }
            }
            hiddenSet(value) {
                this.hidden = value;
                return this;
            }
            hide() {
                this.hidden = true;
                return this;
            }
            renderingOrderSet(value) {
                this.renderingOrder = value;
                return this;
            }
            show() {
                this.hidden = false;
                return this;
            }
            sizeInWrappedInstancesHalfRoundedDown() {
                this._sizeInWrappedInstancesHalfRoundedDown
                    .overwriteWith(this.sizeInWrappedInstances)
                    .half()
                    .floor();
                return this._sizeInWrappedInstancesHalfRoundedDown;
            }
            sizeInWrappedInstancesSet(value) {
                this.sizeInWrappedInstances = value;
                return this;
            }
            visible() {
                return (this.hidden == false);
            }
            visualSet(value) {
                this.visual = value;
                return this;
            }
            // EntityProperty.
            updateForTimerTick(uwpe) {
                this.draw(uwpe);
            }
            // Clonable.
            clone() {
                return new Drawable(this.visual, this.renderingOrder, this.hidden, this.sizeInWrappedInstances.clone());
            }
            overwriteWith(other) {
                this.visual.overwriteWith(other.visual);
                this.renderingOrder = other.renderingOrder;
                this.hidden = other.hidden;
                this.sizeInWrappedInstances
                    .overwriteWith(other.sizeInWrappedInstances);
                return this;
            }
        }
        GameFramework.Drawable = Drawable;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
