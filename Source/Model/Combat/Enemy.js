"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Enemy {
            constructor(weapon) {
                this.weapon = weapon;
            }
            static activityDefnBuild() {
                var enemyActivityPerform = (uwpe) => {
                    var universe = uwpe.universe;
                    var world = uwpe.world;
                    var place = uwpe.place;
                    var actor = uwpe.entity;
                    var activity = actor.actor().activity;
                    var actorLocatable = actor.locatable();
                    var entityToTargetPrefix = "Player";
                    var placeEntities = place.entitiesAll();
                    var targetsPreferred = placeEntities.filter((x) => x.name.startsWith(entityToTargetPrefix));
                    var displacement = GameFramework.Coords.create();
                    var sortClosest = (a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude();
                    var targetPreferredInSight = targetsPreferred.filter((x) => x.perceptible() == null
                        || x.perceptible().canBeSeen(new GameFramework.UniverseWorldPlaceEntities(universe, world, place, x, actor))).sort(sortClosest)[0];
                    var targetPosToApproach;
                    if (targetPreferredInSight != null) {
                        targetPosToApproach =
                            targetPreferredInSight.locatable().loc.pos.clone();
                    }
                    else {
                        var targetPreferredInHearing = targetsPreferred.filter((x) => x.perceptible() == null
                            || x.perceptible().canBeHeard(uwpe.entitiesSet(x, actor))).sort(sortClosest)[0];
                        if (targetPreferredInHearing != null) {
                            targetPosToApproach =
                                targetPreferredInHearing.locatable().loc.pos.clone();
                        }
                        else {
                            var targetEntity = activity.targetEntity();
                            if (targetEntity == null) {
                                var placeSize = place.size();
                                targetPosToApproach =
                                    GameFramework.Coords.create().randomize(universe.randomizer).multiply(placeSize);
                            }
                            else {
                                var targetPosExisting = targetEntity.locatable().loc.pos;
                                targetPosToApproach = targetPosExisting;
                            }
                        }
                    }
                    targetEntity = GameFramework.Locatable.fromPos(targetPosToApproach).toEntity();
                    activity.targetEntitySet(targetEntity);
                    // hack
                    var targetLocatable = GameFramework.Locatable.fromPos(targetPosToApproach);
                    var enemy = actor.enemy();
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
            updateForTimerTick(uwpe) { }
            // Equatable
            equals(other) { return false; } // todo
        }
        GameFramework.Enemy = Enemy;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
