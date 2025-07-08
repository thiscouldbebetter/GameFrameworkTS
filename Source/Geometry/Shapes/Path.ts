
namespace ThisCouldBeBetter.GameFramework
{

export class Path
{
	points: Coords[];

	constructor(points: Coords[])
	{
		this.points = points;
	}

	static arrowOfWidthAndLength
	(
		width: number, length: number
	): Path
	{
		var backOffset = Coords.fromXY(-1, 0).multiplyScalar(length);
		var rightOffset = Coords.fromXY(0, 1).multiplyScalar(width / 2);

		return new Path
		([
			Coords.fromXY(0, 0), // tip
			backOffset.clone().add(rightOffset),
			backOffset.clone().subtract(rightOffset)
		]);
	}

	static default(): Path
	{
		// For rapid prototyping.
		return Path.fromDimension(10);
	}

	static fromDimension(dimension: number): Path
	{
		// For rapid prototyping.
		return new Path
		([
			Coords.fromXY(-1, 0).multiplyScalar(dimension),
			Coords.fromXY(1, 0).multiplyScalar(dimension),
			Coords.fromXY(0, 1).multiplyScalar(dimension),
		]);
	}

	static fromPoints(points: Coords[]): Path
	{
		return new Path(points);
	}

	static fromPointsRelative(pointsRelative: Coords[]): Path
	{
		var offsetSoFar = Coords.zeroes();

		var pointsAbsolute: Coords[] = [];

		for (var i = 1; i < pointsRelative.length; i++)
		{
			var pointRelative = pointsRelative[i];
			offsetSoFar.add(pointRelative);
			var pointAbsolute = offsetSoFar.clone();
			pointsAbsolute.push(pointAbsolute);
		}

		return new Path(pointsAbsolute);
	}

	// Clonable.

	clone(): Path
	{
		return new Path(ArrayHelper.clone(this.points) );
	}

	overwriteWith(other: Path): Path
	{
		ArrayHelper.overwriteWith(this.points, other.points);
		return this;
	}

	// Transformable.

	transform(transformToApply: TransformBase): Path
	{
		Transforms.applyTransformToCoordsMany(transformToApply, this.points);
		return this;
	}
}

}
