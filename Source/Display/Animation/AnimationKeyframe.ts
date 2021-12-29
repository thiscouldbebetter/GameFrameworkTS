
namespace ThisCouldBeBetter.GameFramework
{

export class AnimationKeyframe implements Interpolatable<AnimationKeyframe>
{
	frameIndex: number;
	transforms: Transform_Interpolatable[];
	transformsByPropertyName: Map<string, Transform_Interpolatable>;

	constructor(frameIndex: number, transforms: Transform_Interpolatable[])
	{
		this.frameIndex = frameIndex;
		this.transforms = transforms;
		this.transformsByPropertyName = ArrayHelper.addLookups
		(
			this.transforms,
			(x: Transform_Interpolatable) => x.propertyName
		);
	}

	interpolateWith
	(
		other: AnimationKeyframe,
		fractionOfProgressTowardOther: number
	): AnimationKeyframe
	{
		var transformsInterpolated = [];

		for (var i = 0; i < this.transforms.length; i++)
		{
			var transformThis = this.transforms[i];
			var transformOther = other.transformsByPropertyName.get
			(
				transformThis.propertyName
			);

			var transformInterpolated = transformThis.interpolateWith
			(
				transformOther,
				fractionOfProgressTowardOther
			);

			transformsInterpolated.push(transformInterpolated);
		}

		var returnValue = new AnimationKeyframe
		(
			null, // frameIndex
			transformsInterpolated
		);

		return returnValue;
	}
}

}
