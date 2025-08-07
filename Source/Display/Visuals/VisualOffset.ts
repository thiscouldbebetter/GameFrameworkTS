
namespace ThisCouldBeBetter.GameFramework
{

export class VisualOffset implements Visual<VisualOffset>
{
	name: string;
	offset: Coords;
	child: VisualBase;

	_posSaved: Coords;

	constructor(name: string, offset: Coords, child: VisualBase)
	{
		this.name = name;
		this.offset = offset;
		this.child = child;

		// Helper variables.
		this._posSaved = Coords.create();
	}

	static fromChildAndOffset
	(
		child: VisualBase, offset: Coords
	): VisualOffset
	{
		return new VisualOffset(null, offset, child);
	}

	static fromNameOffsetAndChild
	(
		name: string,
		offset: Coords,
		child: VisualBase
	): VisualOffset
	{
		return new VisualOffset(name, offset, child);
	}

	static fromOffsetAndChild
	(
		offset: Coords, child: VisualBase
	): VisualOffset
	{
		return new VisualOffset(null, offset, child);
	}

	// Visual.

	initialize(uwpe: UniverseWorldPlaceEntities): void
	{
		this.child.initialize(uwpe);
	}

	initializeIsComplete(uwpe: UniverseWorldPlaceEntities): boolean
	{
		return this.child.initializeIsComplete(uwpe);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display): void
	{
		var entity = uwpe.entity;
		var drawablePos = Locatable.of(entity).loc.pos;
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
		transformToApply.transformCoords(this.offset);
		this.child.transform(transformToApply);
		return this;
	}
}

}
