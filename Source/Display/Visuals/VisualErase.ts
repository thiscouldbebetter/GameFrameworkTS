
namespace ThisCouldBeBetter.GameFramework
{

export class VisualErase implements Visual<VisualErase>
{
	child: VisualBase;

	constructor(child: VisualBase)
	{
		this.child = child;
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
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

	clone(): VisualErase
	{
		return this; // todo
	}

	overwriteWith(other: VisualErase): VisualErase
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualErase
	{
		return this; // todo
	}
}

}
