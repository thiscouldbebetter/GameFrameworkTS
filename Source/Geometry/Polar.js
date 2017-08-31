function Polar(angleInTurns, distance)
{
	this.angleInTurns = angleInTurns;
	this.distance = distance;
}
{
	// constants

	Polar.RadiansPerTurn = 2 * Math.PI;

	// static methods

	Polar.fromCoords = function(coordsToConvert)
	{
		var angleInRadians = Math.atan2(coordsToConvert.y, coordsToConvert.x);
		var angleInTurns = angleInRadians / Polar.RadiansPerTurn;
		var distance = coordsToConvert.magnitude();
		var returnValue = new Polar(angleInTurns, distance);
		return returnValue;
	}

	// instance methods

	Polar.prototype.angleInRadians = function()
	{
		return this.angleInTurns * Polar.RadiansPerTurn;
	}

	Polar.prototype.toCoords = function(coordsToOverwrite)
	{
		var angleInRadians = this.angleInRadians();
		coordsToOverwrite.overwriteWithDimensions
		(
			Math.cos(angleInRadians), Math.sin(angleInRadians), 0
		);

		coordsToOverwrite.multiplyScalar(this.distance);

		return coordsToOverwrite;
	}
}