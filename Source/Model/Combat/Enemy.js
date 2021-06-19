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
                    var targetsPreferred = place.entities.filter(x => x.name.startsWith(entityToTargetPrefix));
                    var displacement = GameFramework.Coords.create();
                    var sortClosest = (a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude();
                    var targetPreferredInSight = targetsPreferred.filter(x => x.perceptible() == null
                        || x.perceptible().canBeSeen(new GameFramework.UniverseWorldPlaceEntities(universe, world, place, x, actor))).sort(sortClosest)[0];
                    var targetPosToApproach;
                    if (targetPreferredInSight != null) {
                        targetPosToApproach =
                            targetPreferredInSight.locatable().loc.pos.clone();
                    }
                    else {
                        var targetPreferredInHearing = targetsPreferred.filter(x => x.perceptible() == null
                            || x.perceptible().canBeHeard(uwpe.entitiesSet(x, actor))).sort(sortClosest)[0];
                        if (targetPreferredInHearing != null) {
                            targetPosToApproach =
                                targetPreferredInHearing.locatable().loc.pos.clone();
                        }
                        else {
                            var targetPosExisting = activity.target();
                            if (targetPosExisting == null) {
                                targetPosToApproach =
                                    GameFramework.Coords.create().randomize(universe.randomizer).multiply(place.size);
                            }
                            else {
                                targetPosToApproach = targetPosExisting;
                            }
                        }
                    }
                    activity.targetSet(targetPosToApproach);
                    // hack
                    var targetLocatable = GameFramework.Locatable.fromPos(targetPosToApproach);
                    var enemy = actor.enemy();
                    var weapon = enemy.weapon;
                    var distanceToApproach = (weapon == null ? 4 : weapon.range);
                    var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMax //ToDistance
                    (targetLocatable, .1, 1 //, distanceToApproach
                    );
                    if (distanceToTarget <= distanceToApproach) {
                        activity.targetClear();
                    }
                };
                var enemyActivityDefn = new GameFramework.ActivityDefn("Enemy", enemyActivityPerform);
                return enemyActivityDefn;
            }
            // EntityProperty.
            finalize(uwpe) { }
            initialize(uwpe) { }
            updateForTimerTick(uwpe) { }
        }
        GameFramework.Enemy = Enemy;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
