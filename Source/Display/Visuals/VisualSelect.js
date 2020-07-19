"use strict";
class VisualSelect {
    constructor(selectChildName, childNames, children) {
        this.selectChildName = selectChildName;
        this.childNames = childNames;
        this.children = children;
        this.childrenByName = new Map();
        for (var i = 0; i < this.children.length; i++) {
            var childName = this.childNames[i];
            var child = this.children[i];
            this.childrenByName.set(childName, child);
        }
    }
    draw(universe, world, display, entity) {
        var childToSelectName = this.selectChildName(universe, world, display, entity, this);
        var childSelected = this.childrenByName.get(childToSelectName);
        childSelected.draw(universe, world, display, entity);
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
