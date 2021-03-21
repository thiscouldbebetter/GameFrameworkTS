
namespace ThisCouldBeBetter.GameFramework
{

export class Enemy extends EntityProperty
{
	weapon: Weapon;

	constructor(weapon: Weapon)
	{
		super();
		this.weapon = weapon;
	}

	static activityDefnBuild()
	{
		var enemyActivityPerform =
			(universe: Universe, world: World, place: Place, actor: Entity, activity: Activity) =>
		{
			var actorLocatable = actor.locatable();

			var entityToTargetPrefix = "Player";
			var targetsPreferred = place.entities.filter
			(
				x => x.name.startsWith(entityToTargetPrefix)
			);

			var displacement = Coords.create();
			var sortClosest = (a: Entity, b: Entity) =>
				displacement.overwriteWith
				(
					a.locatable().loc.pos
				).subtract
				(
					b.locatable().loc.pos
				).magnitude();

			var targetPreferredInSight = targetsPreferred.filter
			(
				x =>
					x.perceptible() == null
					|| x.perceptible().canBeSeen(universe, world, place, x, actor)
			).sort(sortClosest)[0];

			var targetPosToApproach;

			if (targetPreferredInSight != null)
			{
				targetPosToApproach =
					targetPreferredInSight.locatable().loc.pos.clone();
			}
			else
			{
				var targetPreferredInHearing = targetsPreferred.filter
				(
					x =>
						x.perceptible() == null
						|| x.perceptible().canBeHeard(universe, world, place, x, actor)
				).sort(sortClosest)[0];

				if (targetPreferredInHearing != null)
				{
					targetPosToApproach =
						targetPreferredInHearing.locatable().loc.pos.clone();
				}
				else
				{
					var targetPosExisting = activity.target;
					if (targetPosExisting == null)
					{
						targetPosToApproach =
							Coords.create().randomize(universe.randomizer).multiply(place.size);
					}
					else
					{
						targetPosToApproach = targetPosExisting;
					}
				}
			}

			activity.target = targetPosToApproach;

			// hack
			var targetLocatable = new Locatable(new Disposition(targetPosToApproach, null, null));

			var enemy = actor.enemy();
			var weapon = enemy.weapon;
			var distanceToApproach = (weapon == null ? 4 : weapon.range);
			var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMax //ToDistance
			(
				targetLocatable, .1, 1 //, distanceToApproach
			);

			if (distanceToTarget <= distanceToApproach)
			{
				activity.target = null;
			}
		};

		var enemyActivityDefn = new ActivityDefn("Enemy", enemyActivityPerform);

		return enemyActivityDefn;
	}

}

}
