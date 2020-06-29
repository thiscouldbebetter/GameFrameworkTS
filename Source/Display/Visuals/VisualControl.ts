
class VisualControl
{
	constructor(controlRoot)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Location(new Coords());
	}

	draw(universe, world, display, entity)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc);
	};
}
