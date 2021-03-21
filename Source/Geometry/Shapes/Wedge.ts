
namespace ThisCouldBeBetter.GameFramework
{

export class Wedge
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

	_collider: any;

	constructor(vertex: Coords, directionMin: Coords, angleSpannedInTurns: number)
	{
		this.vertex = vertex;
		this.directionMin = directionMin;
		this.angleSpannedInTurns = angleSpannedInTurns;

		// Helper variable.
		this.rayDirectionMinAsPolar = new Polar(0, 1, 0);
	}

	angleInTurnsMax()
	{
		var returnValue = NumberHelper.wrapToRangeMinMax
		(
			this.angleInTurnsMin() + this.angleSpannedInTurns,
			0, 1
		);

		return returnValue;
	}

	angleInTurnsMin()
	{
		return this.rayDirectionMinAsPolar.fromCoords
		(
			this.directionMin
		).azimuthInTurns;
	}

	collider()
	{
		if (this._collider == null)
		{
			this.rayDirectionMinAsPolar = new Polar(0, 1, 0);
			this.rayDirectionMaxAsPolar = new Polar(0, 1, 0);
			this.rayDirectionMin = Coords.blank();
			this.rayDirectionMax = Coords.blank();
			this.downFromVertex = Coords.blank();
			this.directionMinFromVertex = Coords.blank();
			this.directionMaxFromVertex = Coords.blank();
			this.planeForAngleMin = new Plane(Coords.blank(), 0);
			this.planeForAngleMax = new Plane(Coords.blank(), 0);
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

	// cloneable

	clone()
	{
		return new Wedge(this.vertex.clone(), this.directionMin.clone(), this.angleSpannedInTurns);
	}

	overwriteWith(other: Wedge)
	{
		this.vertex.overwriteWith(other.vertex);
		this.directionMin.overwriteWith(other.directionMin);
		this.angleSpannedInTurns = other.angleSpannedInTurns;
	}
}

}
