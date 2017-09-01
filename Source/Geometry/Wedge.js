
function Wedge(vertex, angleInTurnsMin, angleInTurnsMax)
{
	this.vertex = vertex;
	this.angleInTurnsMin = angleInTurnsMin;
	this.angleInTurnsMax = angleInTurnsMax;
}
{
	Wedge.prototype.collider = function()
	{
		if (this._collider == null)
		{
			var rayDirectionMin = new Polar(this.angleInTurnsMin, 1).toCoords(new Coords());
			var rayDirectionMax = new Polar(this.angleInTurnsMax, 1).toCoords(new Coords());

			var down = new Coords(0, 0, 1);

			var planeMin = Plane.fromPoints
			([
				// Order matters!
				this.vertex, 
				this.vertex.clone().add(down),
				this.vertex.clone().add(rayDirectionMin)
			]);

			var planeMax = Plane.fromPoints
			([
				this.vertex, 
				this.vertex.clone().add(rayDirectionMax),
				this.vertex.clone().add(down)
			]);

			var hemispaces = 
			[
				new Hemispace(planeMin), 
				new Hemispace(planeMax)
			];

			var angleSpannedInTurns = this.angleInTurnsMax - this.angleInTurnsMin;
			var shapeGroup;
			if (angleSpannedInTurns < .5)
			{
				this._collider = new ShapeGroupAll(hemispaces);
			}
			else
			{
				this._collider = new ShapeGroupAny(hemispaces);
			}
		}
		return this._collider;
	}
}