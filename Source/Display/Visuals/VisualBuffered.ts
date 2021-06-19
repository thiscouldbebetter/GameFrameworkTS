
namespace ThisCouldBeBetter.GameFramework
{

export class VisualBuffered implements Visual
{
	size: Coords;
	child: Visual;

	displayForBuffer: Display2D;
	sizeHalf: Coords;

	_posSaved: Coords;

	constructor(size: Coords, child: Visual)
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
		var drawPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawPos);

		drawPos.overwriteWith(this.sizeHalf);
		this.child.draw(uwpe, this.displayForBuffer);

		drawPos.overwriteWith(this._posSaved);
		drawPos.subtract(this.sizeHalf);
		display.drawImage(this.displayForBuffer.toImage(), drawPos);

		drawPos.overwriteWith(this._posSaved);
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
