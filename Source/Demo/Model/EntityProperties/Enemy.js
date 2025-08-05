"use strict";
class Enemy extends EntityPropertyBase {
    constructor(weapon) {
        super();
        this.weapon = weapon;
    }
    static of(entity) {
        return entity.propertyByName(Enemy.name);
    }
    static activityDefnBuild() {
        var enemyActivityPerform = (uwpe) => {
            var universe = uwpe.universe;
            var world = uwpe.world;
            var place = uwpe.place;
            var actor = uwpe.entity;
            var activity = Actor.of(actor).activity;
            var actorLocatable = Locatable.of(actor);
            var entityToTargetPrefix = "Player";
            var placeEntities = place.entitiesAll();
            var targetsPreferred = placeEntities.filter((x) => x.name.startsWith(entityToTargetPrefix));
            var displacement = Coords.create();
            var sortClosest = (a, b) => displacement.overwriteWith(Locatable.of(a).loc.pos).subtract(Locatable.of(b).loc.pos).magnitude();
            var targetPreferredInSight = targetsPreferred.filter((x) => Perceptible.of(x) == null
                || Perceptible.of(x).canBeSeen(new UniverseWorldPlaceEntities(universe, world, place, x, actor))).sort(sortClosest)[0];
            var targetPosToApproach;
            if (targetPreferredInSight != null) {
                targetPosToApproach =
                    Locatable.of(targetPreferredInSight).loc.pos.clone();
            }
            else {
                var targetPreferredInHearing = targetsPreferred.filter((x) => Perceptible.of(x) == null
                    || Perceptible.of(x).canBeHeard(uwpe.entitiesSet(x, actor))).sort(sortClosest)[0];
                if (targetPreferredInHearing != null) {
                    targetPosToApproach =
                        Locatable.of(targetPreferredInHearing).loc.pos.clone();
                }
                else {
                    var targetEntity = activity.targetEntity();
                    if (targetEntity == null) {
                        var placeSize = place.size();
                        targetPosToApproach =
                            Coords.create().randomize(universe.randomizer).multiply(placeSize);
                    }
                    else {
                        var targetPosExisting = Locatable.of(targetEntity).loc.pos;
                        targetPosToApproach = targetPosExisting;
                    }
                }
            }
            targetEntity = Locatable.fromPos(targetPosToApproach).toEntity();
            activity.targetEntitySet(targetEntity);
            // hack
            var targetLocatable = Locatable.fromPos(targetPosToApproach);
            var enemy = Enemy.of(actor);
            var weapon = enemy.weapon;
            var distanceToApproach = (weapon == null ? 4 : weapon.range);
            var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, .1, 1);
            if (distanceToTarget <= distanceToApproach) {
                activity.targetEntityClear();
            }
        };
        var enemyActivityDefn = new ActivityDefn("Enemy", enemyActivityPerform);
        return enemyActivityDefn;
    }
}
