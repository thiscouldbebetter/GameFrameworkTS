
function Wedge(vertex, angleInTurnsMin, angleInTurnsMax)
{
	this.vertex = vertex;
	this.angleInTurnsMin = angleInTurnsMin;
	this.angleInTurnsMax = angleInTurnsMax;

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
	
	this._collider = new ShapeGroupAll
	([
		new Hemispace( planeMin ), 
		new Hemispace( planeMax )
	]);
}
{
	Wedge.prototype.collider = function()
	{
		return this._collider;
	}
}