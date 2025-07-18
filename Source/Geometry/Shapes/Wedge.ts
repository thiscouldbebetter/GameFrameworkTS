
namespace ThisCouldBeBetter.GameFramework
{

export class Wedge implements ShapeBase
{
	vertex: Coords;
	directionMin: Coords;
	angleSpannedInTurns: number;

	rayDirectionMinAsPolar: Polar;
	rayDirectionMaxAsPolar: Polar;
	rayDirectionMin: Coords;
	rayDirectionMax: Coords;
	downFromVertex: Coords;
	directionMinFromVertex: Coords;
	directionMaxFromVertex: Coords;
	planeForAngleMin: Plane;
	planeForAngleMax: Plane;
	hemispaces: Hemispace[];
	shapeGroupAll: ShapeGroupAll;
	shapeGroupAny: ShapeGroupAny;

	_collider: ShapeBase;

	constructor(vertex: Coords, directionMin: Coords, angleSpannedInTurns: number)
	{
		this.vertex = vertex;
		this.directionMin = directionMin;
		this.angleSpannedInTurns = angleSpannedInTurns;

		// Helper variable.
		this.rayDirectionMinAsPolar = new Polar(0, 1, 0);
	}

	static default()
	{
		return new Wedge
		(
			Coords.create(), // vertex
			new Coords(1, 0, 0), // directionMin
			.5 // angleSpannedInTurns
		);
	}

	angleAsRangeExtent(): RangeExtent
	{
		var angleStartInTurns = this.directionMin.headingInTurns();
		return new RangeExtent
		(
			angleStartInTurns,
			angleStartInTurns + this.angleSpannedInTurns
		);
	}

	angleInTurnsMax(): number
	{
		var returnValue = NumberHelper.wrapToRangeMinMax
		(
			this.angleInTurnsMin() + this.angleSpannedInTurns,
			0, 1
		);

		return returnValue;
	}

	angleInTurnsMin(): number
	{
		return this.rayDirectionMinAsPolar.fromCoords
		(
			this.directionMin
		).azimuthInTurns;
	}

	collider(): ShapeBase
	{
		if (this._collider == null)
		{
			this.rayDirectionMinAsPolar = new Polar(0, 1, 0);
			this.rayDirectionMaxAsPolar = new Polar(0, 1, 0);
			this.rayDirectionMin = Coords.create();
			this.rayDirectionMax = Coords.create();
			this.downFromVertex = Coords.create();
			this.directionMinFromVertex = Coords.create();
			this.directionMaxFromVertex = Coords.create();
			this.planeForAngleMin = new Plane(Coords.create(), 0);
			this.planeForAngleMax = new Plane(Coords.create(), 0);
			this.hemispaces = 
			[ 
				new Hemispace(this.planeForAngleMin),
				new Hemispace(this.planeForAngleMax)
			];
			this.shapeGroupAll = new ShapeGroupAll(this.hemispaces);
			this.shapeGroupAny = new ShapeGroupAny(this.hemispaces);
		}

		var angleInTurnsMin = this.angleInTurnsMin();
		var angleInTurnsMax = this.angleInTurnsMax();

		this.rayDirectionMinAsPolar.azimuthInTurns = angleInTurnsMin;
		this.rayDirectionMinAsPolar.toCoords(this.rayDirectionMin);
		this.rayDirectionMaxAsPolar.azimuthInTurns = angleInTurnsMax;
		this.rayDirectionMaxAsPolar.toCoords(this.rayDirectionMax);

		var down = Coords.Instances().ZeroZeroOne;

		this.downFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			down
		);

		this.directionMinFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			this.rayDirectionMin
		);

		this.directionMaxFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			this.rayDirectionMax
		);

		this.planeForAngleMin.fromPoints
		(
			// Order matters!
			this.vertex, 
			this.directionMinFromVertex,
			this.downFromVertex
		);

		this.planeForAngleMax.fromPoints
		(
			this.vertex, 
			this.downFromVertex,
			this.directionMaxFromVertex
		);

		if (this.angleSpannedInTurns < .5)
		{
			this._collider = this.shapeGroupAll;
		}
		else
		{
			this._collider = this.shapeGroupAny;
		}

		return this._collider;
	}

	containsPoint(pointToCheck: Coords): boolean
	{
		throw new Error("Not yet implemented!");
	}

	// Clonable.

	clone(): Wedge
	{
		return new Wedge(this.vertex.clone(), this.directionMin.clone(), this.angleSpannedInTurns);
	}

	overwriteWith(other: Wedge): Wedge
	{
		this.vertex.overwriteWith(other.vertex);
		this.directionMin.overwriteWith(other.directionMin);
		this.angleSpannedInTurns = other.angleSpannedInTurns;
		return this;
	}

	// Equatable.

	equals(other: Wedge): boolean
	{
		var returnValue =
		(
			this.vertex.equals(other.vertex)
			&& this.directionMin.equals(other.directionMin)
			&& this.angleSpannedInTurns == other.angleSpannedInTurns
		);

		return returnValue;
	}

	// ShapeBase.

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
		throw new Error("Not implemented!");
	}

	toBoxAxisAligned(boxOut: BoxAxisAligned): BoxAxisAligned { throw new Error("Not implemented!"); }

	// Transformable.

	transform(transformToApply: TransformBase): Wedge
	{
		transformToApply.transformCoords(this.vertex);
		return this;
	}

}

}
