
namespace ThisCouldBeBetter.GameFramework
{

export class Rotation implements Clonable<Rotation>
{
	axis: Coords;
	angleInTurnsRef: Reference<number>;

	constructor(axis: Coords, angleInTurnsRef: Reference<number>)
	{
		this.axis = axis;
		this.angleInTurnsRef = angleInTurnsRef;
	}

	angleInTurns(): number
	{
		return this.angleInTurnsRef.value;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		// hack - Assume axis is (0, 0, 1).
		var polar = new Polar(0, 0, 0).fromCoords(coordsToTransform);

		polar.azimuthInTurns = NumberHelper.wrapToRangeMinMax
		(
			polar.azimuthInTurns + this.angleInTurns(), 0, 1
		);

		return polar.overwriteCoords(coordsToTransform);
	}

	transformOrientation(orientation: Orientation): Orientation
	{
		return orientation.forwardSet(this.transformCoords(orientation.forward));
	}

	// Clonable.

	clone(): Rotation
	{
		return new Rotation(this.axis.clone(), this.angleInTurnsRef.clone() );
	}

	overwriteWith(other: Rotation): Rotation
	{
		this.axis.overwriteWith(other.axis);
		this.angleInTurnsRef.overwriteWith(other.angleInTurnsRef);
		return this;
	}
}

}
