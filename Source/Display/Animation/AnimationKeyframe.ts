
class AnimationKeyframe
{
	constructor(frameIndex, transforms)
	{
		this.frameIndex = frameIndex;
		this.transforms = transforms;
		this.transforms.addLookups( x => x.propertyName );
	}

	interpolateWith(other, fractionOfProgressTowardOther)
	{
		var transformsInterpolated = [];

		for (var i = 0; i < this.transforms.length; i++)
		{
			var transformThis = this.transforms[i];
			var transformOther = other.transforms[transformThis.propertyName];

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
	};
}
