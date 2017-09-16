
function Rotation(axis, angleInTurnsRef)
{
	this.axis = axis;
	this.angleInTurnsRef = angleInTurnsRef;
}

{
	Rotation.prototype.angleInTurns = function()
	{
		return this.angleInTurnsRef.value;
	}

	Rotation.prototype.transformCoords = function(coordsToTransform)
	{
		// hack - Assume axis is (0, 0, 1).
		var polar = new Polar().fromCoords(coordsToTransform);

		polar.angleInTurns = NumberHelper.wrapValueToRangeMinMax
		(
			polar.angleInTurns + this.angleInTurns(), 0, 1
		);

		return polar.toCoords(coordsToTransform);
	}

	Rotation.prototype.transformOrientation = function(orientation)
	{
		orientation.forwardSet(this.transformCoords(orientation.forward));
	}
}
