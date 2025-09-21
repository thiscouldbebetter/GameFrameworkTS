
namespace ThisCouldBeBetter.GameFramework
{

export class VisualParticles implements Visual<VisualParticles>
{
	name: string;
	ticksToGenerate: number;
	particlesPerTick: number;
	particleTicksToLiveGet: () => number;
	particleVelocityGet: () => Coords;
	transformToApplyEachTick: TransformBase;
	particleVisual: VisualBase;

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
		particleVisual: VisualBase
	)
	{
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
		if (this.ticksSoFar < this.ticksToGenerate || this.ticksToGenerate == null)
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

			var entity = uwpe.entity;

			for (var i = 0; i < particleCountThisTick; i++)
			{
				var entityGeneratingLoc = Locatable.of(entity).loc;

				var particleName =
					"Particle" + this.name + "-" + this.ticksSoFar + "-" + i;
				var particleLoc = entityGeneratingLoc.clone();
				var particleVel = this.particleVelocityGet();
				particleLoc.vel.overwriteWith(particleVel);
				var particleTicksToLive = this.particleTicksToLiveGet();

				var entityParticle = Entity.fromNameAndProperties
				(
					particleName,
					[
						Drawable.fromVisual(this.particleVisual.clone()),
						Ephemeral.fromTicksToLive(particleTicksToLive),
						Locatable.fromDisposition(particleLoc)
					]
				);

				this.particleEntities.push(entityParticle);
			}

			this.ticksSoFar++;
		}

		var uwpeForParticles = uwpe.clone();
		this.particleEntities.forEach(particleEntity => {

			var loc = Locatable.of(particleEntity).loc;
			loc.pos.add(loc.vel);

			var ephemeral = Ephemeral.of(particleEntity);
			var ephemeralIsExpired = ephemeral.isExpired();
			if (ephemeralIsExpired)
			{
				ArrayHelper.remove(this.particleEntities, particleEntity);
			}
			else
			{
				ephemeral.ticksToLive--;
				var particleVisual = Drawable.of(particleEntity).visual;
				particleVisual.draw
				(
					uwpeForParticles.entitySet(particleEntity),
					display
				);
				this.transformToApplyEachTick.transform(particleVisual);
			}
		});
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
