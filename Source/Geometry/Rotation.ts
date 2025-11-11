
namespace ThisCouldBeBetter.GameFramework
{

export class Rotation implements Clonable<Rotation>
{
	axis: Coords;
	angleInTurnsAsReference: Reference<number>;

	constructor(axis: Coords, angleInTurnsAsReference: Reference<number>)
	{
		this.axis = axis;
		this.angleInTurnsAsReference = angleInTurnsAsReference;
	}

	static fromAxisAndAngleInTurns
	(
		axis: Coords,
		angleInTurns: number
	): Rotation
	{
		return new Rotation(axis, new Reference(angleInTurns) );
	}

	angleInTurns(): number
	{
		return this.angleInTurnsAsReference.value;
	}

	angleInTurnsSet(value: number): Rotation
	{
		this.angleInTurnsAsReference.set(value);
		return this;
	}

	transformCoords(coordsToTransform: Coords): Coords
	{
		// hack - Assume axis is (0, 0, 1).
		var polar = Polar.create().fromCoords(coordsToTransform);

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
		return new Rotation(this.axis.clone(), this.angleInTurnsAsReference.clone() );
	}

	overwriteWith(other: Rotation): Rotation
	{
		this.axis.overwriteWith(other.axis);
		this.angleInTurnsAsReference.overwriteWith(other.angleInTurnsAsReference);
		return this;
	}
}

}
