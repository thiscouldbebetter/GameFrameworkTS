
class Movable
{
	accelerationPerTick: number;
	_accelerate: (u: Universe, w: World, p: Place, e: Entity, a: number) => void;

	constructor
	(
		accelerationPerTick: number,
		accelerate: (u: Universe, w: World, p: Place, e: Entity, a: number) => void
	)
	{
		this.accelerationPerTick = accelerationPerTick;
		this._accelerate = accelerate || this.accelerateForward;
	}

	accelerate(universe: Universe, world: World, place: Place, entityMovable: Entity)
	{
		this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
	}

	accelerateForward(universe: Universe, world: World, place: Place, entityMovable: Entity, accelerationPertick: number)
	{
		var entityLoc = entityMovable.locatable().loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			entityMovable.movable().accelerationPerTick
		);
	};

	// cloneable

	clone(): Movable
	{
		return this;
	};
}
