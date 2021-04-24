
namespace ThisCouldBeBetter.GameFramework
{

export class Effectable implements EntityProperty
{
	effects: Effect[];

	constructor(effects: Effect[])
	{
		this.effects = effects || new Array<Effect>();
	}

	effectAdd(effectToAdd: Effect): void
	{
		this.effects.push(effectToAdd);
	}

	effectsAsVisual(): Visual
	{
		var returnValue =
		(
			this.effects.length == 0
			? VisualNone.Instance
			: new VisualGroup(this.effects.map(x => x.visual))
		);
		return returnValue;
	}

	// EntityProperty.

	finalize(u: Universe, w: World, p: Place, e: Entity): void {}
	initialize(u: Universe, w: World, p: Place, e: Entity): void {}

	updateForTimerTick(u: Universe, w: World, p: Place, e: Entity): void
	{
		for (var i = 0; i < this.effects.length; i++)
		{
			var effect = this.effects[i];
			effect.updateForTimerTick(u, w, p, e);
		}
		this.effects = this.effects.filter(x => x.isDone() == false);
	}
}

}
