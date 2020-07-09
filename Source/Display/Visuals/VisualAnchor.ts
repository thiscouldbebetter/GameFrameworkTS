
class VisualAnchor implements Visual
{
	child: Visual;
	posToAnchorAt: Coords;

	_posSaved: Coords;

	constructor(child: Visual, posToAnchorAt: Coords)
	{
		this.child = child;
		this.posToAnchorAt = posToAnchorAt;

		// Helper variables.
		this._posSaved = new Coords(0, 0, 0);
	}

	draw(universe: Universe, world: World, display: Display, entity: Entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.overwriteWith(this.posToAnchorAt);
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
