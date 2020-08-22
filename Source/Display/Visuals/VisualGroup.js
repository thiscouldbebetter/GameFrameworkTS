"use strict";
class VisualGroup {
    constructor(children) {
        this.children = children;
    }
    draw(universe, world, place, entity, display) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.draw(universe, world, place, entity, display);
        }
    }
    // Clonable.
    clone() {
        return new VisualGroup(ArrayHelper.clone(this.children));
    }
    overwriteWith(other) {
        var otherAsVisualGroup = other;
        ArrayHelper.overwriteWith(this.children, otherAsVisualGroup.children);
        return this;
    }
    // Transformable.
    transform(transformToApply) {
        this.children.forEach(x => transformToApply.transform(x));
        return this;
    }
}
