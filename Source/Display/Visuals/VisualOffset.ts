
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
		this._posSaved = Coords.create();
	}

	static fromOffsetAndChild(offset: Coords, child: Visual): VisualOffset
	{
		return new VisualOffset(child, offset);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(uwpe, display);
		drawablePos.overwriteWith(this._posSaved);
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
