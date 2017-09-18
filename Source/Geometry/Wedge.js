
function Wedge(vertex, directionMin, angleSpannedInTurns)
{
	this.vertex = vertex;
	this.directionMin = directionMin;
	this.angleSpannedInTurns = angleSpannedInTurns;
}
{
	Wedge.prototype.angleInTurnsMax = function()
	{
		return NumberHelper.wrapValueToRangeMinMax
		(
			this.angleInTurnsMin() + this.angleSpannedInTurns,
			0, // min
			1 // max
		);
	}

	Wedge.prototype.angleInTurnsMin = function()
	{
		return this.rayDirectionMinAsPolar.fromCoords
		(
			this.directionMin
		).angleInTurns;
	}

	Wedge.prototype.collider = function()
	{
		if (this._collider == null)
		{
			this.rayDirectionMinAsPolar = new Polar(0, 1);
			this.rayDirectionMaxAsPolar = new Polar(0, 1);
			this.rayDirectionMin = new Coords();
			this.rayDirectionMax = new Coords();
			this.downFromVertex = new Coords();
			this.directionMinFromVertex = new Coords();
			this.directionMaxFromVertex = new Coords();
			this.planeForAngleMin = new Plane(new Coords());
			this.planeForAngleMax = new Plane(new Coords());
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

		this.rayDirectionMinAsPolar.angleInTurns = angleInTurnsMin;
		this.rayDirectionMinAsPolar.toCoords(this.rayDirectionMin);
		this.rayDirectionMaxAsPolar.angleInTurns = angleInTurnsMax;
		this.rayDirectionMaxAsPolar.toCoords(this.rayDirectionMax);

		var down = Coords.Instances.ZeroZeroOne;

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
}
