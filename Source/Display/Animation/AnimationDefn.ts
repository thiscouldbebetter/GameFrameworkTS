
namespace ThisCouldBeBetter.GameFramework
{

export class AnimationDefn
{
	name: string;
	keyframes: AnimationKeyframe[];
	numberOfFramesTotal: number;

	constructor(name: string, keyframes: AnimationKeyframe[])
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
		var propertyNamesAll = new Array<string>();
		var propertyNameLookup = new Map<string, string>();

		for (var f = 0; f < this.keyframes.length; f++)
		{
			var keyframe = this.keyframes[f];
			var transforms = keyframe.transforms;

			for (var t = 0; t < transforms.length; t++)
			{
				var transform = transforms[t];
				var propertyName = transform.propertyName;
				if (propertyNameLookup.get(propertyName) == null)
				{
					propertyNameLookup.set(propertyName, propertyName);
					propertyNamesAll.push(propertyName);
				}
			}
		}

		keyframe = null;
		var keyframePrev = null;

		for (var f = 0; f < this.keyframes.length; f++)
		{
			keyframePrev = keyframe;
			keyframe = this.keyframes[f];

			var transformsByPropertyName = keyframe.transformsByPropertyName;

			for (var p = 0; p < propertyNamesAll.length; p++)
			{
				var propertyName = propertyNamesAll[p];
				if (transformsByPropertyName.get(propertyName) == null)
				{
					var keyframeNext = null;

					for (var g = f + 1; g < this.keyframes.length; g++)
					{
						var keyframeFuture = this.keyframes[g];
						var transformFuture = keyframeFuture.transformsByPropertyName.get(propertyName);
						if (transformFuture != null)
						{
							keyframeNext = keyframeFuture;
							break;
						}
					}

					if (keyframePrev != null && keyframeNext != null)
					{
						var transformPrev = keyframePrev.transformsByPropertyName.get(propertyName);
						var transformNext = keyframeNext.transformsByPropertyName.get(propertyName);

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
						transformsByPropertyName.set(propertyName, transformNew);
						keyframe.transforms.push(transformNew);
					}
				}
			}
		}
	}
}

}
