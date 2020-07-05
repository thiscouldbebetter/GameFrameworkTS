
class VisualOffset
{
	child: any;
	offset: Coords;

	_posSaved: Coords;

	constructor(child, offset)
	{
		this.child = child;
		this.offset = offset;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, display, entity);
		drawablePos.overwriteWith(this._posSaved);
	};
}
