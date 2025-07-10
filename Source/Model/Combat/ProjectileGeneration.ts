namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGeneration
{
	radius: number;
	distanceInitial: number;
	speedRelativeToShooter: number;
	ticksToLive: number;
	damage: Damage;
	visual: VisualBase;
	_projectileEntityInitialize: (entity: Entity) => void

	constructor
	(
		radius: number,
		distanceInitial: number,
		speedRelativeToShooter: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase,
		projectileEntityInitialize: (entity: Entity) => void
	)
	{
		this.radius = radius;
		this.distanceInitial = distanceInitial;
		this.speedRelativeToShooter = speedRelativeToShooter;
		this.ticksToLive = ticksToLive;
		this.damage = damage;
		this.visual = visual;
		this._projectileEntityInitialize = projectileEntityInitialize;
	}

	static fromRadiusDistanceSpeedTicksDamageAndVisual
	(
		radius: number,
		distanceInitial: number,
		speedRelativeToShooter: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase
	): ProjectileGeneration
	{
		return new ProjectileGeneration
		(
			radius,
			distanceInitial,
			speedRelativeToShooter,
			ticksToLive,
			damage,
			visual,
			null // projectileEntityInitialize
		);
	}

	static fromRadiusDistanceSpeedTicksDamageVisualAndInit
	(
		radius: number,
		distanceInitial: number,
		speedRelativeToShooter: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase,
		projectileEntityInitialize: (entity: Entity) => void
	): ProjectileGeneration
	{
		return new ProjectileGeneration
		(
			radius,
			distanceInitial,
			speedRelativeToShooter,
			ticksToLive,
			damage,
			visual,
			projectileEntityInitialize
		);
	}

	static fromVisual(visual: VisualBase)
	{
		return new ProjectileGeneration
		(
			0, // radius
			0, // distanceInitial,
			0, // speedRelativeToShooter
			1, // ticksToLive
			null, // damage
			visual,
			null // projectileEntityInitialize
		);
	}

	projectileEntityInitialize(entity: Entity): void
	{
		if (this._projectileEntityInitialize != null)
		{
			this._projectileEntityInitialize(entity);
		}
	}

	toEntityFromEntityFiring(entityFiring: Entity): Entity
	{
		var shooterLoc = Locatable.of(entityFiring).loc;
		var shooterPos = shooterLoc.pos;
		var shooterVel = shooterLoc.vel;
		var shooterSpeed = shooterVel.magnitude();
		var shooterOri = shooterLoc.orientation;
		var shooterForward = shooterOri.forward;

		var shotDistance = this.distanceInitial + this.radius;

		var shotOffset =
			shooterForward
				.clone()
				.multiplyScalar(shotDistance);

		var shotPos =
			shooterPos
				.clone()
				.add(shotOffset);
		var shotOri = Orientation.fromForward(shooterForward);

		var shotLoc = Disposition.fromPosAndOri(shotPos, shotOri);
		var shotSpeedAbsolute =
			this.speedRelativeToShooter + shooterSpeed;
		shotLoc.vel
			.overwriteWith(shooterForward)
			.multiplyScalar(shotSpeedAbsolute);

		var shotAudible = Audible.create();
		var shotCollider = Sphere.fromRadius(this.radius);
		var shotCollidable = Collidable.fromColliderPropertyNameToCollideWithAndCollide
		(
			shotCollider,
			Collidable.name,
			(uwpe: UniverseWorldPlaceEntities) => this.collide(uwpe)
		);
		var shotDamager = Damager.fromDamagePerHit(this.damage);
		var shotDrawable = Drawable.fromVisual(this.visual); // hack
		var shotEphemeral = Ephemeral.fromTicksToLive(this.ticksToLive);
		var shotKillable = Killable.fromIntegrityMax(1);
		var shotLocatable = Locatable.fromDisposition(shotLoc);
		var shotMovable = Movable.default();

		var shotEntity = Entity.fromNameAndProperties
		(
			entityFiring.name + "_Shot",
			[
				shotAudible,
				shotCollidable,
				shotDamager,
				shotDrawable,
				shotEphemeral,
				shotKillable,
				shotLocatable,
				shotMovable
			]
		);

		this.projectileEntityInitialize(shotEntity);

		return shotEntity;
	}

	collide(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityProjectile = uwpe.entity;
		var entityOther = uwpe.entity2;
		var targetKillable = Killable.of(entityOther);
		if (targetKillable != null)
		{
			var damageToApply = Damager.of(entityProjectile).damagePerHit;
			targetKillable.damageApply(uwpe, damageToApply);

			var projectileKillable = Killable.of(entityProjectile);
			if (projectileKillable != null)
			{
				projectileKillable.kill();
			}
		}
	}
}

}
