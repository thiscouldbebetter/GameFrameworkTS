"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var GameFramework;
    (function (GameFramework) {
        class Enemy extends GameFramework.EntityProperty {
            constructor(weapon) {
                super();
                this.weapon = weapon;
            }
            static activityDefnBuild() {
                var enemyActivityPerform = (universe, world, place, actor, activity) => {
                    var actorLocatable = actor.locatable();
                    var entityToTargetPrefix = "Player";
                    var targetsPreferred = place.entities.filter(x => x.name.startsWith(entityToTargetPrefix));
                    var displacement = new GameFramework.Coords(0, 0, 0);
                    var sortClosest = (a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude();
                    var targetPreferredInSight = targetsPreferred.filter(x => x.perceptible() == null
                        || x.perceptible().canBeSeen(universe, world, place, x, actor)).sort(sortClosest)[0];
                    var targetPosToApproach;
                    if (targetPreferredInSight != null) {
                        targetPosToApproach =
                            targetPreferredInSight.locatable().loc.pos.clone();
                    }
                    else {
                        var targetPreferredInHearing = targetsPreferred.filter(x => x.perceptible() == null
                            || x.perceptible().canBeHeard(universe, world, place, x, actor)).sort(sortClosest)[0];
                        if (targetPreferredInHearing != null) {
                            targetPosToApproach =
                                targetPreferredInHearing.locatable().loc.pos.clone();
                        }
                        else {
                            var targetPosExisting = activity.target;
                            if (targetPosExisting == null) {
                                targetPosToApproach =
                                    new GameFramework.Coords(0, 0, 0).randomize(universe.randomizer).multiply(place.size);
                            }
                            else {
                                targetPosToApproach = targetPosExisting;
                            }
                        }
                    }
                    activity.target = targetPosToApproach;
                    // hack
                    var targetLocatable = new GameFramework.Locatable(new GameFramework.Disposition(targetPosToApproach, null, null));
                    var enemy = actor.enemy();
                    var weapon = enemy.weapon;
                    var distanceToApproach = (weapon == null ? 4 : weapon.range);
                    var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMax //ToDistance
                    (targetLocatable, .1, 1 //, distanceToApproach
                    );
                    if (distanceToTarget <= distanceToApproach) {
                        activity.target = null;
                    }
                };
                var enemyActivityDefn = new GameFramework.ActivityDefn("Enemy", enemyActivityPerform);
                return enemyActivityDefn;
            }
        }
        GameFramework.Enemy = Enemy;
    })(GameFramework = ThisCouldBeBetter.GameFramework || (ThisCouldBeBetter.GameFramework = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
