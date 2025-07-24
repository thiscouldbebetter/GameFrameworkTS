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
	_projectileEntityInitialize: (entity: Entity) => void

	constructor
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase,
		projectileEntityInitialize: (entity: Entity) => void
	)
	{
		this.radius = radius;
		this.distanceInitial = distanceInitial;
		this.speed = speed;
		this.ticksToLive = ticksToLive;
		this.damage = damage;
		this.visual = visual;
		this._projectileEntityInitialize = projectileEntityInitialize;
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
			visual,
			null // projectileEntityInitialize
		);
	}

	static fromRadiusDistanceSpeedTicksDamageVisualAndInit
	(
		radius: number,
		distanceInitial: number,
		speed: number,
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
			speed,
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
			0, // speed
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
		shotLoc.vel
			.overwriteWith(shooterForward)
			.multiplyScalar(this.speed);

		var shotAudible = Audible.create();

		// Shots may move so fast that they "pass through" targets
		// without ever colliding with them, so duplicate the collider
		// to make sure anything between the before and after points is hit.
		var colliderPartBeforeTransform = Sphere.fromRadius(this.radius); 
		var shotDiameter = this.radius * 2;
		var colliderPartsCount = this.speed / shotDiameter;
		var colliderParts: Shape[] = [];
		for (var i = 0; i < colliderPartsCount; i++)
		{
			var displacement =
				shooterForward
					.clone()
					.multiplyScalar(i * shotDiameter);
			var transform = Transform_Translate.fromDisplacement(displacement);
			var colliderPart =
				ShapeTransformed.fromTransformAndChild(transform, colliderPartBeforeTransform);
			colliderParts.push(colliderPart);
		}
		var shotCollider = ShapeGroupAny.fromChildren(colliderParts);
		var shotCollidable =
			Collidable.fromColliderCollidesOnlyWithEntitiesHavingPropertyNamedAndCollide
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
		var shotMovable = Movable.fromSpeedMax(this.speed);
		var shotRelatable =
			Relatable.fromRelationshipNameAndEntityRelatedId
			(
				"Originator", entityFiring.id
			);

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
				shotMovable,
				shotRelatable
			]
		);

		this.projectileEntityInitialize(shotEntity);

		return shotEntity;
	}

	collide(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityProjectile = uwpe.entity;
		var entityOther = uwpe.entity2;

		var entityProjectileRelatable = Relatable.of(entityProjectile);

		if (entityProjectileRelatable.entityRelatedId != entityOther.id)
		{
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

}
