function Polar(angleInTurns, distance)
{
	this.angleInTurns = angleInTurns;
	this.distance = distance;
}
{
	// constants

	Polar.RadiansPerTurn = 2 * Math.PI;

	// instance methods

	Polar.prototype.angleInRadians = function()
	{
		return this.angleInTurns * Polar.RadiansPerTurn;
	}

	Polar.prototype.fromCoords = function(coordsToConvert)
	{
		var angleInRadians = Math.atan2(coordsToConvert.y, coordsToConvert.x);
		var angleInTurns = NumberHelper.wrapValueToRangeMinMax
		(
			angleInRadians / Polar.RadiansPerTurn, 0, 1
		);
		var distance = coordsToConvert.magnitude();
		var returnValue = new Polar(angleInTurns, distance);
		return returnValue;
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

	Polar.prototype.overwriteWith = function(other)
	{
		this.angleInTurns = other.angleInTurns;
		this.distance = other.distance;
		return this;
	}

	Polar.prototype.overwriteWithAngleAndDistance = function(angleInTurns, distance)
	{
		this.angleInTurns = angleInTurns;
		this.distance = distance;
		return this;
	}

}
