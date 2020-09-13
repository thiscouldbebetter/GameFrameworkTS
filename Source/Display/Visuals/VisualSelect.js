"use strict";
class VisualSelect {
    constructor(childrenByName, selectChildNames) {
        this.childrenByName = childrenByName;
        this.selectChildNames = selectChildNames;
    }
    draw(universe, world, place, entity, display) {
        var childrenToSelectNames = this.selectChildNames(universe, world, place, entity, display);
        var childrenSelected = childrenToSelectNames.map(childToSelectName => this.childrenByName.get(childToSelectName));
        childrenSelected.forEach(childSelected => childSelected.draw(universe, world, place, entity, display));
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
