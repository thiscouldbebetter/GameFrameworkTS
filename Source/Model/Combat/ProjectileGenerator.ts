namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator implements EntityProperty
{
	name: string;
	radius: number;
	distanceInitial: number;
	speed: number;
	ticksToLive: number;
	damage: Damage;
	visual: Visual;

	constructor
	(
		name: string, radius: number, distanceInitial: number, speed: number,
		ticksToLive: number, damage: Damage, visual: Visual
	)
	{
		this.name = name;
		this.radius = radius;
		this.distanceInitial = distanceInitial;
		this.speed = speed;
		this.ticksToLive = ticksToLive;
		this.damage = damage;
		this.visual = visual;
	}

	static actionFire(): Action
	{
		return new Action
		(
			"Fire",
			// perform
			(universe: Universe, world: World, place: Place, entityActor: Entity) =>
			{
				var projectileGenerator = entityActor.projectileGenerator();
				var projectileEntity =
					projectileGenerator.projectileFromEntity(entityActor);
				place.entityToSpawnAdd(projectileEntity);
			}
		)
	}

	projectileFromEntity(entityFiring: Entity): Entity
	{
		var userLoc = entityFiring.locatable().loc;
		var userPos = userLoc.pos;
		var userVel = userLoc.vel;
		var userSpeed = userVel.magnitude();
		var userOri = userLoc.orientation;
		var userForward = userOri.forward;

		var projectileCollider = new Sphere(Coords.create(), this.radius / 2);

		var projectilePos = userPos.clone().add
		(
			userForward.clone().multiplyScalar(this.distanceInitial + this.radius)
		);
		var projectileOri = Orientation.fromForward(userForward);

		var projectileLoc = new Disposition(projectilePos, projectileOri, null);
		projectileLoc.vel.overwriteWith(userForward).multiplyScalar
		(
			userSpeed + this.speed
		);

		var projectileCollider = new Sphere(Coords.create(), this.radius);

		var projectileCollidable = new Collidable
		(
			0, projectileCollider, [ Collidable.name ], this.collide
		);
		var projectileDamager = new Damager(this.damage);
		var projectileDrawable = Drawable.fromVisual(this.visual);
		var projectileEphemeral = new Ephemeral(this.ticksToLive, null);
		var projectileKillable = Killable.fromIntegrityMax(1);
		var projectileLocatable = new Locatable(projectileLoc);
		var projectileMovable = Movable.create();

		var projectileEntity = new Entity
		(
			this.name,
			[
				projectileCollidable,
				projectileDamager,
				projectileDrawable,
				projectileEphemeral,
				projectileKillable,
				projectileLocatable,
				projectileMovable
			]
		);

		return projectileEntity;
	}

	collide
	(
		universe: Universe, world: World, place: Place,
		entityProjectile: Entity, entityOther: Entity
	): void
	{
		var targetKillable = entityOther.killable();
		if (targetKillable != null)
		{
			var damageToApply = entityProjectile.damager().damagePerHit;
			targetKillable.damageApply
			(
				universe, world, place, entityProjectile, entityOther,
				damageToApply
			);

			var projectileKillable = entityProjectile.killable();
			if (projectileKillable != null)
			{
				projectileKillable.kill();
			}
		}
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}

}

}
