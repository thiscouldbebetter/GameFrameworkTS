"use strict";
class Enemy extends EntityProperty {
    static activityDefnBuild() {
        var enemyActivityPerform = (universe, world, place, actor, activity) => {
            var actorLocatable = actor.locatable();
            var entityToTargetPrefix = "Player";
            var targetsPreferred = place.entities.filter(x => x.name.startsWith(entityToTargetPrefix));
            var displacement = new Coords(0, 0, 0);
            var targetPreferredInSight = targetsPreferred.filter(x => x.perceptible() == null
                || x.perceptible().canBeSeen(universe, world, place, x, actor)).sort((a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude())[0];
            var targetPosToApproach;
            if (targetPreferredInSight != null) {
                targetPosToApproach =
                    targetPreferredInSight.locatable().loc.pos.clone();
            }
            else {
                var targetPreferredInHearing = targetsPreferred.filter(x => x.perceptible() == null
                    || x.perceptible().canBeHeard(universe, world, place, x, actor)).sort((a, b) => displacement.overwriteWith(a.locatable().loc.pos).subtract(b.locatable().loc.pos).magnitude())[0];
                if (targetPreferredInHearing != null) {
                    targetPosToApproach =
                        targetPreferredInHearing.locatable().loc.pos.clone();
                }
                else {
                    var targetPosExisting = activity.target;
                    if (targetPosExisting == null) {
                        targetPosToApproach =
                            new Coords(0, 0, 0).randomize(universe.randomizer).multiply(place.size);
                    }
                    else {
                        targetPosToApproach = targetPosExisting;
                    }
                }
            }
            activity.target = targetPosToApproach;
            // hack
            var targetLocatable = new Locatable(new Disposition(targetPosToApproach, null, null));
            var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxToDistance(targetLocatable, .1, 1, 4);
            if (distanceToTarget == 0) {
                activity.target = null;
            }
        };
        var enemyActivityDefn = new ActivityDefn("Enemy", enemyActivityPerform);
        return enemyActivityDefn;
    }
}
