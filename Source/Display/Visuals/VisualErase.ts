
class VisualErase implements Visual
{
	child: Visual;

	constructor(child: Visual)
	{
		this.child = child;
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		display.stateSave();
		display.eraseModeSet(true);
		this.child.draw(universe, world, place, entity, display);
		display.eraseModeSet(false);
		display.stateRestore();
	}

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
