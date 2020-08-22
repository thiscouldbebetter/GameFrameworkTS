
class VisualAnimationGroup implements Visual
{
	name: string;
	animations: VisualAnimation[];

	animationsByName: Map<string, VisualAnimation>;

	constructor(name: string, animations: VisualAnimation[])
	{
		this.name = name;
		this.animations = animations;

		this.animationsByName = ArrayHelper.addLookupsByName(this.animations);
	}

	// visual

	animationGetByName(name: string)
	{
		return this.animationsByName.get(name);
	}

	draw(universe: Universe, world: World, place: Place, entity: Entity, display: Display)
	{
		var animatable = entity.drawable().animatable();
		var animationNames = animatable.animationsRunningNames();
		for (var i = 0; i < animationNames.length; i++)
		{
			var animationName = animationNames[i];
			var animation = this.animationsByName.get(animationName);
			animation.draw(universe, world, place, entity, display);
			var tickStarted =
				animatable.animationWithNameStartIfNecessary(name, world);
			if (animation.isComplete(world, tickStarted))
			{
				animatable.animationStopByName(animationName);
			}
		}
	}

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other: Visual): Visual
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply: Transform): Transformable
	{
		return this; // todo
	}
}
