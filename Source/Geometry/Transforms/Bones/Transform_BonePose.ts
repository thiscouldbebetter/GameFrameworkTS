
namespace ThisCouldBeBetter.GameFramework
{

export class Transform_BonePose implements Transform_Interpolatable
{
	boneName: string;
	cyclesToRotateAroundAxesDownRightForward: number[];

	propertyName: string;

	constructor(boneName: string, cyclesToRotateAroundAxesDownRightForward: number[])
	{
		this.boneName = boneName;
		this.cyclesToRotateAroundAxesDownRightForward = cyclesToRotateAroundAxesDownRightForward;

		this.propertyName = this.boneName;
	}

	// instance methods

	clone()
	{
		return new Transform_BonePose
		(
			this.boneName,
			this.cyclesToRotateAroundAxesDownRightForward
		);
	};

	interpolateWith(other: Transform_Interpolatable, fractionOfProgressTowardOther: number): Transform_Interpolatable
	{
		var otherAsBonePose = other as Transform_BonePose;
		var cyclesToRotateAroundAxesDownRightForwardInterpolated = [];

		for (var i = 0; i < this.cyclesToRotateAroundAxesDownRightForward.length; i++)
		{
			var cyclesToRotateInterpolated =
				(1 - fractionOfProgressTowardOther)
				* this.cyclesToRotateAroundAxesDownRightForward[i]
				+ fractionOfProgressTowardOther
				* otherAsBonePose.cyclesToRotateAroundAxesDownRightForward[i];

			cyclesToRotateAroundAxesDownRightForwardInterpolated[i] = cyclesToRotateInterpolated;
		}

		var returnValue = new Transform_BonePose
		(
			this.boneName,
			cyclesToRotateAroundAxesDownRightForwardInterpolated
		);

		return returnValue;
	};

	overwriteWith(other: Transform)
	{
		return this; // todo
	}

	transform(transformableToTransform: Transformable): Transformable
	{
		var skeletonToTransform: any = transformableToTransform;

		var boneToTransform = skeletonToTransform.bonesAllByName.get(this.boneName);
		var boneOrientation = boneToTransform.orientation;

		var axesToRotateAround =
		[
			boneOrientation.down,
			boneOrientation.right,
			boneOrientation.forward,
		];

		var quaternionsForRotation = [];

		for (var i = 0; i < this.cyclesToRotateAroundAxesDownRightForward.length; i++)
		{
			var axisToRotateAround = axesToRotateAround[i];
			var cyclesToRotateAroundAxis = this.cyclesToRotateAroundAxesDownRightForward[i];

			if (cyclesToRotateAroundAxis != 0)
			{
				var quaternionForRotation = Quaternion.fromAxisAndCyclesToRotate
				(
					axisToRotateAround,
					cyclesToRotateAroundAxis
				);

				quaternionsForRotation.push(quaternionForRotation);
			}
		}

		this.transform_Bone(quaternionsForRotation, boneToTransform);

		return transformableToTransform;
	};

	transform_Bone(quaternionsForRotation: Quaternion[], boneToTransform: Bone)
	{
		var axesToTransform = boneToTransform.orientation.axes;

		for (var i = 0; i < quaternionsForRotation.length; i++)
		{
			var quaternionForRotation = quaternionsForRotation[i];
			for (var a = 0; a < axesToTransform.length; a++)
			{
				var axisToTransform = axesToTransform[a];

				quaternionForRotation.transformCoordsAsRotation
				(
					axisToTransform
				);
			}
		}

		for (var i = 0; i < boneToTransform.children.length; i++)
		{
			var childBone = boneToTransform.children[i];
			this.transform_Bone(quaternionsForRotation, childBone);
		}
	};

	transformCoords(coordsToTransform: Coords): Coords
	{
		return null; // todo
	}
}

}
