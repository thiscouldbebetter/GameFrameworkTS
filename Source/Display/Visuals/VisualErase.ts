
namespace ThisCouldBeBetter.GameFramework
{

export class VisualErase implements Visual
{
	child: Visual;

	constructor(child: Visual)
	{
		this.child = child;
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		display.stateSave();
		display.eraseModeSet(true);
		this.child.draw(uwpe, display);
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

}
