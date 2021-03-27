
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeGroupAny implements ShapeBase
{
	shapes: ShapeBase[];

	private _displacement: Coords;
	private _surfacePointForChild: Coords;

	constructor(shapes: ShapeBase[])
	{
		this.shapes = shapes;

		this._displacement = Coords.create();
		this._surfacePointForChild = Coords.create();
	}

	// Clonable.

	clone(): ShapeGroupAny
	{
		return new ShapeGroupAny(ArrayHelper.clone(this.shapes));
	}

	overwriteWith(other: ShapeGroupAny): ShapeGroupAny
	{
		ArrayHelper.overwriteWith(this.shapes, other.shapes);
		return this;
	}

	// ShapeBase.

	locate(loc: Disposition): ShapeBase
	{
		throw("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		var distanceMinSoFar = Number.POSITIVE_INFINITY;
		for (var i = 0; i < this.shapes.length; i++)
		{
			var shape = this.shapes[i];

			shape.surfacePointNearPos(posToCheck, this._surfacePointForChild);

			var distanceFromPosToCheck = this._displacement.overwriteWith
			(
				this._surfacePointForChild
			).subtract
			(
				posToCheck
			).magnitude();

			if (distanceFromPosToCheck < distanceMinSoFar)
			{
				distanceMinSoFar = distanceFromPosToCheck;
				surfacePointOut.overwriteWith(this._surfacePointForChild);
			}
		}

		return surfacePointOut;
	}

	toBox(boxOut: Box): Box { throw("Not implemented!"); }
}

}
