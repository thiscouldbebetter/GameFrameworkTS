
namespace ThisCouldBeBetter.GameFramework
{

export class Enemy implements EntityProperty<Enemy>
{
	weapon: Weapon;

	constructor(weapon: Weapon)
	{
		this.weapon = weapon;
	}

	static activityDefnBuild(): ActivityDefn
	{
		var enemyActivityPerform = (uwpe: UniverseWorldPlaceEntities) =>
		{
			var universe = uwpe.universe;
			var world = uwpe.world;
			var place = uwpe.place;
			var actor = uwpe.entity;

			var activity = actor.actor().activity;
			var actorLocatable = actor.locatable();

			var entityToTargetPrefix = "Player";
			var placeEntities = place.entitiesAll();
			var targetsPreferred = placeEntities.filter
			(
				(x: Entity) => x.name.startsWith(entityToTargetPrefix)
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
				(x: Entity) =>
					x.perceptible() == null
					|| x.perceptible().canBeSeen
					(
						new UniverseWorldPlaceEntities
						(
							universe, world, place, x, actor
						)
					)
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
					(x: Entity) =>
						x.perceptible() == null
						|| x.perceptible().canBeHeard(uwpe.entitiesSet(x, actor))
				).sort(sortClosest)[0];

				if (targetPreferredInHearing != null)
				{
					targetPosToApproach =
						targetPreferredInHearing.locatable().loc.pos.clone();
				}
				else
				{
					var targetEntity = activity.targetEntity();
					if (targetEntity == null)
					{
						var placeSize = place.size();
						targetPosToApproach =
							Coords.create().randomize(universe.randomizer).multiply(placeSize);
					}
					else
					{
						var targetPosExisting = targetEntity.locatable().loc.pos;
						targetPosToApproach = targetPosExisting;
					}
				}
			}

			targetEntity = Locatable.fromPos(targetPosToApproach).toEntity();
			activity.targetEntitySet(targetEntity);

			// hack
			var targetLocatable = Locatable.fromPos(targetPosToApproach);

			var enemy = actor.enemy();
			var weapon = enemy.weapon;
			var distanceToApproach = (weapon == null ? 4 : weapon.range);
			var distanceToTarget = actorLocatable.approachOtherWithAccelerationAndSpeedMaxAndReturnDistance
			(
				targetLocatable, .1, 1
			);

			if (distanceToTarget <= distanceToApproach)
			{
				activity.targetEntityClear();
			}
		};

		var enemyActivityDefn = new ActivityDefn("Enemy", enemyActivityPerform);

		return enemyActivityDefn;
	}

	// Clonable.
	clone(): Enemy { return this; }
	overwriteWith(other: Enemy): Enemy { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	propertyName(): string { return Enemy.name; }
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: Enemy): boolean { return false; } // todo
}

}
