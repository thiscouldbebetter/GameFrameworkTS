
namespace ThisCouldBeBetter.GameFramework
{

export class VisualControl implements Visual
{
	controlRoot: ControlBase;

	_drawLoc: Disposition;

	constructor(controlRoot: ControlBase)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(Coords.create(), null, null);
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
