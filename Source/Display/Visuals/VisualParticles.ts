
namespace ThisCouldBeBetter.GameFramework
{

export class VisualParticles extends VisualBase<VisualParticles>
{
	name: string;
	ticksToGenerate: number;
	particlesPerTick: number;
	particleTicksToLiveGet: () => number;
	particleVelocityGet: () => Coords;
	transformToApplyEachTick: TransformBase;
	particleVisual: Visual;

	ticksSoFar: number;
	particleEntities: Entity[];

	constructor
	(
		name: string,
		ticksToGenerate: number,
		particlesPerTick: number,
		particleTicksToLiveGet: () => number,
		particleVelocityGet: () => Coords,
		transformToApplyEachTick: TransformBase,
		particleVisual: Visual
	)
	{
		super();

		this.name = name;
		this.ticksToGenerate = ticksToGenerate;
		this.particlesPerTick = particlesPerTick;
		this.particleTicksToLiveGet = particleTicksToLiveGet;
		this.particleVelocityGet = particleVelocityGet;
		this.transformToApplyEachTick = transformToApplyEachTick;
		this.particleVisual = particleVisual;

		this.ticksSoFar = 0;
		this.particleEntities = [];
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true; // todo
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var particlesAreStillBeingGenerated =
			this.ticksToGenerate == null
			|| this.ticksSoFar < this.ticksToGenerate;

		var emitterEntity = uwpe.entity;

		if (particlesAreStillBeingGenerated)
		{
			this.draw_ParticlesGenerate(uwpe);
		}

		this.particleEntities.forEach
		(
			particleEntity =>
				this.draw_ParticlesUpdate(uwpe, display, emitterEntity, particleEntity)
		);

		uwpe.entitySet(emitterEntity);
	}

	draw_ParticlesGenerate(uwpe: UniverseWorldPlaceEntities): void
	{
		var particleCountThisTick;
		if (this.particlesPerTick >= 1)
		{
			particleCountThisTick = this.particlesPerTick;
		}
		else
		{
			var ticksPerParticle = 1 / this.particlesPerTick;
			particleCountThisTick = (this.ticksSoFar % ticksPerParticle == 0 ? 1 : 0);
		}

		for (var i = 0; i < particleCountThisTick; i++)
		{
			var particleName =
				"Particle" + this.name + "-" + this.ticksSoFar + "-" + i;
			var particleDispRelativeToEmitter = Disposition.create();
			var particleVel = this.particleVelocityGet();
			particleDispRelativeToEmitter.vel.overwriteWith(particleVel);
			var particleTicksToLive = this.particleTicksToLiveGet();

			var entityParticle = Entity.fromNameAndProperties
			(
				particleName,
				[
					Drawable.fromVisual(this.particleVisual.clone()),
					Ephemeral.fromTicksToLive(particleTicksToLive),
					Locatable.fromDisposition(particleDispRelativeToEmitter)
				]
			);

			this.particleEntities.push(entityParticle);
		}

		this.ticksSoFar++;

	}

	draw_ParticlesUpdate
	(
		uwpe: UniverseWorldPlaceEntities,
		display: Display,
		emitterEntity: Entity,
		particleEntity: Entity
	): void
	{
		var ephemeral = Ephemeral.of(particleEntity);
		var ephemeralIsExpired = ephemeral.isExpired();
		if (ephemeralIsExpired)
		{
			ArrayHelper.remove(this.particleEntities, particleEntity);
		}
		else
		{
			var particleDispRelativeToEmitter = Locatable.of(particleEntity).loc;
			var particlePosRelativeToEmitter = particleDispRelativeToEmitter.pos;
			particlePosRelativeToEmitter.add(particleDispRelativeToEmitter.vel);

			var emitterPos = Locatable.of(emitterEntity).loc.pos;
			var particlePosAbsolute =
				particlePosRelativeToEmitter.add(emitterPos);

			var particleVisual = Drawable.of(particleEntity).visual;
			uwpe.entitySet(particleEntity);
			particleVisual.draw(uwpe, display);
			this.transformToApplyEachTick.transform(particleVisual);

			particlePosRelativeToEmitter =
				particlePosAbsolute.subtract(emitterPos);
		}
	}

	// Clonable.

	clone(): VisualParticles
	{
		return this; // todo
	}

	overwriteWith(other: VisualParticles): VisualParticles
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualParticles
	{
		return this; // todo
	}
}

}
