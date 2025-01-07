
namespace ThisCouldBeBetter.GameFramework
{

export class VisualControl implements Visual<VisualControl>
{
	controlRoot: ControlBase;

	_drawLoc: Disposition;

	constructor(controlRoot: ControlBase)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(Coords.create(), null, null);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var universe = uwpe.universe;
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc, null);
	}

	// Clonable.

	clone(): VisualControl
	{
		return this; // todo
	}

	overwriteWith(other: VisualControl): VisualControl
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualControl
	{
		return this; // todo
	}
}

}
