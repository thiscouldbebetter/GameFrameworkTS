
namespace ThisCouldBeBetter.GameFramework
{

export class Effectable implements EntityProperty<Effectable>
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

	effectsAsVisual(): VisualBase
	{
		var returnValue =
		(
			this.effects.length == 0
			? VisualNone.Instance
			: new VisualGroup(this.effects.map(x => x.visual))
		);
		return returnValue;
	}

	// Clonable.
	clone(): Effectable { throw new Error("Not yet implemented."); }
	overwriteWith(other: Effectable): Effectable { throw new Error("Not yet implemented."); }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i < this.effects.length; i++)
		{
			var effect = this.effects[i];
			effect.updateForTimerTick(uwpe);
		}
		this.effects = this.effects.filter(x => x.isDone() == false);
	}

	// Equatable

	equals(other: Effectable): boolean { return false; } // todo
}

}
