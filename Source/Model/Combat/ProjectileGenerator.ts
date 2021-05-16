namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator implements EntityProperty
{
	name: string;
	projectileGenerations: ProjectileGeneration[];

	constructor(name: string, projectileGenerations: ProjectileGeneration[])
	{
		this.name = name;
		this.projectileGenerations = projectileGenerations;
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
				var projectileEntities =
					projectileGenerator.projectileEntitiesFromEntityFiring(entityActor);
				place.entitiesToSpawnAdd(projectileEntities);
			}
		)
	}

	projectileEntitiesFromEntityFiring(entityFiring: Entity): Entity[]
	{
		var returnValues = this.projectileGenerations.map
		(
			x => x.projectileEntityFromEntityFiring(entityFiring)
		);
		return returnValues;
	}

	// EntityProperty.
	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}
	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void {}
}

export class ProjectileGeneration
{
	radius: number;
	distanceInitial: number;
	speed: number;
	ticksToLive: number;
	damage: Damage;
	visual: Visual;

	constructor
	(
		radius: number, distanceInitial: number, speed: number,
		ticksToLive: number, damage: Damage, visual: Visual
	)
	{
		this.radius = radius;
		this.distanceInitial = distanceInitial;
		this.speed = speed;
		this.ticksToLive = ticksToLive;
		this.damage = damage;
		this.visual = visual;
	}

	static fromVisual(visual: Visual)
	{
		return new ProjectileGeneration
		(
			0, // radius
			0, // distanceInitial,
			0, // speed
			1, // ticksToLive
			null, // damage
			visual
		);
	}

	projectileEntityFromEntityFiring(entityFiring: Entity): Entity
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
		var projectileDrawable = Drawable.fromVisual(this.visual); // hack
		var projectileEphemeral = new Ephemeral(this.ticksToLive, null);
		var projectileKillable = Killable.fromIntegrityMax(1);
		var projectileLocatable = new Locatable(projectileLoc);
		var projectileMovable = Movable.create();

		var projectileEntity = new Entity
		(
			entityFiring.name + "_Projectile",
			[
				new Audible(),
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
}

}
