
namespace ThisCouldBeBetter.GameFramework
{

export class Effectable extends EntityPropertyBase<Effectable>
{
	effects: Effect[];

	constructor(effects: Effect[])
	{
		super();

		this.effects = effects || new Array<Effect>();
	}

	static create(): Effectable
	{
		return new Effectable([]);
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

	effectsAsVisual(): Visual
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

	// EntityProperty.

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): void
	{
		for (var i = 0; i < this.effects.length; i++)
		{
			var effect = this.effects[i];
			effect.updateForTimerTick(uwpe);
		}
		this.effects = this.effects.filter(x => x.isDone() == false);
	}
}

}
