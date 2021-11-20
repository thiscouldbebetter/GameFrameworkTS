
namespace ThisCouldBeBetter.GameFramework
{

export class Effect
{
	name: string;
	ticksPerCycle: number;
	cyclesToLive: number;
	visual: VisualBase;
	_updateForCycle: (uwpe: UniverseWorldPlaceEntities, effect: Effect) => any;

	ticksSoFar: number;

	constructor
	(
		name: string,
		ticksPerCycle: number,
		cyclesToLive: number,
		visual: VisualBase,
		updateForCycle: (uwpe: UniverseWorldPlaceEntities, effect: Effect) => any
	)
	{
		this.name = name;
		this.ticksPerCycle = ticksPerCycle;
		this.cyclesToLive = cyclesToLive;
		this.visual = visual;
		this._updateForCycle = updateForCycle;
		this.ticksSoFar = 0;
	}

	static _instances: Effect_Instances;
	static Instances(): Effect_Instances
	{
		if (Effect._instances == null)
		{
			Effect._instances = new Effect_Instances();
		}
		return Effect._instances;
	}

	isCycleComplete(): boolean
	{
		return (this.ticksSoFar % this.ticksPerCycle == 0);
	}

	isDone(): boolean
	{
		return (this.ticksSoFar >= this.ticksToLive());
	}

	ticksToLive(): number
	{
		return this.ticksPerCycle * this.cyclesToLive;
	}

	updateForTimerTick(uwpe: UniverseWorldPlaceEntities): unknown
	{
		var returnValue = null;

		if (this._updateForCycle != null)
		{
			if (this.isCycleComplete())
			{
				returnValue = this._updateForCycle(uwpe, this);
			}
		}

		this.ticksSoFar++;

		return returnValue;
	}

	// Clonable.

	clone()
	{
		return new Effect
		(
			this.name,
			this.ticksPerCycle,
			this.cyclesToLive,
			this.visual,
			this._updateForCycle
		);
	}
}

class Effect_Instances
{
	Burning: Effect;
	Frozen: Effect;
	Healing: Effect;

	_All: Effect[];
	_AllByName: Map<string, Effect>;

	constructor()
	{
		var visualDimension = 5;
		this.Burning = new Effect
		(
			"Burning",
			20, // ticksPerCycle
			5, // cyclesToLive
			VisualBuilder.Instance().flame(visualDimension),
			(uwpe: UniverseWorldPlaceEntities, effect: Effect) =>
			{
				var damage = Damage.fromAmountAndTypeName(1, "Heat");
				var e = uwpe.entity;
				uwpe.entity2 = e;
				e.killable().damageApply(uwpe, damage );
			}
		);

		this.Frozen = new Effect
		(
			"Frozen",
			20, // ticksPerCycle
			5, // cyclesToLive
			VisualCircle.fromRadiusAndColorFill(visualDimension, Color.byName("Cyan")),
			(uwpe: UniverseWorldPlaceEntities, effect: Effect) =>
			{
				var damage = Damage.fromAmountAndTypeName(1, "Cold");
				var e = uwpe.entity;
				uwpe.entity2 = e;
				e.killable().damageApply(uwpe, damage );
			}
		);

		this.Healing = new Effect
		(
			"Healing",
			40, // ticksPerCycle
			10, // cyclesToLive
			VisualPolygon.fromPathAndColorFill
			(
				new Path
				([
					new Coords(-0.5, -0.2, 0),
					new Coords(-0.2, -0.2, 0),
					new Coords(-0.2, -0.5, 0),
					new Coords(0.2, -0.5, 0),
					new Coords(0.2, -0.2, 0),
					new Coords(0.5, -0.2, 0),
					new Coords(0.5, 0.2, 0),
					new Coords(0.2, 0.2, 0),
					new Coords(0.2, 0.5, 0),
					new Coords(-0.2, 0.5, 0),
					new Coords(-0.2, 0.2, 0),
					new Coords(-0.5, 0.2, 0)
				]).transform
				(
					Transform_Scale.fromScalar(visualDimension * 1.5)
				),
				Color.byName("Red")
			),
			(uwpe: UniverseWorldPlaceEntities, effect: Effect) =>
			{
				var damage = Damage.fromAmountAndTypeName(-1, "Healing");
				var e = uwpe.entity;
				uwpe.entity2 = e;
				e.killable().damageApply(uwpe, damage);
			}
		);

		this._All =
		[
			this.Burning,
			this.Frozen,
			this.Healing
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}

}
