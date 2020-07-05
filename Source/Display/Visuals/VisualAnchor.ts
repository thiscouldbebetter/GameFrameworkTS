
class VisualAnchor
{
	child: any;
	posToAnchorAt: Coords;

	_posSaved: Coords;

	constructor(child, posToAnchorAt)
	{
		this.child = child;
		this.posToAnchorAt = posToAnchorAt;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.overwriteWith(this.posToAnchorAt);
		this.child.draw(universe, world, display, entity);
		drawablePos.overwriteWith(this._posSaved);
	};
}
