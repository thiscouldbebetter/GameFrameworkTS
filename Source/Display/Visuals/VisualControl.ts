
class VisualControl
{
	controlRoot: any;

	_drawLoc: Disposition;

	constructor(controlRoot)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(new Coords(0, 0, 0), null, null);
	}

	draw(universe, world, display, entity)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
	};
}
