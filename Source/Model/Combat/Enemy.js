"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Enemy {
            constructor(weapon) {
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
                    var activity = GameFramework.Actor.of(actor).activity;
                    var actorLocatable = GameFramework.Locatable.of(actor);
                    var entityToTargetPrefix = "Player";
                    var placeEntities = place.entitiesAll();
                    var targetsPreferred = placeEntities.filter((x) => x.name.startsWith(entityToTargetPrefix));
                    var displacement = GameFramework.Coords.create();
                    var sortClosest = (a, b) => displacement.overwriteWith(GameFramework.Locatable.of(a).loc.pos).subtract(GameFramework.Locatable.of(b).loc.pos).magnitude();
                    var targetPreferredInSight = targetsPreferred.filter((x) => GameFramework.Perceptible.of(x) == null
                        || GameFramework.Perceptible.of(x).canBeSeen(new GameFramework.UniverseWorldPlaceEntities(universe, world, place, x, actor))).sort(sortClosest)[0];
                    var targetPosToApproach;
                    if (targetPreferredInSight != null) {
                        targetPosToApproach =
                            GameFramework.Locatable.of(targetPreferredInSight).loc.pos.clone();
                    }
                    else {
                        var targetPreferredInHearing = targetsPreferred.filter((x) => GameFramework.Perceptible.of(x) == null
                            || GameFramework.Perceptible.of(x).canBeHeard(uwpe.entitiesSet(x, actor))).sort(sortClosest)[0];
                        if (targetPreferredInHearing != null) {
                            targetPosToApproach =
                                GameFramework.Locatable.of(targetPreferredInHearing).loc.pos.clone();
                        }
                        else {
                            var targetEntity = activity.targetEntity();
                            if (targetEntity == null) {
                                var placeSize = place.size();
                                targetPosToApproach =
                                    GameFramework.Coords.create().randomize(universe.randomizer).multiply(placeSize);
                            }
                            else {
                                var targetPosExisting = GameFramework.Locatable.of(targetEntity).loc.pos;
                                targetPosToApproach = targetPosExisting;
                            }
                        }
                    }
                    targetEntity = GameFramework.Locatable.fromPos(targetPosToApproach).toEntity();
                    activity.targetEntitySet(targetEntity);
                    // hack
                    var targetLocatable = GameFramework.Locatable.fromPos(targetPosToApproach);
                    var enemy = Enemy.of(actor);
                    var weapon = enemy.weapon;
                    var distanceToApproach = (weapon == null ? 4 : weapon.range);
                    var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance(targetLocatable, .1, 1);
                    if (distanceToTarget <= distanceToApproach) {
                        activity.targetEntityClear();
                    }
                };
                var enemyActivityDefn = new GameFramework.ActivityDefn("Enemy", enemyActivityPerform);
                return enemyActivityDefn;
            }
            // Clonable.
            clone() { return this; }
            overwriteWith(other) { return this; }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            propertyName() { return Enemy.name; }
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Enemy = Enemy;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
