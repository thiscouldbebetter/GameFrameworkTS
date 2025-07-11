
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeNone implements ShapeBase
{
	static _instance: ShapeNone;
	static Instance(): ShapeNone
	{
		if (this._instance == null)
		{
			this._instance = new ShapeNone();
		}
		return this._instance;
	}

	// Clonable.

	clone(): ShapeNone
	{
		return new ShapeNone();
	}

	overwriteWith(other: ShapeNone): ShapeNone
	{
		return this;
	}

	// Equatable

	equals(other: ShapeBase) { return false; }

	// ShapeBase.

	collider(): ShapeBase { return null; }

	containsPoint(pointToCheck: Coords): boolean
	{
		return false;
	}

	normalAtPos(posToCheck: Coords, normalOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		throw new Error("Not implemented!");
	}

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		throw new Error("Not implemented!");
	}

	toBox(boxOut: Box): Box { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): ShapeNone { return this;  }

}

}
