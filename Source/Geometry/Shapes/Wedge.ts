
namespace ThisCouldBeBetter.GameFramework
{

export class Wedge extends ShapeBase
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

	_collider: Shape;

	constructor(vertex: Coords, directionMin: Coords, angleSpannedInTurns: number)
	{
		super();

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

	collider(): Shape
	{
		if (this._collider == null)
		{
			this.rayDirectionMinAsPolar = Polar.default();
			this.rayDirectionMaxAsPolar = Polar.default();
			this.rayDirectionMin = Coords.create();
			this.rayDirectionMax = Coords.create();
			this.downFromVertex = Coords.create();
			this.directionMinFromVertex = Coords.create();
			this.directionMaxFromVertex = Coords.create();
			this.planeForAngleMin = Plane.create();
			this.planeForAngleMax = Plane.create();
			this.hemispaces = 
			[ 
				Hemispace.fromPlane(this.planeForAngleMin),
				Hemispace.fromPlane(this.planeForAngleMax)
			];
			this.shapeGroupAll = ShapeGroupAll.fromChildren(this.hemispaces);
			this.shapeGroupAny = ShapeGroupAny.fromChildren(this.hemispaces);
		}

		var angleInTurnsMin = this.angleInTurnsMin();
		var angleInTurnsMax = this.angleInTurnsMax();

		this.rayDirectionMinAsPolar.azimuthInTurns = angleInTurnsMin;
		this.rayDirectionMinAsPolar.overwriteCoords(this.rayDirectionMin);
		this.rayDirectionMaxAsPolar.azimuthInTurns = angleInTurnsMax;
		this.rayDirectionMaxAsPolar.overwriteCoords(this.rayDirectionMax);

		var down = Coords.Instances().ZeroZeroOne;

		this.downFromVertex
			.overwriteWith(this.vertex)
			.add(down);

		this.directionMinFromVertex
			.overwriteWith(this.vertex)
			.add(this.rayDirectionMin);

		this.directionMaxFromVertex
			.overwriteWith(this.vertex)
			.add(this.rayDirectionMax);

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

	// Transformable.

	transform(transformToApply: TransformBase): Wedge
	{
		transformToApply.transformCoords(this.vertex);
		return this;
	}

}

}
