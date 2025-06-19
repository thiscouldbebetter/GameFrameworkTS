
namespace ThisCouldBeBetter.GameFramework
{

export class Effectable implements EntityProperty<Effectable>
{
	effects: Effect[];

	constructor(effects: Effect[])
	{
		this.effects = effects || new Array<Effect>();
	}

	static default(): Effectable
	{
		return new Effectable([]);
	}

	static of(entity: Entity): Effectable
	{
		return entity.propertyByName(Effectable.name) as Effectable;
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
			: VisualGroup.fromChildren(this.effects.map(x => x.visual))
		);
		return returnValue;
	}

	// Clonable.
	clone(): Effectable { return this; }
	overwriteWith(other: Effectable): Effectable { return this; }

	// EntityProperty.

	finalize(uwpe: UniverseWorldPlaceEntities): void {}
	initialize(uwpe: UniverseWorldPlaceEntities): void {}

	propertyName(): string { return Effectable.name; }

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
