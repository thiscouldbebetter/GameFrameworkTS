
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

	// Clonable.

	clone(): AnimationKeyframe
	{
		var transformsCloned = this.transforms.map(x => x.clone() as Transform_Interpolatable) as Transform_Interpolatable[];
		var returnValue = new AnimationKeyframe
		(
			this.frameIndex,
			transformsCloned
		);

		return returnValue;
	}

	overwriteWith(other: AnimationKeyframe): AnimationKeyframe
	{
		this.frameIndex = other.frameIndex;
		this.transforms.forEach((x, i) => x.overwriteWith(other.transforms[i]) );
		return this;
	}

	// Interpolatable.

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

		// todo - Don't instantiate here, clone it in calling scope.
		var returnValue = new AnimationKeyframe
		(
			null, // frameIndex
			transformsInterpolated
		);

		return returnValue;
	}
}

}
