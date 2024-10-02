
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

	// Equatable

	equals(other: ShapeBase) { return false; } // todo

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	locate(loc: Disposition): ShapeBase
	{
		throw new Error("Not implemented!");
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return null; // todo
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

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): ShapeGroupAny
	{
		this.shapes.forEach( (x: ShapeBase) => x.transform(transformToApply));
		return this;
	}
}

}
