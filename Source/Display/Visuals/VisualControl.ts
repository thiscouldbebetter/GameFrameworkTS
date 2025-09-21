
namespace ThisCouldBeBetter.GameFramework
{

export class VisualControl extends VisualBase<VisualControl>
{
	controlRoot: ControlBase;

	_drawLoc: Disposition;

	constructor(controlRoot: ControlBase)
	{
		super();

		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(Coords.create(), null, null);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		// Do nothing.
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return true;
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
