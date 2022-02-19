
namespace ThisCouldBeBetter.GameFramework
{

export class VisualOffset implements Visual<VisualOffset>
{
	offset: Coords;
	child: VisualBase;

	_posSaved: Coords;

	constructor(offset: Coords, child: VisualBase)
	{
		this.offset = offset;
		this.child = child;

		// Helper variables.
		this._posSaved = Coords.create();
	}

	static fromChildAndOffset(child: VisualBase, offset: Coords): VisualOffset
	{
		return new VisualOffset(offset, child);
	}

	static fromOffsetAndChild(offset: Coords, child: VisualBase): VisualOffset
	{
		return new VisualOffset(offset, child);
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
