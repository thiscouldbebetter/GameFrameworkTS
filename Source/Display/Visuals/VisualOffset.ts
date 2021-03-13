
namespace ThisCouldBeBetter.GameFramework
{

export class VisualOffset implements Visual
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

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, place, entity, display);
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

}
