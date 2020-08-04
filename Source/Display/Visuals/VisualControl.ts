
class VisualControl implements Visual
{
	controlRoot: Control;

	_drawLoc: Disposition;

	constructor(controlRoot: Control)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(new Coords(0, 0, 0), null, null);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
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
