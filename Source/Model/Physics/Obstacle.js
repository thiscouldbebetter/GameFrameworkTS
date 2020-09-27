"use strict";
class Obstacle extends EntityProperty {
    constructor() {
        super();
    }
    collide(u, w, p, e, eOther) {
        var collisionHelper = u.collisionHelper;
        collisionHelper.collideEntitiesBounce(e, eOther);
        collisionHelper.collideEntitiesSeparate(eOther, e);
    }
    // Clonable.
    clone() {
        return this;
    }
    overwriteWith(other) {
        return this;
    }
}
