namespace ThisCouldBeBetter.GameFramework
{

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

	static fromRadiusDistanceSpeedTicksDamageAndVisual
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase
	): ProjectileGeneration
	{
		return new ProjectileGeneration
		(
			radius,
			distanceInitial,
			speed,
			ticksToLive,
			damage,
			visual
		);
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
		var userLoc = Locatable.of(entityFiring).loc;
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
