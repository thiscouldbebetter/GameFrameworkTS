namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGenerator
	implements EntityProperty<ProjectileGenerator>
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
			(uwpe: UniverseWorldPlaceEntities) =>
			{
				var place = uwpe.place;
				var entityActor = uwpe.entity;

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
	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}
	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void {}

	// Equatable

	equals(other: ProjectileGenerator): boolean { return false; } // todo

}

export class ProjectileGeneration
{
	radius: number;
	distanceInitial: number;
	speed: number;
	ticksToLive: number;
	damage: Damage;
	visual: VisualBase;

	constructor
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase
	)
	{
		this.radius = radius;
		this.distanceInitial = distanceInitial;
		this.speed = speed;
		this.ticksToLive = ticksToLive;
		this.damage = damage;
		this.visual = visual;
	}

	static fromVisual(visual: VisualBase)
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
			false, // canCollideAgainWithoutSeparating
			0,
			projectileCollider,
			[ Collidable.name ],
			(uwpe: UniverseWorldPlaceEntities) => this.collide(uwpe)
		);
		var projectileDamager = Damager.fromDamagePerHit(this.damage);
		var projectileDrawable = Drawable.fromVisual(this.visual); // hack
		var projectileEphemeral = new Ephemeral(this.ticksToLive, null);
		var projectileKillable = Killable.fromIntegrityMax(1);
		var projectileLocatable = new Locatable(projectileLoc);
		var projectileMovable = Movable.default();

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

	collide(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityProjectile = uwpe.entity;
		var entityOther = uwpe.entity2;
		var targetKillable = entityOther.killable();
		if (targetKillable != null)
		{
			var damageToApply = entityProjectile.damager().damagePerHit;
			targetKillable.damageApply(uwpe, damageToApply);

			var projectileKillable = entityProjectile.killable();
			if (projectileKillable != null)
			{
				projectileKillable.kill();
			}
		}
	}
}

}
