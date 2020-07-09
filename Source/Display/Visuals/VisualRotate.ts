
class VisualRotate implements Visual
{
	rotationInTurns: number;
	child: Visual;

	constructor(rotationInTurns: number, child: Visual)
	{
		this.rotationInTurns = rotationInTurns;
		this.child = child;
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		display.stateSave();

		display.rotateTurnsAroundCenter(this.rotationInTurns, entity.locatable().loc.pos);

		this.child.draw(universe, world, display, entity);

		display.stateRestore();
	};

	// Clonable.

	clone(): Visual
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
