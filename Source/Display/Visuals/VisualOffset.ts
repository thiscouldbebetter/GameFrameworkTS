
namespace ThisCouldBeBetter.GameFramework
{

export class VisualOffset implements Visual<VisualOffset>
{
	child: VisualBase;
	offset: Coords;

	_posSaved: Coords;

	constructor(child: VisualBase, offset: Coords)
	{
		this.child = child;
		this.offset = offset;

		// Helper variables.
		this._posSaved = Coords.create();
	}

	static fromOffsetAndChild(offset: Coords, child: VisualBase): VisualOffset
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

	clone(): VisualOffset
	{
		return this; // todo
	}

	overwriteWith(other: VisualOffset): VisualOffset
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualOffset
	{
		return this; // todo
	}
}

}
