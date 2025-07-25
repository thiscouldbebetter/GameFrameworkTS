
namespace ThisCouldBeBetter.GameFramework
{

export class Point extends ShapeBase
{
	pos: Coords;

	constructor(pos: Coords)
	{
		super();

		this.pos = pos;
	}

	static default(): Point
	{
		return new Point(Coords.create() );
	}

	static fromPos(pos: Coords): Point
	{
		return new Point(pos);
	}

	containsOther(other: Point): boolean
	{
		return this.equals(other);
	}

	containsPoint(pointToCheck: Coords)
	{
		return this.pos.equals(pointToCheck);
	}

	pointRandom(randomizer: Randomizer): Coords
	{
		return this.pos.clone();
	}

	// Clonable.

	clone(): Point
	{
		return new Point(this.pos.clone() );
	}

	overwriteWith(other: Point): Point
	{
		this.pos.overwriteWith(other.pos);
		return this;
	}

	// Equatable.

	equals(other: Point): boolean
	{
		return this.pos.equals(other.pos);
	}

	// ShapeBase.

	surfacePointNearPos(posToCheck: Coords, surfacePointOut: Coords): Coords
	{
		return this.pos.clone();
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned
	{
		boxOut.size.clear(); // Will this work?
		return boxOut;
	}

	// Transformable.

	coordsGroupToTransform(): Coords[]
	{
		return [ this.pos ];
	}

	transform(transformToApply: TransformBase): Point
	{
		transformToApply.transformCoords(this.pos);
		return this;
	}
}

}
