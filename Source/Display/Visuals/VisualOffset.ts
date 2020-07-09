
class VisualOffset implements Visual
{
	child: Visual;
	offset: Coords;

	_posSaved: Coords;

	constructor(child: Visual, offset: Coords)
	{
		this.child = child;
		this.offset = offset;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, display, entity);
		drawablePos.overwriteWith(this._posSaved);
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
