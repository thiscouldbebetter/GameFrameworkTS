
namespace ThisCouldBeBetter.GameFramework
{

export class VisualBuffered implements Visual<VisualBuffered>
{
	size: Coords;
	child: VisualBase;

	displayForBuffer: Display2D;
	sizeHalf: Coords;

	_posSaved: Coords;

	constructor(size: Coords, child: VisualBase)
	{
		this.size = size;
		this.child = child;

		this.displayForBuffer = Display2D.fromSizeAndIsInvisible(this.size, true);
		this.sizeHalf = this.size.clone().half();

		this._posSaved = Coords.create();

		this.displayForBuffer.initialize(null);
	}

	draw(uwpe: UniverseWorldPlaceEntities, display: Display)
	{
		var entity = uwpe.entity;
		var drawPos = Locatable.of(entity).loc.pos;
		this._posSaved.overwriteWith(drawPos);

		drawPos.overwriteWith(this.sizeHalf);
		this.child.draw(uwpe, this.displayForBuffer);

		drawPos.overwriteWith(this._posSaved);
		drawPos.subtract(this.sizeHalf);
		display.drawImage(this.displayForBuffer.toImage(VisualBuffered.name), drawPos);

		drawPos.overwriteWith(this._posSaved);
	}

	// Clonable.

	clone(): VisualBuffered
	{
		return this; // todo
	}

	overwriteWith(other: VisualBuffered): VisualBuffered
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: TransformBase): VisualBuffered
	{
		return this; // todo
	}
}

}
