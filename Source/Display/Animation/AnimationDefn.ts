
class AnimationDefn
{
	constructor(name, keyframes)
	{
		this.name = name;
		this.keyframes = keyframes;

		this.numberOfFramesTotal =
			this.keyframes[this.keyframes.length - 1].frameIndex
			- this.keyframes[0].frameIndex;

		this.propagateTransformsToAllKeyframes();
	}

	propagateTransformsToAllKeyframes()
	{
		var propertyNamesAll = [];

		for (var f = 0; f < this.keyframes.length; f++)
		{
			var keyframe = this.keyframes[f];
			var transforms = keyframe.transforms;

			for (var t = 0; t < transforms.length; t++)
			{
				var transform = transforms[t];
				var propertyName = transform.propertyName;
				if (propertyNamesAll[propertyName] == null)
				{
					propertyNamesAll[propertyName] = propertyName;
					propertyNamesAll.push(propertyName);
				}
			}
		}

		var keyframe = null;
		var keyframePrev = null;

		for (var f = 0; f < this.keyframes.length; f++)
		{
			keyframePrev = keyframe;
			keyframe = this.keyframes[f];

			var transforms = keyframe.transforms;

			for (var p = 0; p < propertyNamesAll.length; p++)
			{
				var propertyName = propertyNamesAll[p];
				if (transforms[propertyName] == null)
				{
					var keyframeNext = null;

					for (var g = f + 1; g < this.keyframes.length; g++)
					{
						var keyframeFuture = this.keyframes[g];
						var transformFuture = keyframeFuture.transforms[propertyName];
						if (transformFuture != null)
						{
							keyframeNext = keyframeFuture;
							break;
						}
					}

					if (keyframePrev != null && keyframeNext != null)
					{
						var transformPrev = keyframePrev.transforms[propertyName];
						var transformNext = keyframeNext.transforms[propertyName];

						var numberOfFramesFromPrevToNext =
							keyframeNext.frameIndex
							- keyframePrev.frameIndex;

						var numberOfFramesFromPrevToCurrent =
							keyframe.frameIndex
							- keyframePrev.frameIndex;

						var fractionOfProgressFromPrevToNext =
							numberOfFramesFromPrevToCurrent
							/ numberOfFramesFromPrevToNext;

						var transformNew = transformPrev.interpolateWith
						(
							transformNext,
							fractionOfProgressFromPrevToNext
						);
						transforms[propertyName] = transformNew;
						transforms.push(transformNew);
					}
				}
			}
		}
	};
}
