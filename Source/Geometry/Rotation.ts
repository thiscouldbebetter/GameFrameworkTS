
class Rotation
{
	constructor(axis, angleInTurnsRef)
	{
		this.axis = axis;
		this.angleInTurnsRef = angleInTurnsRef;
	}

	angleInTurns()
	{
		return this.angleInTurnsRef.value;
	};

	transformCoords(coordsToTransform)
	{
		// hack - Assume axis is (0, 0, 1).
		var polar = new Polar().fromCoords(coordsToTransform);

		polar.azimuthInTurns =
		(
			polar.azimuthInTurns + this.angleInTurns()
		).wrapToRangeMinMax(0, 1);

		return polar.toCoords(coordsToTransform);
	};

	transformOrientation(orientation)
	{
		orientation.forwardSet(this.transformCoords(orientation.forward));
	};
}
