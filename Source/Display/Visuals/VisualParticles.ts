
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

	tickLastDrawnOn: number;
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

		this.tickLastDrawnOn = -1;
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
		var tickCurrent = uwpe.world.timerTicksSoFar;

		var particlesHaveNotYetBeenUpdatedThisTick =
			(this.tickLastDrawnOn < tickCurrent);

		this.tickLastDrawnOn = tickCurrent;

		if (particlesHaveNotYetBeenUpdatedThisTick)
		{
			var particlesAreStillBeingGenerated =
				this.ticksToGenerate == null
				|| this.ticksSoFar < this.ticksToGenerate;

			if (particlesAreStillBeingGenerated)
			{
				this.draw_ParticlesGenerate(uwpe);
			}
		}

		var emitterEntity = uwpe.entity;

		for (var i = 0; i < this.particleEntities.length; i++)
		{
			var particleEntity = this.particleEntities[i];
			this.draw_ParticleUpdateAndDraw
			(
				uwpe,
				display,
				emitterEntity,
				particleEntity,
				particlesHaveNotYetBeenUpdatedThisTick
			);
		}

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

	draw_ParticleUpdateAndDraw
	(
		uwpe: UniverseWorldPlaceEntities,
		display: Display,
		emitterEntity: Entity,
		particleEntity: Entity,
		particlesHaveNotYetBeenUpdatedThisTick: boolean
	): void
	{
		var particleShouldBeDrawn = false;

		if (particlesHaveNotYetBeenUpdatedThisTick)
		{
			var ephemeral = Ephemeral.of(particleEntity);
			var ephemeralIsExpired = ephemeral.isExpired();
			if (ephemeralIsExpired)
			{
				ArrayHelper.remove(this.particleEntities, particleEntity);
			}
			else
			{
				this.draw_ParticleUpdateAndDraw_Move(particleEntity);
				particleShouldBeDrawn = true;
			}
		}
		else
		{
			particleShouldBeDrawn = true;
		}

		if (particleShouldBeDrawn)
		{
			this.draw_ParticleUpdateAndDraw_Draw
			(
				uwpe, display, emitterEntity, particleEntity
			);
		}
	}

	draw_ParticleUpdateAndDraw_Move(particleEntity: Entity): void
	{
		var particleDispRelativeToEmitter = Locatable.of(particleEntity).loc;
		var particlePosRelativeToEmitter = particleDispRelativeToEmitter.pos;
		particlePosRelativeToEmitter.add(particleDispRelativeToEmitter.vel);
	}

	draw_ParticleUpdateAndDraw_Draw
	(
		uwpe: UniverseWorldPlaceEntities,
		display: Display,
		emitterEntity: Entity,
		particleEntity: Entity
	): void
	{
		var particleDispRelativeToEmitter = Locatable.of(particleEntity).loc;
		var particlePosRelativeToEmitter = particleDispRelativeToEmitter.pos;

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
