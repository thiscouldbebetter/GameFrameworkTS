"use strict";
class Constraint_None {
    constrain(universe, world, place, entity) {
        // Do nothing.
    }
    ;
}
class Constraint_AttachToEntityWithName {
    constructor(targetEntityName) {
        this.targetEntityName = targetEntityName;
    }
    constrain(universe, world, place, entityToConstrain) {
        var targetEntityName = this.targetEntityName;
        var targetEntity = place.entitiesByName.get(targetEntityName);
        if (targetEntity != null) {
            var targetPos = targetEntity.locatable().loc.pos;
            entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
        }
    }
    ;
}
class Constraint_Conditional {
    constructor(shouldChildApply, child) {
        this.shouldChildApply = shouldChildApply;
        this.child = child;
    }
    constrain(universe, world, place, entity) {
        var willChildApply = this.shouldChildApply(universe, world, place, entity);
        if (willChildApply) {
            this.child.constrain(universe, world, place, entity);
        }
    }
    ;
}
class Constraint_ContainInBox {
    constructor(boxToContainWithin) {
        this.boxToContainWithin = boxToContainWithin;
    }
    constrain(universe, world, place, entity) {
        this.boxToContainWithin.trimCoords(entity.locatable().loc.pos);
    }
    ;
}
class Constraint_ContainInHemispace {
    constructor(hemispaceToContainWithin) {
        this.hemispaceToContainWithin = hemispaceToContainWithin;
        this._coordsTemp = new Coords(0, 0, 0);
    }
    constrain(universe, world, place, entity) {
        var hemispace = this.hemispaceToContainWithin;
        var plane = hemispace.plane;
        var loc = entity.locatable().loc;
        var pos = loc.pos;
        // Can't use Hemispace.trimCoords(),
        // because we also need to trim velocity and acceleration.
        var distanceOfPointAbovePlane = plane.distanceToPointAlongNormal(pos);
        var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
        if (areCoordsOutsideHemispace) {
            var planeNormal = plane.normal;
            pos.subtract(this._coordsTemp.overwriteWith(planeNormal).multiplyScalar(distanceOfPointAbovePlane));
            var vel = loc.vel;
            var speedAlongNormal = vel.dotProduct(planeNormal);
            if (speedAlongNormal > 0) {
                vel.subtract(this._coordsTemp.overwriteWith(planeNormal).multiplyScalar(speedAlongNormal));
            }
            var accel = loc.accel;
            var accelerationAlongNormal = accel.dotProduct(planeNormal);
            if (accelerationAlongNormal > 0) {
                accel.subtract(this._coordsTemp.overwriteWith(planeNormal).multiplyScalar(accelerationAlongNormal));
            }
        }
    }
    ;
}
class Constraint_FrictionXY {
    constructor(target, speedBelowWhichToStop) {
        this.target = target;
        this.speedBelowWhichToStop = speedBelowWhichToStop || 0;
    }
    constrain(universe, world, place, entity) {
        var targetFrictionCoefficient = this.target;
        var entityLoc = entity.locatable().loc;
        var entityVel = entityLoc.vel;
        var entityVelZSaved = entityVel.z;
        entityVel.z = 0;
        var speed = entityVel.magnitude();
        if (speed < this.speedBelowWhichToStop) {
            entityVel.clear();
        }
        else {
            var frictionMagnitude = speed * targetFrictionCoefficient;
            entityVel.add(entityVel.clone().multiplyScalar(-frictionMagnitude));
        }
        entityVel.z = entityVelZSaved;
    }
    ;
}
class Constraint_FrictionDry {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var targetFrictionCoefficient = this.target;
        var frictionMagnitude = targetFrictionCoefficient;
        var entityLoc = entity.locatable().loc;
        var entityVel = entityLoc.vel;
        var entitySpeed = entityVel.magnitude();
        if (entitySpeed <= frictionMagnitude) {
            entityVel.clear();
        }
        else {
            var entityDirection = entityVel.clone().normalize();
            entityVel.add(entityDirection.multiplyScalar(-frictionMagnitude));
        }
    }
    ;
}
class Constraint_Gravity {
    constructor(accelerationPerTick) {
        this.accelerationPerTick = accelerationPerTick;
    }
    constrain(universe, world, place, entity) {
        var loc = entity.locatable().loc;
        if (loc.pos.z < 0) {
            loc.accel.add(this.accelerationPerTick);
        }
    }
}
class Constraint_Offset {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var targetOffset = this.target;
        entity.locatable().loc.pos.add(targetOffset);
    }
    ;
}
class Constraint_OrientToward {
    constructor(targetEntityName) {
        this.targetEntityName = targetEntityName;
    }
    constrain(universe, world, place, entity) {
        var targetEntityName = this.targetEntityName;
        var constrainableLoc = entity.locatable().loc;
        var constrainablePos = constrainableLoc.pos;
        var constrainableOrientation = constrainableLoc.orientation;
        var constrainableForward = constrainableOrientation.forward;
        var target = place.entitiesByName.get(targetEntityName);
        var targetPos = target.locatable().loc.pos;
        constrainableForward.overwriteWith(targetPos).subtract(constrainablePos).normalize();
        constrainableOrientation.forwardSet(constrainableForward);
    }
    ;
}
class Constraint_SpeedMaxXY {
    constructor(targetSpeedMax) {
        this.targetSpeedMax = targetSpeedMax;
    }
    constrain(universe, world, place, entity) {
        var targetSpeedMax = this.targetSpeedMax;
        var entityLoc = entity.locatable().loc;
        var entityVel = entityLoc.vel;
        var zSaved = entityVel.z;
        entityVel.z = 0;
        var speed = entityVel.magnitude();
        if (speed > targetSpeedMax) {
            entityVel.normalize().multiplyScalar(targetSpeedMax);
        }
        entityVel.z = zSaved;
    }
    ;
}
class Constraint_StopBelowSpeedMin {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var targetSpeedMin = this.target;
        var entityLoc = entity.locatable().loc;
        var entityVel = entityLoc.vel;
        var speed = entityVel.magnitude();
        if (speed < targetSpeedMin) {
            entityVel.clear();
        }
    }
    ;
}
class Constraint_TrimToRange {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var targetSize = this.target;
        var entityLoc = entity.locatable().loc;
        entityLoc.pos.trimToRangeMax(targetSize);
    }
    ;
}
class Constraint_WrapToRange {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var targetRange = this.target;
        var entityLoc = entity.locatable().loc;
        entityLoc.pos.wrapToRangeMax(targetRange);
    }
    ;
}
class Constraint_WrapXTrimY {
    constructor(target) {
        this.target = target;
    }
    constrain(universe, world, place, entity) {
        var entityLoc = entity.locatable().loc;
        var entityPos = entityLoc.pos;
        var max = this.target;
        while (entityPos.x < 0) {
            entityPos.x += max.x;
        }
        while (entityPos.x >= max.x) {
            entityPos.x -= max.x;
        }
        if (entityPos.y < 0) {
            entityPos.y = 0;
        }
        else if (entityPos.y > max.y) {
            entityPos.y = max.y;
        }
    }
    ;
}
