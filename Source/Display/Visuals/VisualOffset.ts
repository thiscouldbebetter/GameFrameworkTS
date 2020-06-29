
class VisualOffset
{
	constructor(child, offset)
	{
		this.child = child;
		this.offset = offset;

		// Helper variables.
		this._posSaved = new Coords();
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable.loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, display, entity);
		drawablePos.overwriteWith(this._posSaved);
	};
}
