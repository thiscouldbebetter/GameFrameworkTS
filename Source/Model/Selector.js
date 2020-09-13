"use strict";
class Selector extends EntityProperty {
    constructor() {
        super();
        this.entitiesSelected = new Array();
        var visualReticle = new VisualRectangle(new Coords(20, 20, 0), null, // colorFill
        Color.byName("White"), true // isCentered
        );
        this.entityForReticle = new Entity("Reticle", [
            new Locatable(null),
            new Drawable(visualReticle, false),
            new DrawableCamera()
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
        var margin = fontHeightInPixels;
        var labelSize = new Coords(size.x, fontHeightInPixels, 0);
        var selectionAsContainer = new ControlContainer("visualPlayerSelection", pos, // pos
        size, [
            new ControlLabel("labelSelected", new Coords(1, 0, 0).multiplyScalar(margin), // pos
            labelSize, false, // isTextCentered
            "Selected:", fontHeightInPixels),
            new ControlLabel("textEntitySelectedName", new Coords(1, 1, 0).multiplyScalar(margin), // pos
            labelSize, false, // isTextCentered
            new DataBinding(this, (c) => (c.entitiesSelected.length == 0 ? "-" : c.entitiesSelected[0].name), null), fontHeightInPixels)
        ], null, null);
        var controlSelection = new ControlContainerTransparent(selectionAsContainer);
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
            this.entityForReticle.drawableCamera().initialize(u, w, p, this.entityForReticle);
            this.entityForReticle.drawable().updateForTimerTick(u, w, p, this.entityForReticle);
        }
    }
}
