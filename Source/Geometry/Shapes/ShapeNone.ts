
namespace ThisCouldBeBetter.GameFramework
{

export class ShapeNone extends ShapeBase
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

	equals(other: Shape) { return false; }

	// ShapeBase.

	containsPoint(pointToCheck: Coords): boolean
	{
		return false;
	}

	// Transformable.

	transform(transformToApply: TransformBase): ShapeNone { return this;  }

}

}
