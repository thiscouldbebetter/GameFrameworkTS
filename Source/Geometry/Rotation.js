
function Rotation(axis, angleInTurnsRef)
{
	this.axis = axis;
	this.angleInTurnsRef = angleInTurnsRef;
}

{
	Rotation.prototype.angleInTurns = function()
	{
		return this.angleInTurnsRef.value;
	};

	Rotation.prototype.transformCoords = function(coordsToTransform)
	{
		// hack - Assume axis is (0, 0, 1).
		var polar = new Polar().fromCoords(coordsToTransform);

		polar.azimuthInTurns =
		(
			polar.azimuthInTurns + this.angleInTurns()
		).wrapToRangeMinMax(0, 1);

		return polar.toCoords(coordsToTransform);
	};

	Rotation.prototype.transformOrientation = function(orientation)
	{
		orientation.forwardSet(this.transformCoords(orientation.forward));
	};
}
