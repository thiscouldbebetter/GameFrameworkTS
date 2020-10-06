
class Transform_Animate
{
	animationDefn: AnimationDefn;
	ticksSinceStarted: number;

	constructor(animationDefn: AnimationDefn, ticksSinceStarted: number)
	{
		this.animationDefn = animationDefn;
		this.ticksSinceStarted = ticksSinceStarted;
	}

	frameCurrent()
	{
		var returnValue = null;

		var animationDefn = this.animationDefn;

		var framesSinceBeginningOfCycle =
			this.ticksSinceStarted
			% animationDefn.numberOfFramesTotal;

		var i;

		var keyframes = animationDefn.keyframes;
		for (i = keyframes.length - 1; i >= 0; i--)
		{
			keyframe = keyframes[i];

			if (keyframe.frameIndex <= framesSinceBeginningOfCycle)
			{
				break;
			}
		}

		var keyframe = keyframes[i];
		var framesSinceKeyframe =
			framesSinceBeginningOfCycle - keyframe.frameIndex;

		var keyframeNext = keyframes[i + 1];
		var numberOfFrames =
			keyframeNext.frameIndex - keyframe.frameIndex;
		var fractionOfProgressFromKeyframeToNext =
			framesSinceKeyframe / numberOfFrames;

		returnValue = keyframe.interpolateWith
		(
			keyframeNext,
			fractionOfProgressFromKeyframeToNext
		);

		return returnValue;
	}

	overwriteWith(other: Transform_Animate)
	{
		return this; // todo
	}

	transform(transformable: any)
	{
		var frameCurrent = this.frameCurrent();

		var transforms = frameCurrent.transforms;

		for (var i = 0; i < transforms.length; i++)
		{
			var transformToApply = transforms[i];
			transformToApply.transform(transformable);
		}

		return transformable;
	}

	transformCoords(coordsToTransform: Coords)
	{
		return coordsToTransform;
	}
}
