namespace ThisCouldBeBetter.GameFramework
{

export class ProjectileGeneration
{
	radius: number;
	distanceInitial: number;
	speed: number;
	ticksToLive: number;
	collideOnlyWithEntitiesHavingPropertiesNamed: string[];
	damage: Damage;
	visual: VisualBase;
	_projectileEntityInitialize: (entity: Entity) => void
	_hit: (uwpe: UniverseWorldPlaceEntities) => void;

	constructor
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		collideOnlyWithEntitiesHavingPropertiesNamed: string[],
		damage: Damage,
		visual: VisualBase,
		projectileEntityInitialize: (entity: Entity) => void,
		hit: (uwpe: UniverseWorldPlaceEntities) => void
	)
	{
		this.radius = radius || 2;
		this.distanceInitial = distanceInitial || 3;
		this.speed = speed || 4;
		this.ticksToLive = ticksToLive || 20;
		this.collideOnlyWithEntitiesHavingPropertiesNamed =
			collideOnlyWithEntitiesHavingPropertiesNamed
			|| [ Collidable.name ]; 
		this.damage = damage || Damage.fromAmount(1);;
		this.visual =
			visual ||
			VisualGroup.fromChildren
			([
				VisualSound.fromSoundName("Effects_Blip"),

				VisualCircle.fromRadiusAndColorFill
				(
					this.radius, Color.Instances().Yellow
				)
			]);
		this._projectileEntityInitialize = projectileEntityInitialize;
		this._hit = hit;
	}

	static default(): ProjectileGeneration
	{
		var generation = new ProjectileGeneration
		(
			null, //radius
			null, // distanceInitial
			null, // speed
			null, // ticksToLive
			null, // propertiesToCollideWithNames
			null, // damage
			null, // visual
			null, // init
			null // hit
		);

		return generation;
	}

	static fromRadiusDistanceSpeedTicksDamageVisualAndHit
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase,
		hit: (uwpe: UniverseWorldPlaceEntities) => void,
	): ProjectileGeneration
	{
		return new ProjectileGeneration
		(
			radius,
			distanceInitial,
			speed,
			ticksToLive,
			null, // propertiesToCollideWithNames
			damage,
			visual,
			null, // projectileEntityInitialize
			hit
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
			null, // propertiesToCollideWithNames
			damage,
			visual,
			projectileEntityInitialize,
			null // hit
		);
	}

	static fromRadiusDistanceSpeedTicksDamageVisualInitAndHit
	(
		radius: number,
		distanceInitial: number,
		speed: number,
		ticksToLive: number,
		damage: Damage,
		visual: VisualBase,
		projectileEntityInitialize: (entity: Entity) => void,
		hit: (uwpe: UniverseWorldPlaceEntities) => void
	): ProjectileGeneration
	{
		return new ProjectileGeneration
		(
			radius,
			distanceInitial,
			speed,
			ticksToLive,
			null, // propertiesToCollideWithNames
			damage,
			visual,
			projectileEntityInitialize,
			hit
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
			null, // propertiesToCollideWithNames
			null, // damage
			visual,
			null, // projectileEntityInitialize
			null // hit
		);
	}

	hit(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityProjectile = uwpe.entity;
		var entityTarget = uwpe.entity2;

		var projectileKillable = Killable.of(entityProjectile);
		var targetKillable = Killable.of(entityTarget);

		var projectileIsAlive =
			projectileKillable != null
			&& projectileKillable.isAlive();

		if (targetKillable != null && projectileIsAlive)
		{
			if (this._hit == null)
			{
				ProjectileGeneration.hit_DamageTargetAndDestroySelf(uwpe);
			}
			else
			{
				this._hit(uwpe);
			}
		}
	}

	static hit_DamageTargetAndDestroySelf(uwpe: UniverseWorldPlaceEntities): void
	{
		var entityProjectile = uwpe.entity;
		var entityTarget = uwpe.entity2;

		var projectileKillable = Killable.of(entityProjectile);
		var targetKillable = Killable.of(entityTarget);

		var projectileDamager = Damager.of(entityProjectile);
		if (projectileDamager != null)
		{
			var damageToApply = projectileDamager.damagePerHit;
			targetKillable.damageApply(uwpe, damageToApply);
		}

		projectileKillable.kill();
	}

	projectileEntityInitialize(entity: Entity): void
	{
		if (this._projectileEntityInitialize != null)
		{
			this._projectileEntityInitialize(entity);
		}
	}

	range(): number
	{
		var range =
			this.distanceInitial
			+ this.speed * this.ticksToLive;

		return range;
	}

	toEntityFromEntityFiring(entityFiring: Entity): Entity
	{
		var shooterLoc = Locatable.of(entityFiring).loc;
		var shooterPos = shooterLoc.pos;
		var shooterOri = shooterLoc.orientation;
		var shooterForward = shooterOri.forward;

		var shotDistance = this.distanceInitial;

		var offset =
			shooterForward
				.clone()
				.multiplyScalar(shotDistance);

		var pos =
			shooterPos
				.clone()
				.add(offset);
		var ori = Orientation.fromForward(shooterForward);

		var loc = Disposition.fromPosAndOri(pos, ori);
		loc.vel
			.overwriteWith(shooterForward)
			.multiplyScalar(this.speed);

		var audible = Audible.create();

		// Shots may move so fast that they "pass through" targets
		// without ever colliding with them, so duplicate the collider along the path
		// to make sure anything between the starting and ending points is hit.
		var colliderPartBeforeTransform = Sphere.fromRadius(this.radius); 
		var diameter = this.radius * 2;
		var colliderPartsCount = this.speed / diameter;
		var colliderParts: Shape[] = [];
		for (var i = 0; i < colliderPartsCount; i++)
		{
			var displacement =
				shooterForward
					.clone()
					.multiplyScalar(i * diameter);
			var transform = Transform_Translate.fromDisplacement(displacement);
			var colliderPart =
				ShapeTransformed.fromTransformAndChild(transform, colliderPartBeforeTransform);
			colliderParts.push(colliderPart);
		}
		var collider = ShapeGroupAny.fromChildren(colliderParts);
		var collidable =
			Collidable.fromColliderPropertyNamesAndCollide
			(
				collider,
				this.collideOnlyWithEntitiesHavingPropertiesNamed,
				(uwpe: UniverseWorldPlaceEntities) => this.collide(uwpe)
			);
		var damager = Damager.fromDamagePerHit(this.damage);
		var drawable = Drawable.fromVisual(this.visual); // hack
		var ephemeral = Ephemeral.fromTicksToLive(this.ticksToLive);
		var killable = Killable.fromIntegrityMax(1);
		var locatable = Locatable.fromDisposition(loc);
		var movable = Movable.fromSpeedMax(this.speed);
		var relatable =
			Relatable.fromRelationshipNameAndEntityRelatedId
			(
				"Originator", entityFiring.id
			);

		var shotEntity = Entity.fromNameAndProperties
		(
			entityFiring.name + "_Shot",
			[
				audible,
				collidable,
				damager,
				drawable,
				ephemeral,
				killable,
				locatable,
				movable,
				relatable
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
			this.hit(uwpe);
		}
	}

	// Accessors.

	collideOnlyWithEntitiesHavingPropertiesNamedSet(values: string[]): ProjectileGeneration
	{
		this.collideOnlyWithEntitiesHavingPropertiesNamed = values;
		return this;
	}
}

}
